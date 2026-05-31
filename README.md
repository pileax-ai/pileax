**English** | [简体中文](README_zh.md)

<h1 align="center">PileaX</h1>
<p align="center">PileaX AI: All-in-one AI KnowledgeBase. 🍀</p>

<p align="center">
  <a href="https://github.com/pileax-ai/pileax/actions/workflows/ci.yml" alt="Build Status">
    <img src="https://github.com/pileax-ai/pileax/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="https://github.com/pileax-ai/pileax/releases/latest">
    <img src="https://img.shields.io/github/v/release/pileax-ai/pileax" alt="Latest Release"></a>
  <a href="https://github.com/pileax-ai/pileax/releases">
    <img src="https://img.shields.io/github/v/release/pileax-ai/pileax?include_prereleases&label=pre-release" alt="Pre-release"></a>
  <a href="https://github.com/pileax-ai/pileax/releases">
    <img src="https://img.shields.io/github/downloads/pileax-ai/pileax/total" alt="Downloads"></a>
  <a href="https://github.com/badges/shields/pulse" alt="Activity">
    <img src="https://img.shields.io/github/commit-activity/m/pileax-ai/pileax" /></a>
  <a href="https://github.com/pileax-ai/pileax/blob/main/LICENSE" alt="License">
    <img src="https://img.shields.io/badge/license-MIT-green?style=square" /></a>
</p>

<p align="center">
  <a href="https://github.com/pileax-ai/pileax#platform-support">
    <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue" alt="Platforms"></a>
  <a href="https://github.com/pileax-ai/pileax#supported-formats">
    <img src="https://img.shields.io/badge/formats-EPUB%20%7C%20MOBI%20%7C%20AWZ3%20%7C%20FB2%20%7C%20CBZ%20%7C%20PDF-teal" alt="Supported Formats"></a>
</p>

PileaX is a local-first, all-in-one AI knowledge base that integrates AI chat, smart notes, and e-book reading & management. From knowledge creation to application, PileaX helps you build a unified knowledge base and continuously optimizes the AI interaction experience with AI agent technologies.Your data is fully under your control. It supports offline desktop apps and flexibly deployable web apps.

## Preview

### Main
![Screenshot](https://pileax.ai/screenshots/main.gif)

### Reader
![Screenshot](https://pileax.ai/screenshots/reader.gif)

## Features

🚀 **AI Chat** – Your AI assistant, ready to answer questions and tackle tasks. <br/>
📝 **Notes** - Modern Notion-style editor. <br/>
🤖 **Reading** – Build your personal library and enjoy AI-powered reading. <br/>
🌗 Light & Dark mode. <br/>
🆓 MIT Licensed. <br/>

## Quick start

- [Getting started](https://pileax.ai/guide/getting-started)
- [Download](https://pileax.ai/download)

For more detailed information, make sure to check out our [documentation](https://pileax.ai). If you encounter any problems or have suggestions, please open an [issue](https://github.com/pileax-ai/pileax/issues/new/choose).

### Desktop
Download desktop application from [download page](https://pileax.ai/download) or [release page](https://github.com/pileax-ai/pileax/releases).

### Docker Compose
```bash
cd docker
cp backend.env.example backend.env

# start
docker compose up -d

# stop
docker compose down
```
Then, open http://localhost:9610 to start.

## Contributing

### Community & contact
- [GitHub Issues](https://github.com/pileax-ai/pileax/issues)
- [Discord](https://discord.gg/8QQWYXF8Vd)

### Contributors

<a href="https://github.com/pileax-ai/pileax/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=pileax-ai/pileax" />
</a>

## Acknowledgements
- [Dify](https://github.com/langgenius/dify/): An open-source platform for developing LLM applications.
- [RAGFlow](https://github.com/infiniflow/ragflow): A leading open-source Retrieval-Augmented Generation (RAG) engine that fuses cutting-edge RAG with Agent capabilities to create a superior context layer for LLMs.
- [foliate-js](https://github.com/johnfactotum/foliate-js): Library for rendering e-books in the browser.
- [Readest](https://github.com/readest/readest): An open-source ebook reader designed for immersive and deep reading experiences.
- [Anx Reader](https://github.com/Anxcye/anx-reader): A thoughtfully crafted e-book reader for book lovers.
- [Yiitap](https://github.com/pileax-ai/yiitap): An AI powered, Notion-style WYSIWYG rich-text block-based editor built on top of [Tiptap](https://github.com/ueberdosis/tiptap) & [ProseMirror](https://github.com/ProseMirror/prosemirror).


## License
The MIT License (MIT). Please see [License File](LICENSE) for more information.
