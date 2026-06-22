import React, { useState } from 'react';
import { ChevronLeft, Coins, Ticket, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ModalOverlay,
  PrototypePhone,
  PrototypeStatusBar,
} from '@/components/subscription/PrototypeUI';
import { useDialogueStore } from '@/store/useDialogueStore';

const PolaroidCard = () => (
  <div className="relative mx-auto h-[230px] w-[220px]">
    <div className="absolute left-8 top-7 h-[154px] w-[126px] -rotate-6 rounded-[4px] bg-[#eee6d5] shadow-[0_12px_24px_rgba(67,52,29,0.12)]" />
    <div className="absolute left-14 top-5 h-[170px] w-[138px] rotate-6 rounded-[5px] bg-[#f7f0df] shadow-[0_14px_28px_rgba(67,52,29,0.16)]" />
    <div className="absolute left-10 top-1 h-[188px] w-[150px] rotate-3 rounded-[5px] bg-[#fff7e8] p-3 shadow-[0_18px_32px_rgba(67,52,29,0.18)]">
      <div className="h-[120px] rounded-[3px] bg-gradient-to-br from-[#fff9ea] to-[#d7c39f]" />
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[16px] font-bold text-[#8b66ef]">1 DAY</span>
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#d7c39f] text-[#c8aa72]">
          <Ticket size={12} />
        </span>
      </div>
    </div>
    <div className="absolute bottom-0 left-1/2 h-7 w-[170px] -translate-x-1/2 rounded-[50%] bg-black/10 blur-[12px]" />
  </div>
);

const DialogueShop: React.FC = () => {
  const navigate = useNavigate();
  const {
    points,
    dialogueCards,
    cardCost,
    exchangeCard,
    useCard: consumeDialogueCard,
  } = useDialogueStore();
  const [showExchange, setShowExchange] = useState(false);
  const [message, setMessage] = useState('');
  const enoughPoints = points >= cardCost;

  const confirmExchange = () => {
    if (!exchangeCard()) {
      setShowExchange(false);
      navigate('/points-store?returnTo=/dialogue-shop');
      return;
    }
    setShowExchange(false);
    setMessage('已兑换 1 张悄悄话卡');
    window.setTimeout(() => setMessage(''), 1800);
  };

  const handleUse = () => {
    if (!consumeDialogueCard()) {
      setMessage('还没有可用悄悄话卡，先兑换一张吧');
      window.setTimeout(() => setMessage(''), 1800);
      return;
    }
    setMessage('悄悄话时间已生效');
    window.setTimeout(() => navigate('/dialogue-mode'), 900);
  };

  return (
    <PrototypePhone>
      <PrototypeStatusBar />
      <div className="relative flex h-[62px] items-center px-4">
        <button
          type="button"
          aria-label="返回"
          onClick={() => navigate('/dialogue-mode')}
          className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#ececf0] bg-white text-[#19181f]"
        >
          <ChevronLeft size={25} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-medium text-[#19181f]">悄悄话商店</h1>
        <div className="ml-auto flex h-8 items-center rounded-full bg-[#f0eff2] px-3 text-[13px] font-semibold text-[#2c2930]">
          <Coins size={15} className="mr-1 text-[#f3b12f]" />
          {points}
        </div>
      </div>

      <div className="px-5 pt-3">
        <section className="relative h-[472px] overflow-hidden rounded-[24px] bg-gradient-to-b from-[#39304f] to-[#8b66ef] px-5 pt-5 text-white">
          <span className="absolute -left-8 top-[-20px] text-[150px] font-black leading-none text-white/10">1</span>
          <div className="relative z-10">
            <p className="text-[12px] text-white/72">悄悄话卡</p>
            <h2 className="mt-1 text-[24px] font-semibold">1 天悄悄话时间</h2>
            <p className="mt-2 text-[12px] leading-5 text-white/70">
              每日免费聊天结束后，悄悄话卡会自动接上。
            </p>
          </div>
          <div className="mt-9">
            <PolaroidCard />
          </div>
        </section>

        <section className="mt-[-34px] rounded-[24px] bg-white px-5 pb-5 pt-7 shadow-[0_16px_38px_rgba(47,39,68,0.12)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[20px] font-semibold text-[#222127]">1天悄悄话卡</h2>
              <p className="mt-1 text-[12px] leading-5 text-[#8b8792]">
                免费聊天结束后，使用它继续和 Ropet 说悄悄话。
              </p>
            </div>
            <span className="rounded-full bg-[#f5f3f7] px-3 py-1 text-[11px] font-semibold text-[#8b8792]">
              拥有 {dialogueCards}
            </span>
          </div>
          <div className="mt-5 flex items-center text-[28px] font-semibold text-[#222127]">
            <Coins size={22} className="mr-2 text-[#f3b12f]" />
            {cardCost}
          </div>

          {message && (
            <div className="mt-4 rounded-[14px] bg-[#f0ecff] px-3 py-2 text-center text-[12px] font-semibold text-[#7554da]">
              {message}
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-label="积分兑换"
              onClick={() => setShowExchange(true)}
              className="h-12 rounded-[14px] border border-[#e4e0e8] bg-white text-[14px] font-semibold text-[#302b37]"
            >
              积分兑换
            </button>
            <button
              type="button"
              aria-label="使用悄悄话卡"
              onClick={handleUse}
              className="h-12 rounded-[14px] bg-[#8b66ef] text-[14px] font-semibold text-white"
            >
              使用
            </button>
          </div>
        </section>
      </div>

      {showExchange && (
        <ModalOverlay>
          <div className="w-full rounded-[18px] bg-white px-6 pb-6 pt-5 text-center">
            <button
              type="button"
              aria-label="关闭"
              onClick={() => setShowExchange(false)}
              className="absolute right-10 top-[196px] flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#222127]"
            >
              <X size={20} />
            </button>
            <h2 className="text-[18px] font-semibold text-[#222127]">积分兑换</h2>
            <p className="mt-3 text-[14px] leading-6 text-[#4d4952]">
              每 {cardCost} 积分可兑换一张 1天悄悄话卡，当前剩余积分 {points}。
            </p>
            <div className="mt-4 flex items-center justify-center text-[15px] font-semibold text-[#222127]">
              <Coins size={18} className="mr-2 text-[#f3b12f]" />
              {cardCost}
              <span className="mx-2 text-[#aaa6af]">=</span>
              <Ticket size={18} className="mr-1 text-[#8b66ef]" />
              1
            </div>
            {!enoughPoints && (
              <p className="mt-3 text-[12px] text-[#d66b48]">积分不足，可以先去积分商城补充。</p>
            )}
            <button
              type="button"
              aria-label={enoughPoints ? '确定兑换' : '去购买积分'}
              onClick={confirmExchange}
              className="mt-6 h-12 w-full rounded-[13px] bg-[#8b66ef] text-[14px] font-semibold text-white"
            >
              {enoughPoints ? '确定兑换' : '去购买积分'}
            </button>
            <button
              type="button"
              onClick={() => setShowExchange(false)}
              className="mt-3 h-11 w-full rounded-[13px] border border-[#e4e0e8] text-[14px] font-semibold text-[#302b37]"
            >
              取消
            </button>
          </div>
        </ModalOverlay>
      )}
    </PrototypePhone>
  );
};

export default DialogueShop;
