import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Share2, X, Send, Filter, MapPin, Loader2, AlertCircle, ChevronDown, Sparkles, TrendingUp, Clock, Navigation, User } from 'lucide-react';
import { MOCK_POSTS } from '../constants';
import { Post, UserProfile, Comment } from '../types';
import { validateContent } from '../services/geminiService';

const EXTENDED_MOCK_POSTS: Post[] = [
  ...MOCK_POSTS,
  {
    id: 'p3',
    author: 'Anita Roy',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    title: 'Happy 1st Birthday Mimi! 🎂',
    content: 'Our Persian princess turns one today. We celebrated with some wet food "cake" and catnip! Time flies so fast.',
    likes: 124,
    comments: [],
    tags: ['Celebrations 🎉', 'CatLovers', 'Birthday'],
    timestamp: '10 mins ago',
    type: 'Photo',
    location: 'Bangalore'
  },
  {
    id: 'p4',
    author: 'Karan Mehra',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    title: 'URGENT: Found a Beagle near Bandra Station',
    content: 'The poor guy looks exhausted. Wearing a red collar but no tag. Currently with me. Please share to find the owner!',
    likes: 56,
    comments: [],
    tags: ['Lost & Found 🆘', 'Bandra', 'Urgent'],
    timestamp: '1 hour ago',
    type: 'Urgent',
    location: 'Mumbai'
  },
  {
    id: 'p5',
    author: 'Dr. Sameer',
    authorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&q=80',
    title: 'Quick Tip: Heatstroke symptoms in dogs',
    content: 'Excessive panting, bright red gums, and lethargy are signs. If you see this, move them to a cool area and use room-temp water on their paws.',
    likes: 210,
    comments: [],
    tags: ['Advice ❓', 'VetTips', 'SummerCare'],
    timestamp: '3 hours ago',
    type: 'Text',
    location: 'Noida'
  }
];

