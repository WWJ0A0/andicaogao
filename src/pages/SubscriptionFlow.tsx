import React, { useEffect, useState } from 'react';
import {
  Check,
  ChevronRight,
  Copy,
  Delete,
  ExternalLink,
  Gift,
  LoaderCircle,
  LockKeyhole,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AgreementCheck,
  BenefitsTable,
  HiMark,
  PrototypeHeader,
  PrototypePhone,
  PrototypeStatusBar,
  SubscriptionPlanCard,
} from '@/components/subscription/PrototypeUI';
import {
  PaymentMethod,
  SubscriptionOrder,
  TrialCard,
  useSubscriptionStore,
} from '@/store/useSubscriptionStore';
import { usePetStore } from '@/store/usePetStore';

type Screen =
  | 'plans'
  | 'payment-method'
  | 'alipay'
  | 'wechat'
  | 'alipay-result'
  | 'wechat-result'
  | 'opening'
  | 'success'
  | 'failure'
  | 'status'
  | 'account'
  | 'orders'
  | 'invoices';

type Props = {
  screen: Screen;
};

const planAmount = (plan: 'one-month' | 'auto-renew') => (
  plan === 'auto-renew' ? '69.90' : '79.90'
);

const channelName = (method: PaymentMethod) => ({
  alipay: '支付宝',
  wechat: '微信支付',
  apple: 'Apple IAP',
  google: 'Google Play',
  stripe: 'Stripe',
  paypal: 'PayPal',
}[method]);

const orderStatusLabel = (status: SubscriptionOrder['status']) => ({
  paid: '支付成功',
  refunding: '退款中',
  refunded: '已退款',
}[status] ?? '支付成功');

const formatOrderAmount = (amount: SubscriptionOrder['amount'] | string | undefined) => {
  const value = typeof amount === 'number' ? amount : Number.parseFloat(amount ?? '0');
  return Number.isFinite(value) ? value.toFixed(2) : '0.00';
};

const fallbackTrialOrderNo = (card: TrialCard) => {
  const datePart = (card.usedAt || '0000.00.00').replace(/\D/g, '').slice(0, 8).padEnd(8, '0');
  const idPart = Array.from(card.id).reduce((total, character) => total + character.charCodeAt(0), 0);
  return `TC${datePart}${String(idPart).slice(-4).padStart(4, '0')}`;
};

const CopyOrderNumber: React.FC<{ orderNo: string }> = ({ orderNo }) => {
  const [copied, setCopied] = useState(false);

  const fallbackCopy = () => {
    const textArea = document.createElement('textarea');
    textArea.value = orderNo;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderNo);
    } catch {
      fallbackCopy();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      type="button"
      aria-label={`复制订单号 ${orderNo}`}
      onClick={handleCopy}
      className="inline-flex min-w-0 items-center text-[11px] text-[#aaa6ae]"
    >
      <span className="truncate">订单号 {orderNo}</span>
      <Copy size={12} className="ml-1 shrink-0" />
      {copied && <span className="ml-1 shrink-0 font-medium text-[#7652df]">已复制</span>}
    </button>
  );
};

const PhoneShell: React.FC<{
  title?: string;
  backTo?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, backTo = '/dialogue-mode', children, footer }) => {
  const navigate = useNavigate();
  return (
    <PrototypePhone>
        <PrototypeStatusBar />
        <PrototypeHeader title={title} onBack={() => navigate(backTo)} />
        <div className="h-[742px] overflow-y-auto scrollbar-hide px-5 pb-[120px]">{children}</div>
        {footer}
    </PrototypePhone>
  );
};

const PrimaryButton: React.FC<{
  children: React.ReactNode;
  sub?: string;
  onClick: () => void;
  disabled?: boolean;
}> = ({ children, sub, onClick, disabled = false }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`absolute left-5 right-5 bottom-[30px] h-[68px] rounded-[28px] text-white shadow-[0_12px_24px_rgba(139,102,239,0.28)] ${
      disabled ? 'bg-[#c9c5d4]' : 'bg-[#8b66ef]'
    }`}
  >
    <div className="text-[18px] font-semibold leading-6">{children}</div>
    {sub && <div className="mt-[2px] text-[12px] text-white/80">{sub}</div>}
  </button>
);

const PlansScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    entitlement,
    selectedPlan,
    subscribedPlan,
    setSelectedPlan,
  } = useSubscriptionStore();
  const [agreementChecked, setAgreementChecked] = useState(true);
  const currentPlan = entitlement === 'subscription' ? subscribedPlan : null;
  const selectingCurrentPlan = currentPlan === selectedPlan;
  const returnTo = searchParams.get('returnTo') || '/dialogue-mode';

  return (
    <PrototypePhone>
      <PrototypeStatusBar />
      <PrototypeHeader onBack={() => navigate(returnTo)} />
      <div className="absolute left-1/2 top-[70px] w-full -translate-x-1/2 text-center">
        <img src="/images/personality/joybean.png" alt="" className="absolute left-1/2 top-[-12px] w-[230px] -translate-x-1/2 opacity-[0.08] blur-[2px]" />
        <div className="relative">
          <HiMark />
          <h1 className="mt-2 text-[24px] font-semibold text-[#222127]">获取 Ropet Plus</h1>
          <p className="mt-1 text-[13px] text-[#a09ba5]">解锁完整对话能力</p>
        </div>
      </div>

      <div className="absolute left-5 right-5 top-[220px]">
        <BenefitsTable />
        <div className="mt-5 space-y-3">
          <SubscriptionPlanCard
            plan="one-month"
            selected={selectedPlan === 'one-month'}
            disabled={currentPlan === 'one-month'}
            statusLabel={currentPlan === 'one-month' ? '当前使用中' : undefined}
            onClick={() => setSelectedPlan('one-month')}
          />
          <SubscriptionPlanCard
            plan="auto-renew"
            selected={selectedPlan === 'auto-renew'}
            disabled={currentPlan === 'auto-renew'}
            statusLabel={currentPlan === 'auto-renew' ? '当前使用中' : undefined}
            onClick={() => setSelectedPlan('auto-renew')}
          />
        </div>
        <button
          type="button"
          disabled={!agreementChecked || selectingCurrentPlan}
          aria-label="立即订阅"
          onClick={() => navigate('/subscription/payment-method')}
          className={`mt-5 h-[52px] w-full rounded-[22px] text-[16px] font-medium text-white ${
            agreementChecked && !selectingCurrentPlan ? 'bg-[#8b66ef]' : 'bg-[#c9c5d4]'
          }`}
        >
          {currentPlan ? (selectingCurrentPlan ? '请选择其他套餐' : '确认更换套餐') : '立即订阅'}
        </button>

        <div className="mt-3 pl-7">
        <AgreementCheck
          checked={agreementChecked}
          onClick={() => setAgreementChecked(!agreementChecked)}
          ariaLabel={agreementChecked ? '取消同意会员服务协议' : '同意会员服务协议'}
        >
          <span className="text-[10px] text-[#c0bdc5]">
            我已阅读并同意
            <span
              role="link"
              tabIndex={0}
              className="ml-1 cursor-pointer text-[#8b66ef]"
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/policies/subscription?returnTo=${encodeURIComponent('/subscription')}`);
              }}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                event.stopPropagation();
                navigate(`/policies/subscription?returnTo=${encodeURIComponent('/subscription')}`);
              }}
            >
              《Ropet Plus 订阅服务协议》
            </span>
          </span>
        </AgreementCheck>
        </div>
      </div>
    </PrototypePhone>
  );
};

const PaymentMethodScreen = () => {
  const navigate = useNavigate();
  const { selectedPlan, setPaymentMethod } = useSubscriptionStore();
  const [selectedMethod, setSelectedMethod] = useState<'alipay' | 'wechat' | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const recurring = selectedPlan === 'auto-renew';
  const amount = planAmount(selectedPlan);

  useEffect(() => {
    if (!creatingOrder || !selectedMethod) return;
    const timer = window.setTimeout(() => navigate(`/subscription/${selectedMethod}`), 1000);
    return () => window.clearTimeout(timer);
  }, [creatingOrder, navigate, selectedMethod]);

  return (
    <PrototypePhone className="bg-[#f7f7f8]">
      <PrototypeStatusBar />
      <PrototypeHeader title="选择支付方式" onBack={() => navigate('/subscription')} />

      <div className="px-5 pt-4">
        <section className="rounded-[20px] bg-white px-5 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[16px] font-semibold text-[#222127]">Ropet Plus</div>
              <div className="mt-1 text-[12px] text-[#96919c]">
                {recurring ? '连续包月' : '1 个月'}
              </div>
            </div>
            <span className="text-right">
              {recurring && <span className="block text-[11px] text-[#aaa6af] line-through">￥79.90</span>}
              <strong className="block text-[24px] text-[#222127]">￥{amount}</strong>
            </span>
          </div>
          <div className="mt-4 border-t border-[#eeeeef] pt-4 text-[12px] leading-5 text-[#96919c]">
            {recurring
              ? '确认后由所选支付方式完成本次付款，并按月自动续费。'
              : '本次购买有效期为 1 个月，到期后不会自动续费。'}
          </div>
        </section>

        <h2 className="mb-3 mt-7 text-[15px] font-semibold text-[#333137]">支付方式</h2>
        <button
          type="button"
          aria-label="选择支付宝"
          aria-pressed={selectedMethod === 'alipay'}
          onClick={() => setSelectedMethod('alipay')}
          className={`flex h-[76px] w-full items-center rounded-[18px] bg-white px-4 text-left ${
            selectedMethod === 'alipay' ? 'ring-2 ring-[#1677ff]' : 'ring-1 ring-[#ececef]'
          }`}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] bg-[#1677ff] text-[21px] font-bold text-white">
            支
          </span>
          <span className="ml-4">
            <span className="block text-[16px] font-semibold text-[#222127]">支付宝</span>
            <span className="mt-1 block text-[12px] text-[#96919c]">推荐使用支付宝安全付款</span>
          </span>
          <span
            className={`ml-auto flex h-6 w-6 items-center justify-center rounded-full ${
              selectedMethod === 'alipay' ? 'bg-[#1677ff]' : 'border-2 border-[#d3d1d6]'
            }`}
          >
            {selectedMethod === 'alipay' && <Check size={15} color="white" strokeWidth={3} />}
          </span>
        </button>

        <button
          type="button"
          aria-label="选择微信支付"
          aria-pressed={selectedMethod === 'wechat'}
          onClick={() => setSelectedMethod('wechat')}
          className={`mt-3 flex h-[76px] w-full items-center rounded-[18px] bg-white px-4 text-left ${
            selectedMethod === 'wechat' ? 'ring-2 ring-[#07c160]' : 'ring-1 ring-[#ececef]'
          }`}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] bg-[#07c160] text-[20px] font-bold text-white">
            微
          </span>
          <span className="ml-4">
            <span className="block text-[16px] font-semibold text-[#222127]">微信支付</span>
            <span className="mt-1 block text-[12px] text-[#96919c]">使用微信安全付款</span>
          </span>
          <span
            className={`ml-auto flex h-6 w-6 items-center justify-center rounded-full ${
              selectedMethod === 'wechat' ? 'bg-[#07c160]' : 'border-2 border-[#d3d1d6]'
            }`}
          >
            {selectedMethod === 'wechat' && <Check size={15} color="white" strokeWidth={3} />}
          </span>
        </button>
      </div>

      <button
        type="button"
        aria-label="确认支付方式"
        disabled={!selectedMethod || creatingOrder}
        onClick={() => {
          if (!selectedMethod || creatingOrder) return;
          setPaymentMethod(selectedMethod);
          setCreatingOrder(true);
        }}
        className={`absolute bottom-[30px] left-5 right-5 h-[56px] rounded-[24px] text-[17px] font-semibold text-white ${
          selectedMethod ? 'bg-[#8b66ef]' : 'bg-[#c9c5d4]'
        }`}
      >
        {creatingOrder ? (
          <span className="flex items-center justify-center gap-2">
            <LoaderCircle size={20} className="animate-spin" />
            正在创建订单
          </span>
        ) : `确认支付 ￥${amount}`}
      </button>

      {creatingOrder && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/25 px-8">
          <div className="w-full rounded-[22px] bg-white px-6 py-7 text-center shadow-[0_18px_50px_rgba(32,27,45,0.18)]">
            <LoaderCircle size={36} className="mx-auto animate-spin text-[#8b66ef]" />
            <h2 className="mt-4 text-[17px] font-semibold text-[#27242c]">正在创建订单</h2>
            <p className="mt-2 text-[12px] leading-5 text-[#96919c]">
              正在向{selectedMethod === 'alipay' ? '支付宝' : '微信支付'}申请支付订单，请稍候…
            </p>
          </div>
        </div>
      )}
    </PrototypePhone>
  );
};

const PaymentPasswordScreen: React.FC<{ channel: 'alipay' | 'wechat' }> = ({ channel }) => {
  const navigate = useNavigate();
  const { selectedPlan, setPaymentState } = useSubscriptionStore();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const recurring = selectedPlan === 'auto-renew';
  const amount = planAmount(selectedPlan);
  const isAlipay = channel === 'alipay';
  const channelName = isAlipay ? '支付宝' : '微信支付';
  const channelColor = isAlipay ? '#1677ff' : '#07c160';
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];

  useEffect(() => {
    if (!submitting) return;
    const timer = window.setTimeout(() => {
      setPaymentState('confirming');
      navigate(`/subscription/${channel}/result`);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [channel, navigate, setPaymentState, submitting]);

  const inputKey = (key: string) => {
    if (submitting) return;
    if (key === 'delete') {
      setPassword((current) => current.slice(0, -1));
      return;
    }
    if (!key || password.length >= 6) return;
    setPassword((current) => current + key);
  };

  const confirm = () => {
    if (password.length !== 6 || submitting) return;
    setPaymentState('paying');
    setSubmitting(true);
  };

  return (
    <PrototypePhone className="bg-[#f5f5f5]">
      <PrototypeStatusBar />
      <PrototypeHeader title={isAlipay ? '支付宝付款' : '微信支付'} onBack={() => navigate('/subscription/payment-method')} />

      <div className="px-5 pt-3 text-center">
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-[12px] text-[22px] font-bold text-white"
          style={{ backgroundColor: channelColor }}
        >
          {isAlipay ? '支' : '微'}
        </div>
        <p className="mt-4 text-[13px] text-[#8b8792]">Ropet Plus</p>
        <div className="mt-1 text-[36px] font-semibold tracking-normal text-[#19181f]">￥{amount}</div>
        <p className="mt-2 text-[12px] text-[#8b8792]">
          {recurring ? `连续包月 · 支付后每月由${channelName}自动扣款` : '购买 1 个月 · 本次付款后不自动续费'}
        </p>
      </div>

      <section className="mx-5 mt-7 rounded-[18px] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(30,40,60,0.06)]">
        <div className="flex items-center justify-center gap-2 text-[15px] font-medium text-[#333137]">
          <LockKeyhole size={18} color={channelColor} />
          请输入支付密码
        </div>
        <div className="mt-5 grid grid-cols-6 overflow-hidden rounded-[8px] border border-[#d9d9d9]">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} className="flex h-[50px] items-center justify-center border-r border-[#e2e2e2] last:border-r-0">
              {index < password.length && <span className="h-3 w-3 rounded-full bg-[#19181f]" />}
            </span>
          ))}
        </div>
        <div className="mt-3 text-right text-[12px]" style={{ color: channelColor }}>忘记密码</div>
      </section>

      <div className="absolute bottom-0 left-0 right-0 bg-[#e7e8eb] p-[1px]">
        <div className="grid grid-cols-3 gap-[1px]">
          {keys.map((key, index) => (
            key ? (
              <button
                key={`${key}-${index}`}
                type="button"
                aria-label={key === 'delete' ? '删除一位密码' : `输入数字 ${key}`}
                onClick={() => inputKey(key)}
                disabled={submitting}
                className="flex h-[58px] items-center justify-center bg-white text-[24px] font-medium text-[#1c1b20] active:bg-[#eceef2] disabled:text-[#b9b9bd]"
              >
                {key === 'delete' ? <Delete size={24} /> : key}
              </button>
            ) : (
              <span key={`blank-${index}`} className="h-[58px] bg-[#e7e8eb]" />
            )
          ))}
        </div>
        <button
          type="button"
          aria-label="确认支付"
          disabled={password.length !== 6 || submitting}
          onClick={confirm}
          className="mt-[1px] h-[54px] w-full text-[16px] font-semibold text-white"
          style={{
            backgroundColor: password.length === 6 ? channelColor : (isAlipay ? '#9fc7ff' : '#9bdcb9'),
          }}
        >
          {submitting ? '支付确认中…' : `确认支付 ￥${amount}`}
        </button>
      </div>
    </PrototypePhone>
  );
};

const ChannelPaymentResultScreen: React.FC<{ channel: 'alipay' | 'wechat' }> = ({ channel }) => {
  const navigate = useNavigate();
  const { selectedPlan, voiceConsentGranted } = useSubscriptionStore();
  const isAlipay = channel === 'alipay';
  const color = isAlipay ? '#1677ff' : '#07c160';
  const amount = planAmount(selectedPlan);

  return (
    <PrototypePhone className="bg-[#f5f5f5]">
      <PrototypeStatusBar />
      <div className="px-6 pt-14 text-center">
        <div
          className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          <Check size={40} strokeWidth={3} />
        </div>
        <h1 className="mt-6 text-[25px] font-semibold text-[#222127]">支付成功</h1>
        <div className="mt-4 text-[38px] font-semibold text-[#19181f]">￥{amount}</div>
        <p className="mt-2 text-[13px] text-[#8b8792]">{isAlipay ? '支付宝' : '微信支付'}交易已完成</p>

        <section className="mt-9 rounded-[20px] bg-white px-5 text-left">
          <div className="flex justify-between border-b border-[#eeeeef] py-4 text-[13px]">
            <span className="text-[#96919c]">商品</span><strong>Ropet Plus</strong>
          </div>
          <div className="flex justify-between border-b border-[#eeeeef] py-4 text-[13px]">
            <span className="text-[#96919c]">商户</span><strong>Ropet</strong>
          </div>
          <div className="flex justify-between py-4 text-[13px]">
            <span className="text-[#96919c]">支付方式</span><strong>{isAlipay ? '支付宝' : '微信支付'}</strong>
          </div>
        </section>
      </div>

      <button
        type="button"
        onClick={() => navigate(
          voiceConsentGranted
            ? '/subscription/opening?source=subscription'
            : '/subscription/voice-consent?source=subscription',
        )}
        className="absolute bottom-[34px] left-5 right-5 h-[56px] rounded-[24px] text-[17px] font-semibold text-white"
        style={{ backgroundColor: color }}
      >
        返回 Ropet
      </button>
    </PrototypePhone>
  );
};

const OpeningScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pet } = usePetStore();
  const deviceName = pet?.name || '肉派派';
  const source = searchParams.get('source') === 'trial' ? 'trial' : 'subscription';
  const { activateTrial, activateSubscription, setPaymentState, trialCards, selectedTrialCardId } = useSubscriptionStore();
  const selectedTrialCard = trialCards.find((card) => card.id === selectedTrialCardId)
    ?? trialCards.find((card) => card.status === 'available');

  useEffect(() => {
    setPaymentState('opening');
    const timer = window.setTimeout(() => {
      if (source === 'trial') activateTrial();
      else activateSubscription();
      navigate(`/subscription/success?source=${source}`);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [activateSubscription, activateTrial, navigate, setPaymentState, source]);

  return (
    <PhoneShell title="正在开通" backTo="/">
      <div className="pt-20 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-[#f0ebff] flex items-center justify-center">
          <RefreshCw className="w-10 h-10 animate-spin text-[#8b66ef]" />
        </div>
        <h2 className="mt-7 text-[24px] font-bold">{source === 'trial' ? `正在启用 ${selectedTrialCard?.days ?? ''} 天体验` : '已支付，正在开通对话'}</h2>
        <p className="mx-auto mt-3 max-w-[300px] text-[14px] leading-6 text-[#8b8792]">服务端正在为设备 {deviceName} 开启订阅对话，请勿再次付款。</p>
      </div>
    </PhoneShell>
  );
};

const SuccessScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pet } = usePetStore();
  const deviceName = pet?.name || '肉派派';
  const { entitlement, expiryDate, selectedPlan, nextChargeDate, trialCards, activeTrialCardId } = useSubscriptionStore();
  const trial = searchParams.get('source') === 'trial' || entitlement === 'trial';
  const activeTrialCard = trialCards.find((card) => card.id === activeTrialCardId);

  return (
    <PhoneShell title="开通成功" backTo="/">
      <div className="pt-8 text-center">
        <div className="mx-auto w-[86px] h-[86px] rounded-full bg-[#e2f8eb] text-[#0b8a57] flex items-center justify-center">
          <Check size={46} strokeWidth={2.5} />
        </div>
        <h2 className="mt-6 text-[27px] font-bold">{trial ? `${activeTrialCard?.days ?? ''} 天体验已开启` : 'Ropet Plus 已开通'}</h2>
        <p className="mt-2 text-[14px] text-[#8b8792]">设备 {deviceName} 现在可以使用语音对话</p>
      </div>

      <div className="mt-8 rounded-[22px] border border-[#ece9f1] px-5">
        <div className="flex justify-between py-4 border-b border-[#eeeeee]"><span className="text-[#8b8792]">权益设备</span><strong>{deviceName}</strong></div>
        <div className="flex justify-between py-4 border-b border-[#eeeeee]"><span className="text-[#8b8792]">有效期至</span><strong>{expiryDate}</strong></div>
        {!trial && (
          <>
            <div className="flex justify-between py-4 border-b border-[#eeeeee]"><span className="text-[#8b8792]">购买方式</span><strong>{selectedPlan === 'auto-renew' ? '每月自动续费' : '买 1 个月'}</strong></div>
            {nextChargeDate && <div className="flex justify-between py-4"><span className="text-[#8b8792]">下次扣款日</span><strong>{nextChargeDate}</strong></div>}
          </>
        )}
      </div>

      <PrimaryButton onClick={() => navigate('/dialogue-mode')} sub="首页对话按钮已同步开启">
        开始对话
      </PrimaryButton>
    </PhoneShell>
  );
};

const FailureScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'payment-failed';
  const signFailure = reason.startsWith('sign');
  const cancelled = reason.endsWith('cancelled');
  const title = signFailure ? (cancelled ? '已取消自动续费签约' : '自动续费签约失败') : (cancelled ? '已取消本次付款' : '本次支付失败');

  return (
    <PhoneShell title="未完成开通" backTo="/subscription">
      <div className="pt-16 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-[#fff0ef] text-[#d24d43] flex items-center justify-center">
          <XCircle size={43} />
        </div>
        <h2 className="mt-6 text-[24px] font-bold">{title}</h2>
        <p className="mx-auto mt-3 max-w-[300px] text-[14px] leading-6 text-[#8b8792]">
          {signFailure ? '本次尚未创建支付宝支付单，也不会产生扣款。' : '未确认扣款成功，不会开通对话权益。'}
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/subscription/alipay')}
        className="mt-8 w-full h-[56px] rounded-[22px] bg-[#f2edff] text-[#7652df] font-semibold"
      >
        重新支付
      </button>
      <button type="button" onClick={() => navigate('/subscription')} className="mt-3 w-full h-[52px] text-[14px] text-[#77727f]">返回套餐页</button>
    </PhoneShell>
  );
};

const StatusScreen = () => {
  const navigate = useNavigate();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { pet } = usePetStore();
  const deviceName = pet?.name || '肉派派';
  const {
    entitlement,
    expiryDate,
    selectedPlan,
    subscribedPlan,
    paymentMethod,
    autoRenewEnabled,
    nextChargeDate,
    resetPrototype,
  } = useSubscriptionStore();
  const trial = entitlement === 'trial';
  const currentPlan = subscribedPlan ?? selectedPlan;
  const benefits = [
    '不限时长语音对话',
    '长期记忆能力',
    '更高的情绪感知能力',
    '深度交流能力',
    '日记全面升级',
    '每月 2W 积分权益',
  ];

  return (
    <PhoneShell title="当前设备权益" backTo="/dialogue-mode">
      <section className="rounded-[22px] bg-[#f5f3f8] p-4">
        <div className="flex items-center">
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e9e3f6]">
            <img src="/images/personality/joybean.png" alt={deviceName} className="h-[68px] w-[68px] object-contain" />
          </div>
          <div className="ml-4 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-[20px] font-bold text-[#222127]">{deviceName}</h2>
              <span className="rounded-full bg-[#e8e0ff] px-2 py-0.5 text-[10px] font-semibold text-[#7652df]">当前设备</span>
            </div>
            <p className="mt-1 text-[13px] font-medium text-[#7652df]">
              {trial ? 'Ropet Plus 体验权益' : 'Ropet Plus 会员'}
            </p>
            <p className="mt-1 text-[11px] text-[#96919c]">会员权益仅绑定此设备，不跟随用户账号转移</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-[14px] bg-white px-4 py-3">
          <span className="text-[12px] text-[#8b8792]">权益有效期至</span>
          <strong className="text-[13px] text-[#222127]">{expiryDate}</strong>
        </div>
      </section>

      <section className="mt-5 rounded-[20px] border border-[#ece9f1] bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#29262e]">当前可用权益</h2>
          <span className="text-[10px] font-medium text-[#8b66ef]">已全部生效</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex min-h-[46px] items-center rounded-[12px] bg-[#f6f3ff] px-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8b66ef] text-white">
                <Check size={13} strokeWidth={3} />
              </span>
              <span className="ml-2 text-[11px] font-medium leading-4 text-[#4d4657]">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {trial ? (
        <section className="mt-5 rounded-[20px] border border-[#ded5fa] bg-[#f7f4ff] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-[#392c58]">升级为 Ropet Plus</h2>
              <p className="mt-1 text-[11px] leading-5 text-[#817593]">
                体验权益不影响开通会员，订阅后权益时长将继续作用于当前设备。
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#e8e0ff] px-2 py-1 text-[9px] font-semibold text-[#7652df]">
              可开通
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/subscription?returnTo=/subscription/status')}
            className="mt-4 flex h-[48px] w-full items-center justify-center rounded-[17px] bg-[#8b66ef] text-[14px] font-semibold text-white"
          >
            开通 Ropet Plus
            <ChevronRight size={17} className="ml-1" />
          </button>
        </section>
      ) : (
        <div className="mt-5 rounded-[20px] border border-[#ece9f1] px-4">
          <>
            <button
              type="button"
              onClick={() => navigate('/subscription?returnTo=/subscription/status')}
              className="flex w-full items-center justify-between border-b border-[#eeeeee] py-4 text-left"
            >
              <span className="text-[#8b8792]">当前套餐</span>
              <span className="flex items-center gap-1">
                <strong>{currentPlan === 'auto-renew' ? '连续包月' : '1 个月'}</strong>
                <ChevronRight size={17} className="text-[#bbb7c0]" />
              </span>
            </button>
            <div className="flex justify-between border-b border-[#eeeeee] py-4"><span className="text-[#8b8792]">支付方式</span><strong>{paymentMethod === 'wechat' ? '微信支付' : '支付宝'}</strong></div>
            <div className="flex justify-between py-4"><span className="text-[#8b8792]">{autoRenewEnabled ? '下次扣款' : '续费方式'}</span><strong>{autoRenewEnabled ? nextChargeDate : '到期不续费'}</strong></div>
          </>
        </div>
      )}

      {!trial && (
        <button type="button" onClick={() => navigate('/subscription/manage')} className="mt-4 w-full h-[56px] rounded-[20px] bg-[#f3efff] px-4 flex items-center justify-between text-[#6849cc] font-semibold">
          查看历史订单
          <ChevronRight size={20} />
        </button>
      )}

      <button
        type="button"
        onClick={() => setShowResetConfirm(true)}
        className="mt-4 flex h-[48px] w-full items-center justify-center gap-2 rounded-[18px] border border-[#e2dfe7] bg-white text-[12px] font-semibold text-[#77727f]"
      >
        <RotateCcw size={15} />
        恢复为未订阅状态
      </button>
      <p className="mt-1.5 text-center text-[9px] text-[#aaa5ae]">仅用于原型演示</p>

      {showResetConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/35 px-8">
          <div className="w-full rounded-[24px] bg-white px-6 py-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f3efff] text-[#7652df]">
              <RotateCcw size={24} />
            </div>
            <h2 className="mt-4 text-[20px] font-bold text-[#222127]">恢复为未订阅状态？</h2>
            <p className="mt-2 text-[13px] leading-6 text-[#8b8792]">
              会员、体验卡和对话授权状态将全部恢复，可重新体验完整流程。
            </p>
            <button
              type="button"
              onClick={() => {
                resetPrototype();
                navigate('/');
              }}
              className="mt-5 h-[50px] w-full rounded-[20px] bg-[#8b66ef] text-[15px] font-semibold text-white"
            >
              确认恢复
            </button>
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="mt-2 h-[44px] w-full text-[14px] text-[#77727f]"
            >
              暂不恢复
            </button>
          </div>
        </div>
      )}
    </PhoneShell>
  );
};

const ChannelAction: React.FC<{
  order: SubscriptionOrder;
  onInvoice: (order: SubscriptionOrder) => void;
}> = ({ order, onInvoice }) => {
  if (order.paymentMethod === 'alipay' || order.paymentMethod === 'wechat') {
    return (
      <button
        type="button"
        onClick={() => onInvoice(order)}
        className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[#8b66ef]"
      >
        查看发票说明
        <ChevronRight size={13} />
      </button>
    );
  }

  const label = order.paymentMethod === 'apple'
    ? '查看 Apple 收据'
    : order.paymentMethod === 'google'
      ? '前往 Google Payments'
      : '查看收据';

  return (
    <button
      type="button"
      onClick={() => window.alert(
        order.paymentMethod === 'apple' || order.paymentMethod === 'google'
          ? `该订单由 ${channelName(order.paymentMethod)} 支付渠道处理，发票或收据请前往对应渠道查看。`
          : `正在打开 ${channelName(order.paymentMethod)} 收据`,
      )}
      className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[#8b66ef]"
    >
      {label}
      <ExternalLink size={13} />
    </button>
  );
};

const OrderCard: React.FC<{
  order: SubscriptionOrder;
  onInvoice: (order: SubscriptionOrder) => void;
}> = ({ order, onInvoice }) => (
  <section className="rounded-[20px] border border-[#ece9f1] bg-white p-4">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-[16px] font-semibold text-[#222127]">
          Ropet Plus · {order.plan === 'auto-renew' ? '连续包月' : '1 个月'}
        </h3>
        <div className="mt-1">
          <CopyOrderNumber orderNo={order.orderNo} />
        </div>
      </div>
      <span className="rounded-full bg-[#ecf8f1] px-2.5 py-1 text-[10px] font-semibold text-[#23835a]">
        {orderStatusLabel(order.status)}
      </span>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-y-3 text-[12px]">
      <span className="text-[#96919c]">权益设备</span><strong className="text-right">{order.deviceName === 'KAMOMO' || order.deviceName === 'ropet' ? '肉派派' : order.deviceName || '肉派派'}</strong>
      <span className="text-[#96919c]">支付渠道</span><strong className="text-right">{channelName(order.paymentMethod) || '支付宝'}</strong>
      <span className="text-[#96919c]">支付时间</span><strong className="text-right">{order.paidAt || '—'}</strong>
      <span className="text-[#96919c]">实付金额</span><strong className="text-right">￥{formatOrderAmount(order.amount)}</strong>
    </div>
    <ChannelAction order={order} onInvoice={onInvoice} />
  </section>
);

const TrialUsageCard: React.FC<{
  card: TrialCard;
  deviceName: string;
  highlighted?: boolean;
}> = ({ card, deviceName, highlighted = false }) => (
  <section className={`rounded-[20px] border bg-white p-4 ${
    highlighted
      ? 'border-[#a98df2] shadow-[0_8px_22px_rgba(107,73,202,0.12)]'
      : 'border-[#ece9f1]'
  }`}>
    <div className="flex items-start justify-between">
      <div className="flex items-center">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#eee8ff] text-[#7652df]">
          <Gift size={20} />
        </span>
        <div className="ml-3">
          <h3 className="text-[15px] font-semibold text-[#222127]">{card.days} 天体验卡</h3>
          <div className="mt-1">
            <CopyOrderNumber orderNo={card.orderNo || fallbackTrialOrderNo(card)} />
          </div>
        </div>
      </div>
      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        card.status === 'active'
          ? 'bg-[#eee8ff] text-[#704bd4]'
          : 'bg-[#eeeeef] text-[#77727f]'
      }`}>
        {card.status === 'active' ? '使用中' : '已使用'}
      </span>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-y-2 border-t border-[#efedf2] pt-3 text-[12px]">
      <span className="text-[#96919c]">权益设备</span>
      <strong className="text-right text-[#4d4852]">{deviceName}</strong>
      <span className="text-[#96919c]">使用时间</span>
      <strong className="text-right text-[#4d4852]">{card.usedAt || '—'}</strong>
    </div>
  </section>
);

