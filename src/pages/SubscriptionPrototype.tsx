import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CreditCard,
  Gift,
  HeartHandshake,
  MessageCircle,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import Lottie from 'lottie-react';
import pingjingAnimation from '@/assets/animations/pingjing.json';

type Screen =
  | 'plans'
  | 'status'
  | 'payment'
  | 'success'
  | 'trial'
  | 'manage'
  | 'invoice'
  | 'repair';

type Props = {
  screen: Screen;
};

const purple = '#8b66ef';

const StatusBar = () => (
  <div className="flex items-center justify-between px-[28px] pt-[18px] text-[#19181f]">
    <div className="text-[16px] font-semibold">9:41</div>
    <div className="flex items-center gap-[5px]">
      <div className="flex items-end gap-[2px]">
        <span className="block w-[3px] h-[7px] rounded-full bg-[#19181f]" />
        <span className="block w-[3px] h-[9px] rounded-full bg-[#19181f]" />
        <span className="block w-[3px] h-[12px] rounded-full bg-[#19181f]" />
        <span className="block w-[3px] h-[15px] rounded-full bg-[#19181f]" />
      </div>
      <div className="w-[18px] h-[12px] rounded-t-full border-t-[3px] border-[#19181f]" />
      <div className="w-[25px] h-[13px] rounded-[4px] border-[2px] border-[#19181f] relative">
        <div className="absolute top-[2px] right-[-4px] w-[2px] h-[5px] rounded-r bg-[#19181f]" />
      </div>
    </div>
  </div>
);