const Community: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState('Hot 🔥');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile>({ name: 'Guest User', email: '', phone: '', city: 'Bangalore', memberType: 'Free', points: 0 });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '', type: 'Text' as any });
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  
  // Comment Section State
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedPosts = localStorage.getItem('communityPosts');
    if (savedPosts) { 
        setPosts(JSON.parse(savedPosts)); 
    } else { 
        setPosts(EXTENDED_MOCK_POSTS); 
        localStorage.setItem('communityPosts', JSON.stringify(EXTENDED_MOCK_POSTS));
    }
    const savedLikes = localStorage.getItem('likedPosts');
    if (savedLikes) setLikedPosts(JSON.parse(savedLikes));
  }, []);

  const handleLike = (postId: string) => {
    const isLiked = likedPosts[postId];
    const newLiked = { ...likedPosts, [postId]: !isLiked };
    setLikedPosts(newLiked);
    localStorage.setItem('likedPosts', JSON.stringify(newLiked));
    const updated = posts.map(p => p.id === postId ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 } : p);
    setPosts(updated);
    localStorage.setItem('communityPosts', JSON.stringify(updated));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setModerationError(null);
    setIsValidating(true);
    const validation = await validateContent(newPost.title, newPost.content);
    if (!validation.isSafe) { setModerationError(validation.reason || "Guideline violation."); setIsValidating(false); return; }
    const tagsArray = newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    const post: Post = { 
      id: Date.now().toString(), 
      author: user.name, 
      authorImage: user.image, 
      title: newPost.title, 
      content: newPost.content, 
      likes: 0, 
      comments: [], 
      tags: tagsArray.length > 0 ? tagsArray : ['General'], 
      timestamp: 'Just now', 
      type: newPost.type,
      location: user.city || 'India'
    };
    const updated = [post, ...posts];
    setPosts(updated);
    localStorage.setItem('communityPosts', JSON.stringify(updated));
    setIsValidating(false); setIsModalOpen(false); setNewPost({ title: '', content: '', tags: '', type: 'Text' });
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!commentInput.trim()) return;
    
    setIsSubmittingComment(true);
    
    // Validate comment content
    const validation = await validateContent("Comment Validation", commentInput);
    if (!validation.isSafe) {
        alert(`Sorry, your comment couldn't be posted: ${validation.reason}`);
        setIsSubmittingComment(false);
        return;
    }

    const newComment: Comment = {
        id: Date.now().toString(),
        author: user.name,
        authorImage: user.image,
        content: commentInput,
        timestamp: 'Just now'
    };

    const updatedPosts = posts.map(p => {
        if (p.id === postId) {
            return {
                ...p,
                comments: [...(p.comments || []), newComment]
            };
        }
        return p;
    });

    setPosts(updatedPosts);
    localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
    setCommentInput('');
    setIsSubmittingComment(false);
  };

  // Filter and Sort Logic
  const filteredPosts = posts.filter(post => {
    if (activeCategory === 'All') return true;
    return post.tags.some(tag => tag.includes(activeCategory.split(' ')[0]));
  }).sort((a, b) => {
    if (activeFilter === 'New ✨') return 0; 
    if (activeFilter === 'Hot 🔥') return b.likes - a.likes;
    if (activeFilter === 'Nearby 📍') return a.location === user.city ? -1 : 1;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8 pb-24">
      {/* Sidebar Categories */}
      <div className="hidden lg:block space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24">
            <h3 className="font-black text-sm uppercase tracking-widest text-gray-400 mb-8 italic">Categories</h3>
            <div className="space-y-3">
                {['All', 'Celebrations 🎉', 'Advice ❓', 'Lost & Found 🆘'].map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setActiveCategory(cat)} 
                        className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-paws-pink text-white shadow-xl scale-105' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent hover:border-gray-100'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="lg:col-span-2 space-y-8">
        {/* Create Post Trigger */}
        <div className="bg-white dark:bg-gray-800 rounded-[32px] p-6 flex gap-4 items-center border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-paws-indigo to-paws-violet shrink-0 flex items-center justify-center text-white font-black overflow-hidden shadow-md">
            {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : user.name.charAt(0)}
          </div>
          <button onClick={() => { setModerationError(null); setIsModalOpen(true); }} className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-400 text-left rounded-2xl px-6 py-4 hover:bg-gray-100 dark:hover:bg-gray-600 font-bold transition-all text-sm italic">
            Share a pet story or ask for advice...
          </button>
        </div>

        {/* Sort Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {[
            { name: 'Hot 🔥', icon: <TrendingUp size={14} /> },
            { name: 'New ✨', icon: <Clock size={14} /> },
            { name: 'Nearby 📍', icon: <Navigation size={14} /> }
          ].map(filter => (
             <button 
                key={filter.name} 
                onClick={() => setActiveFilter(filter.name)} 
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeFilter === filter.name ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl scale-105' : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-paws-pink'}`}
             >
                {filter.icon}
                {filter.name}
             </button>
          ))}
        </div>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center opacity-40 italic">
            <Sparkles size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-black">No posts in this category yet.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-2xl transition-all flex flex-col">
                  <div className="p-8 md:p-10 animate-fade-in-down">
                      <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-paws-pink rounded-2xl flex items-center justify-center font-black text-white shadow-xl overflow-hidden">
                                  {post.authorImage ? <img src={post.authorImage} className="w-full h-full object-cover" /> : post.author.charAt(0)}
                              </div>
                              <div>
                                  <h4 className="font-black text-gray-900 dark:text-white text-base italic leading-tight">{post.author}</h4>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{post.timestamp} • {post.location || 'India'}</p>
                              </div>
                          </div>
                          {post.type === 'Urgent' && (
                            <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse border border-red-200">
                              Urgent 🆘
                            </div>
                          )}
                      </div>
                      
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 italic tracking-tight leading-tight group-hover:text-paws-pink transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-8 font-medium leading-relaxed italic text-lg">
                        "{post.content}"
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-8">
                          {post.tags.map(t => (
                            <span key={t} className="text-[10px] font-black uppercase tracking-widest text-paws-pink bg-paws-pink/5 px-4 py-1.5 rounded-xl border border-paws-pink/10">
                              #{t}
                            </span>
                          ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-8 border-t border-gray-50 dark:border-gray-700">
                        <div className="flex gap-8">
                          <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 transition-all ${likedPosts[post.id] ? 'text-paws-rose scale-110' : 'text-gray-400 hover:text-paws-rose'}`}>
                            <Heart size={22} fill={likedPosts[post.id] ? 'currentColor' : 'none'} />
                            <span className="font-black text-sm">{post.likes}</span>
                          </button>
                          <button onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)} className={`flex items-center gap-2 transition-all ${expandedPostId === post.id ? 'text-teal-600 scale-110' : 'text-gray-400 hover:text-teal-600'}`}>
                            <MessageSquare size={22} />
                            <span className="font-black text-sm">{post.comments?.length || 0}</span>
                          </button>
                        </div>
                        <button className="text-gray-400 hover:text-indigo-500 hover:scale-110 transition-all">
                          <Share2 size={22} />
                        </button>
                      </div>
                  </div>

                  {/* Comments Section */}
                  {expandedPostId === post.id && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-8 md:p-10 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 italic">Discussion ({post.comments?.length || 0})</h4>
                        
                        <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto scrollbar-hide">
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map(comment => (
                                    <div key={comment.id} className="flex gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden flex items-center justify-center text-xs font-black shadow-sm">
                                            {comment.authorImage ? <img src={comment.authorImage} className="w-full h-full object-cover" /> : comment.author.charAt(0)}
                                        </div>
                                        <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-black text-gray-900 dark:text-white italic">{comment.author}</span>
                                                <span className="text-[9px] font-black uppercase text-gray-400">{comment.timestamp}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">"{comment.content}"</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 opacity-30 italic">
                                    <p className="text-sm font-bold">No comments yet. Start the conversation!</p>
                                </div>
                            )}
                        </div>

                        {/* Comment Input */}
                        <div className="flex gap-4 items-end">
                             <div className="w-10 h-10 rounded-xl bg-paws-indigo shrink-0 flex items-center justify-center text-white text-xs font-black overflow-hidden shadow-md">
                                {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                             </div>
                             <div className="flex-1 relative">
                                <textarea 
                                    rows={1}
                                    placeholder="Type your reply..."
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl px-6 py-4 pr-14 text-sm font-bold dark:text-white focus:ring-4 focus:ring-paws-indigo/10 shadow-inner resize-none overflow-hidden"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleCommentSubmit(post.id);
                                        }
                                    }}
                                />
                                <button 
                                    onClick={() => handleCommentSubmit(post.id)}
                                    disabled={!commentInput.trim() || isSubmittingComment}
                                    className="absolute right-3 bottom-3 p-2 bg-paws-indigo text-white rounded-xl shadow-lg hover:bg-paws-pink active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                                >
                                    {isSubmittingComment ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                             </div>
                        </div>
                    </div>
                  )}
              </div>
          ))
        )}
      </div>

      {/* Influencers Sidebar */}
      <div className="hidden lg:block space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24">
              <h3 className="font-black text-xs tracking-widest text-gray-400 uppercase mb-8 italic">Pack Leaders</h3>
              <div className="space-y-6">
                  {[ 
                    {n:'Dr. Sameer', p:450, c:'bg-teal-50 text-teal-600', i: '👨‍⚕️'}, 
                    {n:'Simran K', p:320, c:'bg-blue-50 text-blue-600', i: '😺'},
                    {n:'Anita Roy', p:280, c:'bg-rose-50 text-rose-600', i: '🐶'}
                  ].map((neigh, i) => (
                      <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-2xl transition-all">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-inner group-hover:scale-110 transition-transform ${neigh.c} text-xl`}>
                            {neigh.i}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-gray-900 dark:text-white italic leading-tight truncate">{neigh.n}</p>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{neigh.p} Karma</p>
                          </div>
                      </div>
                  ))}
              </div>
              <button className="w-full mt-8 py-4 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl text-[10px] font-black uppercase text-gray-400 hover:text-paws-pink hover:border-paws-pink/30 transition-all">View Leaderboard</button>
          </div>
      </div>

      {/* CREATE POST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-[48px] w-full max-w-lg p-10 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-700 relative" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white italic">Broadcast Now</h2>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:text-paws-rose transition-all group">
                      <X size={24} className="text-gray-400 group-hover:rotate-90 transition-transform" />
                    </button>
                </div>
                <form onSubmit={handleCreatePost} className="space-y-6">
                    {moderationError && <div className="bg-red-50 p-4 rounded-2xl mb-8 flex gap-3 text-red-600 italic text-xs font-black border border-red-100"><AlertCircle size={18}/> {moderationError}</div>}
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Headline</label>
                        <input required placeholder="Give your story a catchy title" value={newPost.title} onChange={e => {setNewPost({...newPost, title: e.target.value}); setModerationError(null);}} className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-4 focus:ring-paws-pink/20" />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Your Story</label>
                        <textarea required rows={5} placeholder="What's paws-itive today?" value={newPost.content} onChange={e => {setNewPost({...newPost, content: e.target.value}); setModerationError(null);}} className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl p-5 font-bold dark:text-white resize-none focus:ring-4 focus:ring-paws-pink/20" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Tags</label>
                        <input placeholder="e.g. Celebration 🎉, Advice ❓, Health" value={newPost.tags} onChange={e => setNewPost({...newPost, tags: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-4 focus:ring-paws-pink/20" />
                    </div>

                    <button type="submit" disabled={isValidating} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-6 rounded-[32px] shadow-2xl hover:bg-paws-pink hover:text-white transition-all uppercase tracking-widest text-sm disabled:opacity-50 italic">
                        {isValidating ? <><Loader2 className="animate-spin inline mr-2" size={20}/>Scanning for safety...</> : 'Launch Post to Pack'}
                    </button>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;