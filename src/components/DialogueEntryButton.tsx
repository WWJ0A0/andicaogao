import React from 'react';

type DialogueEntryButtonProps = {
  enabled: boolean;
  className?: string;
  onClick: () => void;
};

const DialogueEntryButton: React.FC<DialogueEntryButtonProps> = ({
  enabled,
  className = '',
  onClick,
}) => (
  <button
    type="button"
    aria-label={enabled ? '悄悄话已开启' : '悄悄话未开启'}
    className={`flex h-10 w-[86px] items-center justify-center gap-[3px] rounded-[13px] border px-[5px] shadow-[0_2px_8px_rgba(47,39,68,0.10)] backdrop-blur-[2px] ${
      enabled
        ? 'border-[#d9ccff] bg-[#f8f5ff]/90'
        : 'border-white/85 bg-white/75'
    } ${className}`}
    onClick={onClick}
  >
    <span className="relative flex h-7 w-[31px] shrink-0 items-center justify-center">
      {enabled && (
        <>
          <span className="absolute left-0 h-[11px] w-[3px] rounded-full bg-[#8b66ef]" />
          <span className="absolute left-[4px] h-[17px] w-[3px] rounded-full bg-[#8b66ef]" />
          <span className="absolute right-[4px] h-[17px] w-[3px] rounded-full bg-[#8b66ef]" />
          <span className="absolute right-0 h-[11px] w-[3px] rounded-full bg-[#8b66ef]" />
        </>
      )}
      <span
        className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold leading-none text-white ${
          enabled ? 'bg-[#8b66ef]' : 'bg-[#5f6064]'
        }`}
      >
        Hi
      </span>
    </span>
    <span className="whitespace-nowrap text-[12px] font-medium leading-none tracking-normal text-[#222222]">
      悄悄话
    </span>
  </button>
);

export default DialogueEntryButton;
