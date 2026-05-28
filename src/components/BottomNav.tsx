import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 根据当前路径判断哪个图标应该激活
  const isHome = location.pathname === '/';
  const isHistory = location.pathname === '/interaction-history';
  const isInteract = location.pathname === '/pet-interact' || location.pathname === '/nest';
  const isProfile = location.pathname === '/pet-profile';

  return (
    <div className="absolute bottom-0 left-[50%] -translate-x-1/2 flex flex-col items-center w-[394px] h-[86px] bg-gradient-to-b from-transparent to-white backdrop-blur-[18px] z-50">
      <div className="flex items-center justify-center gap-[52px] mt-[-7px] rounded-[40px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] bg-[#ffffffcf] px-[50px] py-[8px] pl-[45px] w-[364px] h-[54px]">
        
        {/* 首页 */}
        <div 
          className="relative flex items-center justify-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img
            src="/images/mo14hae4-eynnfqz.svg"
            alt="首页"
            className={`w-[32px] h-[32px] shrink-0 transition-opacity duration-300 ${isHome ? 'opacity-100' : 'opacity-50'}`}
          />
          {/* 选中态下划线 */}
          {isHome && (
            <div className="absolute -bottom-[6px] w-[24px] h-[3px] bg-black rounded-full" />
          )}
        </div>

        {/* 互动历史 */}
        <div 
          className="relative flex items-center justify-center cursor-pointer"
          onClick={() => navigate('/interaction-history')}
        >
          <img
            src="/images/mo14hae4-9xxewd9.svg"
            alt="互动历史"
            className={`w-[32px] h-[32px] shrink-0 overflow-hidden transition-opacity duration-300 ${isHistory ? 'opacity-100' : 'opacity-50'}`}
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
            className={`w-[32px] h-[32px] shrink-0 transition-opacity duration-300 ${isInteract ? 'opacity-100' : 'opacity-50'}`}
          />
          {isInteract && (
            <div className="absolute -bottom-[6px] w-[24px] h-[3px] bg-black rounded-full" />
          )}
        </div>

        {/* 个人中心 */}
        <div 
          className="relative flex items-start pt-[3px] pr-[1px] h-[32px] overflow-hidden shrink-0 cursor-pointer"
          onClick={() => navigate('/pet-profile')}
        >
          <div 
            className="flex flex-grow items-start pl-[20px] pb-[21px] bg-cover bg-center bg-no-repeat transition-opacity duration-300"
            style={{ 
              backgroundImage: 'url(/images/mo14hae4-7jew9wc.svg)',
              opacity: isProfile ? 1 : 0.5,
              width: '32px',
              height: '32px'
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
      <div className="flex items-start self-stretch mt-[5px] px-[131px] py-[21px] pl-[129px]">
        <div className="rounded-[100px] bg-black w-[134px] h-[5px]"></div>
      </div>
    </div>
  );
};

export default BottomNav;
