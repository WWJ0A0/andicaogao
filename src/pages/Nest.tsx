import React, { useState } from 'react';
import { HelpCircle, LoaderCircle, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { useDialogueStore } from '@/store/useDialogueStore';
import { usePetStore } from '@/store/usePetStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { isTranslationCollarUnlocked } from '@/utils/translationCollar';
import PointsBalancePill from '@/components/PointsBalancePill';

const WHISPER_CARD_PRODUCTS = [
  { days: 1, cost: 5000 },
];

const DialogueCardVisual: React.FC<{
  days: number;
  size?: 'mini' | 'tile' | 'hero';
  muted?: boolean;
}> = ({ size = 'tile', muted = false }) => {
  const hero = size === 'hero';
  const mini = size === 'mini';
  return (
    <div className={`relative flex shrink-0 items-center justify-center ${hero ? 'h-[300px] w-[260px]' : mini ? 'h-[26px] w-[22px]' : 'h-[58px] w-[58px]'} ${muted ? 'grayscale opacity-40' : ''}`}>
      <div className={`absolute rounded-[50%] bg-[#1b1720]/10 blur-[10px] ${hero ? 'bottom-[22px] h-[15px] w-[150px]' : mini ? 'bottom-0 h-[3px] w-[18px]' : 'bottom-[4px] h-[6px] w-[42px]'}`} />
      <div className={`relative rotate-[-31deg] rounded-full border border-[#c8c6bd] bg-gradient-to-br from-[#f5f4ec] via-[#d9d6ca] to-[#9f9b8e] shadow-[inset_0_8px_14px_rgba(255,255,255,0.78),0_16px_28px_rgba(77,72,62,0.18)] ${hero ? 'h-[174px] w-[86px]' : mini ? 'h-[25px] w-[13px]' : 'h-[52px] w-[26px]'}`}>
        <div className={`absolute left-1/2 -translate-x-1/2 rounded-full border border-[#bfc4c7] bg-gradient-to-br from-[#eef2f6] to-[#b9b9b1] ${hero ? 'top-[10px] h-[54px] w-[66px]' : mini ? 'top-[2px] h-[8px] w-[10px]' : 'top-[4px] h-[17px] w-[20px]'}`}>
          <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-[#caeeff] ${hero ? 'h-[37px] w-[37px] border-[3px] border-[#69d6ff]' : mini ? 'h-[5px] w-[5px] border border-[#69d6ff]' : 'h-[11px] w-[11px] border border-[#69d6ff]'}`} />
        </div>
        <div className={`absolute rounded-full border border-[#6acfff] bg-[#70d1ff] shadow-[0_0_8px_rgba(92,210,255,0.72)] ${hero ? 'right-[12px] top-[70px] h-[17px] w-[17px]' : mini ? 'right-[2px] top-[10px] h-[3px] w-[3px]' : 'right-[4px] top-[23px] h-[6px] w-[6px]'}`} />
        <div className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-[#8e887c] ${hero ? 'bottom-[17px] h-[28px] w-[52px]' : mini ? 'bottom-[2px] h-[4px] w-[8px]' : 'bottom-[5px] h-[8px] w-[15px]'}`}>
          <span className={`absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rotate-[28deg] bg-[#d2cdc1] ${hero ? 'h-[6px] w-[18px]' : mini ? 'h-[1px] w-[3px]' : 'h-[2px] w-[6px]'}`} />
        </div>
      </div>
    </div>
  );
};

const SmartCollarVisual: React.FC<{
  size?: 'tile' | 'hero';
}> = ({ size = 'tile' }) => {
  const hero = size === 'hero';

  return (
    <div className={`relative flex shrink-0 items-center justify-center ${hero ? 'h-[245px] w-[250px]' : 'h-[58px] w-[58px]'}`}>
      <div
        className={`absolute rounded-[50%] bg-[#1d1a24]/10 blur-[10px] ${
          hero ? 'bottom-[32px] h-[16px] w-[150px]' : 'bottom-[5px] h-[6px] w-[38px]'
        }`}
      />
      <div
        className={`relative rounded-[50%] border bg-gradient-to-br from-[#f4f6fb] via-[#d8dce7] to-[#a9aebc] shadow-[inset_0_10px_18px_rgba(255,255,255,0.82),0_12px_28px_rgba(61,65,80,0.18)] ${
          hero ? 'h-[104px] w-[184px] rotate-[-10deg] border-[#c8ccd8]' : 'h-[29px] w-[48px] rotate-[-10deg] border-[#c8ccd8]'
        }`}
      >
        <div
          className={`absolute rounded-[50%] bg-[#fafbff] ${
            hero ? 'left-[28px] top-[20px] h-[56px] w-[104px]' : 'left-[8px] top-[7px] h-[14px] w-[29px]'
          }`}
        />
        <div
          className={`absolute rounded-full bg-gradient-to-br from-[#f4f5fa] to-[#9ba0ac] shadow-[inset_0_4px_8px_rgba(255,255,255,0.55)] ${
            hero ? 'right-[2px] top-[50px] h-[28px] w-[55px] rotate-[-12deg]' : 'right-[-1px] top-[15px] h-[9px] w-[17px] rotate-[-12deg]'
          }`}
        />
        <div
          className={`absolute rounded-full bg-gradient-to-br from-[#eef3ff] to-[#aeb4c2] shadow-[0_3px_8px_rgba(45,48,61,0.18)] ${
            hero ? 'left-[18px] top-[50px] h-[50px] w-[50px]' : 'left-[5px] top-[15px] h-[15px] w-[15px]'
          }`}
        >
          <div
            className={`absolute rounded-full border bg-[#c9edff] ${
              hero ? 'inset-[8px] border-[3px] border-[#62cfff]' : 'inset-[3px] border border-[#62cfff]'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

const Nest: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pet } = usePetStore();
  const deviceName = pet?.name || '肉派派';
  const { minorModeEnabled } = useSubscriptionStore();
  const {
    points,
    dialogueCards,
    dialogueCardInventory,
    consumableInventory,
    exchangeDialogueCard,
  } = useDialogueStore();
  const translationCollarUnlocked = isTranslationCollarUnlocked(pet?.growth_stage);
  const initialCardDays = Number(searchParams.get('card')) || WHISPER_CARD_PRODUCTS[0].days;
  const [selectedCardDays, setSelectedCardDays] = useState(initialCardDays);
  const [exchangingCard, setExchangingCard] = useState(false);
  const [usingCard, setUsingCard] = useState(false);
  const [confirmingExchange, setConfirmingExchange] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(1);
  const [showUseSuccess, setShowUseSuccess] = useState(false);
  const [showInsufficientPoints, setShowInsufficientPoints] = useState(false);
  const [toast, setToast] = useState('');
  const cardDetailOpen = !minorModeEnabled && translationCollarUnlocked && (
    searchParams.get('item') === 'dialogue-card' || searchParams.get('item') === 'trial-card'
  );
  const collarDetailOpen = !minorModeEnabled && searchParams.get('item') === 'smart-collar';
  const selectedCard = WHISPER_CARD_PRODUCTS.find((card) => card.days === selectedCardDays)
    || WHISPER_CARD_PRODUCTS[0];
  const getOwnedCount = (days: number) => {
    const inventoryCount = dialogueCardInventory?.[String(days)] ?? 0;
    return days === 1 ? Math.max(inventoryCount, dialogueCards) : inventoryCount;
  };
  const selectedOwnedCount = getOwnedCount(selectedCard.days);

  const openWhisperCardDetail = (days: number) => {
    if (minorModeEnabled || !translationCollarUnlocked) return;
    setSelectedCardDays(days);
    setSearchParams({ item: 'dialogue-card', card: String(days) });
  };

  const openSmartCollarDetail = () => {
    if (minorModeEnabled) return;
    setSearchParams({ item: 'smart-collar' });
  };

  const closeTrialCardDetail = () => {
    setSearchParams({});
  };

  const exchangeSelectedCard = () => {
    if (minorModeEnabled || !translationCollarUnlocked || exchangingCard) return;
    setExchangeCount(1);
    setConfirmingExchange(true);
  };

  const updateExchangeCount = (value: string) => {
    const nextCount = Number(value.replace(/[^\d]/g, ''));
    setExchangeCount(Math.max(1, Math.min(99, Number.isNaN(nextCount) ? 1 : nextCount)));
  };

  const confirmExchangeSelectedCard = () => {
    if (minorModeEnabled || !translationCollarUnlocked || exchangingCard) return;
    const totalCost = selectedCard.cost * exchangeCount;
    if (points < totalCost) {
      setConfirmingExchange(false);
      setShowInsufficientPoints(true);
      return;
    }

    setExchangingCard(true);
    window.setTimeout(() => {
      exchangeDialogueCard(selectedCard.days, selectedCard.cost, exchangeCount);
      setExchangingCard(false);
      setConfirmingExchange(false);
      setToast('兑换成功，已放入小窝');
      window.setTimeout(() => setToast(''), 1600);
    }, 500);
  };

  const useSelectedCard = () => {
    if (!translationCollarUnlocked || !selectedOwnedCount || usingCard) return;
    setUsingCard(true);
    window.setTimeout(() => {
      setUsingCard(false);
      setSearchParams({});
      navigate('/dialogue-mode');
    }, 500);
  };

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
          <h1 className="text-[18px] text-[#222222] font-medium absolute left-1/2 -translate-x-1/2">小窝</h1>
          <div className="ml-auto flex items-center justify-center w-[40px] h-[40px] rounded-[13px] border border-[#ffffff66] bg-[#ffffff33]">
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

              {!minorModeEnabled && (
                <>
                  {/* Vector 1 Separator */}
                  <img src="/images/mo1cw4a9-og2pxnl.svg" alt="Section Separator" className="w-[305px] h-[1px] mt-[14px]" />

                  {/* Section 2: 翻译项圈 */}
                  <div className="w-full flex flex-col mt-[14px]">
                    <div className="flex items-center gap-[8px] relative">
                      <h3 className="text-[16px] text-[#000000] font-medium tracking-[0.16px] leading-[22px]">翻译项圈</h3>
                      <HelpCircle size={15} className="text-[#7c5ae0]" />
                    </div>

                    <div className="flex items-center gap-[10px] mt-[11px] overflow-x-auto scrollbar-hide">
                      <button
                        type="button"
                        onClick={openSmartCollarDetail}
                        className={`flex shrink-0 flex-col items-center rounded-[8px] border px-[14px] pb-[12px] pt-[12px] ${
                          translationCollarUnlocked
                            ? 'border-[#2222220d] bg-[#22222208]'
                            : 'border-dashed border-[#cfcbd5] bg-[#f4f3f6]'
                        }`}
                      >
                        <div className={translationCollarUnlocked ? '' : 'opacity-45 grayscale'}>
                          <SmartCollarVisual />
                        </div>
                        <span className="mt-[5px] text-[13px] text-[#000000] tracking-[0.13px] leading-[18px]">
                          翻译项圈
                        </span>
                        <span className={`mt-[3px] text-[11px] tracking-[0.11px] leading-[15px] ${
                          translationCollarUnlocked ? 'text-[#7c5ae0cc]' : 'text-[#22222266]'
                        }`}>
                          {translationCollarUnlocked ? '已解锁' : '第4阶段解锁'}
                        </span>
                      </button>
                      {translationCollarUnlocked && WHISPER_CARD_PRODUCTS.map((card) => (
                        <button
                          type="button"
                          key={card.days}
                          onClick={() => openWhisperCardDetail(card.days)}
                          className="flex shrink-0 flex-col items-center rounded-[8px] border border-[#2222220d] bg-[#22222208] px-[14px] pb-[12px] pt-[12px]"
                        >
                          <DialogueCardVisual days={card.days} />
                          <span className="mt-[5px] text-[13px] text-[#000000] tracking-[0.13px] leading-[18px]">
                            项环电池
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Vector 1 Separator */}
              <img src="/images/mo1cw4a9-og2pxnl.svg" alt="Section Separator" className="w-[305px] h-[1px] mt-[14px]" />

              {/* Section 3: 画框皮肤 */}
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

              {/* Section 4: 日用品 */}
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
                    <span className="mt-[3px] text-[11px] text-[#22222266] tracking-[0.11px] leading-[15px]">拥有 {consumableInventory?.aiPaper ?? 999} 张</span>
                  </div>

                  {/* Card 2: 改名卡 */}
                  <div className="flex flex-col items-center border border-[#2222220d] rounded-[8px] bg-[#22222208] pt-[11px] px-[13px] pb-[8px] pl-[12px] shrink-0">
                    <div className="flex items-center px-[3px] pb-[1px] overflow-hidden mx-[2px]">
                      <img src="/images/mo1bj51c-ftijsui.png" alt="Item" className="w-[52px] h-[58px] object-contain drop-shadow-sm" />
                    </div>
                    <span className="mt-[5px] text-[13px] text-[#000000] tracking-[0.13px] leading-[18px]">改名卡</span>
                    <span className="mt-[3px] text-[11px] text-[#22222266] tracking-[0.11px] leading-[15px]">拥有 {consumableInventory?.renameCard ?? 999} 张</span>
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

        {toast && (
          <div className="absolute left-1/2 top-[104px] z-[120] -translate-x-1/2 rounded-full bg-[#25212b] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
            {toast}
          </div>
        )}

        {collarDetailOpen && (
          <div
            className="absolute inset-0 z-[90] flex items-end bg-black/55"
            onClick={closeTrialCardDetail}
          >
            <div className="absolute left-1/2 top-[146px] z-[95] -translate-x-1/2" onClick={(event) => event.stopPropagation()}>
              <PointsBalancePill points={points} onAdd={() => navigate('/points-store?returnTo=/nest')} />
            </div>
            <section
              className="relative min-h-[590px] w-full rounded-t-[10px] bg-[#fafafa] px-4 pb-8 pt-9 shadow-[0_-14px_40px_rgba(0,0,0,0.16)]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="关闭翻译项圈详情"
                onClick={closeTrialCardDetail}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#eeeeef] text-[#5f5b64]"
              >
                <X size={19} />
              </button>

              <div className="flex h-[320px] items-center justify-center">
                <SmartCollarVisual size="hero" />
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[18px] font-semibold leading-[25px] text-[#222127]">翻译项圈</h2>
                  <p className="mt-3 max-w-[280px] text-[13px] font-medium leading-[22px] text-[#8b8792]">
                    {translationCollarUnlocked
                      ? `经过两年的研发努力，何博士发明了一个能够帮助${deviceName}与人类更好沟通的翻译项圈。`
                      : `成长到第 4 阶段后，${deviceName}会解锁翻译项圈，开始尝试用更容易被你听懂的方式表达自己。`}
                  </p>
                </div>
                <span className="mt-1 rounded-full bg-[#f3f3f5] px-3 py-1 text-[11px] font-medium text-[#8b8792]">
                  {translationCollarUnlocked ? '已解锁' : '未解锁'}
                </span>
              </div>
            </section>
          </div>
        )}

        {cardDetailOpen && selectedCard && (
          <div
            className="absolute inset-0 z-[90] flex items-end bg-black/55"
            onClick={closeTrialCardDetail}
          >
            <div className="absolute left-1/2 top-[146px] z-[95] -translate-x-1/2" onClick={(event) => event.stopPropagation()}>
              <PointsBalancePill points={points} onAdd={() => navigate('/points-store?returnTo=/nest')} />
            </div>
            <section
              className="relative w-full rounded-t-[28px] bg-[#fafafa] px-5 pb-8 pt-5 shadow-[0_-14px_40px_rgba(0,0,0,0.16)]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="关闭项环电池详情"
                onClick={closeTrialCardDetail}
                className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#eeeeef] text-[#5f5b64]"
              >
                <X size={19} />
              </button>

              <div className="flex h-[245px] items-center justify-center">
                <DialogueCardVisual days={selectedCard.days} size="hero" />
              </div>

              <div className="mt-5 flex items-start justify-between">
                <div>
                  <h2 className="text-[22px] font-semibold text-[#222127]">项环电池</h2>
                  <p className="mt-2 max-w-[245px] text-[12px] leading-5 text-[#8b8792]">
                    一块项环电池即可给项环充满电，充满后{deviceName}就可以持续发出人类的声音。
                  </p>
                </div>
                <span className="rounded-full bg-[#f3f0fb] px-3 py-1.5 text-[11px] font-semibold text-[#7c5ae0]">
                  拥有 {selectedOwnedCount}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[#222127]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ffe49a] text-[12px]">◉</span>
                <strong className="text-[28px] leading-8">{selectedCard.cost}</strong>
              </div>

              <div className={`mt-6 grid gap-3 ${selectedOwnedCount ? 'grid-cols-[0.92fr_1.08fr]' : 'grid-cols-1'}`}>
                <button
                  type="button"
                  onClick={exchangeSelectedCard}
                  className={`${selectedOwnedCount ? 'border border-[#e5dcff] bg-white text-[#7c5ae0]' : points >= selectedCard.cost ? 'bg-[#7c5ae0] text-white' : 'bg-[#f2effa] text-[#7c5ae0]'} flex h-[54px] items-center justify-center rounded-[18px] text-[16px] font-semibold shadow-[0_10px_24px_rgba(115,78,218,0.18)]`}
                >
                  {exchangingCard ? (
                    <>
                      <LoaderCircle size={18} className="mr-2 animate-spin" />
                      正在兑换
                    </>
                  ) : (
                    '积分兑换'
                  )}
                </button>
                {Boolean(selectedOwnedCount) && (
                  <button
                    type="button"
                    disabled={usingCard}
                    onClick={useSelectedCard}
                    className="flex h-[54px] items-center justify-center rounded-[18px] bg-[#8b66ef] text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(115,78,218,0.24)]"
                  >
                    {usingCard ? (
                      <>
                        <LoaderCircle size={18} className="mr-2 animate-spin" />
                        正在使用
                      </>
                    ) : (
                      '使用'
                    )}
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {confirmingExchange && (
          <div className="absolute inset-0 z-[115] flex items-center justify-center bg-black/45 px-8">
            <section className="w-full rounded-[20px] bg-white px-6 py-6 text-center shadow-[0_18px_42px_rgba(0,0,0,0.18)]">
              <h2 className="text-[18px] font-semibold text-[#222127]">兑换项环电池</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#222127]">
                每{selectedCard.cost}积分可兑换一块项环电池，
                <br />
                当前剩余积分 {points}。
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-[#222127]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ffe49a] text-[13px]">◉</span>
                <span className="text-[16px] font-semibold">{selectedCard.cost}</span>
                <span className="text-[16px] font-semibold">=</span>
                <div className="flex h-10 items-center gap-2 rounded-[8px] border border-[#e9e5ef] bg-[#f7f7f8] px-3">
                  <DialogueCardVisual days={selectedCard.days} size="mini" />
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={exchangeCount}
                    onChange={(event) => updateExchangeCount(event.target.value)}
                    className="h-8 w-10 bg-transparent text-center text-[16px] font-semibold text-[#222127] outline-none"
                    aria-label="兑换数量"
                    autoFocus
                  />
                </div>
              </div>
              <p className="mt-3 text-[12px] text-[#8b8792]">
                本次需消耗 {selectedCard.cost * exchangeCount} 积分
              </p>
              <button
                type="button"
                onClick={confirmExchangeSelectedCard}
                className="mt-5 h-12 w-full rounded-[14px] bg-[#7c5ae0] text-[15px] font-semibold text-white"
              >
                {exchangingCard ? (
                  <span className="inline-flex items-center">
                    <LoaderCircle size={18} className="mr-2 animate-spin" />
                    正在兑换
                  </span>
                ) : (
                  '确定兑换'
                )}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingExchange(false)}
                className="mt-3 h-11 w-full rounded-[14px] border border-[#e6e1ed] bg-white text-[14px] font-semibold text-[#4f4a55]"
              >
                取消
              </button>
            </section>
          </div>
        )}

        {showInsufficientPoints && (
          <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/45 px-8">
            <section className="w-full rounded-[24px] bg-white px-6 py-7 text-center shadow-[0_18px_42px_rgba(0,0,0,0.18)]">
              <h2 className="text-[18px] font-semibold text-[#222127]">当前积分不足</h2>
              <p className="mt-3 text-[15px] leading-6 text-[#6f6875]">去购买更多积分</p>
              <button
                type="button"
                onClick={() => navigate('/points-store?returnTo=/nest')}
                className="mt-6 h-12 w-full rounded-[16px] bg-[#8b66ef] text-[15px] font-semibold text-white"
              >
                去购买
              </button>
              <button
                type="button"
                onClick={() => setShowInsufficientPoints(false)}
                className="mt-3 h-11 w-full rounded-[16px] border border-[#e6e1ed] bg-white text-[14px] font-semibold text-[#4f4a55]"
              >
                算了
              </button>
            </section>
          </div>
        )}

        {showUseSuccess && (
          <div className="absolute inset-0 z-[115] flex items-center justify-center bg-black/45 px-8">
            <section className="w-full rounded-[24px] bg-white px-5 py-6 text-center shadow-[0_18px_42px_rgba(0,0,0,0.18)]">
              <h2 className="text-[18px] font-semibold text-[#222127]">项环电池已添加</h2>
              <p className="mt-3 text-[13px] leading-6 text-[#6f6875]">
                已为你补满一次项环电量，可以继续让{deviceName}变声。
              </p>
              <button
                type="button"
                onClick={() => navigate('/dialogue-mode?card=active')}
                className="mt-6 h-12 w-full rounded-[16px] bg-[#8b66ef] text-[14px] font-semibold text-white"
              >
                去变声模式
              </button>
              <button
                type="button"
                onClick={() => setShowUseSuccess(false)}
                className="mt-3 h-11 w-full rounded-[16px] border border-[#e6e1ed] bg-white text-[14px] font-semibold text-[#6f6875]"
              >
                留在小窝
              </button>
            </section>
          </div>
        )}

        <BottomNav />

      </div>
    </div>
  );
};

export default Nest;
