import React, { useEffect, useRef, useState } from 'react';
import type { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const contentRef = useRef<HTMLDivElement>(null);
  const [marginLeft, setMarginLeft] = useState(isUser ? '100px' : '0');

  useEffect(() => {
    if (isUser && contentRef.current) {
      const containerWidth = 380; // 最大宽度
      const textWidth = contentRef.current.scrollWidth;
      console.log('textWidth:', textWidth);
      const fontSize = 22; // 字体大小
      const charsPerLine = Math.floor(containerWidth / (fontSize * 0.75)); // 估算每行字符数
      
      // 如果文本内容不足一行
      if (textWidth < containerWidth) {
        // 计算剩余空间并设置左边距
        const remainingSpace = containerWidth - textWidth - 12;
        setMarginLeft(`${remainingSpace + 100}px`);
      } else {
        // 如果文本超过一行，使用默认左边距
        setMarginLeft('100px');
      }
    }
  }, [message.content, isUser]);

  return (
    <div className={`chat-message ${message.role}`}>
      <div className={`flex items-start ${isUser ? '' : ''}`}>
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
            className={`absolute -z-10 ${isUser ? 'chat-bg-layer' : ''}`}
            style={{
              bottom: '10px',
              left: '80px',
              right: '10px',
              height: '100%',
              borderRadius: '32px',
              padding: '16px'
            }}
          />
          <div 
            ref={contentRef}
            className="whitespace-pre-wrap" 
            style={{ 
              color: '#111827', 
              fontSize: '22px', 
              textAlign: 'left',
              maxWidth: isUser ? '380px' : '400px',
              overflowWrap: 'break-word',
              paddingRight: isUser ? '10px' : '0',
              marginBottom: isUser ? '40px' : '0',
              marginRight: isUser ? '0' : '0',
              marginLeft: marginLeft // 使用计算后的 marginLeft
            }}
          >
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;