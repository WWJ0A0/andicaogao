import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Coins, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDialogueStore } from '@/store/useDialogueStore';

const interactionClaims = [
  { id: 'binding', label: '首次绑定', amount: 160, left: 65, top: 581 },
  { id: 'touch', label: '抚摸', amount: 5, left: 237, top: 581 },
  { id: 'heart', label: '比心', amount: 5, left: 65, top: 790 },
  { id: 'praise', label: '夸夸TA', amount: 160, left: 237, top: 790 },
  { id: 'smile', label: '对TA笑', amount: 160, left: 65, top: 999 },
  { id: 'gaze', label: '注视', amount: 160, left: 237, top: 999 },
  { id: 'dance', label: '跳舞', amount: 160, left: 65, top: 1208 },
  { id: 'feed', label: '喂食', amount: 160, left: 237, top: 1208 },
  { id: 'like', label: '给TA点赞', amount: 160, left: 65, top: 1417 },
] as const;

const megaStarParticles = Array.from({ length: 52 }, (_, index) => {
  const startX = 12 + ((index * 83) % 369);
  const startY = 22 + ((index * 137) % 790);
  const curveX = Math.round((startX + 196) / 2 + (index % 2 === 0 ? -54 : 54));
  const curveY = Math.round((startY + 170) / 2 + ((index % 3) - 1) * 34);
  return {
    id: index,
    startX,
    startY,
    curveX,
    curveY,
    size: 11 + (index % 5) * 3,
    delay: (index % 13) * 42 + Math.floor(index / 13) * 24,
    duration: 920 + (index % 7) * 90,
    rotation: 180 + (index % 6) * 58,
    color: ['#ffd323', '#ffec7a', '#fff7c7', '#ffadcf'][index % 4],
  };
});

