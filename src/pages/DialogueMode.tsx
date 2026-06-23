import React, { useEffect, useState } from 'react';
import { ShieldCheck, WifiOff, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const DialogueMode: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [updatingDialogue, setUpdatingDialogue] = useState(false);
  const [showPrivacyFlow, setShowPrivacyFlow] = useState(false);
  const [showTutorialFlow, setShowTutorialFlow] = useState(false);
  const [manualHint, setManualHint] = useState(false);
  const cardActivatedFromNest = searchParams.get('card') === 'active';
  const [cardToast, setCardToast] = useState(cardActivatedFromNest);
  const [playCardCharge, setPlayCardCharge] = useState(cardActivatedFromNest);
  const { pet, isOnline, setOnline } = usePetStore();
  const deviceName = pet?.name || '肉派派';
  const {
    dialogueEnabled,
    grantVoiceConsent,
    setDialogueEnabled,
  } = useSubscriptionStore();
  const { activeDialogueCard, clearActiveDialogueCard } = useDialogueStore();
  const quotaEmptyDemo = searchParams.get('quota') === 'empty';
  const cardEnergyActive = Boolean(activeDialogueCard) && !quotaEmptyDemo;
  const freeQuotaExhausted = quotaEmptyDemo;
  const needsDialogueCard = freeQuotaExhausted;
  const hasFreeEnergy = !freeQuotaExhausted && !cardEnergyActive;
  const policyReturnTo = encodeURIComponent('/dialogue-mode');

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

  useEffect(() => {
    if (!playCardCharge) return;
    const timer = window.setTimeout(() => setPlayCardCharge(false), 1400);
    return () => window.clearTimeout(timer);
  }, [playCardCharge]);

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
      clearActiveDialogueCard();
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
            已为你充满一次社交电量，可以继续和{deviceName}说话。
          </div>
        )}

        {!isOnline && (
          <div className="mx-auto mb-4 flex h-11 max-w-[330px] items-center rounded-[8px] bg-[#ff805d] px-4 text-left text-white shadow-[0_8px_18px_rgba(255,128,93,0.24)]">
            <WifiOff size={20} strokeWidth={2.3} className="mr-3 shrink-0 text-white" />
            <span className="text-[14px] font-medium tracking-normal">网络连接异常，请检查网络设备</span>
          </div>
        )}

        <section className="pt-4 text-center">
          <div className={`mx-auto mt-0 max-w-[300px] rounded-[24px] border px-4 py-4 text-left shadow-[0_14px_34px_rgba(78,58,120,0.07)] ${
            freeQuotaExhausted
              ? 'border-[#f1ddd8] bg-[#fffafa]'
              : 'border-[#eee6ff] bg-white'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold text-[#26232a]">今日社交电量</p>
              </div>
              {cardEnergyActive && (
                <span className="rounded-full bg-[#f0eaff] px-2.5 py-1 text-[11px] font-semibold text-[#7656dc]">
                  悄悄话卡
                </span>
              )}
            </div>
            <div className={`relative mt-4 h-9 overflow-hidden rounded-full p-1 ${
              freeQuotaExhausted ? 'bg-[#f1e9e7]' : 'bg-[#f0ecfb]'
            }`}>
              {!freeQuotaExhausted && (
                <>
                  <div className="absolute inset-y-1 right-1 w-1/3 rounded-full bg-[#e9e2f3]" />
                  {cardEnergyActive && (
                    <div
                      className={`absolute inset-y-1 left-1 w-2/3 overflow-hidden rounded-full bg-gradient-to-r from-[#d5c6ff] via-[#a987ff] to-[#8060ea] shadow-[0_0_20px_rgba(139,102,239,0.3)] ${
                        playCardCharge ? 'social-energy-charge' : ''
                      }`}
                    >
                      <span className="absolute inset-y-1 left-5 w-12 rounded-full bg-white/24 blur-[2px]" />
                      <span className="absolute inset-y-1 right-6 w-10 rounded-full bg-white/18 blur-[2px]" />
                    </div>
                  )}
                  {hasFreeEnergy && (
                    <div className="absolute inset-y-1 right-1 w-1/3 overflow-hidden rounded-full bg-gradient-to-r from-[#c8b8ff] to-[#8b66ef] shadow-[0_0_18px_rgba(139,102,239,0.26)]">
                      <span className="absolute inset-y-1 left-3 w-8 rounded-full bg-white/24 blur-[2px]" />
                    </div>
                  )}
                  <span className="absolute inset-y-1 left-1 w-2/3 rounded-full ring-1 ring-white/50" />
                  <span className="absolute inset-y-1 right-1 w-1/3 rounded-full ring-1 ring-white/70" />
                </>
              )}
              <div className={`relative h-full overflow-hidden rounded-full ${
                freeQuotaExhausted ? 'bg-[#e8e2ea]' : 'bg-transparent'
              }`}>
                {freeQuotaExhausted && (
                  <span className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold text-[#8f8492]">
                    已用尽
                  </span>
                )}
              </div>
            </div>
            {freeQuotaExhausted && (
              <p className="mt-3 text-[12px] font-medium text-[#9b5a4f]">明天 08:00 刷新免费额度</p>
            )}
            {needsDialogueCard && (
              <button
                type="button"
                aria-label="去使用悄悄话卡"
                onClick={() => navigate('/nest')}
                className="mt-4 flex h-10 w-full items-center justify-center rounded-full bg-[#8b66ef] text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(139,102,239,0.22)]"
              >
                去使用悄悄话卡
              </button>
            )}
          </div>

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
                靠近{deviceName}，面对着它，和它随便聊点什么吧。听到你的声音后，悄悄话就会开启，并消耗今日社交电量。
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
          <div className="relative flex h-full w-full flex-col bg-white px-5 pb-8 pt-5 text-left">
            <div className="flex h-10 items-center justify-center">
              <button
                type="button"
                aria-label="关闭新手教程"
                onClick={() => setShowTutorialFlow(false)}
                className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center text-[#222127]"
              >
                <X size={24} strokeWidth={2.2} />
              </button>
              <h2 className="text-[17px] font-bold text-[#222127]">怎么和{deviceName}唠唠？</h2>
            </div>

            <div className="mt-9 space-y-6">
              {[
                {
                  title: '01. 同意隐私授权后，App 会开启「悄悄话模式」',
                  body: '开启悄悄话模式，代表你同意在对话过程中获取语音信息，并同意 Ropet 将内容上传和进行 AI 处理。',
                },
                {
                  title: `02. 面对设备说话，${deviceName} 会开始回应你`,
                  body: '靠近设备，面对着它，和它随便聊点什么。听到你的声音后，悄悄话就会开启。',
                },
                {
                  title: '03. 每天都有免费社交电量，用完后可以使用悄悄话卡',
                  body: '免费社交电量用完后，可以用积分兑换悄悄话卡，充满一次社交电量后继续聊天。',
                },
                {
                  title: '04. 为什么悄悄话卡需要用积分兑换？',
                  body: '悄悄话会产生 AI 对话成本。积分让用户可以通过日常互动或购买来继续使用，也让功能规则更清楚。',
                },
              ].map((item) => (
                <section key={item.title}>
                  <h3 className="inline bg-[#eef05a] box-decoration-clone px-0.5 text-[15px] font-black leading-7 text-[#202027]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[12px] leading-6 text-[#6f6875]">{item.body}</p>
                </section>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowTutorialFlow(false);
                setDialogueEnabled(true);
                setManualHint(false);
              }}
              className="mx-auto mt-auto flex h-12 w-[236px] items-center justify-center rounded-[14px] bg-[#8057df] text-[14px] font-semibold text-white shadow-[0_10px_22px_rgba(128,87,223,0.22)]"
            >
              开启
            </button>
          </div>
        </ModalOverlay>
      )}
    </PrototypePhone>
  );
};

export default DialogueMode;
