import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, LoaderCircle, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TrialCardArtwork from '@/components/subscription/TrialCardArtwork';
import { usePetStore } from '@/store/usePetStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';

const Nest: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pet } = usePetStore();
  const deviceName = pet?.name || '肉派派';
  const {
    trialCards,
    expiryDate,
    voiceConsentGranted,
    selectTrialCard,
    setPaymentState,
  } = useSubscriptionStore();
  const orderedTrialCards = useMemo(() => trialCards
    .filter((card) => card.status !== 'used')
    .sort((a, b) => {
    const order = { active: 0, available: 1 };
    return order[a.status] - order[b.status];
  }), [trialCards]);
  const availableTrialCards = trialCards.filter((card) => card.status === 'available');
  const activeTrialCards = trialCards.filter((card) => card.status === 'active');
  const initialTrialCardId = searchParams.get('card')
    || activeTrialCards[0]?.id
    || availableTrialCards[0]?.id
    || orderedTrialCards[0]?.id
    || '';
  const [selectedTrialCardId, setSelectedTrialCardId] = useState(initialTrialCardId);
  const [usingTrialCard, setUsingTrialCard] = useState(false);
  const trialDetailOpen = searchParams.get('item') === 'trial-card';
  const selectedTrialCard = orderedTrialCards.find((card) => card.id === selectedTrialCardId)
    || orderedTrialCards[0];
  const selectedTrialCardIndex = selectedTrialCard
    ? orderedTrialCards.findIndex((card) => card.id === selectedTrialCard.id)
    : -1;
  const trialCardStatus = activeTrialCards.length
    ? '使用中'
    : availableTrialCards.length
      ? `拥有 ${availableTrialCards.length} 张`
      : '已全部使用';

  const openTrialCardDetail = (cardId = initialTrialCardId) => {
    setSelectedTrialCardId(cardId);
    setSearchParams({ item: 'trial-card', card: cardId });
  };

  const closeTrialCardDetail = () => {
    setSearchParams({});
  };

  const moveTrialCard = (direction: -1 | 1) => {
    if (!orderedTrialCards.length) return;
    const nextIndex = (selectedTrialCardIndex + direction + orderedTrialCards.length) % orderedTrialCards.length;
    const nextCard = orderedTrialCards[nextIndex];
    setSelectedTrialCardId(nextCard.id);
    setSearchParams({ item: 'trial-card', card: nextCard.id }, { replace: true });
  };

  const useTrialCard = () => {
    if (!selectedTrialCard || selectedTrialCard.status !== 'available' || usingTrialCard) return;
    selectTrialCard(selectedTrialCard.id);
    if (!voiceConsentGranted) {
      navigate(`/subscription/voice-consent?source=trial&returnTo=${encodeURIComponent(`/nest?item=trial-card&card=${selectedTrialCard.id}`)}`);
      return;
    }

    setUsingTrialCard(true);
    setPaymentState('opening');
    window.setTimeout(() => {
      navigate('/subscription/opening?source=trial');
    }, 700);
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

                  {/* Card 3: 体验卡 */}
                  <button
                    type="button"
                    onClick={() => openTrialCardDetail()}
                    className={`flex flex-col items-center rounded-[8px] bg-[#22222208] pt-[11px] px-[13px] pb-[8px] pl-[12px] shrink-0 ${
                      activeTrialCards.length
                        ? 'border-[1.5px] border-[#7c5ae0] shadow-[0_0_8px_rgba(124,90,224,0.15)]'
                        : 'border border-[#2222220d]'
                    }`}
                  >
                    <span className="flex h-[59px] w-[58px] items-center justify-center">
                      <TrialCardArtwork
                        days={selectedTrialCard?.days ?? availableTrialCards[0]?.days ?? 7}
                        status={selectedTrialCard?.status ?? 'available'}
                      />
                    </span>
                    <span className="mt-[5px] text-[13px] text-[#000000] tracking-[0.13px] leading-[18px]">体验卡</span>
                    <span className={`mt-[3px] text-[11px] tracking-[0.11px] leading-[15px] ${
                      activeTrialCards.length ? 'font-medium text-[#7c5ae0]' : 'text-[#22222266]'
                    }`}>
                      {trialCardStatus}
                    </span>
                  </button>
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

        {trialDetailOpen && selectedTrialCard && (
          <div
            className="absolute inset-0 z-[90] flex items-end bg-black/55"
            onClick={closeTrialCardDetail}
          >
            <section
              className="relative w-full rounded-t-[28px] bg-[#fafafa] px-5 pb-8 pt-5 shadow-[0_-14px_40px_rgba(0,0,0,0.16)]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="关闭体验卡详情"
                onClick={closeTrialCardDetail}
                className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#eeeeef] text-[#5f5b64]"
              >
                <X size={19} />
              </button>

              <div className="flex h-[315px] items-center justify-center">
                <button
                  type="button"
                  aria-label="上一张体验卡"
                  onClick={() => moveTrialCard(-1)}
                  className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#77727f] shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <TrialCardArtwork
                  days={selectedTrialCard.days}
                  status={selectedTrialCard.status}
                  size="hero"
                  className="-rotate-[3deg]"
                />
                <button
                  type="button"
                  aria-label="下一张体验卡"
                  onClick={() => moveTrialCard(1)}
                  className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#77727f] shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="flex justify-center gap-1.5">
                {orderedTrialCards.map((card) => (
                  <button
                    type="button"
                    key={card.id}
                    aria-label={`查看 ${card.days} 天体验卡`}
                    onClick={() => {
                      setSelectedTrialCardId(card.id);
                      setSearchParams({ item: 'trial-card', card: card.id }, { replace: true });
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      card.id === selectedTrialCard.id ? 'w-5 bg-[#222127]' : 'w-1.5 bg-[#d6d3d9]'
                    }`}
                  />
                ))}
              </div>

              <div className="mt-5 flex items-start justify-between">
                <div>
                  <h2 className="text-[22px] font-semibold text-[#222127]">{selectedTrialCard.days} 天体验卡</h2>
                  <p className="mt-2 text-[12px] text-[#8b8792]">权益设备：{deviceName}</p>
                  {selectedTrialCard.status === 'active' && expiryDate && (
                    <p className="mt-1 text-[12px] text-[#8b8792]">{expiryDate} 到期</p>
                  )}
                </div>
                <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                  selectedTrialCard.status === 'active'
                    ? 'bg-[#eee8ff] text-[#704bd4]'
                    : selectedTrialCard.status === 'used'
                      ? 'bg-[#eeeeef] text-[#96919b]'
                      : 'bg-[#e8f7ef] text-[#31845c]'
                }`}>
                  {selectedTrialCard.status === 'active'
                    ? '使用中'
                    : selectedTrialCard.status === 'used'
                      ? '已使用'
                      : '可使用'}
                </span>
              </div>

              <button
                type="button"
                disabled={selectedTrialCard.status !== 'available' || usingTrialCard}
                onClick={useTrialCard}
                className={`mt-6 flex h-[54px] w-full items-center justify-center rounded-[18px] text-[16px] font-semibold ${
                  selectedTrialCard.status === 'available'
                    ? 'bg-[#8b66ef] text-white shadow-[0_10px_24px_rgba(115,78,218,0.24)]'
                    : 'cursor-not-allowed bg-[#dedce1] text-white'
                }`}
              >
                {usingTrialCard ? (
                  <>
                    <LoaderCircle size={18} className="mr-2 animate-spin" />
                    正在使用
                  </>
                ) : selectedTrialCard.status === 'active' ? (
                  '使用中'
                ) : selectedTrialCard.status === 'used' ? (
                  '已使用'
                ) : (
                  '使用体验卡'
                )}
              </button>
            </section>
          </div>
        )}

        {/* System Home Indicator */}
        <div className="absolute bottom-0 left-[1px] flex items-start pt-[21px] px-[129px] pb-[8px] w-[394px] h-[34px] z-50 pointer-events-none">
          <div className="w-[134px] h-[5px] bg-[#222222] rounded-[100px]"></div>
        </div>

      </div>
    </div>
  );
};

export default Nest;
