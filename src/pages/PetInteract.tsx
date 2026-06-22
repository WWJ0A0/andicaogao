import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import kaixinAnimation from '@/assets/animations/kaixin.json';
import pingjingAnimation from '@/assets/animations/pingjing.json';

const PetInteract: React.FC = () => {
  const navigate = useNavigate();
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showFeedDetailModal, setShowFeedDetailModal] = useState(false);
  const [showFoodNeedExchangeModal, setShowFoodNeedExchangeModal] = useState(false);
  const [showFoodPointsExchangeModal, setShowFoodPointsExchangeModal] = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [points, setPoints] = useState(10000);
  const [foodCounts, setFoodCounts] = useState<Record<string, number>>({
    'food-1-1': 0,
    'food-1-2': 0,
    'food-1-3': 0,
    'food-2-1': 0,
    'food-2-2': 0,
    'food-2-3': 0,
    'food-3-1': 0,
    'food-3-2': 0,
    'food-3-3': 0,
  });
  const [selectedFoodId, setSelectedFoodId] = useState('food-1-3');
  const [selectedFoodName, setSelectedFoodName] = useState('甜甜圈');
  const [selectedFoodImage, setSelectedFoodImage] = useState('/images/mo16ii51-smiah1e.png');
  const [exchangeFoodInput, setExchangeFoodInput] = useState('1');
  const [bubbleText, setBubbleText] = useState('吃感冒药');
  const [showKaixin, setShowKaixin] = useState(false);
  const [kaixinKey, setKaixinKey] = useState(0);

  const exchangeFoodCount = Math.max(1, Math.floor(Number(exchangeFoodInput) || 1));
  const exchangeCost = exchangeFoodCount * 75;
  const canExchangeFood = points >= exchangeCost;

  const handleFeed = (id: string, name: string, image: string) => {
    setAnimatingId(id);
    setTimeout(() => {
      setAnimatingId(null);
      const currentCount = foodCounts[id] ?? 0;
      if (currentCount > 0) {
        setFoodCounts((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) - 1) }));
        setBubbleText('呀，真好次');
        setKaixinKey((prev) => prev + 1);
        setShowKaixin(true);
        window.setTimeout(() => setShowKaixin(false), 1200);
        return;
      }
      setSelectedFoodId(id);
      setSelectedFoodName(name);
      setSelectedFoodImage(image);
      setShowFeedDetailModal(true);
    }, 500);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#e2e7f1] to-white overflow-hidden flex justify-center">
      <div className="relative w-[393px] h-[852px] overflow-hidden shadow-lg bg-[#d0c3e1]">
        
        {/* Background Image (image651) */}
        <div 
          className="absolute top-0 left-0 w-[393px] h-[488px] pt-[90px] pr-[30px] pb-[57px] pl-[29px] flex flex-col items-start bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/mo15480h-pram17r.png)' }}
        >
          {/* autoWrapper */}
          <div className="relative w-[334px] h-[294px]">
             {/* group2090053917 (Pet + Bubble) */}
             <div 
               className="absolute top-0 left-0 w-[334px] h-[294px]"
             >
                <Lottie animationData={pingjingAnimation} loop autoplay className="absolute top-[27px] left-[3px] w-full h-full scale-[0.98] origin-center" />
                {/* Speech Bubble */}
                <img 
                  src="/images/mo15480d-0pep1y0.png" 
                  className="absolute top-[8px] left-[16px] w-[115px] h-[50px] rotate-180" 
                  alt="bubble"
                />
                <span className="absolute top-[20px] left-[35px] w-[80px] h-[18px] text-center text-[14px] text-[#222222cc] font-medium leading-[17px]">{bubbleText}</span>
                {showKaixin && (
                  <div className="absolute top-[27px] left-[3px] w-full h-full pointer-events-none z-10">
                    <Lottie key={kaixinKey} animationData={kaixinAnimation} loop={false} autoplay className="w-full h-full scale-[0.98] origin-center" />
                  </div>
                )}
                <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[220px] h-[34px] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(84,60,142,0.30)_0%,rgba(84,60,142,0.14)_45%,rgba(84,60,142,0)_75%)]" />
             </div>

             {/* frame2090054094 (Status bar + Back button) */}
             <div className="absolute top-[-90px] right-[-30px] flex flex-col items-start w-[393px] h-[100px]">
                {/* Status Bar */}
                <div className="flex w-full pt-[14px] pr-[14px] pb-[9px] pl-[21px]">
                   <span className="w-[54px] text-[15px] text-[#19181f] font-medium tracking-[-0.3px] text-center">9:41</span>
                   <img src="/images/mo15480d-yh1uakd.svg" alt="Cellular" className="w-[18px] h-[11px] mt-[4px] ml-[233px]" />
                   <img src="/images/mo15480d-9buko50.svg" alt="Wifi" className="w-[16px] h-[11px] mt-[3px] ml-[5px]" />
                   <img src="/images/mo15480d-qmw93k3.svg" alt="Battery" className="w-[24px] h-[11px] mt-[3px] ml-[7px]" />
                </div>
                {/* Back Button */}
                <div className="flex items-center justify-center gap-[10px] py-[20px] pr-[349px] pl-[28px] w-[393px] h-[56px]">
                   <img 
                     src="/images/mo15480d-zohm72h.svg" 
                     alt="Back" 
                     className="w-[80px] h-[80px] shrink-0 cursor-pointer scale-150 stroke-black font-bold" 
                     onClick={() => navigate('/')} 
                   />
                </div>
             </div>
          </div>
          
          {/* Hint Text */}
          <p className="mt-[7px] ml-[28px] w-[282px] text-[14px] text-white text-center leading-[20px] font-medium">
            要不要给它一份&#123;消化药&#125;？<br/>
            或者休息两三个小时，它也会慢慢好起来。
          </p>
        </div>

        {/* Bottom Card (frame2090054511) */}
        <div className="absolute top-[451px] left-0 flex flex-col items-start w-[393px] h-[627px] bg-[#f8f8f8cc] backdrop-blur-[4px] rounded-t-[24px] pt-[36px] pr-[19px] pb-0 pl-[20px] z-20">
           
           {/* frame2090054531 (Hunger Status) */}
           <div className="flex flex-col items-start w-[354px] shrink-0 -mt-[30px]">
             {/* autoWrapper2 */}
             <div className="mt-[8px] flex items-center justify-between w-full pr-[223px] pl-[3px]">
               <span className="text-[18px] text-[#000000] font-medium leading-[28px] whitespace-nowrap">ropet 饿不饿</span>
               <img 
                 src="/images/mo15480d-fe84o6q.svg" 
                 alt="Info" 
                 className="w-[16px] h-[16px] cursor-pointer" 
                 onClick={() => setShowQuestionModal(true)}
               />
             </div>

             {/* frame2090054521 (Slider) */}
             <div className="relative flex items-start w-full mt-[20px] -mr-[1px] pt-[18px] pr-[32px] pb-0 pl-[65px]">
               <span className="text-[12px] text-[#00000066] leading-[22px]">饿</span>
              <span className="ml-[106px] inline-block whitespace-nowrap text-[12px] text-[#00000066] leading-[22px]">刚好</span>
               <span className="ml-[47px] text-[12px] text-[#00000066] leading-[22px]">饱</span>
               <span className="ml-[45px] text-[12px] text-[#00000066] leading-[22px]">撑</span>
               
               {/* autoWrapper3 (Slider Track & Thumb) */}
               <div className="absolute top-0 left-0 w-[355px] h-[23px]">
                 <img src="/images/mo15480d-p27tl1j.svg" alt="Slider Track" className="absolute top-0 left-0 w-[355px] h-[12px]" />
                 <img src="/images/mo15480d-xijuh1d.svg" alt="Slider Thumb" className="absolute top-[6px] left-[322px] w-[17px] h-[17px]" />
               </div>
             </div>
           </div>

           {/* Scrollable Container for Foods and Medicines */}
           <div className="flex flex-col w-full h-[320px] overflow-y-auto scrollbar-hide pb-[80px] mt-[20px]">
              
              {/* 宠物食物 Title */}
              <h3 className="text-[18px] text-[#000000] font-medium leading-[28px] shrink-0">宠物食物</h3>
              
              {/* Food Row 1 */}
              <div className="flex items-center gap-[18px] mt-[12px] w-[354px] h-[139px] overflow-hidden shrink-0">
                 <div className="flex flex-col items-center shrink-0 w-[106px] bg-[#ffffffcc] border border-white rounded-[12px] py-[11px]">
                   <span className="text-[13px] text-[#222222] font-medium leading-[19px]">奇怪的三角x{foodCounts['food-1-1']}</span>
                   <img src="/images/mo16ii51-cytlfl0.png" alt="Food 1" className="w-[60px] h-[60px] my-[6px] object-contain" />
                   <button 
                     onClick={() => setShowUnlockModal(true)}
                     className="bg-[#7c5ae0] text-white text-[11px] font-medium w-[74px] h-[24px] flex items-center justify-center rounded-[20px]"
                   >
                     解锁
                   </button>
                 </div>
                 <div className="flex flex-col items-center shrink-0 w-[106px] bg-[#ffffffcc] border border-white rounded-[12px] py-[11px]">
                   <span className="text-[13px] text-[#222222] font-medium leading-[19px]">橘子x{foodCounts['food-1-2']}</span>
                   <img 
                     src="/images/mo16ii51-p2rgsdw.png" 
                     alt="Food 2" 
                     className={`w-[60px] h-[60px] my-[6px] object-contain ${animatingId === 'food-1-2' ? 'animate-double-bounce' : ''}`} 
                   />
                   <button 
                     onClick={() => handleFeed('food-1-2', '橘子', '/images/mo16ii51-p2rgsdw.png')}
                     className="bg-[#7c5ae0] text-white text-[11px] font-medium w-[74px] h-[24px] flex items-center justify-center rounded-[20px]"
                   >喂食</button>
                 </div>
                 <div className="flex flex-col items-center shrink-0 w-[106px] bg-[#ffffffcc] border border-white rounded-[12px] py-[11px]">
                   <span className="text-[12px] text-[#222222] font-medium leading-[18px]">甜甜圈x{foodCounts['food-1-3']}</span>
                   <img 
                     src="/images/mo16ii51-smiah1e.png" 
                     alt="Food 3" 
                     className={`w-[60px] h-[60px] my-[6px] object-contain ${animatingId === 'food-1-3' ? 'animate-double-bounce' : ''}`} 
                   />
                   <button 
                     onClick={() => handleFeed('food-1-3', '甜甜圈', '/images/mo16ii51-smiah1e.png')}
                     className="bg-[#7c5ae0] text-white text-[10px] font-medium w-[74px] h-[24px] flex items-center justify-center rounded-[20px]"
                   >
                     喂食
                   </button>
                 </div>
              </div>

              {/* Food Row 2 */}
              <div className="flex items-center gap-[18px] mt-[16px] w-[354px] h-[139px] overflow-hidden shrink-0">
                 <div className="flex flex-col items-center shrink-0 w-[106px] bg-[#ffffffcc] border border-white rounded-[12px] py-[11px]">
                   <span className="text-[13px] text-[#222222] font-medium leading-[19px]">奇怪的三角x{foodCounts['food-2-1']}</span>
                   <img src="/images/mo15igzh-4jgw3il.png" alt="Food 1" className="w-[60px] h-[60px] my-[6px] object-contain" />
                   <button 
                     onClick={() => setShowUnlockModal(true)}
                     className="bg-[#7c5ae0] text-white text-[10px] font-medium w-[74px] h-[24px] flex items-center justify-center rounded-[20px]"
                   >
                     解锁
                   </button>
                 </div>
                 <div className="flex flex-col items-center shrink-0 w-[106px] bg-[#ffffffcc] border border-white rounded-[12px] py-[11px]">
                   <span className="text-[13px] text-[#222222] font-medium leading-[19px]">橘子x{foodCounts['food-2-2']}</span>
                   <img 
                     src="/images/mo15igzh-bb606jm.png" 
                     alt="Food 2" 
                     className={`w-[60px] h-[60px] my-[6px] object-contain ${animatingId === 'food-2-2' ? 'animate-double-bounce' : ''}`} 
                   />
                   <button 
                     onClick={() => handleFeed('food-2-2', '橘子', '/images/mo15igzh-bb606jm.png')}
                     className="bg-[#7c5ae0] text-white text-[10px] font-medium w-[74px] h-[24px] flex items-center justify-center rounded-[20px]"
                   >
                     喂食
                   </button>
                 </div>
                 <div className="flex flex-col items-center shrink-0 w-[106px] bg-[#ffffffcc] border border-white rounded-[12px] py-[11px]">
                   <span className="text-[12px] text-[#222222] font-medium leading-[18px]">甜甜圈x{foodCounts['food-2-3']}</span>
                   <img 
                     src="/images/mo15igzh-8tfpp3w.png" 
                     alt="Food 3" 
                     className={`w-[60px] h-[60px] my-[6px] object-contain ${animatingId === 'food-2-3' ? 'animate-double-bounce' : ''}`} 
                   />
                   <button 
                     onClick={() => handleFeed('food-2-3', '甜甜圈', '/images/mo15igzh-8tfpp3w.png')}
                     className="bg-[#7c5ae0] text-white text-[10px] font-medium w-[74px] h-[24px] flex items-center justify-center rounded-[20px]"
                   >
                     喂食
                   </button>
                 </div>
              </div>

              {/* Food Row 3 */}
              <div className="flex items-center gap-[18px] mt-[16px] w-[354px] h-[139px] overflow-hidden shrink-0">
                 <div className="flex flex-col items-center shrink-0 w-[106px] bg-[#ffffffcc] border border-white rounded-[12px] py-[11px]">
                   <span className="text-[13px] text-[#222222] font-medium leading-[19px]">奇怪的三角x{foodCounts['food-3-1']}</span>
                   <img src="/images/mo15igzk-ucag85n.png" alt="Food 1" className="w-[60px] h-[60px] my-[6px] object-contain" />
                   <button 
                     onClick={() => setShowUnlockModal(true)}
                     className="bg-[#7c5ae0] text-white text-[10px] font-medium w-[74px] h-[24px] flex items-center justify-center rounded-[20px]"
                   >
                     解锁
                   </button>
                 </div>
                 <div className="flex flex-col items-center shrink-0 w-[106px] bg-[#ffffffcc] border border-white rounded-[12px] py-[11px]">
                   <span className="text-[13px] text-[#222222] font-medium leading-[19px]">橘子x{foodCounts['food-3-2']}</span>
                   <img 
                     src="/images/mo15igzk-0r3qo1j.png" 
                     alt="Food 2" 
                     className={`w-[60px] h-[60px] my-[6px] object-contain ${animatingId === 'food-3-2' ? 'animate-double-bounce' : ''}`} 
                   />
                   <button 
                     onClick={() => handleFeed('food-3-2', '橘子', '/images/mo15igzk-0r3qo1j.png')}
                     className="bg-[#7c5ae0] text-white text-[11px] font-medium w-[74px] h-[24px] flex items-center justify-center rounded-[20px]"
                   >
                     喂食
                   </button>
                 </div>
                 <div className="flex flex-col items-center shrink-0 w-[106px] bg-[#ffffffcc] border border-white rounded-[12px] py-[11px]">
                   <span className="text-[12px] text-[#222222] font-medium leading-[18px]">甜甜圈x{foodCounts['food-3-3']}</span>
                   <img 
                     src="/images/mo15igzk-o8rcn1h.png" 
                     alt="Food 3" 
                     className={`w-[60px] h-[60px] my-[6px] object-contain ${animatingId === 'food-3-3' ? 'animate-double-bounce' : ''}`} 
                   />
                   <button 
                     onClick={() => handleFeed('food-3-3', '甜甜圈', '/images/mo15igzk-o8rcn1h.png')}
                     className="bg-[#7c5ae0] text-white text-[10px] font-medium w-[74px] h-[24px] flex items-center justify-center rounded-[20px]"
                   >
                     喂食
                   </button>
                 </div>
              </div>

              {/* 宠物药品 Title */}
              <h3 className="mt-[24px] text-[18px] text-[#000000] font-medium leading-[28px]">宠物药品</h3>
              
              {/* Medicine Row */}
              <div className="flex items-center gap-[10px] mt-[12px] w-[203px] h-[132px] overflow-hidden shrink-0">
                 <div className="flex flex-col items-center shrink-0 w-[96px] bg-[#ffffffcc] border border-white rounded-[12px] py-[10px]">
                   <span className="text-[12px] text-[#222222] font-medium leading-[18px]">感冒药</span>
                   <div className="flex items-center justify-center my-[5px] w-[60px] h-[60px]">
                     <img 
                       src="/images/mo1783tz-t5i73x5.png" 
                       alt="Medicine 1" 
                       className={`w-[50px] h-[50px] object-contain ${animatingId === 'med-1' ? 'animate-double-bounce' : ''}`} 
                     />
                   </div>
                   <button 
                     onClick={() => setAnimatingId('med-1')}
                     className="bg-[#22222233] text-white text-[10px] font-medium w-[71px] h-[24px] flex items-center justify-center rounded-[20px]"
                   >
                     喂药
                   </button>
                 </div>
                 <div className="flex flex-col items-center shrink-0 w-[96px] bg-[#ffffffcc] border border-white rounded-[12px] py-[10px]">
                   <span className="text-[12px] text-[#222222] font-medium leading-[17px]">消食片</span>
                   <div className="flex items-center justify-center my-[5px] w-[60px] h-[60px]">
                     <img 
                       src="/images/mo1783tz-fhss5nt.png" 
                       alt="Medicine 2" 
                       className={`w-[50px] h-[50px] object-contain ${animatingId === 'med-2' ? 'animate-double-bounce' : ''}`} 
                     />
                   </div>
                   <button 
                     onClick={() => setAnimatingId('med-2')}
                     className="bg-[#7c5ae0] text-white text-[10px] font-medium w-[70px] h-[24px] flex items-center justify-center rounded-[20px]"
                   >
                     喂药
                   </button>
                 </div>
              </div>

           </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-0 left-[-1px] flex items-start pt-[21px] pr-[131px] pb-[8px] pl-[129px] w-[394px] h-[34px] z-50">
           <div className="w-[134px] h-[5px] bg-black rounded-[100px]"></div>
        </div>

        {/* Unlock Modal Overlay */}
         {showUnlockModal && (
           <div className="absolute inset-0 bg-[#19181f99] z-[100] flex items-center justify-center">
             {/* Modal Card */}
             <div className="flex flex-col items-center bg-white rounded-[20px] w-[331px] pt-[28px] px-[24px] pb-[24px]">
               
               {/* Title & Body */}
               <div className="flex flex-col items-center w-full gap-[12px]">
                 <div className="flex flex-col items-center w-[283px] gap-[4px] px-[27px]">
                   <h3 className="w-[257px] text-center text-[20px] text-[#222222] font-medium leading-[26px]">
                     新发现！
                   </h3>
                   <p className="w-[283px] text-center text-[16px] text-[#0b0b0b] leading-[28px]">
                     解锁后可在app投喂，<br />
                     咱家ropet想吃就吃～
                   </p>
                 </div>
                 
                 {/* 3D Orange Image */}
                 <img src="/images/mo16ii51-p2rgsdw.png" alt="Orange" className="w-[120px] h-[120px] object-contain" />
               </div>
 
               {/* Primary Button */}
               <button 
                 onClick={() => setShowUnlockModal(false)}
                 className="mt-[20px] w-[283px] py-[13px] bg-[#7652eb] rounded-[16px] flex items-center justify-center text-[14px] text-white font-medium leading-[20px]"
               >
                 解锁
               </button>
             </div>
           </div>
         )}

         {/* Question Modal Overlay */}
         {showQuestionModal && (
           <div 
             className="absolute inset-0 bg-[#19181f99] z-[100] flex flex-col justify-end"
             onClick={() => setShowQuestionModal(false)}
           >
             <div 
               className="relative w-full h-[294px] bg-white rounded-t-[20px] pt-[63px] px-[24px] flex flex-col items-center"
               onClick={(e) => e.stopPropagation()}
             >
               {/* Decorative Gradient Question Marks Image */}
               <img 
                 src="/images/mo18zshb-90h6szs.svg" 
                 alt="Question Decoration" 
                 className="absolute top-[-92px] w-[194px] h-[184px] pointer-events-none" 
               />
               
               {/* Content Block */}
               <div className="flex flex-col items-start w-[345px] gap-[4px] z-10">
                 <h3 className="text-[20px] text-[#222222] font-bold leading-[28px]">
                   ropet 饿不饿？
                 </h3>
                 <p className="w-[345px] text-[14px] text-[#222222cc] leading-[24px]">
                   Ropet 好像吃撑了，肚子鼓鼓的...<br />
                   要不要给它一份&#123;消化药&#125;？<br />
                   或者休息两三个小时，它也会慢慢好起来。
                 </p>
               </div>

               {/* Bottom Handle */}
               <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-[#222222] rounded-[100px]" />
             </div>
           </div>
         )}

         {/* Feed Detail Modal Overlay */}
         {showFeedDetailModal && (
           <div 
             className="absolute inset-0 bg-[#19181f99] z-[100] flex flex-col items-center pt-[141px]"
             onClick={() => setShowFeedDetailModal(false)}
           >
             
             {/* 2500 Badge */}
             <div className="inline-flex items-center gap-[6px] bg-[#ffffff99] rounded-[18px] px-[8px] py-[2px] shrink-0">
               <img src="/images/mo1aqgol-ga5x1d7.png" alt="Coin" className="w-[24px] h-[24px] shrink-0" />
               <span className="text-[18px] text-[#222222] font-medium leading-[30px] tracking-[-0.3px]">{points}</span>
             </div>

             {/* Modal Container */}
             <div 
               className="relative mt-[10px] w-[393px] h-[667px] bg-white rounded-t-[16px] overflow-hidden shrink-0"
               onClick={(e) => e.stopPropagation()}
             >
               
               {/* Bottom Content Container (White) */}
               <div className="absolute top-0 left-0 flex flex-col items-center pt-[413px] px-[20px] pb-[52px] w-[393px] h-full">
                 
                 {/* Text and Info Area */}
                 <div className="flex flex-col items-start w-full gap-[12px]">
                   <div className="relative flex flex-col items-start w-full gap-[4px]">
                    <h2 className="text-[20px] text-[#222222] font-medium leading-[28px] tracking-[-0.3px]">{selectedFoodName}</h2>
                     <p className="w-[353px] text-[13px] text-[#22222299] leading-[18px]">
                       一口面包一口菜，香香脆脆我最爱！很顶饱的样子。<br />
                       饱腹值+35
                     </p>
                     {/* "投喂过 5 次" Badge */}
                     <div className="absolute top-0 right-0 inline-flex items-center justify-center gap-[10px] bg-[#2222220d] rounded-[14px] px-[10px] py-[4px] h-[26px]">
                       <span className="text-[12px] text-[#7c5ae0] leading-[18px] tracking-[-0.3px]">投喂过 5 次</span>
                     </div>
                   </div>

                   {/* Price */}
                   <div className="flex items-center gap-[6px] w-[91px]">
                     <img src="/images/mo1aqgol-ga5x1d7.png" alt="Coin" className="w-[24px] h-[24px] shrink-0" />
                     <span className="text-[28px] text-[#222222] font-semibold leading-[30px] tracking-[-0.3px]">75</span>
                   </div>
                 </div>

                 {/* Button */}
                 <button
                   className="mt-[38px] flex items-center justify-center w-[353px] h-[54px] bg-[#7c5ae0] rounded-[16px] text-[14px] text-white font-medium leading-[20px]"
                   onClick={() => {
                     setShowFeedDetailModal(false);
                     setShowFoodNeedExchangeModal(true);
                   }}
                 >
                   积分兑换
                 </button>
               </div>

               {/* Top Image Container (Light Gray Overlay) */}
               <div className="absolute top-0 left-0 w-[393px] h-[393px] bg-[#22222208] pointer-events-none">
                 {/* Shadow */}
                 <img src="/images/mo1aqgol-81fe72v.png" alt="Shadow" className="absolute top-[325px] left-[77px] w-[240px] h-[60px] opacity-10" />
                 {/* Donut */}
                <img src={selectedFoodImage} alt={selectedFoodName} className="absolute top-[84px] left-[72px] w-[250px] h-[250px] object-contain" />
               </div>

               {/* Pagination Dots */}
               <div className="absolute top-[373px] left-[185px] flex items-center justify-between w-[24px] h-[8px] z-10 pointer-events-none">
                 <div className="w-[8px] h-[8px] rounded-full bg-[#222222]"></div>
                 <div className="w-[8px] h-[8px] rounded-full bg-[#2222221a]"></div>
               </div>

               {/* System Home Indicator */}
               <div className="absolute bottom-0 left-[1px] flex items-start pt-[21px] px-[129px] pb-[8px] w-[394px] h-[34px] z-10 pointer-events-none">
                 <div className="w-[134px] h-[5px] bg-[#222222] rounded-[100px]"></div>
               </div>

             </div>
           </div>
         )}

         {/* Food Need Exchange Modal */}
         {showFoodNeedExchangeModal && (
           <div className="absolute inset-0 bg-[#19181f99] z-[110] flex items-center justify-center px-[31px]">
             <div className="flex flex-col items-center rounded-[20px] bg-white pt-6 px-8 pb-5 w-[331px] h-[316px]">
               <p className="w-[257px] text-center leading-[26px] text-[#222222] text-[18px]">食物需要兑换</p>
               <p className="mt-3 w-[267px] text-center leading-7 text-[#0b0b0b] text-[16px]">
                 每75积分可兑换一个食物，<br />
                 当前剩余积分 {points}。
               </p>
               <div className="flex flex-col self-stretch mt-4 gap-3">
                 <button
                   type="button"
                   className="flex items-center justify-center rounded-[23px] bg-[#7c5ae0] py-[13px] text-white text-[14px]"
                   onClick={() => {
                     setShowFoodNeedExchangeModal(false);
                     setExchangeFoodInput('1');
                     setShowFoodPointsExchangeModal(true);
                   }}
                 >
                   积分兑换
                 </button>
                 <button
                   type="button"
                   className="flex items-center justify-center border border-[#7c5ae0] rounded-[23px] py-3 text-[#7c5ae0] text-[14px]"
                   onClick={() => {
                     setShowFoodNeedExchangeModal(false);
                     navigate('/interaction-history');
                   }}
                 >
                   抽奖获得
                 </button>
                 <button
                   type="button"
                   className="flex items-center justify-center rounded-[23px] bg-[#22222233] py-[13px] text-white text-[14px]"
                   onClick={() => setShowFoodNeedExchangeModal(false)}
                 >
                   狠心离开
                 </button>
               </div>
             </div>
           </div>
         )}

         {/* Food Points Exchange Modal */}
         {showFoodPointsExchangeModal && (
           <div className="absolute inset-0 bg-[#19181f99] z-[120] flex items-center justify-center px-[31px]">
             <div className="flex flex-col items-center rounded-[20px] bg-white pt-6 px-6 pb-12 w-[331px] h-[310px]">
               <div className="inline-flex flex-col items-center self-stretch gap-2">
                 <div className="flex flex-wrap items-center justify-center gap-1 px-[27px] w-[283px]">
                   <p className="w-[257px] text-center leading-[26px] text-[#222222] text-[18px]">积分兑换</p>
                   <p className="w-[283px] text-center leading-7 text-[#0b0b0b] text-[16px]">
                     每75积分可兑换一个食物，<br />
                     当前剩余积分 {points}。
                   </p>
                 </div>
                 <div className="flex items-center justify-center gap-[5px] rounded-[8px] px-3 py-[5px] w-[239px] h-10">
                   <div className="inline-flex items-center gap-1 h-full">
                     <img src="/images/mo2mufks-h0ntwh5.png" alt="积分" className="w-6 h-6" />
                     <p className={`leading-[19px] text-[16px] ${canExchangeFood ? 'text-[#222222]' : 'text-[#ff5c64]'}`}>{exchangeCost}</p>
                   </div>
                   <img src="/images/mo2mufkp-tpxjx3m.svg" alt="等号" className="w-2 h-[5px]" />
                   <div className="flex items-center justify-center border border-[#2222220d] rounded-[8px] bg-[#22222208] w-[84px] h-10">
                     <input
                       type="number"
                       min={1}
                       value={exchangeFoodInput}
                       onChange={(e) => setExchangeFoodInput(e.target.value)}
                       className="w-10 text-center bg-transparent text-[#09121f] text-[16px] outline-none"
                     />
                   </div>
                 </div>
               </div>

               <div className="inline-flex flex-col self-stretch mt-6 mr-3 ml-3 gap-3">
                 <button
                   type="button"
                   disabled={!canExchangeFood}
                   className={`flex items-center justify-center rounded-[23px] py-[13px] w-[259px] ${
                     canExchangeFood ? 'bg-[#7652eb]' : 'bg-[#7652eb66]'
                   }`}
                   onClick={() => {
                     if (!canExchangeFood) return;
                     setPoints((prev) => prev - exchangeCost);
                     setFoodCounts((prev) => ({ ...prev, [selectedFoodId]: (prev[selectedFoodId] ?? 0) + exchangeFoodCount }));
                     setShowFoodPointsExchangeModal(false);
                   }}
                 >
                   <p className="w-[88px] h-5 text-center leading-5 text-white text-[14px]">确定兑换</p>
                 </button>
                 <button
                   type="button"
                   className="flex items-center justify-center border border-[#22222233] rounded-[23px] py-3 w-[259px]"
                   onClick={() => setShowFoodPointsExchangeModal(false)}
                 >
                   <p className="w-[88px] h-5 text-center leading-5 text-[#222222] text-[14px]">取消</p>
                 </button>
               </div>
             </div>
           </div>
         )}
       </div>
     </div>
   );
 };

 export default PetInteract;
