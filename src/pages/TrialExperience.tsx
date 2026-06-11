import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Check,
  Gift,
  HeartHandshake,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  LoaderCircle,
} from 'lucide-react';
import { PrototypeHeader, PrototypePhone, PrototypeStatusBar } from '@/components/subscription/PrototypeUI';
import { TrialCard, useSubscriptionStore } from '@/store/useSubscriptionStore';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const trialBenefits = [
  {
    title: '不限时长语音对话',
    icon: MessageCircle,
  },
  {
    title: '长期记忆能力',
    icon: Brain,
  },
  {
    title: '更高的情绪感知',
    icon: HeartHandshake,
  },
  {
    title: '深度交流能力',
    icon: Check,
  },
];

const TrialExperience: React.FC = () => {
  const navigate = useNavigate();
  const {
    entitlement,
    expiryDate,
    nextChargeDate,
    autoRenewEnabled,
    trialCards,
    selectTrialCard,
    activateTrial,
  } = useSubscriptionStore();
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activationResult, setActivationResult] = useState<{
    days: number;
    oldExpiry: string;
    newExpiry: string;
    oldNextCharge: string;
    newNextCharge: string;
  } | null>(null);
  const [selectedCard, setSelectedCard] = useState<TrialCard | null>(null);
  const [viewedCard, setViewedCard] = useState<TrialCard | null>(null);
  const [applyingCard, setApplyingCard] = useState(false);

  const availableCards = trialCards.filter((card) => card.status === 'available');
  const activeCards = trialCards.filter((card) => card.status === 'active');
  const usedCards = trialCards.filter((card) => card.status === 'used');
  const orderedCards = [...activeCards, ...availableCards, ...usedCards];

  const handleUseCardClick = (card: TrialCard) => {
    setSelectedCard(card);
    setShowConfirmModal(true);
  };

  const confirmActivation = () => {
    if (!selectedCard || applyingCard) return;
    const result = {
      days: selectedCard.days,
      oldExpiry: expiryDate || formatDate(new Date()),
      newExpiry: proposed.expiry,
      oldNextCharge: autoRenewEnabled ? nextChargeDate : '',
      newNextCharge: proposed.nextCharge,
    };

    setApplyingCard(true);
    window.setTimeout(() => {
      selectTrialCard(selectedCard.id);
      activateTrial();
      setShowConfirmModal(false);
      setActivationResult(result);
      setSelectedCard(null);
      setApplyingCard(false);
    }, 900);
  };

  const calculateProposedDates = () => {
    if (!selectedCard) return { expiry: '', nextCharge: '' };
    
    // 如果没有 expiryDate，则从今天开始算
    let baseExpiry = new Date();
    if (expiryDate) {
      const [y, m, d] = expiryDate.split('.').map(Number);
      baseExpiry = new Date(y, m - 1, d);
    } else {
      // 确保是从今天凌晨开始算
      baseExpiry.setHours(0, 0, 0, 0);
    }
    const proposedExpiry = new Date(baseExpiry);
    proposedExpiry.setDate(proposedExpiry.getDate() + selectedCard.days);

    let proposedNextCharge = '';
    if (autoRenewEnabled && nextChargeDate) {
      const [y, m, d] = nextChargeDate.split('.').map(Number);
      const nextDate = new Date(y, m - 1, d);
      nextDate.setDate(nextDate.getDate() + selectedCard.days);
      proposedNextCharge = formatDate(nextDate);
    }

    return {
      expiry: formatDate(proposedExpiry),
      nextCharge: proposedNextCharge
    };
  };

  const proposed = calculateProposedDates();

  return (
    <PrototypePhone className="bg-[#f8f7f9]">
      <PrototypeStatusBar />
      <PrototypeHeader title="体验卡" onBack={() => navigate('/dialogue-mode')} />
      <div className="h-[780px] overflow-y-auto px-5 pb-10 pt-4 scrollbar-hide relative">
        {activationResult && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-6">
            <div className="w-full max-w-[320px] rounded-[28px] bg-white p-6 text-center shadow-2xl">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eee8ff] text-[#8b66ef]">
                <Check size={30} strokeWidth={2.5} />
              </span>
              <h3 className="mt-4 text-[20px] font-bold text-[#222127]">
                已叠加 {activationResult.days} 天体验
              </h3>
              <p className="mt-2 text-[12px] leading-5 text-[#8b8792]">
                会员权益保持不变，体验时间已顺延至当前订阅周期。
              </p>

              <div className="mt-5 space-y-3 text-left">
                <div className="rounded-[14px] bg-[#f6f3ff] px-4 py-3">
                  <span className="block text-[10px] text-[#8b8792]">权益有效期</span>
                  <div className="mt-1 flex items-center justify-between text-[12px]">
                    <span className="text-[#77727f]">{activationResult.oldExpiry}</span>
                    <ArrowRight size={14} className="text-[#8b66ef]" />
                    <strong className="text-[#6849cc]">{activationResult.newExpiry}</strong>
                  </div>
                </div>
                {activationResult.newNextCharge && (
                  <div className="rounded-[14px] bg-[#f6f3ff] px-4 py-3">
                    <span className="block text-[10px] text-[#8b8792]">下次自动续费时间</span>
                    <div className="mt-1 flex items-center justify-between text-[12px]">
                      <span className="text-[#77727f]">{activationResult.oldNextCharge}</span>
                      <ArrowRight size={14} className="text-[#8b66ef]" />
                      <strong className="text-[#6849cc]">{activationResult.newNextCharge}</strong>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActivationResult(null)}
                className="mt-6 h-12 w-full rounded-[20px] bg-[#8b66ef] text-[15px] font-semibold text-white"
              >
                知道了
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        {showConfirmModal && selectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
            <div className="w-full max-w-[320px] rounded-[28px] bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <h3 className="text-center text-[18px] font-bold text-[#222127]">
                {entitlement === 'subscription' ? '确认叠加体验卡？' : '确认使用体验卡？'}
              </h3>
              <p className="mt-2 text-center text-[13px] text-[#8b8792]">
                {entitlement === 'subscription' ? '体验时间将叠加到当前会员周期' : '使用后权益有效期将自动顺延'}
              </p>
              
              <div className="mt-6 space-y-5">
                <div>
                  <div className="text-[12px] font-medium text-[#8b8792] mb-2">当前有效期</div>
                  <div className="flex items-center justify-between bg-[#f6f3ff] rounded-xl px-4 py-3">
                    <span className="text-[13px] font-semibold text-[#4d4657]">{expiryDate || formatDate(new Date())}</span>
                    <ArrowRight size={14} className="text-[#8b66ef]" />
                    <span className="text-[13px] font-bold text-[#8b66ef]">{proposed.expiry}</span>
                  </div>
                </div>

                {autoRenewEnabled && nextChargeDate && (
                  <div>
                    <div className="text-[12px] font-medium text-[#8b8792] mb-2">自动续费扣款日</div>
                    <div className="flex items-center justify-between bg-[#f6f3ff] rounded-xl px-4 py-3">
                      <span className="text-[13px] font-semibold text-[#4d4657]">{nextChargeDate}</span>
                      <ArrowRight size={14} className="text-[#8b66ef]" />
                      <span className="text-[13px] font-bold text-[#8b66ef]">{proposed.nextCharge}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={applyingCard}
                  className="flex-1 h-12 rounded-2xl bg-[#f2f1f4] text-[15px] font-semibold text-[#66616c]"
                >
                  取消
                </button>
                <button
                  onClick={confirmActivation}
                  disabled={applyingCard}
                  className="flex-1 h-12 rounded-2xl bg-[#8b66ef] text-[15px] font-semibold text-white shadow-lg shadow-purple-200"
                >
                  {applyingCard ? (
                    <span className="flex items-center justify-center gap-2">
                      <LoaderCircle size={17} className="animate-spin" />
                      正在使用
                    </span>
                  ) : (
                    '确认使用'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {viewedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-7">
            <div className="w-full max-w-[320px] rounded-[26px] bg-white px-6 py-6 text-center shadow-2xl">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#efedf1] text-[#8f8a94]">
                <Gift size={23} />
              </span>
              <h3 className="mt-4 text-[19px] font-bold text-[#29262e]">
                {viewedCard.days} 天体验卡
              </h3>
              <p className="mt-1 text-[13px] text-[#77727f]">{viewedCard.source}</p>
              <div className="mt-5 rounded-[16px] bg-[#f6f5f7] px-4 text-left">
                <div className="flex justify-between border-b border-[#e7e5e9] py-3 text-[12px]">
                  <span className="text-[#99949e]">获取方式</span>
                  <strong className="text-[#4d4852]">{viewedCard.description}</strong>
                </div>
                <div className="flex justify-between py-3 text-[12px]">
                  <span className="text-[#99949e]">使用时间</span>
                  <strong className="text-[#4d4852]">{viewedCard.usedAt || '已使用'}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewedCard(null)}
                className="mt-5 h-12 w-full rounded-[20px] bg-[#8b66ef] text-[14px] font-semibold text-white"
              >
                知道了
              </button>
            </div>
          </div>
        )}

        <section className="rounded-[18px] border border-[#ece8f2] bg-white px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-[#29262e]">可体验权益</h2>
            <span className="text-[9px] text-[#98939d]">与 Plus 对话权益一致</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {trialBenefits.map(({ title, icon: Icon }) => (
              <div key={title} className="flex min-h-[28px] items-center">
                <Icon size={14} className="shrink-0 text-[#8b66ef]" strokeWidth={2.2} />
                <span className="ml-2 text-[10px] leading-4 text-[#5d5765]">{title}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mb-3 mt-5 flex items-end justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-[#29262e]">我的体验卡</h2>
            <p className="mt-1 text-[10px] text-[#99949e]">使用后连续计时，可叠加当前会员周期</p>
          </div>
          <span className="text-[10px] text-[#aaa6ae]">{availableCards.length} 张可用</span>
        </div>

        <section className="overflow-hidden rounded-[18px] border border-[#e9e6ed] bg-white">
          {orderedCards.map((card, index) => {
            const subscriptionActive = entitlement === 'subscription';
            const isActive = card.status === 'active';
            const isUsed = card.status === 'used';
            const rowClass = `flex min-h-[72px] w-full items-center px-4 text-left ${
              index < orderedCards.length - 1 ? 'border-b border-[#eeecf0]' : ''
            } ${isUsed ? 'bg-[#fafafa]' : 'bg-white'}`;
            const content = (
              <>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${
                  isActive
                    ? 'bg-[#8b66ef] text-white'
                    : isUsed
                      ? 'bg-[#e6e4e8] text-[#aaa6af]'
                      : 'bg-[#eee8ff] text-[#8b66ef]'
                }`}>
                  <Gift size={19} />
                </span>
                <span className="ml-3 min-w-0 flex-1">
                  <span className={`flex items-baseline gap-2 ${isUsed ? 'text-[#8f8a94]' : 'text-[#322d38]'}`}>
                    <strong className="text-[17px]">{card.days} 天</strong>
                    <span className="truncate text-[11px]">{card.source}</span>
                  </span>
                  <span className={`mt-1 block text-[10px] ${
                    isActive ? 'text-[#7658c6]' : isUsed ? 'text-[#aaa6af]' : 'text-[#8f8a94]'
                  }`}>
                    {isActive
                      ? `${expiryDate} 到期`
                      : isUsed
                        ? `${card.usedAt || '已使用'} 使用`
                        : '完整体验 Plus 对话能力'}
                  </span>
                </span>
              </>
            );

            if (isActive) {
              return (
                <div key={card.id} className={rowClass}>
                  {content}
                  <span className="rounded-full bg-[#eee8ff] px-3 py-1.5 text-[10px] font-semibold text-[#6849cc]">
                    使用中
                  </span>
                </div>
              );
            }

            if (isUsed) {
              return (
                <button
                  type="button"
                  key={card.id}
                  aria-label={`查看已使用的 ${card.days} 天${card.source}体验卡`}
                  onClick={() => setViewedCard(card)}
                  className={rowClass}
                >
                  {content}
                  <span className="flex items-center text-[10px] font-medium text-[#8f8a94]">
                    查看详情
                    <ChevronRight size={15} />
                  </span>
                </button>
              );
            }

            return (
              <button
                type="button"
                key={card.id}
                aria-label={`使用 ${card.days} 天${card.source}体验卡`}
                onClick={() => handleUseCardClick(card)}
                className={rowClass}
              >
                {content}
                <span className="flex h-8 items-center rounded-full bg-[#8b66ef] px-3 text-[10px] font-semibold text-white shadow-[0_5px_12px_rgba(139,102,239,0.22)]">
                  {subscriptionActive ? '叠加使用' : '立即使用'}
                  <ChevronRight size={14} />
                </span>
              </button>
            );
          })}
        </section>
      </div>
    </PrototypePhone>
  );
};

export default TrialExperience;
