import React, { useState } from 'react';
import { CalendarHeart, CheckCircle2, CircleX, Gift, HeartHandshake, LoaderCircle, ReceiptText, Sparkles, X } from 'lucide-react';
import { MallRedemptionOrder, PointIncomeCategory, PointIncomeRecord, PointSpendCategory, PointSpendRecord, useDialogueStore } from '@/store/useDialogueStore';

interface PointsLedgerProps {
  className?: string;
}

const DEMO_FAILED_REDEMPTION_ORDERS: MallRedemptionOrder[] = [
  {
    id: 'demo-redemption-refunded',
    itemId: 'demo-refunded-item',
    title: '星河美瞳',
    cost: 3600,
    status: 'refunded',
    retryCount: 0,
    repeatable: false,
    inventoryEffect: 'none',
    demoOutcome: 'failure',
    createdAt: '2026.09.02 17:57',
    createdAtMs: 1788343020000,
    updatedAtMs: 1788343025000,
  },
  {
    id: 'demo-redemption-refund-exception',
    itemId: 'demo-refund-exception-item',
    title: '星云眼影',
    cost: 4800,
    status: 'refund-exception',
    retryCount: 0,
    repeatable: false,
    inventoryEffect: 'none',
    demoOutcome: 'failure',
    createdAt: '2026.09.01 14:26',
    createdAtMs: 1788243960000,
    updatedAtMs: 1788243990000,
  },
];

const DEMO_OPERATION_RECORDS: PointSpendRecord[] = [
  { id: 'demo-operation-nest', title: 'AI画纸', type: 'exchange', category: '小窝物品兑换', quantity: 99, points: 59400, createdAt: '2026.09.04 16:48' },
  { id: 'demo-operation-lottery', title: '幸运抽奖机', type: 'lottery', category: '抽奖', quantity: 1, points: 160, createdAt: '2026.09.04 15:36' },
  { id: 'demo-operation-mall', title: '紫曜星河', type: 'exchange', category: '商城物品兑换', quantity: 1, points: 4000, createdAt: '2026.09.04 14:20' },
  { id: 'demo-operation-food', title: '甜甜圈', type: 'exchange', category: '零食兑换', quantity: 3, points: 225, createdAt: '2026.09.03 19:12' },
  { id: 'demo-operation-medicine', title: '感冒药', type: 'exchange', category: '药品兑换', quantity: 2, points: 300, createdAt: '2026.09.03 09:41' },
  { id: 'demo-operation-diary', title: '9月3日日记', type: 'exchange', category: '生成日记', quantity: 1, points: 300, createdAt: '2026.09.03 08:15' },
];

const DEMO_INCOME_RECORDS: PointIncomeRecord[] = [
  { id: 'demo-income-recharge', title: '10,000积分充值', type: 'activity', category: '充值', points: 10000, createdAt: '2026.09.04 18:06' },
  { id: 'demo-income-update', title: '版本更新奖励', type: 'activity', category: '更新奖励', points: 500, createdAt: '2026.09.04 09:20' },
  { id: 'demo-income-campaign', title: '七日签到奖励', type: 'activity', category: '运营活动', points: 300, createdAt: '2026.09.04 08:10' },
  { id: 'demo-income-interaction', title: '今日互动得分', type: 'interaction', category: '每日互动', points: 120, createdAt: '2026.09.03 23:59' },
  { id: 'demo-income-lottery', title: '幸运抽奖机', type: 'activity', category: '抽奖获得', points: 1000, createdAt: '2026.09.03 20:34' },
  { id: 'demo-income-snack', title: '新零食·草莓饼干', type: 'activity', category: '新零食解锁', points: 200, createdAt: '2026.09.03 16:15' },
  { id: 'demo-income-badge', title: '「初次见面」徽章', type: 'activity', category: '成就徽章', points: 500, createdAt: '2026.09.03 11:08' },
  { id: 'demo-income-guide', title: '养派秘籍·新手篇', type: 'activity', category: '养派秘籍', points: 300, createdAt: '2026.09.02 21:40' },
  { id: 'demo-income-gift', title: '官网礼品兑换', type: 'activity', category: '礼品兑换', points: 2000, createdAt: '2026.09.02 10:26' },
];

const getSpendCategory = (record: PointSpendRecord): PointSpendCategory => (
  record.category ?? (record.type === 'lottery' ? '抽奖' : '商城物品兑换')
);

const getIncomeCategory = (record: PointIncomeRecord): PointIncomeCategory => (
  record.category ?? (record.type === 'interaction' ? '每日互动' : '运营活动')
);

const getRedemptionNo = (order: MallRedemptionOrder) => {
  const date = new Date(order.createdAtMs);
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('');
  return `EX${datePart}${String(order.createdAtMs).slice(-6)}`;
};

