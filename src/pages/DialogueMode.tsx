import React, { useState } from 'react';
import { AudioLines, ChevronRight, CircleHelp, Gem, Gift, WifiOff } from 'lucide-react';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import pingjingAnimation from '@/assets/animations/pingjing.json';
import {
  DialogueSwitch,
  ModalOverlay,
  PrototypeHeader,
  PrototypePhone,
  PrototypeStatusBar,
} from '@/components/subscription/PrototypeUI';
import { usePetStore } from '@/store/usePetStore';
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
  const { pet, isOnline, setOnline } = usePetStore();
  const deviceName = pet?.name || '肉派派';
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
  const membershipActivated = entitlement === 'subscription' && !entitlementExpired;
  const trialActivated = entitlement === 'trial' && !entitlementExpired;
  const entitlementActive = membershipActivated || trialActivated;
  const availableTrialCards = trialCards.filter((card) => card.status === 'available');
  const trialAvailable = availableTrialCards.length > 0;
  const membershipTitle = membershipActivated
    ? 'ropet Plus'
    : trialActivated
      ? 'ropet 体验权益'
      : '开通 Ropet Plus';
  const membershipDescription = entitlementActive
    ? `当前设备权益 · ${expiryDate} 到期`
    : '为当前设备解锁完整语音对话能力';
  const listening = isOnline && dialogueEnabled && entitlementActive;
  const deviceStatus = !isOnline
    ? {
        label: '设备不在线',
        icon: WifiOff,
        className: 'border-[#e5e2e7] bg-[#f2f1f3]/95 text-[#8b8792]',
        iconClassName: 'text-[#96919c]',
      }
    : listening
      ? {
          label: '我在听',
          icon: AudioLines,
          className: 'border-[#8b66ef] bg-[#8b66ef] text-white',
          iconClassName: 'text-white',
        }
      : {
          label: '我没在听',
          icon: AudioLines,
          className: 'border-[#e8e4ed] bg-white/95 text-[#4f4a54]',
          iconClassName: 'text-[#96919c]',
        };
  const DeviceStatusIcon = deviceStatus.icon;

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
        title="对话模式"
        onBack={() => navigate('/')}
      />
      <div className="px-5 pb-6 pt-2">
        <button
          type="button"
          aria-label={entitlementActive ? `查看${membershipTitle}` : '开通 Ropet Plus'}
          onClick={() => navigate(entitlementActive ? '/subscription/status' : '/subscription')}
          className={`flex min-h-[58px] w-full items-center rounded-[17px] border px-4 text-left ${
            entitlementActive
              ? 'border-[#ded5fa] bg-[#f7f4ff]'
              : 'border-[#e7e3ec] bg-white'
          }`}
        >
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${
            entitlementActive ? 'bg-[#8b66ef] text-white' : 'bg-[#f0ebff] text-[#8b66ef]'
          }`}>
            <Gem size={16} fill="currentColor" />
          </span>
          <span className="ml-3 min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <strong className="truncate text-[13px] text-[#26232a]">{membershipTitle}</strong>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                entitlementActive
                  ? 'bg-[#e6ddff] text-[#6d4bd0]'
                  : 'bg-[#f0eff2] text-[#8f8a94]'
              }`}>
                {membershipActivated ? '已开通' : trialActivated ? '体验中' : '未开通'}
              </span>
            </span>
            <span className="mt-0.5 block truncate text-[9px] leading-4 text-[#8b8792]">{membershipDescription}</span>
          </span>
          <ChevronRight size={17} className="ml-2 shrink-0 text-[#a49eaa]" />
        </button>

        <section className="relative min-h-[306px] overflow-hidden text-center">
          <div className="relative z-10">
            <p className="mt-5 text-[12px] leading-5 text-[#77727f]">
              直接对{deviceName}说“你好肉派派”开启对话
            </p>
          </div>

          <div className="relative mx-auto flex h-[252px] items-center justify-center">
            <div className="absolute bottom-[20px] h-[28px] w-[220px] rounded-[50%] bg-[#4a346f]/10 blur-[8px]" />
            <div
              role="img"
              aria-label={`正在控制的设备 ${deviceName}`}
              className="relative z-10 h-[244px] w-[278px]"
            >
              <Lottie animationData={pingjingAnimation} loop autoplay className="h-full w-full" />
            </div>
            <span className={`absolute right-[18px] top-[26px] z-20 flex items-center rounded-full border px-2.5 py-1.5 text-[10px] font-medium shadow-[0_6px_18px_rgba(50,42,67,0.10)] ${deviceStatus.className}`}>
              <DeviceStatusIcon size={12} className={`mr-1 ${deviceStatus.iconClassName}`} />
              {deviceStatus.label}
            </span>
            <button
              type="button"
              aria-label={isOnline ? '演示设备不在线' : '恢复设备在线'}
              onClick={() => setOnline(!isOnline)}
              className="absolute bottom-[10px] right-[18px] z-20 rounded-full border border-[#e5e2e7] bg-white/90 px-2.5 py-1 text-[9px] font-medium text-[#8b8792] shadow-sm"
            >
              {isOnline ? '演示离线' : '恢复在线'}
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-[20px] border border-[#e8e5eb] bg-white">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 pr-4">
                <h2 className="text-[15px] font-semibold text-[#222127]">对话总开关</h2>
                <p className="mt-1 text-[10px] leading-4 text-[#8b8792]">
                  手机端控制 ropet 的对话能力
                </p>
              </div>
              <DialogueSwitch
                compact
                enabled={dialogueEnabled}
                loading={updatingDialogue}
                onClick={handleToggle}
              />
            </div>

            {updatingDialogue && (
              <p className="mt-2 text-right text-[10px] text-[#8b66ef]">正在同步设备状态…</p>
            )}
          </div>
          <button
            type="button"
            aria-label="查看对话疑问"
            onClick={() => setShowFaq(true)}
            className="flex h-11 w-full items-center border-t border-[#efedf2] px-4 text-left text-[12px] text-[#77717e]"
          >
            <CircleHelp size={16} className="text-[#8b66ef]" />
            <span className="ml-2 flex-1">对话功能使用帮助</span>
            <ChevronRight size={16} className="text-[#b6b1ba]" />
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
                onClick={() => navigate(`/nest?item=trial-card&card=${encodeURIComponent(availableTrialCards[0]?.id ?? '')}`)}
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
