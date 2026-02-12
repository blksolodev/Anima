import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/GlassCard';
import { Search, Send, Image, Smile, Phone, Video, ChevronLeft, Mail, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { Conversation, Message } from '../../types';

export const Messages: React.FC = () => {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  
  // Listen for Conversations
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'conversations'), where('participantIds', 'array-contains', user.id));
    const unsubscribe = onSnapshot(q, 
        (snapshot) => {
            const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Conversation[];
            setConversations(chats);
            setLoadingChats(false);
        },
        (error) => {
            console.error("Error fetching chats:", error);
            setLoadingChats(false);
        }
    );
    return () => unsubscribe();
  }, [user]);

  // Listen for Messages in Active Chat
  useEffect(() => {
    if (!activeChatId) return;
    const q = query(collection(db, 'conversations', activeChatId, 'messages'), orderBy('sentAt', 'asc'));
    const unsubscribe = onSnapshot(q, 
        (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
            setMessages(msgs);
        },
        (error) => console.error("Error fetching messages", error)
    );
    return () => unsubscribe();
  }, [activeChatId]);

  const sendMessage = async () => {
      if (!activeChatId || !newMessage.trim() || !user) return;
      try {
        await addDoc(collection(db, 'conversations', activeChatId, 'messages'), {
            senderId: user.id,
            content: newMessage,
            sentAt: serverTimestamp()
        });
        setNewMessage('');
      } catch (e) {
        console.error("Error sending message", e);
      }
  };

  const getOtherParticipantId = (chat: Conversation) => {
      return chat.participantIds.find(id => id !== user?.id);
  }

  return (
    <div className="h-[calc(100vh-80px)] lg:h-screen flex flex-col md:flex-row">
      
      {/* Conversation List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/10">
          <h1 className="text-xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]" size={16} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-[#1A1A2E] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[#FF6B35]"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loadingChats ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-[#FF6B35]" /></div>
            ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-[#A0A0B0] px-4 text-center">
                    <MessageSquare className="mb-2 opacity-50" size={32} />
                    <p className="font-medium">No active chats</p>
                    <p className="text-xs mt-1">Visit a profile to start a conversation.</p>
                </div>
            ) : (
                conversations.map((chat) => (
                    <div 
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`p-3 rounded-xl flex gap-3 cursor-pointer transition-colors ${activeChatId === chat.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                        <span className="font-bold">{getOtherParticipantId(chat)?.substring(0,2).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold truncate">User {getOtherParticipantId(chat)?.substring(0,4)}...</span>
                        </div>
                        <div className="flex justify-between items-center">
                        <p className="text-sm text-[#A0A0B0] truncate">{chat.lastMessage || 'Start chatting...'}</p>
                        </div>
                    </div>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col bg-[#0D0D14] ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
        {activeChatId ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0D0D14]/95 backdrop-blur z-10">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveChatId(null)} className="md:hidden text-[#A0A0B0]">
                  <ChevronLeft size={24} />
                </button>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <span className="font-bold text-xs">U</span>
                </div>
                <div>
                  <h2 className="font-bold">Chat</h2>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                  <div className="text-center text-[#6B6B7B] mt-10">
                      <p>No messages yet. Say hello!</p>
                  </div>
              )}
              {messages.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl p-3 ${
                        isMe 
                        ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8A50] text-white rounded-br-none' 
                        : 'bg-[#1A1A2E] text-white rounded-bl-none border border-white/10'
                    }`}>
                        <p>{msg.content}</p>
                    </div>
                    </div>
                  );
              })}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2 items-end bg-[#1A1A2E] p-2 rounded-2xl border border-white/10">
                <textarea 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white resize-none max-h-32 min-h-[44px] py-3"
                  rows={1}
                />
                <Button className="!p-2 !rounded-xl !h-10 !w-10 flex items-center justify-center" onClick={sendMessage}>
                  <Send size={18} className="ml-0.5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#A0A0B0]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Mail size={40} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Select a Conversation</h2>
            <p>Choose a chat from the list to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};