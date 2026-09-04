import React, { useEffect, useRef, useState } from 'react';
import { Check, LoaderCircle, RefreshCw, Star, X } from 'lucide-react';
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
  { id: 'webstore', label: 'Ropet 官网', desc: '前往浏览器购买兑换码' },
];

const paymentChannelStyles = {
  appstore: { mark: 'A', bg: 'bg-[#f4f4f5]', fg: 'text-[#222127]', accent: 'bg-[#222127]' },
  alipay: { mark: '支', bg: 'bg-[#e9f3ff]', fg: 'text-[#1677ff]', accent: 'bg-[#1677ff]' },
  googleplay: { mark: 'G', bg: 'bg-[#e9f7ef]', fg: 'text-[#18a957]', accent: 'bg-[#18a957]' },
  webstore: { mark: 'R', bg: 'bg-[#f0ebff]', fg: 'text-[#7652df]', accent: 'bg-[#7652df]' },
};

const PointsStore: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pet } = usePetStore();
  const deviceName = pet?.name || '肉派派';
  const { points, purchasePoints, recordPointOrder } = useDialogueStore();
  const { minorModeEnabled } = useSubscriptionStore();
  const [productLoadState, setProductLoadState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [selectedProduct, setSelectedProduct] = useState<typeof pointProducts[number]>(pointProducts[0]);
  const [payingProduct, setPayingProduct] = useState<typeof pointProducts[number] | null>(null);
  const [paymentChannel, setPaymentChannel] = useState<typeof paymentChannels[number] | null>(null);
  const [message, setMessage] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const pullStartY = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const productRequestTimer = useRef<number | null>(null);
  const returnTo = searchParams.get('returnTo');
  const pointsStorePath = `/points-store${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`;

  const showToast = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 1800);
  };

  const loadProducts = (fail = false) => {
    if (productRequestTimer.current !== null) {
      window.clearTimeout(productRequestTimer.current);
    }
    setProductLoadState('loading');
    setPullDistance(0);
    productRequestTimer.current = window.setTimeout(() => {
      setProductLoadState(fail ? 'failed' : 'ready');
      productRequestTimer.current = null;
    }, 450);
  };

  const startPull = (clientY: number) => {
    if (productLoadState === 'failed' && (scrollContainerRef.current?.scrollTop ?? 0) <= 0) {
      pullStartY.current = clientY;
    }
  };

  const movePull = (clientY: number) => {
    if (pullStartY.current === null) return;
    setPullDistance(Math.min(76, Math.max(0, (clientY - pullStartY.current) * 0.55)));
  };

  const finishPull = () => {
    if (pullStartY.current === null) return;
    pullStartY.current = null;
    if (pullDistance >= 52) {
      loadProducts(false);
      return;
    }
    setPullDistance(0);
  };

  useEffect(() => {
    loadProducts(searchParams.get('loadFail') === '1');
    return () => {
      if (productRequestTimer.current !== null) {
        window.clearTimeout(productRequestTimer.current);
        productRequestTimer.current = null;
      }
    };
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
    setSelectedProduct(item);
  };

  const beginPurchase = () => {
    if (!agreementChecked) {
      showToast('请勾选协议');
      return;
    }
    if (productLoadState !== 'ready') return;
    setPayingProduct(selectedProduct);
  };

  const startPayment = (channel: typeof paymentChannels[number]) => {
    if (creatingOrder || paymentProcessing) return;
    if (channel.id === 'webstore') {
      window.open('https://ropetai.com/products/dream-sketch-canvas', '_blank', 'noopener,noreferrer');
      setPayingProduct(null);
      return;
    }
    setCreatingOrder(true);
    window.setTimeout(() => {
      setPaymentChannel(channel);
      setCreatingOrder(false);
    }, 500);
  };

  const failAndClose = (text: string, shouldRecord = false) => {
    if (payingProduct && paymentChannel && shouldRecord) {
      recordPointOrder(payingProduct.points, payingProduct.price, deviceName, paymentChannel.label, 'closed');
    }
    setPaymentProcessing(false);
    setCreatingOrder(false);
    setPaymentChannel(null);
    setPayingProduct(null);
    showToast(text);
  };

  const showNetworkError = () => {
    setPaymentProcessing(false);
    setCreatingOrder(false);
    setPaymentChannel(null);
    setPayingProduct(null);
    window.setTimeout(() => showToast('网络异常，请稍后重试'), 120);
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
    navigate('/points-purchase-orders');
  };

  const goBack = () => {
    if (returnTo?.startsWith('/')) {
      navigate(returnTo, { replace: true });
      return;
    }
    navigate('/interaction-history', { replace: true });
  };

  return (
    <PrototypePhone className="bg-[linear-gradient(155deg,#eadcff_0%,#fff7d8_48%,#fffdf5_100%)]">
      <PrototypeStatusBar />
      <div className="relative flex h-[62px] items-center px-4">
        <button
          type="button"
          aria-label="关闭积分充值"
          onClick={goBack}
          className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#ececf0] bg-white text-[#19181f]"
        >
          <X size={25} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-medium text-[#19181f]">积分充值</h1>
        <button
          type="button"
          aria-label="查看积分订单"
          onClick={() => navigate('/points-purchase-orders')}
          className="ml-auto h-9 rounded-full bg-white px-4 text-[12px] font-semibold text-[#6f4bd6] shadow-[0_8px_18px_rgba(70,58,96,0.08)]"
        >
          订单
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="relative h-[752px] touch-pan-y overflow-y-auto pb-8 scrollbar-hide"
        onPointerDown={(event) => startPull(event.clientY)}
        onPointerMove={(event) => movePull(event.clientY)}
        onPointerUp={finishPull}
        onPointerCancel={finishPull}
      >
        {productLoadState === 'failed' && (
          <div
            className="absolute left-0 right-0 top-0 z-20 flex items-center justify-center text-[11px] font-medium text-[#817a8a] transition-transform"
            style={{ height: 48, transform: `translateY(${pullDistance - 48}px)` }}
          >
            <RefreshCw size={14} className={`mr-1.5 ${pullDistance >= 52 ? 'rotate-180' : ''} transition-transform`} />
            {pullDistance >= 52 ? '松开刷新' : '下拉刷新'}
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-[radial-gradient(circle_at_24%_18%,rgba(163,113,255,0.18),transparent_34%),radial-gradient(circle_at_70%_56%,rgba(255,222,91,0.30),transparent_38%)]" />

        <section className="relative z-10 pb-7 pt-4 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[7px] border-[#ffdf69] bg-gradient-to-br from-[#fff8ad] via-[#ffc62f] to-[#f3a400] shadow-[0_14px_28px_rgba(196,139,14,0.26),inset_0_0_0_3px_rgba(255,255,255,0.55)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#f4a400]/40 bg-gradient-to-br from-[#fff172] to-[#ffb411] shadow-inner">
              <Star size={39} className="text-[#fff9d2] drop-shadow-[0_2px_1px_rgba(196,111,0,0.3)]" fill="#fff9d2" />
            </div>
          </div>
          <h2 className="mt-4 text-[36px] font-bold leading-none text-[#8759ee]">{points}</h2>
        </section>

        {!minorModeEnabled && <section className="relative z-10 mx-3 rounded-t-[30px] bg-white px-4 pb-5 pt-7 shadow-[0_-8px_30px_rgba(73,54,104,0.10)]">
          <div className="absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-[#29272c]" />
          <h2 className="text-[18px] font-semibold text-[#26232a]">积分特惠</h2>
          {productLoadState === 'loading' && (
            <div className="mt-4 flex min-h-[330px] items-center justify-center rounded-[18px] bg-[#f7f6f8] text-[13px] font-semibold text-[#7c728d]">
              <LoaderCircle size={18} className="mr-2 animate-spin" />
              商品加载中
            </div>
          )}
          {productLoadState === 'failed' && (
            <div className="mt-4 rounded-[18px] bg-[#f7f6f8] px-4 py-16 text-center">
              <p className="text-[14px] font-semibold text-[#4b3b7c]">商品列表加载失败</p>
              <p className="mt-3 text-[12px] text-[#8e8795]">下拉刷新</p>
            </div>
          )}
          {productLoadState === 'ready' && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {pointProducts.map((item) => (
                <button
                  key={item.points}
                  type="button"
                  aria-label={`购买 ${item.points} 积分`}
                  onClick={() => selectProduct(item)}
                  className={`relative min-h-[154px] rounded-[14px] border-2 px-3 pb-4 pt-4 text-center transition-colors ${
                    selectedProduct.points === item.points
                      ? 'border-[#8559eb] bg-[#fbf9ff] shadow-[0_6px_16px_rgba(101,71,178,0.12)]'
                      : 'border-[#eeecef] bg-[#f8f8f9]'
                  }`}
                >
                  <div className="mx-auto flex h-20 w-24 items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border-[4px] border-[#ffdc62] bg-gradient-to-br from-[#fff4a1] to-[#f6ab00] shadow-[0_6px_10px_rgba(196,139,14,0.18)]">
                      <Star size={30} className="text-[#fff7c6]" fill="#fff7c6" />
                    </span>
                    {item.points > 6000 && (
                      <span className="-ml-4 mt-7 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-[#ffdc62] bg-gradient-to-br from-[#fff4a1] to-[#f6ab00]">
                        <Star size={18} className="text-[#fff7c6]" fill="#fff7c6" />
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-center text-[16px] font-semibold text-[#27232d]">
                    <span className="mr-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#ffc72c] text-[9px] text-white">★</span>
                    {item.points}
                  </div>
                  {item.discount && (
                    <div className="mt-1 text-[11px] font-semibold text-[#8b66ef]">{item.discount}</div>
                  )}
                  <span className="absolute right-3 top-3 text-[11px] font-semibold text-[#9b95a1]">￥{item.price}</span>
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={beginPurchase}
            className="mt-5 flex h-12 w-full items-center justify-center rounded-[16px] bg-[#7d50e8] text-[15px] font-semibold text-white shadow-[0_8px_18px_rgba(92,61,176,0.22)]"
          >
            ￥{selectedProduct.price}
          </button>
          <button
            type="button"
            role="checkbox"
            aria-checked={agreementChecked}
            aria-label={agreementChecked ? '取消同意积分充值协议' : '同意积分充值协议'}
            onClick={() => setAgreementChecked((checked) => !checked)}
            className="mt-4 flex w-full items-center justify-center text-left"
          >
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors ${
              agreementChecked
                ? 'border-[#8b66ef] bg-[#8b66ef] text-white'
                : 'border-[#c9c4d0] bg-white text-transparent'
            }`}>
              <Check size={14} strokeWidth={3} />
            </span>
            <span className="ml-2 text-[12px] leading-5 text-[#6d6573]">
              我已阅读并同意<span className="font-semibold text-[#7652df]">《积分充值协议》</span>
            </span>
          </button>
        </section>}

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
                  <button type="button" onClick={showNetworkError} className="h-9 rounded-[12px] bg-[#f4f3f5] text-[12px] font-semibold text-[#5f5a66]">网络异常</button>
                  <button type="button" onClick={() => failAndClose('支付失败，请重新支付', true)} className="h-9 rounded-[12px] bg-[#f4f3f5] text-[12px] font-semibold text-[#5f5a66]">支付失败</button>
                  <button type="button" onClick={() => failAndClose('支付已取消', true)} className="h-9 rounded-[12px] bg-[#f4f3f5] text-[12px] font-semibold text-[#5f5a66]">取消支付</button>
                  <button type="button" onClick={() => failAndClose('订单已超时，请重新下单', true)} className="h-9 rounded-[12px] bg-[#f4f3f5] text-[12px] font-semibold text-[#5f5a66]">订单超时</button>
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
