import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaintingDiary: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#e2e7f1] to-white overflow-hidden flex justify-center">
      <div 
        className="relative w-[393px] h-[852px] bg-[#daceff] overflow-hidden shadow-lg"
      >
        {/* Background Decorative Circles */}
        <img src="/images/mo1exmqg-i8ynt5r.svg" alt="Decoration" className="absolute top-[105px] left-[3px] w-[16px] h-[16px]" />
        <img src="/images/mo1exmqg-76ibyhx.svg" alt="Decoration" className="absolute top-[125px] left-[2px] w-[17px] h-[16px]" />
        <img src="/images/mo1exmqg-io4msov.svg" alt="Decoration" className="absolute top-[145px] left-[2px] w-[17px] h-[16px]" />
        
        <img src="/images/mo1exmqg-30igu7u.svg" alt="Decoration" className="absolute top-[346px] left-[1px] w-[18px] h-[15px]" />
        <img src="/images/mo1exmqg-gr5s00k.svg" alt="Decoration" className="absolute top-[366px] left-[1px] w-[18px] h-[16px]" />
        <img src="/images/mo1exmqg-hpsyhp6.svg" alt="Decoration" className="absolute top-[386px] left-[1px] w-[18px] h-[16px]" />
        
        <div className="absolute top-[398px] left-[9px] w-[4px] h-[5px] bg-white"></div>
        <div className="absolute top-[377px] left-[9px] w-[4px] h-[6px] bg-white"></div>
        <div className="absolute top-[357px] left-[9px] w-[4px] h-[6px] bg-white"></div>

        {/* Top White Transparent Layer */}
        <div className="absolute top-0 left-0 w-full h-full bg-[#ffffffcc] flex flex-col items-start z-10 pb-[116px]">
          
          {/* Status Bar */}
          <div className="flex w-full pt-[14px] pr-[14px] pb-[9px] pl-[21px] justify-between items-center">
            <span className="w-[54px] text-[15px] text-[#222222] font-semibold tracking-[-0.3px] text-center">9:41</span>
            <div className="flex pr-[14px]">
              <img src="/images/mo1exmqf-tjpvlya.svg" alt="Cellular" className="w-[18px] h-[11px] mt-[4px]" />
              <img src="/images/mo1exmqf-7p2nmfp.svg" alt="Wifi" className="w-[16px] h-[11px] mt-[3px] ml-[5px]" />
              <img src="/images/mo1exmqf-fbtkfsd.svg" alt="Battery" className="w-[24px] h-[11px] mt-[3px] ml-[7px]" />
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between w-full px-[16px] py-[8px]">
            <div 
              className="w-[40px] h-[40px] border border-[#2222220d] rounded-[12px] flex items-center justify-center p-[11px] cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <img src="/images/mo1exmqf-6rjv5dt.svg" alt="Back" className="w-[40px] h-[40px]" />
            </div>
            
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-between w-[92px] h-[32px]">
              <span className="text-[18px] text-[#222222] font-medium leading-[32px]">画画日记</span>
              <img src="/images/mo1exmqf-86myqex.svg" alt="Help" className="w-[16px] h-[16px]" />
            </div>

            <div className="flex items-center justify-between bg-[#7c5ae0] rounded-[12px] pl-[7px] pr-[4px] w-[73px] h-[32px]">
              <span className="text-[14px] text-white font-semibold leading-[32px]">ON</span>
              <div className="w-[24px] h-[24px] overflow-hidden flex items-center justify-center">
                <img src="/images/mo1exmqf-d5lg3h5.svg" alt="Toggle" className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* Date Selector */}
          <div className="ml-[12px] mt-[20px] text-[20px] text-[#222222] font-medium leading-[32px] flex items-center gap-[4px]">
            2026 11月
            <img src="/images/mo1exmqg-7jlksai.png" alt="Arrow Down" className="w-[20px] h-[20px] mt-[2px]" />
          </div>

          {/* Week Row */}
          <div className="relative flex items-center gap-[36px] w-[356px] h-[32px] mt-[8px] ml-[19px]">
            <span className="w-[20px] text-[18px] text-[#22222266] font-medium text-center leading-[32px]">7</span>
            <span className="w-[20px] text-[18px] text-[#22222266] font-medium text-center leading-[32px]">8</span>
            <span className="w-[20px] text-[18px] text-[#22222266] font-medium text-center leading-[32px]">9</span>
            <span className="w-[20px] text-[18px] text-white font-medium text-center leading-[32px] z-10">10</span>
            <span className="w-[20px] text-[18px] text-[#22222266] font-medium text-center leading-[32px]">11</span>
            <span className="w-[20px] text-[18px] text-[#22222266] font-medium text-center leading-[32px]">12</span>
            <span className="w-[20px] text-[18px] text-[#22222266] font-medium text-center leading-[32px]">13</span>
            
            {/* Active Date Background */}
            <div className="absolute bottom-[-1px] left-[160px] w-[36px] h-[35px] bg-[#7c5ae0] rounded-full z-0"></div>
            
            {/* Red Dots */}
            <div className="absolute top-[2px] left-[72px] w-[6px] h-[6px] bg-[#ff5c64] rounded-full"></div>
            <div className="absolute top-[2px] left-[128px] w-[6px] h-[6px] bg-[#ff5c64] rounded-full z-10"></div>
          </div>

          {/* Main Card */}
          <div className="relative w-[352px] h-[528px] mt-[16px] ml-[21px]">
            <div 
              className="absolute top-[6px] left-[9px] w-[338px] h-[506px] bg-center bg-cover flex flex-col items-center pt-[143px] z-20"
              style={{ 
                backgroundImage: 'url(/images/mo1exmqg-5waqarl.svg)',
                filter: 'drop-shadow(0px 4px 4px #b0b0b040)'
              }}
            >
              <img src="/images/mo1exmqg-w7069hm.svg" alt="Card Decor" className="absolute top-[248px] left-[222px] w-[61px] h-[14px]" />
              
              <div className="flex flex-col items-center w-[200px] gap-[8px]">
                <div className="relative w-[132px] h-[132px]">
                  <img src="/images/mo1exmqg-w7069hm.svg" alt="Diary Icon" className="absolute top-0 left-[7px] w-[118px] h-[132px]" />
                  <span className="absolute top-[27px] left-[33px] text-[17px] text-white font-bold tracking-[0.71px] uppercase rotate-[-19deg] font-['JinNanJunJunTi']">diary</span>
                  <div 
                    className="absolute top-[42px] left-[49px] w-[53px] h-[53px] bg-center bg-cover flex items-center justify-center"
                    style={{ backgroundImage: 'url(/images/mo1exmqg-885zv43.svg)' }}
                  >
                    <div className="w-[12px] h-[12px] bg-[#ffec79] rounded-full"></div>
                  </div>
                  <img src="/images/mo1exmqg-rnayuvs.svg" alt="Binding" className="absolute top-[33px] left-[16px] w-[29px] h-[78px]" />
                </div>
                
                <p className="w-[200px] text-center text-[14px] leading-[20px]">
                  <span className="text-[#22222299]">暂无日记内容<br/>留下主人的出生年月，肉派派在日记上给你专属运势建议<br/></span>
                  <span className="text-[#7c5ae0] font-medium underline decoration-[#7c5ae0]">去设置</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* System Home Indicator */}
        <div className="absolute bottom-0 left-[1px] flex items-start pt-[21px] px-[129px] pb-[8px] w-[394px] h-[34px] z-50 pointer-events-none">
          <div className="w-[134px] h-[5px] bg-[#222222] rounded-[100px]"></div>
        </div>

      </div>
    </div>
  );
};

export default PaintingDiary;
