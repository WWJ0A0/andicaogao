import React, { useState } from 'react';
import { HelpCircle, LoaderCircle, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { useDialogueStore } from '@/store/useDialogueStore';
import { usePetStore } from '@/store/usePetStore';

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
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-gradient-to-br from-[#aa8cff] via-[#8a66ef] to-[#6f4bd6] text-white ${
        hero ? 'h-[190px] w-[170px]' : mini ? 'h-[26px] w-[22px]' : 'h-[58px] w-[58px]'
      } ${muted ? 'grayscale opacity-40' : ''}`}
    >
      <div className={`absolute rounded-full bg-white/10 ${hero ? '-right-8 -top-8 h-24 w-24' : '-right-4 -top-4 h-12 w-12'}`} />
      <div className={`absolute rounded-full border border-white/12 ${hero ? '-bottom-8 -left-8 h-24 w-24' : '-bottom-5 -left-5 h-12 w-12'}`} />
      <div className="relative flex items-end justify-center">
        <span className={`${hero ? 'h-16 w-16' : mini ? 'h-2 w-2' : 'h-5 w-5'} rounded-full bg-white/18 shadow-[0_0_24px_rgba(255,255,255,0.32)]`} />
      </div>
    </div>
  );
};

const Nest: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pet } = usePetStore();
  const deviceName = pet?.name || '肉派派';
  const {
    points,
    dialogueCards,
    dialogueCardInventory,
    exchangeDialogueCard,
    useDialogueCard: applyDialogueCard,
  } = useDialogueStore();
  const initialCardDays = Number(searchParams.get('card')) || WHISPER_CARD_PRODUCTS[0].days;
  const [selectedCardDays, setSelectedCardDays] = useState(initialCardDays);
  const [exchangingCard, setExchangingCard] = useState(false);
  const [usingCard, setUsingCard] = useState(false);
  const [confirmingExchange, setConfirmingExchange] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(1);
  const [showUseSuccess, setShowUseSuccess] = useState(false);
  const [showInsufficientPoints, setShowInsufficientPoints] = useState(false);
  const [toast, setToast] = useState('');
  const cardDetailOpen = searchParams.get('item') === 'dialogue-card' || searchParams.get('item') === 'trial-card';
  const selectedCard = WHISPER_CARD_PRODUCTS.find((card) => card.days === selectedCardDays)
    || WHISPER_CARD_PRODUCTS[0];
  const getOwnedCount = (days: number) => {
    const inventoryCount = dialogueCardInventory?.[String(days)] ?? 0;
    return days === 1 ? Math.max(inventoryCount, dialogueCards) : inventoryCount;
  };
  const selectedOwnedCount = getOwnedCount(selectedCard.days);

  const openWhisperCardDetail = (days: number) => {
    setSelectedCardDays(days);
    setSearchParams({ item: 'dialogue-card', card: String(days) });
  };

  const closeTrialCardDetail = () => {
    setSearchParams({});
  };

  const exchangeSelectedCard = () => {
    if (exchangingCard) return;
    setExchangeCount(1);
    setConfirmingExchange(true);
  };

  const updateExchangeCount = (value: string) => {
    const nextCount = Number(value.replace(/[^\d]/g, ''));
    setExchangeCount(Math.max(1, Math.min(99, Number.isNaN(nextCount) ? 1 : nextCount)));
  };

  const confirmExchangeSelectedCard = () => {
    if (exchangingCard) return;
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
    if (!selectedOwnedCount || usingCard) return;
    setUsingCard(true);
    window.setTimeout(() => {
      applyDialogueCard(selectedCard.days);
      setUsingCard(false);
      setSearchParams({});
      setShowUseSuccess(true);
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

              {/* Section 2: 悄悄话 */}
              <div className="w-full flex flex-col mt-[14px]">
                <div className="flex items-center gap-[8px] relative">
                  <h3 className="text-[16px] text-[#000000] font-medium tracking-[0.16px] leading-[22px]">悄悄话</h3>
                  <HelpCircle size={15} className="text-[#7c5ae0]" />
                </div>

                <div className="flex items-center gap-[10px] mt-[11px] overflow-x-auto scrollbar-hide">
                  {WHISPER_CARD_PRODUCTS.map((card) => (
                    <button
                      type="button"
                      key={card.days}
                      onClick={() => openWhisperCardDetail(card.days)}
                      className="flex shrink-0 flex-col items-center rounded-[8px] border border-[#2222220d] bg-[#22222208] px-[14px] pb-[12px] pt-[12px]"
                    >
                      <DialogueCardVisual days={card.days} />
                      <span className="mt-[5px] text-[13px] text-[#000000] tracking-[0.13px] leading-[18px]">
                        悄悄话卡
                      </span>
                    </button>
                  ))}
                </div>
              </div>

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

        {toast && (
          <div className="absolute left-1/2 top-[104px] z-[120] -translate-x-1/2 rounded-full bg-[#25212b] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
            {toast}
          </div>
        )}

        {cardDetailOpen && selectedCard && (
          <div
            className="absolute inset-0 z-[90] flex items-end bg-black/55"
            onClick={closeTrialCardDetail}
          >
            <div className="absolute left-1/2 top-[146px] z-[95] flex h-10 -translate-x-1/2 items-center rounded-full border border-black/20 bg-[#f1f1f3] px-4 shadow-[0_8px_18px_rgba(0,0,0,0.18)]">
              <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffe49a] text-[12px] shadow-inner">
                ◉
              </span>
              <span className="text-[18px] font-medium tracking-normal text-[#222127]">{points}</span>
            </div>
            <section
              className="relative w-full rounded-t-[28px] bg-[#fafafa] px-5 pb-8 pt-5 shadow-[0_-14px_40px_rgba(0,0,0,0.16)]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="关闭悄悄话卡详情"
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
                  <h2 className="text-[22px] font-semibold text-[#222127]">悄悄话卡</h2>
                  <p className="mt-2 max-w-[245px] text-[12px] leading-5 text-[#8b8792]">
                    使用后可以充满一次社交电量，让 {deviceName} 继续陪你说悄悄话。
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
              <h2 className="text-[18px] font-semibold text-[#222127]">积分兑换</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#222127]">
                每{selectedCard.cost}积分可兑换一张悄悄话卡，
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
              <h2 className="text-[18px] font-semibold text-[#222127]">悄悄话卡已生效</h2>
              <p className="mt-3 text-[13px] leading-6 text-[#6f6875]">
                已为你充满一次社交电量，可以继续和{deviceName}说话。
              </p>
              <button
                type="button"
                onClick={() => navigate('/dialogue-mode?card=active')}
                className="mt-6 h-12 w-full rounded-[16px] bg-[#8b66ef] text-[14px] font-semibold text-white"
              >
                去悄悄话模式
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
