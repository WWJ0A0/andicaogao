import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, LockKeyhole, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EyeItem {
  id: number;
  previewImg: string;
  badge: 'gold' | 'blue' | 'purple' | null;
  locked: boolean;
}

const eyeOptions: EyeItem[] = [
  { id: 1, previewImg: '/images/moiedap1-f2gtmg8.png', badge: 'gold', locked: false },
  { id: 2, previewImg: '/images/moiedap1-xzckozh.png', badge: 'blue', locked: false },
  { id: 3, previewImg: '/images/moiedap1-qz3xk9i.png', badge: 'purple', locked: false },
  { id: 4, previewImg: '/images/moiedap1-mv1a2by.png', badge: 'purple', locked: false },
  { id: 5, previewImg: '/images/moiedap1-zzutaa1.png', badge: 'blue', locked: true },
  { id: 6, previewImg: '/images/moiedap1-8ejuy2s.png', badge: 'purple', locked: true },
  { id: 7, previewImg: '/images/moiedap1-bw1zyjm.png', badge: 'gold', locked: true },
  { id: 8, previewImg: '/images/moiedap2-dy43oj7.png', badge: 'gold', locked: true },
  { id: 9, previewImg: '/images/moiedap1-bw1zyjm.png', badge: 'gold', locked: true },
];

const categories = ['水果硬糖系列', '节日限定系列', '赛博小猫', '梦境星球'];

const badgeStyle = {
  gold: 'bg-[#ffe1a1] text-[#ff9e19]',
  blue: 'bg-[#dbe7ff] text-[#779dff]',
  purple: 'bg-[#dfd3ff] text-[#a07cff]',
};

function EyeBadge({ type }: { type: NonNullable<EyeItem['badge']> }) {
  return (
    <div className={`absolute left-[8px] top-[8px] w-6 h-6 rounded-full ${badgeStyle[type]} flex items-center justify-center text-[13px] font-black shadow-[0_4px_10px_rgba(96,80,150,0.16)]`}>
      ◆
    </div>
  );
}

