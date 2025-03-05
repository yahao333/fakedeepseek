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
      // 临时创建一个克隆节点用于导出
      const cloneContainer = chatContainerRef.current.cloneNode(true) as HTMLElement;
      document.body.appendChild(cloneContainer);
      
      // 设置克隆节点的样式
      cloneContainer.style.position = 'absolute';
      cloneContainer.style.left = '-9999px';
      cloneContainer.style.width = '1080px';  // 设置固定宽度
      
      // 确保使用兼容的颜色格式
      const elements = cloneContainer.getElementsByTagName('*');
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i] as HTMLElement;
        const style = window.getComputedStyle(el);
        if (style.backgroundColor.includes('oklch')) {
          el.style.backgroundColor = '#ffffff';  // 替换为兼容的颜色
        }
      }

      const canvas = await html2canvas(cloneContainer, {
        width: 1080,
        height: 2412,
        backgroundColor: '#F9FAFB',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // 清理临时节点
      document.body.removeChild(cloneContainer);

      // 下载图片
      const link = document.createElement('a');
      link.download = 'deepseek-chat.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出图片失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">DeepSeek Chat 记录生成器</h1>
        
        <div className="mb-6 space-y-4 bg-white rounded-lg p-6 shadow-sm">
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入用户消息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
          />
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入助手回复..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={4}
          />
          <div className="flex space-x-4">
            <button
              onClick={handleAddMessage}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              添加对话
            </button>
            <button
              onClick={handleExport}
              className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              导出图片
            </button>
          </div>
        </div>

        <div 
          ref={chatContainerRef} 
          className="border rounded-lg bg-white p-6 shadow-sm min-h-[200px]"
        >
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
      </div>
    </div>
  );
}
