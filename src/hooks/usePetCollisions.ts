import { useState, useRef } from 'react';

interface Collision {
  x: number;
  y: number;
  text: string;
}

export const usePetCollisions = () => {
  const [collision, setCollision] = useState<Collision | null>(null);
  const [currentCollisionElement, setCurrentCollisionElement] = useState<Element | null>(null);
  
  // 使用 Set 来跟踪已经触发过碰撞效果的元素
  const triggeredElements = useRef(new Set<Element>());

  const checkCollisions = (newX: number, newY: number) => {
    const elements = document.querySelectorAll('h1, h2, h3, p, span, button');
    const petSize = 48;
    let foundCollision = false;
    let newCollisionElement = null;
    
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      
      if (
        newX > rect.left - petSize/2 &&
        newX < rect.right + petSize/2 &&
        newY > rect.top - petSize/2 &&
        newY < rect.bottom + petSize/2
      ) {
        foundCollision = true;
        newCollisionElement = element;
        const text = element.textContent || '';
        
        // 只有当这个元素还没有被触发过碰撞效果时才触发任何效果
        if (!triggeredElements.current.has(element) && text.length > 0 && text.length < 50) {
          // 标记这个元素已经被触发过
          triggeredElements.current.add(element);
          
          setCurrentCollisionElement(element);
          setCollision({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            text: text.substring(0, 20)
          });
          
          // 清除撞击效果显示
          setTimeout(() => {
            setCollision(null);
          }, 1000);
          
          // 触发撞击事件
          const collisionEvent = new CustomEvent('petCollision', {
            detail: { text, x: newX, y: newY }
          });
          window.dispatchEvent(collisionEvent);
        } else if (currentCollisionElement !== element) {
          // 如果是不同的元素，更新当前元素但不触发任何效果
          setCurrentCollisionElement(element);
        }
        // 如果是已经触发过的元素，什么都不做，包括不设置collision状态
      }
    });
    
    // 只有当完全离开所有碰撞区域时才重置状态和清空已触发元素集合
    if (!foundCollision && currentCollisionElement) {
      setCurrentCollisionElement(null);
      setCollision(null);
      
      // 清空所有已触发的元素，允许下次重新触发
      triggeredElements.current.clear();
      
      const leaveEvent = new CustomEvent('petLeaveCollision', {
        detail: { x: newX, y: newY }
      });
      window.dispatchEvent(leaveEvent);
    }
  };

  return {
    collision,
    checkCollisions
  };
};
