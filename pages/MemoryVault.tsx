import React, { useState, useEffect, useRef } from 'react';
import { Camera, Image as ImageIcon, Plus, Grid, List, Search, X, Send, Bot, Sparkles, User, CloudUpload, MoreHorizontal, Heart, Trash2, Share2, FolderPlus, Download, Printer, AlertCircle, Folder, Clock } from 'lucide-react';
import { generateMemoryAdvice } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface VaultItem {
    id: string;
    url: string;
    type: 'Photo' | 'Video';
    petName: string;
    date: string;
    tags: string[];
}

const MemoryVault: React.FC = () => {
    const [viewMode, setViewMode] = useState<'Grid' | 'List'>('Grid');
    const [items, setItems] = useState<VaultItem[]>([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newAlbumName, setNewAlbumName] = useState('');
    
    // AI Chat State
    const [messages, setMessages] = useState<any[]>([
        { role: 'model', text: "Hi there! 📸 I'm your Memory Vault assistant. I'm here to help you organize, share, and cherish all your precious pet photos and videos.", timestamp: new Date() }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem('memoryVault');
        if (saved) {
            setItems(JSON.parse(saved));
        } else {
            // Initial Mock Data
            const initial = [
                { id: '1', url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400', type: 'Photo', petName: 'Sheru', date: '2024-05-10', tags: ['Park', 'First Walk'] },
                { id: '2', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400', type: 'Photo', petName: 'Mimi', date: '2024-06-01', tags: ['Nap', 'Indoor'] }
            ] as VaultItem[];
            setItems(initial);
            localStorage.setItem('memoryVault', JSON.stringify(initial));
        }
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        const userMsg = { role: 'user', text: chatInput, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsChatLoading(true);

        const response = await generateMemoryAdvice(userMsg.text);
        setMessages(prev => [...prev, { role: 'model', text: response, timestamp: new Date() }]);
        setIsChatLoading(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newItems: VaultItem[] = Array.from(files).map((f: File, i) => ({
            id: Date.now() + i + '',
            url: URL.createObjectURL(f),
            type: (f.type.startsWith('video') ? 'Video' : 'Photo') as 'Photo' | 'Video',
            petName: 'Select Pet',
            date: new Date().toISOString().split('T')[0],
            tags: []
        }));
        const updated = [...newItems, ...items];
        setItems(updated);
        localStorage.setItem('memoryVault', JSON.stringify(updated));
        setIsUploadOpen(false);
    };

    const handleCreateAlbum = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Album "${newAlbumName}" created successfully! 📁`);
        setIsAlbumModalOpen(false);
        setNewAlbumName('');
    };

    const handleDeleteItem = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this memory forever? 🗑️")) {
            const updated = items.filter(item => item.id !== id);
            setItems(updated);
            localStorage.setItem('memoryVault', JSON.stringify(updated));
        }
    };

    const filteredItems = items.filter(i => 
        i.petName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 pb-20 relative min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white italic tracking-tight mb-2 uppercase">Memory Vault 📸</h1>
                    <p className="text-gray-600 dark:text-gray-400 font-bold text-lg">Preserve every pawprint and playdate forever.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button onClick={() => setIsUploadOpen(true)} className="flex-1 md:flex-none bg-paws-pink text-white px-10 py-5 rounded-[28px] font-black shadow-2xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
                        <CloudUpload size={24} /> Upload Memories
                    </button>
                    <button onClick={() => setIsAssistantOpen(true)} className="flex-1 md:flex-none bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 py-5 rounded-[28px] font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
                        <Bot size={24} /> Photo Assistant
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-[48px] shadow-sm border-2 border-gray-200 dark:border-gray-700 mb-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-[450px] group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-paws-pink transition-colors" size={24} />
                        <input 
                            placeholder="Search by pet, tag or date..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-[32px] py-5 pl-14 pr-6 text-base font-bold dark:text-white focus:ring-4 focus:ring-paws-pink/10 shadow-inner"
                        />
                    </div>
                    <div className="flex gap-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-[32px] border border-gray-200 dark:border-gray-600 shadow-inner">
                        <button onClick={() => setViewMode('Grid')} className={`p-4 rounded-[24px] transition-all ${viewMode === 'Grid' ? 'bg-white dark:bg-gray-600 shadow-xl text-paws-pink scale-110' : 'text-gray-400'}`}>
                            <Grid size={24} />
                        </button>
                        <button onClick={() => setViewMode('List')} className={`p-4 rounded-[24px] transition-all ${viewMode === 'List' ? 'bg-white dark:bg-gray-600 shadow-xl text-paws-pink scale-110' : 'text-gray-400'}`}>
                            <List size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {filteredItems.length === 0 ? (
                <div className="py-40 text-center opacity-30 italic">
                    <ImageIcon className="mx-auto mb-6 text-gray-300" size={100} />
                    <p className="text-3xl font-black">Your vault is empty.</p>
                    <p className="text-xl font-bold mt-2">Start by uploading a photo!</p>
                </div>
            ) : (
                <div className={viewMode === 'Grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10" : "space-y-6"}>
                    {filteredItems.map(item => (
                        <div key={item.id} className={`bg-white dark:bg-gray-800 rounded-[56px] overflow-hidden border-2 border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-500 group relative animate-fade-in-down ${viewMode === 'List' ? 'flex items-center p-6 gap-8' : ''}`}>
                            {/* Delete Button - Moved to absolute top right for better visibility and access */}
                            <button 
                                onClick={(e) => handleDeleteItem(e, item.id)} 
                                className="absolute top-8 right-8 z-10 bg-white/90 dark:bg-gray-900/90 text-gray-400 hover:text-red-500 p-4 rounded-2xl backdrop-blur-md shadow-xl border border-white/20 transition-all hover:scale-110 active:scale-95 group/trash"
                                title="Delete Memory"
                            >
                                <Trash2 size={22} className="group-hover/trash:animate-shake" />
                            </button>

                            <div className={`${viewMode === 'Grid' ? 'h-80' : 'w-48 h-48'} relative overflow-hidden shrink-0 rounded-[40px] shadow-sm`}>
                                <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                {item.type === 'Video' && <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"><Sparkles className="text-white animate-pulse" size={32} /></div>}
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-gray-800 border border-white/50">{item.type}</div>
                            </div>
                            <div className={viewMode === 'Grid' ? 'p-10' : 'flex-1'}>
                                <div className="flex justify-between items-start mb-4 pr-12">
                                    <h3 className="font-black text-3xl text-gray-900 dark:text-white italic leading-tight truncate">{item.petName}</h3>
                                </div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6 flex items-center gap-2"><Clock size={12} /> {new Date(item.date).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</p>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {item.tags.map(tag => <span key={tag} className="text-[9px] bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 px-3 py-1.5 rounded-xl font-black uppercase border border-teal-100 dark:border-teal-800">#{tag}</span>)}
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-gray-50 dark:bg-gray-700 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-paws-pink hover:text-white transition-all text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-600 shadow-sm font-black text-[10px] uppercase tracking-widest"><Share2 size={16} /> Share</button>
                                    <button className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-blue-500 hover:text-white transition-all border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm"><Download size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {isUploadOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setIsUploadOpen(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-[56px] w-full max-w-xl p-10 md:p-16 shadow-2xl relative border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setIsUploadOpen(false)} className="absolute top-12 right-12 text-gray-400 hover:text-paws-pink transition-all p-3 hover:bg-gray-50 rounded-full"><X size={32} /></button>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-10 italic uppercase tracking-tighter">Upload Memories</h2>
                        <div className="border-8 border-dashed border-gray-100 dark:border-gray-700 rounded-[48px] p-16 text-center group hover:border-paws-pink/30 hover:bg-gray-50/30 transition-all relative cursor-pointer shadow-inner">
                            <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
                            <div className="w-24 h-24 bg-rose-50 dark:bg-gray-900 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform">
                                <CloudUpload className="text-paws-pink" size={48} />
                            </div>
                            <p className="text-gray-900 dark:text-white font-black text-xl mb-2 italic">Drag & drop files here</p>
                            <p className="text-gray-500 dark:text-gray-400 font-bold">or click to browse from device</p>
                            <div className="mt-10 flex justify-center gap-4">
                                <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-gray-400 shadow-sm">JPG/PNG</div>
                                <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-gray-400 shadow-sm">MP4/MOV</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Album Modal */}
            {isAlbumModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setIsAlbumModalOpen(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-[56px] w-full max-w-md p-10 md:p-12 shadow-2xl relative border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setIsAlbumModalOpen(false)} className="absolute top-10 right-10 text-gray-400 hover:text-paws-pink p-2 rounded-full"><X size={28} /></button>
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-[28px] flex items-center justify-center mb-8 shadow-inner">
                            <Folder size={40} className="text-blue-500" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 italic uppercase tracking-tighter">New Album</h2>
                        <form onSubmit={handleCreateAlbum} className="space-y-6">
                            <input 
                                required
                                value={newAlbumName}
                                onChange={e => setNewAlbumName(e.target.value)}
                                placeholder="Summer Trip 🏖️, First Vet Visit..." 
                                className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-3xl p-6 font-bold dark:text-white focus:ring-4 focus:ring-blue-500/10 shadow-inner text-lg"
                            />
                            <button type="submit" className="w-full bg-blue-500 text-white font-black py-6 rounded-[32px] shadow-2xl hover:bg-blue-600 active:scale-95 transition-all text-sm uppercase tracking-widest border-b-8 border-blue-700">Create Private Album</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Quick Actions Floating Menu */}
            <div className="fixed bottom-10 right-10 flex flex-col gap-6 z-50">
                <button 
                  onClick={() => alert("Printing service: Feature coming to India soon! 🇮🇳✨")}
                  title="Order Prints" 
                  className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center text-paws-pink border-4 border-white dark:border-gray-700 hover:scale-125 transition-all hover:rotate-12 group"
                >
                  <Printer size={32} className="group-hover:animate-bounce" />
                </button>
                <button 
                  onClick={() => setIsAlbumModalOpen(true)}
                  title="Create Album" 
                  className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center text-blue-500 border-4 border-white dark:border-gray-700 hover:scale-125 transition-all hover:-rotate-12 group"
                >
                  <FolderPlus size={32} className="group-hover:animate-pulse" />
                </button>
            </div>
            
            {/* AI Assistant Toggle Button - If sidebar closed */}
            {!isAssistantOpen && (
                <button 
                  onClick={() => setIsAssistantOpen(true)}
                  className="fixed bottom-10 left-10 w-20 h-20 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-4 border-white dark:border-gray-200 z-50 animate-pulse-slow"
                >
                  <Bot size={40} />
                </button>
            )}

            {/* AI Assistant Sidebar */}
            {isAssistantOpen && (
                <div className="fixed inset-y-0 right-0 z-[300] w-full md:w-[500px] bg-white dark:bg-gray-900 shadow-[0_0_100px_rgba(0,0,0,0.3)] flex flex-col border-l border-gray-100 dark:border-gray-700 animate-slide-in-right">
                    <div className="p-8 bg-gradient-to-r from-paws-pink to-teal-600 text-white flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center shadow-2xl border-4 border-white/20">
                                <Bot className="text-paws-pink" size={36} />
                            </div>
                            <div>
                                <h2 className="font-black text-2xl italic leading-none mb-1.5 uppercase tracking-tighter">Vault Guide</h2>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-teal-100 opacity-80">AI Memory Specialist</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsAssistantOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all relative z-10 hover:rotate-90"><X size={32} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/50 dark:bg-gray-900/50 scrollbar-hide">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 shadow-xl ${msg.role === 'user' ? 'bg-white dark:bg-gray-700' : 'bg-paws-pink text-white'}`}>
                                    {msg.role === 'user' ? <User size={24} className="text-gray-500" /> : <Bot size={28} />}
                                </div>
                                <div className={`max-w-[85%] p-6 rounded-[32px] shadow-sm border animate-fade-in-down
                                    ${msg.role === 'user' 
                                        ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-tr-none text-gray-900 dark:text-gray-100' 
                                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-tl-none text-gray-900 dark:text-gray-100'
                                    }
                                `}>
                                    <div className="text-base font-bold italic prose dark:prose-invert prose-p:leading-relaxed">
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                    <span className="text-[9px] font-black uppercase text-gray-400 mt-4 block text-right">Vault AI • {msg.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                             <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-[18px] bg-paws-pink text-white flex items-center justify-center shadow-xl"><Bot size={28} /></div>
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-[32px] rounded-tl-none border border-gray-100 dark:border-gray-700 flex gap-2.5 items-center">
                                    <div className="w-2 h-2 bg-paws-pink rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-2 h-2 bg-paws-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-paws-pink rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                             </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-8 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-[32px] ring-2 ring-gray-100 dark:ring-gray-600 focus-within:ring-paws-pink/10 transition-all shadow-inner">
                            <input 
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                placeholder="How do I share albums?..." 
                                className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-bold dark:text-white px-5 outline-none"
                            />
                            <button onClick={handleSendMessage} className="bg-paws-pink text-white p-5 rounded-[24px] shadow-2xl hover:bg-rose-600 active:scale-90 transition-all"><Send size={24} /></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemoryVault;