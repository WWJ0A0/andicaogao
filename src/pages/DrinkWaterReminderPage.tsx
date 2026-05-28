import React from 'react';
import { useNavigate } from 'react-router-dom';

const DrinkWaterReminderPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen flex justify-center bg-[#d8deea] overflow-hidden py-4">
      <div className="relative w-[393px] h-[852px] overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)] bg-[#daceff]">
        <div className="relative mt-[-10px] w-[395px] h-[862px]">
          <div className="absolute top-0 left-0 flex flex-col items-center bg-[#ffffffcc] pt-[10px] pb-[742px] w-[393px] h-[852px]">
            <div className="flex items-start self-stretch pt-[14px] pr-[14px] pb-[9px] pl-[21px]">
              <p className="w-[54px] text-center tracking-[-0.3px] text-[#222222] text-[15px] font-semibold">9:41</p>
              <img src="/images/mo9tq3e4-rn375fb.svg" className="mt-[4px] ml-[233px] w-[18px] h-[11px]" alt="cellular" />
              <img src="/images/mo9tq3e4-c2myzxb.svg" className="mt-[3px] ml-[5px] w-[16px] h-[11px]" alt="wifi" />
              <img src="/images/mo9tq3e4-946m4rq.svg" className="mt-[3px] ml-[7px] w-[24px] h-[11px]" alt="battery" />
            </div>

            <div className="relative flex items-center px-4 py-2 w-[393px] overflow-hidden">
              <button
                type="button"
                className="flex items-center justify-center border border-[#2222220d] rounded-[12px] p-[11px] w-[40px] h-[40px]"
                onClick={() => navigate('/home-lost')}
              >
                <img src="/images/mo9tq3e4-o6sadl7.svg" className="w-[20px] h-[20px]" alt="back" />
              </button>

              <div className="absolute top-[12px] left-[304px] flex items-center justify-between rounded-[12px] bg-[#7c5ae0] pr-1 pl-[7px] w-[73px] h-[32px]">
                <p className="w-[32px] text-center text-white text-[14px] font-semibold">ON</p>
                <img src="/images/mo9tq3e4-y2ono0k.svg" className="w-[24px] h-[24px]" alt="switch" />
              </div>

              <p className="absolute top-[19px] left-[150px] z-[1] w-[95px] h-[22px] leading-[22px] text-[#140707] text-[19px]">肉派小助手</p>
            </div>
          </div>

          <div className="absolute top-[754px] left-[1px] flex items-start justify-between pt-0 pr-[21px] pb-[54px] pl-5 w-[394px] h-[108px]">
            <div className="flex items-center justify-center border-2 border-[#2222221a] rounded-[16px] px-[44px] py-[11px] w-[132px] h-[54px]">
              <p className="leading-5 text-[#222222] text-[14px] font-medium">删除</p>
            </div>
            <div className="flex items-center justify-center rounded-[16px] bg-[#7c5ae0] px-[46px] py-[13px] w-[209px] h-[54px]">
              <p className="leading-5 text-white text-[14px] font-medium">分享</p>
            </div>
          </div>

          <div className="absolute bottom-0 left-[1px] flex items-start pt-[21px] pr-[131px] pb-[8px] pl-[129px] w-[394px] h-[34px]">
            <div className="rounded-[100px] bg-[#222222] w-[134px] h-[5px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinkWaterReminderPage;
