import React from 'react';
import PageLayout from '../components/PageLayout';

const Growth: React.FC = () => {
  return (
    <PageLayout title="成长里程碑">
      <div className="flex flex-col gap-6 pt-6">
        <div className="bg-[#f8f8f8e5] rounded-[24px] p-6 w-full shadow-sm relative">
          <div className="absolute left-10 top-24 bottom-10 w-[2px] bg-gradient-to-b from-[#ff5c64] to-[#c8b4d3] opacity-30"></div>
          
          <h2 className="text-[#222222] text-xl font-semibold mb-8 pl-4">阶段记录</h2>
          
          <div className="flex flex-col gap-8 relative z-10">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff5c64] to-[#ff8c92] shadow-md border-4 border-white flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </div>
              </div>
              <div className="bg-[#eeeeee] p-4 rounded-xl border border-[#2222220d] flex-1">
                <h3 className="text-[#222222] font-semibold text-lg mb-1">认知形成期</h3>
                <p className="text-[#3f3f6099] text-xs font-medium mb-2">当前阶段</p>
                <p className="text-[#22222299] text-sm">开始认识周围环境，对主人的互动有明显的反应。</p>
              </div>
            </div>

            <div className="flex gap-4 opacity-70">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#eeeeee] shadow-sm border-4 border-white flex items-center justify-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                </div>
              </div>
              <div className="bg-[#eeeeee] p-4 rounded-xl border border-[#2222220d] flex-1 border-dashed">
                <h3 className="text-gray-500 font-semibold text-lg mb-1">探索成长阶段</h3>
                <p className="text-gray-400 text-xs font-medium mb-2">未解锁</p>
                <p className="text-gray-400 text-sm">需要累积 500 点陪伴值解锁</p>
              </div>
            </div>

            <div className="flex gap-4 opacity-50">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#eeeeee] shadow-sm border-4 border-white flex items-center justify-center">
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                </div>
              </div>
              <div className="bg-[#eeeeee] p-4 rounded-xl border border-[#2222220d] flex-1 border-dashed">
                <h3 className="text-gray-400 font-semibold text-lg mb-1">成熟期</h3>
                <p className="text-gray-300 text-xs font-medium mb-2">未解锁</p>
                <p className="text-gray-300 text-sm">需要累积 1000 点陪伴值解锁</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Growth;