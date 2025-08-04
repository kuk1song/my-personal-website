# 🚀 Kuki's Personal Website - 技术架构解析

本文档旨在详细解析本网站的技术栈、核心组件及其交互方式，为项目的维护和未来扩展提供清晰的指引。

---

## 1. 项目核心结构分析

本网站采用现代化的前端技术栈，构建了一个高度动态和交互式的单页面应用（SPA）。

- **框架**: [**React**](https://react.dev/) - 采用组件化思想构建用户界面。
- **构建工具**: [**Vite**](https://vitejs.dev/) - 提供极速的开发服务器和优化的构建流程。
- **语言**: [**TypeScript**](https://www.typescriptlang.org/) - 为JavaScript提供静态类型检查，增强了代码的健壮性和可维护性。
- **样式**: [**Tailwind CSS**](https://tailwindcss.com/) - 一个功能类优先的CSS框架，用于快速构建自定义设计。

---

## 2. 核心技术与实现

### 2.1. 3D 场景与星际旅程 (`InterstellarJourney.tsx`)

这是网站最具特色的部分，通过融合 3D 渲染和滚动驱动的动画，创造出沉浸式的“星际旅程”体验。

- **3D 渲染库**: [**Three.js**](https://threejs.org/) 与 [**React Three Fiber (R3F)**](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
  - R3F 提供了一个声明式的、React-friendly 的方式来构建 Three.js 场景。
  - **`<Canvas>`**: R3F 的核心组件，用于创建 WebGL 渲染上下文。
  - **Drei**: R3F 的辅助库，提供了许多即用型组件，如 `<Stars>`、`<Sphere>` 等。

- **相机系统 (`PerfectMirrorCamera`)**:
  - 通过 `useFrame` 钩子，每一帧都根据滚动进度来更新相机的位置和视角。
  - 路径由一个 `THREE.Vector3` 数组 (`pathPoints`) 定义。
  - 视角由一个独立的 `customLookAtTargets` 数组定义，实现了相机路径和视角的解耦。

### 2.2. 滚动驱动动画 (`Index.tsx`)

我们使用 [**GSAP (GreenSock Animation Platform)**](https://gsap.com/) 及其 `ScrollTrigger` 插件来将滚动行为与2D和3D动画精确同步。

- **时间线 (`gsap.timeline`)**: 创建一个总的动画时间线。
- **`ScrollTrigger`**:
  - `trigger`: 触发动画的元素（`mainRef`）。
  - `scrub: 1`: 将动画进度与滚动条位置平滑地绑定（1秒延迟）。
  - `start`, `end`: 定义动画开始和结束的滚动位置。

- **2D 与 3D 联动**:
  1. `Index.tsx` 通过 `handleScroll` 事件监听器计算出全局的滚动进度 `scrollProgress` (0 to 1)。
  2. 这个 `scrollProgress` 作为 prop 传递给 `InterstellarJourney` 组件。
  3. `InterstellarJourney` 内部的 `PerfectMirrorCamera` 使用这个 `scrollProgress` 来驱动3D相机在预设路径上移动。

### 2.3. 硬件加速优化

为了解决复杂DOM元素在变换（`scale`）时的性能问题，我们采用了强制硬件加速的技术。

- **问题**: 对一个包含复杂子元素（如 `AboutSection`）的DOM节点应用 `scale` 变换，会导致浏览器使用CPU进行大量的“重排”（Reflow），从而引发卡顿。
- **解决方案**:
  - 使用 `transform: 'scale3d(1.5, 1.5, 1) translateZ(0)'` 替代 `scale: 2`。
  - `scale3d` 和 `translateZ(0)` 会“欺骗”浏览器，让其认为这是一个3D变换任务。
  - 浏览器会将这个动画任务交给GPU处理，将该DOM节点提升为一个独立的“图层”（Layer）。
  - GPU直接对这个图层进行变换，避免了CPU昂贵的布局重新计算。

### 2.4. 交互式数字宠物 (`DigitalPet.tsx` & Hooks)

这是一个独立的、复杂的组件系统，拥有自己的状态管理和交互逻辑。

- **状态管理**: 采用自定义 React Hooks（如 `usePetStateManager`, `usePetMovement` 等）来封装和管理宠物的各种状态（心情、能量、位置、可见性等）。
- **交互**: 通过事件监听器处理键盘（空格发射激光）和鼠标/触摸（拖动）交互。
- **性能**: 通过 `requestAnimationFrame` 和 `useCallback` 等技术进行性能优化，确保宠物动画的流畅性。

---

## 3. 项目结构概览

```
/
├── public/
│   └── og-image.png        # 社交媒体预览图
├── src/
│   ├── components/
│   │   ├── AboutSection.tsx      # “关于我”内容区
│   │   ├── DigitalPet.tsx      # 数字宠物主组件
│   │   ├── HeroSection.tsx       # 首页英雄区
│   │   ├── InterstellarJourney.tsx # 3D星际旅程核心
│   │   ├── Navigation.tsx        # 顶部导航栏
│   │   └── ProductsSection.tsx     # “产品”内容区
│   ├── hooks/
│   │   ├── usePetStateManager.ts # 宠物状态管理
│   │   └── ...                   # 其他宠物相关Hooks
│   ├── pages/
│   │   └── Index.tsx             # 网站主页面，集成所有组件和动画
│   ├── App.tsx                 # 应用根组件，设置路由
│   ├── main.tsx                # 应用入口文件
│   └── index.css               # 全局样式和Tailwind配置
├── docs/                       # 项目文档
│   ├── 技术架构.md
│   ├── 功能路线图.md
│   └── 问题日志.md
├── index.html                  # HTML入口
├── package.json
└── vite.config.ts
``` 