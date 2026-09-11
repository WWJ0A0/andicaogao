import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function HomeIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M3.8 14.2 14.4 4.7a2.4 2.4 0 0 1 3.2 0l10.6 9.5c1.5 1.3.6 3.8-1.4 3.8h-.7v8.1a2.8 2.8 0 0 1-2.8 2.8H8.7a2.8 2.8 0 0 1-2.8-2.8V18h-.7c-2 0-2.9-2.5-1.4-3.8Z" fill="currentColor" />
      <path d="M12.6 28.9v-7.2a3.4 3.4 0 0 1 6.8 0v7.2" fill="white" opacity=".72" />
    </svg>
  );
}

function MallBagIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M6 11.3h20l1.3 15.1a2.5 2.5 0 0 1-2.5 2.7H7.2a2.5 2.5 0 0 1-2.5-2.7L6 11.3Z" fill="currentColor" />
      <path d="M11.3 12V8.6a4.7 4.7 0 0 1 9.4 0V12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function NestIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 3.5v3.2" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M13.2 4.2 16 2.5l2.8 1.7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.1 21.5C6.2 14.1 10.3 8.7 16 8.7s9.8 5.4 10.9 12.8c.4 2.7-1.7 5-4.4 5h-13c-2.7 0-4.8-2.3-4.4-5Z" fill="currentColor" />
      <path d="M10.1 21.9c3.8-1.4 8-1.4 11.8 0" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity=".9" />
    </svg>
  );
}

function RopetIcon({ size = 32 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="block shrink-0 bg-current"
      style={{
        width: size,
        height: size,
        WebkitMaskImage: 'url(/images/mo0uw8au-tlddmuo.png)',
        maskImage: 'url(/images/mo0uw8au-tlddmuo.png)',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  );
}

const BottomNav: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const items = [
    { label: '首页', path: '/', active: isHome, icon: HomeIcon },
    { label: '商城', path: '/interaction-history', active: location.pathname === '/interaction-history', icon: MallBagIcon },
    { label: '小窝', path: '/nest', active: location.pathname === '/pet-interact' || location.pathname === '/nest', icon: NestIcon },
    { label: 'Ropet', path: '/pet-profile', active: location.pathname === '/pet-profile', icon: RopetIcon },
  ];

  return (
    <div className={`pointer-events-none absolute bottom-0 left-1/2 z-50 flex w-[394px] -translate-x-1/2 flex-col items-center bg-gradient-to-b from-transparent via-white/75 to-white ${compact ? 'h-[76px]' : 'h-[91px]'}`}>
      <nav aria-label="主导航" className={`pointer-events-auto relative w-[372px] shrink-0 ${compact ? 'h-[54px]' : 'h-[62px]'}`}>
        <img src="/images/bottom-nav-reference.png" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 grid grid-cols-4 px-[24px]">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                aria-label={item.label}
                aria-current={item.active ? 'page' : undefined}
                onClick={() => navigate(item.path)}
                className={`relative flex h-full items-center justify-center transition-colors active:scale-95 ${item.active ? 'text-[#8b66ef]' : 'text-[#b9b8bc]'}`}
              >
                <span className="pointer-events-none flex h-11 w-[58px] items-center justify-center bg-white">
                  <Icon size={item.label === 'Ropet' ? 36 : item.label === '首页' ? 27 : 26} />
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className={`mt-auto w-[134px] rounded-full bg-black ${compact ? 'mb-[6px] h-[4px]' : 'mb-[8px] h-[5px]'}`} />
    </div>
  );
};

export default BottomNav;
