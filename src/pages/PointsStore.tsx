import React, { useState } from 'react';
import { ChevronLeft, Star, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ModalOverlay,
  PrototypePhone,
  PrototypeStatusBar,
} from '@/components/subscription/PrototypeUI';
import { useDialogueStore } from '@/store/useDialogueStore';
import { usePetStore } from '@/store/usePetStore';

const pointProducts = [
  { points: 6000, price: 6, discount: '' },
  { points: 19000, price: 18, discount: '' },
  { points: 48000, price: 45, discount: '' },
  { points: 206800, price: 188, discount: '多得 10%' },
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

const PointsStore: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pet } = usePetStore();
  const deviceName = pet?.name || '肉派派';
  const { points, purchasePoints } = useDialogueStore();
  const [payingProduct, setPayingProduct] = useState<typeof pointProducts[number] | null>(null);
  const [paymentChannel, setPaymentChannel] = useState<typeof paymentChannels[number] | null>(null);
  const [message, setMessage] = useState('');
  const returnTo = searchParams.get('returnTo');
  const pointsStorePath = `/points-store${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`;

  const closePayment = () => {
    setPaymentChannel(null);
    setPayingProduct(null);
  };

  const confirmPay = () => {
    if (!payingProduct || !paymentChannel) return;
    purchasePoints(payingProduct.points, payingProduct.price, deviceName, paymentChannel.label);
    setMessage(`${paymentChannel.label}支付成功，已返回积分商城`);
    navigate(pointsStorePath, { replace: true });
    setPaymentChannel(null);
    setPayingProduct(null);
    window.setTimeout(() => setMessage(''), 1800);
  };

  const goBack = () => {
    if (returnTo?.startsWith('/')) {
      navigate(returnTo, { replace: true });
      return;
    }
    navigate('/interaction-history', { replace: true });
  };

  return (
    <PrototypePhone className="bg-[#fbf9ff]">
      <PrototypeStatusBar />
      <div className="relative flex h-[62px] items-center px-4">
        <button
          type="button"
          aria-label="返回上一级"
          onClick={goBack}
          className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#ececf0] bg-white text-[#19181f]"
        >
          <ChevronLeft size={25} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-medium text-[#19181f]">积分商城</h1>
        <button
          type="button"
          aria-label="查看积分订单"
          onClick={() => navigate('/points-orders')}
          className="ml-auto h-9 rounded-full bg-white px-4 text-[12px] font-semibold text-[#6f4bd6] shadow-[0_8px_18px_rgba(70,58,96,0.08)]"
        >
          订单
        </button>
      </div>

      <div className="relative h-[752px] overflow-y-auto px-5 pb-8 scrollbar-hide">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[230px] bg-[radial-gradient(circle_at_25%_25%,rgba(139,102,239,0.16),transparent_25%),radial-gradient(circle_at_70%_10%,rgba(255,226,119,0.24),transparent_20%)]" />

        <section className="relative z-10 pt-3 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-gradient-to-b from-[#ffe875] to-[#f2b827] shadow-[0_12px_24px_rgba(198,147,22,0.24)]">
            <Star size={44} className="text-white" fill="white" />
          </div>
          <p className="mt-4 text-[12px] text-[#a09aa8]">累计剩余积分</p>
          <h2 className="text-[34px] font-bold text-[#8b66ef]">{points}</h2>
        </section>

        <section className="relative z-10 mt-5 rounded-[20px] bg-[#cbbdff] px-4 pb-5 pt-4">
          <h2 className="text-[17px] font-semibold text-[#4b3b7c]">积分特惠</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {pointProducts.map((item) => (
              <button
                key={item.points}
                type="button"
                aria-label={`购买 ${item.points} 积分`}
                onClick={() => setPayingProduct(item)}
                className="rounded-[10px] bg-white px-3 pb-4 pt-5 text-center shadow-[0_8px_20px_rgba(68,52,116,0.10)]"
              >
                <div className="mx-auto flex h-16 w-20 items-center justify-center">
                  <Star size={34} className="text-[#ffd943]" fill="#ffd943" />
                  <Star size={26} className="-ml-2 mt-4 text-[#ffd943]" fill="#ffd943" />
                </div>
                <div className="mt-2 flex items-center justify-center text-[14px] font-semibold text-[#27232d]">
                  <Star size={14} className="mr-1 text-[#ffd943]" fill="#ffd943" />
                  {item.points}
                </div>
                {item.discount && (
                  <div className="mt-2 text-[11px] font-semibold text-[#8b66ef]">{item.discount}</div>
                )}
                <span className={`${item.discount ? 'mt-3' : 'mt-4'} inline-flex h-9 min-w-[92px] items-center justify-center rounded-[9px] bg-[#8b66ef] text-[15px] font-semibold text-white`}>
                  ￥{item.price}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="relative z-10 mt-5 rounded-[20px] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(58,49,75,0.06)]">
          <h2 className="text-[17px] font-semibold text-[#26232a]">不花钱也能拿积分</h2>
          <div className="mt-4 space-y-3">
            <p className="rounded-[14px] bg-[#f8f6fe] px-4 py-3 text-[12px] leading-5 text-[#6d6573]">
              积分可以通过日常互动获得，也可以在这里购买补充。购买的积分会归属当前设备。
            </p>
          </div>
        </section>

        {message && (
          <div className="fixed left-1/2 top-[116px] z-50 -translate-x-1/2 rounded-full bg-[#27232d] px-4 py-2 text-[12px] font-semibold text-white">
            {message}
          </div>
        )}
      </div>

      {payingProduct && (
        <ModalOverlay>
          <div className="w-full rounded-[28px] bg-white px-5 pb-5 pt-4">
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
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#8b66ef]">
                      <Star size={26} className="text-white" fill="white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-[14px] font-semibold text-[#222127]">{payingProduct.points} 积分</p>
                      <p className="mt-0.5 text-[11px] text-[#aaa6af]">用于兑换 Ropet 悄悄话卡</p>
                    </div>
                  </div>
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
                        className="min-h-[70px] rounded-[16px] border border-[#eee9f8] bg-[#fbf9ff] px-3 py-3 text-left shadow-[0_8px_18px_rgba(64,48,104,0.06)]"
                      >
                        <div className="flex items-center">
                          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[18px] font-bold ${style.bg} ${style.fg}`}>
                            {style.mark}
                          </span>
                          <span className="ml-2 min-w-0">
                            <span className="block text-[14px] font-semibold text-[#26232a]">{channel.label}</span>
                            <span className="mt-0.5 block text-[10px] leading-4 text-[#96919c]">{channel.desc}</span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-center text-[11px] text-[#8b8792]">原型演示：选择渠道后进入对应支付确认页。</p>
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
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[12px] text-[#8b8792]">归属设备</span>
                          <span className="text-[14px] font-semibold text-[#26232a]">{deviceName}</span>
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
                  onClick={confirmPay}
                  className={`mt-5 h-12 w-full rounded-[16px] text-[15px] font-semibold text-white ${paymentChannelStyles[paymentChannel.id as keyof typeof paymentChannelStyles].accent}`}
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
                <p className="mt-3 text-center text-[11px] leading-5 text-[#8b8792]">原型演示：真实 App 会等待支付渠道确认后再回到积分商城。</p>
              </>
            )}
          </div>
        </ModalOverlay>
      )}
    </PrototypePhone>
  );
};

export default PointsStore;
