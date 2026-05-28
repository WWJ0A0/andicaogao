import React from 'react';
import { useNavigate } from 'react-router-dom';

const InteractionHistory: React.FC = () => {
  const navigate = useNavigate();
  const rewardCards = [
    { title: '首次绑定', progress: '(0/1)', image: '/images/mo9rd75i-r68wy29.png', reward: '已达成', done: true },
    { title: '抚摸', progress: '(0/20)', image: '/images/mo9rd75i-orb75wb.png', reward: '160', done: false },
    { title: '比心', progress: '(0/3)', image: '/images/mo9rd75i-xx1norg.png', reward: '160', done: false },
    { title: '夸夸TA', progress: '(0/20)', image: '/images/mo9rd75d-zy2w9o1.png', reward: '160', done: false },
    { title: '对TA笑', progress: '(0/3)', image: '/images/mo9rd75i-h7o2101.png', reward: '160', done: false },
    { title: '注视', progress: '(0/20)', image: '/images/mo9rd75i-wpyawol.png', reward: '160', done: false },
    { title: '跳舞', progress: '(0/3)', image: '/images/mo9rd75i-3w5tspg.png', reward: '160', done: false },
    { title: '喂食', progress: '(0/3)', image: '/images/mo9rd75i-h88jk1n.png', reward: '160', done: false },
    { title: '给TA点赞', progress: '(0/20)', image: '/images/mo9rd75d-zy2w9o1.png', reward: '160', done: false },
  ];

  return (
    <div className="relative w-full min-h-screen flex justify-center bg-[#d8deea] overflow-hidden py-4">
      <div className="relative w-[393px] h-[852px] overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)] bg-[#fffbfb]">
        <div className="relative mt-[-36px] w-[321px] h-[393px] mx-auto">
          <div className="absolute top-0 left-0 flex items-start w-[321px] h-[393px] overflow-hidden rotate-[-90deg]">
            <img src="/images/mo9rd75d-q3w7mpv.png" className="mt-[-178px] ml-[-13px] w-[386px] h-[764px]" alt="bg-stars" />
          </div>

          <div className="absolute top-[36px] right-[-36px] w-[393px] h-[100px] bg-[linear-gradient(0deg,#fffbfbb0_32.74%,#fffbfb_67.57%)]">
            <div className="flex items-start px-[21px] pt-[14px] pb-[9px]">
              <p className="w-[54px] text-center tracking-[-0.3px] text-[#19181f] text-[15px] font-semibold">9:41</p>
              <img src="/images/mo9rd75d-rolmfhw.svg" className="mt-[4px] ml-[233px] w-[18px] h-[11px]" alt="cellular" />
              <img src="/images/mo9rd75d-dlpls1i.svg" className="mt-[3px] ml-[5px] w-[16px] h-[11px]" alt="wifi" />
              <img src="/images/mo9rd75d-o8twhwy.svg" className="mt-[3px] ml-[7px] w-[24px] h-[11px]" alt="battery" />
            </div>

            <div className="flex items-center justify-between px-4 py-[10px] pl-[114px] h-[56px]">
              <div className="rounded-[12px] bg-[#2222220d] px-3 py-[7px]">
                <p className="leading-[18px] text-[13px]">
                  <span className="text-[#22222266]">当前总互动分：</span>
                  <span className="text-[#9576f0] font-medium">123456</span>
                </p>
              </div>
              <button type="button" className="border border-[#0000000d] rounded-[12px] px-[11px] py-[7px] w-[56px]">
                <p className="leading-5 text-[#19181f] text-[14px] font-medium">规则</p>
              </button>
            </div>
          </div>

          <div className="absolute top-[156px] left-[88px] flex flex-col items-center w-[145px] h-[218px] gap-[2px]">
            <img src="/images/mo9rd75i-a8zyjd2.png" className="w-[123px] h-[163px]" alt="jar" />
            <div className="flex flex-col items-center w-full">
              <p className="leading-[36px] text-[32px] font-bold text-transparent bg-clip-text bg-[linear-gradient(90deg,#e56eff_0%,#7c5ae0_44.71%,#4ec2f2_96.63%)]">360</p>
              <p className="text-center text-[#19181f66] text-[12px]">每日互动分上限:850</p>
            </div>
          </div>
        </div>

        <div className="relative mt-[-9px] mx-4 w-[361px] h-[476px]">
          <div className="absolute top-0 left-0 w-[361px] h-[476px]">
            <div className="absolute top-0 left-0 rounded-[16px] pt-4 pr-4 pb-[127px] pl-4 w-[361px] h-[203px] bg-[linear-gradient(180deg,#b3a2ff_-5.87%,#d6cdff_25.2%,#f9f9f9_100%)]">
              <div className="flex items-start justify-between border border-white rounded-[12px] bg-[#ffffffe5] pt-[9px] pr-[13px] pb-[7px] pl-[11px] w-[329px]">
                <div className="flex flex-col items-start">
                  <p className="leading-[14px] text-[#222222cc] text-[12px] font-medium">已累计可领积分</p>
                  <div className="inline-flex items-center gap-1 mt-1 mr-[29px]">
                    <img src="/images/mo9rd75i-9va0v7t.png" className="w-[18px] h-[18px]" alt="star" />
                    <p className="leading-6 text-[#222222] text-[20px] font-semibold">120</p>
                  </div>
                </div>
                <button type="button" className="mt-1 rounded-[8px] bg-[#22222233] px-[13px] py-[6px]">
                  <p className="leading-5 text-white text-[14px] font-medium">一键领取</p>
                </button>
              </div>
            </div>

            <div className="absolute top-[92px] left-[17px] w-[328px] h-[372px] overflow-y-auto scrollbar-hide">
              <div className="flex flex-wrap content-start items-start gap-4 w-[328px] min-h-[1029px]">
                {rewardCards.map((card, index) => (
                  <div key={`${card.title}-${index}`} className="flex flex-col items-center rounded-[12px] shadow-[0_2px_4px_0_#ebe8f8] bg-white pt-[20px] pr-[16px] pb-[10px] pl-[16px] w-[156px]">
                    <img src={card.image} className="w-[90px] h-[71px] object-contain" alt={card.title} />
                    <p className="mt-[9px] leading-5 text-[#222222] text-[14px] font-medium">{card.title}</p>
                    <p className="mt-[1px] leading-[17px] text-[#22222266] text-[12px] font-medium">{card.progress}</p>
                    <div
                      className={`mt-[9px] flex items-center justify-center rounded-[10px] w-[124px] h-[36px] ${
                        card.done
                          ? 'bg-[linear-gradient(180deg,#9576f066_26.56%,#7c5ae066_100%)]'
                          : 'bg-[linear-gradient(180deg,#9576f0_26.56%,#7c5ae0_100%)]'
                      }`}
                    >
                      {card.done ? (
                        <p className="leading-5 text-white text-[14px] font-medium">已达成</p>
                      ) : (
                        <div className="flex items-center gap-1">
                          <img src={index === 8 ? '/images/mo9rd75i-nu85rc4.png' : '/images/mo9rd75i-9va0v7t.png'} className="w-[20px] h-[20px]" alt="star" />
                          <p className="leading-5 text-white text-[14px] font-medium">{card.reward}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute right-[-17px] bottom-[-28px] flex flex-col items-center bg-[#fdfdfd] w-[394px] h-[86px] backdrop-blur-[18px]">
            <div className="flex items-center justify-center gap-[52px] mt-[-7px] rounded-[40px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] bg-[#ffffffcf] px-[50px] py-[8px] pl-[45px] w-[364px] h-[54px]">
              <img src="/images/mo9rd75d-cwkznid.svg" className="w-[32px] h-[32px] opacity-50 transition-opacity duration-300 cursor-pointer" alt="首页" onClick={() => navigate('/')} />
              <img src="/images/mo9rd75d-1l02qxz.svg" className="w-[32px] h-[32px] opacity-100 transition-opacity duration-300" alt="互动历史" />
              <img src="/images/mo9rd75d-rhpdjtg.svg" className="w-[32px] h-[32px] opacity-50 transition-opacity duration-300 cursor-pointer" alt="互动" onClick={() => navigate('/nest')} />
              <div className="relative w-[32px] h-[32px] cursor-pointer" onClick={() => navigate('/pet-profile')}>
                <div className="relative w-[32px] h-[32px] bg-contain bg-center bg-no-repeat opacity-50 transition-opacity duration-300" style={{ backgroundImage: 'url(/images/mo9rd75d-ln51fnl.svg)' }}>
                  <div className="absolute top-0 right-0 rounded bg-[#ff5c64] px-[2px] w-[8px] h-[8px]" />
                </div>
              </div>
            </div>
            <div className="flex items-start self-stretch mt-[5px] px-[131px] py-[21px] pl-[129px]">
              <div className="rounded-[100px] bg-black w-[134px] h-[5px]" />
            </div>
          </div>
        </div>

        <button type="button" className="absolute top-[251px] left-[315px] w-[58px] h-[70px]" onClick={() => navigate('/lucky-draw-2')}>
          <img
            src="/images/mo9rd75i-gposgtz.png"
            className="absolute top-0 left-[4px] w-[50px] h-[62px] cursor-pointer"
            alt="抽奖机"
            onClick={() => navigate('/lucky-draw-2')}
          />
          <div className="absolute top-[49px] left-0 rounded-[20px] bg-[#9475ef] px-[18px] py-[1px] w-[58px] h-[22px]">
            <p className="leading-5 text-white text-[11px] font-medium">抽奖</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default InteractionHistory;
