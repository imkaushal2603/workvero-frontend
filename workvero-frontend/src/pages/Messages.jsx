import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import api from "../services/api";

const SOCKET_SERVER_URL = "http://localhost:3000";

function Messages() {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const socketRef = useRef(null);
    const messageEndRef = useRef(null);

    const userRole = localStorage.getItem('role');

    useEffect(() => {
        socketRef.current = io(SOCKET_SERVER_URL);
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await api.get('/messages/conversations');
                const list = res.data?.conversations || [];
                setConversations(list);
                if (list.length > 0) {
                    setActiveConversation(prev => prev || list[0]);
                }
            } catch (err) {
                console.error('Failed to fetch conversations', err);
            }
        };
        fetchConversations();
    }, []);

    useEffect(() => {
        if (!activeConversation) return;

        const fetchMessages = async () => {
            try {
                const res = await api.get(`/messages/conversations/${activeConversation.id}/messages`);
                setMessages(res.data?.messages || []);
            } catch (err) {
                console.error('Failed to fetch messages', err);
            }
        };
        fetchMessages();

        socketRef.current.emit('join_conversation', activeConversation.id);

        const handleNewMessage = (message) => {
            if (message.conversationId === activeConversation.id) {
                setMessages(prev => [...prev, message]);
            }
        };
        socketRef.current.on('new_message', handleNewMessage);

        return () => {
            socketRef.current.off('new_message', handleNewMessage);
        };
    }, [activeConversation]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;
        try {
            await api.post(`/messages/conversations/${activeConversation.id}/messages`, {
                content: newMessage.trim()
            });
            setNewMessage("");
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    const getFileUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
            return path;
        }
        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
        return encodeURI(`${baseUrl}/${path.replace(/^\//, '')}`);
    };

    const getOtherPartyName = (conv) => {
        if (userRole === 'recruiter') {
            const profile = conv.candidate?.candidate_profile;
            return profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : 'Candidate';
        }
        return conv.employer?.company_profile?.companyName || 'Employer';
    };

    const getOtherPartyLogo = (conv) => {
        if (userRole === 'recruiter') {
            return conv.candidate?.candidate_profile?.photoUrl;
        }
        return conv.employer?.company_profile?.logo;
    };

    return (
        <div className="messages">
            <h2>Messages!</h2>
            <div className="messages_layout">
                <div className="chats_list">
                    <h3>Chats</h3>
                    {conversations.length > 0 ? conversations.map(conv => {
                        const lastMessage = conv.messages?.[0];
                        return (
                            <div
                                key={conv.id}
                                className={`chat_item ${activeConversation?.id === conv.id ? 'active' : ''}`}
                                onClick={() => setActiveConversation(conv)}
                            >
                                <div className="chat_item_img">
                                    {getOtherPartyLogo(conv) ? (
                                        <img src={getFileUrl(getOtherPartyLogo(conv))} alt={getOtherPartyName(conv)} />
                                    ) : (
                                        <div className="avatar-placeholder">{getOtherPartyName(conv).charAt(0)}</div>
                                    )}
                                </div>
                                <div className="chat_item_info">
                                    <h4>{getOtherPartyName(conv)}</h4>
                                    <p>{lastMessage?.content || 'No messages yet'}</p>
                                </div>
                            </div>
                        );
                    }) : <p className="no_data_message">No conversations yet.</p>}
                </div>
                <div className="chat_window">
                    {activeConversation ? (
                        <>
                            <div className="chat_window_header">
                                <div className="chat_item_img">
                                    {getOtherPartyLogo(activeConversation) ? (
                                        <img src={getFileUrl(getOtherPartyLogo(activeConversation))} alt={getOtherPartyName(activeConversation)} />
                                    ) : (
                                        <div className="avatar-placeholder">{getOtherPartyName(activeConversation).charAt(0)}</div>
                                    )}
                                </div>
                                <h4>{getOtherPartyName(activeConversation)}</h4>
                            </div>
                            <div className="chat_window_messages">
                                {messages.map(msg => {
                                    const isMe = msg.sender?.role?.toLowerCase() === userRole;
                                    return (
                                        <div key={msg.id} className={`chat_message ${isMe ? 'me' : 'them'}`}>
                                            <p>{msg.content}</p>
                                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    );
                                })}
                                <div ref={messageEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="chat_window_input">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit">Send</button>
                            </form>
                        </>
                    ) : (
                        <p className="no_data_message">Select a chat to start messaging.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Messages;