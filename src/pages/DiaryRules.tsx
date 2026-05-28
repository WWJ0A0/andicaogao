import React from 'react';
import { useNavigate } from 'react-router-dom';

const DiaryRules: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden flex flex-col items-center">
      <div className="relative w-[393px] h-[852px] bg-white shadow-lg overflow-y-auto scrollbar-hide">
        
        {/* Status Bar */}
        <div className="flex w-full pt-[14px] pr-[14px] pb-[9px] pl-[21px] justify-between items-center z-50 sticky top-0 bg-white">
          <span className="w-[54px] text-[15px] text-[#222222] font-semibold tracking-[-0.3px] text-center">9:41</span>
          <div className="flex pr-[14px]">
            <img src="/images/mo1dvveo-gfp0bx6.svg" alt="Cellular" className="w-[18px] h-[11px] mt-[4px]" />
            <img src="/images/mo1dvveo-fmu3p8n.svg" alt="Wifi" className="w-[16px] h-[11px] mt-[3px] ml-[5px]" />
            <img src="/images/mo1dvveo-vt2ujpm.svg" alt="Battery" className="w-[24px] h-[11px] mt-[3px] ml-[7px]" />
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center w-full px-[16px] py-[8px] z-50 sticky top-[34px] bg-white">
          <div 
            className="w-[40px] h-[40px] flex items-center justify-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src="/images/mo1dvveo-0d6qill.svg" alt="Close" className="w-[24px] h-[24px]" />
          </div>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] text-[#222222] font-medium leading-[32px]">派派日记怎么玩？</h1>
        </div>

        {/* Content Container */}
        <div className="flex flex-col px-[20px] pt-[20px] pb-[40px] gap-[24px]">
          
          {/* Section 01 */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex flex-col">
              <div className="relative w-[160px] h-[28px]">
                <img src="/images/mo1dvveo-an5xr8s.svg" alt="Highlight" className="absolute top-[15px] left-[12px] w-[130px] h-[5px]" />
                <h2 className="absolute top-0 left-0 text-[18px] text-[#222222] font-bold leading-[28px] font-['JinNanJunJunTi']">01.先打开日记开关</h2>
              </div>
              <p className="text-[12px] text-[#222222cc] leading-[22px] mt-[10px]">日记开关在详情页右上角，打开后 ropet 才可以写日记。</p>
            </div>
            
            {/* Demo Pill */}
            <div 
              className="relative w-[295px] h-[55px] bg-center bg-cover rounded-[16px] flex items-center px-[22px]"
              style={{ backgroundImage: 'url(/images/mo1dvveo-11ydx8h.svg)' }}
            >
              <div className="flex items-center justify-center w-[28px] h-[28px] border border-[#2222220d] rounded-[8px] bg-white">
                <img src="/images/mo1dvveo-sixy90d.svg" alt="Icon" className="w-[14px] h-[14px]" />
              </div>
              <span className="text-[13px] text-[#222222] font-medium ml-[16px] tracking-[0.69px]">画画日记</span>
              
              <div className="absolute right-[22px] flex items-center justify-between w-[51px] h-[22px] bg-[#7c5ae0] rounded-[8px] px-[4px]">
                <span className="text-[10px] text-white font-semibold ml-[2px]">ON</span>
                <img src="/images/mo1dvveo-q8f6aup.svg" alt="Toggle" className="w-[17px] h-[17px]" />
              </div>
              
              {/* Sparkles */}
              <img src="/images/mo1dvveo-157m49a.png" alt="Sparkle" className="absolute top-[12px] left-[214px] w-[9px] h-[10px]" />
              <img src="/images/mo1dvveo-fsb1eaf.png" alt="Sparkle" className="absolute top-[11px] left-[207px] w-[5px] h-[6px]" />
              <img src="/images/mo1dvveo-ybietps.png" alt="Sparkle" className="absolute top-[35px] left-[271px] w-[10px] h-[12px]" />
            </div>
          </div>

          {/* Section 02 */}
          <div className="flex flex-col">
            <div className="relative w-[352px] h-[28px]">
              <img src="/images/mo1dvveo-5njd7q9.svg" alt="Highlight" className="absolute top-[10px] left-[6px] w-[312px] h-[10px]" />
              <h2 className="absolute top-0 left-0 text-[18px] text-[#222222] font-bold leading-[28px] font-['JinNanJunJunTi']">02. 设置主人生日帮助 ropet更好写日记</h2>
            </div>
            <p className="text-[12px] text-[#222222cc] leading-[22px] mt-[8px]">加入主人生日，ropet的日记将会写你的明日运势。</p>
            
            <div className="flex flex-col items-center bg-[#f1ecff] rounded-[20px] mt-[12px] w-[166px] p-[16px] gap-[5px]">
              <div className="relative w-[79px] h-[79px]">
                <img src="/images/mo1dvveo-hbrb225.svg" alt="Diary Icon" className="absolute top-0 left-[6px] w-[71px] h-[79px]" />
                <span className="absolute top-[16px] left-[22px] text-[10px] text-white font-bold tracking-[0.43px] uppercase rotate-[-19deg] font-['JinNanJunJunTi']">diary</span>
                <div 
                  className="absolute top-[25px] left-[31px] w-[32px] h-[32px] bg-center bg-cover flex items-center justify-center"
                  style={{ backgroundImage: 'url(/images/mo1dvveo-f4gcxax.svg)' }}
                >
                  <div className="w-[7px] h-[7px] bg-[#ffec79] rounded-full"></div>
                </div>
                <img src="/images/mo1dvveo-1frv97h.svg" alt="Binding" className="absolute top-[20px] left-[12px] w-[17px] h-[47px]" />
              </div>
              <p className="text-center text-[7px] leading-[9px] w-[124px]">
                <span className="text-[#22222299]">暂无日记内容<br/>留下主人的出生年月，肉派派在日记上给你专属运势建议<br/></span>
                <span className="text-[#7c5ae0] font-medium underline decoration-[#7c5ae0]">去设置</span>
              </p>
            </div>
          </div>

          {/* Section 03 */}
          <div className="flex flex-col">
            <div className="relative w-[331px] h-[28px]">
              <img src="/images/mo1dvveo-7d5p7xr.svg" alt="Highlight" className="absolute top-[11px] left-0 w-[279px] h-[5px]" />
              <h2 className="absolute top-0 left-0 text-[18px] text-[#222222] font-bold leading-[28px] font-['JinNanJunJunTi']">03.有新日记需要积分兑换才能查看</h2>
            </div>
            <p className="text-[12px] text-[#555555] leading-[22px] mt-[6px]">兑换日记需要消耗300积分。</p>
            
            <div className="flex flex-col items-center bg-[#f1ecff] rounded-[20px] mt-[12px] w-[178px] p-[16px] gap-[8px]">
              <img src="/images/mo1dvveq-vqivfg0.png" alt="Book" className="w-[121px] h-[131px] rounded-[16px] object-contain" />
              <p className="text-[10px] text-[#22222266] text-center mt-[4px]">新日记需要积分兑换</p>
              <div className="flex items-center justify-center bg-[#7c5ae0] rounded-[10px] px-[12px] py-[2px]">
                <span className="text-[12px] text-white font-semibold">300</span>
              </div>
            </div>
          </div>

          {/* Section 04 */}
          <div className="relative w-[318px] h-[28px]">
            <img src="/images/mo1dvveo-7on9o7i.svg" alt="Highlight" className="absolute top-[11px] left-0 w-[307px] h-[5px]" />
            <h2 className="absolute top-0 left-0 text-[18px] text-[#222222] font-bold leading-[28px] font-['JinNanJunJunTi']">04.今天的日记会在明天写出，要有耐心</h2>
          </div>

          {/* Action Button */}
          <div className="flex justify-center w-full mt-[20px]">
            <button 
              className="w-[237px] h-[46px] bg-[#7c5ae0] rounded-[23px] text-white text-[14px] font-medium flex items-center justify-center cursor-pointer hover:bg-[#6c4cd0] transition-colors"
              onClick={() => navigate('/painting-diary')}
            >
              知道啦
            </button>
          </div>

        </div>

        {/* System Home Indicator */}
        <div className="flex justify-center w-full pb-[8px] pt-[21px] sticky bottom-0 bg-white">
          <div className="w-[134px] h-[5px] bg-[#222222] rounded-[100px]"></div>
        </div>

      </div>
    </div>
  );
};

export default DiaryRules;
