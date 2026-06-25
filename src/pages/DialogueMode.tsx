import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Megaphone, Sparkles, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrototypePhone, PrototypeStatusBar } from '@/components/subscription/PrototypeUI';
import { usePetStore } from '@/store/usePetStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';

const dialogueModeStyles = `
.dm-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #c9b7ff 0%, #f2edff 20%, #ffffff 52%);
}
.dm-header {
  position: relative;
  z-index: 2;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dm-back {
  position: absolute;
  left: 16px;
  top: 8px;
  width: 40px;
  height: 40px;
  border-radius: 16px;
  border: 1px solid #cfc5e7;
  background: rgba(255, 255, 255, 0.2);
  color: #222127;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dm-title {
  font-size: 27px;
  line-height: 38px;
  font-weight: 800;
  color: #26232a;
}
.dm-main {
  position: relative;
  z-index: 1;
  padding: 0 16px;
}
.dm-exchange {
  position: relative;
  z-index: 2;
  width: 353px;
  height: 72px;
  margin: 0 auto;
  border-radius: 20px;
  background: #fff49f;
  box-shadow: 0 12px 18px rgba(178, 151, 64, 0.24);
  display: flex;
  align-items: center;
  padding: 0 20px;
}
.dm-megaphone {
  position: relative;
  width: 52px;
  height: 52px;
  flex: 0 0 auto;
  margin-right: 16px;
  color: #8b66ef;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dm-megaphone-bg {
  position: absolute;
  inset: 4px;
  border-radius: 14px;
  background: #ff8eb5;
  transform: rotate(-20deg);
}
.dm-exchange h2 {
  margin: 0;
  font-size: 19px;
  line-height: 27px;
  font-weight: 800;
  color: #3c3842;
}
.dm-exchange p {
  margin: 2px 0 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #8f897c;
}
.dm-exchange-link {
  margin-left: auto;
  border: 0;
  background: transparent;
  color: #8b66ef;
  font-size: 18px;
  line-height: 24px;
  font-weight: 800;
}
.dm-exchange-link:disabled {
  color: #aaa6af;
}
.dm-panel {
  position: relative;
  width: 361px;
  height: 581px;
  margin: 15px auto 0;
  border-radius: 24px;
  background: #cbb8ff;
  padding: 16px 12px 20px;
  overflow: hidden;
  box-shadow: inset 0 0 18px rgba(139, 102, 239, 0.2);
}
.dm-strap {
  position: absolute;
  top: -44px;
  width: 14px;
  height: 56px;
  border-radius: 999px;
  background: rgba(169, 135, 255, 0.5);
}
.dm-star {
  position: absolute;
  right: -2px;
  top: -15px;
  width: 43px;
  height: 43px;
  color: #ffd866;
  transform: rotate(-10deg);
  filter: drop-shadow(0 3px 0 rgba(221, 176, 59, 0.35));
}
.dm-card {
  border-radius: 20px;
  background: #fbfaff;
  padding: 18px 16px 14px;
}
.dm-card + .dm-card {
  margin-top: 16px;
  padding-bottom: 34px;
}
.dm-card-title {
  margin: 0;
  font-size: 22px;
  line-height: 31px;
  font-weight: 800;
  color: #353139;
}
.dm-card-copy {
  margin: 9px 0 0;
  font-size: 16px;
  line-height: 29px;
  font-weight: 500;
  color: #8c8990;
}
.dm-switch {
  margin: 12px 6px 0 auto;
  width: 78px;
  height: 36px;
  border: 0;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px;
  color: white;
  font-size: 15px;
  font-weight: 800;
}
.dm-switch.is-on {
  background: #8b66ef;
  justify-content: flex-end;
}
.dm-switch.is-off {
  background: #d9d9de;
  justify-content: flex-start;
}
.dm-switch-knob {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: #ffffff;
  color: #aaa6af;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dm-battery {
  position: relative;
  height: 68px;
  margin-top: 20px;
}
.dm-battery-shell {
  position: absolute;
  left: 0;
  top: 0;
  width: 294px;
  height: 68px;
  border: 7px solid #a5a5aa;
  border-radius: 20px;
  background: #fbfaff;
  padding: 4px;
}
.dm-battery-inner {
  height: 100%;
  display: flex;
  overflow: hidden;
  border-radius: 10px;
}
.dm-energy-fill {
  width: 45%;
  background: #9272e8;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 900;
}
.dm-free-fill {
  width: 48px;
  border-radius: 0 6px 6px 0;
  background: #ff91b3;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
}
.dm-battery-cap {
  position: absolute;
  left: 292px;
  top: 13px;
  width: 18px;
  height: 43px;
  border-radius: 0 13px 13px 0;
  background: #a5a5aa;
}
.dm-guide {
  position: absolute;
  right: 20px;
  bottom: 121px;
  width: 210px;
  height: 48px;
  border: 0;
  border-radius: 24px;
  background: #ffffff;
  color: #77727f;
  box-shadow: 0 12px 15px rgba(79, 67, 98, 0.22);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px 0 16px;
  font-size: 15px;
  font-weight: 800;
}
.dm-guide-icon {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #8b66ef;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}
.dm-hero {
  position: absolute;
  bottom: -2px;
  left: 21px;
  width: 193px;
  height: 155px;
  object-fit: contain;
  object-position: bottom;
}
.dm-home-indicator {
  position: absolute;
  left: 50%;
  bottom: 12px;
  width: 134px;
  height: 5px;
  border-radius: 999px;
  background: #111111;
  transform: translateX(-50%);
}
`;

