import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`mb-4 ${isUser ? 'pl-4' : 'pl-4'}`}>
      <div className="mb-2 text-sm font-medium" style={{ color: '#6B7280' }}>
        {isUser ? '用户' : '助手'}
      </div>
      <div style={{ color: '#111827' }} className="whitespace-pre-wrap">
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;