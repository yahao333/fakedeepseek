# fakedeepseek
一个用于导出自定义 deepseek 的App聊天记录的web网站服务

## 技术要求
1. 框架：使用 Next.js 作为开发框架。
2. 编程语言：代码主要使用 TypeScript 编写。
3. 样式：使用 Tailwind CSS 进行样式设计。
4. 代码质量：使用 ESLint 检查代码，确保风格一致。
5. 项目结构：所有源代码存放在 src 目录下。
6. 导出图片的尺寸是在 1080  x 2412 像素。

## 功能要求
- 输入聊天记录: 用户可以通过输入deepseek的聊天记录和回答记录来进行测试。
- 导出图片：网站必须支持生成并导出图片的功能。

## 部署要求
- 部署平台：使用 Vercel 进行网站部署。

## 限制
- 不使用 App Router：避免使用 Next.js 的 App Router 特性。
- 不使用 Turbopack：避免使用 Turbopack 进行打包。

## 额外指导
- 配置 Next.js 项目时，确保正确集成 TypeScript 和 ESLint。
- 设置 Tailwind CSS，并验证样式在项目中正常应用。
- 实现导出图片功能，可考虑使用 HTML5 Canvas 或相关第三方库。
- 在部署到 Vercel 前，充分测试所有功能，确保无误。
