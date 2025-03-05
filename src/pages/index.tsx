// Remove or comment out unused imports
// import Image from "next/image"
// import { GeistSans } from "geist/font/sans"
// import { GeistMono } from "geist/font/mono"

import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import ChatMessage from '../components/ChatMessage';
import type { ChatMessage as ChatMessageType } from '../types/chat';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<{
    top: HTMLImageElement | null;
    title: HTMLImageElement | null;
    mid: HTMLImageElement | null;
    bottom: HTMLImageElement | null;
  }>({ top: null, title: null, mid: null, bottom: null });

  useEffect(() => {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src.startsWith('/') ? src : `/${src}`;
      });
    };

    Promise.all([
      loadImage('images/top.png'),
      loadImage('images/title.png'),
      loadImage('images/mid.png'),
      loadImage('images/bottom.png'),
    ]).then(([top, title, mid, bottom]) => {
      setImages({ top, title, mid, bottom });
    }).catch(error => {
      console.error('图片加载失败:', error);
    });
  }, []);

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
    if (!chatContainerRef.current || messages.length === 0 || 
        !images.top || !images.title || !images.mid || !images.bottom) return;

    try {
      // 创建临时容器
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '1080px';
      document.body.appendChild(tempContainer);

      // 克隆并处理聊天内容
      const chatClone = chatContainerRef.current.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(chatClone);
      
      // 移除边框和阴影，设置背景色
      chatClone.style.border = 'none';
      chatClone.style.boxShadow = 'none';
      chatClone.style.backgroundColor = '#F9FAFB';
      
      // 处理所有子元素的样式
      const elements = chatClone.getElementsByTagName('*');
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i] as HTMLElement;
        const style = window.getComputedStyle(el);
        // 处理颜色兼容性
        if (style.backgroundColor.includes('oklch')) {
          el.style.backgroundColor = '#ffffff';
        }
        // 移除边框和阴影
        if (style.border) {
          el.style.border = 'none';
        }
        if (style.boxShadow) {
          el.style.boxShadow = 'none';
        }
      }

      // 创建画布
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 2412;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('无法获取canvas上下文');

      // 绘制顶部图片
      ctx.drawImage(images.top, 0, 0, 1080, images.top.height);
      let currentY = images.top.height;

      // 绘制标题图片
      ctx.drawImage(images.title, 0, currentY, 1080, images.title.height);
      currentY += images.title.height;

      // 绘制聊天内容
      const chatCanvas = await html2canvas(chatClone, {
        width: 1080,
        backgroundColor: '#F9FAFB',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      ctx.drawImage(chatCanvas, 0, currentY);
      currentY += chatCanvas.height;

      // 绘制中间图片
      ctx.drawImage(images.mid, 0, currentY, 1080, images.mid.height);
      currentY += images.mid.height;

      // 绘制底部图片
      ctx.drawImage(images.bottom, 0, currentY, 1080, images.bottom.height);

      // 清理临时元素
      document.body.removeChild(tempContainer);

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
            {/* 添加测试图片 */}
        {/* <img src="/images/buttom.png" alt="test" style={{ width: 100 }} /> */}

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