const PhoneFrame: React.FC<{ children: React.ReactNode; title?: string; backTo?: string }> = ({ children, title, backTo = '/' }) => {
  const navigate = useNavigate();
  return (
    <div className="relative w-full min-h-screen flex justify-center bg-[#d8deea] overflow-hidden py-4">
      <div className="relative w-[393px] h-[852px] overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)] bg-white">
        <StatusBar />
        <div className="flex items-center px-5 pt-4 pb-2">
          <button
            type="button"
            onClick={() => navigate(backTo)}
            className="w-10 h-10 rounded-full bg-[#f3f2f7] flex items-center justify-center text-[#19181f]"
            aria-label="返回"
          >
            <ArrowLeft size={22} />
          </button>
          {title && <div className="ml-3 text-[20px] font-semibold text-[#19181f]">{title}</div>}
        </div>
        {children}
      </div>
    </div>
  );
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-[24px] border border-[#19181f0d] bg-white shadow-[0_8px_26px_rgba(25,24,31,0.06)] ${className}`}>
    {children}
  </div>
);

const BottomButton: React.FC<{ children: React.ReactNode; onClick: () => void; sub?: string }> = ({ children, onClick, sub }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute left-5 right-5 bottom-[30px] h-[68px] rounded-[28px] bg-[#8b66ef] text-white shadow-[0_12px_24px_rgba(139,102,239,0.28)]"
  >
    <div className="text-[18px] font-semibold leading-[24px]">{children}</div>
    {sub && <div className="mt-[2px] text-[12px] text-white/80">{sub}</div>}
  </button>
);

const BenefitRow: React.FC<{ icon: React.ReactNode; title: string; desc?: string }> = ({ icon, title, desc }) => (
  <div className="flex items-start gap-3">
    <div className="mt-[2px] w-7 h-7 rounded-full bg-[#f1ecff] text-[#8b66ef] flex items-center justify-center shrink-0">{icon}</div>
    <div>
      <div className="text-[16px] font-semibold text-[#3b3942]">{title}</div>
      {desc && <div className="text-[12px] text-[#8d8996] mt-[2px]">{desc}</div>}
    </div>
  </div>
);

const StatusScreen = () => {
  const navigate = useNavigate();
  return (
    <PhoneFrame title="Ropet Plus" backTo="/">
      <div className="absolute inset-x-0 top-[86px] h-[230px] opacity-20 pointer-events-none">
        <Lottie animationData={pingjingAnimation} loop autoplay className="w-full h-full scale-125" />
      </div>
      <div className="px-5 pt-4 pb-[120px] h-[724px] overflow-y-auto scrollbar-hide">
        <div className="rounded-[28px] bg-gradient-to-br from-[#9f7cff] to-[#7654e8] text-white p-5 shadow-[0_16px_32px_rgba(124,90,224,0.26)]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[14px] text-white/75">当前设备权益</div>
              <h1 className="mt-2 text-[27px] leading-[34px] font-bold">ropet Plus</h1>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-1 text-[13px] font-semibold">
                <Check size={15} />
                已生效
              </div>
            </div>
            <div className="w-[70px] h-[70px] rounded-full bg-white/18 border border-white/35 flex items-center justify-center">
              <span className="w-[48px] h-[48px] rounded-full bg-white text-[#7c5ae0] flex items-center justify-center text-[18px] font-bold">Hi</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-[18px] bg-white/16 px-4 py-3">
              <div className="text-[12px] text-white/70">有效期</div>
              <div className="mt-1 text-[18px] font-semibold">2026.07.04</div>
            </div>
            <div className="rounded-[18px] bg-white/16 px-4 py-3">
              <div className="text-[12px] text-white/70">自动续费</div>
              <div className="mt-1 text-[18px] font-semibold">￥69.9/月</div>
            </div>
          </div>
        </div>

        <Card className="mt-5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[18px] font-bold text-[#19181f]">悄悄话能力已解锁</div>
              <div className="mt-1 text-[13px] text-[#8b8792]">权益跟随 ropet 设备</div>
            </div>
            <ShieldCheck size={26} color={purple} />
          </div>
          <div className="mt-5 space-y-4">
            <BenefitRow icon={<MessageCircle size={16} />} title="不限量悄悄话" desc="可以继续深度交流" />
            <BenefitRow icon={<Sparkles size={16} />} title="长期记忆能力" desc="持续记住你们的相处片段" />
            <BenefitRow icon={<HeartHandshake size={16} />} title="更高的情绪感知能力" />
          </div>
        </Card>

        <div className="mt-5 space-y-3">
          <MenuRow icon={<CreditCard size={20} />} title="订阅与订单" desc="管理续费、支付方式、取消入口" onClick={() => navigate('/subscription/manage')} />
          <MenuRow icon={<Gift size={20} />} title="体验卡" desc="查看可用时长卡或补偿卡" onClick={() => navigate('/subscription/trial')} />
        </div>
      </div>

      <BottomButton onClick={() => navigate('/pet-interact')} sub="Ropet Plus 当前已生效">
        开始悄悄话
      </BottomButton>
    </PhoneFrame>
  );
};

const PlansScreen = () => {
  const navigate = useNavigate();
  return (
    <PhoneFrame title="Ropet Plus">
      <div className="absolute inset-x-0 top-[92px] h-[210px] opacity-20 pointer-events-none">
        <Lottie animationData={pingjingAnimation} loop autoplay className="w-full h-full scale-125" />
      </div>
      <div className="px-5 pt-3 pb-[120px] h-[724px] overflow-y-auto scrollbar-hide">
        <div className="text-center mt-4">
          <div className="inline-flex items-center justify-center w-[70px] h-[46px] rounded-full bg-[#8b66ef] text-white shadow-lg">
            <MessageCircle size={30} />
          </div>
          <h1 className="mt-5 text-[30px] leading-[36px] font-bold text-[#19181f]">获取 Ropet Plus</h1>
          <p className="mt-2 text-[16px] text-[#19181f99]">解锁完整悄悄话能力</p>
        </div>

        <Card className="mt-8 overflow-hidden">
          <div className="bg-[#a793e8] text-white px-6 py-4 text-[21px] font-semibold">悄悄话权益</div>
          <div className="px-6 py-6 space-y-5">
            <BenefitRow icon={<MessageCircle size={16} />} title="不限量悄悄话" />
            <BenefitRow icon={<Sparkles size={16} />} title="长期记忆能力" desc="过期后默认保留 10 年，可续订恢复" />
            <BenefitRow icon={<HeartHandshake size={16} />} title="更高的情绪感知能力" />
            <BenefitRow icon={<ShieldCheck size={16} />} title="深度交流能力" />
          </div>
        </Card>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate('/subscription/alipay')}
            className="w-full h-[76px] rounded-[24px] border-[3px] border-[#8b66ef] bg-white px-5 flex items-center justify-between"
          >
            <span className="text-[22px] font-semibold text-[#19181f]">1个月</span>
            <span className="text-[22px] font-semibold text-[#19181f]">￥69.9/月</span>
          </button>
          <div className="mt-3 rounded-[18px] bg-[#f7f4ff] px-4 py-3 text-[13px] leading-[20px] text-[#6f56d9]">
            订阅权益开通给当前设备 ropet，重新绑定账号后权益仍跟随设备。
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/subscription/trial')}
          className="mt-5 w-full h-[58px] rounded-[24px] bg-[#f1ecff] text-[#7b55e6] flex items-center justify-center gap-2 text-[17px] font-semibold"
        >
          <Gift size={20} />
          使用 7 天体验卡
        </button>
      </div>

      <BottomButton onClick={() => navigate('/subscription/alipay')} sub="支付宝支付 · 自动续费 ￥69.9/月">
        立即订阅 Ropet Plus
      </BottomButton>
    </PhoneFrame>
  );
};

const PaymentScreen = () => {
  const navigate = useNavigate();
  return (
    <PhoneFrame title="确认支付" backTo="/subscription">
      <div className="px-5 pt-4">
        <Card className="p-5">
          <div className="text-[15px] text-[#8b8792]">当前设备</div>
          <div className="mt-1 text-[24px] font-bold text-[#19181f]">ropet</div>
          <div className="mt-4 rounded-[20px] bg-[#f6f3ff] p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[18px] font-semibold text-[#19181f]">Ropet Plus 月订阅</div>
                <div className="mt-1 text-[13px] text-[#8b8792]">不限量悄悄话 · 长期记忆 · 设备权益</div>
              </div>
              <div className="text-[22px] font-bold text-[#19181f]">￥69.9</div>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-[16px] font-semibold text-[#19181f]">支付方式</div>
        <div className="mt-3">
          <div className="w-full h-[64px] rounded-[20px] border-2 border-[#8b66ef] bg-[#f6f3ff] px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1677ff] text-white flex items-center justify-center text-[18px] font-bold">
                支
              </div>
              <div>
                <div className="text-[16px] font-semibold text-[#19181f]">支付宝</div>
                <div className="mt-[2px] text-[12px] text-[#8b8792]">订阅费用由支付宝自动续费</div>
              </div>
            </div>
            <Check size={21} color={purple} />
          </div>
        </div>

        <div className="mt-5 rounded-[20px] bg-[#fff7e6] px-4 py-3 text-[13px] leading-[20px] text-[#7a5b12]">
          订阅开通给当前 Ropet 设备。其他账号重新绑定该设备后，权益仍跟随设备。
        </div>
      </div>

      <BottomButton onClick={() => navigate('/subscription/success')} sub="支付宝支付 · 当前周期内取消后仍可使用">
        支付宝确认支付 ￥69.9
      </BottomButton>
    </PhoneFrame>
  );
};

const SuccessScreen = () => {
  const navigate = useNavigate();
  return (
    <PhoneFrame title="开通成功" backTo="/subscription">
      <div className="px-5 pt-12 text-center">
        <div className="mx-auto w-[92px] h-[92px] rounded-full bg-[#dcfae6] text-[#027a48] flex items-center justify-center">
          <Check size={48} />
        </div>
        <h1 className="mt-8 text-[30px] font-bold text-[#19181f]">ropet 已开通</h1>
        <p className="mt-2 text-[16px] text-[#8b8792]">Ropet Plus 悄悄话权益已生效</p>

        <Card className="mt-8 p-5 text-left">
          <div className="flex justify-between py-3 border-b border-[#eeeeee]">
            <span className="text-[#8b8792]">套餐</span>
            <span className="font-semibold">1个月 · ￥69.9/月</span>
          </div>
          <div className="flex justify-between py-3 border-b border-[#eeeeee]">
            <span className="text-[#8b8792]">有效期</span>
            <span className="font-semibold">至 2026.07.04</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-[#8b8792]">权益归属</span>
            <span className="font-semibold">ropet</span>
          </div>
        </Card>
      </div>
      <BottomButton onClick={() => navigate('/subscription/status')} sub="也可从个人中心管理订阅">
        查看当前权益
      </BottomButton>
    </PhoneFrame>
  );
};

const TrialScreen = () => {
  const navigate = useNavigate();
  return (
    <PhoneFrame title="体验卡" backTo="/subscription">
      <div className="px-5 pt-8">
        <Card className="p-6 bg-gradient-to-br from-[#9f7cff] to-[#7a57e8] text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[15px] text-white/75">可用体验卡</div>
              <div className="mt-2 text-[30px] font-bold">7 天 Ropet Plus</div>
            </div>
            <Gift size={48} />
          </div>
          <div className="mt-6 rounded-[18px] bg-white/18 px-4 py-3 text-[13px] leading-[20px]">
            使用后给当前设备 ropet 增加 7 天悄悄话权益。体验卡权益跟随设备，不跟随账号。
          </div>
        </Card>

        <div className="mt-6 space-y-3">
          {['不限量悄悄话', '长期记忆体验', '可与付费订阅顺延叠加'].map((item) => (
            <div key={item} className="h-[54px] rounded-[18px] bg-[#f6f6f7] px-4 flex items-center gap-3">
              <Check size={18} color={purple} />
              <span className="text-[15px] font-medium text-[#19181f]">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <BottomButton onClick={() => navigate('/subscription/success')} sub="使用后有效期至 2026.06.11">
        立即使用体验卡
      </BottomButton>
    </PhoneFrame>
  );
};

const ManageScreen = () => {
  const navigate = useNavigate();
  const rows = [
    ['当前套餐', 'Ropet Plus 月订阅'],
    ['有效期', '2026.07.04'],
    ['自动续费', 'Apple 订阅 · 已开启'],
    ['权益归属', 'ropet 设备'],
  ];
  return (
    <PhoneFrame title="订阅与订单" backTo="/pet-profile">
      <div className="px-5 pt-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#f1ecff] text-[#8b66ef] flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <div>
              <div className="text-[20px] font-bold text-[#19181f]">ropet Plus</div>
              <div className="text-[13px] text-[#8b8792]">个人中心内的账户资产管理</div>
            </div>
          </div>
          <div className="mt-5 divide-y divide-[#eeeeee]">
            {rows.map(([label, value]) => (
              <div key={label} className="flex justify-between py-3 text-[14px]">
                <span className="text-[#8b8792]">{label}</span>
                <span className="font-semibold text-[#19181f]">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-5 space-y-3">
          <MenuRow icon={<CreditCard size={20} />} title="支付方式" desc="自动续费请前往支付渠道管理" onClick={() => undefined} />
          <MenuRow icon={<Gift size={20} />} title="体验卡" desc="查看可用时长卡" onClick={() => navigate('/subscription/trial')} />
          <MenuRow icon={<ReceiptText size={20} />} title="发票和退款" desc="订单、发票、退款条款" onClick={() => navigate('/subscription/invoice')} />
          <MenuRow icon={<Wrench size={20} />} title="维修补偿" desc="寄修时长补偿和换机权益" onClick={() => navigate('/subscription/repair')} />
        </div>
      </div>
    </PhoneFrame>
  );
};

const MenuRow: React.FC<{ icon: React.ReactNode; title: string; desc: string; onClick: () => void }> = ({ icon, title, desc, onClick }) => (
  <button type="button" onClick={onClick} className="w-full h-[70px] rounded-[22px] bg-[#f6f6f7] px-4 flex items-center justify-between">
    <div className="flex items-center gap-3 text-left">
      <div className="w-10 h-10 rounded-full bg-white text-[#8b66ef] flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-[16px] font-semibold text-[#19181f]">{title}</div>
        <div className="mt-[2px] text-[12px] text-[#8b8792]">{desc}</div>
      </div>
    </div>
    <ChevronRight size={20} color="#b6b1bf" />
  </button>
);

const InvoiceScreen = () => (
  <PhoneFrame title="发票和退款" backTo="/subscription/manage">
    <div className="px-5 pt-4 space-y-4">
      <Card className="p-5">
        <div className="flex items-center gap-2 text-[18px] font-bold text-[#19181f]">
          <ReceiptText size={22} color={purple} />
          发票
        </div>
        <div className="mt-4 space-y-3 text-[14px] text-[#5d5967] leading-[21px]">
          <p>Apple / Google 渠道展示平台购买凭证和发票入口。</p>
          <p>支付宝 / 微信支持 App 内电子发票申请。</p>
          <p>Stripe 支持账单和发票入口。</p>
        </div>
      </Card>
      <Card className="p-5">
        <div className="text-[18px] font-bold text-[#19181f]">退款条款</div>
        <ul className="mt-4 space-y-3 text-[14px] leading-[21px] text-[#5d5967]">
          <li>取消自动续费不退款，当前周期继续可用。</li>
          <li>重复扣款、误扣、支付成功未开通，可申请退款。</li>
          <li>退款成功后，该 Ropet 悄悄话权益立即关闭。</li>
          <li>已正常开通并使用，不按剩余时间折算退款。</li>
        </ul>
      </Card>
    </div>
  </PhoneFrame>
);

const RepairScreen = () => (
  <PhoneFrame title="维修补偿" backTo="/subscription/manage">
    <div className="px-5 pt-4">
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#fff4d8] text-[#b7791f] flex items-center justify-center">
            <Wrench size={24} />
          </div>
          <div>
            <div className="text-[20px] font-bold text-[#19181f]">寄修补偿</div>
            <div className="text-[13px] text-[#8b8792]">按不可用天数顺延</div>
          </div>
        </div>
        <div className="mt-5 rounded-[20px] bg-[#f6f6f7] p-4">
          <div className="text-[13px] text-[#8b8792]">示例</div>
          <div className="mt-2 text-[16px] font-semibold text-[#19181f]">原续费日 7月1日</div>
          <div className="mt-1 text-[16px] font-semibold text-[#19181f]">维修不可用 7 天</div>
          <div className="mt-3 h-[1px] bg-[#e4e1ea]" />
          <div className="mt-3 text-[20px] font-bold text-[#8b66ef]">新续费日 7月8日</div>
        </div>
      </Card>
      <div className="mt-5 space-y-3">
        <MenuRow icon={<ShieldCheck size={20} />} title="Apple / Google" desc="优先顺延渠道下一次续费日" onClick={() => undefined} />
        <MenuRow icon={<Gift size={20} />} title="渠道不支持时" desc="发放 Ropet 补偿时长卡兜底" onClick={() => undefined} />
        <MenuRow icon={<RotateCcw size={20} />} title="换新设备" desc="剩余权益和补偿天数转移到新设备" onClick={() => undefined} />
      </div>
    </div>
  </PhoneFrame>
);

const SubscriptionPrototype: React.FC<Props> = ({ screen }) => {
  if (screen === 'status') return <StatusScreen />;
  if (screen === 'payment') return <PaymentScreen />;
  if (screen === 'success') return <SuccessScreen />;
  if (screen === 'trial') return <TrialScreen />;
  if (screen === 'manage') return <ManageScreen />;
  if (screen === 'invoice') return <InvoiceScreen />;
  if (screen === 'repair') return <RepairScreen />;
  return <PlansScreen />;
};

export default SubscriptionPrototype;
