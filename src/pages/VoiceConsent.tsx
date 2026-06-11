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
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { setPaymentState, grantVoiceConsent } = useSubscriptionStore();
  const source = searchParams.get('source') === 'subscription' ? 'subscription' : 'trial';

  const handleAgree = () => {
    if (!agreed || submitting) return;
    setSubmitting(true);
    window.setTimeout(() => {
      grantVoiceConsent();
      setPaymentState('opening');
      navigate(`/subscription/opening?source=${source}`);
    }, 600);
  };

  return (
    <PrototypePhone>
      <PrototypeStatusBar />
      <PrototypeHeader close onBack={() => navigate(source === 'trial' ? '/subscription/trial' : '/subscription')} />
      <div className="relative h-[360px] overflow-hidden">
        <img
          src="/images/personality/joybean.png"
          alt="KAMOMO"
          className="absolute left-1/2 top-[-20px] w-[340px] -translate-x-1/2 opacity-25 blur-[3px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/55 to-white" />
      </div>
      <div className="absolute left-0 top-[322px] w-full px-8">
        <h1 className="text-[21px] font-semibold leading-8 text-[#222127]">
          使用语音对话功能，<br />
          让「KAMOMO」能与你流利对话。
        </h1>
        <p className="mt-7 text-[13px] leading-6 text-[#66616c]">
          在使用前，需要先开启“语音服务”功能，该功能可在详情右上角进行关闭。<br />
          语音服务功能开启即代表你同意 ropet 获取语音视频权限。
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
                navigate(`/policies/privacy?returnTo=${encodeURIComponent(`/subscription/voice-consent?source=${source}`)}`);
              }}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                event.stopPropagation();
                navigate(`/policies/privacy?returnTo=${encodeURIComponent(`/subscription/voice-consent?source=${source}`)}`);
              }}
            >
              《Ropet 隐私政策》
            </span>
            并同意协议内容。
          </span>
        </AgreementCheck>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" disabled={submitting} onClick={() => navigate(-1)} className="h-[54px] rounded-full bg-[#d3d2d6] text-[15px] font-medium text-white">
            再次再说
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
