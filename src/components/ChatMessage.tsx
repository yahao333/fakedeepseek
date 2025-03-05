import React, { useEffect, useRef, useState } from 'react';
import type { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const contentRef = useRef<HTMLDivElement>(null);
  const [marginLeft, setMarginLeft] = useState(isUser ? '100px' : '0');
  const [bgWidth, setBgWidth] = useState('auto');

  useEffect(() => {
    if (contentRef.current) {
      const textWidth = contentRef.current.scrollWidth;
      console.log('textWidth:', textWidth);
      const fontSize = 22;
      const containerWidth = 380;
      
      if (isUser) {
        // 如果文本内容不足一行
        if (textWidth < containerWidth) {
          // 计算剩余空间并设置左边距
          const remainingSpace = containerWidth - textWidth - 12;
          setMarginLeft(`${remainingSpace + 100}px`);
          setBgWidth(`${textWidth + 32}px`); // 32px 为左右padding的总和
        } else {
          // 如果文本超过一行，使用默认值
          setMarginLeft('100px');
          setBgWidth('auto');
        }
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
              width: isUser ? bgWidth : 'auto',
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
              marginLeft: marginLeft
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