import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetStore } from '../store/usePetStore';
import { ChevronLeft } from 'lucide-react';

interface PersonalityData {
  id: string;
  name: string;
  englishName: string;
  color: string;
  gradient: string;
  cardGradient: string;
  description: string;
  image: string;
  coords: { x: number; y: number };
}

const personalities: PersonalityData[] = [
  {
    id: 'joybean',
    name: '乐天派',
    englishName: 'Joybean',
    color: '#A68DB6',
    gradient: 'from-[#D0C3E1] to-[#E2E7F1]',
    cardGradient: 'linear-gradient(100deg, #c8a8ff 0%, #ad8aff 100%)',
    description: 'Always giggling with that silly smile— they can’t really get mad at you.',
    image: '/images/personality/joybean.png',
    coords: { x: 100, y: 100 }
  },
  {
    id: 'fireball',
    name: '暴躁狂',
    englishName: 'Fireball',
    color: '#FFB800',
    gradient: 'from-[#FFD9B3] to-[#FFF5E6]',
    cardGradient: 'linear-gradient(100deg, #ffe27b 0%, #ffbf7a 100%)',
    description: 'One poke and the grumps come out—always a little huffy... Hmm... do you nitpick them a bit too often?',
    image: '/images/personality/fireball.png',
    coords: { x: -100, y: 100 }
  },
  {
    id: 'cold-brew',
    name: '高冷君',
    englishName: 'Cold Brew',
    color: '#5DA9E9',
    gradient: 'from-[#B3D9FF] to-[#E6F2FF]',
    cardGradient: 'linear-gradient(100deg, #c6e4ff 0%, #909cff 100%)',
    description: 'Shrugging off your words? Go cuddle your baby!',
    image: '/images/personality/cold-brew.png',
    coords: { x: 100, y: -100 }
  },
  {
    id: 'crybaby',
    name: '爱哭鬼',
    englishName: 'Crybaby',
    color: '#4CC9F0',
    gradient: 'from-[#B3F0FF] to-[#E6FBFF]',
    cardGradient: 'linear-gradient(100deg, #9af0d2 0%, #3bc6dd 100%)',
    description: 'Drip drip drip—the rain\'s falling down, drip drip drip—ropet\'s tears hit the ground.',
    image: '/images/personality/crybaby.png',
    coords: { x: -100, y: -100 }
  },
  {
    id: 'dazed',
    name: '呆呆人',
    englishName: 'Dazed',
    color: '#9BA3AF',
    gradient: 'from-[#E5E7EB] to-[#F9FAFB]',
    cardGradient: 'linear-gradient(100deg, #eeeeee 0%, #d7d7d7 100%)',
    description: '眼睛圆圆地发呆，好像刚刚从梦里回来，需要一点时间重新进入状态。',
    image: '/images/personality/dazed.png',
    coords: { x: 0, y: 0 }
  },
  {
    id: 'cross-eyed',
    name: '对对眼',
    englishName: 'Cross-eyed',
    color: '#9BA3AF',
    gradient: 'from-[#E5E7EB] to-[#F9FAFB]',
    cardGradient: 'linear-gradient(100deg, #eeeeee 0%, #d7d7d7 100%)',
    description: '持续堵鼻子触发了对对眼！每次最多持续 1 小时。让肉派进入睡眠可快速恢复正常。',
    image: '/images/personality/cross-eyed.png',
    coords: { x: 0, y: 0 }
  }
];

