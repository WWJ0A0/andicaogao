import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 根据当前路径判断哪个图标应该激活
  const isHome = location.pathname === '/';
  const isHistory = location.pathname === '/interaction-history';
  const isInteract = location.pathname === '/pet-interact' || location.pathname === '/nest';
  const isProfile = location.pathname === '/pet-profile';

  return (
    <div className={`absolute bottom-0 left-[50%] -translate-x-1/2 flex flex-col items-center w-[394px] bg-gradient-to-b from-transparent to-white z-50 ${compact ? 'h-[70px] backdrop-blur-[10px]' : 'h-[86px] backdrop-blur-[18px]'}`}>
      <div className={`flex items-center justify-center gap-[52px] rounded-[40px] bg-[#ffffffed] px-[50px] pl-[45px] w-[364px] ${compact ? 'mt-0 h-[46px] py-[6px] shadow-[0_1px_3px_rgba(0,0,0,0.035)]' : 'mt-[-7px] h-[54px] py-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)]'}`}>
        
        {/* 首页 */}
        <div 
          className="relative flex items-center justify-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img
            src="/images/mo14hae4-eynnfqz.svg"
            alt="首页"
            className={`${compact ? 'h-[28px] w-[28px]' : 'h-[32px] w-[32px]'} shrink-0 transition-opacity duration-300 ${isHome ? 'opacity-100' : 'opacity-50'}`}
          />
          {/* 选中态下划线 */}
          {isHome && (
            <div className="absolute -bottom-[6px] w-[24px] h-[3px] bg-black rounded-full" />
          )}
        </div>

        {/* 商城 */}
        <div 
          className="relative flex items-center justify-center cursor-pointer"
          onClick={() => navigate('/interaction-history')}
        >
          <img
            src="/images/mall-nav-icon.png"
            alt="商城"
            className={`${compact ? 'h-[28px] w-[28px]' : 'h-[32px] w-[32px]'} shrink-0 object-contain transition-opacity duration-300 ${isHistory ? 'opacity-100' : 'opacity-50'}`}
          />
          {isHistory && (
            <div className="absolute -bottom-[6px] w-[24px] h-[3px] bg-black rounded-full" />
          )}
        </div>

        {/* 宠物互动 (这里跳转到小窝) */}
        <div 
          className="relative flex items-center justify-center cursor-pointer"
          onClick={() => navigate('/nest')}
        >
          <img
            src="/images/mo14hae4-i9xy2ty.svg"
            alt="宠物互动"
            className={`${compact ? 'h-[28px] w-[28px]' : 'h-[32px] w-[32px]'} shrink-0 transition-opacity duration-300 ${isInteract ? 'opacity-100' : 'opacity-50'}`}
          />
          {isInteract && (
            <div className="absolute -bottom-[6px] w-[24px] h-[3px] bg-black rounded-full" />
          )}
        </div>

        {/* 个人中心 */}
        <div 
          className={`relative flex items-start pt-[3px] pr-[1px] overflow-hidden shrink-0 cursor-pointer ${compact ? 'h-[28px]' : 'h-[32px]'}`}
          onClick={() => navigate('/pet-profile')}
        >
          <div 
            className="flex flex-grow items-start pl-[20px] pb-[21px] bg-cover bg-center bg-no-repeat transition-opacity duration-300"
            style={{ 
              backgroundImage: 'url(/images/mo14hae4-7jew9wc.svg)',
              opacity: isProfile ? 1 : 0.5,
              width: compact ? '28px' : '32px',
              height: compact ? '28px' : '32px'
            }}
          >
            {/* 红点 */}
            <div className="flex flex-col items-center justify-center rounded bg-[#ff5c64] px-[2px] w-[8px] h-[8px] gap-[6px]"></div>
          </div>
          {isProfile && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[24px] h-[3px] bg-black rounded-full" />
          )}
        </div>
      </div>
      
      {/* Home Indicator */}
      <div className={`flex items-start self-stretch px-[131px] pl-[129px] ${compact ? 'mt-[3px] py-[12px]' : 'mt-[5px] py-[21px]'}`}>
        <div className="rounded-[100px] bg-black w-[134px] h-[5px]"></div>
      </div>
    </div>
  );
};

export default BottomNav;
