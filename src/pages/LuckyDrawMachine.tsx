import React, { useState } from 'react';
import { CreditCard, Sparkles, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { useDialogueStore } from '@/store/useDialogueStore';
import { usePetStore } from '@/store/usePetStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';

const pointProducts = [
  { points: 1000, price: 6, stars: 1 },
  { points: 10000, price: 25, stars: 2 },
  { points: 100000, price: 289, stars: 4 },
  { points: 1000000, price: 800, stars: 5 },
];

const paymentChannels = [
  { id: 'appstore', label: 'App Store', desc: '模拟 Apple 内购确认' },
  { id: 'alipay', label: '支付宝', desc: '模拟支付宝支付成功' },
  { id: 'googleplay', label: 'Google Play', desc: '模拟 Google Play 付款' },
  { id: 'paypal', label: 'PayPal', desc: '模拟 PayPal 付款' },
];

const paymentChannelStyles = {
  appstore: { mark: 'A', bg: 'bg-[#f4f4f5]', fg: 'text-[#222127]', accent: 'bg-[#222127]' },
  alipay: { mark: '支', bg: 'bg-[#e9f3ff]', fg: 'text-[#1677ff]', accent: 'bg-[#1677ff]' },
  googleplay: { mark: 'G', bg: 'bg-[#e9f7ef]', fg: 'text-[#18a957]', accent: 'bg-[#18a957]' },
  paypal: { mark: 'P', bg: 'bg-[#edf3ff]', fg: 'text-[#003087]', accent: 'bg-[#003087]' },
};

const StarPile: React.FC<{ count: number }> = ({ count }) => (
  <div className="relative mx-auto h-[92px] w-[116px]">
    {Array.from({ length: Math.min(count, 5) }).map((_, index) => (
      <Star
        key={index}
        size={index < 2 ? 48 : 40}
        fill="#ffd92e"
        className="absolute text-[#ffd92e] drop-shadow-[0_8px_8px_rgba(227,171,31,0.18)]"
        style={{
          left: `${18 + (index % 3) * 24}px`,
          top: `${18 + Math.floor(index / 3) * 26}px`,
          transform: `rotate(${[-16, 12, -4, 18, -12][index]}deg)`,
        }}
      />
    ))}
  </div>
);

const LuckyDrawMachine: React.FC = () => {
  const navigate = useNavigate();
  const { pet } = usePetStore();
  const deviceName = pet?.name || '肉派派';
  const { points, purchasePoints } = useDialogueStore();
  const { minorModeEnabled } = useSubscriptionStore();
  const [showChannels, setShowChannels] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [payingProduct, setPayingProduct] = useState<typeof pointProducts[number] | null>(null);
  const [paymentChannel, setPaymentChannel] = useState<typeof paymentChannels[number] | null>(null);
  const [message, setMessage] = useState('');

  const closePayment = () => {
    setPaymentChannel(null);
    setPayingProduct(null);
  };

  const confirmPay = () => {
    if (!payingProduct || !paymentChannel || minorModeEnabled) return;
    purchasePoints(payingProduct.points, payingProduct.price, deviceName, paymentChannel.label);
    setMessage(`${paymentChannel.label}支付成功，已返回积分商城`);
    navigate('/points-store?returnTo=/interaction-history', { replace: true });
    setPaymentChannel(null);
    setPayingProduct(null);
    window.setTimeout(() => setMessage(''), 1800);
  };

  return (
    <div className="relative flex min-h-screen w-full justify-center overflow-hidden bg-[#d8deea] py-4">
      <div className="relative h-[852px] w-[393px] overflow-hidden rounded-[28px] border border-white/70 bg-[#ffe49f] shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        <img
          src="/images/lucky-draw-machine-reference.jpg"
          className="absolute inset-0 h-full w-full object-cover"
          alt="抽奖机界面"
        />

        {!minorModeEnabled && (
          <button
            type="button"
            aria-label="获取更多积分"
            onClick={() => navigate('/points-store?returnTo=/interaction-history')}
            className="absolute left-[145px] top-[63px] z-30 flex h-[42px] w-[118px] items-center justify-end rounded-full pr-1"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#8b66ef] text-[18px] font-bold leading-none text-white shadow-[0_4px_10px_rgba(86,56,168,0.25)]">
              +
            </span>
          </button>
        )}

        <BottomNav />

        {showChannels && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/55">
            <div className="w-full rounded-t-[28px] bg-white px-5 pb-8 pt-4">
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#dedce2]" />
              <h2 className="text-[20px] font-semibold text-[#19181f]">获取更多积分</h2>
              <p className="mt-1 text-[12px] text-[#8b8792]">积分可用于抽奖和兑换部分道具。</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  aria-label="和 Ropet 互动获取积分"
                  onClick={() => navigate('/pet-interact')}
                  className="min-h-[112px] rounded-[18px] bg-[#f5f1ff] px-4 py-4 text-left"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#8b66ef] text-white">
                    <Sparkles size={20} />
                  </span>
                  <strong className="mt-4 block text-[15px] text-[#27232d]">和 Ropet 互动</strong>
                  <span className="mt-1 block text-[11px] leading-4 text-[#8b8792]">互动、照顾、完成任务获得积分</span>
                </button>
                {!minorModeEnabled && (
                  <button
                    type="button"
                    aria-label="充值购买积分"
                    onClick={() => {
                      setShowChannels(false);
                      setShowRecharge(true);
                    }}
                    className="min-h-[112px] rounded-[18px] bg-[#fff7d7] px-4 py-4 text-left"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#ffd948] text-white">
                      <CreditCard size={20} />
                    </span>
                    <strong className="mt-4 block text-[15px] text-[#27232d]">充值购买</strong>
                    <span className="mt-1 block text-[11px] leading-4 text-[#8b8792]">快速补充积分，继续抽奖</span>
                  </button>
                )}
              </div>
              <button
                type="button"
                aria-label="取消"
                onClick={() => setShowChannels(false)}
                className="mt-4 h-11 w-full text-[14px] text-[#8b8792]"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {showRecharge && (
          <div className="absolute inset-0 z-50 bg-[#fbf9ff]">
            <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_center,#eee9ff_0_8px,transparent_9px)] [background-size:44px_44px]" />
            <div className="relative z-10 flex h-11 items-center justify-between px-7 pt-2 text-[#19181f]">
              <span className="text-[15px] font-semibold">9:41</span>
              <div className="flex items-center gap-[6px]">
                <div className="flex items-end gap-[2px]">
                  {[6, 9, 12, 15].map((height) => (
                    <span key={height} className="w-[3px] rounded-full bg-current" style={{ height }} />
                  ))}
                </div>
                <div className="h-[12px] w-[18px] rounded-t-full border-[3px] border-current border-b-0" />
                <div className="h-[13px] w-[25px] rounded-[4px] border-2 border-current">
                  <div className="m-[2px] h-[5px] rounded-[1px] bg-current" />
                </div>
              </div>
            </div>
            <div className="relative z-10 flex h-[62px] items-center px-4">
              <button
                type="button"
                aria-label="关闭积分商城"
                onClick={() => setShowRecharge(false)}
                className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#ececf0] bg-white text-[#19181f]"
              >
                <X size={26} />
              </button>
              <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold text-[#19181f]">积分商城</h1>
            </div>

            <section className="relative z-10 pt-4 text-center">
              <div className="mx-auto flex h-[96px] w-[96px] items-center justify-center">
                <Star size={74} className="text-[#ffd92e] drop-shadow-[0_10px_12px_rgba(222,165,21,0.22)]" fill="#ffd92e" />
              </div>
              <p className="mt-4 text-[13px] text-[#a09aa8]">累计剩余积分</p>
              <h2 className="mt-1 text-[32px] font-bold text-[#8b66ef]">{points}</h2>
            </section>

            <section className="relative z-10 mx-5 mt-7 rounded-[18px] bg-[#cbbdff] px-5 pb-5 pt-4">
              <h2 className="text-[18px] font-semibold text-[#4b3b7c]">积分特惠</h2>
              <div className="mt-5 grid grid-cols-2 gap-5">
                {pointProducts.map((item) => (
                  <button
                    key={item.points}
                    type="button"
                    aria-label={`购买 ${item.points} 积分`}
                    disabled={minorModeEnabled}
                    onClick={() => setPayingProduct(item)}
                    className={`rounded-[10px] bg-white px-3 pb-5 pt-5 text-center shadow-[0_8px_20px_rgba(68,52,116,0.10)] ${
                      minorModeEnabled ? 'opacity-45 grayscale' : ''
                    }`}
                  >
                    <StarPile count={item.stars} />
                    <div className="mt-1 flex items-center justify-center text-[16px] font-medium text-[#27232d]">
                      <Star size={18} className="mr-1 text-[#ffd943]" fill="#ffd943" />
                      {item.points}
                    </div>
                    <span className="mt-4 inline-flex h-10 min-w-[96px] items-center justify-center rounded-[9px] bg-[#8b66ef] text-[17px] font-semibold text-white">
                      ￥{item.price}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <div className="absolute bottom-4 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black" />
          </div>
        )}

        {payingProduct && (
          <div className="absolute inset-0 z-[60] flex items-end justify-center bg-black/55">
            <div className="w-full rounded-t-[26px] bg-white px-5 pb-6 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-semibold text-[#222127]">
                  {paymentChannel ? `${paymentChannel.label}付款` : '选择支付渠道'}
                </h2>
                <button
                  type="button"
                  aria-label="关闭支付"
                  onClick={closePayment}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f3f5]"
                >
                  <X size={22} />
                </button>
              </div>
              {!paymentChannel ? (
                <>
                  <div className="mt-4 rounded-[18px] bg-white p-4 shadow-[0_8px_28px_rgba(40,36,54,0.12)]">
                    <p className="text-[14px] font-semibold text-[#222127]">{payingProduct.points} 积分</p>
                    <div className="mt-4 border-t border-[#efedf2] pt-4">
                      <div className="text-[18px] font-semibold text-[#222127]">￥{payingProduct.price}.00</div>
                      <div className="mt-1 text-[11px] text-[#aaa6af]">一次性费用</div>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {paymentChannels.map((channel) => {
                      const style = paymentChannelStyles[channel.id as keyof typeof paymentChannelStyles];

                      return (
                        <button
                          key={channel.id}
                          type="button"
                          aria-label={`选择${channel.label}`}
                          onClick={() => setPaymentChannel(channel)}
                          className="min-h-[64px] rounded-[16px] border border-[#eee9f8] bg-[#fbf9ff] px-3 py-3 text-left shadow-[0_8px_18px_rgba(64,48,104,0.06)]"
                        >
                          <span className={`mr-2 inline-flex h-8 w-8 items-center justify-center rounded-[9px] text-[16px] font-bold ${style.bg} ${style.fg}`}>
                            {style.mark}
                          </span>
                          <span className="align-middle text-[14px] font-semibold text-[#26232a]">{channel.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  {(() => {
                    const style = paymentChannelStyles[paymentChannel.id as keyof typeof paymentChannelStyles];

                    return (
                      <div className="mt-4 rounded-[22px] bg-[#f7f7fa] p-4">
                        <div className="flex items-center">
                          <span className={`flex h-12 w-12 items-center justify-center rounded-[14px] text-[22px] font-bold ${style.bg} ${style.fg}`}>
                            {style.mark}
                          </span>
                          <div className="ml-3">
                            <p className="text-[16px] font-semibold text-[#222127]">{paymentChannel.label}</p>
                            <p className="mt-0.5 text-[11px] text-[#8b8792]">正在通过{paymentChannel.label}完成付款</p>
                          </div>
                        </div>
                        <div className="mt-4 rounded-[16px] bg-white p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-[#8b8792]">商品</span>
                            <span className="text-[14px] font-semibold text-[#26232a]">{payingProduct.points} 积分</span>
                          </div>
                          <div className="mt-3 flex items-center justify-between border-t border-[#efedf2] pt-3">
                            <span className="text-[12px] text-[#8b8792]">应付金额</span>
                            <span className="text-[20px] font-bold text-[#222127]">￥{payingProduct.price}.00</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  <button
                    type="button"
                    aria-label={`${paymentChannel.label}支付成功并返回 App`}
                    disabled={minorModeEnabled}
                    onClick={confirmPay}
                    className={`mt-5 h-12 w-full rounded-[16px] text-[15px] font-semibold text-white ${
                      minorModeEnabled
                        ? 'bg-[#d6d4dc]'
                        : paymentChannelStyles[paymentChannel.id as keyof typeof paymentChannelStyles].accent
                    }`}
                  >
                    支付成功，返回 App
                  </button>
                  <button
                    type="button"
                    aria-label="返回选择支付渠道"
                    onClick={() => setPaymentChannel(null)}
                    className="mt-3 h-11 w-full rounded-[14px] border border-[#eceaf1] text-[14px] font-semibold text-[#5f5a66]"
                  >
                    返回选择支付方式
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {message && (
          <div className="absolute left-1/2 top-[112px] z-[70] -translate-x-1/2 rounded-full bg-[#27232d] px-4 py-2 text-[12px] font-semibold text-white">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LuckyDrawMachine;