const OrderHistoryScreen: React.FC<{
  title: string;
  backTo: string;
  showReset?: boolean;
}> = ({ title, backTo, showReset = false }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pet } = usePetStore();
  const deviceName = pet?.name || '肉派派';
  const { orders, trialCards, resetPrototype } = useSubscriptionStore();
  const selectedOrderId = searchParams.get('orderId');
  const selectedTrialCardId = searchParams.get('trialCardId');
  const trialCardOrders = trialCards.filter((card) => card.status === 'active' || card.status === 'used');
  const hasRecords = orders.length > 0 || trialCardOrders.length > 0;
  const [invoiceOrder, setInvoiceOrder] = useState<SubscriptionOrder | null>(
    orders.find((order) => order.id === selectedOrderId) ?? null,
  );
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <PhoneShell title={title} backTo={backTo}>
      {hasRecords ? (
        <div className="space-y-6">
          {orders.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-[#29262e]">支付订单</h2>
                <span className="text-[10px] text-[#aaa6ae]">{orders.length} 笔</span>
              </div>
              <div className="space-y-3">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onInvoice={setInvoiceOrder}
                  />
                ))}
              </div>
            </section>
          )}

          {trialCardOrders.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-[#29262e]">体验卡订单</h2>
                <span className="text-[10px] text-[#aaa6ae]">{trialCardOrders.length} 笔</span>
              </div>
              <div className="space-y-3">
                {trialCardOrders.map((card) => (
                  <TrialUsageCard
                    key={card.id}
                    card={card}
                    deviceName={deviceName}
                    highlighted={card.id === selectedTrialCardId}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="pt-28 text-center">
          <ReceiptText size={44} className="mx-auto text-[#d7d3dc]" />
          <h2 className="mt-4 text-[18px] font-semibold">暂无订单记录</h2>
          <p className="mt-2 text-[12px] text-[#96919c]">订阅订单和体验卡订单会展示在这里。</p>
          <button
            type="button"
            onClick={() => navigate('/subscription')}
            className="mt-5 h-10 rounded-full bg-[#8b66ef] px-5 text-[13px] font-semibold text-white"
          >
            查看套餐
          </button>
        </div>
      )}

      {showReset && (
        <>
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-[20px] border border-[#e2dfe7] bg-white text-[13px] font-semibold text-[#77727f]"
          >
            <RotateCcw size={16} />
            恢复为未订阅状态
          </button>
          <p className="mt-2 text-center text-[10px] leading-5 text-[#aaa5ae]">仅用于原型演示</p>
        </>
      )}

      {invoiceOrder && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/35 px-8">
          <div className="w-full rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
            <h2 className="text-center text-[19px] font-bold">
              {invoiceOrder.paymentMethod === 'wechat' ? '微信支付开票教程' : '支付宝开票教程'}
            </h2>
            <p className="mt-2 text-center text-[12px] leading-5 text-[#8b8792]">
              订单 {invoiceOrder.orderNo} · ￥{formatOrderAmount(invoiceOrder.amount)}
            </p>
            <div className="mt-5 space-y-3 rounded-[16px] bg-[#f7f5fa] px-4 py-4 text-[12px] leading-5 text-[#5f5a64]">
              {(invoiceOrder.paymentMethod === 'wechat'
                ? [
                    '打开微信，进入“我 → 服务 → 钱包”。',
                    '点击“账单”，找到这笔 Ropet Plus 订单。',
                    '进入订单详情，按页面提示申请发票或联系商户。',
                  ]
                : [
                    '打开支付宝，进入“我的 → 账单”。',
                    '找到这笔 Ropet Plus 订单并进入详情。',
                    '点击“开发票”或“申请发票”，按页面提示填写抬头。',
                  ]).map((step, index) => (
                    <div key={step} className="flex items-start">
                      <span className="mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8b66ef] text-[10px] font-semibold text-white">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
            </div>
            <p className="mt-4 text-center text-[11px] leading-5 text-[#99949e]">
              实际入口以支付渠道当前页面为准。
            </p>
            <button
              type="button"
              onClick={() => setInvoiceOrder(null)}
              className="mt-5 h-12 w-full rounded-[20px] bg-[#8b66ef] text-[14px] font-semibold text-white"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/35 px-8">
          <div className="w-full rounded-[24px] bg-white px-6 py-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f3efff] text-[#7652df]">
              <RotateCcw size={24} />
            </div>
            <h2 className="mt-4 text-[20px] font-bold text-[#222127]">恢复为未订阅状态？</h2>
            <p className="mt-2 text-[13px] leading-6 text-[#8b8792]">恢复后可重新体验完整订阅流程。</p>
            <button
              type="button"
              onClick={() => {
                resetPrototype();
                navigate('/');
              }}
              className="mt-5 h-[50px] w-full rounded-[20px] bg-[#8b66ef] text-[15px] font-semibold text-white"
            >
              确认恢复
            </button>
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="mt-2 h-[44px] w-full text-[14px] text-[#77727f]"
            >
              暂不恢复
            </button>
          </div>
        </div>
      )}
    </PhoneShell>
  );
};

const AccountScreen = () => (
  <OrderHistoryScreen title="订阅与订单" backTo="/pet-profile" showReset />
);

const OrdersScreen = () => (
  <OrderHistoryScreen title="历史订单" backTo="/subscription/status" />
);

const SubscriptionFlow: React.FC<Props> = ({ screen }) => {
  if (screen === 'plans') return <PlansScreen />;
  if (screen === 'payment-method') return <PaymentMethodScreen />;
  if (screen === 'alipay') return <PaymentPasswordScreen channel="alipay" />;
  if (screen === 'wechat') return <PaymentPasswordScreen channel="wechat" />;
  if (screen === 'alipay-result') return <ChannelPaymentResultScreen channel="alipay" />;
  if (screen === 'wechat-result') return <ChannelPaymentResultScreen channel="wechat" />;
  if (screen === 'opening') return <OpeningScreen />;
  if (screen === 'success') return <SuccessScreen />;
  if (screen === 'failure') return <FailureScreen />;
  if (screen === 'status') return <StatusScreen />;
  if (screen === 'orders') return <OrdersScreen />;
  if (screen === 'invoices') return <AccountScreen />;
  return <AccountScreen />;
};

export default SubscriptionFlow;
