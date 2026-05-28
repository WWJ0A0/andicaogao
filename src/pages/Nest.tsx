import React from 'react';
import { useNavigate } from 'react-router-dom';

const Nest: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen flex justify-center bg-[#d8deea] overflow-hidden py-4">
      <div 
        className="relative w-[393px] h-[852px] overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)] bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: 'linear-gradient(0deg, #fff7dc 0.88%, #ffe2f1 85.32%, #ddc8ff 99.62%)'
        }}
      >
        {/* Background Blob Pattern (union) */}
        <div 
          className="absolute top-[-34px] left-[-74px] w-[504px] h-[865px] bg-center bg-cover bg-no-repeat pointer-events-none z-0"
          style={{ backgroundImage: 'url(/images/mo1d92xj-hha9qft.svg)' }}
        ></div>
        
        {/* Status Bar */}
        <div className="flex w-full pt-[14px] pr-[14px] pb-[9px] pl-[21px] justify-between items-center z-50 relative">
          <span className="w-[54px] text-[15px] text-[#000000] font-semibold tracking-[-0.3px] text-center">9:41</span>
          <div className="flex pr-[14px]">
            <img src="/images/mo1bj519-ii3bmk1.svg" alt="Cellular" className="w-[18px] h-[11px] mt-[4px]" />
            <img src="/images/mo1bj519-py9m02f.svg" alt="Wifi" className="w-[16px] h-[11px] mt-[3px] ml-[5px]" />
            <img src="/images/mo1bj519-bvc0yzd.svg" alt="Battery" className="w-[24px] h-[11px] mt-[3px] ml-[7px]" />
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between w-full px-[16px] py-[8px] z-50 relative">
          <div 
            className="flex items-center justify-center w-[40px] h-[40px] rounded-[12px] border border-[#ffffff66] bg-[#ffffff33] cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src="/images/mo1bj519-siuv727.svg" alt="Back" className="w-[40px] h-[40px]" />
          </div>
          <h1 className="text-[18px] text-[#222222] font-medium absolute left-1/2 -translate-x-1/2">小窝</h1>
          <div className="flex items-center justify-center w-[40px] h-[40px] rounded-[13px] border border-[#ffffff66] bg-[#ffffff33]">
            <img src="/images/mo1bj519-vh3whbv.svg" alt="Profile Card" className="w-[24px] h-[24px]" />
          </div>
        </div>

        {/* Main Content Area (Receipt Style) */}
        <div className="absolute top-[101px] left-[28px] w-[337px] h-[682px] z-20">
          
          {/* Top Bar of Receipt */}
          <div className="absolute top-[-4px] right-[-20px] w-[377px] h-[53px] bg-[#ffffff99] rounded-[12px] shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.03)] flex items-center justify-center p-[6px] pl-[5px]">
             <div className="flex-grow h-full bg-white rounded-[10px] shadow-[inset_0px_-2px_4px_0px_rgba(0,0,0,0.16)] flex items-center px-[8px]">
               <img src="/images/mo1bj519-wqxq81j.svg" alt="Top Slot" className="w-[350px] h-[15px]" />
             </div>
          </div>

          {/* Main White Receipt Body */}
          <div 
            className="absolute top-[19px] left-0 w-[337px] h-[682px] flex flex-col items-start pt-[34px] px-[16px] pb-[17px] bg-center bg-cover bg-no-repeat z-20"
            style={{ 
              backgroundImage: 'url(/images/mo1d92xj-aj2b6g5.svg)',
              filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.12))'
            }}
          >
            
            {/* Header Row */}
            <div className="flex justify-between items-start w-full pr-[10px] mt-[11px]">
              <h2 className="text-[24px] text-[#000000] font-bold tracking-[0.24px] font-['JinNanJunJunTi']">小窝里有什么</h2>
              <div className="flex flex-col items-start mt-[1px]">
                <div className="flex items-center w-full ml-[37px] overflow-hidden py-[1px]">
                  <img src="/images/mo1bj519-gdsrq76.svg" alt="ropet" className="w-[34px] h-[10px]" />
                </div>
                <img src="/images/mo1bj519-bj7p3gl.svg" alt="barcode" className="w-[69px] h-[20px] mt-[4px]" />
              </div>
            </div>

            {/* Separator */}
            <img src="/images/mo1cw4a9-og2pxnl.svg" alt="Separator" className="w-[305px] h-[1px] mt-[7px]" />

            {/* Scrollable Area */}
            <div className="w-full flex flex-col items-center mt-[16px] overflow-y-auto scrollbar-hide">
              
              {/* Section 1: 称呼 */}
              <div className="w-full flex flex-col">
                <div className="flex items-center gap-[10px] relative">
                  <h3 className="text-[16px] text-[#000000] font-medium tracking-[0.16px] leading-[22px]">称呼</h3>
                  <img src="/images/mo1bj519-y8vohuq.svg" alt="Help" className="absolute top-[2px] left-[35px] w-[18px] h-[18px]" />
                </div>
                
                {/* Horizontal Scroll Cards */}
                <div className="flex items-center gap-[10px] mt-[12px] w-[305px] overflow-x-auto scrollbar-hide">
                  
                  {/* Card 1: 叫妈妈 */}
                  <div className="flex flex-col items-center border border-[#2222220d] rounded-[8px] bg-[#22222208] pt-[7px] px-[14px] pb-[10px] shrink-0">
                    <img src="/images/mo1bj51c-iyvf5h0.png" alt="Avatar" className="w-[58px] h-[58px] object-cover" />
                    <span className="mt-[5px] text-[13px] text-[#000000] tracking-[0.13px] leading-[18px]">叫妈妈</span>
                    <span className="mt-[5px] text-[11px] text-[#22222266] tracking-[0.11px] leading-[15px]">已拥有</span>
                  </div>

                  {/* Card 2: 叫爸爸 (Active) */}
                  <div className="flex flex-col items-center rounded-[8px] bg-[#22222208] pt-[8px] px-[15px] pb-[11px] shrink-0 border-[1.5px] border-[#7c5ae0] shadow-[0_0_8px_rgba(124,90,224,0.15)]">
                    <img src="/images/mo1bj51c-4wpwmgq.png" alt="Avatar" className="w-[58px] h-[58px] object-cover" />
                    <span className="mt-[5px] text-[13px] text-[#000000] tracking-[0.13px] leading-[18px]">叫爸爸</span>
                    <span className="mt-[5px] text-[11px] text-[#7c5ae0cc] font-medium tracking-[0.11px] leading-[15px]">使用中</span>
                  </div>

                  {/* Card 3: 叫宝宝 */}
                  <div className="flex items-start border border-[#2222220d] rounded-[8px] bg-[#22222208] pt-[7px] px-[14px] pb-[10px] overflow-hidden shrink-0">
                    <div className="flex flex-col flex-grow items-center opacity-40">
                      <img src="/images/mo1bj51c-zy30nnj.png" alt="Avatar" className="w-[58px] h-[58px] object-cover" />
                      <span className="mt-[5px] text-[13px] text-[#000000] tracking-[0.13px] leading-[18px]">叫宝宝</span>
                      <span className="mt-[5px] text-[11px] text-[#22222266] tracking-[0.11px] leading-[15px]">未拥有</span>
                    </div>
                  </div>

                  {/* Card 4: 叫姐姐 */}
                  <div className="flex flex-col items-center border border-[#2222220d] rounded-[8px] bg-[#22222208] pt-[7px] px-[14px] pb-[10px] shrink-0">
                    <img src="/images/mo1bj51c-bpgr1um.png" alt="Avatar" className="w-[58px] h-[58px] object-cover" />
                    <span className="mt-[5px] text-[13px] text-[#000000] tracking-[0.13px] leading-[18px]">叫姐姐</span>
                    <span className="mt-[5px] text-[11px] text-[#7c5ae0cc] font-medium tracking-[0.11px] leading-[15px]">已拥有</span>
                  </div>
                </div>
              </div>

              {/* Vector 1 Separator */}
              <img src="/images/mo1cw4a9-og2pxnl.svg" alt="Section Separator" className="w-[305px] h-[1px] mt-[14px]" />

              {/* Section 2: 画框皮肤 */}
              <div className="w-full flex flex-col mt-[14px]">
                <div className="flex items-center gap-[10px] relative">
                  <h3 className="text-[16px] text-[#000000] font-medium tracking-[0.16px] leading-[22px]">画框皮肤</h3>
                  <img src="/images/mo1bj519-y8vohuq.svg" alt="Help" className="absolute top-[2px] left-[67px] w-[18px] h-[18px]" />
                </div>
                
                <div className="flex items-center gap-[10px] mt-[11px] overflow-x-auto scrollbar-hide">
                  
                  {/* Card 1: 普通封面 (Active) */}
                  <div className="flex flex-col items-center border border-[#2222220d] rounded-[8px] bg-[#22222208] pt-[12px] px-[15px] pb-[9px] overflow-hidden shrink-0 border-[1.5px] border-[#7c5ae0] shadow-[0_0_8px_rgba(124,90,224,0.15)]">
                    <img src="/images/mo1bj519-dke1r16.png" alt="Frame" className="w-[58px] h-[58px] object-contain drop-shadow-sm" />
                    <span className="mt-[5px] text-[13px] text-[#000000] tracking-[0.13px] leading-[18px]">普通封面</span>
                    <span className="mt-[3px] text-[11px] text-[#7c5ae0] font-medium tracking-[0.11px] leading-[15px]">使用中</span>
                  </div>

                  {/* Card 2: 新年封面 */}
                  <div className="flex flex-col items-center border border-[#2222220d] rounded-[8px] bg-[#22222208] pt-[12px] px-[15px] pb-[9px] overflow-hidden shrink-0">
                    <img src="/images/mo1bj519-lckjvhq.png" alt="Frame" className="w-[58px] h-[58px] object-contain drop-shadow-sm" />
                    <span className="mt-[5px] text-[13px] text-[#000000] tracking-[0.13px] leading-[18px]">新年封面</span>
                    <span className="mt-[3px] text-[11px] text-[#22222266] tracking-[0.11px] leading-[15px]">已拥有</span>
                  </div>
                </div>
              </div>

              {/* Vector 1 Separator */}
              <img src="/images/mo1cw4a9-og2pxnl.svg" alt="Section Separator" className="w-[305px] h-[1px] mt-[14px]" />

              {/* Section 3: 日用品 */}
              <div className="w-[305px] flex flex-col mt-[14px]">
                <div className="flex items-center gap-[10px] relative">
                  <h3 className="text-[16px] text-[#000000] font-medium tracking-[0.16px] leading-[22px]">日用品</h3>
                  <img src="/images/mo1bj519-y8vohuq.svg" alt="Help" className="absolute top-[2px] left-[51px] w-[18px] h-[18px]" />
                </div>
                
                <div className="flex items-center gap-[10px] mt-[12px] overflow-x-auto scrollbar-hide pr-[119px]">
                  
                  {/* Card 1: AI画纸 */}
                  <div className="flex flex-col items-center border border-[#2222220d] rounded-[8px] bg-[#22222208] pt-[12px] px-[14px] pb-[9px] pl-[13px] overflow-hidden shrink-0">
                    <img src="/images/mo1bj519-pv62wly.png" alt="Item" className="w-[58px] h-[58px] object-contain drop-shadow-sm" />
                    <span className="mt-[5px] text-[13px] text-[#000000] tracking-[0.13px] leading-[18px]">AI画纸</span>
                    <span className="mt-[3px] text-[11px] text-[#22222266] tracking-[0.11px] leading-[15px]">拥有 999 张</span>
                  </div>

                  {/* Card 2: 改名卡 */}
                  <div className="flex flex-col items-center border border-[#2222220d] rounded-[8px] bg-[#22222208] pt-[11px] px-[13px] pb-[8px] pl-[12px] shrink-0">
                    <div className="flex items-center px-[3px] pb-[1px] overflow-hidden mx-[2px]">
                      <img src="/images/mo1bj51c-ftijsui.png" alt="Item" className="w-[52px] h-[58px] object-contain drop-shadow-sm" />
                    </div>
                    <span className="mt-[5px] text-[13px] text-[#000000] tracking-[0.13px] leading-[18px]">改名卡</span>
                    <span className="mt-[3px] text-[11px] text-[#22222266] tracking-[0.11px] leading-[15px]">拥有 999 张</span>
                  </div>
                </div>
              </div>
              
              {/* Bottom Separator */}
              <img src="/images/mo1bj519-x2sfhmo.svg" alt="Bottom Divider" className="w-[299px] h-[1px] mt-[42px] ml-[3px]" />
              
              {/* Bottom Decorative Icons */}
              <div className="flex justify-center w-full mt-[11px]">
                 <img src="/images/mo1bj519-wctphhw.svg" alt="Icons" className="w-[49px] h-[12px]" />
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

export default Nest;
