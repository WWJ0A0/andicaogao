import React, { useState } from 'react';
import { Brain, Check, ChevronDown, ChevronRight, ChevronUp, HeartHandshake, MessageCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TrialCardArtwork from '@/components/subscription/TrialCardArtwork';
import { PrototypeHeader, PrototypePhone, PrototypeStatusBar } from '@/components/subscription/PrototypeUI';
import { TrialCard, useSubscriptionStore } from '@/store/useSubscriptionStore';

const trialBenefits = [
  { title: '不限时长语音对话', icon: MessageCircle },
  { title: '长期记忆能力', icon: Brain },
  { title: '更高的情绪感知', icon: HeartHandshake },
  { title: '深度交流能力', icon: Check },
];

const statusLabel = (card: TrialCard) => {
  if (card.status === 'active') return '使用中';
  if (card.status === 'used') return '已使用';
  return '可使用';
};

const statusClassName = (card: TrialCard) => {
  if (card.status === 'active') return 'bg-[#eee8ff] text-[#704bd4]';
  if (card.status === 'used') return 'bg-[#eeeeef] text-[#96919b]';
  return 'bg-[#e8f7ef] text-[#31845c]';
};

const TrialExperience: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showBenefits, setShowBenefits] = useState(false);
  const returnTo = searchParams.get('returnTo') || '/dialogue-mode';
  const { expiryDate, trialCards } = useSubscriptionStore();

  const availableCount = trialCards.filter((card) => card.status === 'available').length;
  const activeCount = trialCards.filter((card) => card.status === 'active').length;
  const orderedCards = [...trialCards].sort((a, b) => {
    const order = { active: 0, available: 1, used: 2 };
    return order[a.status] - order[b.status];
  });

  const openCardDetail = (card: TrialCard) => {
    if (card.status === 'used') {
      navigate(`/subscription/orders?trialCardId=${encodeURIComponent(card.id)}`);
      return;
    }
    navigate(`/nest?item=trial-card&card=${encodeURIComponent(card.id)}`);
  };

  return (
    <PrototypePhone className="bg-[#f8f7f9]">
      <PrototypeStatusBar />
      <PrototypeHeader title="体验卡" onBack={() => navigate(returnTo)} />

      <div className="h-[780px] overflow-y-auto px-5 pb-10 pt-4 scrollbar-hide">
        <section className="rounded-[22px] bg-gradient-to-br from-[#9c7cf4] to-[#7652df] px-5 py-5 text-white shadow-[0_12px_28px_rgba(91,58,174,0.18)]">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[12px] text-white/75">我的体验卡</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <strong className="text-[30px] leading-none">{availableCount}</strong>
                <span className="text-[12px] text-white/80">张可用</span>
              </div>
            </div>
            <div className="text-right text-[11px] leading-5 text-white/80">
              {activeCount > 0 ? (
                <>
                  <strong className="block text-[13px] text-white">正在使用</strong>
                  <span>{expiryDate} 到期</span>
                </>
              ) : (
                <span>前往小窝选择并使用</span>
              )}
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={() => setShowBenefits((visible) => !visible)}
          className="mt-4 flex w-full items-center justify-between rounded-[18px] border border-[#ece8f2] bg-white px-4 py-4 text-left"
        >
          <span className="text-[15px] font-semibold text-[#29262e]">可体验权益</span>
          <span className="flex items-center gap-1 text-[11px] text-[#8b8792]">
            查看权益
            {showBenefits ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        {showBenefits && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {trialBenefits.map(({ title, icon: Icon }) => (
              <div key={title} className="flex min-h-[48px] items-center rounded-[12px] bg-[#f0ecfb] px-3">
                <Icon size={17} className="shrink-0 text-[#8b66ef]" strokeWidth={2.2} />
                <span className="ml-2 text-[11px] font-medium leading-4 text-[#4d4657]">{title}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mb-3 mt-6 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#29262e]">全部体验卡</h2>
          <span className="text-[11px] text-[#aaa6ae]">共 {trialCards.length} 张</span>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-[#ebe8ef] bg-white">
          {orderedCards.map((card, index) => (
            <button
              type="button"
              key={card.id}
              onClick={() => openCardDetail(card)}
              className={`flex min-h-[94px] w-full items-center px-4 py-3 text-left ${
                index > 0 ? 'border-t border-[#efedf2]' : ''
              }`}
            >
              <TrialCardArtwork days={card.days} status={card.status} />
              <span className="ml-3 min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <strong className="text-[15px] text-[#29262e]">{card.days} 天体验卡</strong>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${statusClassName(card)}`}>
                    {statusLabel(card)}
                  </span>
                </span>
                <span className="mt-2 flex items-center text-[11px] text-[#8b8792]">
                  查看详情
                  <ChevronRight size={14} className="ml-0.5" />
                </span>
              </span>
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-[10px] leading-5 text-[#99949e]">
          可用体验卡需前往小窝使用，已使用记录可在历史订单查看
        </p>
      </div>
    </PrototypePhone>
  );
};

export default TrialExperience;
