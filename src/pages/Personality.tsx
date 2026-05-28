import React from 'react';
import PageLayout from '../components/PageLayout';

const Personality: React.FC = () => {
  return (
    <PageLayout title="性格详情">
      <div className="flex flex-col gap-6 pt-6">
        <div className="bg-[#f8f8f8e5] rounded-[24px] p-6 w-full shadow-sm text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#a68db6] to-[#c8b4d3] rounded-full flex items-center justify-center shadow-lg">
            <img 
              src="/images/mo0uw8au-eiepoer.png" 
              alt="性格图标" 
              className="w-10 h-10 object-contain drop-shadow-md"
            />
          </div>
          <h2 className="text-[#222222] text-2xl font-bold mb-2">乐天派</h2>
          <p className="text-[#22222299] text-sm mb-8 leading-relaxed">
            KAMOMO总是对世界充满好奇，乐观开朗的性格让它能够快速适应新环境，并且给周围带来欢乐。
          </p>

          <div className="bg-[#eeeeee] p-5 rounded-2xl border border-[#2222220d] text-left">
            <h3 className="text-[#222222] font-semibold mb-4 text-lg">性格特征</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#ff5c64] rounded-full"></span>
                <span className="text-[#222222] text-sm font-medium">活泼好动，喜欢探索</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#a68db6] rounded-full"></span>
                <span className="text-[#222222] text-sm font-medium">容易开心，不易生气</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#c8b4d3] rounded-full"></span>
                <span className="text-[#222222] text-sm font-medium">互动积极性高</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Personality;