import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';

const Settings: React.FC = () => {
  const { minorModeEnabled, setMinorModeEnabled } = useSubscriptionStore();
  const [pendingMinorMode, setPendingMinorMode] = useState<boolean | null>(null);
  const nextMinorMode = pendingMinorMode ?? false;

  const confirmMinorModeChange = () => {
    if (pendingMinorMode === null) return;
    setMinorModeEnabled(pendingMinorMode);
    setPendingMinorMode(null);
  };

  return (
    <PageLayout title="设置">
      <div className="flex flex-col gap-6 pt-6">
        <div className="bg-[#f8f8f8e5] rounded-[24px] p-6 w-full shadow-sm text-center">
          <h2 className="text-[#222222] text-xl font-semibold mb-6 text-left">应用设置</h2>
          <div className="flex flex-col gap-4 text-left">
            <button
              type="button"
              onClick={() => setPendingMinorMode(!minorModeEnabled)}
              className="flex items-center justify-between bg-[#eeeeee] p-4 rounded-xl border border-[#2222220d] cursor-pointer hover:bg-[#e0e0e0] transition-colors"
            >
              <span className="text-[#222222] font-medium">未成年模式</span>
              <span
                className={`relative h-8 w-[54px] rounded-full transition-colors ${
                  minorModeEnabled ? 'bg-[#8b66ef]' : 'bg-[#d7d6dc]'
                }`}
              >
                <span
                  className={`absolute top-[3px] h-[26px] w-[26px] rounded-full bg-white shadow transition-all ${
                    minorModeEnabled ? 'left-[25px]' : 'left-[3px]'
                  }`}
                />
              </span>
            </button>
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

      {pendingMinorMode !== null && (
        <div
          className="absolute inset-0 z-[200] flex items-center justify-center bg-black/55 px-[31px]"
          onClick={() => setPendingMinorMode(null)}
        >
          <div
            className="w-full rounded-[24px] bg-white px-6 pb-5 pt-6 text-center shadow-[0_18px_42px_rgba(42,34,58,0.24)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-[20px] font-bold leading-7 text-[#222222]">
              {nextMinorMode ? '开启未成年模式？' : '关闭未成年模式？'}
            </h3>
            <p className="mt-3 text-left text-[14px] font-medium leading-6 text-[#66616d]">
              {nextMinorMode
                ? '开启后，对话功能会被禁用；首页对话入口、小窝里的翻译项圈栏目、成长阶段的翻译项圈奖励、货币与积分兑换入口都会隐藏或关闭。'
                : '关闭后，对话功能、首页对话入口、小窝里的翻译项圈栏目、成长阶段奖励，以及货币与积分兑换入口将恢复显示。'}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPendingMinorMode(null)}
                className="h-12 rounded-full bg-[#eeeeee] text-[16px] font-bold text-[#77727f]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmMinorModeChange}
                className="h-12 rounded-full bg-[#8b66ef] text-[16px] font-bold text-white shadow-[0_10px_22px_rgba(139,102,239,0.22)]"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Settings;
