import React from 'react';
import PageLayout from '../components/PageLayout';

const Settings: React.FC = () => {
  return (
    <PageLayout title="设置">
      <div className="flex flex-col gap-6 pt-6">
        <div className="bg-[#f8f8f8e5] rounded-[24px] p-6 w-full shadow-sm text-center">
          <h2 className="text-[#222222] text-xl font-semibold mb-6 text-left">应用设置</h2>
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between bg-[#eeeeee] p-4 rounded-xl border border-[#2222220d] cursor-pointer hover:bg-[#e0e0e0] transition-colors">
              <span className="text-[#222222] font-medium">通知管理</span>
              <span className="text-gray-400">❯</span>
            </div>
            <div className="flex items-center justify-between bg-[#eeeeee] p-4 rounded-xl border border-[#2222220d] cursor-pointer hover:bg-[#e0e0e0] transition-colors">
              <span className="text-[#222222] font-medium">语言设置</span>
              <span className="text-gray-400">❯</span>
            </div>
            <div className="flex items-center justify-between bg-[#eeeeee] p-4 rounded-xl border border-[#2222220d] cursor-pointer hover:bg-[#e0e0e0] transition-colors">
              <span className="text-[#222222] font-medium">帮助中心</span>
              <span className="text-gray-400">❯</span>
            </div>
            <div className="flex items-center justify-between bg-[#eeeeee] p-4 rounded-xl border border-[#2222220d] cursor-pointer hover:bg-[#e0e0e0] transition-colors">
              <span className="text-[#222222] font-medium">关于 ropet</span>
              <span className="text-gray-400">❯</span>
            </div>
          </div>
          
          <button className="mt-10 w-full bg-white text-[#ff5c64] py-3 rounded-2xl font-bold shadow-md hover:bg-gray-50 transition-colors border border-[#ff5c6420]">
            退出登录
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
