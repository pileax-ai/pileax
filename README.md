# PileaX

PileaX AI: One-Stop AI Knowledge Base System. 🍀


<p align="center">
    <a href="https://github.com/pileax-ai/pileax/actions/workflows/ci.yml" alt="Build Status">
      <img src="https://github.com/pileax-ai/pileax/actions/workflows/ci.yml/badge.svg" />
    </a>
    <a href="https://github.com/pileax-ai/pileax/releases" alt="Version">
      <img src="https://img.shields.io/badge/version-v0.0.3-blue?style=square" />
    </a>
    <a href="https://github.com/badges/shields/pulse" alt="Activity">
      <img src="https://img.shields.io/github/commit-activity/m/pileax-ai/pileax" />
    </a>
    <a href="https://github.com/pileax-ai/pileax/blob/main/LICENSE" alt="License">
      <img src="https://img.shields.io/badge/license-MIT-green?style=square" />
    </a>
</p>


## Features

🚀 **AI Chat** – Your AI assistant, ready to answer questions and tackle tasks.
📝 **Notes** - Modern Notion-style editor.
🤖 **Reading** – Build your personal library and enjoy AI-powered reading.
🌗 Light & Dark mode.
🆓 MIT Licensed.

## Quick start

- [Guide to PileaX](https://docs.pileax.ai/guide/getting-started)

For more detailed information, make sure to check out our [documentation](https://yiitap.pileax.ai). If you encounter any problems or have suggestions, please open an issue.

## Development

### Preparation
```shell
yarn global add tsx dotenv-cli
```

### Frontend
```shell
cd frontend
yarn install
yarn dev
```

### Backend
Follow the instructions in [README.md](backend/README.md)


## Docker
```shell
cd docker
cp middleware.env.example middleware.env
docker compose -f docker-compose.middleware.yaml up -d

docker compose up -d
docker compose down
```
Open http://localhost:9610


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
- [Yiitap](https://github.com/pileax-ai/yiitap): An AI powered, Notion-style WYSIWYG rich-text block-based editor built on top of [Tiptap](https://github.com/ueberdosis/tiptap) & [ProseMirror](https://github.com/ProseMirror/prosemirror).
- [Anx Reader](https://github.com/Anxcye/anx-reader): A thoughtfully crafted e-book reader for book lovers.


## License
The MIT License (MIT). Please see [License File](LICENSE) for more information.
