import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { generatePetAdvice } from '../services/geminiService';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Namaste! I'm Paw-AI 🐕. I can help you with diet charts, health tips for Indian weather, or training advice. What's on your mind?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await generatePetAdvice(userMsg.text);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Custom styling components for Markdown rendering
  const MarkdownComponents = {
    p: (props: any) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
    li: (props: any) => <li className="pl-1" {...props} />,
    h1: (props: any) => <h1 className="text-lg font-bold mb-2 mt-4 text-paws-purple dark:text-teal-400" {...props} />,
    h2: (props: any) => <h2 className="text-base font-bold mb-2 mt-3 text-paws-purple dark:text-teal-400" {...props} />,
    h3: (props: any) => <h3 className="text-sm font-bold mb-1 mt-2" {...props} />,
    strong: (props: any) => <span className="font-bold text-gray-900 dark:text-white" {...props} />,
    blockquote: (props: any) => <blockquote className="border-l-4 border-paws-pink pl-4 italic opacity-80 my-2" {...props} />,
    a: (props: any) => <a className="text-paws-blue underline hover:text-paws-pink" target="_blank" rel="noopener noreferrer" {...props} />,
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header - Enhanced Visibility */}
      <div className="bg-gradient-to-r from-paws-pink to-teal-600 text-white p-6 shadow-md flex items-center justify-between z-10 relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white p-3 rounded-full shadow-lg border-4 border-white/20">
            <Bot size={32} className="text-paws-pink" />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl tracking-tight flex items-center gap-2">
                Paw-AI Assistant
                <Sparkles size={20} className="text-yellow-300 animate-pulse" />
            </h1>
            <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400 border-2 border-teal-600"></span>
                </span>
                <p className="text-sm font-medium text-teal-100">Online • Powered by Gemini</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm
              ${msg.role === 'user' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-paws-pink text-white'}`}
            >
              {msg.role === 'user' ? <User size={20} className="text-gray-600 dark:text-gray-300" /> : <Bot size={24} />}
            </div>
            
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-4 shadow-sm border
              ${msg.role === 'user' 
                ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-100 dark:border-gray-700 rounded-tr-none' 
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-100 dark:border-gray-700 rounded-tl-none'}`}
            >
              <div className="prose dark:prose-invert prose-sm max-w-none">
                 <ReactMarkdown components={MarkdownComponents}>
                    {msg.text}
                 </ReactMarkdown>
              </div>
              <span className="text-[10px] text-gray-400 block mt-2 text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                 <div className="w-10 h-10 rounded-full bg-paws-pink text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Bot size={24} />
                 </div>
                 <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-paws-pink rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-paws-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-paws-pink rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto relative flex items-center gap-2">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about diet, symptoms, or behavior..."
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-2xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-paws-pink resize-none shadow-inner"
                rows={1}
                style={{ minHeight: '60px', maxHeight: '120px' }}
            />
            <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-paws-pink text-white rounded-xl hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
                <Send size={20} />
            </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
            AI can make mistakes. Always consult a real vet for medical emergencies.
        </p>
      </div>
    </div>
  );
};

export default AIChat;