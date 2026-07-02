import React, { useEffect, useState } from 'react';
import { ChevronLeft, LoaderCircle, RefreshCw, Star, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ModalOverlay,
  PrototypePhone,
  PrototypeStatusBar,
} from '@/components/subscription/PrototypeUI';
import { useDialogueStore } from '@/store/useDialogueStore';
import { usePetStore } from '@/store/usePetStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';

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
  const { points, purchasePoints, recordPointOrder } = useDialogueStore();
  const { minorModeEnabled } = useSubscriptionStore();
  const [productLoadState, setProductLoadState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [payingProduct, setPayingProduct] = useState<typeof pointProducts[number] | null>(null);
  const [paymentChannel, setPaymentChannel] = useState<typeof paymentChannels[number] | null>(null);
  const [message, setMessage] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const returnTo = searchParams.get('returnTo');
  const pointsStorePath = `/points-store${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`;

  const showToast = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 1800);
  };

  const loadProducts = (fail = false) => {
    setProductLoadState('loading');
    window.setTimeout(() => setProductLoadState(fail ? 'failed' : 'ready'), 450);
  };

  useEffect(() => {
    loadProducts(searchParams.get('loadFail') === '1');
  }, [searchParams]);

  const closePayment = () => {
    if (paymentProcessing) return;
    if (paymentChannel) showToast('支付已取消');
    setPaymentChannel(null);
    setPayingProduct(null);
    setCreatingOrder(false);
  };

  const confirmPay = () => {
    if (!payingProduct || !paymentChannel || minorModeEnabled || paymentProcessing) return;
    setPaymentProcessing(true);
    window.setTimeout(() => {
      purchasePoints(payingProduct.points, payingProduct.price, deviceName, paymentChannel.label);
      setPaymentProcessing(false);
      setPaymentChannel(null);
      setPayingProduct(null);
      navigate(pointsStorePath, { replace: true });
      showToast(`${paymentChannel.label}支付成功，已返回积分商城`);
    }, 700);
  };

  const selectProduct = (item: typeof pointProducts[number]) => {
    if (minorModeEnabled || productLoadState !== 'ready') return;
    setPayingProduct(item);
  };

  const startPayment = (channel: typeof paymentChannels[number]) => {
    if (creatingOrder || paymentProcessing) return;
    setCreatingOrder(true);
    window.setTimeout(() => {
      setPaymentChannel(channel);
      setCreatingOrder(false);
    }, 500);
  };

  const failAndClose = (text: string, status?: 'failed' | 'cancelled' | 'timeout') => {
    if (payingProduct && paymentChannel && status) {
      recordPointOrder(payingProduct.points, payingProduct.price, deviceName, paymentChannel.label, status);
    }
    setPaymentProcessing(false);
    setCreatingOrder(false);
    setPaymentChannel(null);
    setPayingProduct(null);
    showToast(text);
  };

  const showProcessing = () => {
    if (!payingProduct || !paymentChannel) return;
    setPaymentProcessing(true);
  };

  const showPointsMissing = () => {
    if (!payingProduct || !paymentChannel) return;
    recordPointOrder(payingProduct.points, payingProduct.price, deviceName, paymentChannel.label, 'processing');
    setPaymentProcessing(false);
    setPaymentChannel(null);
    setPayingProduct(null);
    navigate('/points-orders');
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
          {minorModeEnabled && (
            <p className="mt-2 rounded-[12px] bg-white/70 px-3 py-2 text-[12px] font-medium leading-5 text-[#7c728d]">
              未成年模式下暂不开放购买
            </p>
          )}
          {productLoadState === 'loading' && (
            <div className="mt-4 flex min-h-[210px] items-center justify-center rounded-[16px] bg-white/72 text-[13px] font-semibold text-[#7c728d]">
              <LoaderCircle size={18} className="mr-2 animate-spin" />
              商品加载中
            </div>
          )}
          {productLoadState === 'failed' && (
            <div className="mt-4 rounded-[16px] bg-white/80 px-4 py-8 text-center">
              <p className="text-[14px] font-semibold text-[#4b3b7c]">商品列表加载失败</p>
              <button
                type="button"
                onClick={() => loadProducts(false)}
                className="mx-auto mt-4 flex h-10 items-center justify-center rounded-full bg-[#8b66ef] px-5 text-[13px] font-semibold text-white"
              >
                <RefreshCw size={14} className="mr-1.5" />
                重试
              </button>
            </div>
          )}
          {productLoadState === 'ready' && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {pointProducts.map((item) => (
                <button
                  key={item.points}
                  type="button"
                  aria-label={`购买 ${item.points} 积分`}
                  disabled={minorModeEnabled}
                  onClick={() => selectProduct(item)}
                  className={`rounded-[10px] bg-white px-3 pb-4 pt-5 text-center shadow-[0_8px_20px_rgba(68,52,116,0.10)] ${
                    minorModeEnabled ? 'opacity-45 grayscale' : ''
                  }`}
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
          )}
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
                      <p className="mt-0.5 text-[11px] text-[#aaa6af]">用于兑换 Ropet 项环电池</p>
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
                        disabled={creatingOrder}
                        onClick={() => startPayment(channel)}
                        className="min-h-[70px] rounded-[16px] border border-[#eee9f8] bg-[#fbf9ff] px-3 py-3 text-left shadow-[0_8px_18px_rgba(64,48,104,0.06)] disabled:opacity-55"
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
                {creatingOrder && (
                  <div className="mt-4 flex items-center justify-center rounded-[14px] bg-[#f4f0ff] px-3 py-2 text-[12px] font-semibold text-[#7c5ae0]">
                    <LoaderCircle size={15} className="mr-2 animate-spin" />
                    正在创建订单
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => failAndClose('订单创建失败，请稍后重试')}
                  className="mt-3 h-9 w-full rounded-[12px] border border-[#eee9f8] text-[12px] font-semibold text-[#8b8792]"
                >
                  模拟创建订单失败
                </button>
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
                      {paymentProcessing && (
                        <div className="mt-4 flex items-center justify-center rounded-[14px] bg-white px-3 py-3 text-[12px] font-semibold text-[#7c5ae0]">
                          <LoaderCircle size={16} className="mr-2 animate-spin" />
                          支付处理中
                        </div>
                      )}
                    </div>
                  );
                })()}
                <button
                  type="button"
                  aria-label={`${paymentChannel.label}支付成功并返回 App`}
                  disabled={minorModeEnabled || paymentProcessing}
                  onClick={confirmPay}
                  className={`mt-5 h-12 w-full rounded-[16px] text-[15px] font-semibold text-white ${
                    minorModeEnabled || paymentProcessing
                      ? 'bg-[#d6d4dc]'
                      : paymentChannelStyles[paymentChannel.id as keyof typeof paymentChannelStyles].accent
                  }`}
                >
                  {paymentProcessing ? (
                    <span className="inline-flex items-center">
                      <LoaderCircle size={17} className="mr-2 animate-spin" />
                      支付处理中
                    </span>
                  ) : (
                    '支付成功，返回 App'
                  )}
                </button>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => failAndClose('网络异常，请稍后重试')} className="h-9 rounded-[12px] bg-[#f4f3f5] text-[12px] font-semibold text-[#5f5a66]">网络异常</button>
                  <button type="button" onClick={() => failAndClose('支付失败，请重新支付', 'failed')} className="h-9 rounded-[12px] bg-[#f4f3f5] text-[12px] font-semibold text-[#5f5a66]">支付失败</button>
                  <button type="button" onClick={() => failAndClose('支付已取消', 'cancelled')} className="h-9 rounded-[12px] bg-[#f4f3f5] text-[12px] font-semibold text-[#5f5a66]">取消支付</button>
                  <button type="button" onClick={() => failAndClose('订单已超时，请重新下单', 'timeout')} className="h-9 rounded-[12px] bg-[#f4f3f5] text-[12px] font-semibold text-[#5f5a66]">订单超时</button>
                  <button type="button" onClick={showProcessing} className="h-9 rounded-[12px] bg-[#f4f3f5] text-[12px] font-semibold text-[#5f5a66]">支付处理中</button>
                  <button type="button" onClick={showPointsMissing} className="h-9 rounded-[12px] bg-[#f4f3f5] text-[12px] font-semibold text-[#5f5a66]">积分未到账</button>
                </div>
                <button
                  type="button"
                  aria-label="返回选择支付渠道"
                  disabled={paymentProcessing}
                  onClick={() => setPaymentChannel(null)}
                  className="mt-3 h-11 w-full rounded-[14px] border border-[#eceaf1] text-[14px] font-semibold text-[#5f5a66] disabled:opacity-45"
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
