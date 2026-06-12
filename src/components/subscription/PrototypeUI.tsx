import React from 'react';
import { ArrowLeft, Check, Gem, LoaderCircle, X } from 'lucide-react';
import type { SubscriptionPlan } from '@/store/useSubscriptionStore';

export const prototypePurple = '#8b66ef';

export const PrototypeStatusBar: React.FC<{ muted?: boolean }> = ({ muted = false }) => (
  <div className={`flex h-11 items-center justify-between px-7 pt-2 ${muted ? 'text-[#6f6b76]' : 'text-[#19181f]'}`}>
    <span className="text-[15px] font-semibold">9:41</span>
    <div className="flex items-center gap-[6px]">
      <div className="flex items-end gap-[2px]">
        {[6, 9, 12, 15].map((height) => (
          <span key={height} className="w-[3px] rounded-full bg-current" style={{ height }} />
        ))}
      </div>
      <div className="relative h-[13px] w-[19px] overflow-hidden">
        <span className="absolute left-0 top-[2px] h-[14px] w-[19px] rounded-t-full border-[3px] border-current" />
        <span className="absolute left-[7px] top-[8px] h-[5px] w-[5px] rounded-full bg-current" />
      </div>
      <div className="relative h-[13px] w-[25px] rounded-[4px] border-2 border-current">
        <span className="absolute right-[-4px] top-[2px] h-[5px] w-[2px] rounded-r bg-current" />
        <span className="absolute inset-[2px] rounded-[1px] bg-current" />
      </div>
    </div>
  </div>
);

export const PrototypePhone: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className="flex min-h-screen w-full justify-center bg-[#d8deea] py-4">
    <div className={`relative h-[858px] w-[393px] overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.22)] ${className}`}>
      {children}
    </div>
  </div>
);