const EyeChange: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEyeId, setSelectedEyeId] = useState(1);
  const [activeCategory, setActiveCategory] = useState(0);

  const selectedEye = eyeOptions.find((eye) => eye.id === selectedEyeId) || eyeOptions[0];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const handleEyeSelect = (id: number, locked: boolean) => {
    if (locked) return;
    setSelectedEyeId(id);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#d8deea] overflow-hidden flex justify-center py-4">
      <div className="relative w-[393px] h-[852px] mx-auto overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)] bg-white">
        <div className="absolute inset-x-0 top-0 bg-cover bg-center" style={{ height: 452, backgroundImage: "url('/images/moiedap1-dbc8fds.png')" }} />

        <div className="relative z-20 flex items-center justify-between px-[28px] pt-[18px] text-[#19181f]">
          <div className="text-[16px] font-semibold">9:41</div>
          <div className="flex items-center gap-[5px]">
            <div className="flex items-end gap-[2px]">
              <span className="block w-[3px] h-[7px] rounded-full bg-[#19181f]" />
              <span className="block w-[3px] h-[9px] rounded-full bg-[#19181f]" />
              <span className="block w-[3px] h-[12px] rounded-full bg-[#19181f]" />
              <span className="block w-[3px] h-[15px] rounded-full bg-[#19181f]" />
            </div>
            <div className="w-[18px] h-[12px] rounded-t-full border-t-[3px] border-[#19181f]" />
            <div className="w-[25px] h-[13px] rounded-[4px] border-[2px] border-[#19181f] relative">
              <div className="absolute top-[2px] right-[-4px] w-[2px] h-[5px] rounded-r bg-[#19181f]" />
            </div>
          </div>
        </div>

        <div className="relative z-20 flex items-center justify-between px-5 pt-[18px]">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-10 h-10 flex items-center justify-center text-white active:scale-95 transition-transform"
            aria-label="返回"
          >
            <ArrowLeft size={30} strokeWidth={2.2} />
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="h-10 min-w-[68px] rounded-full bg-[#8d66ef] px-4 text-[16px] font-semibold text-white shadow-[0_8px_18px_rgba(141,102,239,0.28)] active:scale-95 transition-transform"
          >
            使用
          </button>
        </div>

        <div className="absolute bg-contain bg-center bg-no-repeat pointer-events-none" style={{ top: 122, left: -86, width: 560, height: 360, backgroundImage: "url('/images/moiedap1-khtkfqv.png')" }} />

        <div className="absolute left-5 z-30 flex flex-col items-center gap-3" style={{ top: 294 }}>
          <button className="w-10 h-10 rounded-full bg-white shadow-[0_6px_14px_rgba(20,16,32,0.12)] flex items-center justify-center text-[20px]">
            <span className="relative block w-7 h-4">
              <span className="absolute left-0 top-0 w-4 h-4 rounded-full border-2 border-[#19181f] bg-white">
                <span className="absolute left-[5px] top-[5px] w-[5px] h-[5px] rounded-full bg-[#19181f]" />
              </span>
              <span className="absolute right-0 top-0 w-4 h-4 rounded-full border-2 border-[#19181f] bg-white">
                <span className="absolute left-[5px] top-[5px] w-[5px] h-[5px] rounded-full bg-[#19181f]" />
              </span>
            </span>
          </button>
          <button className="w-10 h-10 rounded-full bg-white/85 shadow-[0_6px_14px_rgba(20,16,32,0.08)] flex items-center justify-center text-[18px] opacity-70">
            <span className="relative block w-7 h-4">
              <span className="absolute left-0 top-0 w-4 h-4 rounded-full border-2 border-[#a3a0aa] bg-white">
                <span className="absolute left-[4px] top-[6px] w-[6px] h-[2px] rounded-full bg-[#a3a0aa]" />
              </span>
              <span className="absolute right-0 top-0 w-4 h-4 rounded-full border-2 border-[#a3a0aa] bg-white">
                <span className="absolute left-[4px] top-[6px] w-[6px] h-[2px] rounded-full bg-[#a3a0aa]" />
              </span>
            </span>
          </button>
        </div>

        <div className="absolute right-5 z-30" style={{ top: 358 }}>
          <button className="w-10 h-10 rounded-full bg-white/90 shadow-[0_6px_14px_rgba(20,16,32,0.12)] flex items-center justify-center">
            <Heart className="w-[22px] h-[22px] fill-[#ff86bf] text-[#ff86bf]" />
          </button>
        </div>

        <div className="absolute left-1/2 z-30 -translate-x-1/2 rounded-[14px] bg-white/60 px-4 py-[6px] text-[14px] leading-4 text-[#19181f66] backdrop-blur-sm" style={{ top: 364 }}>
          青柠乐园
        </div>

        <div className="absolute left-0 right-0 z-40 rounded-t-[30px] bg-white shadow-[0_-10px_32px_rgba(25,24,31,0.06)]" style={{ top: 409, height: 443 }}>
          <div className="relative border-b border-[#19181f0d]" style={{ height: 64 }}>
            <button className="absolute w-8 h-8 flex items-center justify-center" style={{ left: 20, top: 16, color: '#85818c' }}>
              <Menu size={22} />
            </button>
            <button className="absolute w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ left: 59, top: 18, color: '#9c98a3', border: '1px solid #b9b5bf' }}>
              MY
            </button>

            <div className="absolute right-0 flex items-center gap-5 overflow-x-auto scrollbar-hide pr-8" style={{ left: 100, top: 0, height: 64 }}>
              {categories.map((category, index) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(index)}
                  className={`relative shrink-0 text-[16px] leading-[20px] whitespace-nowrap flex items-center ${activeCategory === index ? 'font-semibold' : 'font-medium'}`}
                  style={{ height: 64, color: activeCategory === index ? '#19181f' : '#a19ca8' }}
                >
                  {category}
                  {activeCategory === index && <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-[#19181f]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto scrollbar-hide px-4 pt-4 pb-10" style={{ height: 379 }}>
            <div className="grid grid-cols-3 gap-x-[16px] gap-y-[18px]">
              {eyeOptions.map((eye) => (
                <button
                  key={eye.id}
                  type="button"
                  onClick={() => handleEyeSelect(eye.id, eye.locked)}
                  className="relative flex items-center justify-center overflow-hidden transition-transform active:scale-95"
                  style={{
                    width: 108,
                    height: 108,
                    borderRadius: 20,
                    background: eye.locked ? '#727272' : '#f6f5f7',
                    border: selectedEye.id === eye.id ? '3px solid #8d66ef' : '3px solid transparent',
                  }}
                >
                  <img
                    src={eye.previewImg}
                    alt=""
                    className={`object-contain ${eye.locked ? 'opacity-45 blur-[0.4px]' : ''}`}
                    style={{ width: 96, height: 96 }}
                  />
                  {eye.badge && <EyeBadge type={eye.badge} />}
                  {eye.locked && (
                    <div className="absolute inset-0 rounded-[20px] bg-[#19181f55] flex items-center justify-center">
                      <LockKeyhole className="w-8 h-8 text-white" fill="white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute left-1/2 bottom-[8px] -translate-x-1/2 w-[134px] h-[5px] rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
};

export default EyeChange;
