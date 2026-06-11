import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Coins,
  Delete,
  HeartHandshake,
  LoaderCircle,
  LockKeyhole,
  MessageCircle,
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
import { isDateExpired, useSubscriptionStore } from '@/store/useSubscriptionStore';

type Screen =
  | 'plans'
  | 'payment-method'
  | 'alipay'
  | 'wechat'
  | 'opening'
  | 'success'
  | 'failure'
  | 'status';

type Props = {
  screen: Screen;
};

const planAmount = (plan: 'one-month' | 'auto-renew') => (
  plan === 'auto-renew' ? '69.90' : '79.90'
);

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
  const {
    entitlement,
    selectedPlan,
    subscribedPlan,
    autoRenewEnabled,
    setSelectedPlan,
  } = useSubscriptionStore();
  const [agreementChecked, setAgreementChecked] = useState(true);
  const currentPlan = subscribedPlan ?? (entitlement === 'subscription'
    ? (autoRenewEnabled ? 'auto-renew' : selectedPlan)
    : null);
  const currentAutoRenewPlan = currentPlan === 'auto-renew';
  const oneMonthExpired = currentPlan === 'one-month'
    && entitlement === 'subscription'
    && isDateExpired(useSubscriptionStore.getState().expiryDate);
  const currentPlanStillSelected = currentAutoRenewPlan && selectedPlan === 'auto-renew';

  return (
    <PrototypePhone>
      <PrototypeStatusBar />
      <PrototypeHeader onBack={() => navigate('/dialogue-mode')} />
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
            statusLabel={oneMonthExpired ? '已过期' : undefined}
            onClick={() => setSelectedPlan('one-month')} 
          />
          <div className="relative">
            {currentAutoRenewPlan && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[18px] bg-[#efedf1]/80">
                <span className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#77727f] shadow-sm">
                  当前使用中
                </span>
              </div>
            )}
            <SubscriptionPlanCard 
              plan="auto-renew" 
              selected={!currentAutoRenewPlan && selectedPlan === 'auto-renew'}
              disabled={currentAutoRenewPlan}
              onClick={() => !currentAutoRenewPlan && setSelectedPlan('auto-renew')}
            />
          </div>
        </div>
        {oneMonthExpired && (
          <p className="mt-2 text-[11px] text-[#a45c5c]">
            上次购买的 1 个月套餐已到期，重新支付后即可恢复权益。
          </p>
        )}
        <button
          type="button"
          disabled={!agreementChecked || currentPlanStillSelected}
          aria-label="立即订阅"
          onClick={() => navigate('/subscription/payment-method')}
          className={`mt-5 h-[52px] w-full rounded-[22px] text-[16px] font-medium text-white ${
            agreementChecked && !currentPlanStillSelected ? 'bg-[#8b66ef]' : 'bg-[#c9c5d4]'
          }`}
        >
          {currentPlanStillSelected ? '请选择其他套餐' : currentAutoRenewPlan ? '确认更换套餐' : '立即订阅'}
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

    const timer = window.setTimeout(() => {
      navigate(`/subscription/${selectedMethod}`);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [creatingOrder, navigate, selectedMethod]);

  const handleConfirmPayment = () => {
    if (!selectedMethod || creatingOrder) return;
    setPaymentMethod(selectedMethod);
    setCreatingOrder(true);
  };

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
              {recurring && (
                <span className="mt-1 inline-flex rounded-full bg-[#fff0e8] px-2 py-0.5 text-[9px] font-semibold text-[#e06b36]">
                  已优惠 ￥10
                </span>
              )}
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
          disabled={creatingOrder}
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
          disabled={creatingOrder}
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
        onClick={handleConfirmPayment}
        className={`absolute bottom-[30px] left-5 right-5 h-[56px] rounded-[24px] text-[17px] font-semibold text-white ${
          selectedMethod ? 'bg-[#8b66ef]' : 'bg-[#c9c5d4]'
        }`}
      >
        {creatingOrder ? (
          <span className="flex items-center justify-center gap-2">
            <LoaderCircle size={20} className="animate-spin" />
            正在创建订单
          </span>
        ) : (
          `确认支付 ￥${amount}`
        )}
      </button>

      {creatingOrder && (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/25 px-8"
        >
          <div className="w-full rounded-[22px] bg-white px-6 py-7 text-center shadow-[0_18px_50px_rgba(32,27,45,0.18)]">
            <LoaderCircle size={36} className="mx-auto animate-spin text-[#8b66ef]" strokeWidth={2.4} />
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
  const { selectedPlan, setPaymentState, voiceConsentGranted } = useSubscriptionStore();
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
      navigate(voiceConsentGranted ? '/subscription/opening?source=subscription' : '/subscription/voice-consent?source=subscription');
    }, 800);
    return () => window.clearTimeout(timer);
  }, [navigate, setPaymentState, submitting, voiceConsentGranted]);

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
          {recurring
            ? `连续包月 · 原价 ￥79.90，每月优惠 ￥10`
            : '购买 1 个月 · 本次付款后不自动续费'}
        </p>
        {recurring && (
          <p className="mt-1 text-[11px] text-[#8b8792]">支付后每月由{channelName}自动扣款 ￥69.90</p>
        )}
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

const OpeningScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
        <p className="mx-auto mt-3 max-w-[300px] text-[14px] leading-6 text-[#8b8792]">服务端正在为设备 KAMOMO 开启订阅对话，请勿再次付款。</p>
      </div>
    </PhoneShell>
  );
};

const SuccessScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    entitlement,
    expiryDate,
    selectedPlan,
    subscribedPlan,
    nextChargeDate,
    trialCards,
    activeTrialCardId,
  } = useSubscriptionStore();
  const trial = searchParams.get('source') === 'trial' || entitlement === 'trial';
  const activeTrialCard = trialCards.find((card) => card.id === activeTrialCardId);
  const currentPlan = subscribedPlan ?? selectedPlan;

  return (
    <PhoneShell title="开通成功" backTo="/">
      <div className="pt-8 text-center">
        <div className="mx-auto w-[86px] h-[86px] rounded-full bg-[#e2f8eb] text-[#0b8a57] flex items-center justify-center">
          <Check size={46} strokeWidth={2.5} />
        </div>
        <h2 className="mt-6 text-[27px] font-bold">{trial ? `${activeTrialCard?.days ?? ''} 天体验已开启` : 'Ropet Plus 已开通'}</h2>
        <p className="mt-2 text-[14px] text-[#8b8792]">设备 KAMOMO 现在可以使用语音对话</p>
      </div>

      <div className="mt-8 rounded-[22px] border border-[#ece9f1] px-5">
        <div className="flex justify-between py-4 border-b border-[#eeeeee]"><span className="text-[#8b8792]">权益设备</span><strong>KAMOMO</strong></div>
        <div className="flex justify-between py-4 border-b border-[#eeeeee]"><span className="text-[#8b8792]">有效期至</span><strong>{expiryDate}</strong></div>
        {!trial && (
          <>
            <div className="flex justify-between py-4 border-b border-[#eeeeee]"><span className="text-[#8b8792]">购买方式</span><strong>{currentPlan === 'auto-renew' ? '每月自动续费' : '买 1 个月'}</strong></div>
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const trial = entitlement === 'trial';
  const currentPlan = subscribedPlan ?? (autoRenewEnabled ? 'auto-renew' : selectedPlan);
  const subscriptionExpired = !trial
    && currentPlan === 'one-month'
    && isDateExpired(expiryDate);

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const trialBenefits = [
    { title: '不限时长语音对话', icon: MessageCircle },
    { title: '长期记忆能力', icon: Brain },
    { title: '更高的情绪感知', icon: HeartHandshake },
    { title: '深度交流能力', icon: Check },
    { title: '日记全面升级', icon: BookOpen },
    { title: '2W 积分权益', icon: Coins },
  ];

  return (
    <PhoneShell title="当前权益" backTo="/dialogue-mode">
      <div 
        className="relative"
        onScroll={(e) => {
          if (e.currentTarget.scrollTop < -50 && !isRefreshing) {
            handleRefresh();
          }
        }}
      >
        {isRefreshing && (
          <div className="flex justify-center py-2 animate-bounce">
            <RefreshCw className="animate-spin text-[#8b66ef]" size={20} />
          </div>
        )}
        <div className={`rounded-[26px] p-5 text-white ${
          subscriptionExpired
            ? 'bg-gradient-to-br from-[#aaa6af] to-[#77727f]'
            : 'bg-gradient-to-br from-[#9f7cff] to-[#7654e8]'
        }`}>
          <div className="text-[14px] text-white/75">当前设备权益</div>
          <div className="mt-2 text-[27px] font-bold">{trial ? '7 天体验' : 'KAMOMO Plus'}</div>
          <div className="mt-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-[13px] font-semibold">
            {subscriptionExpired ? '已过期' : '已生效'}
          </div>
          <div className="mt-5">
            <div className="rounded-[16px] bg-white/15 p-3 flex justify-between items-center">
              <div className="text-[11px] text-white/70">{subscriptionExpired ? '已于' : '有效期至'}</div>
              <div className="font-semibold">{expiryDate}</div>
            </div>
          </div>
        </div>

        <section className="mt-5 rounded-[20px] border border-[#ece8f2] bg-white px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#29262e]">
              {trial ? '体验权益' : '当前会员权益'}
            </h2>
            <span className={`text-[10px] ${subscriptionExpired ? 'text-[#a09ba5]' : 'text-[#8b66ef]'}`}>
              {subscriptionExpired ? '权益已失效' : '已全部生效'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {trialBenefits.map(({ title, icon: Icon }) => (
              <div key={title} className={`flex min-h-[48px] items-center rounded-[12px] px-3 ${
                subscriptionExpired ? 'bg-[#f1f0f2]' : 'bg-[#f6f3ff]'
              }`}>
                <Icon size={17} className={`shrink-0 ${subscriptionExpired ? 'text-[#aaa6af]' : 'text-[#8b66ef]'}`} strokeWidth={2.2} />
                <span className={`ml-2 text-[11px] font-medium leading-4 ${
                  subscriptionExpired ? 'text-[#99959e]' : 'text-[#4d4657]'
                }`}>{title}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-5 rounded-[22px] border border-[#ece9f1] px-5">
          {!trial && (
            <>
              <button 
                type="button" 
                onClick={() => navigate('/subscription')}
                className="w-full flex justify-between py-4 border-b border-[#eeeeee] items-center group active:opacity-70"
              >
                <span className="text-[#8b8792]">套餐</span>
                <div className="flex items-center gap-1">
                  <strong>{currentPlan === 'auto-renew' ? '每月自动续费' : `买 1 个月${subscriptionExpired ? ' · 已过期' : ''}`}</strong>
                  <ChevronRight size={16} className="text-[#c7c3cc]" />
                </div>
              </button>
              <div className="flex justify-between py-4 border-b border-[#eeeeee]"><span className="text-[#8b8792]">支付方式</span><strong>{paymentMethod === 'wechat' ? '微信支付' : '支付宝'}</strong></div>
              <div className="flex justify-between py-4">
                <span className="text-[#8b8792]">{subscriptionExpired ? '权益状态' : '下次扣款'}</span>
                <strong className={subscriptionExpired ? 'text-[#a45c5c]' : ''}>
                  {subscriptionExpired ? '已到期' : autoRenewEnabled ? nextChargeDate : '不自动续费'}
                </strong>
              </div>
            </>
          )}
        </div>

        {!trial && autoRenewEnabled && (
          <p className="mt-3 px-1 text-[11px] leading-5 text-[#99949e]">
            自动续费由{paymentMethod === 'wechat' ? '微信支付' : '支付宝'}管理，如需取消请前往对应支付渠道。
          </p>
        )}

        {subscriptionExpired && (
          <button
            type="button"
            onClick={() => navigate('/subscription')}
            className="mt-4 h-[52px] w-full rounded-[20px] bg-[#8b66ef] text-[15px] font-semibold text-white"
          >
            重新订阅
          </button>
        )}

        <div className="mt-6 flex justify-center">
          <button 
            type="button" 
            onClick={handleRefresh}
            className="text-[12px] text-[#aaa5ae] flex items-center gap-1"
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? '正在同步订阅状态…' : '下拉或点击刷新订阅状态'}
          </button>
        </div>
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1 text-[11px] text-[#bbb7c0]"
          >
            <RotateCcw size={11} />
            恢复演示状态
          </button>
        </div>
      </div>

      {showResetConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/35 px-8">
          <div className="w-full rounded-[24px] bg-white px-6 py-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
            <h2 className="text-[19px] font-bold text-[#222127]">恢复为未订阅状态？</h2>
            <p className="mt-2 text-[12px] leading-5 text-[#8b8792]">
              将清除当前订阅、体验卡使用和语音授权状态。
            </p>
            <button
              type="button"
              aria-label="确认恢复演示状态"
              onClick={() => {
                resetPrototype();
                navigate('/');
              }}
              className="mt-5 h-[48px] w-full rounded-[19px] bg-[#8b66ef] text-[14px] font-semibold text-white"
            >
              确认恢复
            </button>
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="mt-2 h-[42px] w-full text-[13px] text-[#77727f]"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </PhoneShell>
  );
};

const SubscriptionFlow: React.FC<Props> = ({ screen }) => {
  if (screen === 'plans') return <PlansScreen />;
  if (screen === 'payment-method') return <PaymentMethodScreen />;
  if (screen === 'alipay') return <PaymentPasswordScreen channel="alipay" />;
  if (screen === 'wechat') return <PaymentPasswordScreen channel="wechat" />;
  if (screen === 'opening') return <OpeningScreen />;
  if (screen === 'success') return <SuccessScreen />;
  if (screen === 'failure') return <FailureScreen />;
  return <StatusScreen />;
};

export default SubscriptionFlow;