export const PrototypeHeader: React.FC<{
  title?: string;
  action?: React.ReactNode;
  onBack: () => void;
  close?: boolean;
}> = ({ title, action, onBack, close = false }) => (
  <div className="relative flex h-[62px] items-center px-3" style={{ zIndex: 30 }}>
    <button
      type="button"
      aria-label={close ? '关闭' : '返回'}
      onClick={onBack}
      className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-[#ececf0] bg-white text-[#19181f]"
    >
      {close ? <X size={24} /> : <ArrowLeft size={25} />}
    </button>
    {title && <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-medium text-[#19181f]">{title}</h1>}
    {action && <div className="ml-auto">{action}</div>}
  </div>
);

export const PlusBadge: React.FC<{
  activated?: boolean;
  compact?: boolean;
}> = ({ activated = false, compact = false }) => (
  <div
    className={`flex items-center rounded-full border font-medium transition-colors ${
      compact ? 'h-8 px-2.5' : 'h-9 px-3'
    } ${
      activated
        ? 'border-[#ded5fa] bg-[#f3efff] text-[#6543cb]'
        : 'border-[#8b66ef] bg-white text-[#7653dc]'
    }`}
  >
    <span className={`flex items-center gap-1.5 ${compact ? 'text-[12px]' : 'text-[13px]'}`}>
      <span className={`flex items-center justify-center rounded-full ${
        compact ? 'h-5 w-5' : 'h-[22px] w-[22px]'
      } ${activated ? 'bg-[#8b66ef] text-white' : 'bg-[#f1edff] text-[#8b66ef]'}`}>
        <Gem size={compact ? 11 : 12} fill="currentColor" />
      </span>
      {activated ? 'Plus 会员' : '开通 Plus'}
    </span>
    {activated && (
      <>
        <span className="mx-2 h-3 w-px bg-[#d4c9f5]" />
        <span className="text-[11px] text-[#8675b9]">已开通</span>
      </>
    )}
  </div>
);

export const DialogueSwitch: React.FC<{
  enabled: boolean;
  onClick: () => void;
  loading?: boolean;
  compact?: boolean;
}> = ({ enabled, onClick, loading = false, compact = false }) => (
  <button
    type="button"
    aria-label={loading ? '正在更新语音对话状态' : enabled ? '关闭语音对话' : '开启语音对话'}
    onClick={onClick}
    disabled={loading}
    className={`relative shrink-0 rounded-full border shadow-inner transition-colors ${
      compact ? 'h-8 w-[54px]' : 'h-11 w-[96px]'
    } ${
      enabled ? 'border-[#7550df] bg-[#8b66ef]' : 'border-[#d4d2d8] bg-[#e4e3e7]'
    }`}
  >
    {loading ? (
      <LoaderCircle size={compact ? 15 : 18} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-white" />
    ) : compact ? (
      <span className={`absolute top-[2px] h-[26px] w-[26px] rounded-full bg-white shadow transition-all ${enabled ? 'right-[2px]' : 'left-[2px]'}`} />
    ) : (
      <>
        <span className={`absolute top-[3px] h-9 w-9 rounded-full bg-white shadow transition-all ${enabled ? 'right-[3px]' : 'left-[3px]'}`} />
        <span className={`absolute top-[12px] text-[12px] font-semibold ${enabled ? 'left-[13px] text-white' : 'right-[11px] text-[#77727f]'}`}>
          {enabled ? 'ON' : 'OFF'}
        </span>
      </>
    )}
  </button>
);

export const AgreementCheck: React.FC<{
  checked: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel: string;
}> = ({ checked, onClick, children, ariaLabel }) => (
  <div className="flex items-start text-left">
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={checked}
      onClick={onClick}
      className={`mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] ${
        checked ? 'bg-[#8b66ef]' : 'border border-[#c9c7cd] bg-white'
      }`}
    >
      {checked && <Check size={14} color="white" strokeWidth={3} />}
    </button>
    <span className="ml-2" onClick={onClick}>{children}</span>
  </div>
);

export const ModalOverlay: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 px-[30px]">
    {children}
  </div>
);

export const HiMark = () => (
  <div className="relative mx-auto flex h-12 w-[72px] items-center justify-center">
    <span className="absolute left-0 h-[15px] w-[3px] rounded-full bg-[#8b66ef]" />
    <span className="absolute left-[6px] h-[25px] w-[4px] rounded-full bg-[#8b66ef]" />
    <span className="absolute right-[6px] h-[25px] w-[4px] rounded-full bg-[#8b66ef]" />
    <span className="absolute right-0 h-[15px] w-[3px] rounded-full bg-[#8b66ef]" />
    <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#8b66ef] text-[22px] text-white after:absolute after:bottom-[-4px] after:left-[7px] after:h-3 after:w-3 after:rotate-45 after:bg-[#8b66ef]">
      <span className="relative z-10">Hi</span>
    </span>
  </div>
);

const benefitRows = [
  '无限时长对话能力',
  '长期记忆能力（能记住你说的每一句话）',
  '更高的智慧（情绪感知能力）',
  '深度交流能力',
  '日记全面升级（记录你的生活片段）',
  '2W 积分收入囊中',
];

export const BenefitsTable = () => (
  <section className="overflow-hidden rounded-[18px] border border-[#eeebf2] bg-white shadow-[0_5px_18px_rgba(49,42,68,0.06)]">
    <div className="grid h-12 grid-cols-[1fr_58px_58px] bg-gradient-to-r from-[#9c83de] to-[#f6f4fb]">
      <strong className="flex items-center px-4 text-[15px] text-white">对话权益</strong>
      <span className="flex items-center justify-center text-[12px] text-[#68636e]">免费版</span>
      <span className="flex items-center justify-center text-[12px] font-medium text-[#8b66ef]">Plus</span>
    </div>
    <div className="px-4 py-3">
      {benefitRows.map((benefit) => (
        <div key={benefit} className="grid min-h-[38px] grid-cols-[1fr_58px_58px] items-center text-[12px] leading-[18px] text-[#6f6a74]">
          <span>{benefit}</span>
          <span className="text-center text-[17px] text-[#99949d]">−</span>
          <Check className="mx-auto text-[#8b66ef]" size={18} strokeWidth={2.5} />
        </div>
      ))}
    </div>
  </section>
);

export const SubscriptionPlanCard: React.FC<{
  plan: SubscriptionPlan;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  statusLabel?: string;
}> = ({ plan, selected, onClick, disabled = false, statusLabel }) => {
  const recurring = plan === 'auto-renew';
  return (
    <button
      type="button"
      aria-label={recurring ? '选择连续包月' : '选择买 1 个月'}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-[72px] w-full items-center justify-between rounded-[18px] px-[18px] text-left ${
        disabled
          ? 'cursor-not-allowed border border-transparent bg-[#eceaed] text-[#aaa6af]'
          : selected
            ? 'border-[3px] border-[#8b66ef] bg-white'
            : 'border border-transparent bg-[#f8f8f8]'
      }`}
    >
      <span>
        <span className={`block text-[16px] ${disabled ? 'text-[#99959e]' : 'text-[#222222]'}`}>{recurring ? '连续包月' : '1个月'}</span>
        {statusLabel && (
          <span className="mt-1 inline-flex rounded-full bg-[#e4def5] px-2 py-0.5 text-[9px] font-semibold text-[#7257be]">
            {statusLabel}
          </span>
        )}
      </span>
      <span className={`text-right ${disabled ? 'text-[#99959e]' : 'text-[#222222]'}`}>
        {recurring ? (
          <>
            <span className="flex items-baseline justify-end gap-1.5">
              <span className="text-[10px] text-[#aaa6af] line-through">￥79.9</span>
              <strong className="text-[17px] font-semibold">￥69.9/月</strong>
            </span>
            <span className="mt-1 flex items-center justify-end gap-1.5">
              <span className="rounded-full bg-[#fff0e8] px-2 py-0.5 text-[9px] font-semibold text-[#e06b36]">
                每月省 ￥10
              </span>
              <span className="text-[9px] text-[#aaa6af]">自动续费</span>
            </span>
          </>
        ) : (
          <>
            <strong className="block text-[17px] font-semibold">￥79.9</strong>
            <span className="mt-1 block text-[9px] text-[#aaa6af]">本次扣款</span>
          </>
        )}
      </span>
    </button>
  );
};
