// src\components\chat\FloatingAIChat.jsx
import { useState, useEffect } from "react";
import { ChatBubbleLeftRightIcon, XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { ChatBubbleLeftRightIcon as ChatSolid } from "@heroicons/react/24/solid";
import Chat from "../../pages/chat/Chat";
import { useAuth } from "../../contexts/AuthContext";

export default function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Listen for open event from other components
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };

    window.addEventListener('openFloatingAIChat', handleOpenChat);
    
    return () => {
      window.removeEventListener('openFloatingAIChat', handleOpenChat);
    };
  }, []);

  // Don't show if user is not logged in
  if (!user) return null;

  return (
    <>
      {/* Floating Button - Fixed at bottom-right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatSolid className="h-6 w-6" />
        )}
        {/* Animated notification dot */}
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 animate-pulse border-2 border-white"></span>
        
        {/* Tooltip on hover */}
        <div className="absolute right-16 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs py-2 px-3 rounded-lg whitespace-nowrap">
            AI Assistant
          </div>
          <div className="absolute top-2.5 right-[-6px] border-4 border-transparent border-l-gray-900"></div>
        </div>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-end p-4 pointer-events-none sm:items-center sm:justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Window */}
          <div className="relative w-full max-w-4xl h-[80vh] max-h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5" />
                <h3 className="font-semibold">AI Assistant</h3>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  Beta
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Chat Content */}
            <div className="h-[calc(100%-60px)]">
              <Chat isFloating={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}