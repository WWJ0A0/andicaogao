import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CheckIcon {
  type: 'plain' | 'blue' | 'purple';
  icon: string;
}

interface EyeItem {
  id: number;
  previewImg: string;
  check: CheckIcon | null;
  locked: boolean;
}

const eyeOptions: EyeItem[] = [
  { id: 1, previewImg: '/images/moiedap1-f2gtmg8.png', check: { type: 'plain', icon: '/images/moiedaof-z9e73i8.svg' }, locked: false },
  { id: 2, previewImg: '/images/moiedap1-xzckozh.png', check: { type: 'blue', icon: '/images/moiedaof-vcdplkv.svg' }, locked: false },
  { id: 3, previewImg: '/images/moiedap1-qz3xk9i.png', check: { type: 'purple', icon: '/images/moiedaof-cwvtwy2.svg' }, locked: false },
  { id: 4, previewImg: '/images/moiedap1-mv1a2by.png', check: { type: 'purple', icon: '/images/moiedaog-oi3k0ca.svg' }, locked: false },
  { id: 5, previewImg: '/images/moiedap1-zzutaa1.png', check: { type: 'blue', icon: '/images/moiedaog-o3ct607.svg' }, locked: true },
  { id: 6, previewImg: '/images/moiedap1-8ejuy2s.png', check: { type: 'purple', icon: '/images/moiedaog-tit2auz.svg' }, locked: true },
  { id: 7, previewImg: '/images/moiedap1-bw1zyjm.png', check: { type: 'plain', icon: '/images/moiedaog-5v6u2u9.svg' }, locked: true },
  { id: 8, previewImg: '/images/moiedap2-dy43oj7.png', check: { type: 'plain', icon: '/images/moiedaog-ewzwf3j.svg' }, locked: true },
  { id: 9, previewImg: '/images/moiedap1-bw1zyjm.png', check: null, locked: true },
];

const categories = ['Fruit Hard Candy', 'Flame Glow', 'Green Fantasy Paradise'];

function CheckIconDisplay({ check }: { check: CheckIcon }) {
  if (check.type === 'blue') {
    return (
      <div className="absolute top-[8px] left-[8px] flex items-center rounded-xl bg-[#dae6ff] p-[2px] w-6 h-6">
        <img src={check.icon} className="w-5 h-5 overflow-hidden" alt="" />
      </div>
    );
  }
  if (check.type === 'purple') {
    return (
      <div className="absolute top-[8px] left-[8px] flex items-center rounded-xl bg-[#d8ccff] p-[3px] w-6 h-6">
        <img src={check.icon} className="w-[17px] h-[17px] overflow-hidden" alt="" />
      </div>
    );
  }
  return (
    <img src={check.icon} className="absolute top-[8px] left-[8px] rounded-xl w-6 h-6" alt="" />
  );
}

