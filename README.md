<div>
<div align="center"><img width="200" src="https://gcore.jsdelivr.net/gh/zxwk1998/image/logo/vab.png"/>
<h1>realtime-front</h1>
<p>🎉🎉 这是realtime第一个使用场景demo，希望对第一次接入的小伙伴有参考意义和帮助！🎉🎉</p>
</div>

[![stars](https://img.shields.io/github/stars/zxwk1998/vue-admin-better?style=flat-square&logo=GitHub)](https://github.com/zxwk1998/vue-admin-better)
[![star](https://gitee.com/chu1204505056/vue-admin-better/badge/star.svg?theme=gray)](https://gitee.com/chu1204505056/vue-admin-better)
[![license](https://img.shields.io/github/license/zxwk1998/vue-admin-better?style=flat-square)](https://en.wikipedia.org/wiki/MIT_License)

---

![GitHub license](https://img.shields.io/github/license/xiongzhaoling/realtime-front)
![GitHub stars](https://img.shields.io/github/stars/xiongzhaoling/realtime-front?style=social)

## 简介
realtime-front 是一个基于 Vue 3 和 Vite 构建的开源前端项目。借助 Vue 3 的先进特性（如组合式 API、响应式系统优化等）以及 Vite 闪电般的构建速度，项目旨在为开发者提供一个高效、灵活且易于扩展的前端开发基础。此项目做了了高度组件化设计，确保代码的可维护性和可扩展性。主要功能包括：对realtime接口的语音、语音视频、语音屏幕三种交互形态的使用场景用例。

## 特性
- **Vue 3 驱动**：使用 Vue 3 的组合式 API 组织代码，提升代码复用性与可维护性。
- **Vite 构建**：拥有快速的冷启动和热更新能力，显著提高开发效率。
- **组件化设计**：高度组件化的架构，便于代码管理和功能扩展。
- **路由管理**：采用 Vue Router 进行单页面应用的路由控制，支持动态路由和路由守卫。

## 安装与使用

### 环境要求
- Node.js（版本 >= v18.18.0）
- npm 或 pnpm

### 安装依赖
```bash
git clone https://github.com/[你的 GitHub 用户名]/realtime-front.git
cd realtime-front
pnpm install
```

### 运行项目
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```
  
### 项目结构
```bash
realtime-front/
├── public/             # 静态资源目录，直接复制到 dist 目录
├── src/                # 源代码目录
│   ├── assets/         # 应用内的静态资源，如图片、样式文件等
│   ├── components/     # 通用组件目录
│   ├── constants/      # 常量配置目录
│   ├── router/         # 路由配置目录
│   ├── view/           # 页面组件目录
│   ├── utils/          # 工具函数目录
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── .gitignore          # Git 忽略文件
├── index.html          # 主 HTML 文件
├── LICENSE             # 许可证文件
├── package.json        # 项目依赖和脚本配置文件
├── pnpm-lock.yaml      # pnpm 锁文件
└── README.md           # 文档说明
└── vite.config.js      # Vite 配置文件

```
## 📄 许可证
本项目采用 [MIT] 许可证，详见 [LICENSE](./LICENSE)。