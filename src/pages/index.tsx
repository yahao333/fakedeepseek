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
  const [isLoading, setIsLoading] = useState(false);
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
    if (!input.trim()) {
      alert('请输入用户消息');
      return;
    }
    if (!response.trim()) {
      alert('请输入助手回复');
      return;
    }
    
    const newMessages: ChatMessageType[] = [
      { role: 'user', content: input.trim() },
      { role: 'assistant', content: response.trim() }
    ];
    
    setMessages([...messages, ...newMessages]);
    setInput('');
    setResponse('');
  };

  const handleDeleteMessage = (index: number) => {
    const newMessages = [...messages];
    newMessages.splice(index - (index % 2), 2);
    setMessages(newMessages);
  };

  const handleClearAll = () => {
    if (messages.length === 0) {
      alert('当前没有聊天记录');
      return;
    }
    if (window.confirm('确定要清空所有聊天记录吗？')) {
      setMessages([]);
      setInput('');
      setResponse('');
    }
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
      
      // 移除边框和阴影，设置纯白背景色
      chatClone.style.border = 'none';
      chatClone.style.boxShadow = 'none';
      chatClone.style.backgroundColor = '#ffffff';
      
      // 处理所有子元素的样式
      const elements = chatClone.getElementsByTagName('*');
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i] as HTMLElement;
        const style = window.getComputedStyle(el);
        if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          el.style.backgroundColor = '#ffffff';
        }
        if (style.border) {
          el.style.border = 'none';
        }
        if (style.boxShadow) {
          el.style.boxShadow = 'none';
        }
      }

      // 先获取聊天内容的高度
      const chatCanvas = await html2canvas(chatClone, {
        width: 1080,
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // 计算总高度
      const totalContentHeight = 
        images.top.height + 
        images.title.height + 
        chatCanvas.height + 
        images.mid.height + 
        images.bottom.height;

      // 检查是否超出最大高度
      const maxHeight = 2412; // 最大允许高度
      if (totalContentHeight > maxHeight) {
        throw new Error(`聊天记录太长，超出最大高度限制。
当前高度: ${totalContentHeight}px
最大高度: ${maxHeight}px
请减少聊天内容后重试。`);
      }

      // 创建画布
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = maxHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('无法获取canvas上下文');

      // 绘制顶部图片
      ctx.drawImage(images.top, 0, 0, 1080, images.top.height);
      let currentY = images.top.height;

      // 绘制标题图片
      ctx.drawImage(images.title, 0, currentY, 1080, images.title.height);
      currentY += images.title.height;

      // 绘制聊天内容
      ctx.drawImage(chatCanvas, 0, currentY);
      currentY += chatCanvas.height;

      // 绘制中间图片
      ctx.drawImage(images.mid, 0, currentY, 1080, images.mid.height);
      currentY += images.mid.height;

      // 如果有空白区域，用白色填充
      if (currentY < canvas.height - images.bottom.height) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, currentY, 1080, canvas.height - images.bottom.height - currentY);
        currentY = canvas.height - images.bottom.height;
      }

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
      alert(error instanceof Error ? error.message : '导出图片失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">DeepSeek Chat 记录生成器</h1>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors duration-200"
          >
            清空记录
          </button>
        </div>

        <div className="mb-6 space-y-4 bg-white rounded-lg p-6 shadow-sm">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">用户消息</label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              placeholder="输入用户消息..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">助手回复</label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              placeholder="输入助手回复..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleAddMessage}
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors duration-200 disabled:bg-gray-400"
            >
              添加对话
            </button>
            <button
              onClick={handleExport}
              disabled={isLoading || messages.length === 0}
              className="px-6 py-2.5 bg-[#4B5563] text-white rounded-lg hover:bg-[#374151] transition-colors duration-200 disabled:bg-gray-400"
            >
              {isLoading ? '导出中...' : '导出图片'}
            </button>
          </div>
        </div>

        <div 
          ref={chatContainerRef} 
          className="border border-gray-200 rounded-lg bg-white p-6 shadow-sm min-h-[200px]"
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              暂无聊天记录，请添加对话
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="relative group">
                <ChatMessage message={message} />
                {index % 2 === 1 && (
                  <button
                    onClick={() => handleDeleteMessage(index)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[#EF4444] hover:text-[#DC2626] transition-opacity duration-200"
                  >
                    删除
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
