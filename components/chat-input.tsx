import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react';
import { Paperclip, Search, Globe, Mic, ArrowUp } from 'lucide-react';

export default function ChatInput() {
   const [inputValue, setInputValue] = useState('');
   
  return (
    <View>
      <Text>Chats</Text>


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0a0f1c] via-[#112344] to-[#0f4c5c] p-4 font-sans text-slate-100">
      
      {/* Main Glass Container */}
      <div className="w-full max-w-3xl relative group">
        
        {/* Glow effects behind the container for depth */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        
        {/* The Card Itself */}
        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-5 shadow-2xl overflow-hidden flex flex-col min-h-[160px]">
          
          {/* Input Area */}
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything..."
            className="w-full bg-transparent text-lg text-white/90 placeholder-white/40 outline-none resize-none h-24 scrollbar-hide font-medium leading-relaxed"
            style={{ minHeight: '80px' }}
          />

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between mt-auto pt-2">
            
            {/* Left Tools */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
              
              {/* Attachment Icon */}
              <button className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition-colors border border-white/5 flex-shrink-0 group/icon">
                <Paperclip size={18} className="group-hover/icon:stroke-white transition-colors" />
              </button>

              {/* Deep Search Pill */}
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-medium text-blue-100/80 transition-all whitespace-nowrap group/btn">
                <Search size={16} className="text-blue-300 group-hover/btn:text-blue-200" />
                <span>Deep search</span>
              </button>

              {/* Web Search Pill */}
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-medium text-blue-100/80 transition-all whitespace-nowrap group/btn">
                <Globe size={16} className="text-blue-300 group-hover/btn:text-blue-200" />
                <span>Search</span>
              </button>
            </div>

            {/* Right Tools */}
            <div className="flex items-center gap-3 pl-2 flex-shrink-0">
              
              {/* Voice Input */}
              <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition-colors border border-white/5 group/mic">
                 {/* Visual waveform simulation using simple bars or just the icon. Using Icon for clean look matching ref. */}
                <div className="relative flex items-center justify-center w-5 h-5">
                   <Mic size={20} className="group-hover/mic:text-white transition-colors" />
                </div>
              </button>

              {/* Send Button */}
              <button 
                className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg shadow-green-900/20 ${
                  inputValue.trim() 
                    ? 'bg-[#4ade80] hover:bg-[#22c55e] text-slate-900' 
                    : 'bg-[#4ade80]/40 text-slate-900/50 cursor-not-allowed'
                }`}
                disabled={!inputValue.trim()}
              >
                <ArrowUp size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        {/* Optional: Footer text to make it look like a full page context */}
        <div className="absolute -bottom-8 left-0 right-0 text-center">
            <p className="text-xs text-white/20 font-light">AI-generated content can be inaccurate.</p>
        </div>
      </div>
    </div>
  

    </View>
  )
}

const styles = StyleSheet.create({})