# ADR-001: 复杂DOM变换的性能优化策略

## Status

Accepted

## Context

在开发滚动驱动的星际旅程动画时，发现在`About Me`板块（一个DOM结构复杂的组件）进行`scale`放大消失的过渡动画时，出现了严重的性能瓶颈和卡顿，尤其在移动端设备上。

初步排查了3D相机视角突变、CSS `mix-blend-mode` 属性、以及相机FOV（视场）变化等潜在原因，但均未完全解决问题，表明存在更深层次的性能瓶颈。

## Decision

我们决定放弃使用常规的CSS `scale` 2D变换，转而采用一种能**强制触发硬件（GPU）加速**的3D变换技术来执行动画。

具体的实现方式是在GSAP动画中，将原有的 `scale` 属性替换为 `transform` 属性，并使用 `scale3d` 和 `translateZ(0)`：

```javascript
// Before
tl.to('#about-section', { scale: 2, ... });

// After
tl.to('#about-section', { 
  transform: 'scale3d(1.5, 1.5, 1) translateZ(0)', 
  ... 
});
```

## Consequences

### 优点

- **性能大幅提升**: 卡顿问题被完全解决。动画从由CPU执行的、昂贵的“重排（Reflow）”计算，转变为由GPU执行的、高效的“图层合成（Compositing）”。
- **动画更流畅**: GPU专门为图形变换设计，因此动画效果更丝滑。
- **解决方案可复用**: 这个技术可以作为未来处理复杂DOM元素动画的最佳实践。

### 缺点

- **代码略显复杂**: `scale3d(...)` 相较于 `scale` 更长，需要向不熟悉的开发者解释其原理（即“3D变换欺骗”技巧）。
- **潜在的渲染问题**: 在极少数旧设备或浏览器上，强制提升图层可能会引发字体渲染模糊等细微的视觉问题，但对于本项目目标用户群体而言，风险极低。 