const PersonalityQuadrant: React.FC<{ currentCoords: { x: number; y: number } }> = ({ currentCoords }) => {
  return (
    <div className="relative w-full h-[432px] rounded-[24px] bg-[#fffdf8] px-[45px] pt-[74px] pb-[66px] shadow-[0_16px_30px_rgba(120,72,22,0.10)]">
      <div className="absolute top-[28px] right-[30px] text-[13px] leading-[20px] text-[#9ba2af] text-right font-semibold">
        X · 喜好行为<br />
        Y · 互动频率
      </div>

      <div className="absolute left-[45px] right-[45px] top-[74px] bottom-[66px]">
        <div className="absolute left-1/2 top-[-29px] -translate-x-1/2 text-[18px] font-bold text-[#9aa0aa]">Y</div>
        <div className="absolute left-[-32px] top-1/2 -translate-y-1/2 text-[22px] font-bold text-[#9aa0aa]">-X</div>
        <div className="absolute right-[-30px] top-1/2 -translate-y-1/2 text-[22px] font-bold text-[#9aa0aa]">X</div>
        <div className="absolute left-1/2 bottom-[-30px] -translate-x-1/2 text-[18px] font-bold text-[#9aa0aa]">-Y</div>

        <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-[#cfd6df]" />
        <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-[#cfd6df]" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[5px] w-0 h-0 border-l-[4px] border-r-[4px] border-b-[7px] border-l-transparent border-r-transparent border-b-[#cfd6df]" />
        <div className="absolute right-0 top-1/2 translate-x-[5px] -translate-y-1/2 w-0 h-0 border-t-[4px] border-b-[4px] border-l-[7px] border-t-transparent border-b-transparent border-l-[#cfd6df]" />
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[5px] w-[6px] h-[6px] rounded-full bg-[#cfd6df]" />
        <div className="absolute left-0 top-1/2 -translate-x-[4px] -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-[#cfd6df]" />
      </div>

      {/* Quadrants */}
      <div className="relative grid grid-cols-2 grid-rows-2 h-full overflow-hidden rounded-[20px]">
        {/* Top Left - Fireball */}
        <div className="relative p-4 bg-[radial-gradient(circle_at_32%_65%,#ffd064_0%,#ffe2a2_24%,rgba(255,245,230,0.72)_48%,rgba(255,255,255,0)_74%)]">
          <span className="text-[14px] font-semibold text-[#4b5563]">暴躁狂</span>
        </div>
        {/* Top Right - Joybean */}
        <div className="relative p-4 text-right bg-[radial-gradient(circle_at_58%_40%,#8f5cff_0%,#c1a1ff_28%,rgba(242,237,255,0.72)_52%,rgba(255,255,255,0)_76%)]">
          <span className="text-[14px] font-semibold text-[#4b5563]">乐天派</span>
        </div>
        {/* Bottom Left - Crybaby */}
        <div className="relative p-4 flex items-end bg-[radial-gradient(circle_at_30%_78%,#42d6df_0%,#8cf0d9_28%,rgba(230,251,255,0.72)_52%,rgba(255,255,255,0)_76%)]">
          <span className="text-[14px] font-semibold text-[#4b5563]">爱哭鬼</span>
        </div>
        {/* Bottom Right - Cold Brew */}
        <div className="relative p-4 text-right flex items-end justify-end bg-[radial-gradient(circle_at_72%_80%,#2e8af4_0%,#65c9ff_30%,rgba(230,242,255,0.72)_54%,rgba(255,255,255,0)_78%)]">
          <span className="text-[14px] font-semibold text-[#4b5563]">高冷君</span>
        </div>
      </div>

      {/* Marker */}
      <div className="absolute left-[45px] right-[45px] top-[74px] bottom-[66px] pointer-events-none">
        <div
          className="absolute w-[15px] h-[15px] bg-[#ffd45e] rounded-full shadow-[0_4px_12px_rgba(255,196,50,0.55)] transition-all duration-500"
          style={{
            left: `${50 + (currentCoords.x / 2)}%`,
            top: `${50 - (currentCoords.y / 2)}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-[22px] left-1/2 -translate-x-1/2 flex items-center gap-2 text-[12px] text-[#7c7f86] whitespace-nowrap">
        <span className="w-[8px] h-[8px] bg-[#ffd45e] rounded-full shadow-[0_2px_8px_rgba(255,196,50,0.7)]"></span>
        当前位置 (X={currentCoords.x},Y={currentCoords.y})
      </div>
    </div>
  );
};

const PersonalityListItem: React.FC<{ data: PersonalityData; isActive: boolean }> = ({ data, isActive }) => {
  return (
    <div 
      className={`relative flex items-center h-[128px] rounded-[20px] pl-[4px] pr-[20px] overflow-hidden transition-transform ${isActive ? 'scale-[1.01]' : ''}`}
      style={{ background: data.cardGradient }}
    >
      <div className="w-[116px] h-[112px] flex-shrink-0 flex items-center justify-start overflow-visible">
        <img src={data.image} alt={data.name} className="w-[116px] h-[98px] object-contain" />
      </div>
      <div className="ml-0 flex flex-col gap-1 flex-1 min-w-0">
        <h4 className="text-[25px] font-bold text-[#22222a] leading-[30px] flex items-center justify-between">
          {data.englishName}
        </h4>
        <p className="text-[15px] text-[#4f5360]/75 leading-[19px] line-clamp-4">{data.description}</p>
      </div>
    </div>
  );
};

const Personality: React.FC = () => {
  const { pet } = usePetStore();
  const navigate = useNavigate();

  const currentPersonality = personalities.find(p => p.name === pet?.personality) || personalities[0];

  return (
    <div className="relative w-full min-h-screen bg-[#FDE6C8] overflow-hidden flex justify-center">
      {/* 主容器 - 模拟移动设备尺寸 */}
      <div className="relative w-[393px] h-[852px] mx-auto my-0 overflow-hidden bg-[#ffdfad] rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        <div className="absolute top-[34px] left-[-90px] w-[380px] h-[82px] rotate-[-12deg] rounded-full bg-[#ff8f28] opacity-75 blur-[7px]" />
        <div className="absolute top-[170px] right-[-82px] w-[360px] h-[78px] rotate-[-26deg] rounded-full bg-[#ffb12d] opacity-75 blur-[7px]" />
        <div className="absolute top-[210px] left-[38px] w-[220px] h-[70px] rotate-[-18deg] rounded-full bg-[#ff8f28] opacity-55 blur-[9px]" />
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 flex flex-col">
          <div className="flex items-start self-stretch px-[14px] py-[14px] pr-[14px] pl-[21px] shrink-0">
            <p className="w-[54px] text-center tracking-[-0.3px] text-[#222222] text-[15px] font-semibold">9:41</p>
          </div>
          <div className="px-6 py-2">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-[#222222]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="relative z-10 h-full overflow-y-auto scrollbar-hide pt-[104px] pb-8 px-6 flex flex-col items-center">
          {/* Pet Large Image */}
          <div className="relative w-[286px] h-[230px] flex items-center justify-center">
            <img 
              src={currentPersonality.image} 
              alt={currentPersonality.name} 
              className="relative w-full h-full object-contain drop-shadow-[0_14px_16px_rgba(152,93,37,0.18)] z-10"
            />
          </div>

          {/* Current Personality Title */}
          <div className="mt-[18px] flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-[1px] bg-white"></div>
              <span className="text-[14px] text-white font-medium">当前性格</span>
              <div className="w-8 h-[1px] bg-white"></div>
            </div>
            <h1 className="text-[36px] font-black italic tracking-wider text-white drop-shadow-[0_3px_5px_rgba(177,113,38,0.20)]">
              {currentPersonality.name}
            </h1>
          </div>

          {/* Quadrant Map */}
          <div className="mt-[30px] w-full">
            <PersonalityQuadrant currentCoords={currentPersonality.coords} />
          </div>

          {/* Personality List */}
          <div className="mt-6 w-full flex flex-col gap-4">
            {personalities.map(p => (
              <PersonalityListItem 
                key={p.id} 
                data={p} 
                isActive={p.id === currentPersonality.id} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personality;
