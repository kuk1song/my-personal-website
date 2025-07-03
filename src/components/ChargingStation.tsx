import React from 'react';
import { createPortal } from 'react-dom';
import { Zap } from 'lucide-react';
import House3D from './House3D';

interface ChargingStationProps {
  isCharging: boolean;
  energy: number;
  maxEnergy: number;
  onChargingComplete: () => void;
}

const ChargingStation: React.FC<ChargingStationProps> = ({ 
  isCharging,
  energy,
  maxEnergy,
  onChargingComplete 
}) => {
  const energyPercentage = (energy / maxEnergy) * 100;
  
  // 判断是否低电量（小于等于10）
  const isLowPower = energy <= 10;
  
  const stationContent = (
    <div 
      className="pointer-events-none"
      style={{
        position: 'fixed',
        top: '4rem', // 从1rem改为4rem，向下移动避免与导航栏重叠
        left: '0.5rem',
        zIndex: 40,
        width: 'auto',
        height: 'auto',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px',
        willChange: 'transform',
        isolation: 'isolate',
      }}
    >
      {/* 3D Cyberpunk Charging Dock */}
      <div className="relative">
        {/* Main dock platform - 移动端缩小 */}
        <div 
          className={`relative bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#030617] border-2 rounded-lg p-2 sm:p-3 w-24 sm:w-32 ${
            isLowPower ? 'border-[#FF073A] animate-pulse' : 'border-[#00F5FF]'
          }`}
          style={{
            boxShadow: `
              0 0 20px rgba(${isLowPower ? '255, 7, 58' : '0, 245, 255'}, 0.3),
              0 8px 32px rgba(0, 0, 0, 0.8),
              inset 0 1px 0 rgba(${isLowPower ? '255, 7, 58' : '0, 245, 255'}, 0.2),
              inset 0 -1px 0 rgba(0, 0, 0, 0.8)
            `
          }}
        >
          {/* Top tech strip */}
          <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent to-transparent opacity-60 ${
            isLowPower ? 'via-[#FF073A]' : 'via-[#00F5FF]'
          }`} />
          
          {/* Header - 移动端减小字体 */}
          <div className="text-center mb-1 sm:mb-2">
            <div className={`text-xs sm:text-xs font-mono tracking-widest ${
              isLowPower ? 'text-[#FF073A]' : 'text-[#00F5FF]'
            }`}>
              DOCK v2.4
            </div>
          </div>
          
          {/* 3D房子容器 - 移动端缩小 */}
          <div className="relative flex justify-center mb-1 sm:mb-2">
            <div className="w-12 h-12 sm:w-20 sm:h-20">
              <House3D 
                isCharging={isCharging}
                energy={energy}
                maxEnergy={maxEnergy}
              />
            </div>
            
            {/* 充电环效果 - 移动端缩小 */}
            {isCharging && (
              <>
                <div 
                  className="absolute left-1/2 top-1/2 w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-[#00F5FF]/50 animate-ping"
                  style={{ transform: 'translate(-50%, -50%)' }}
                />
                <div 
                  className="absolute left-1/2 top-1/2 w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-[#FF073A]/30 animate-ping"
                  style={{ 
                    transform: 'translate(-50%, -50%)',
                    animationDelay: '0.5s'
                  }}
                />
              </>
            )}
            
            {/* 低电量警告环效果 - 移动端缩小 */}
            {isLowPower && !isCharging && (
              <div 
                className="absolute left-1/2 top-1/2 w-18 h-18 sm:w-26 sm:h-26 rounded-full border-2 border-[#FF073A]/70 animate-pulse"
                style={{ transform: 'translate(-50%, -50%)' }}
              />
            )}
          </div>
          
          {/* Energy display - 移动端减小字体 */}
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <Zap 
              size={10} 
              className={`sm:w-3 sm:h-3 ${
                isLowPower ? 'text-[#FF073A] animate-pulse' : 
                isCharging ? 'text-[#00F5FF] animate-pulse' : 'text-[#00F5FF]'
              }`}
            />
            <div className={`font-mono text-xs sm:text-sm font-bold ${
              isLowPower ? 'text-[#FF073A]' : 'text-[#00F5FF]'
            }`}>
              {energy}
            </div>
          </div>
          
          {/* Status - 移动端减小字体 */}
          <div className="text-center mt-1">
            <div className={`text-xs sm:text-xs font-mono ${
              isLowPower ? 'text-[#FF073A]/90 animate-pulse' : 'text-[#00F5FF]/80'
            }`}>
              {isCharging ? 'CHARGING' : isLowPower ? 'LOW POWER' : 'READY'}
            </div>
          </div>
          
          {/* Side panels - 移动端缩小 */}
          <div className="absolute -left-1 top-1/4 bottom-1/4">
            <div 
              className={`w-1 sm:w-2 h-full rounded-l ${
                isLowPower ? 'bg-gradient-to-b from-[#FF073A] via-[#B91C1C] to-[#FF073A]' : 
                'bg-gradient-to-b from-[#00F5FF] via-[#0077B6] to-[#00F5FF]'
              }`}
              style={{ 
                boxShadow: `-2px 0 8px rgba(${isLowPower ? '255, 7, 58' : '0, 245, 255'}, 0.4)` 
              }} 
            />
          </div>
          <div className="absolute -right-1 top-1/4 bottom-1/4">
            <div 
              className={`w-1 sm:w-2 h-full rounded-r ${
                isLowPower ? 'bg-gradient-to-b from-[#FF073A] via-[#B91C1C] to-[#FF073A]' : 
                'bg-gradient-to-b from-[#00F5FF] via-[#0077B6] to-[#00F5FF]'
              }`}
              style={{ 
                boxShadow: `2px 0 8px rgba(${isLowPower ? '255, 7, 58' : '0, 245, 255'}, 0.4)` 
              }} 
            />
          </div>
          
          {/* Bottom tech strip */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4/5 h-1 bg-gradient-to-r from-transparent via-[#00FF41] to-transparent opacity-50" />
        </div>
      </div>
    </div>
  );

  // 确保Portal渲染到body的最顶层
  return createPortal(stationContent, document.body);
};

export default ChargingStation;