const DialogueMode: React.FC = () => {
  const navigate = useNavigate();
  const [showTutorialFlow, setShowTutorialFlow] = useState(false);
  const { pet } = usePetStore();
  const deviceName = pet?.name || '肉派派';
  const { dialogueEnabled, minorModeEnabled, setDialogueEnabled } = useSubscriptionStore();

  return (
    <PrototypePhone className="bg-white">
      <style>{dialogueModeStyles}</style>
      <div className="dm-bg" />
      <PrototypeStatusBar />

      <header className="dm-header">
        <button type="button" aria-label="返回" onClick={() => navigate('/')} className="dm-back">
          <ArrowLeft size={29} strokeWidth={2.6} />
        </button>
        <h1 className="dm-title">悄悄话模式</h1>
      </header>

      <main className="dm-main">
        <section className="dm-exchange">
          <div className="dm-megaphone">
            <div className="dm-megaphone-bg" />
            <Megaphone size={42} className="relative rotate-[-20deg]" fill="#ff9abb" strokeWidth={1.8} />
            <span className="absolute right-0 top-1 h-2 w-2 rounded-full bg-[#ffbb5f]" />
            <span className="absolute right-[-5px] top-5 h-1.5 w-1.5 rounded-full bg-[#ffbb5f]" />
          </div>
          <div>
            <h2>兑换「心声能量」</h2>
            <p>可以通过积分兑换</p>
          </div>
          <button
            type="button"
            disabled={minorModeEnabled}
            onClick={() => navigate('/dialogue-shop')}
            className="dm-exchange-link"
          >
            {minorModeEnabled ? '暂不可用' : '去兑换>'}
          </button>
        </section>

        <section className="dm-panel">
          <div className="dm-strap" style={{ left: 55 }} />
          <div className="dm-strap" style={{ right: 56 }} />
          <div className="dm-star">
            <Star size={38} fill="currentColor" strokeWidth={1.6} />
          </div>

          <section className="dm-card">
            <h2 className="dm-card-title">{dialogueEnabled ? '悄悄话模式已开启' : '悄悄话模式未开启'}</h2>
            <p className="dm-card-copy">
              靠近{deviceName}，面对着它，和它随便聊点什么吧。听到你的声音后，悄悄话就会开启，并消耗心声能量。
            </p>
            <button
              type="button"
              aria-label={dialogueEnabled ? '关闭悄悄话模式' : '开启悄悄话模式'}
              disabled={minorModeEnabled}
              onClick={() => setDialogueEnabled(!dialogueEnabled)}
              className={`dm-switch ${dialogueEnabled ? 'is-on' : 'is-off'}`}
            >
              <span className="dm-switch-knob">
                <Sparkles size={22} fill="currentColor" strokeWidth={1.8} />
              </span>
              {dialogueEnabled ? 'ON' : 'OFF'}
            </button>
          </section>

          <section className="dm-card">
            <h2 className="dm-card-title">心声能量</h2>
            <p className="dm-card-copy">能量越多{deviceName}能跟你聊的时间越长哦～</p>
            <div className="dm-battery">
              <div className="dm-battery-shell">
                <div className="dm-battery-inner">
                  <div className="dm-energy-fill">45%</div>
                  <div className="dm-free-fill">免费</div>
                </div>
              </div>
              <div className="dm-battery-cap" />
            </div>
          </section>

          <button type="button" onClick={() => setShowTutorialFlow(true)} className="dm-guide">
            怎么和{deviceName}说悄悄话？
            <span className="dm-guide-icon">
              <ChevronRight size={22} strokeWidth={3} />
            </span>
          </button>

          <img src="/images/dialogue-consent-hero.png" alt="" aria-hidden="true" className="dm-hero" />
        </section>
      </main>

      <div className="dm-home-indicator" />

      {showTutorialFlow && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white text-left">
          <PrototypeStatusBar />
          <div className="relative flex h-[56px] items-center justify-center">
            <button
              type="button"
              aria-label="关闭新手教程"
              onClick={() => setShowTutorialFlow(false)}
              className="absolute left-[19px] top-[6px] flex h-10 w-10 items-center justify-center text-[#222127]"
            >
              <X size={26} strokeWidth={2.2} />
            </button>
            <h2 className="text-[17px] font-bold text-[#222127]">怎么和{deviceName}说悄悄话？</h2>
          </div>

          <img
            src="/images/dialogue-tutorial-panels.png"
            alt=""
            aria-hidden="true"
            className="mx-auto mt-[6px] h-[202px] w-[379px] object-cover"
          />

          <div className="px-[21px] pt-[26px]">
            {[
              {
                title: '01. 在App打开「悄悄话模式」开关',
                body: `打开开关，为${deviceName}带上悄悄话项圈，${deviceName}才能和你用人类的语言沟通哦。`,
              },
              {
                title: `02. 面对${deviceName}，随便和它聊聊`,
                body: `和${deviceName}随便聊聊，好好的感受彼此的心意吧❤️`,
              },
              {
                title: '03.「悄悄话项圈」每天都会刷新免费的「心声能量」',
                body: '每天8：00刷新免费的心声能量。能量耗尽后，可以去小窝使用积分兑换额外的心声能量哦👌',
              },
              {
                title: '04.如何退出「悄悄话模式」？',
                body: `和${deviceName}说“不聊啦”或从App关闭「悄悄话模式」开关，可暂停消耗「心声能量」。积分兑换的「心声能量」可保留，不会每日刷新。`,
              },
            ].map((item, index) => (
              <section key={item.title} className={index === 0 ? '' : 'mt-[25px]'}>
                <h3 className="inline bg-[#e9fb37] box-decoration-clone px-0.5 text-[17px] font-black leading-[28px] text-[#222127]">
                  {item.title}
                </h3>
                <p className="mt-[13px] text-[13px] font-medium leading-[26px] text-[#6d6973]">{item.body}</p>
              </section>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setShowTutorialFlow(false);
              if (!minorModeEnabled) {
                setDialogueEnabled(true);
              }
            }}
            className="mx-auto mt-auto mb-[73px] flex h-[47px] w-[236px] items-center justify-center rounded-[14px] bg-[#8b66ef] text-[14px] font-semibold text-white shadow-[0_10px_22px_rgba(128,87,223,0.18)]"
          >
            知道啦
          </button>
          <div className="absolute bottom-[11px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[#111111]" />
        </div>
      )}
    </PrototypePhone>
  );
};

export default DialogueMode;
