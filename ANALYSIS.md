# My-Site 项目分析与优化计划

最后更新： `2024-05-21`

---

## 1. 项目核心结构分析

本站是一个基于 **React + Vite + TypeScript** 的单页应用 (SPA)，其核心是打造一个沉浸式的3D星际穿越个人主页。

- **`main.tsx`**: 应用入口，渲染 `App` 组件。
- **`App.tsx`**: 设置全局 Providers (React Query, Toaster, Tooltip) 和路由 (`react-router-dom`)。
- **`pages/Index.tsx`**: 核心页面，是所有体验的“总指挥”。
    - 使用 **GSAP ScrollTrigger** 编排整个页面的滚动动画序列。
    - 管理全局的 **`scrollProgress`** 状态，并将其传递给3D场景。
    - 渲染各个内容板块 (`Header`, `AboutSection`, `ProductsSection`, `Footer`)。
- **`components/InterstellarJourney.tsx`**: **3D场景核心**。
    - 接收 `scrollProgress`，控制 `PerfectMirrorCamera` 的相机运动。
    - 渲染所有3D元素：`Stars` (星空), `EnhancedPlanet` (星球), `PlanetaryRings` (星环)。
    - **单Canvas架构的关键**：它提供了一个全局的3D场景挂载点 `__GLOBAL_3D_SCENE_TARGET__`，允许其他组件（如 `DigitalPet`）通过 `createPortal` 将3D内容渲染到这个唯一的Canvas中，避免了WebGL上下文冲突。
- **`components/DigitalPet.tsx`**: 数字宠物。
    - 内部包含 **`House3D`** 组件，该组件通过 React Portal 将自己的3D模型（充电底座和机器人）渲染到 `InterstellarJourney` 的Canvas中。这是解决“双Canvas冲突”的核心技术。
- **`hooks/`**: 存放独立的业务逻辑，如 `usePetEnergy` 等。
- **`index.css`**: 全局样式和自定义动画（如赛博朋克文字闪烁效果）。

---

## 2. 功能优化待办清单 (TODO)

### 阶段一：修复与优化

- [ ] **功能禁用：移除文字撞击效果**
    - **问题**: 在3D视角下，原有的2D文字撞击位置不准，效果不佳。
    - **方案**: 暂时禁用该功能。找到 `usePetInteractionHandlers.tsx` 中相关的鼠标移动事件监听器，并将其注释掉，保留代码以备将来使用。

- [ ] **UI修复：移除滚动时的顶部蓝条**
    - **问题**: 向下滚动时，`Header` 或页面顶部出现一个蓝色线条。
    - **方案**: 检查 `Header.tsx` 和 `Index.tsx` 的样式。很可能是 GSAP Pinning 过程中产生的 `border` 或 `box-shadow`。需要定位并移除。

- [ ] **体验修复：解耦滚动速度与相机轨迹**
    - **问题**: `lerp` 动画的帧依赖性导致快速滚动会“抄近路”，破坏了预设的相机轨迹。
    - **方案**: 修改 `InterstellarJourney.tsx` 中的 `PerfectMirrorCamera`。让 `lerp` 的插值因子与 `useFrame` 中的 `delta` (帧间隔时间) 关联，使其动画效果与帧率无关。

### 阶段二：动画与内容增强

- [ ] **动画增强：优化相机轨迹**
    - **问题**: 前往红色星球和降落紫色星球的轨迹尚未完成。
    - **方案**:
        1. 在 `PerfectMirrorCamera` 的 `pathPoints` 中添加更多、更精确的路径点，创造环绕红色星球飞行的感觉。
        2. 为降落紫色星球设计一个有视觉冲击力的“着陆”序列，可能包括：相机FOV变化、加速感到达、屏幕效果（如轻微震动或闪光）。

- [ ] **代码审查：移除冗余代码**
    - **问题**: 项目迭代过程中可能遗留了不再使用的代码或组件。
    - **方案**: 在完成上述功能后，系统性地检查所有文件，删除无用的变量、函数、导入和注释。

- [ ] **文档更新**
    - **问题**: 随着项目完成，需要更新 `README.md`。
    - **方案**: 撰写新的项目介绍、技术栈说明和本地运行指南。 