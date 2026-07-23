[English](https://github.com/pileax-ai/pileax) | **简体中文**

<h1 align="center">PileaX</h1>
<p align="center">PileaX AI: 一站式 AI 知识库 🍀</p>

<p align="center">
  <a href="https://github.com/pileax-ai/pileax/actions/workflows/ci.yml" alt="Build Status">
    <img src="https://github.com/pileax-ai/pileax/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="https://github.com/pileax-ai/pileax/releases/latest">
    <img src="https://img.shields.io/github/v/release/pileax-ai/pileax" alt="Latest Release"></a>
  <a href="https://github.com/pileax-ai/pileax/releases">
    <img src="https://img.shields.io/github/downloads/pileax-ai/pileax/total" alt="Downloads"></a>
  <a href="https://github.com/badges/shields/pulse" alt="Activity">
    <img src="https://img.shields.io/github/commit-activity/m/pileax-ai/pileax" /></a>
  <a href="https://github.com/pileax-ai/pileax/blob/main/LICENSE" alt="License">
    <img src="https://img.shields.io/badge/license-MIT-green?style=square" /></a>
</p>

<p align="center">
  <a href="https://github.com/pileax-ai/pileax#platform-support">
    <img src="https://img.shields.io/badge/平台-Windows%20%7C%20macOS%20%7C%20Linux-blue" alt="Platforms"></a>
  <a href="https://github.com/pileax-ai/pileax#supported-formats">
    <img src="https://img.shields.io/badge/电子书-EPUB%20%7C%20MOBI%20%7C%20AWZ3%20%7C%20FB2%20%7C%20CBZ%20%7C%20PDF-teal" alt="Supported Formats"></a>
</p>

PileaX 是一款本地优先的一站式 AI 知识库，集 AI 对话、智能笔记、电子书阅读和管理于一体。从知识的生产到应用，PileaX 帮助您建立统一的知识库，利用 AI 智能体技术不断优化 AI 交互体验。数据完全由您掌控，支持离线使用的桌面应用和灵活部署的 Web 应用。

## 预览

### 主界面
![Screenshot](https://pileax.ai/screenshots/main.gif)

### 阅读器

#### 书架
![Screenshot](https://pileax.ai/images/zh/reading/bookshelf.webp)

#### 阅读视频
![Screenshot](https://pileax.ai/images/zh/reading/reader-vertical.webp)
![Screenshot](https://pileax.ai/images/zh/reading/reader-horizontal.webp)

#### 目录、书签、高亮、注释和AI
![Screenshot](https://pileax.ai/images/zh/reading/reader.webp)

#### 更多
![Screenshot](https://pileax.ai/screenshots/reader.gif)

## 特性

🚀 **AI 对话**：您的AI助手，随时解答疑惑并完成各种任务 <br/>
📝 **笔记**：沉淀奇思妙想，让碎片的灵感在 AI 辅助下构筑成体系 <br/>
🤖 **阅读**：打造个人图书馆，畅享 AI 智慧阅读 <br/>
🌗 支持浅色、深色模式 <br/>
🆓 MIT 许可 <br/>

## 文档

- [快速开始](https://pileax.ai/zh/guide/getting-started)
- [下载](https://pileax.ai/zh/download)

如需更详细的信息，请务必查看我们的[文档](https://pileax.ai/zh)。如果您在使用过程中遇到任何问题或有改进建议，欢迎提交 [issue](https://github.com/pileax-ai/pileax/issues/new/choose)。

### 桌面应用
前往 [下载页面](https://pileax.ai/download) 或 [release](https://github.com/pileax-ai/pileax/releases) 下载桌面应用。

### Docker Compose
```bash
cd docker
cp backend.env.example backend.env

# 启动
docker compose up -d

# 停止
docker compose down
```
然后，打开 http://localhost:9610 开始。

## 贡献
如果您希望贡献代码，请参阅我们的[贡献指南](CONTRIBUTING.md)。我们欢迎所有贡献，并将对贡献者给予完整署名。

### 社区
- [GitHub Issues](https://github.com/pileax-ai/pileax/issues)
- [Discord](https://discord.gg/8QQWYXF8Vd)

### 贡献者

<a href="https://github.com/pileax-ai/pileax/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=pileax-ai/pileax" />
</a>

## 致谢
- [Dify](https://github.com/langgenius/dify/): An open-source platform for developing LLM applications.
- [RAGFlow](https://github.com/infiniflow/ragflow): A leading open-source Retrieval-Augmented Generation (RAG) engine that fuses cutting-edge RAG with Agent capabilities to create a superior context layer for LLMs.
- [foliate-js](https://github.com/johnfactotum/foliate-js): Library for rendering e-books in the browser.
- [Readest](https://github.com/readest/readest): An open-source ebook reader designed for immersive and deep reading experiences.
- [Anx Reader](https://github.com/Anxcye/anx-reader): A thoughtfully crafted e-book reader for book lovers.
- [Yiitap](https://github.com/pileax-ai/yiitap): An AI powered, Notion-style WYSIWYG rich-text block-based editor built on top of [Tiptap](https://github.com/ueberdosis/tiptap) & [ProseMirror](https://github.com/ProseMirror/prosemirror).


## 许可证
本项目基于 MIT 许可证发布。更多信息请参阅 [License](LICENSE)。
