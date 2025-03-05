import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`chat-message ${message.role}`}>
      <div className="flex items-start">
        {message.role === 'assistant' && (
          <img 
            src="/images/whale.png" 
            alt="Whale" 
            className="inline-block" 
            style={{ width: '46px', height: '46px', marginTop: '10px', marginRight: '16px' }}
          />
        )}
        <div className="relative">
          {/* 用户消息的椭圆背景 */}
          <div
            className="absolute -z-10"
            style={{
              bottom: '-10px',
              left: '-10px',
              right: '-10px',
              height: '100%',
              background: '#F3F4F6',
              borderRadius: '16px',
              padding: '16px'
            }}
          />
          <div className="whitespace-pre-wrap" style={{ color: '#111827', fontSize: '22px' }}>
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;