import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { Award, X } from 'lucide-react';

const menuItems = ['ropet 基础设置', '设置', '帮助中心', '售后服务', '关于我们'];

const PetProfile: React.FC = () => {
  const navigate = useNavigate();
  const [showDesignerBadge, setShowDesignerBadge] = useState(false);
  const menuPathMap: Record<string, string> = {
    'ropet 基础设置': '/pet-basic-settings',
    '设置': '/settings',
    '帮助中心': '/help-center',
    '售后服务': '/after-sales',
    '关于我们': '/about-us',
  };

  return (
    <div className="relative w-full min-h-screen flex justify-center bg-[#d8deea] overflow-hidden py-4">
      <div className="relative w-[393px] h-[852px] overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)] bg-white">
        <div className="absolute top-0 left-0 w-[393px] h-[852px] overflow-hidden bg-white">
        <div className="absolute top-[-1px] left-0 flex items-start pt-[1px] pb-10 w-[393px] h-[318px] backdrop-blur-[1px]">
          <div className="flex flex-col items-start grow h-[277px] bg-[#f0f0f099]">
            <div className="flex items-start self-stretch pt-[14px] pr-[14px] pb-[9px] pl-[21px]">
              <p className="w-[54px] text-center tracking-[-0.3px] text-[#19181f] text-[15px] font-semibold">9:41</p>
              <img src="/images/mo9s88nl-ptaelav.svg" className="mt-1 ml-[233px] w-[18px] h-[11px]" alt="cellular" />
              <img src="/images/mo9s88nl-e5y9xvi.svg" className="mt-[3px] ml-[5px] w-[16px] h-[11px]" alt="wifi" />
              <img src="/images/mo9s88nl-1n65kfn.svg" className="mt-[3px] ml-[7px] w-[24px] h-[11px]" alt="battery" />
            </div>

            <div className="flex flex-col items-start mt-[59px] mr-[212px] ml-6 gap-2">
              <img src="/images/mo9s88ns-voun65i.png" className="rounded-[43px] p-3 w-[86px] h-[86px]" alt="avatar" />
              <div className="relative flex flex-col items-start gap-1 w-[157px]">
                <p className="leading-10 text-[#19181f] text-[32px] font-semibold">Rihana</p>
                <img src="/images/mo9s88nl-4jln4rm.png" className="absolute top-[10px] left-[113px] w-6 h-6 rotate-180" alt="arrow" />
                <button
                  type="button"
                  onClick={() => setShowDesignerBadge(true)}
                  className="mt-1 flex h-7 items-center border-2 border-[#19181f] bg-[#ffe632] px-2 text-[10px] font-black text-[#19181f] shadow-[3px_3px_0_#19181f]"
                  aria-label="查看限定设计师徽章"
                >
                  <Award size={14} className="mr-1 text-[#e60012]" strokeWidth={2.8} />
                  限定设计师
                </button>
              </div>
            </div>

            <div className="mt-10 bg-[#19181f1a] w-[393px] h-px" />
          </div>
        </div>

        <div className="absolute top-[297px] left-0 flex flex-col items-start w-[393px] h-[500px] gap-1 overflow-y-auto scrollbar-hide pb-[96px]">
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
              <button type="button" onClick={() => setShowDesignerBadge(false)} className="mt-5 h-12 w-full rounded-[16px] bg-[#19181f] text-[13px] font-bold text-white">收下徽章</button>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetProfile;
