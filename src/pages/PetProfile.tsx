import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { Award, BrainCircuit, ChevronRight, Scissors, X } from 'lucide-react';

const menuItems = ['ropet 基础设置', '设置', '帮助中心', '售后服务', '关于我们'];
const DESIGNER_BADGE_EQUIPPED_KEY = 'ropet-designer-badge-equipped';

const activitySlides = [
  { id: 'brain', title: '大脑共创计划', helper: '分享体验，提出宝贵建议', action: '去共创', path: '/brain-co-creation' },
  { id: 'plush', title: '设计 Ropet 毛绒套', helper: '本期作品火热征集中', action: '去参加', path: '/plush-design' },
] as const;

const PetProfile: React.FC = () => {
  const navigate = useNavigate();
  const [showDesignerBadge, setShowDesignerBadge] = useState(false);
  const [designerBadgeEquipped, setDesignerBadgeEquipped] = useState(() => window.localStorage.getItem(DESIGNER_BADGE_EQUIPPED_KEY) !== 'false');
  const [activityIndex, setActivityIndex] = useState(0);
  const activityPointerStart = useRef<number | null>(null);
  const menuPathMap: Record<string, string> = {
    'ropet 基础设置': '/pet-basic-settings',
    '设置': '/settings',
    '帮助中心': '/help-center',
    '售后服务': '/after-sales',
    '关于我们': '/about-us',
  };

  useEffect(() => {
    const timer = window.setInterval(() => setActivityIndex((index) => (index + 1) % activitySlides.length), 4200);
    return () => window.clearInterval(timer);
  }, []);

  const activeActivity = activitySlides[activityIndex];
  const finishActivitySwipe = (clientX: number) => {
    if (activityPointerStart.current === null) return;
    const distance = clientX - activityPointerStart.current;
    activityPointerStart.current = null;
    if (Math.abs(distance) < 34) return;
    setActivityIndex((index) => (index + (distance < 0 ? 1 : -1) + activitySlides.length) % activitySlides.length);
  };

  return (
    <div className="relative w-full min-h-screen flex justify-center bg-[#d8deea] overflow-hidden py-4">
      <div className="relative w-[393px] h-[852px] overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)] bg-white">
        <div className="absolute top-0 left-0 w-[393px] h-[852px] overflow-hidden bg-white">
        <div className="absolute top-[-1px] left-0 flex items-start pt-[1px] pb-10 w-[393px] h-[318px] backdrop-blur-[1px]">
          <div className="relative flex flex-col items-start grow h-[286px] overflow-hidden bg-[#f0f0f099]">
            <div className="flex items-start self-stretch pt-[14px] pr-[14px] pb-[9px] pl-[21px]">
              <p className="w-[54px] text-center tracking-[-0.3px] text-[#19181f] text-[15px] font-semibold">9:41</p>
              <img src="/images/mo9s88nl-ptaelav.svg" className="mt-1 ml-[233px] w-[18px] h-[11px]" alt="cellular" />
              <img src="/images/mo9s88nl-e5y9xvi.svg" className="mt-[3px] ml-[5px] w-[16px] h-[11px]" alt="wifi" />
              <img src="/images/mo9s88nl-1n65kfn.svg" className="mt-[3px] ml-[7px] w-[24px] h-[11px]" alt="battery" />
            </div>

            <img src="/images/mo9s88ns-voun65i.png" className="absolute left-6 top-[82px] h-[82px] w-[82px] rounded-full bg-white p-2 shadow-[0_8px_22px_rgba(45,37,52,0.08)]" alt="avatar" />
            <div className="absolute left-[120px] top-[88px]">
              <div className="flex items-center">
                <p className="text-[29px] font-semibold leading-9 text-[#19181f]">Rihana</p>
                <img src="/images/mo9s88nl-4jln4rm.png" className="ml-1 h-5 w-5 rotate-180" alt="arrow" />
              </div>
              <button type="button" onClick={() => setShowDesignerBadge(true)} className="mt-2 flex h-6 items-center text-[11px] font-bold text-[#8a838e]" aria-label="查看限定设计师徽章">
                <Award size={14} className={`mr-1.5 ${designerBadgeEquipped ? 'text-[#e8667b]' : 'text-[#aaa4ad]'}`} strokeWidth={2.4} />
                {designerBadgeEquipped ? '限定设计师' : '限定设计师 · 未佩戴'}
                <ChevronRight size={13} className="ml-0.5" />
              </button>
            </div>

            <button
              key={activeActivity.id}
              type="button"
              onClick={() => navigate(activeActivity.path)}
              onPointerDown={(event) => { activityPointerStart.current = event.clientX; }}
              onPointerUp={(event) => finishActivitySwipe(event.clientX)}
              onPointerCancel={() => { activityPointerStart.current = null; }}
              className={`absolute left-5 top-[194px] h-[72px] w-[353px] touch-pan-y overflow-hidden rounded-[16px] px-4 text-left shadow-[0_8px_20px_rgba(65,49,79,0.12)] active:scale-[0.99] ${activeActivity.id === 'brain' ? 'bg-[#7560df] text-white' : 'bg-[#ffe461] text-[#19181f]'}`}
              aria-label={`进入${activeActivity.title}`}
            >
              <span className={`absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[12px] ${activeActivity.id === 'brain' ? 'bg-[#ff91aa] text-white' : 'bg-white/80 text-[#19181f]'}`}>
                {activeActivity.id === 'brain' ? <BrainCircuit size={23} /> : <Scissors size={22} />}
              </span>
              <span className="absolute left-[64px] top-[15px] text-[15px] font-black">{activeActivity.title}</span>
              <span className={`absolute left-[64px] top-[40px] text-[9px] font-bold ${activeActivity.id === 'brain' ? 'text-white/70' : 'text-[#6d642c]'}`}>{activeActivity.helper}</span>
              {activeActivity.id === 'plush' && <img src="/images/mo0uw8au-tlddmuo.png" alt="" className="absolute bottom-[-8px] right-[50px] h-[66px] w-[66px] object-contain" />}
              <span className={`absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full ${activeActivity.id === 'brain' ? 'bg-white/94 text-[#5b47bd]' : 'bg-[#19181f] text-white'}`}><ChevronRight size={18} /></span>
              <span className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1">
                {activitySlides.map((slide, index) => <i key={slide.id} className={`block h-1 rounded-full ${index === activityIndex ? 'w-3 bg-current' : 'w-1 bg-current opacity-35'}`} />)}
              </span>
            </button>

            <div className="absolute bottom-0 bg-[#19181f1a] w-[393px] h-px" />
          </div>
        </div>

        <div className="absolute top-[297px] left-0 flex flex-col items-start w-[393px] h-[500px] overflow-y-auto scrollbar-hide pb-[96px]">
          {menuItems.map((item) => (
            <div
              key={item}
              className="flex items-center justify-between self-stretch px-5 py-4 cursor-pointer"
              onClick={() => navigate(menuPathMap[item])}
            >
              <p className="leading-[25px] tracking-[-0.3px] text-[#19181f] text-[18px]">{item}</p>
              <div className="relative w-6 h-6">
                <img src="/images/mo9s88nl-ia9k4mf.png" className="absolute inset-0 w-6 h-6 rotate-180" alt="chevron" />
              </div>
            </div>
          ))}

          <div className="relative flex items-center justify-between self-stretch px-5 py-4 cursor-pointer" onClick={() => navigate('/version-update')}>
            <p className="leading-[25px] tracking-[-0.3px] text-[#19181f] text-[18px]">版本更新</p>
            <div className="relative w-6 h-6">
              <img src="/images/mo9s88nl-ia9k4mf.png" className="absolute inset-0 w-6 h-6 rotate-180" alt="chevron" />
            </div>
            <div className="absolute top-[18px] left-[94px] rounded-full bg-[#ff5c64] w-[6px] h-[6px]" />
          </div>
        </div>
        </div>

        <BottomNav />

        {showDesignerBadge && (
          <div className="absolute inset-0 z-[80] flex items-end bg-black/55 p-4" onClick={() => setShowDesignerBadge(false)}>
            <section className="w-full rounded-[24px] bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.25)]" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-start justify-between">
                <span className="flex h-16 w-16 -rotate-6 items-center justify-center border-[3px] border-[#19181f] bg-[#ffe632] text-[#e60012] shadow-[5px_5px_0_#19181f]">
                  <Award size={34} strokeWidth={2.6} />
                </span>
                <button type="button" onClick={() => setShowDesignerBadge(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2f0f4] text-[#343039]" aria-label="关闭徽章详情">
                  <X size={18} />
                </button>
              </div>
              <p className="mt-5 text-[10px] font-black tracking-[2px] text-[#e60012]">ROPet DESIGN HEIST</p>
              <h2 className="mt-1 text-[24px] font-black text-[#19181f]">限定设计师徽章</h2>
              <p className="mt-3 text-[13px] leading-6 text-[#77717c]">你的「莓果云朵熊」入选本期 Ropet 毛绒套设计征集，获得此限定荣誉徽章。</p>
              <div className="mt-4 rounded-[15px] bg-[#f5f2f7] px-4 py-3 text-[11px] text-[#8b8490]">获得时间：2026.09.28 · 官方活动奖励</div>
              <button
                type="button"
                onClick={() => {
                  const nextEquipped = !designerBadgeEquipped;
                  setDesignerBadgeEquipped(nextEquipped);
                  window.localStorage.setItem(DESIGNER_BADGE_EQUIPPED_KEY, String(nextEquipped));
                  setShowDesignerBadge(false);
                }}
                className={`mt-5 h-12 w-full rounded-[16px] text-[13px] font-bold ${designerBadgeEquipped ? 'border border-[#ded9e2] bg-white text-[#4f4954]' : 'bg-[#19181f] text-white'}`}
              >
                {designerBadgeEquipped ? '取下徽章' : '佩戴徽章'}
              </button>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetProfile;
