import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Megaphone, Sparkles, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrototypePhone, PrototypeStatusBar } from '@/components/subscription/PrototypeUI';
import { useDialogueStore } from '@/store/useDialogueStore';
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
  height: 744px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 16px 64px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.dm-main::-webkit-scrollbar {
  display: none;
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
  min-height: 581px;
  margin: 15px auto 0;
  border-radius: 24px;
  background: #cbb8ff;
  padding: 16px 12px 0;
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
  padding-bottom: 18px;
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
  margin-top: 16px;
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
  background: #9272e8;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 900;
}
.dm-energy-fill.is-free {
  background: #f596b9;
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
.dm-battery-packs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 12px;
}
.dm-battery-pack {
  position: relative;
  height: 40px;
  border: 0;
  border-radius: 9px;
  background: #d9d9d9;
  color: #8d8a91;
  font-size: 22px;
  line-height: 40px;
  font-weight: 500;
  box-shadow: inset -5px 0 0 rgba(166, 166, 166, 0.6);
}
.dm-battery-pack::after {
  content: '';
  position: absolute;
  right: -5px;
  top: 8px;
  width: 6px;
  height: 24px;
  border-radius: 0 7px 7px 0;
  background: #c4c4c4;
}
.dm-battery-pack.is-full {
  background: #9272e8;
  color: #ffffff;
  font-size: 16px;
  font-weight: 900;
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.46), inset -5px 0 0 rgba(112, 82, 205, 0.55);
}
.dm-battery-stock {
  margin: 10px 0 0;
  color: #8c8990;
  font-size: 12px;
  line-height: 18px;
  font-weight: 600;
}
.dm-battery-toast {
  position: absolute;
  left: 50%;
  top: 374px;
  z-index: 8;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgba(39, 35, 45, 0.9);
  padding: 7px 12px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
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
  position: relative;
  width: 210px;
  height: 48px;
  margin: 28px 20px 0 auto;
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
  position: relative;
  display: block;
  left: 21px;
  width: 193px;
  height: 155px;
  margin-top: 8px;
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
.dm-confirm-mask {
  position: absolute;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 31px;
  background: rgba(25, 24, 31, 0.58);
}
.dm-confirm {
  width: 100%;
  border-radius: 14px;
  background: #ffffff;
  padding: 25px 23px 26px;
  text-align: center;
  box-shadow: 0 18px 42px rgba(42, 34, 58, 0.24);
}
.dm-confirm h3 {
  margin: 0;
  color: #222222;
  font-size: 16px;
  line-height: 22px;
  font-weight: 700;
}
.dm-confirm p {
  margin: 13px auto 0;
  max-width: 236px;
  color: #4d4952;
  font-size: 14px;
  line-height: 26px;
  font-weight: 500;
  text-align: center;
}
.dm-confirm-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 13px;
  margin-top: 25px;
}
.dm-confirm-actions button {
  height: 44px;
  border: 0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
}
.dm-confirm-cancel {
  border: 1px solid #e4e1e6 !important;
  background: #ffffff;
  color: #222222;
}
.dm-confirm-primary {
  background: #8b66ef;
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(139, 102, 239, 0.2);
}
`;

const DialogueMode: React.FC = () => {
  const navigate = useNavigate();
  const [showTutorialFlow, setShowTutorialFlow] = useState(false);
  const [batteryConfirm, setBatteryConfirm] = useState<'add' | 'buy' | null>(null);
  const [batteryToast, setBatteryToast] = useState('');
  const { pet } = usePetStore();
  const deviceName = pet?.name || '肉派派';
  const { dialogueEnabled, minorModeEnabled, setDialogueEnabled } = useSubscriptionStore();
  const {
    dialogueCards: itemBatteryCount,
    dialogueCardInventory,
    placedVoiceBatteries,
    addVoiceBatteryToSlot,
  } = useDialogueStore();
  const availableBatteryCount = Math.max(dialogueCardInventory?.[1] ?? 0, itemBatteryCount);
  const hasLoadedBattery = placedVoiceBatteries > 0;
  const activeBatteryLabel = hasLoadedBattery ? '100%' : '免费';

  const showBatteryToast = (message: string) => {
    setBatteryToast(message);
    window.setTimeout(() => setBatteryToast(''), 1600);
  };

  const openBatterySlot = () => {
    if (minorModeEnabled) return;
    if (placedVoiceBatteries >= 4) return;
    if (availableBatteryCount <= 0) {
      setBatteryConfirm('buy');
      return;
    }
    setBatteryConfirm('add');
  };

  const confirmBatteryAction = () => {
    if (!batteryConfirm) return;
    if (batteryConfirm === 'buy') {
      setBatteryConfirm(null);
      navigate('/nest?item=dialogue-card&card=1');
      return;
    }
    if (!addVoiceBatteryToSlot()) {
      setBatteryConfirm('buy');
      return;
    }
    setBatteryConfirm(null);
    showBatteryToast('已添加项环电池');
  };

  return (
    <PrototypePhone className="bg-white">
      <style>{dialogueModeStyles}</style>
      <div className="dm-bg" />
      <PrototypeStatusBar />

      <header className="dm-header">
        <button type="button" aria-label="返回" onClick={() => navigate('/')} className="dm-back">
          <ArrowLeft size={29} strokeWidth={2.6} />
        </button>
        <h1 className="dm-title">{deviceName}变声</h1>
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
            <h2>购买「项环电池」</h2>
            <p>可以通过积分购买</p>
          </div>
          <button
            type="button"
            disabled={minorModeEnabled}
            onClick={() => navigate('/nest?item=dialogue-card&card=1')}
            className="dm-exchange-link"
          >
            {minorModeEnabled ? '暂不可用' : '去购买>'}
          </button>
        </section>

        <section className="dm-panel">
          <div className="dm-strap" style={{ left: 55 }} />
          <div className="dm-strap" style={{ right: 56 }} />
          <div className="dm-star">
            <Star size={38} fill="currentColor" strokeWidth={1.6} />
          </div>

          <section className="dm-card">
            <h2 className="dm-card-title">{dialogueEnabled ? '智能项环开关已开启' : '智能项环开关未开启'}</h2>
            <p className="dm-card-copy">
              靠近{deviceName}，面对着它，和它随便聊点什么吧。听到你的声音后，变声模式就会开启，并消耗今日项环电量。
            </p>
            <button
              type="button"
              aria-label={dialogueEnabled ? '关闭智能项环开关' : '开启智能项环开关'}
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
            <h2 className="dm-card-title">今日项环电量</h2>
            <p className="dm-card-copy">项环的电量越多{deviceName}能跟你聊的时间越长哦～最多一次加 4 块项环电池。</p>
            <div className="dm-battery">
              <div className="dm-battery-shell">
                <div className="dm-battery-inner">
                  <div
                    className={`dm-energy-fill ${hasLoadedBattery ? '' : 'is-free'}`}
                    style={{ width: '100%' }}
                  >
                    {activeBatteryLabel}
                  </div>
                </div>
              </div>
              <div className="dm-battery-cap" />
            </div>
            <div className="dm-battery-packs" aria-label="项环电池槽">
              {Array.from({ length: 4 }).map((_, index) => {
                const hasBattery = index >= 4 - placedVoiceBatteries;

                return (
                  <button
                    key={index}
                    type="button"
                    aria-label={hasBattery ? '已添加项环电池' : '添加项环电池'}
                    disabled={minorModeEnabled}
                    onClick={hasBattery ? undefined : openBatterySlot}
                    className={`dm-battery-pack ${hasBattery ? 'is-full' : ''}`}
                  >
                    {hasBattery ? '100%' : '+'}
                  </button>
                );
              })}
            </div>
            <p className="dm-battery-stock">当前剩余电池数：{availableBatteryCount} 块</p>
          </section>

          {batteryToast && <div className="dm-battery-toast">{batteryToast}</div>}

          <button type="button" onClick={() => setShowTutorialFlow(true)} className="dm-guide">
            怎么让{deviceName}变声？
            <span className="dm-guide-icon">
              <ChevronRight size={22} strokeWidth={3} />
            </span>
          </button>

          <img src="/images/dialogue-consent-hero.png" alt="" aria-hidden="true" className="dm-hero" />
        </section>
      </main>

      <div className="dm-home-indicator" />

      {batteryConfirm && (
        <div className="dm-confirm-mask" onClick={() => setBatteryConfirm(null)}>
          <section className="dm-confirm" onClick={(event) => event.stopPropagation()}>
            <h3>{batteryConfirm === 'add' ? '是否要添加一块电池' : '暂无电池'}</h3>
            <p>
              {batteryConfirm === 'add'
                ? `当前剩余电池数 ${availableBatteryCount} 块`
                : '当前剩余电池数 0 块，是否去购买新的电池？'}
            </p>
            <div className="dm-confirm-actions">
              <button type="button" className="dm-confirm-primary" onClick={confirmBatteryAction}>
                {batteryConfirm === 'add' ? '确定' : '去购买'}
              </button>
              <button type="button" className="dm-confirm-cancel" onClick={() => setBatteryConfirm(null)}>
                取消
              </button>
            </div>
          </section>
        </div>
      )}

      {showTutorialFlow && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white text-left">
          <PrototypeStatusBar />
          <div className="relative flex h-[56px] items-center justify-center">
            <button
              type="button"
              aria-label="关闭说明"
              onClick={() => setShowTutorialFlow(false)}
              className="absolute left-[19px] top-[6px] flex h-10 w-10 items-center justify-center text-[#222127]"
            >
              <X size={26} strokeWidth={2.2} />
            </button>
            <h2 className="text-[17px] font-bold text-[#222127]">怎么让{deviceName}变声？</h2>
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
                title: '01. 在App打开「智能项环」开关',
                body: `打开开关，为${deviceName}带上智能项环，${deviceName}才能开启变声和你沟通哦。`,
              },
              {
                title: `02. 面对${deviceName}，随便和它聊聊`,
                body: `和${deviceName}随便聊聊，好好的感受彼此的心意吧❤️`,
              },
              {
                title: '03.「智能项环」每天都会刷新免费的「项环电量」',
                body: '每天0：00刷新免费的 5 分钟项环电量。电量耗尽后，可以点击空电池位添加已有的项环电池，最多一次加 4 块；没有库存时再去购买哦👌',
              },
              {
                title: '04.如何退出「变声模式」？',
                body: `和${deviceName}说“不聊啦”或从App关闭「智能项环」开关，可暂停消耗「项环电量」。积分兑换的「项环电池」可保留，不会每日刷新。`,
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
