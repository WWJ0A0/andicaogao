import React from 'react';
import { AudioLines } from 'lucide-react';
import { TrialCardStatus } from '@/store/useSubscriptionStore';

interface TrialCardArtworkProps {
  days: number;
  status: TrialCardStatus;
  size?: 'compact' | 'hero';
  className?: string;
}

const TrialCardArtwork: React.FC<TrialCardArtworkProps> = ({
  days,
  status,
  size = 'compact',
  className = '',
}) => {
  const hero = size === 'hero';
  const muted = status === 'used';

  return (
    <div
      aria-hidden="true"
      className={`relative shrink-0 overflow-hidden border border-white/70 bg-gradient-to-br shadow-[0_12px_28px_rgba(91,58,174,0.22)] ${
        hero
          ? 'h-[270px] w-[210px] rounded-[22px] from-[#a98cff] via-[#8b66ef] to-[#6240c7]'
          : 'h-[58px] w-[52px] rounded-[12px] from-[#ae94ff] via-[#8b66ef] to-[#6d49d2]'
      } ${muted ? 'grayscale opacity-55' : ''} ${className}`}
    >
      <div className={`absolute rounded-full bg-white/12 ${hero ? '-right-14 -top-14 h-40 w-40' : '-right-5 -top-5 h-14 w-14'}`} />
      <div className={`absolute rounded-full border border-white/20 ${hero ? '-bottom-12 -left-10 h-36 w-36' : '-bottom-4 -left-4 h-12 w-12'}`} />

      <div className={`relative flex h-full flex-col ${hero ? 'px-6 py-6' : 'px-2.5 py-2'}`}>
        <div className="flex items-center justify-between text-white">
          <span className={`${hero ? 'text-[13px]' : 'text-[7px]'} font-semibold tracking-normal opacity-80`}>
            ROPET
          </span>
          <AudioLines size={hero ? 21 : 11} strokeWidth={2.4} />
        </div>

        <div className={`flex flex-1 flex-col justify-center text-white ${hero ? 'mt-2' : ''}`}>
          <div className="flex items-end">
            <strong className={`${hero ? 'text-[82px] leading-[76px]' : 'text-[31px] leading-[29px]'} font-semibold tracking-normal`}>
              {days}
            </strong>
            <span className={`${hero ? 'mb-2 ml-2 text-[17px]' : 'mb-[2px] ml-1 text-[8px]'} font-semibold`}>
              天
            </span>
          </div>
          <span className={`${hero ? 'mt-4 text-[17px]' : 'mt-1 text-[8px]'} font-medium tracking-normal text-white/90`}>
            悄悄话体验卡
          </span>
        </div>

        {hero && (
          <div className="flex items-center justify-between border-t border-white/25 pt-4 text-[12px] text-white/75">
            <span>仅限当前设备使用</span>
            <span>ropet</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrialCardArtwork;
