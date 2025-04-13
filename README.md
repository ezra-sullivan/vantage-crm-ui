## 项目简介

这是一个基于 Vue 3 + TypeScript + Element Plus 开发的客户关系管理系统前端项目。系统提供了用户登录、客户管理、销售跟踪等功能，旨在帮助企业更好地管理客户关系，提高销售效率。

## 技术栈

- 前端框架 ：Vue 3
- 开发语言 ：TypeScript
- UI 组件库 ：Element Plus
- 状态管理 ：Pinia
- 路由管理 ：Vue Router
- HTTP 请求 ：Axios
- 构建工具 ：Vite

## 功能特性

- 多种登录方式（邮箱密码登录、手机验证码登录）
- 响应式布局，适配不同设备
- 权限控制系统
- 客户信息管理
- 销售机会跟踪
- 数据统计与分析
- 系统设置与用户管理

## 安装与运行

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 生产环境构建

```bash
npm run build
```

## 项目结构

```plaintext
vantage-crm-ui/
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── api/             # API 接口
│   ├── assets/          # 项目资源文件
│   ├── components/      # 公共组件
│   ├── composables/     # 组合式函数
│   ├── layouts/         # 布局组件
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia 状态管理
│   ├── styles/          # 全局样式
│   ├── utils/           # 工具函数
│   ├── views/           # 页面视图
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── .env                 # 环境变量
├── index.html           # HTML 模板
├── package.json         # 项目依赖
├── tsconfig.json        # TypeScript 配置
└── vite.config.ts       # Vite 配置
```

## 开发指南

### 代码规范

项目使用 ESLint 和 Prettier 进行代码规范检查和格式化，请确保在提交代码前运行以下命令：

```bash
npm run lint
```

### 新增页面

1. 在 src/views 目录下创建新的页面组件
2. 在 src/router 中添加对应路由配置
3. 如需添加权限控制，请在路由配置中设置 meta 信息

### API 接口管理

所有接口请求应在 src/api 目录下进行集中管理，按功能模块划分文件。

## 部署说明

系统支持多种部署方式，包括但不限于：

- Nginx 静态部署
- Docker 容器化部署
- 云服务平台部署（如阿里云、腾讯云等）
  具体部署步骤请参考部署文档。

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 ( git checkout -b feature/amazing-feature )
3. 提交您的更改 ( git commit -m 'Add some amazing feature' )
4. 推送到分支 ( git push origin feature/amazing-feature )
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证。

MIT 许可证是一种宽松的软件许可证，它基本上允许任何人以任何方式使用您的代码，只要他们在自己的项目中包含原始许可证和版权声明。

### 许可证摘要

- 可以自由使用、复制、修改、合并、发布、分发、再许可和/或出售本软件的副本
- 必须在所有副本或实质性部分中包含上述版权声明和本许可声明
- 本软件按"原样"提供，不提供任何形式的明示或暗示的保证

完整的许可证文本请参见项目根目录下的 [LICENSE](LICENSE) 文件。
