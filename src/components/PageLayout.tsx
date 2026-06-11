import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  showBottomNav?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children, showBottomNav = true }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-[#d8deea] overflow-hidden flex justify-center py-4">
      {/* 主容器 - 模拟移动设备尺寸 */}
      <div className="relative w-[393px] h-[852px] bg-gradient-to-b from-[#e2e7f1] to-[#ffffff] to-[56.55%] overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        
        {/* 顶部导航栏 */}
        <div className="flex items-center px-[21px] py-4 pt-12 relative z-50">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50 backdrop-blur-md shadow-sm cursor-pointer hover:bg-white/80 active:scale-95 transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="flex-1 text-center text-[#222222] text-[18px] font-semibold pr-8">
            {title}
          </h1>
        </div>
        
        {/* 页面内容区 */}
        <div className="relative h-[calc(852px-86px-88px)] overflow-y-auto overflow-x-hidden px-[21px] pb-[21px]">
          {children}
        </div>

        {/* 底部导航栏 */}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
};

export default PageLayout;