const InteractionHistory: React.FC = () => {
  const navigate = useNavigate();
  const { points, addPoints } = useDialogueStore();
  const [showRules, setShowRules] = useState(false);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [claimEffect, setClaimEffect] = useState<{ key: number; amount: number; left: number; top: number; burst: boolean } | null>(null);
  const effectTimerRef = useRef<number | null>(null);
  const pendingPoints = useMemo(() => interactionClaims.reduce(
    (total, claim) => total + (claimedIds.includes(claim.id) ? 0 : claim.amount),
    0,
  ), [claimedIds]);

  useEffect(() => () => {
    if (effectTimerRef.current !== null) window.clearTimeout(effectTimerRef.current);
  }, []);

  const playClaimEffect = (amount: number, left: number, top: number, burst = false) => {
    setClaimEffect({ key: Date.now(), amount, left, top, burst });
    if (effectTimerRef.current !== null) window.clearTimeout(effectTimerRef.current);
    effectTimerRef.current = window.setTimeout(() => {
      setClaimEffect(null);
      effectTimerRef.current = null;
    }, burst ? 2600 : 1100);
  };

  const playRewardSound = (burst = false) => {
    try {
      const audio = new AudioContext();
      const master = audio.createGain();
      master.gain.setValueAtTime(0.0001, audio.currentTime);
      master.gain.exponentialRampToValueAtTime(burst ? 0.18 : 0.12, audio.currentTime + 0.025);
      master.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + (burst ? 0.9 : 0.42));
      master.connect(audio.destination);

      const notes = burst
        ? [783.99, 1046.5, 1318.51, 987.77, 1567.98, 1174.66, 1760, 1318.51, 2093, 1567.98]
        : [659.25, 987.77];
      notes.forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        const start = audio.currentTime + index * (burst ? 0.075 : 0.07);
        oscillator.type = burst && index % 3 === 0 ? 'sine' : 'triangle';
        oscillator.frequency.setValueAtTime(frequency, start);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.08, start + 0.18);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.8, start + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + (burst ? 0.34 : 0.25));
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start(start);
        oscillator.stop(start + (burst ? 0.38 : 0.3));
      });
      if (burst) {
        [0.86, 1.02, 1.18].forEach((offset, index) => {
          const oscillator = audio.createOscillator();
          const gain = audio.createGain();
          const start = audio.currentTime + offset;
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime([1046.5, 1318.51, 2093][index], start);
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.exponentialRampToValueAtTime(0.72, start + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.46);
          oscillator.connect(gain);
          gain.connect(master);
          oscillator.start(start);
          oscillator.stop(start + 0.5);
        });
      }
      window.setTimeout(() => void audio.close(), burst ? 1900 : 650);
    } catch {
      // Browsers without Web Audio still retain the visual feedback.
    }
  };

  const claimOne = (claim: typeof interactionClaims[number]) => {
    if (claimedIds.includes(claim.id)) return;
    playRewardSound();
    addPoints(claim.amount, { title: claim.label, category: '每日互动' });
    setClaimedIds((current) => [...current, claim.id]);
    playClaimEffect(claim.amount, claim.left + 46, claim.top);
  };

  const claimAll = () => {
    if (pendingPoints <= 0) return;
    const amount = pendingPoints;
    playRewardSound(true);
    addPoints(amount, { title: '一键领取互动积分', category: '每日互动' });
    setClaimedIds((current) => Array.from(new Set([
      ...current,
      ...interactionClaims.map((claim) => claim.id),
    ])));
    playClaimEffect(amount, 306, 378, true);
  };

  return (
    <div className="relative flex min-h-screen w-full justify-center overflow-hidden bg-[#d8deea] py-4">
      <div className={`relative h-[852px] w-[393px] overflow-hidden rounded-[28px] border border-white/70 bg-[#fffafa] shadow-[0_20px_50px_rgba(15,23,42,0.22)] ${claimEffect?.burst ? 'interaction-screen-burst' : ''}`}>
        <div className="relative h-full overflow-y-auto scrollbar-hide">
          <div className="relative h-[1493px] w-full">
            <img
              src="/images/interaction-score-center.png"
              className="absolute inset-0 h-[1493px] w-[393px] max-w-none"
              alt="积分中心"
            />

            <div className={`pointer-events-none absolute left-1/2 top-[126px] z-10 h-[150px] w-[184px] -translate-x-1/2 ${claimEffect?.burst ? 'interaction-jar-feast' : claimEffect ? 'interaction-jar-react' : ''}`} aria-hidden="true">
              <div className="interaction-jar-aura absolute inset-0 rounded-full" />
              <div className="interaction-jar-sprite absolute inset-0" />
              <div className="interaction-idle-glint absolute left-[27px] top-[18px] text-[20px] text-[#ffe16b]">✦</div>
              <div className="interaction-idle-glint interaction-idle-glint-delay absolute right-[24px] top-[58px] text-[15px] text-[#fff2a7]">✦</div>
              {claimEffect?.burst && Array.from({ length: 8 }, (_, index) => (
                <span key={index} className="interaction-jar-fill-star absolute text-[#ffd328]" style={{ left: 42 + (index % 4) * 27, top: 72 + Math.floor(index / 4) * 27, animationDelay: `${920 + index * 75}ms` }}>★</span>
              ))}
            </div>

            <div
              aria-label={`当前总积分 ${points.toLocaleString()}，每日互动分获取上限850`}
              className="absolute left-1/2 top-[278px] z-20 flex h-[68px] w-[250px] -translate-x-1/2 flex-col items-center justify-center bg-[#fffafa]"
            >
              <span className="bg-gradient-to-r from-[#c650f3] to-[#42a7ed] bg-clip-text text-[32px] font-extrabold leading-none text-transparent">
                {points.toLocaleString()}
              </span>
              <span className="mt-1.5 text-[11px] font-medium leading-none text-[#9b96a1]">每日互动分获取上限850</span>
            </div>

            <div className="absolute left-[43px] top-[374px] z-20 flex h-[37px] w-[105px] items-center bg-[#fffdfd] px-1 text-[24px] font-semibold text-[#252229]">
              <Coins size={17} className="mr-1.5 text-[#f2c832]" strokeWidth={2.2} />
              {pendingPoints}
            </div>
            <button
              type="button"
              onClick={claimAll}
              disabled={pendingPoints <= 0}
              className="absolute left-[265px] top-[378px] z-30 flex h-[33px] w-[82px] items-center justify-center rounded-[10px] bg-gradient-to-b from-[#9e73f4] to-[#7952df] text-[13px] font-semibold text-white shadow-[0_5px_10px_rgba(112,78,211,0.2)] transition active:scale-95 disabled:bg-none disabled:bg-[#c9c8cc] disabled:shadow-none"
            >
              {pendingPoints > 0 ? '一键领取' : '已领取'}
            </button>

            {interactionClaims.map((claim) => {
              const claimed = claimedIds.includes(claim.id);
              return (
                <button
                  key={claim.id}
                  type="button"
                  aria-label={`领取${claim.label}${claim.amount}积分`}
                  onClick={() => claimOne(claim)}
                  disabled={claimed}
                  className="absolute z-30 flex h-[37px] w-[92px] items-center justify-center rounded-[11px] bg-gradient-to-b from-[#9e73f4] to-[#7952df] text-[13px] font-semibold text-white shadow-[0_5px_10px_rgba(112,78,211,0.18)] transition active:scale-95 disabled:bg-none disabled:bg-[#c9c8cc] disabled:text-white disabled:shadow-none"
                  style={{ left: claim.left, top: claim.top }}
                >
                  {claimed ? '已领取' : <><Coins size={14} className="mr-1 text-[#ffe06b]" strokeWidth={2.2} />{claim.amount}</>}
                </button>
              );
            })}

            {claimEffect && !claimEffect.burst && (
              <React.Fragment key={claimEffect.key}>
                <div
                  className="interaction-energy-orb pointer-events-none absolute z-40"
                  style={{
                    left: claimEffect.left,
                    top: claimEffect.top,
                    '--interaction-flight-x': `${196 - claimEffect.left}px`,
                    '--interaction-flight-y': `${205 - claimEffect.top}px`,
                  } as React.CSSProperties}
                >
                  <span className="interaction-energy-tail" />
                  <Star size={38} strokeWidth={1.5} className="relative text-[#ffd42a]" fill="currentColor" />
                </div>
              </React.Fragment>
            )}

            <button
              type="button"
              aria-label="返回首页"
              onClick={() => navigate('/')}
              className="absolute left-[16px] top-[53px] z-30 h-10 w-10 rounded-[12px]"
            />
            <button
              type="button"
              aria-label="查看积分明细"
              onClick={() => navigate('/points-orders')}
              className="absolute right-[16px] top-[53px] z-30 h-10 w-[69px] rounded-[12px]"
            />
            <button
              type="button"
              aria-label="查看互动积分规则"
              onClick={() => setShowRules(true)}
              className="absolute right-0 top-[181px] z-30 h-10 w-[57px] rounded-l-[12px]"
            />
          </div>
        </div>

        {claimEffect?.burst && (
          <div key={claimEffect.key} className="pointer-events-none absolute inset-0 z-[45] overflow-hidden" aria-hidden="true">
            <div className="interaction-mega-vignette absolute inset-0" />
            {megaStarParticles.map((particle) => (
              <span
                key={particle.id}
                className="interaction-star-swarm absolute left-0 top-0 flex items-center justify-center font-black"
                style={{
                  width: particle.size,
                  height: particle.size,
                  color: particle.color,
                  fontSize: particle.size,
                  animationDelay: `${particle.delay}ms`,
                  animationDuration: `${particle.duration}ms`,
                  '--interaction-star-start-x': `${particle.startX}px`,
                  '--interaction-star-start-y': `${particle.startY}px`,
                  '--interaction-star-curve-x': `${particle.curveX}px`,
                  '--interaction-star-curve-y': `${particle.curveY}px`,
                  '--interaction-star-rotation': `${particle.rotation}deg`,
                } as React.CSSProperties}
              >
                {particle.id % 3 === 0 ? '★' : '✦'}
              </span>
            ))}
            <div className="interaction-jar-mouth-glow absolute left-1/2 top-[150px] h-12 w-24 -translate-x-1/2 rounded-full" />
            <div className="interaction-shockwave absolute left-1/2 top-[205px] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-[#ffe16b]" />
            <div className="interaction-flash absolute inset-0" />
            <div className="score-claim-mega absolute left-1/2 top-[286px] z-[46] flex items-center gap-1 whitespace-nowrap rounded-full border border-white/90 bg-white/92 px-4 py-2 text-[20px] font-extrabold text-[#8056e5] shadow-[0_8px_24px_rgba(100,68,170,0.2)] backdrop-blur-sm">
              <Star size={22} className="text-[#ffc928]" fill="currentColor" />+{claimEffect.amount}
            </div>
          </div>
        )}

        {showRules && (
          <div className="absolute inset-0 z-50 flex items-end bg-black/55" onClick={() => setShowRules(false)}>
            <section
              className="max-h-[690px] w-full rounded-t-[30px] bg-white px-5 pb-7 pt-6 shadow-[0_-16px_40px_rgba(0,0,0,0.18)]"
              onClick={(event) => event.stopPropagation()}
            >
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