const PointsLedger: React.FC<PointsLedgerProps> = ({ className = '' }) => {
  const { pointSpendRecords, pointIncomeRecords, mallRedemptionOrders } = useDialogueStore();
  const [activeTab, setActiveTab] = useState<'spend' | 'income'>('spend');
  const [supportOrder, setSupportOrder] = useState<MallRedemptionOrder | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const actualMallRedemptionOrders = mallRedemptionOrders ?? [];
  const demoFailedOrders = DEMO_FAILED_REDEMPTION_ORDERS.filter((demoOrder) => (
    !actualMallRedemptionOrders.some((order) => order.status === demoOrder.status)
  ));
  const spentMallRedemptionOrders = [...actualMallRedemptionOrders, ...demoFailedOrders];
  const redemptionSpendRecordIds = new Set(actualMallRedemptionOrders.map((order) => `spend-${order.id}`));
  const actualPointSpendRecords = (pointSpendRecords ?? []).filter((record) => !redemptionSpendRecordIds.has(record.id));
  const demoOperationRecords = DEMO_OPERATION_RECORDS.filter((demoRecord) => (
    !actualPointSpendRecords.some((record) => getSpendCategory(record) === demoRecord.category)
  ));
  const visiblePointSpendRecords = [...actualPointSpendRecords, ...demoOperationRecords];
  const actualPointIncomeRecords = (pointIncomeRecords ?? []).filter((record) => !record.id.startsWith('refund-'));
  const demoIncomeRecords = DEMO_INCOME_RECORDS.filter((demoRecord) => (
    !actualPointIncomeRecords.some((record) => getIncomeCategory(record) === demoRecord.category)
  ));
  const visiblePointIncomeRecords = [...actualPointIncomeRecords, ...demoIncomeRecords];
  return (
    <div className={className}>
      <div className="grid grid-cols-2 rounded-[15px] bg-[#efedf2] p-1">
        <button type="button" onClick={() => setActiveTab('spend')} className={`h-10 rounded-[12px] text-[12px] font-bold transition-colors ${activeTab === 'spend' ? 'bg-white text-[#7b58db] shadow-sm' : 'text-[#8f8994]'}`}>支出</button>
        <button type="button" onClick={() => setActiveTab('income')} className={`h-10 rounded-[12px] text-[12px] font-bold transition-colors ${activeTab === 'income' ? 'bg-white text-[#7b58db] shadow-sm' : 'text-[#8f8994]'}`}>收入</button>
      </div>

      <div className="mt-5 space-y-3">
        {activeTab === 'spend' && spentMallRedemptionOrders.map((order) => {
          const statusMeta = order.status === 'processing'
            ? { label: '处理中', className: 'bg-[#eee8ff] text-[#7657d7]', icon: LoaderCircle }
            : order.status === 'success'
              ? { label: '兑换成功', className: 'bg-[#e7f7ed] text-[#3f9b68]', icon: CheckCircle2 }
              : order.status === 'refunded'
                ? { label: '兑换失败', className: 'bg-[#efeff1] text-[#77717e]', icon: CircleX }
                : { label: '兑换失败', className: 'bg-[#ffe9ed] text-[#d85c72]', icon: CircleX };
          const StatusIcon = statusMeta.icon;
          return (
            <section key={order.id} className="rounded-[19px] border border-[#ece9f1] bg-white p-4 shadow-[0_9px_24px_rgba(58,49,75,0.05)]">
              <div className="flex items-center">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] ${statusMeta.className}`}><StatusIcon size={24} className={order.status === 'processing' ? 'animate-spin' : ''} /></span>
                <div className="ml-3 min-w-0 flex-1"><h2 className="truncate text-[15px] font-bold text-[#2b2730]">{order.title}</h2><p className="mt-1 text-[11px] text-[#817a86]">{order.createdAt} · 商城物品兑换</p></div>
                <span className={`ml-2 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusMeta.className}`}>{statusMeta.label}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#f0edf2] pt-3">
                <div>
                  <p className="text-[11px] text-[#817a86]">兑换积分</p>
                  <p className={`mt-0.5 text-[15px] font-black ${order.status === 'refund-exception' ? 'text-[#d85c72]' : 'text-[#5f5864]'}`}>
                    {order.status === 'refunded' ? '返还成功' : order.status === 'refund-exception' ? '返还异常' : `-${order.cost.toLocaleString()}`}
                  </p>
                </div>
                {order.status === 'processing' && <span className="text-[10px] font-bold text-[#756d7b]">{order.retryCount > 0 ? `已重试 ${order.retryCount}/3` : '等待发放'}</span>}
                {order.status === 'refund-exception' && <button type="button" onClick={() => setSupportOrder(order)} className="h-9 rounded-full bg-[#19181f] px-4 text-[11px] font-bold text-white">联系客服</button>}
              </div>
            </section>
          );
        })}

        {activeTab === 'spend' && visiblePointSpendRecords.map((record) => (
          <section key={record.id} className="flex items-center rounded-[19px] border border-[#ece9f1] bg-white p-4 shadow-[0_9px_24px_rgba(58,49,75,0.05)]">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] ${record.type === 'lottery' ? 'bg-[#fff3c7] text-[#e8ad12]' : 'bg-[#eee8ff] text-[#805ee0]'}`}>{record.type === 'lottery' ? <Sparkles size={24} /> : <Gift size={24} />}</span>
            <div className="ml-3 min-w-0 flex-1">
              <h2 className="truncate text-[15px] font-bold text-[#2b2730]">{record.title.replace(/^兑换/, '')}{(record.quantity ?? 1) > 1 ? ` ×${record.quantity}` : ''}</h2>
              <p className="mt-1 text-[11px] text-[#817a86]">{record.createdAt} · {getSpendCategory(record)}</p>
            </div>
            <div className="ml-2 text-right"><p className="text-[17px] font-black text-[#ec5f7e]">-{record.points.toLocaleString()}</p><p className="mt-1 text-[10px] text-[#817a86]">积分</p></div>
          </section>
        ))}

        {activeTab === 'income' && visiblePointIncomeRecords.map((record) => (
          <section key={record.id} className="flex items-center rounded-[19px] border border-[#ece9f1] bg-white p-4 shadow-[0_9px_24px_rgba(58,49,75,0.05)]">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] ${record.type === 'interaction' ? 'bg-[#e8f8f0] text-[#46a979]' : 'bg-[#fff2d8] text-[#d99b28]'}`}>{record.type === 'interaction' ? <HeartHandshake size={24} /> : <CalendarHeart size={24} />}</span>
            <div className="ml-3 min-w-0 flex-1">
              <h2 className="truncate text-[15px] font-bold text-[#2b2730]">{record.title}{(record.quantity ?? 1) > 1 ? ` ×${record.quantity}` : ''}</h2>
              <p className="mt-1 text-[11px] text-[#817a86]">{record.createdAt} · {getIncomeCategory(record)}</p>
            </div>
            <div className="ml-2 text-right"><p className="text-[17px] font-black text-[#43a477]">+{record.points.toLocaleString()}</p><p className="mt-1 text-[10px] text-[#817a86]">积分</p></div>
          </section>
        ))}

        {activeTab === 'spend' && visiblePointSpendRecords.length === 0 && spentMallRedemptionOrders.length === 0 && <div className="py-16 text-center text-[#8e8793]"><ReceiptText size={34} className="mx-auto mb-3 opacity-50" /><p className="text-[13px] font-semibold">暂无积分支出记录</p></div>}
        {activeTab === 'income' && visiblePointIncomeRecords.length === 0 && <div className="py-16 text-center text-[#8e8793]"><ReceiptText size={34} className="mx-auto mb-3 opacity-50" /><p className="text-[13px] font-semibold">暂无积分收入记录</p></div>}
      </div>

      {supportOrder && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-[#19181fcc] px-5" onClick={() => setSupportOrder(null)}>
          <section className="w-full max-w-[353px] rounded-[28px] bg-white px-5 pb-5 pt-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-black text-[#24222a]">联系客服</h2>
              <button type="button" aria-label="关闭客服弹窗" onClick={() => setSupportOrder(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f1f5] text-[#69646e]">
                <X size={23} />
              </button>
            </div>

            <div className="mt-4 rounded-[20px] bg-[#f5f0ff] px-5 py-5 text-[14px] leading-6 text-[#696077]">
              <p>请联系客服邮箱</p>
              <a href="mailto:customerservice@ropetai.com" className="font-bold text-[#7652eb] underline">customerservice@ropetai.com</a>。
            </div>

            <div className="mt-4 rounded-[18px] border border-[#ebe8ef] px-5 py-4 text-[13px] leading-6 text-[#8a8590]">
              <p className="font-semibold">兑换单号：{getRedemptionNo(supportOrder)}</p>
              <p>请在邮件中附上兑换单号、问题类型和截图，方便客服核对。</p>
            </div>

            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText('customerservice@ropetai.com');
                setEmailCopied(true);
                window.setTimeout(() => setEmailCopied(false), 1400);
              }}
              className="mt-5 h-[52px] w-full rounded-[18px] bg-[#8b62eb] text-[15px] font-bold text-white"
            >
              {emailCopied ? '已复制' : '复制邮箱'}
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default PointsLedger;