const EyeChange: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEyeId, setSelectedEyeId] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  const handleEyeSelect = (id: number, locked: boolean) => {
    if (locked) return;
    setSelectedEyeId(id);
  };

  const handleUseIt = () => {
    navigate('/');
  };

  return (
    <div className="relative w-full min-h-screen max-w-[393px] mx-auto bg-white overflow-hidden" style={{ height: '852px' }}>
      {/* Top full-height container */}
      <div className="absolute top-0 left-0 w-[393px] h-[852px]">
        {/* Header section - 488px with background */}
        <div
          className="flex flex-col absolute top-0 left-0 w-[393px] h-[488px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/moiedap1-dbc8fds.png')" }}
        >
          {/* Status bar */}
          <div className="flex items-start shrink-0 px-[14px] pb-[9px] pt-[14px] pl-[21px]">
            <p className="w-[54px] text-center text-[#19181f] text-[15px] font-semibold tracking-[-0.3px]">9:41</p>
            <img src="/images/moiedaof-p1w8cyj.svg" className="ml-auto mt-[4px] w-[18px] h-[11px]" alt="" />
            <img src="/images/moiedaof-ioynu1g.svg" className="ml-[5px] mt-[3px] w-[16px] h-[11px]" alt="" />
            <img src="/images/moiedaof-phchl8z.svg" className="ml-[7px] mt-[3px] w-[24px] h-[11px]" alt="" />
          </div>

          {/* Navigation bar */}
          <div className="relative flex items-center justify-between shrink-0 px-4 py-2 min-w-[393px] overflow-hidden">
            <img
              src="/images/moiedaof-0mseqm0.svg"
              className="w-10 h-10 cursor-pointer shrink-0"
              alt="返回"
              onClick={() => navigate('/')}
            />
            <div
              className="inline-flex items-center justify-center shrink-0 gap-[10px] rounded-[44px] bg-[#9175ef] py-[9px] px-3 cursor-pointer"
              onClick={handleUseIt}
            >
              <span className="text-white text-[16px] font-semibold leading-[22px]">Use it</span>
            </div>
            {/* Tab selector - absolute centered */}
            <div className="absolute top-3 left-[121px] flex items-center justify-between rounded-[20px] bg-[#2222221a] w-[152px] h-9 pl-[2px] backdrop-blur-[16px]">
              <div className="flex items-center rounded-[20px] bg-white px-[23px]">
                <span className="text-[14px] font-medium text-[#222222] leading-[32px]">眼睛</span>
              </div>
              <span className="w-[74px] text-center text-[14px] text-[#222222cc] leading-[32px]">声音</span>
            </div>
          </div>
        </div>

        {/* Pet area - 425px, positioned at top:142px */}
        <div className="absolute top-[142px] left-0 w-[393px] h-[425px]">
          <div
            className="flex flex-grow items-start bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/moiedap1-khtkfqv.png')",
              margin: '-77px -86px 0px -91px',
              padding: '232px 106px 178px 111px',
            }}
          >
            {/* Left icon column */}
            <div className="flex flex-col items-center self-stretch">
              <div className="flex items-center self-stretch rounded-[20px] bg-white p-[6px]">
                <img src="/images/moiedaof-hyo0mf6.svg" className="w-7 h-7" alt="" />
              </div>
              <div className="flex items-center self-stretch mt-3 rounded-[20px] bg-[#ffffffcc] p-[6px]">
                <img src="/images/moiedaof-t6tizrq.svg" className="w-7 h-7" alt="" />
              </div>
            </div>
            {/* Name tag */}
            <div className="inline-flex items-center justify-center gap-3 mt-16 ml-[68px] rounded-2xl bg-[#ffffff66] py-[6px] px-3 overflow-hidden">
              <span className="text-[14px] leading-4 text-[#19181f66]">&nbsp;Celestia Sapphire</span>
            </div>
            {/* Right icon */}
            <div className="flex items-center mt-[52px] ml-[62px] rounded-[20px] bg-[#f4f3f4] p-2">
              <img src="/images/moiedaof-azrwdfn.svg" className="w-6 h-6" alt="" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom panel - 458px, positioned at bottom:-15px */}
      <div className="flex flex-col items-center absolute bottom-[-15px] left-0 w-[393px] h-[458px] overflow-hidden">
        {/* Category bar */}
        <div className="flex flex-col items-start self-stretch bg-white pt-3 pr-[13px] pl-[51px] overflow-hidden">
          <div className="relative w-[329px] h-10">
            {/* Tab row */}
            <div className="absolute top-0 left-0 flex items-center rounded-[20px] w-[329px] h-10 overflow-hidden">
              <img src="/images/moiedaof-xp5ijxp.svg" className="w-10 h-10 shrink-0" alt="" />
              {categories.map((cat, idx) => (
                <div
                  key={cat}
                  className="inline-flex relative items-center justify-center gap-[10px] ml-2 rounded-[20px] py-[10px] px-1 cursor-pointer"
                  onClick={() => setActiveTab(idx)}
                >
                  <span
                    className={`leading-5 tracking-[-0.16px] text-[16px] ${
                      idx === activeTab ? 'text-[#19181f] font-medium' : 'text-[#19181f66]'
                    }`}
                  >
                    {cat}
                  </span>
                  {idx < 2 && (
                    <div className="absolute top-[7px] left-auto right-[-3px] rounded-full w-[6px] h-[6px] bg-[#ff5c64]" />
                  )}
                </div>
              ))}
            </div>
            {/* Filter icon */}
            <div className="absolute top-0 -left-[39px] flex items-center gap-[10px] rounded-[20px] p-2 w-10 h-10 cursor-pointer">
              <img src="/images/moiedaof-h2n4moc.svg" className="w-6 h-6 overflow-hidden" alt="" />
            </div>
          </div>
          <div className="mt-[9px] ml-[70px] bg-[#19181f] w-20 h-[3px]" />
        </div>

        {/* Eye grid area - 394px */}
        <div className="relative bg-white w-[393px] h-[394px] overflow-hidden">
          {/* Grid of eye options */}
          <div className="absolute top-[22px] left-4 flex flex-wrap content-center items-center gap-[18px] w-[360px] h-[360px]">
            {eyeOptions.map((eye) => (
              <div
                key={eye.id}
                className="relative shrink-0 rounded-[20px] w-[108px] h-[108px] cursor-pointer"
                onClick={() => handleEyeSelect(eye.id, eye.locked)}
              >
                {/* Eye preview image */}
                <img src={eye.previewImg} className="absolute top-[14px] left-[14px] w-20 h-20" alt="" />

                {/* Check icon */}
                {eye.check && !eye.locked && <CheckIconDisplay check={eye.check} />}

                {/* Lock overlay */}
                {eye.locked && (
                  <>
                    {eye.check && <CheckIconDisplay check={eye.check} />}
                    <div className="absolute inset-[1px] flex items-center justify-center rounded-[20px] bg-[#19181f99]">
                      <img src="/images/moiedaog-6wvmonh.svg" className="w-[18px] h-[21px]" alt="" />
                    </div>
                  </>
                )}

                {/* Selection ring */}
                {selectedEyeId === eye.id && (
                  <div className="absolute -inset-[6px] rounded-[24px] border-3 border-[#7652ebcc] pointer-events-none" />
                )}
              </div>
            ))}
          </div>

          {/* Home indicator */}
          <div className="flex absolute bottom-[15px] left-0 items-start pt-[21px] pb-2 pl-[131px] pr-[129px] w-[393px] h-[34px]">
            <div className="rounded-[100px] bg-black w-[134px] h-[5px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EyeChange;