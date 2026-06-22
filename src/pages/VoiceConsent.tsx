import React, { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AgreementCheck,
  PrototypeHeader,
  PrototypePhone,
  PrototypeStatusBar,
} from '@/components/subscription/PrototypeUI';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';

const VoiceConsent: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const {
    voiceConsentGranted,
    setDialogueEnabled,
    setPaymentState,
    grantVoiceConsent,
  } = useSubscriptionStore();
  const [agreed, setAgreed] = useState(voiceConsentGranted);
  const source = searchParams.get('source') === 'subscription' ? 'subscription' : 'trial';
  const subscriptionActivated = source === 'subscription' && searchParams.get('activated') === '1';
  const returnTo = searchParams.get('returnTo') || (source === 'trial' ? '/dialogue-mode' : '/subscription');
  const consentPath = `/subscription/voice-consent?source=${source}${subscriptionActivated ? '&activated=1' : ''}&returnTo=${encodeURIComponent(returnTo)}`;

  const handleAgree = () => {
    if (!agreed || submitting) return;
    setSubmitting(true);
    window.setTimeout(() => {
      grantVoiceConsent();
      if (subscriptionActivated) {
        setDialogueEnabled(true);
        setPaymentState('success');
        navigate('/dialogue-mode');
        return;
      }
      setPaymentState('opening');
      navigate(`/subscription/opening?source=${source}`);
    }, 600);
  };

  return (
    <PrototypePhone>
      <PrototypeStatusBar />
      <PrototypeHeader
        close
        onBack={() => navigate(returnTo)}
      />
      <div className="relative h-[360px] overflow-hidden">
        <img
          src="/images/personality/joybean.png"
          alt="ropet"
          className="absolute left-1/2 top-[-20px] w-[340px] -translate-x-1/2 opacity-25 blur-[3px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/55 to-white" />
      </div>
      <div className="absolute left-0 top-[322px] w-full px-8">
        <h1 className="text-[21px] font-semibold leading-8 text-[#222127]">
          {subscriptionActivated ? (
            <>
              Ropet Plus 已开通，<br />
              同意隐私政策后即可开启悄悄话。
            </>
          ) : source === 'subscription' ? (
            <>
              付款已完成，<br />
              同意隐私政策后即可开启悄悄话。
            </>
          ) : (
            <>
              体验卡已兑换，<br />
              同意隐私政策后即可开启悄悄话。
            </>
          )}
        </h1>
        <p className="mt-7 text-[13px] leading-6 text-[#66616c]">
          为提供语音唤醒与悄悄话服务，需要获取设备的语音权限。你可以随时在悄悄话模式中关闭许可。
        </p>
      </div>
      <div className="absolute bottom-[66px] left-5 right-5">
        <AgreementCheck
          checked={agreed}
          onClick={() => setAgreed(!agreed)}
          ariaLabel={agreed ? '取消同意隐私政策' : '同意隐私政策'}
        >
          <span className="text-[11px] text-[#c0bdc5]">
            我已阅读
            <span
              role="link"
              tabIndex={0}
              className="mx-1 cursor-pointer text-[#8b66ef]"
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/policies/privacy?returnTo=${encodeURIComponent(consentPath)}`);
              }}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                event.stopPropagation();
                navigate(`/policies/privacy?returnTo=${encodeURIComponent(consentPath)}`);
              }}
            >
              《Ropet 隐私政策》
            </span>
            并同意协议内容。
          </span>
        </AgreementCheck>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" disabled={submitting} onClick={() => navigate(-1)} className="h-[54px] rounded-full bg-[#d3d2d6] text-[15px] font-medium text-white">
            暂不开启
          </button>
          <button
            type="button"
            onClick={handleAgree}
            disabled={!agreed || submitting}
            className={`h-[54px] rounded-full text-[15px] font-medium text-white ${agreed ? 'bg-[#8b66ef]' : 'bg-[#bba9ee]'}`}
            aria-label="同意开启"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <LoaderCircle size={18} className="animate-spin" />
                正在提交
              </span>
            ) : (
              '同意开启'
            )}
          </button>
        </div>
      </div>
    </PrototypePhone>
  );
};

export default VoiceConsent;
