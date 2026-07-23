import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import api from "../services/api";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useSearchParams } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

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
    const quickRepliesRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [employerLastReadAt, setEmployerLastReadAt] = useState(null);
    const [candidateLastReadAt, setCandidateLastReadAt] = useState(null);
    const [showHeaderMenu, setShowHeaderMenu] = useState(false);
    const headerMenuRef = useRef(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [interviewDate, setInterviewDate] = useState('');
    const [interviewTime, setInterviewTime] = useState('');
    const [interviewNote, setInterviewNote] = useState('');
    const [scheduling, setScheduling] = useState(false);
    const [interviewDuration, setInterviewDuration] = useState('30');
    const [meetingType, setMeetingType] = useState('virtual');
    const [interviewLocation, setInterviewLocation] = useState('');
    const [ccEmails, setCcEmails] = useState(['']);

    const QUICK_REPLY_TEMPLATES = [
        {
            label: "Thanks for your interest. We've decided to focus on other candidates for now.",
            getValue: (name) => `Thanks for your interest, ${name}. We've decided to focus on other candidates for now.`,
        },
        {
            label: "Thanks for your interest. I'd like to set up an interview. What is your availability?",
            getValue: (name) => `Thanks for your interest, ${name}. I'd like to set up an interview. What is your availability?`,
        },
        {
            label: "I want to confirm you're still interested in this role.",
            getValue: (name) => `Hi ${name}, I want to confirm you're still interested in this role.`,
        },
        {
            label: "Thanks for your application. I'd like to talk about next steps.",
            getValue: (name) => `Thanks for your application, ${name}. I'd like to talk about next steps.`,
        },
        {
            label: "I've reviewed your resume and have some questions. Do you have time to talk?",
            getValue: (name) => `Hi ${name}, I've reviewed your resume and have some questions. Do you have time to talk?`,
        },
    ];

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
        if (!activeConversation) return;
        const interval = setInterval(async () => {
            try {
                const res = await api.get(`/messages/conversations/${activeConversation.id}/messages`);
                setEmployerLastReadAt(res.data?.employerLastReadAt || null);
                setCandidateLastReadAt(res.data?.candidateLastReadAt || null);
            } catch (err) {
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [activeConversation]);

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
                setEmployerLastReadAt(res.data?.employerLastReadAt || null);
                setCandidateLastReadAt(res.data?.candidateLastReadAt || null);
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
                const isFromMe = message.sender?.role?.toLowerCase() === userRole?.toLowerCase();
                if (!isFromMe) {
                    api.get(`/messages/conversations/${activeConversation.id}/messages`).catch(() => { });
                }
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

        const handleReadReceipt = (data) => {
            if (data.conversationId !== activeConversation.id) return;
            if (data.readerRole === "employer") {
                setEmployerLastReadAt(data.readAt);
            } else {
                setCandidateLastReadAt(data.readAt);
            }
        };

        socketRef.current.on("new_message", handleNewMessage);
        socketRef.current.on("read_receipt", handleReadReceipt);
        return () => {
            socketRef.current.off("new_message", handleNewMessage);
            socketRef.current.off("read_receipt", handleReadReceipt);
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
            toast.error(err.response?.data?.message || 'Failed to send message');
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

    const handleQuickReplyClick = (getValueFn) => {
        const candidateName = getOtherPartyName(activeConversation);
        setNewMessage(getValueFn(candidateName));
    };

    const checkScrollButtons = () => {
        const el = quickRepliesRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 2);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    };

    const scrollQuickReplies = (direction) => {
        const el = quickRepliesRef.current;
        if (!el) return;
        el.scrollBy({ left: direction * 220, behavior: "smooth" });
    };

    const isMessageReadByOtherParty = (msg) => {
        const otherPartyLastReadAt = userRole === "recruiter" ? candidateLastReadAt : employerLastReadAt;
        if (!otherPartyLastReadAt) return false;
        return new Date(otherPartyLastReadAt) >= new Date(msg.createdAt);
    };

    useEffect(() => {
        const el = quickRepliesRef.current;
        if (!el) return;
        checkScrollButtons();
        const resizeObserver = new ResizeObserver(() => {
            checkScrollButtons();
        });
        resizeObserver.observe(el);
        el.addEventListener("scroll", checkScrollButtons);
        return () => {
            resizeObserver.disconnect();
            el.removeEventListener("scroll", checkScrollButtons);
        };
    }, [activeConversation]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
                setShowHeaderMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const openScheduleModal = () => {
        setShowHeaderMenu(false);
        setShowScheduleModal(true);
    };

    const closeScheduleModal = () => {
        setShowScheduleModal(false);
        setInterviewDate('');
        setInterviewTime('');
        setInterviewNote('');
        setInterviewDuration('30');
        setMeetingType('virtual');
        setInterviewLocation('');
        setCcEmails(['']);
    };

    const handleCcEmailChange = (index, value) => {
        setCcEmails((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    const addCcEmailField = () => {
        setCcEmails((prev) => [...prev, '']);
    };

    const removeCcEmailField = (index) => {
        setCcEmails((prev) => {
            if (prev.length === 1) return [''];
            return prev.filter((_, i) => i !== index);
        });
    };

    const linkifyText = (text) => {
        if (!text) return null;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="message-link">
                        {part}
                    </a>
                );
            }
            return <React.Fragment key={i}>{part}</React.Fragment>;
        });
    };

    const requestCalendarAccess = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/calendar.events',
        onSuccess: async (tokenResponse) => {
            await submitInterview(tokenResponse.access_token);
        },
        onError: () => {
            toast.error('Google Calendar access denied. Cannot create the Meet link.');
            setScheduling(false);
        },
    });

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        if (!interviewDate || !interviewTime || !activeConversation) return;
        if (meetingType === 'in-person' && !interviewLocation.trim()) {
            toast.error('Please enter a location for the in-person interview.');
            return;
        }

        const invalidCcEmail = ccEmails.find((email) => email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim()));
        if (invalidCcEmail) {
            toast.error(`"${invalidCcEmail}" doesn't look like a valid email address.`);
            return;
        }

        setScheduling(true);

        if (meetingType === 'virtual') {
            requestCalendarAccess();
        } else {
            await submitInterview(null);
        }
    };

    const submitInterview = async (accessToken) => {
        try {
            const candidateName = getOtherPartyName(activeConversation);
            const candidateId = activeConversation.candidate?.id;
            const scheduledAt = new Date(`${interviewDate}T${interviewTime}`);
            const cleanedCcEmails = ccEmails.map((email) => email.trim()).filter((email) => email.length > 0);

            const interviewRes = await api.post('/interviews', {
                conversationId: activeConversation.id,
                candidateId,
                scheduledAt: scheduledAt.toISOString(),
                durationMinutes: parseInt(interviewDuration, 10),
                meetingType,
                location: meetingType === 'in-person' ? interviewLocation : undefined,
                note: interviewNote,
                accessToken,
                ccEmails: cleanedCcEmails,
            });

            const meetLink = interviewRes.data?.interview?.meetLink;

            const formattedDate = new Date(interviewDate).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
            const durationLabel = `${interviewDuration} min`;
            const locationLine = meetingType === 'virtual'
                ? (meetLink ? ` Join here: ${meetLink}` : ' A meeting link will follow shortly.')
                : ` Location: ${interviewLocation}`;

            const messageContent = `Hi ${candidateName}, I'd like to schedule your interview for ${formattedDate} at ${interviewTime} (${durationLabel}, ${meetingType === 'virtual' ? 'Virtual' : 'In-person'}).${locationLine}${interviewNote ? ` ${interviewNote}` : ''} Please confirm if this works for you.`;

            const res = await api.post(`/messages/conversations/${activeConversation.id}/messages`, {
                content: messageContent
            });

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

            toast.success('Interview scheduled successfully!');
            closeScheduleModal();
        } catch (err) {
            console.error("Failed to schedule interview", err);
            toast.error(err.response?.data?.message || 'Failed to schedule interview');
        } finally {
            setScheduling(false);
        }
    };

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
                                        <div className="header_toggle" ref={headerMenuRef}>
                                            <svg onClick={() => setShowHeaderMenu(prev => !prev)} style={{ cursor: "pointer" }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                            {showHeaderMenu && (
                                                <div className="header_toggle_btns">
                                                    <button onClick={openScheduleModal}>Schedule Interview</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="chat-window-messages">
                                    {messages.map((msg) => {
                                        const isMe = msg.sender?.role?.toLowerCase() === userRole?.toLowerCase();
                                        const isRead = isMe && isMessageReadByOtherParty(msg);
                                        return (
                                            <div key={msg.id} className={`message-group ${isMe ? "me" : "them"}`}>
                                                <div className="message-content">
                                                    <div className="message-bubble-wrapper">
                                                        <div className="message-bubble">
                                                            {msg.content && <p>{linkifyText(msg.content)}</p>}
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
                                                        <span className="message-meta">
                                                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                                            {isMe && (
                                                                <span className={`read-ticks ${isRead ? "read" : "unread"}`}>
                                                                    {isRead ? (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" viewBox="0 0 16 10" fill="none">
                                                                            <path d="M1 5L4.5 8.5L9.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                            <path d="M6 5L9.5 8.5L14.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none">
                                                                            <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                    )}
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messageEndRef} className="scroll-anchor" />
                                </div>
                                <form onSubmit={handleSendMessage} className="chat-window-input">
                                    {userRole === 'recruiter' && activeConversation && (
                                        <div className="quick-replies-wrapper">
                                            <h5>Start a conversation</h5>
                                            <div className="quick-replies-list">
                                                <button type="button" className="quick-replies-arrow left" onClick={() => scrollQuickReplies(-1)} disabled={!canScrollLeft}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                                        <path d="M0.234961 5.40002L4.43496 9.67502C4.73496 9.97502 5.18496 9.97502 5.48496 9.67502C5.78496 9.37502 5.78496 8.92502 5.48496 8.62502L1.80996 4.95002L5.48496 1.27502C5.63496 1.12502 5.70996 0.975023 5.70996 0.750023C5.70996 0.300023 5.40996 2.29144e-05 4.95996 2.29538e-05C4.73496 2.29734e-05 4.58496 0.0750228 4.43496 0.225022L0.159961 4.50002C-0.0650391 4.65002 -0.0650386 5.10002 0.234961 5.40002Z" fill="#6C6969" />
                                                    </svg>
                                                </button>
                                                <div className="quick-replies-card" ref={quickRepliesRef}>
                                                    {QUICK_REPLY_TEMPLATES.map((item, idx) => (
                                                        <button key={idx} type="button" className="quick-reply-chip" onClick={() => handleQuickReplyClick(item.getValue)}>{item.label}</button>
                                                    ))}
                                                </div>
                                                <button type="button" className="quick-replies-arrow right" onClick={() => scrollQuickReplies(1)} disabled={!canScrollRight}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                                        <path d="M5.475 4.5L1.275 0.225C0.975 -0.075 0.525 -0.075 0.225 0.225C-0.0749998 0.525 -0.0749998 0.975 0.225 1.275L3.9 4.95L0.225 8.625C0.0750001 8.775 0 8.925 0 9.15C0 9.6 0.3 9.9 0.75 9.9C0.975 9.9 1.125 9.825 1.275 9.675L5.55 5.4C5.775 5.25 5.775 4.8 5.475 4.5Z" fill="#6C6969" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
            {showScheduleModal && (
                <div className="modal-overlay" onClick={closeScheduleModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Schedule Interview</h3>
                            <button type="button" className="modal-close" onClick={closeScheduleModal}>✕</button>
                        </div>
                        <form onSubmit={handleScheduleSubmit} className="modal-body">
                            <div className="form_fields">
                                <div className="form_fielset">
                                    <div className="form_field">
                                        <label htmlFor="interviewDate">Date<span>*</span></label>
                                        <input id="interviewDate" type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                                    </div>
                                    <div className="form_field">
                                        <label htmlFor="interviewTime">Time<span>*</span></label>
                                        <input id="interviewTime" type="time" value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)} required
                                        />
                                    </div>
                                </div>
                                <div className="form_fielset">
                                    <div className="form_field">
                                        <label htmlFor="interviewDuration">Duration<span>*</span></label>
                                        <div className="form_select_field">
                                            <select id="interviewDuration" value={interviewDuration} onChange={(e) => setInterviewDuration(e.target.value)} required>
                                                <option value="15">15 min</option>
                                                <option value="30">30 min</option>
                                                <option value="45">45 min</option>
                                                <option value="60">1 hour</option>
                                                <option value="90">1.5 hours</option>
                                            </select>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                                        </div>
                                    </div>
                                    <div className="form_field">
                                        <label htmlFor="meetingType">Meeting Type<span>*</span></label>
                                        <div className="form_select_field">
                                            <select id="meetingType" value={meetingType} onChange={(e) => setMeetingType(e.target.value)} required>
                                                <option value="virtual">Virtual</option>
                                                <option value="in-person">In-Person</option>
                                            </select>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                {meetingType === 'in-person' && (
                                    <div className="form_full">
                                        <div className="form_field">
                                            <label htmlFor="interviewLocation">Location<span>*</span></label>
                                            <input id="interviewLocation" type="text" value={interviewLocation} onChange={(e) => setInterviewLocation(e.target.value)} placeholder="e.g. 123 Main St, Suite 400, or office name" required />
                                        </div>
                                    </div>
                                )}
                                <div className="form_full">
                                    <label>CC (optional)</label>
                                    <div className="form_field_cc">
                                        {ccEmails.map((email, idx) => {
                                            const isFirst = idx === 0;
                                            return (
                                                <div className="cc-email-row" key={idx}>
                                                    <input type="email" value={email} onChange={(e) => handleCcEmailChange(idx, e.target.value)} placeholder="e.g. hiring-manager@company.com" />
                                                    {!isFirst && (
                                                        <button type="button" className="cc-toggle-btn remove" onClick={() => removeCcEmailField(idx)} title="Remove">−</button>
                                                    )}
                                                    {isFirst && (
                                                        <button type="button" className="cc-toggle-btn add" onClick={addCcEmailField} title="Add another">+</button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="form_full">
                                    <div className="modal-field">
                                        <label htmlFor="interviewNote">Additional Note (optional)</label>
                                        <textarea id="interviewNote" value={interviewNote} onChange={(e) => setInterviewNote(e.target.value)} placeholder="e.g. This will be a video call, link to follow." rows={3} />
                                    </div>
                                </div>
                            </div>
                            <div className="form_buttons">
                                <button type="button" className="cancel-btn" onClick={closeScheduleModal}>Cancel</button>
                                <button type="submit" className="submit-btn" disabled={scheduling}>{scheduling ? 'Sending...' : 'Send Invite'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Messages;