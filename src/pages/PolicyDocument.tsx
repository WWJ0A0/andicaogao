import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  PrototypeHeader,
  PrototypePhone,
  PrototypeStatusBar,
} from '@/components/subscription/PrototypeUI';

type PolicyKind = 'privacy' | 'subscription';

type Props = {
  kind: PolicyKind;
};

const policyConfig: Record<PolicyKind, { title: string; source: string }> = {
  privacy: {
    title: 'Ropet 隐私政策',
    source: '/policies/ropet-privacy-policy.txt',
  },
  subscription: {
    title: 'Ropet Plus 订阅服务协议',
    source: '/policies/ropet-plus-subscription-agreement.txt',
  },
};

const PolicyDocument: React.FC<Props> = ({ kind }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [content, setContent] = useState('');
  const [failed, setFailed] = useState(false);
  const config = policyConfig[kind];

  useEffect(() => {
    let active = true;
    fetch(config.source)
      .then((response) => {
        if (!response.ok) throw new Error('Policy document unavailable');
        return response.text();
      })
      .then((text) => {
        if (active) setContent(text);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [config.source]);

  const lines = useMemo(
    () => content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
    [content],
  );

  const goBack = () => {
    const returnTo = searchParams.get('returnTo');
    if (returnTo?.startsWith('/')) {
      navigate(returnTo);
      return;
    }
    navigate(-1);
  };

  return (
    <PrototypePhone className="bg-[#f7f7f8]">
      <PrototypeStatusBar />
      <PrototypeHeader title={config.title} onBack={goBack} />
      <main className="h-[780px] overflow-y-auto px-5 pb-12 scrollbar-hide">
        <article className="rounded-[20px] bg-white px-5 py-6 shadow-[0_8px_24px_rgba(30,40,60,0.05)]">
          {!content && !failed && (
            <p className="py-16 text-center text-[14px] text-[#99949f]">正在加载文档…</p>
          )}
          {failed && (
            <p className="py-16 text-center text-[14px] text-[#b04b45]">文档加载失败，请稍后重试。</p>
          )}
          {lines.map((line, index) => {
            if (index === 0) {
              return (
                <h1 key={`${line}-${index}`} className="text-[23px] font-bold leading-8 text-[#222127]">
                  {line}
                </h1>
              );
            }
            if (/^(发布日期|生效日期)[:：]/.test(line)) {
              return (
                <p key={`${line}-${index}`} className="mt-1 text-[12px] leading-5 text-[#aaa5ae]">
                  {line}
                </p>
              );
            }
            if (/^第[一二三四五六七八九十百]+(章|条)/.test(line)) {
              return (
                <h2 key={`${line}-${index}`} className="mb-2 mt-7 text-[18px] font-bold leading-7 text-[#29262e]">
                  {line}
                </h2>
              );
            }
            if (/^\d+\.\d+\s/.test(line)) {
              return (
                <h3 key={`${line}-${index}`} className="mb-1 mt-4 text-[15px] font-semibold leading-6 text-[#45404a]">
                  {line}
                </h3>
              );
            }
            if (/^•/.test(line)) {
              return (
                <div key={`${line}-${index}`} className="mt-1 flex gap-2 pl-1 text-[13px] leading-6 text-[#66616c]">
                  <span className="text-[#8b66ef]">•</span>
                  <span>{line.replace(/^•\s*/, '')}</span>
                </div>
              );
            }
            return (
              <p key={`${line}-${index}`} className="mt-2 text-[13px] leading-6 text-[#66616c]">
                {line}
              </p>
            );
          })}
        </article>
        <p className="py-5 text-center text-[11px] text-[#b2aeb6]">请向下滑动阅读完整内容</p>
      </main>
    </PrototypePhone>
  );
};

export default PolicyDocument;
