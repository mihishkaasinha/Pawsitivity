
import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Image as ImageIcon, Smile, Phone, Video, ChevronLeft, Paperclip, MoreHorizontal, MessageSquare, CheckCheck, UserMinus, BellOff, Info, User, AlertCircle, X, Sparkles } from 'lucide-react';
import { MOCK_MESSAGE_THREADS } from '../constants';
import { MessageThread } from '../types';

interface MessageContent {
  id: number;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

const INITIAL_CHATS: Record<string, MessageContent[]> = {
  't1': [
    { id: 1, sender: 'other', text: 'Hey! Are we still meeting for the playdate today?', time: '10:15 AM' },
    { id: 2, sender: 'me', text: 'Yes, absolutely! 4 PM at the park?', time: '10:20 AM' },
    { id: 3, sender: 'other', text: 'Perfect. See you there!', time: '10:21 AM' },
  ],
  't2': [
    { id: 1, sender: 'other', text: 'Simran: Anyone up for a late walk?', time: 'Yesterday' },
    { id: 2, sender: 'me', text: 'I am down for Cubbon Park!', time: 'Yesterday' },
  ],
  't3': [
    { id: 1, sender: 'other', text: 'The reports look normal, don\'t worry.', time: 'Mon' },
    { id: 2, sender: 'me', text: 'Thank you doctor. Should I continue the same meds?', time: 'Mon' },
  ],
  't4': [
    { id: 1, sender: 'other', text: 'Hello! Your order for Royal Canin is ready for pickup.', time: 'Sunday' },
    { id: 2, sender: 'me', text: 'Great, I will come by this evening.', time: 'Sunday' },
  ]
};

const Messages: React.FC = () => {
  const [threads, setThreads] = useState<MessageThread[]>(MOCK_MESSAGE_THREADS);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(threads[0]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const [allChats, setAllChats] = useState<Record<string, MessageContent[]>>(INITIAL_CHATS);
  const [isTyping, setIsTyping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedThread, allChats, isTyping]);

  const handleThreadSelect = (thread: MessageThread) => {
    setSelectedThread(thread);
    setIsMobileListVisible(false);
    setIsMenuOpen(false);
    
    setThreads(prevThreads => 
      prevThreads.map(t => t.id === thread.id ? { ...t, unread: 0 } : t)
    );
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedThread) return;

    const threadId = selectedThread.id;
    const newMsg: MessageContent = {
      id: Date.now(),
      sender: 'me',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAllChats(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newMsg]
    }));
    setInputMessage('');

    if (selectedThread.type === 'Individual') {
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                const replyMsg: MessageContent = {
                    id: Date.now() + 1,
                    sender: 'other',
                    text: `Thanks for the message! Let me check on that and get back to you. 🐾`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setAllChats(prev => ({
                    ...prev,
                    [threadId]: [...(prev[threadId] || []), replyMsg]
                }));
                setIsTyping(false);
            }, 2000);
        }, 1000);
    }
  };

  const filteredThreads = threads.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.lastMessage && t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeChat = selectedThread ? allChats[selectedThread.id] || [] : [];

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-80px)] flex overflow-hidden bg-white dark:bg-gray-900 border-x border-gray-100 dark:border-gray-800 shadow-2xl rounded-b-[48px] my-2">
      {/* Sidebar */}
      <div className={`${isMobileListVisible ? 'flex' : 'hidden'} md:flex w-full md:w-96 flex-col border-r border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/50`}>
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tight">Messages</h1>
                <div className="w-10 h-10 bg-paws-pink/10 rounded-2xl flex items-center justify-center text-paws-pink shadow-inner"><Sparkles size={20} /></div>
            </div>
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-paws-pink transition-colors" size={18} />
                <input 
                    placeholder="Search conversations..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold dark:text-white shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 focus:ring-4 focus:ring-paws-pink/10 outline-none transition-all"
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 scrollbar-hide">
            {filteredThreads.map(thread => (
                <button 
                    key={thread.id}
                    onClick={() => handleThreadSelect(thread)}
                    className={`w-full flex items-center gap-4 p-5 rounded-[32px] transition-all text-left group
                        ${selectedThread?.id === thread.id 
                            ? 'bg-white dark:bg-gray-800 shadow-xl ring-2 ring-paws-pink/20 scale-[1.02] z-10' 
                            : 'hover:bg-white/80 dark:hover:bg-gray-800/40'}
                    `}
                >
                    <div className="relative shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-paws-indigo to-paws-violet rounded-[24px] flex items-center justify-center font-black text-white shadow-lg overflow-hidden group-hover:rotate-3 transition-transform">
                            {thread.image ? <img src={thread.image} alt={thread.name} className="w-full h-full object-cover" /> : <span className="text-xl">{thread.name.charAt(0)}</span>}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full shadow-lg animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-black text-gray-900 dark:text-white truncate text-base italic">{thread.name}</h3>
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{thread.timestamp}</span>
                        </div>
                        <p className={`text-xs truncate font-bold ${thread.unread > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                            {allChats[thread.id]?.slice(-1)[0]?.text || thread.lastMessage}
                        </p>
                    </div>
                    {thread.unread > 0 && (
                        <div className="bg-paws-pink text-white text-[10px] font-black px-2.5 py-1.5 rounded-full shadow-xl animate-bounce">
                            {thread.unread}
                        </div>
                    )}
                </button>
            ))}
            {filteredThreads.length === 0 && (
              <div className="p-20 text-center opacity-30 italic">
                  <MessageSquare className="mx-auto mb-4 text-gray-300" size={48} />
                  <p className="text-lg font-black">No chats found</p>
              </div>
            )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`${!isMobileListVisible ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-white dark:bg-gray-900 relative`}>
        {selectedThread ? (
            <>
                {/* Chat Header */}
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-5 md:px-10 flex justify-between items-center shadow-sm z-30 border-b border-gray-50 dark:border-gray-800">
                    <div className="flex items-center gap-5">
                        <button onClick={() => setIsMobileListVisible(true)} className="md:hidden p-3 -ml-2 text-gray-500 hover:text-paws-pink hover:bg-gray-50 rounded-2xl transition-all">
                            <ChevronLeft size={28} />
                        </button>
                        <div className="w-14 h-14 bg-gradient-to-br from-paws-pink to-orange-400 text-white rounded-[24px] flex items-center justify-center font-black shadow-xl border-4 border-white dark:border-gray-800">
                            {selectedThread.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="font-black text-gray-900 dark:text-white leading-none mb-1.5 text-lg italic tracking-tight">{selectedThread.name}</h2>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">Active Now</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-4 rounded-[20px] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 hover:text-paws-indigo transition-all hover:scale-110 active:scale-95"><Phone size={22} /></button>
                        <button className="p-4 rounded-[20px] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 hover:text-paws-indigo transition-all hover:scale-110 active:scale-95"><Video size={22} /></button>
                        
                        <div className="relative">
                            <button 
                              onClick={() => setIsMenuOpen(!isMenuOpen)}
                              className={`p-4 rounded-[20px] transition-all ${isMenuOpen ? 'bg-gray-100 dark:bg-gray-700 text-paws-pink' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400'}`}
                            >
                                <MoreHorizontal size={24} />
                            </button>
                            
                            {isMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                                    <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-gray-700 py-4 z-50 animate-fade-in origin-top-right overflow-hidden">
                                        <button className="w-full flex items-center gap-4 px-6 py-4 text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <User size={20} className="text-blue-500" /> View Profile
                                        </button>
                                        <button className="w-full flex items-center gap-4 px-6 py-4 text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <BellOff size={20} className="text-yellow-500" /> Mute Alerts
                                        </button>
                                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-2 mx-4"></div>
                                        <button 
                                          onClick={() => {alert("Contact Blocked 🚫"); setIsMenuOpen(false);}}
                                          className="w-full flex items-center gap-4 px-6 py-4 text-sm font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <UserMinus size={20} /> Block Contact
                                        </button>
                                        <button 
                                          onClick={() => {alert("Report Submitted 🆘"); setIsMenuOpen(false);}}
                                          className="w-full flex items-center gap-4 px-6 py-4 text-sm font-black uppercase tracking-widest text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <AlertCircle size={20} /> Report User
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-50/50 dark:bg-gray-900/30 scrollbar-hide">
                    {activeChat.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] md:max-w-[65%] p-6 rounded-[32px] shadow-sm relative animate-fade-in-down border
                                ${msg.sender === 'me' 
                                    ? 'bg-paws-pink text-white rounded-tr-none border-paws-pink/20 shadow-paws-pink/10' 
                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none border-gray-100 dark:border-gray-700 shadow-gray-200/50 dark:shadow-none'
                                }
                            `}>
                                <p className="text-base md:text-lg leading-relaxed font-bold italic">"{msg.text}"</p>
                                <div className={`flex items-center gap-2 mt-4 opacity-70 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <span className="text-[9px] font-black uppercase tracking-widest">{msg.time}</span>
                                    {msg.sender === 'me' && <CheckCheck size={14} className="text-white" />}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-[24px] rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-paws-pink rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 bg-paws-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-paws-pink rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 md:p-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                    <div className="max-w-4xl mx-auto flex items-center gap-4">
                        <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-2.5 rounded-[32px] flex items-center gap-1 ring-2 ring-gray-100 dark:ring-gray-700 focus-within:ring-paws-pink/20 transition-all shadow-inner">
                            <button 
                                onClick={() => alert("Emoji picker: Feature Coming Soon! 😊")}
                                className="p-4 text-gray-400 hover:text-paws-pink hover:bg-white dark:hover:bg-gray-700 rounded-full transition-all"
                            >
                                <Smile size={28} />
                            </button>
                            <input 
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your message..." 
                                className="flex-1 bg-transparent border-none focus:ring-0 text-base md:text-lg dark:text-white px-4 font-bold placeholder-gray-400 outline-none"
                            />
                            <button className="p-4 text-gray-400 hover:text-paws-indigo hover:bg-white dark:hover:bg-gray-700 rounded-full transition-all hidden sm:block"><Paperclip size={24} /></button>
                            <button className="p-4 text-gray-400 hover:text-paws-indigo hover:bg-white dark:hover:bg-gray-700 rounded-full transition-all"><ImageIcon size={24} /></button>
                        </div>
                        <button 
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim()}
                            className={`p-6 rounded-full shadow-[0_15px_30px_rgba(255,77,141,0.3)] transition-all active:scale-90 disabled:opacity-30 disabled:shadow-none disabled:scale-100
                                ${inputMessage.trim() ? 'bg-paws-pink text-white hover:bg-rose-600 rotate-0' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'}
                            `}
                        >
                            <Send size={28} />
                        </button>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-8 bg-slate-50/20 dark:bg-gray-900/20">
                <div className="w-32 h-32 bg-rose-50 dark:bg-rose-900/20 rounded-[48px] flex items-center justify-center text-paws-pink animate-bounce shadow-inner border border-rose-100 dark:border-rose-800">
                    <MessageSquare size={64} />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-3 italic tracking-tight">Your Inbox is Ready</h3>
                    <p className="text-lg max-w-sm text-gray-500 dark:text-gray-400 font-bold leading-relaxed">Choose a neighbor or group and start sharing pet tips today.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
