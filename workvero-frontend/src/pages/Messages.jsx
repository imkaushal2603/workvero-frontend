import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import api from "../services/api";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useSearchParams } from "react-router-dom";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

function Messages() {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [sending, setSending] = useState(false);
    const [myUserId, setMyUserId] = useState(null);
    const [onlineUserIds, setOnlineUserIds] = useState([]);
    const socketRef = useRef(null);
    const messageEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const [searchParams] = useSearchParams();
    const targetConversationId = searchParams.get('conversation');
    const userRole = localStorage.getItem("role");

    const formatTimestamp = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const isYesterday =
            now.getDate() - date.getDate() === 1 &&
            now.getMonth() === date.getMonth() &&
            now.getFullYear() === date.getFullYear();

        if (isYesterday) return "Yesterday";
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    useEffect(() => {
        const socket = io(SOCKET_SERVER_URL);
        socketRef.current = socket;
        socket.on('connect', () => {
            if (myUserId) {
                socket.emit('identify', myUserId);
            }
        });
        socket.on('online_users', (userIds) => {
            setOnlineUserIds(userIds);
        });
        return () => {
            socket.disconnect();
        };
    }, [myUserId]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (socketRef.current?.connected) {
                socketRef.current.emit('request_online_users');
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchMyId = async () => {
            try {
                const endpoint = userRole === 'recruiter' ? '/company/me' : '/candidate/me';
                const res = await api.get(endpoint);
                const id = userRole === 'recruiter' ? res.data?.company?.userId : res.data?.profile?.userId;
                setMyUserId(id);
            } catch (err) {
                console.error('Failed to fetch own user id', err);
            }
        };
        fetchMyId();
    }, [userRole]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await api.get("/messages/conversations", {
                    params: targetConversationId ? { conversationId: targetConversationId } : {}
                });
                const list = res.data?.conversations || [];
                setConversations(list);
                if (targetConversationId) {
                    const found = list.find(c => String(c.id) === String(targetConversationId));
                    if (found) {
                        setActiveConversation(found);
                        return;
                    }
                }
                if (list.length > 0) {
                    setActiveConversation((prev) => prev || list[0]);
                }
            } catch (err) {
                console.error("Failed to fetch conversations", err);
            }
        };
        fetchConversations();
    }, [targetConversationId]);

    useEffect(() => {
        if (!activeConversation) return;
        const fetchMessages = async () => {
            try {
                const res = await api.get(`/messages/conversations/${activeConversation.id}/messages`);
                setMessages(res.data?.messages || []);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };
        fetchMessages();
        socketRef.current.emit("join_conversation", activeConversation.id);
        const handleNewMessage = (message) => {
            if (message.conversationId === activeConversation.id) {
                setMessages((prev) => {
                    const alreadyExists = prev.some(m => m.id === message.id);
                    return alreadyExists ? prev : [...prev, message];
                });
            }
            setConversations((prevList) =>
                prevList.map((conv) => {
                    if (conv.id === message.conversationId) {
                        return {
                            ...conv,
                            messages: [message],
                            updatedAt: message.createdAt || new Date().toISOString()
                        };
                    }
                    return conv;
                })
            );
        };
        socketRef.current.on("new_message", handleNewMessage);
        return () => {
            socketRef.current.off("new_message", handleNewMessage);
        };
    }, [activeConversation]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleEmojiClick = (emojiData) => {
        setNewMessage(prev => prev + emojiData.native);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be under 10MB.');
            e.target.value = '';
            return;
        }
        setSelectedFile(file);
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedFile) || !activeConversation || sending) return;
        setSending(true);
        try {
            let res;
            if (selectedFile) {
                const formData = new FormData();
                if (newMessage.trim()) formData.append('content', newMessage.trim());
                formData.append('attachment', selectedFile);
                res = await api.post(`/messages/conversations/${activeConversation.id}/messages`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                res = await api.post(`/messages/conversations/${activeConversation.id}/messages`, {
                    content: newMessage.trim()
                });
            }
            const savedMsg = res.data?.message;
            setMessages((prev) => {
                const alreadyExists = prev.some(m => m.id === savedMsg.id);
                return alreadyExists ? prev : [...prev, savedMsg];
            });
            setConversations((prevList) =>
                prevList.map((conv) => {
                    if (conv.id === activeConversation.id) {
                        return { ...conv, messages: [savedMsg], updatedAt: savedMsg.createdAt };
                    }
                    return conv;
                })
            );
            setNewMessage("");
            removeSelectedFile();
            setShowEmojiPicker(false);
        } catch (err) {
            console.error("Failed to send message", err);
            alert(err.response?.data?.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const getFileUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
            return path;
        }
        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, "");
        return encodeURI(`${baseUrl}/${path.replace(/^\//, "")}`);
    };

    const isImageFile = (name) => {
        if (!name) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
    };

    const getOtherPartyName = (conv) => {
        if (!conv) return "";
        if (userRole === "recruiter") {
            const profile = conv.candidate?.candidate_profile;
            return profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() : "Candidate";
        }
        return conv.employer?.company_profile?.companyName || "Employer";
    };

    const getOtherPartyLogo = (conv) => {
        if (!conv) return null;
        if (userRole === "recruiter") {
            return conv.candidate?.candidate_profile?.photoUrl;
        }
        return conv.employer?.company_profile?.logo;
    };

    const getOtherPartyUserId = (conv) => {
        if (!conv) return null;
        return userRole === "recruiter" ? conv.candidate?.id : conv.employer?.id;
    };

    const isOtherPartyOnline = (conv) => {
        const otherId = getOtherPartyUserId(conv);
        return otherId != null && onlineUserIds.includes(otherId);
    };

    const executeSearch = () => {
        setSearchQuery(searchInput.trim());
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    };

    const filteredConversations = conversations.filter((conv) =>
        getOtherPartyName(conv).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="messages-page">
            <h2>Messages</h2>
            {conversations.length === 0 ? (
                <div className="no-conversations-card">
                    <p className="no-data">No conversations found.</p>
                </div>
            ) : (
                <div className="messages-layout">
                    <div className="chats-sidebar">
                        <div className="sidebar-header">
                            <h3>Chats</h3>
                            <div className="search-box">
                                <input placeholder="Search Here..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearchKeyDown} />
                                <svg onClick={executeSearch} style={{ cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M9.375 8.25H8.7825L8.5725 8.0475C9.33296 7.16555 9.75089 6.03953 9.75 4.875C9.75 3.91082 9.46409 2.96829 8.92842 2.1666C8.39274 1.36491 7.63137 0.740067 6.74058 0.371089C5.84979 0.00211226 4.86959 -0.094429 3.92394 0.0936739C2.97828 0.281777 2.10964 0.746075 1.42786 1.42786C0.746075 2.10964 0.281777 2.97828 0.0936739 3.92394C-0.094429 4.86959 0.00211226 5.84979 0.371089 6.74058C0.740067 7.63137 1.36491 8.39274 2.1666 8.92842C2.96829 9.46409 3.91082 9.75 4.875 9.75C6.0825 9.75 7.1925 9.3075 8.0475 8.5725L8.25 8.7825V9.375L12 13.1175L13.1175 12L9.375 8.25ZM4.875 8.25C3.0075 8.25 1.5 6.7425 1.5 4.875C1.5 3.0075 3.0075 1.5 4.875 1.5C6.7425 1.5 8.25 3.0075 8.25 4.875C8.25 6.7425 6.7425 8.25 4.875 8.25Z" fill="#696969" />
                                </svg>
                            </div>
                        </div>
                        <div className="chats-list">
                            {filteredConversations.length > 0 ? (
                                filteredConversations.map((conv) => {
                                    const lastMessage = conv.messages?.[0];
                                    const isSelected = activeConversation?.id === conv.id;
                                    const timeDisplay = formatTimestamp(lastMessage?.createdAt || conv.updatedAt);
                                    const lastMessagePreview = lastMessage?.content || (lastMessage?.attachmentName ? `📎 ${lastMessage.attachmentName}` : "No messages yet");
                                    const online = isOtherPartyOnline(conv);
                                    return (
                                        <div key={conv.id} className={`chat-item ${isSelected ? "active" : ""}`} onClick={() => setActiveConversation(conv)}>
                                            <div className={`avatar-wrapper ${userRole === "recruiter" ? "candidate-avatar" : "company-logo"}`}>
                                                {getOtherPartyLogo(conv) ? (
                                                    <img src={getFileUrl(getOtherPartyLogo(conv))} alt={getOtherPartyName(conv)} />
                                                ) : (
                                                    <div className="avatar-placeholder">{getOtherPartyName(conv).charAt(0)}</div>
                                                )}
                                                {online && <span className="online-dot" />}
                                            </div>
                                            <div className="chat-item-details">
                                                <div className="chat-item-header">
                                                    <h4>{getOtherPartyName(conv)}</h4>
                                                    <p>{lastMessagePreview}</p>
                                                </div>
                                                <div className="chat-item-time">
                                                    <span className="chat-time">{timeDisplay}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="no-data">No conversations found.</p>
                            )}
                        </div>
                    </div>
                    <div className="chat-window">
                        {activeConversation ? (
                            <>
                                <div className="chat-window-header">
                                    <div className={`avatar-wrapper ${userRole === "recruiter" ? "candidate-avatar" : "company-logo"}`}>
                                        {getOtherPartyLogo(activeConversation) ? (
                                            <img src={getFileUrl(getOtherPartyLogo(activeConversation))} alt={getOtherPartyName(activeConversation)} />
                                        ) : (
                                            <div className="avatar-placeholder">{getOtherPartyName(activeConversation).charAt(0)}</div>
                                        )}
                                    </div>
                                    <div className="header-info">
                                        <h4>{getOtherPartyName(activeConversation)}</h4>
                                        <span className={`status-indicator ${isOtherPartyOnline(activeConversation) ? 'online' : 'offline'}`}>
                                            {isOtherPartyOnline(activeConversation) ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                </div>
                                <div className="chat-window-messages">
                                    {messages.map((msg) => {
                                        const isMe = msg.sender?.role?.toLowerCase() === userRole?.toLowerCase();
                                        return (
                                            <div key={msg.id} className={`message-group ${isMe ? "me" : "them"}`}>
                                                <div className="message-content">
                                                    <div className="message-bubble-wrapper">
                                                        <div className="message-bubble">
                                                            {msg.content && <p>{msg.content}</p>}
                                                            {msg.attachmentUrl && (
                                                                isImageFile(msg.attachmentName) ? (
                                                                    <a href={getFileUrl(msg.attachmentUrl)} target="_blank" rel="noopener noreferrer">
                                                                        <img src={getFileUrl(msg.attachmentUrl)} alt={msg.attachmentName} className="message-attachment-img" />
                                                                    </a>
                                                                ) : (
                                                                    <a href={getFileUrl(msg.attachmentUrl)} target="_blank" rel="noopener noreferrer" className="message-attachment-file">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 15" fill="none">
                                                                            <path d="M0.75 7.09028L5.9205 1.91903C6.28539 1.55 6.71964 1.25674 7.19826 1.05611C7.67689 0.855489 8.19045 0.751463 8.70943 0.750015C9.2284 0.748568 9.74253 0.849727 10.2223 1.04768C10.702 1.24563 11.1379 1.53646 11.5048 1.90345C11.8718 2.27045 12.1625 2.70636 12.3604 3.18613C12.5583 3.66589 12.6594 4.18004 12.6579 4.69901C12.6564 5.21798 12.5523 5.73154 12.3516 6.21014C12.1509 6.68874 11.8576 7.12294 11.4885 7.48778L5.523 13.454C5.03069 13.9463 4.36298 14.2229 3.66675 14.2229C2.97052 14.2229 2.30281 13.9463 1.8105 13.454C1.31819 12.9617 1.04162 12.294 1.04162 11.5978C1.04162 10.9016 1.31819 10.2338 1.8105 9.74153L7.7775 3.77603C8.02571 3.54067 8.356 3.41151 8.69803 3.41606C9.04006 3.4206 9.3668 3.55849 9.60867 3.80036C9.85054 4.04223 9.98843 4.36898 9.99297 4.711C9.99752 5.05303 9.86836 5.38332 9.633 5.63153L4.46175 10.802" stroke="#0146EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                        <p>{msg.attachmentName}</p>
                                                                    </a>
                                                                )
                                                            )}
                                                        </div>
                                                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messageEndRef} className="scroll-anchor" />
                                </div>
                                <form onSubmit={handleSendMessage} className="chat-window-input">
                                    <div className="emoji-wrapper" ref={emojiPickerRef}>
                                        <button type="button" className="icon-btn" title="Emoji" onClick={() => setShowEmojiPicker(prev => !prev)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                <circle cx="24" cy="24" r="24" fill="#E2EAFF" />
                                                <path d="M24 30.9375C27.8315 30.9375 30.9375 27.8315 30.9375 24C30.9375 20.1685 27.8315 17.0625 24 17.0625C20.1685 17.0625 17.0625 20.1685 17.0625 24C17.0625 27.8315 20.1685 30.9375 24 30.9375Z" stroke="#0146EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M21.75 23.0625C22.2678 23.0625 22.6875 22.6428 22.6875 22.125C22.6875 21.6072 22.2678 21.1875 21.75 21.1875C21.2322 21.1875 20.8125 21.6072 20.8125 22.125C20.8125 22.6428 21.2322 23.0625 21.75 23.0625Z" fill="#0146EE" />
                                                <path d="M26.25 23.0625C26.7678 23.0625 27.1875 22.6428 27.1875 22.125C27.1875 21.6072 26.7678 21.1875 26.25 21.1875C25.7322 21.1875 25.3125 21.6072 25.3125 22.125C25.3125 22.6428 25.7322 23.0625 26.25 23.0625Z" fill="#0146EE" />
                                                <path d="M26.5983 25.6875C26.335 26.1435 25.9563 26.5222 25.5003 26.7855C25.0442 27.0488 24.5269 27.1874 24.0003 27.1874C23.4738 27.1874 22.9565 27.0488 22.5004 26.7855C22.0444 26.5222 21.6657 26.1435 21.4023 25.6875" stroke="#0146EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        {showEmojiPicker && (
                                            <div className="emoji-picker-container">
                                                <Picker data={data} onEmojiSelect={handleEmojiClick} theme="light" previewPosition="none" skinTonePosition="search" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="attachement-wrapper">
                                        <button type="button" className="icon-btn" title="Attach file" onClick={() => fileInputRef.current?.click()}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                <circle cx="24" cy="24" r="24" fill="#E2EAFF" />
                                                <path d="M17.5713 23.2687L22.7418 18.0975C23.1067 17.7285 23.5409 17.4352 24.0196 17.2346C24.4982 17.034 25.0117 16.9299 25.5307 16.9285C26.0497 16.927 26.5638 17.0282 27.0436 17.2261C27.5233 17.4241 27.9592 17.7149 28.3261 18.0819C28.6931 18.4489 28.9838 18.8848 29.1817 19.3646C29.3796 19.8444 29.4807 20.3585 29.4792 20.8775C29.4777 21.3965 29.3736 21.91 29.1729 22.3886C28.9722 22.8672 28.6789 23.3014 28.3098 23.6662L22.3443 29.6325C21.852 30.1248 21.1843 30.4014 20.488 30.4014C19.7918 30.4014 19.1241 30.1248 18.6318 29.6325C18.1395 29.1402 17.8629 28.4725 17.8629 27.7762C17.8629 27.08 18.1395 26.4123 18.6318 25.92L24.5988 19.9545C24.847 19.7191 25.1773 19.59 25.5193 19.5945C25.8613 19.5991 26.1881 19.737 26.43 19.9788C26.6718 20.2207 26.8097 20.5474 26.8143 20.8895C26.8188 21.2315 26.6896 21.5618 26.4543 21.81L21.283 26.9805" stroke="#0146EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileSelect} />
                                    </div>
                                    <input type="text" placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                                    <button type="submit" className="send-btn" disabled={sending}>{sending ? 'Sending...' : 'Send'}</button>
                                    {selectedFile && (
                                        <div className="selected-file-preview">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 15" fill="none">
                                                    <path d="M0.75 7.09028L5.9205 1.91903C6.28539 1.55 6.71964 1.25674 7.19826 1.05611C7.67689 0.855489 8.19045 0.751463 8.70943 0.750015C9.2284 0.748568 9.74253 0.849727 10.2223 1.04768C10.702 1.24563 11.1379 1.53646 11.5048 1.90345C11.8718 2.27045 12.1625 2.70636 12.3604 3.18613C12.5583 3.66589 12.6594 4.18004 12.6579 4.69901C12.6564 5.21798 12.5523 5.73154 12.3516 6.21014C12.1509 6.68874 11.8576 7.12294 11.4885 7.48778L5.523 13.454C5.03069 13.9463 4.36298 14.2229 3.66675 14.2229C2.97052 14.2229 2.30281 13.9463 1.8105 13.454C1.31819 12.9617 1.04162 12.294 1.04162 11.5978C1.04162 10.9016 1.31819 10.2338 1.8105 9.74153L7.7775 3.77603C8.02571 3.54067 8.356 3.41151 8.69803 3.41606C9.04006 3.4206 9.3668 3.55849 9.60867 3.80036C9.85054 4.04223 9.98843 4.36898 9.99297 4.711C9.99752 5.05303 9.86836 5.38332 9.633 5.63153L4.46175 10.802" stroke="#0146EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                {selectedFile.name}
                                            </span>
                                            <button type="button" onClick={removeSelectedFile}>✕</button>
                                        </div>
                                    )}
                                </form>
                            </>
                        ) : (
                            <div className="no-active-chat">
                                <p>Select a conversation to start messaging</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Messages;