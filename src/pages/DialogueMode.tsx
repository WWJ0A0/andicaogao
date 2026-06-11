import React, { useState } from 'react';
import { ChevronRight, Gem, Gift, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DialogueSwitch,
  ModalOverlay,
  PlusBadge,
  PrototypeHeader,
  PrototypePhone,
  PrototypeStatusBar,
} from '@/components/subscription/PrototypeUI';
import { isDateExpired, useSubscriptionStore } from '@/store/useSubscriptionStore';

const faqItems = [
  ['如何使用语音服务?', '开通Plus会员后打开“语音服务”开关才可以与ropet进行对话。'],
  ['打开语音服务开关也没说话?', '唤醒说话需要正对着ropet或者说他的名字即可开启对话。'],
  ['绑定的设备?', '会员充值针对的是当前使用中的肉派派，无法将会员权益转移给其他肉派派。'],
  ['什么时候在和你对话?', '当你结束发言超过5min后ropet自己会主动关闭对话功能，若果你想要再次唤醒对话，只需要对他说你好肉派派即可；当然你也可以对他说：“不要再说了”他也会结束当前对话。'],
];

const DialogueMode: React.FC = () => {
  const navigate = useNavigate();
  const [showFaq, setShowFaq] = useState(false);
  const [showActivationChoice, setShowActivationChoice] = useState(false);
  const [updatingDialogue, setUpdatingDialogue] = useState(false);
  const {
    dialogueEnabled,
    entitlement,
    trialCards,
    expiryDate,
    autoRenewEnabled,
    setDialogueEnabled,
  } = useSubscriptionStore();
  const entitlementExpired = entitlement !== 'none'
    && !autoRenewEnabled
    && isDateExpired(expiryDate);
  const availableTrialCards = trialCards.filter((card) => card.status === 'available');
  const activeTrialCard = trialCards.find((card) => card.status === 'active');
  const trialAvailable = availableTrialCards.length > 0;
  const trialState = entitlement === 'trial'
    ? 'active'
    : trialAvailable
      ? 'available'
      : 'exhausted';

  const handleToggle = () => {
    if (entitlement === 'none' || entitlementExpired) {
      setShowActivationChoice(true);
      return;
    }
    if (updatingDialogue) return;
    setUpdatingDialogue(true);
    window.setTimeout(() => {
      setDialogueEnabled(!dialogueEnabled);
      setUpdatingDialogue(false);
    }, 700);
  };

  return (
    <PrototypePhone>
      <PrototypeStatusBar />
      <PrototypeHeader
        onBack={() => navigate('/')}
        action={(
          <button type="button" onClick={() => navigate(entitlement === 'subscription' ? '/subscription/status' : '/subscription')}>
            <PlusBadge />
          </button>
        )}
      />
      <div className="px-5 pt-3">
        <h2 className="text-[19px] font-semibold text-[#222127]">对话模式</h2>

        <button
          type="button"
          aria-label={
            trialState === 'active'
              ? '查看使用中的 7 天体验卡'
              : trialState === 'available'
                ? '查看可使用的 7 天体验卡'
                : '7 天体验卡已用完'
          }
          disabled={trialState === 'exhausted'}
          onClick={() => navigate('/subscription/trial')}
          className={`mt-6 flex min-h-[68px] w-full items-center rounded-[16px] px-4 text-left transition-colors ${
            trialState === 'active'
              ? 'bg-[#eee8ff] ring-1 ring-[#b9a5f7]'
              : trialState === 'available'
                ? 'bg-[#fff09b] shadow-[0_3px_0_#e8c937]'
                : 'cursor-not-allowed bg-[#e5e4e7] text-[#aaa6ae]'
          }`}
        >
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${
            trialState === 'active'
              ? 'bg-[#8b66ef] text-white'
              : trialState === 'available'
                ? 'bg-white/70 text-[#8b66ef]'
                : 'bg-[#d4d2d7] text-[#aaa6ae]'
          }`}>
            <Gift size={21} />
          </span>
          <span className="ml-3 min-w-0 flex-1">
            <strong className={`block text-[15px] ${
              trialState === 'active'
                ? 'text-[#6543cb]'
                : trialState === 'available'
                  ? 'text-[#5f4914]'
                  : 'text-[#96929a]'
            }`}>
              体验卡
            </strong>
            <span className={`mt-1 block text-[10px] ${
              trialState === 'active'
                ? 'text-[#8b75c7]'
                : trialState === 'available'
                  ? 'text-[#a88d44]'
                  : 'text-[#aaa6ae]'
            }`}>
              {trialState === 'active'
                ? `${activeTrialCard?.days ?? ''} 天卡使用中 · ${expiryDate || '体验期内'} 到期`
                : trialState === 'available'
                  ? `${availableTrialCards.length} 张可用 · 共 ${availableTrialCards.reduce((total, card) => total + card.days, 0)} 天`
                  : '体验额度已使用完'}
            </span>
          </span>
          <span className={`ml-3 rounded-full px-3 py-1 text-[12px] font-semibold ${
            trialState === 'active'
              ? 'bg-[#8b66ef] text-white'
              : trialState === 'available'
                ? 'text-[#8b66ef]'
                : 'bg-[#d4d2d7] text-[#99959e]'
          }`}>
            {trialState === 'active' ? '使用中' : trialState === 'available' ? '去使用 >' : '已用完'}
          </span>
        </button>

        <section className="mt-5 overflow-hidden rounded-[19px] bg-[#8b66ef]">
          <div className="rounded-[19px] border-[4px] border-[#8b66ef] bg-white px-4 py-4">
            <h3 className="text-[18px] font-semibold text-[#222127]">说话能力</h3>
            <p className="mt-2 text-[13px] leading-5 text-[#8c8791]">
              打开语音服务开关才可以与ropet进行对话。（需开通Plus会员，会员到期或者免费时间到期无法唤醒对话能力）
            </p>
            <div className="mt-3 flex justify-end">
              <DialogueSwitch enabled={dialogueEnabled} loading={updatingDialogue} onClick={handleToggle} />
            </div>
            {updatingDialogue && (
              <p className="mt-2 text-right text-[10px] text-[#8b66ef]">正在同步设备状态…</p>
            )}
          </div>
          <button
            type="button"
            aria-label="查看对话疑问"
            onClick={() => setShowFaq(true)}
            className="flex h-12 w-full items-center justify-center gap-2 text-[14px] font-medium text-white"
          >
            <HelpCircle size={17} />
            你是否也对话有疑问?
          </button>
        </section>

      </div>

      {showFaq && (
        <ModalOverlay>
          <div className="w-full rounded-[22px] bg-white px-5 pb-5 pt-7">
            <h3 className="text-center text-[18px] font-medium text-[#222127]">对话的疑问?</h3>
            <div className="mt-4 space-y-4">
              {faqItems.map(([question, answer]) => (
                <div key={question} className="relative pl-4">
                  <span className="absolute left-0 top-[7px] h-[5px] w-[5px] rounded-full bg-[#8b66ef]" />
                  <div className="text-[13px] font-medium text-[#8b66ef]">{question}</div>
                  <p className="mt-1 text-[11px] leading-[18px] text-[#8c8791]">{answer}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              aria-label="知道了"
              onClick={() => setShowFaq(false)}
              className="mx-auto mt-5 block h-12 w-[222px] rounded-full bg-[#8b66ef] text-[14px] font-medium text-white"
            >
              知道了
            </button>
          </div>
        </ModalOverlay>
      )}

      {showActivationChoice && (
        <ModalOverlay>
          <div className="w-full rounded-[24px] bg-white px-5 pb-5 pt-6">
            <h3 className="text-center text-[20px] font-semibold text-[#222127]">选择开启方式</h3>
            <p className="mt-2 text-center text-[12px] leading-5 text-[#8c8791]">
              开启语音对话需要有效的体验卡或 Ropet Plus。
            </p>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                disabled={!trialAvailable}
                aria-label={trialAvailable ? `选择体验卡，共 ${availableTrialCards.length} 张可用` : '体验卡已用完'}
                onClick={() => navigate('/subscription/trial')}
                className={`flex min-h-[72px] w-full items-center rounded-[18px] px-4 text-left ${
                  trialAvailable
                    ? 'bg-[#fff4b8] ring-1 ring-[#efd462]'
                    : 'cursor-not-allowed bg-[#ecebed] text-[#aaa6ae]'
                }`}
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] ${
                  trialAvailable ? 'bg-white/75 text-[#8b66ef]' : 'bg-[#d9d7dc] text-[#aaa6ae]'
                }`}>
                  <Gift size={22} />
                </span>
                <span className="ml-3 flex-1">
                  <strong className={`block text-[15px] ${trialAvailable ? 'text-[#5f4914]' : 'text-[#99959e]'}`}>
                    选择体验卡
                  </strong>
                  <span className={`mt-1 block text-[11px] ${trialAvailable ? 'text-[#9c823e]' : 'text-[#aaa6ae]'}`}>
                    {trialAvailable ? `${availableTrialCards.length} 张可用，选择一张开启对话` : '体验额度已使用完'}
                  </span>
                </span>
                {trialAvailable && <ChevronRight size={20} color="#8b66ef" />}
              </button>

              <button
                type="button"
                aria-label="订阅 Ropet Plus"
                onClick={() => navigate('/subscription')}
                className="flex min-h-[72px] w-full items-center rounded-[18px] bg-[#f1edff] px-4 text-left ring-1 ring-[#c9bbf8]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#8b66ef] text-white">
                  <Gem size={21} fill="white" />
                </span>
                <span className="ml-3 flex-1">
                  <strong className="block text-[15px] text-[#5f3fc3]">订阅 Ropet Plus</strong>
                  <span className="mt-1 block text-[11px] text-[#8773bd]">￥69.9/月，持续使用完整权益</span>
                </span>
                <ChevronRight size={20} color="#8b66ef" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowActivationChoice(false)}
              className="mt-4 h-11 w-full text-[14px] text-[#77727f]"
            >
              暂不开启
            </button>
          </div>
        </ModalOverlay>
      )}
    </PrototypePhone>
  );
};

export default DialogueMode;
