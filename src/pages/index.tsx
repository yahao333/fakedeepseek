// Remove or comment out unused imports
// import Image from "next/image"
// import { GeistSans } from "geist/font/sans"
// import { GeistMono } from "geist/font/mono"

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import ChatMessage from '../components/ChatMessage';
import type { ChatMessage as ChatMessageType } from '../types/chat';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleAddMessage = () => {
    if (!input || !response) return;
    
    const newMessages: ChatMessageType[] = [
      { role: 'user', content: input },
      { role: 'assistant', content: response }
    ];
    
    setMessages([...messages, ...newMessages]);
    setInput('');
    setResponse('');
  };

  const handleExport = async () => {
    if (!chatContainerRef.current || messages.length === 0) return;

    try {
      const canvas = await html2canvas(chatContainerRef.current, {
        width: 1080,
        height: 2412,
        backgroundColor: '#F9FAFB', // 设置背景色为浅灰色
        scale: 2, // 提高导出图片质量
        useCORS: true, // 允许加载跨域图片
      });
      const link = document.createElement('a');
      link.download = 'chat-export.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Fake DeepSeek Chat</h1>
      
      <div className="mb-6 space-y-4">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="输入用户消息"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="输入助手回复"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          rows={4}
        />
        <div className="flex space-x-4">
          <button
            onClick={handleAddMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            添加对话
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            导出图片
          </button>
        </div>
      </div>

      <div ref={chatContainerRef} className="border rounded p-4 bg-white">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
    </div>
  );
}
