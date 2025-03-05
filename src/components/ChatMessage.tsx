import React from 'react';
import { ChatMessage as ChatMessageType } from '../types/chat';

interface Props {
  message: ChatMessageType;
}

const ChatMessage: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] p-3 rounded-lg ${
        isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'
      }`}>
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;