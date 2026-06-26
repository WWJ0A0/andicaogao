import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InteractionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [showRules, setShowRules] = useState(false);
  const openRules = () => setShowRules(true);

  return (
    <div className="relative flex min-h-screen w-full justify-center overflow-hidden bg-[#d8deea] py-4">
      <div className="relative h-[852px] w-[393px] overflow-hidden rounded-[28px] border border-white/70 bg-[#f7f7f7] shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        <img
          src="/images/interaction-score-reference.jpg"
          className="absolute inset-0 h-full w-full object-cover"
          alt="互动分明细"
        />

        <button
          type="button"
          aria-label="返回首页"
          onClick={() => navigate('/')}
          className="absolute left-[12px] top-[70px] z-20 h-20 w-20 rounded-full"
        />

        <button
          type="button"
          aria-label="获得更多互动分"
          onPointerDown={openRules}
          onClick={openRules}
          className="absolute z-30 rounded-l-[30px] bg-white text-[15px] font-medium text-[#19181f] shadow-[0_6px_18px_rgba(15,23,42,0.08)]"
          style={{
            right: 0,
            top: 150,
            width: 92,
            height: 62,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          获得更多？
        </button>

        {showRules && (
          <div
            className="absolute inset-0 z-50 flex items-end bg-black/55"
            onClick={() => setShowRules(false)}
          >
            <section
              className="max-h-[760px] w-full rounded-t-[30px] bg-white px-5 pb-7 pt-6 shadow-[0_-16px_40px_rgba(0,0,0,0.18)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#e1dfe5]" />
              <h2 className="text-center text-[24px] font-semibold text-[#22242a]">互动分规则</h2>
              <div className="mt-7 max-h-[520px] overflow-y-auto rounded-[18px] bg-[#f5f5f5] px-5 py-5 text-[15px] leading-7 text-[#4f4d55] scrollbar-hide">
                <p className="mb-2 font-semibold">每日互动分获取上限为 850 分；</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>每日互动分刷新时间为 08:00；</li>
                  <li>抚摸 ropet，每次加 5 分，每次间隔 5 分钟；</li>
                  <li>注视 ropet，每次加 5 分，每次间隔 5 分钟；</li>
                  <li>夸奖 ropet，说“你真棒”“好厉害”“你好聪明”，每次加 5 分，每次间隔 5 分钟；</li>
                  <li>对着 ropet 笑，每次加 5 分，每次间隔 5 分钟；</li>
                  <li>对着 ropet 比大拇指点赞，每次加 10 分，每次间隔 5 分钟；</li>
                  <li>给 ropet 吃东西，每次加 30 分，每日加分上限 3 次；</li>
                  <li>给 ropet 比心，每次加 30 分，每日加分上限 3 次，每次间隔 5 分钟；</li>
                  <li>让 ropet 听歌，每次加 40 分，每日加分上限 3 次；</li>
                  <li>首次绑定 ropet，加 160 分，每只 ropet 只加一次。</li>
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
