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
  formatSubscriptionDate,
  isDateExpired,
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

const projectedSubscriptionDate = (entitlement: string, expiryDate: string) => {
  const hasActiveEntitlement = entitlement !== 'none'
    && Boolean(expiryDate)
    && !isDateExpired(expiryDate);
  const [year, month, day] = expiryDate.split('.').map(Number);
  const baseDate = hasActiveEntitlement && year && month && day
    ? new Date(year, month - 1, day)
    : new Date();
  baseDate.setMonth(baseDate.getMonth() + 1);
  return formatSubscriptionDate(baseDate);
};

const channelName = (method: PaymentMethod) => ({
  alipay: '支付宝',
  wechat: '微信支付',
  apple: 'Apple IAP',
  google: 'Google Play',
  stripe: 'Stripe',
  paypal: 'PayPal',
}[method]);

const orderStatusLabel = (status: SubscriptionOrder['status']) => ({
  creating: '创建中',
  unpaid: '未付款',
  cancelled: '取消付款',
  paid: '支付成功',
  'refund-reviewing': '退款审核中',
  refunding: '退款中',
  refunded: '已退款',
}[status] ?? '未付款');

const orderStatusClassName = (status: SubscriptionOrder['status']) => ({
  creating: 'bg-[#f2edff] text-[#7652df]',
  unpaid: 'bg-[#fff4df] text-[#a66a16]',
  cancelled: 'bg-[#eeeeef] text-[#77727f]',
  paid: 'bg-[#ecf8f1] text-[#23835a]',
  'refund-reviewing': 'bg-[#f2edff] text-[#7652df]',
  refunding: 'bg-[#fff4df] text-[#a66a16]',
  refunded: 'bg-[#eeeeef] text-[#77727f]',
}[status] ?? 'bg-[#eeeeef] text-[#77727f]');

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
    expiryDate,
    selectedPlan,
    subscribedPlan,
    setSelectedPlan,
  } = useSubscriptionStore();
  const [agreementChecked, setAgreementChecked] = useState(true);
  const currentPlan = entitlement === 'subscription' && !isDateExpired(expiryDate)
    ? subscribedPlan
    : null;
  const selectingCurrentPlan = currentPlan === selectedPlan;
  const returnTo = searchParams.get('returnTo') || '/dialogue-mode';
  const projectedDate = projectedSubscriptionDate(entitlement, expiryDate);

  return (
    <PrototypePhone>
      <PrototypeStatusBar />
      <PrototypeHeader onBack={() => navigate(returnTo)} />
      <div className="absolute left-1/2 top-[70px] w-full -translate-x-1/2 text-center">
        <img src="/images/personality/joybean.png" alt="" className="absolute left-1/2 top-[-12px] w-[230px] -translate-x-1/2 opacity-[0.08] blur-[2px]" />
        <div className="relative">
          <HiMark />
          <h1 className="mt-2 text-[24px] font-semibold text-[#222127]">获取 Ropet Plus</h1>
          <p className="mt-1 text-[13px] text-[#a09ba5]">解锁完整悄悄话能力</p>
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
        <div className="mt-3 flex items-center justify-between rounded-[14px] bg-[#f7f4ff] px-4 py-2.5 text-[11px]">
          <span className="text-[#817a8a]">预计权益到期</span>
          <strong className="text-[#4d3c7b]">{projectedDate}</strong>
          <span className="h-4 w-px bg-[#ddd5f3]" />
          <span className="text-[#817a8a]">
            {selectedPlan === 'auto-renew' ? '首次续费' : '到期后'}
          </span>
          <strong className="text-[#4d3c7b]">
            {selectedPlan === 'auto-renew' ? projectedDate : '不自动续费'}
          </strong>
        </div>
        <button
          type="button"
          disabled={!agreementChecked || selectingCurrentPlan}
          aria-label={selectingCurrentPlan ? '当前套餐使用中' : currentPlan ? '续费' : '立即订阅'}
          onClick={() => navigate('/subscription/payment-method')}
          className={`mt-5 h-[52px] w-full rounded-[22px] text-[16px] font-medium text-white ${
            agreementChecked && !selectingCurrentPlan ? 'bg-[#8b66ef]' : 'cursor-not-allowed bg-[#c9c5d4]'
          }`}
        >
          {selectingCurrentPlan ? '当前套餐使用中' : currentPlan ? '续费' : '立即订阅'}
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
  const {
    entitlement,
    expiryDate,
    selectedPlan,
    createSubscriptionOrder,
    markLatestOrderUnpaid,
  } = useSubscriptionStore();
  const [selectedMethod, setSelectedMethod] = useState<'alipay' | 'wechat' | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const recurring = selectedPlan === 'auto-renew';
  const amount = planAmount(selectedPlan);
  const projectedDate = projectedSubscriptionDate(entitlement, expiryDate);

  useEffect(() => {
    if (!creatingOrder || !selectedMethod) return;
    const timer = window.setTimeout(() => {
      markLatestOrderUnpaid();
      navigate(`/subscription/${selectedMethod}`);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [creatingOrder, markLatestOrderUnpaid, navigate, selectedMethod]);

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
          <div className="mt-3 grid grid-cols-2 gap-y-2 rounded-[12px] bg-[#f7f5fa] px-3 py-3 text-[11px]">
            <span className="text-[#96919c]">权益到期日</span>
            <strong className="text-right text-[#4d4852]">{projectedDate}</strong>
            <span className="text-[#96919c]">{recurring ? '首次续费日' : '续费方式'}</span>
            <strong className="text-right text-[#4d4852]">
              {recurring ? projectedDate : '到期后不续费'}
            </strong>
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
          createSubscriptionOrder(selectedMethod);
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
  const { selectedPlan, setPaymentState, cancelLatestOrder } = useSubscriptionStore();
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
      <PrototypeHeader
        title={isAlipay ? '支付宝付款' : '微信支付'}
        onBack={() => {
          cancelLatestOrder();
          navigate('/subscription/payment-method');
        }}
      />

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
  const { selectedPlan, markLatestOrderPaid } = useSubscriptionStore();
  const isAlipay = channel === 'alipay';
  const color = isAlipay ? '#1677ff' : '#07c160';
  const amount = planAmount(selectedPlan);

  useEffect(() => {
    markLatestOrderPaid();
  }, [markLatestOrderPaid]);

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
        onClick={() => navigate('/subscription/opening?source=subscription')}
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
    ?? trialCards.find((card) => card.status === 'used');

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
        <h2 className="mt-7 text-[24px] font-bold">{source === 'trial' ? `正在启用 ${selectedTrialCard?.days ?? ''} 天体验` : '已支付，正在开通会员'}</h2>
        <p className="mx-auto mt-3 max-w-[300px] text-[14px] leading-6 text-[#8b8792]">
          {source === 'trial'
            ? `正在为设备 ${deviceName} 开启体验权益。`
            : `正在为设备 ${deviceName} 开通 Ropet Plus，请勿再次付款。`}
        </p>
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
        <p className="mt-2 text-[14px] text-[#8b8792]">
          {trial
            ? `设备 ${deviceName} 现在可以使用悄悄话`
            : `设备 ${deviceName} 的会员权益已生效`}
        </p>
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

      <PrimaryButton
        onClick={() => navigate(
          trial
            ? '/dialogue-mode'
            : `/subscription/voice-consent?source=subscription&activated=1&returnTo=${encodeURIComponent('/subscription/success?source=subscription')}`,
        )}
        sub={trial ? '首页悄悄话入口已同步开启' : '完成语音权限授权后开启悄悄话'}
      >
        {trial ? '开始悄悄话' : '同意协议并开启悄悄话'}
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
          {signFailure ? '本次尚未创建支付宝支付单，也不会产生扣款。' : '未确认扣款成功，不会开通悄悄话权益。'}
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
  const [showRenewalGuide, setShowRenewalGuide] = useState(false);
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
  const expired = entitlement !== 'none' && isDateExpired(expiryDate);
  const currentPlan = subscribedPlan ?? selectedPlan;
  const benefits = [
    '不限时长悄悄话',
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
              {expired && <span className="ml-2 text-[#b46464]">已过期</span>}
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
          <span className={`text-[10px] font-medium ${expired ? 'text-[#a39ea8]' : 'text-[#8b66ef]'}`}>
            {expired ? '权益已失效' : '已全部生效'}
          </span>
        </div>
        <div className={`mt-3 grid grid-cols-2 gap-2 ${expired ? 'opacity-45' : ''}`}>
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

      <section className="mt-4 rounded-[18px] bg-[#f7f4ff] px-4 py-3 text-[11px] leading-5 text-[#75679a]">
        当前权益展示的是这台设备的状态；历史订单只展示当前账号自己的支付订单。若权益由其他账号开通，订单详情仅购买账号可见。
      </section>

      {trial && !expired ? (
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

      {expired && (
        <button
          type="button"
          onClick={() => navigate('/subscription?returnTo=/subscription/status')}
          className="mt-4 flex h-[52px] w-full items-center justify-center rounded-[18px] bg-[#8b66ef] text-[14px] font-semibold text-white"
        >
          续费 Ropet Plus
        </button>
      )}

      {!trial && !expired && autoRenewEnabled && (
        <button
          type="button"
          onClick={() => setShowRenewalGuide(true)}
          className="mt-4 flex h-[48px] w-full items-center justify-center rounded-[18px] border border-[#ded9e5] bg-white text-[13px] font-medium text-[#6f6975]"
        >
          取消自动续费
        </button>
      )}

      <button
        type="button"
        onClick={() => navigate('/subscription/orders')}
        className="mt-4 flex h-[56px] w-full items-center justify-between rounded-[20px] bg-[#f3efff] px-4 font-semibold text-[#6849cc]"
      >
        查看历史订单
        <ChevronRight size={20} />
      </button>

      <button
        type="button"
        onClick={() => setShowResetConfirm(true)}
        className="mt-4 flex h-[48px] w-full items-center justify-center gap-2 rounded-[18px] border border-[#e2dfe7] bg-white text-[12px] font-semibold text-[#77727f]"
      >
        <RotateCcw size={15} />
        恢复为未订阅状态
      </button>
      <p className="mt-1.5 text-center text-[9px] text-[#aaa5ae]">仅用于原型演示</p>

      {showRenewalGuide && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/35 px-8">
          <div className="w-full rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
            <h2 className="text-center text-[19px] font-bold">取消自动续费</h2>
            <p className="mt-2 text-center text-[12px] leading-5 text-[#8b8792]">
              自动续费由{paymentMethod === 'wechat' ? '微信支付' : '支付宝'}管理，请前往支付渠道关闭。
            </p>
            <div className="mt-5 rounded-[16px] bg-[#f7f5fa] px-4 py-4 text-[12px] leading-6 text-[#5f5a64]">
              {paymentMethod === 'wechat' ? (
                <p>微信：我 → 服务 → 钱包 → 支付设置 → 自动续费 → Ropet Plus → 关闭扣费服务</p>
              ) : (
                <p>支付宝：我的 → 设置 → 支付设置 → 免密支付/自动扣款 → Ropet Plus → 关闭服务</p>
              )}
            </div>
            <p className="mt-4 text-center text-[11px] leading-5 text-[#99949e]">
              关闭后当前权益仍可使用至 {expiryDate}。
            </p>
            <button
              type="button"
              onClick={() => setShowRenewalGuide(false)}
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
            <p className="mt-2 text-[13px] leading-6 text-[#8b8792]">
              会员、体验卡和悄悄话授权状态将全部恢复，可重新体验完整流程。
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
  onRefund: (order: SubscriptionOrder) => void;
}> = ({ order, onInvoice, onRefund }) => {
  if (order.paymentMethod === 'alipay' || order.paymentMethod === 'wechat') {
    return (
      <div className="mt-3 flex items-center gap-5">
        {order.status === 'paid' && (
          <button
            type="button"
            onClick={() => onInvoice(order)}
            className="flex items-center gap-1 text-[11px] font-medium text-[#8b66ef]"
          >
            查看发票说明
            <ChevronRight size={13} />
          </button>
        )}
        <button
          type="button"
          onClick={() => onRefund(order)}
          className="flex items-center gap-1 text-[11px] font-medium text-[#77727f]"
        >
          {order.status === 'paid' ? '退款与售后' : '查看退款进度'}
          <ChevronRight size={13} />
        </button>
      </div>
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
  onRefund: (order: SubscriptionOrder) => void;
}> = ({ order, onInvoice, onRefund }) => {
  const hasPaymentTime = ['paid', 'refund-reviewing', 'refunding', 'refunded'].includes(order.status);
  return (
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
      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${orderStatusClassName(order.status)}`}>
        {orderStatusLabel(order.status)}
      </span>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-y-3 text-[12px]">
      <span className="text-[#96919c]">权益设备</span><strong className="text-right">{order.deviceName === 'KAMOMO' || order.deviceName === 'ropet' ? '肉派派' : order.deviceName || '肉派派'}</strong>
      <span className="text-[#96919c]">支付渠道</span><strong className="text-right">{channelName(order.paymentMethod) || '支付宝'}</strong>
      <span className="text-[#96919c]">{hasPaymentTime ? '支付时间' : '创建时间'}</span>
      <strong className="text-right">{hasPaymentTime ? order.paidAt || '—' : order.createdAt || '—'}</strong>
      <span className="text-[#96919c]">实付金额</span><strong className="text-right">￥{formatOrderAmount(order.amount)}</strong>
    </div>
    {hasPaymentTime && (
      <ChannelAction order={order} onInvoice={onInvoice} onRefund={onRefund} />
    )}
  </section>
  );
};

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
      <span className="rounded-full bg-[#eeeeef] px-2.5 py-1 text-[10px] font-semibold text-[#77727f]">
        已使用
      </span>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-y-2 border-t border-[#efedf2] pt-3 text-[12px]">
      <span className="text-[#96919c]">权益设备</span>
      <strong className="text-right text-[#4d4852]">{deviceName}</strong>
      <span className="text-[#96919c]">兑换时间</span>
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
  const {
    orders,
    trialCards,
    approveRefund,
    completeRefund,
    requestRefund,
    resetPrototype,
  } = useSubscriptionStore();
  const selectedOrderId = searchParams.get('orderId');
  const selectedTrialCardId = searchParams.get('trialCardId');
  const trialCardOrders = trialCards.filter((card) => card.status === 'used');
  const [activeTab, setActiveTab] = useState<'subscription' | 'trial'>(
    selectedTrialCardId ? 'trial' : 'subscription',
  );
  const activeRecords = activeTab === 'subscription' ? orders : trialCardOrders;
  const [invoiceOrder, setInvoiceOrder] = useState<SubscriptionOrder | null>(
    orders.find((order) => order.id === selectedOrderId) ?? null,
  );
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const refundOrder = orders.find((order) => order.id === refundOrderId) ?? null;

  return (
    <PhoneShell title={title} backTo={backTo}>
      <div className="mb-5 grid grid-cols-2 rounded-[15px] bg-[#f0eef3] p-1">
        <button
          type="button"
          onClick={() => setActiveTab('subscription')}
          className={`h-10 rounded-[12px] text-[13px] font-semibold transition-colors ${
            activeTab === 'subscription'
              ? 'bg-white text-[#29262e] shadow-sm'
              : 'text-[#8b8792]'
          }`}
        >
          订阅订单 {orders.length > 0 && <span className="ml-1 text-[10px]">({orders.length})</span>}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('trial')}
          className={`h-10 rounded-[12px] text-[13px] font-semibold transition-colors ${
            activeTab === 'trial'
              ? 'bg-white text-[#29262e] shadow-sm'
              : 'text-[#8b8792]'
          }`}
        >
          体验卡 {trialCardOrders.length > 0 && <span className="ml-1 text-[10px]">({trialCardOrders.length})</span>}
        </button>
      </div>

      {activeRecords.length > 0 ? (
        <div className="space-y-3">
          {activeTab === 'subscription'
            ? orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onInvoice={setInvoiceOrder}
                  onRefund={(selectedOrder) => setRefundOrderId(selectedOrder.id)}
                />
              ))
            : trialCardOrders.map((card) => (
                <TrialUsageCard
                  key={card.id}
                  card={card}
                  deviceName={deviceName}
                  highlighted={card.id === selectedTrialCardId}
                />
              ))}
        </div>
      ) : (
        <div className="pt-24 text-center">
          <ReceiptText size={44} className="mx-auto text-[#d7d3dc]" />
          <h2 className="mt-4 text-[18px] font-semibold">
            {activeTab === 'subscription' ? '暂无订阅订单' : '暂无体验卡记录'}
          </h2>
          <p className="mt-2 text-[12px] text-[#96919c]">
            {activeTab === 'subscription' ? '购买套餐后，订单会展示在这里。' : '使用体验卡后，兑换记录会展示在这里。'}
          </p>
          <button
            type="button"
            onClick={() => navigate(activeTab === 'subscription' ? '/subscription' : '/subscription/trial')}
            className="mt-5 h-10 rounded-full bg-[#8b66ef] px-5 text-[13px] font-semibold text-white"
          >
            {activeTab === 'subscription' ? '查看套餐' : '查看体验卡'}
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
              Ropet 开票指引
            </h2>
            <p className="mt-2 text-center text-[12px] leading-5 text-[#8b8792]">
              订单 {invoiceOrder.orderNo} · ￥{formatOrderAmount(invoiceOrder.amount)}
            </p>
            <div className="mt-5 space-y-3 rounded-[16px] bg-[#f7f5fa] px-4 py-4 text-[12px] leading-5 text-[#5f5a64]">
              {[
                '发送邮件至 customerservice@ropetai.com，并说明需要为 Ropet Plus 订单开具发票。',
                `在邮件中提供订单号 ${invoiceOrder.orderNo}，方便核对付款记录。`,
                '提供发票抬头、纳税人识别号、接收邮箱和联系人信息。',
                '信息确认后，电子发票将发送至你提供的邮箱。',
              ].map((step, index) => (
                    <div key={step} className="flex items-start">
                      <span className="mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8b66ef] text-[10px] font-semibold text-white">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
            </div>
            <p className="mt-4 text-center text-[11px] leading-5 text-[#99949e]">
              开票咨询邮箱：customerservice@ropetai.com
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

      {refundOrder && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/35 px-8">
          <div className="w-full rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
            <h2 className="text-center text-[19px] font-bold">
              {refundOrder.status === 'paid' && '申请退款'}
              {refundOrder.status === 'refund-reviewing' && '人工审核中'}
              {refundOrder.status === 'refunding' && '支付宝退款中'}
              {refundOrder.status === 'refunded' && '退款成功'}
            </h2>
            <p className="mt-2 text-center text-[12px] leading-5 text-[#8b8792]">
              订单 {refundOrder.orderNo} · ￥{formatOrderAmount(refundOrder.amount)}
            </p>

            {refundOrder.status === 'paid' && (
              <>
                <div className="mt-5 space-y-3 rounded-[16px] bg-[#f7f5fa] px-4 py-4 text-[12px] leading-5 text-[#5f5a64]">
                  {[
                    '发送邮件至 customerservice@ropetai.com，说明退款原因。',
                    `在邮件中提供订单号 ${refundOrder.orderNo} 和付款账号信息。`,
                    '工作人员将人工判断订单是否符合退款条件。',
                    '审核通过后，由后端发起支付宝原路退款。',
                    '退款成功后，当前设备的会员权益将关闭。',
                  ].map((step, index) => (
                    <div key={step} className="flex items-start">
                      <span className="mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8b66ef] text-[10px] font-semibold text-white">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={`mailto:customerservice@ropetai.com?subject=${encodeURIComponent(`Ropet Plus 退款申请 ${refundOrder.orderNo}`)}`}
                  className="mt-4 flex h-11 w-full items-center justify-center rounded-[18px] border border-[#ded8e8] text-[13px] font-semibold text-[#6849cc]"
                >
                  发送退款申请邮件
                </a>
                <button
                  type="button"
                  onClick={() => requestRefund(refundOrder.id)}
                  className="mt-3 h-12 w-full rounded-[20px] bg-[#8b66ef] text-[14px] font-semibold text-white"
                >
                  演示：已提交申请
                </button>
              </>
            )}

            {refundOrder.status === 'refund-reviewing' && (
              <>
                <div className="mt-5 rounded-[16px] bg-[#f3efff] px-4 py-5 text-center">
                  <p className="text-[14px] font-semibold text-[#6043bd]">退款申请已收到</p>
                  <p className="mt-2 text-[11px] leading-5 text-[#817593]">
                    工作人员正在人工审核，审核结果将通过邮件通知。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => approveRefund(refundOrder.id)}
                  className="mt-5 h-12 w-full rounded-[20px] bg-[#8b66ef] text-[14px] font-semibold text-white"
                >
                  演示：审核通过
                </button>
              </>
            )}

            {refundOrder.status === 'refunding' && (
              <>
                <div className="mt-5 rounded-[16px] bg-[#fff6e7] px-4 py-5 text-center">
                  <LoaderCircle size={28} className="mx-auto animate-spin text-[#b87a20]" />
                  <p className="mt-3 text-[14px] font-semibold text-[#8e641f]">正在原路退回支付宝</p>
                  <p className="mt-2 text-[11px] leading-5 text-[#9d8154]">
                    后端已发起退款，到账时间以支付宝处理进度为准。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => completeRefund(refundOrder.id)}
                  className="mt-5 h-12 w-full rounded-[20px] bg-[#8b66ef] text-[14px] font-semibold text-white"
                >
                  演示：退款成功
                </button>
              </>
            )}

            {refundOrder.status === 'refunded' && (
              <div className="mt-5 rounded-[16px] bg-[#ecf8f1] px-4 py-5 text-center">
                <Check size={30} className="mx-auto text-[#23835a]" />
                <p className="mt-3 text-[14px] font-semibold text-[#23835a]">款项已原路退回</p>
                <p className="mt-2 text-[11px] leading-5 text-[#5c8774]">
                  Ropet Plus 权益和设备悄悄话能力已同步关闭。
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setRefundOrderId(null)}
              className="mt-3 h-11 w-full text-[13px] text-[#77727f]"
            >
              关闭
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
