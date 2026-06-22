import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { BookOpen, ShieldCheck } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import pingjingAnimation from '@/assets/animations/pingjing.json';
import {
  DialogueSwitch,
  ModalOverlay,
  PrototypeHeader,
  PrototypePhone,
  PrototypeStatusBar,
} from '@/components/subscription/PrototypeUI';
import { usePetStore } from '@/store/usePetStore';
import { useDialogueStore } from '@/store/useDialogueStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';

const getNextUtcRefreshText = () => {
  const now = new Date();
  const nextUtcMidnight = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0,
    0,
    0,
  ));
  const todayText = new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  }).format(now);
  const refreshDateText = new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  }).format(nextUtcMidnight);
  const refreshTimeText = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(nextUtcMidnight);
  const dateLabel = refreshDateText === todayText ? '今天' : '明天';

  return `${dateLabel} ${refreshTimeText} 刷新`;
};

const FREE_QUOTA_SECONDS = 5 * 60;

const formatQuotaTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  return `${minutes}:${String(restSeconds).padStart(2, '0')}`;
};

const DialogueMode: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [updatingDialogue, setUpdatingDialogue] = useState(false);
  const [showPrivacyFlow, setShowPrivacyFlow] = useState(false);
  const [showTutorialFlow, setShowTutorialFlow] = useState(false);
  const [manualHint, setManualHint] = useState(false);
  const [cardToast, setCardToast] = useState(searchParams.get('card') === 'active');
  const { pet, isOnline, setOnline } = usePetStore();
  const deviceName = pet?.name || '肉派派';
  const {
    dialogueEnabled,
    grantVoiceConsent,
    setDialogueEnabled,
  } = useSubscriptionStore();
  const { activeDialogueCard, clearActiveDialogueCard } = useDialogueStore();
  const freeQuotaExhausted = searchParams.get('quota') === 'empty';
  const needsDialogueCard = freeQuotaExhausted;
  const nextRefreshText = getNextUtcRefreshText();
  const freeQuotaRemaining = freeQuotaExhausted ? 0 : FREE_QUOTA_SECONDS;
  const freeQuotaProgress = (freeQuotaRemaining / FREE_QUOTA_SECONDS) * 100;
  const policyReturnTo = encodeURIComponent('/dialogue-mode');
  const showEyeGlow = isOnline && dialogueEnabled && !needsDialogueCard;
  const ropetSpeech = !isOnline
    ? '我现在不在线哦'
    : !dialogueEnabled
    ? '我现在不会跟你说话哦'
    : needsDialogueCard
      ? '我有点累啦，下次再陪你'
      : '';
  const statusHint = !isOnline
    ? '设备断网时，Ropet 暂时无法回应你。'
    : needsDialogueCard
      ? null
      : activeDialogueCard
        ? null
        : '每天 Ropet 都能陪你聊一会儿；聊完后，它会提醒你下次再继续。';

  useEffect(() => {
    if (!cardToast) return;
    const timer = window.setTimeout(() => {
      setCardToast(false);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('card');
      setSearchParams(nextParams, { replace: true });
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [cardToast, searchParams, setSearchParams]);

  const handleToggle = () => {
    if (updatingDialogue) return;
    setUpdatingDialogue(true);
    window.setTimeout(() => {
      setDialogueEnabled(!dialogueEnabled);
      setManualHint(false);
      setUpdatingDialogue(false);
    }, 650);
  };

  const toggleQuotaDemo = () => {
    const nextParams = new URLSearchParams(searchParams);
    if (freeQuotaExhausted) {
      nextParams.delete('quota');
    } else {
      nextParams.set('quota', 'empty');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const startFirstUseDemo = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('quota');
    setSearchParams(nextParams, { replace: true });
    setOnline(true);
    setDialogueEnabled(false);
    clearActiveDialogueCard();
    setManualHint(false);
    setShowPrivacyFlow(true);
  };

  return (
    <PrototypePhone>
      <PrototypeStatusBar />
      <PrototypeHeader
        title="悄悄话模式"
        onBack={() => navigate('/')}
      />

      <div className="h-[752px] overflow-y-auto px-5 pb-8 pt-2 scrollbar-hide">
        {cardToast && (
          <div className="fixed left-1/2 top-[116px] z-50 -translate-x-1/2 rounded-full bg-[#25212b] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
            已为你接上悄悄话时间，可以继续和{deviceName}说话。
          </div>
        )}

        <section className="text-center">
          <div
            role="img"
            aria-label={`当前悄悄话设备 ${deviceName}`}
            className="relative mx-auto h-[318px] w-[330px]"
          >
            {ropetSpeech && (
              <div className="absolute right-2 top-8 z-30 max-w-[150px] rounded-[18px] bg-white px-3 py-2 text-left text-[12px] font-medium leading-5 text-[#665f6d] shadow-[0_10px_28px_rgba(49,40,67,0.12)]">
                {ropetSpeech}
                <span className="absolute bottom-[-6px] left-8 h-4 w-4 rotate-45 bg-white" />
              </div>
            )}
            <div className="absolute bottom-[44px] left-1/2 h-[30px] w-[220px] -translate-x-1/2 rounded-[50%] bg-[#4a346f]/10 blur-[8px]" />
            <Lottie animationData={pingjingAnimation} loop autoplay className="relative z-10 h-full w-full" />
            {showEyeGlow && (
              <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
                <span className="ropet-eye-flow-ring absolute left-[112px] top-[106px] h-[40px] w-[40px]" />
                <span className="ropet-eye-flow-ring absolute left-[178px] top-[106px] h-[40px] w-[40px]" />
              </div>
            )}
          </div>

          <div className={`mx-auto max-w-[300px] text-left text-[12px] leading-5 ${
            isOnline && needsDialogueCard ? 'text-[#9b5a4f]' : 'text-[#8b8792]'
          }`}>
            {!isOnline ? (
              statusHint
            ) : needsDialogueCard ? (
              <>
                <strong className="block text-[13px] text-[#7d423a]">今天的免费聊天结束啦</strong>
                <span className="mt-1 block text-[11px] leading-4 text-[#9b827e]">
                  {nextRefreshText}
                </span>
                <button
                  type="button"
                  aria-label="去使用悄悄话卡"
                  onClick={() => navigate('/nest')}
                  className="mt-3 inline-flex h-9 items-center rounded-full bg-[#8b66ef] px-4 text-[12px] font-semibold text-white shadow-[0_8px_18px_rgba(139,102,239,0.22)]"
                >
                  去使用悄悄话卡
                </button>
              </>
            ) : (
              statusHint
            )}
          </div>

          <div className={`mx-auto mt-4 max-w-[300px] rounded-[18px] border px-4 py-3 text-left ${
            freeQuotaExhausted
              ? 'border-[#f1ddd8] bg-[#fff8f6]'
              : 'border-[#efe8ff] bg-[#fbf9ff]'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[#26232a]">今日免费聊天</p>
                <p className="mt-0.5 text-[10px] leading-4 text-[#8b8792]">只有真正说悄悄话时才消耗</p>
              </div>
              <div className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
                freeQuotaExhausted ? 'bg-[#f7e7e2] text-[#9b5a4f]' : 'bg-[#efe8ff] text-[#7c5ae0]'
              }`}>
                {formatQuotaTime(freeQuotaRemaining)} / {formatQuotaTime(FREE_QUOTA_SECONDS)}
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ebe7ef]">
              <div
                className={`h-full rounded-full transition-all ${
                  freeQuotaExhausted
                    ? 'bg-[#c78b80]'
                    : 'bg-gradient-to-r from-[#a98dff] to-[#7c5ae0]'
                }`}
                style={{ width: `${freeQuotaProgress}%` }}
              />
            </div>
            <p className={`mt-2 text-[10px] leading-4 ${
              freeQuotaExhausted ? 'text-[#9b5a4f]' : 'text-[#8b8792]'
            }`}>
              {freeQuotaExhausted ? `今日额度已用完 · ${nextRefreshText}` : '开关开启、等待唤醒时不扣时长'}
            </p>
          </div>

          {activeDialogueCard && !freeQuotaExhausted && (
            <div className="mx-auto mt-4 max-w-[300px] rounded-[18px] border border-[#eadfff] bg-[#fbf8ff] px-4 py-3 text-left">
              <div>
                <p className="text-[13px] font-semibold text-[#6f4bd6]">悄悄话卡生效中</p>
                <p className="mt-1 text-[11px] leading-4 text-[#8b8792]">
                  已为你接上悄悄话时间，可以继续和{deviceName}说话。
                </p>
                <p className="mt-1 text-[11px] leading-4 text-[#8b8792]">到期时间：{activeDialogueCard.expiryDate}</p>
              </div>
            </div>
          )}

          <section className={`mx-auto mt-5 flex max-w-[300px] items-center justify-between rounded-full border px-4 py-2.5 text-left ${
            dialogueEnabled
              ? 'border-[#eee8ff] bg-[#fbf9ff]'
              : 'border-[#efedf2] bg-[#fafafa]'
          }`}>
            <div className="pr-3">
              <h2 className="text-[13px] font-semibold text-[#26232a]">
                {dialogueEnabled ? '悄悄话模式已开启' : '悄悄话模式未开启'}
              </h2>
              <p className="mt-0.5 text-[10px] leading-4 text-[#8b8792]">
                {dialogueEnabled
                  ? `说“你好${deviceName}”就能唤醒 Ropet`
                  : `开启后，说“你好${deviceName}”就能唤醒 Ropet`}
              </p>
              {manualHint && (
                <p className="mt-2 text-[11px] font-semibold text-[#7554da]">现在请手动打开开关</p>
              )}
            </div>
            <DialogueSwitch compact enabled={dialogueEnabled} loading={updatingDialogue} onClick={handleToggle} />
          </section>
        </section>

        <div className="mt-6 flex justify-center gap-4 text-[10px] text-[#aaa6af]">
          <button
            type="button"
            aria-label="演示首次进入"
            onClick={startFirstUseDemo}
            className="font-medium text-[#aaa6af]"
          >
            演示首次进入
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            aria-label={freeQuotaExhausted ? '恢复今日免费额度' : '演示今日免费额度用尽'}
            onClick={toggleQuotaDemo}
            className={`font-medium ${freeQuotaExhausted ? 'text-[#9b5a4f]' : 'text-[#aaa6af]'}`}
          >
            {freeQuotaExhausted ? '恢复额度' : '演示额度用尽'}
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            aria-label={isOnline ? '演示设备断网' : '恢复设备联网'}
            onClick={() => setOnline(!isOnline)}
            className={`font-medium ${isOnline ? 'text-[#aaa6af]' : 'text-[#747b88]'}`}
          >
            {isOnline ? '演示断网' : '恢复联网'}
          </button>
        </div>
      </div>

      {showPrivacyFlow && (
        <ModalOverlay>
          <div className="w-[320px] rounded-[24px] bg-white px-6 py-6 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#f1edff] text-[#8b66ef]">
              <ShieldCheck size={24} />
            </div>
            <h2 className="mt-5 text-[21px] font-bold leading-7 text-[#26232a]">使用悄悄话功能前，需要你同意隐私授权</h2>
            <p className="mt-3 text-[13px] leading-6 text-[#7c7783]">
              开启后，Ropet 才能通过语音服务识别“你好{deviceName}”并回应你。你可以随时在本页关闭悄悄话许可。
            </p>
            <div className="mt-5 rounded-[16px] bg-[#f8f6ff] px-4 py-3 text-[12px] leading-5 text-[#7b6fb3]">
              我已阅读并同意
              <button
                type="button"
                onClick={() => navigate(`/policies/privacy?returnTo=${policyReturnTo}`)}
                className="font-semibold text-[#7c5ae0] underline underline-offset-2"
              >
                《Ropet 隐私政策》
              </button>
              和
              <button
                type="button"
                onClick={() => navigate(`/policies/subscription?returnTo=${policyReturnTo}`)}
                className="font-semibold text-[#7c5ae0] underline underline-offset-2"
              >
                《使用协议》
              </button>
              中关于语音服务的说明。
            </div>
            <button
              type="button"
              onClick={() => {
                grantVoiceConsent();
                setShowPrivacyFlow(false);
                setShowTutorialFlow(true);
              }}
              className="mt-6 h-12 w-full rounded-full bg-[#8b66ef] text-[15px] font-semibold text-white"
            >
              同意并观看新手教程
            </button>
            <button
              type="button"
              onClick={() => setShowPrivacyFlow(false)}
              className="mt-3 h-11 w-full rounded-full bg-[#f0eef2] text-[14px] font-semibold text-[#8b8792]"
            >
              稍后再说
            </button>
          </div>
        </ModalOverlay>
      )}

      {showTutorialFlow && (
        <ModalOverlay>
          <div className="w-[320px] rounded-[24px] bg-white px-6 py-6 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#fff6d7] text-[#d9a100]">
              <BookOpen size={24} />
            </div>
            <h2 className="mt-5 text-[21px] font-bold text-[#26232a]">怎么和 {deviceName} 说话</h2>
            <div className="mt-5 space-y-4">
              {[
                ['1', '同意隐私授权后，App 会为你开启「悄悄话模式」。'],
                ['2', `面对设备说“你好${deviceName}”，它会开始回应你。`],
                ['3', '每天都有免费聊天时间，用完后悄悄话卡会自动接上。'],
              ].map(([index, text]) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8b66ef] text-[12px] font-bold text-white">
                    {index}
                  </span>
                  <p className="pt-[2px] text-[13px] leading-5 text-[#6f6a75]">{text}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setShowTutorialFlow(false);
                setDialogueEnabled(true);
                setManualHint(false);
              }}
              className="mt-6 h-12 w-full rounded-full bg-[#8b66ef] text-[15px] font-semibold text-white"
            >
              我知道了，开启悄悄话
            </button>
          </div>
        </ModalOverlay>
      )}
    </PrototypePhone>
  );
};

export default DialogueMode;
