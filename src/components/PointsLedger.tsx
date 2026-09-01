import React, { useState } from 'react';
import { CalendarHeart, CheckCircle2, CircleX, Gift, HeartHandshake, LoaderCircle, ReceiptText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDialogueStore } from '@/store/useDialogueStore';

interface PointsLedgerProps {
  className?: string;
}

const PointsLedger: React.FC<PointsLedgerProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { pointSpendRecords, pointIncomeRecords, mallRedemptionOrders } = useDialogueStore();
  const [activeTab, setActiveTab] = useState<'spend' | 'income'>('spend');
  const redemptionSpendRecordIds = new Set((mallRedemptionOrders ?? []).map((order) => `spend-${order.id}`));
  const visiblePointSpendRecords = (pointSpendRecords ?? []).filter((record) => !redemptionSpendRecordIds.has(record.id));
  const visiblePointIncomeRecords = (pointIncomeRecords ?? []).filter((record) => !record.id.startsWith('refund-'));
  const viewRedeemedItem = (itemId: string) => {
    const returnTo = encodeURIComponent('/points-orders');
    if (itemId === 'cavy-talk' || itemId === 'little-lamb' || itemId === 'cat-talk') {
      navigate(`/eye-change?mode=voice&view=${itemId}&returnTo=${returnTo}`);
      return;
    }
    if (itemId.includes('eyes') || itemId.includes('eyelids')) {
      navigate(`/eye-change?equip=${itemId}`);
      return;
    }
    navigate(`/nest?item=${itemId}`);
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 rounded-[15px] bg-[#efedf2] p-1">
        <button type="button" onClick={() => setActiveTab('spend')} className={`h-10 rounded-[12px] text-[12px] font-bold transition-colors ${activeTab === 'spend' ? 'bg-white text-[#7b58db] shadow-sm' : 'text-[#8f8994]'}`}>支出</button>
        <button type="button" onClick={() => setActiveTab('income')} className={`h-10 rounded-[12px] text-[12px] font-bold transition-colors ${activeTab === 'income' ? 'bg-white text-[#7b58db] shadow-sm' : 'text-[#8f8994]'}`}>收入</button>
      </div>

      <section className="mt-4 rounded-[17px] bg-[#f1ecff] px-4 py-3 text-[12px] font-medium leading-5 text-[#735cb0]">
        {activeTab === 'spend' ? '记录商城兑换、商品发放状态和参与抽奖等产生的积分消耗。' : '记录互动获得的积分，以及签到、成长任务等活动奖励。'}
      </section>

      <div className="mt-5 space-y-3">
        {activeTab === 'spend' && (mallRedemptionOrders ?? []).map((order) => {
          const statusMeta = order.status === 'processing'
            ? { label: '处理中', className: 'bg-[#eee8ff] text-[#7657d7]', icon: LoaderCircle }
            : order.status === 'success'
              ? { label: '兑换成功', className: 'bg-[#e7f7ed] text-[#3f9b68]', icon: CheckCircle2 }
              : { label: '兑换失败', className: 'bg-[#ffe9ed] text-[#d85c72]', icon: CircleX };
          const StatusIcon = statusMeta.icon;
          return (
            <section key={order.id} className="rounded-[19px] border border-[#ece9f1] bg-white p-4 shadow-[0_9px_24px_rgba(58,49,75,0.05)]">
              <div className="flex items-center">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] ${statusMeta.className}`}><StatusIcon size={24} className={order.status === 'processing' ? 'animate-spin' : ''} /></span>
                <div className="ml-3 min-w-0 flex-1"><h2 className="truncate text-[15px] font-bold text-[#2b2730]">{order.title}</h2><p className="mt-1 text-[11px] text-[#817a86]">{order.createdAt}</p></div>
                <span className={`ml-2 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusMeta.className}`}>{statusMeta.label}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#f0edf2] pt-3">
                <div>
                  <p className="text-[11px] text-[#817a86]">{order.status === 'refunded' ? '本次未扣积分' : '兑换积分'}</p>
                  {order.status === 'refunded' ? <p className="mt-0.5 text-[12px] font-bold text-[#69636e]">余额未发生变化</p> : <p className="mt-0.5 text-[15px] font-black text-[#5f5864]">-{order.cost.toLocaleString()}</p>}
                </div>
                {order.status === 'processing' && <span className="text-[10px] font-bold text-[#756d7b]">{order.retryCount > 0 ? `已重试 ${order.retryCount}/3` : '等待发放'}</span>}
                {order.status === 'success' && <button type="button" onClick={() => viewRedeemedItem(order.itemId)} className="h-9 rounded-full bg-[#19181f] px-4 text-[11px] font-bold text-white">查看物品</button>}
                {order.status === 'refunded' && <span className="text-[10px] font-bold text-[#c64f66]">未扣款</span>}
              </div>
            </section>
          );
        })}

        {activeTab === 'spend' && visiblePointSpendRecords.map((record) => (
          <section key={record.id} className="flex items-center rounded-[19px] border border-[#ece9f1] bg-white p-4 shadow-[0_9px_24px_rgba(58,49,75,0.05)]">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] ${record.type === 'lottery' ? 'bg-[#fff3c7] text-[#e8ad12]' : 'bg-[#eee8ff] text-[#805ee0]'}`}>{record.type === 'lottery' ? <Sparkles size={24} /> : <Gift size={24} />}</span>
            <div className="ml-3 min-w-0 flex-1"><h2 className="truncate text-[15px] font-bold text-[#2b2730]">{record.title}</h2><p className="mt-1 text-[11px] text-[#817a86]">{record.createdAt}</p></div>
            <div className="ml-2 text-right"><p className="text-[17px] font-black text-[#ec5f7e]">-{record.points.toLocaleString()}</p><p className="mt-1 text-[10px] text-[#817a86]">积分</p></div>
          </section>
        ))}

        {activeTab === 'income' && visiblePointIncomeRecords.map((record) => (
          <section key={record.id} className="flex items-center rounded-[19px] border border-[#ece9f1] bg-white p-4 shadow-[0_9px_24px_rgba(58,49,75,0.05)]">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] ${record.type === 'interaction' ? 'bg-[#e8f8f0] text-[#46a979]' : 'bg-[#fff2d8] text-[#d99b28]'}`}>{record.type === 'interaction' ? <HeartHandshake size={24} /> : <CalendarHeart size={24} />}</span>
            <div className="ml-3 min-w-0 flex-1"><h2 className="truncate text-[15px] font-bold text-[#2b2730]">{record.title === '今日互动奖励' ? '互动奖励' : record.title === '连续签到活动' ? '运营活动' : record.title}</h2><p className="mt-1 text-[11px] text-[#817a86]">{record.createdAt}</p></div>
            <div className="ml-2 text-right"><p className="text-[17px] font-black text-[#43a477]">+{record.points.toLocaleString()}</p><p className="mt-1 text-[10px] text-[#817a86]">积分</p></div>
          </section>
        ))}

        {activeTab === 'spend' && visiblePointSpendRecords.length === 0 && (!mallRedemptionOrders || mallRedemptionOrders.length === 0) && <div className="py-16 text-center text-[#8e8793]"><ReceiptText size={34} className="mx-auto mb-3 opacity-50" /><p className="text-[13px] font-semibold">暂无积分支出记录</p></div>}
        {activeTab === 'income' && visiblePointIncomeRecords.length === 0 && <div className="py-16 text-center text-[#8e8793]"><ReceiptText size={34} className="mx-auto mb-3 opacity-50" /><p className="text-[13px] font-semibold">暂无积分收入记录</p></div>}
      </div>
    </div>
  );
};

export default PointsLedger;
