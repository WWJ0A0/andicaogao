import React, { useState } from 'react';
import { ChevronLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDialogueStore } from '@/store/useDialogueStore';

const InteractionHistory: React.FC = () => {
  const navigate = useNavigate();
  const { points } = useDialogueStore();
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full justify-center overflow-hidden bg-[#d8deea] py-4">
      <div className="relative h-[852px] w-[393px] overflow-hidden rounded-[28px] border border-white/70 bg-[#fffafa] shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        <img
          src="/images/interaction-score-designed.png"
          className="absolute inset-0 h-full w-full object-cover"
          alt="今日互动积分界面"
        />

        <button
          type="button"
          aria-label="返回首页"
          onClick={() => navigate('/')}
          className="absolute left-[18px] top-[52px] z-20 flex h-11 w-11 items-center justify-center rounded-[15px] border border-white bg-white/90 text-[#26222b] shadow-[0_7px_18px_rgba(71,53,108,0.10)] backdrop-blur-sm"
        >
          <ChevronLeft size={28} strokeWidth={2.4} />
        </button>

        <button
          type="button"
          aria-label="获取更多积分"
          onClick={() => navigate('/points-store?returnTo=/interaction-score')}
          className="absolute left-[114px] top-[50px] z-30 flex h-10 w-[164px] items-center justify-center rounded-[14px] border border-white bg-white/95 px-3 text-[17px] font-bold text-[#38333f] shadow-[0_7px_18px_rgba(80,58,130,0.10)] backdrop-blur-sm"
        >
          <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#4e91ff]">
            <Star size={16} fill="#ffe641" className="text-[#ffe641]" />
          </span>
          {points.toLocaleString()}
          <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#8b66ef] text-[16px] leading-none text-white">+</span>
        </button>

        <button
          type="button"
          aria-label="查看互动积分规则"
          onClick={() => setShowRules(true)}
          className="absolute right-[17px] top-[50px] z-30 h-[42px] w-[56px] rounded-[16px]"
        />

        {showRules && (
          <div className="absolute inset-0 z-50 flex items-end bg-black/55" onClick={() => setShowRules(false)}>
            <section className="max-h-[690px] w-full rounded-t-[30px] bg-white px-5 pb-7 pt-6 shadow-[0_-16px_40px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()}>
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#e1dfe5]" />
              <h2 className="text-center text-[22px] font-semibold text-[#22242a]">互动积分规则</h2>
              <div className="mt-6 max-h-[510px] overflow-y-auto rounded-[18px] bg-[#f7f3ff] px-5 py-5 text-[14px] leading-7 text-[#4f4d55] scrollbar-hide">
                <p className="mb-2 font-semibold text-[#7554ce]">每日互动积分获取上限为 850 分：</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>每日互动积分刷新时间为 08:00；</li>
                  <li>抚摸、注视或夸奖，每次获得 5 积分；</li>
                  <li>对着 Ropet 笑或点赞，每次获得 10 积分；</li>
                  <li>喂食或比心，每次获得 30 积分；</li>
                  <li>让 Ropet 听歌，每次获得 40 积分；</li>
                  <li>首次绑定 Ropet，获得 160 积分，每台设备仅一次。</li>
                </ul>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractionHistory;
