import { useState, useEffect, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

export const usePetMovement = (
  initialPosition: Position,
  isVisible: boolean,
  lastInteraction: number,
  onPositionChange: (position: Position) => void
) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isMoving, setIsMoving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const animationFrameRef = useRef<number>();

  // Update position and notify parent
  const updatePosition = useCallback((newPosition: Position) => {
    setPosition(newPosition);
    onPositionChange(newPosition);
  }, [onPositionChange]);

  // 页面滚动功能
  const handlePageScroll = useCallback((newX: number, newY: number) => {
    const scrollMargin = 100; // 距离边缘多少像素时开始滚动
    const scrollSpeed = 15; // 降低滚动速度从50到15
    
    // 检查是否需要水平滚动
    if (newX < scrollMargin) {
      window.scrollBy(-scrollSpeed, 0);
    } else if (newX > window.innerWidth - scrollMargin) {
      window.scrollBy(scrollSpeed, 0);
    }
    
    // 检查是否需要垂直滚动
    if (newY < scrollMargin) {
      window.scrollBy(0, -scrollSpeed);
    } else if (newY > window.innerHeight - scrollMargin) {
      window.scrollBy(0, scrollSpeed);
    }
  }, []);

  // Mouse and Touch dragging handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setIsMoving(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setIsMoving(true);
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsMoving(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setIsMoving(false);
  }, []);

  // Mouse movement effect - 优化流畅性并添加滚动
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // 使用 requestAnimationFrame 来确保流畅的动画
        requestAnimationFrame(() => {
          const newPosition = { x: e.clientX, y: e.clientY };
          updatePosition(newPosition);
          // 检查是否需要滚动页面
          handlePageScroll(e.clientX, e.clientY);
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) {
          // 使用 requestAnimationFrame 来确保流畅的动画
          requestAnimationFrame(() => {
            const newPosition = { x: touch.clientX, y: touch.clientY };
            updatePosition(newPosition);
            // 检查是否需要滚动页面
            handlePageScroll(touch.clientX, touch.clientY);
          });
        }
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseUp, handleTouchEnd, updatePosition, handlePageScroll]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;
      setKeysPressed(prev => new Set(prev).add(e.key));
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isVisible]);

  // Movement processing - 使用 requestAnimationFrame 优化并添加滚动
  useEffect(() => {
    const moveSpeed = 8; // 从5增加到8，提高移动速度

    const processMovement = () => {
      if (!isVisible || keysPressed.size === 0) {
        setIsMoving(false);
        return;
      }

      let deltaX = 0;
      let deltaY = 0;

      if (keysPressed.has('ArrowLeft')) deltaX -= moveSpeed;
      if (keysPressed.has('ArrowRight')) deltaX += moveSpeed;
      if (keysPressed.has('ArrowUp')) deltaY -= moveSpeed;
      if (keysPressed.has('ArrowDown')) deltaY += moveSpeed;

      // 对角线移动时的速度归一化
      if (deltaX !== 0 && deltaY !== 0) {
        const normalizedSpeed = moveSpeed / Math.sqrt(2);
        deltaX = deltaX > 0 ? normalizedSpeed : -normalizedSpeed;
        deltaY = deltaY > 0 ? normalizedSpeed : -normalizedSpeed;
      }

      if (deltaX !== 0 || deltaY !== 0) {
        setIsMoving(true);
        
        setPosition(currentPosition => {
          const newX = Math.max(20, Math.min(window.innerWidth - 20, currentPosition.x + deltaX));
          const newY = Math.max(20, Math.min(window.innerHeight - 20, currentPosition.y + deltaY));
          const newPosition = { x: newX, y: newY };
          
          // 检查是否需要滚动页面
          handlePageScroll(newX, newY);
          
          // 使用 requestAnimationFrame 来更新位置
          requestAnimationFrame(() => {
            onPositionChange(newPosition);
          });
          
          return newPosition;
        });
      }

      // 继续下一帧
      animationFrameRef.current = requestAnimationFrame(processMovement);
    };

    if (keysPressed.size > 0) {
      animationFrameRef.current = requestAnimationFrame(processMovement);
    } else {
      setIsMoving(false);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, keysPressed, onPositionChange, handlePageScroll]);

  // Autonomous movement
  useEffect(() => {
    const moveRandomly = () => {
      if (Date.now() - lastInteraction > 10000) {
        const newX = position.x + (Math.random() * 40 - 20);
        const newY = position.y + (Math.random() * 40 - 20);
        
        const boundedX = Math.max(50, Math.min(window.innerWidth - 50, newX));
        const boundedY = Math.max(50, Math.min(window.innerHeight - 50, newY));
        
        updatePosition({ x: boundedX, y: boundedY });
      }
    };

    const movementInterval = setInterval(moveRandomly, 5000);
    return () => clearInterval(movementInterval);
  }, [position, lastInteraction, updatePosition]);

  return {
    position,
    isMoving,
    isDragging,
    keysPressed,
    handleMouseDown,
    handleTouchStart,
    handleMouseUp,
    handleTouchEnd,
    setIsMoving,
    updatePosition
  };
};