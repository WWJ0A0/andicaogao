import React from 'react';
import { useNavigate } from 'react-router-dom';

const LuckyDrawMachine: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen flex justify-center bg-[#d8deea] overflow-hidden py-4">
      <div className="relative w-[393px] h-[852px] overflow-hidden bg-[#ffe29b] rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        <div className="relative w-[422px] h-[660px]">
          <img src="/images/mo9rl5f1-oj4jzto.svg" className="absolute top-0 left-0 w-[422px] h-[660px]" alt="bg" />
          <img src="/images/mo9rl5f1-cvz7lwf.png" className="absolute top-[2px] right-[-343px] w-[838px] h-[550px] rotate-[171deg] blur-[90px]" alt="glow" />

          <div className="absolute top-0 left-[15px] flex flex-col items-center w-[393px] h-[100px]">
            <div className="flex items-start self-stretch px-[21px] pt-[14px] pb-[9px]">
              <p className="w-[54px] text-center tracking-[-0.3px] text-[#19181f] text-[15px] font-semibold">9:41</p>
              <img src="/images/mo9rl5f1-ahilkuk.svg" className="mt-[4px] ml-[233px] w-[18px] h-[11px]" alt="cellular" />
              <img src="/images/mo9rl5f1-xk8f612.svg" className="mt-[3px] ml-[5px] w-[16px] h-[11px]" alt="wifi" />
              <img src="/images/mo9rl5f1-1ovkrsk.svg" className="mt-[3px] ml-[7px] w-[24px] h-[11px]" alt="battery" />
            </div>

            <div className="relative flex items-center px-4 py-2 w-[393px]">
              <div className="absolute top-[11px] right-[11px] flex items-center justify-center rounded-[12px] bg-[#ffffff99] px-3 py-[5px] w-[40px] h-[40px] z-[2]">
                <img src="/images/mo9rl5f1-awp2i77.svg" className="w-[24px] h-[24px]" alt="sound" />
              </div>
              <button type="button" onClick={() => navigate('/interaction-history')} className="absolute top-2 left-4 rounded-[12px] w-[40px] h-[40px]">
                <img src="/images/mo9rl5f1-ohm0w5u.svg" className="w-[40px] h-[40px]" alt="back" />
              </button>
              <div className="absolute top-2 left-[151px] z-[1] inline-flex items-center gap-1 rounded-[20px] bg-[#ffffffcc] px-3 py-[5px] w-[91px] h-[40px]">
                <img src="/images/mo9rl5f5-jkxzjjy.png" className="w-[24px] h-[24px]" alt="coin" />
                <p className="leading-[22px] text-[#09121f] text-[16px] font-semibold">3456</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[-52px] left-1/2 -translate-x-1/2 w-[367px] h-[584px] overflow-hidden scale-[0.95] origin-top">
            <div className="flex items-start -mt-[9px] -mx-2 pt-[7px] pb-[1px]">
              <div className="flex flex-col items-start grow pt-[52px] pr-[39px] pb-[224px] pl-[38px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/mo9rl5f5-8b3ruud.png)' }}>
                <div className="relative ml-[37px] w-[237px] h-[21px]">
                  <div className="absolute top-0 left-0 flex items-center gap-[15px] w-[237px] h-[21px]">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={`lamp-a-${i}`} className="rounded-full bg-[#fffdc3] w-[21px] h-[21px] blur-[4px]" />
                    ))}
                  </div>
                </div>

                <div className="relative mt-2 w-[306px] h-[292px]">
                  <p className="absolute top-[66px] left-[98px] w-[112px] h-[19px] leading-[19px] text-[#fffba2] text-[16px] font-black [text-shadow:-1px_1px_3px_#ed8bbe]">可进行一次抽奖</p>
                  <div className="absolute top-0 left-0 flex items-start justify-between pt-[24px] pr-[10px] pb-[25px] pl-[10px] w-[306px] h-[292px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/mo9rl5f5-4e80pzv.png)' }}>
                    <img src="/images/mo9rl5f5-l46v56r.png" className="opacity-60 mt-[90px] w-[59px] h-[140px]" alt="left-card" />
                    <div className="flex flex-col items-center self-stretch">
                      <div className="inline-flex items-center gap-[2px] mx-[18px]">
                        <div className="w-[32px] h-[32px] bg-[url('/images/mo9rl5f5-k4gtgcw.png')] bg-no-repeat bg-[position:3px_3px] bg-[length:79.98%_83.33%] drop-shadow-[-1px_1px_4px_#ed8bbe]" />
                        <p className="leading-[39px] text-[#fffba2] text-[32px] font-black [text-shadow:-1px_1px_3px_#ed8bbe]">160</p>
                      </div>
                      <p className="mt-[2px] leading-[19px] text-[#fffba2] text-[16px] font-black [text-shadow:-1px_1px_3px_#ed8bbe]">可进行一次抽奖</p>
                      <div className="relative mt-[17px] border-[3px] border-white rounded-[16px] w-[128px] h-[166px] overflow-hidden bg-[linear-gradient(180deg,#ffe667_0%,#ffa260_100%)]">
                        <img src="/images/mo9rl5f1-vnjo5ar.png" className="absolute top-[-46px] left-[-10px] w-[157px] h-[245px] rotate-180" alt="union" />
                        <div className="absolute top-[110px] left-[44px] flex items-start pt-[2px] pr-[2px] pl-[5px] w-[36px] h-[15px]">
                          <img src="/images/mo9rl5f5-hmbnjvj.png" className="w-[26px] h-[13px]" alt="logo-small" />
                          <img src="/images/mo9rl5f1-19f5a2r.svg" className="mt-[1px] ml-[1px] w-[3px] h-[3px]" alt="dot" />
                        </div>
                        <img src="/images/mo9rl5f5-tnchsv9.png" className="absolute top-[42px] left-[28px] w-[67px] h-[67px]" alt="logo-main" />
                      </div>
                    </div>
                    <img src="/images/mo9rl5f5-be8ih6y.png" className="opacity-60 mt-[90px] w-[59px] h-[140px]" alt="right-card" />
                  </div>
                  <div className="absolute bottom-[-69px] left-[212px] flex items-center pt-[5px] pr-[6px] pb-[5px] pl-[6px] w-[71px] h-[71px]">
                    <img src="/images/mo9rl5f5-1uz464s.png" className="w-[59px] h-[61px]" alt="hand" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-[87px] w-full text-center text-[14px] leading-5">
          <span className="text-[#7652eb99]">*Distance to obtaining high-quality items </span>
          <span className="text-[#7652eb] font-medium">02/60</span>
        </p>

        <div className="flex items-start self-stretch mt-[51px] -mx-[1px] pt-[21px] pr-[131px] pb-[8px] pl-[129px]">
          <div className="rounded-[100px] bg-black w-[134px] h-[5px]" />
        </div>

        <div className="absolute top-[62px] right-[11px] flex items-center justify-center rounded-[12px] bg-[#ffffff99] px-3 py-[5px] w-[40px] h-[40px]">
          <img src="/images/mo9rl5f1-xojuug6.svg" className="w-[24px] h-[24px]" alt="music" />
        </div>
      </div>
    </div>
  );
};

export default LuckyDrawMachine;
