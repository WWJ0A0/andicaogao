import React, { useState } from 'react';
import { CalendarHeart, ChevronLeft, Gift, HeartHandshake, ReceiptText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrototypePhone, PrototypeStatusBar } from '@/components/subscription/PrototypeUI';
import { useDialogueStore } from '@/store/useDialogueStore';

const PointSpendRecords: React.FC = () => {
  const navigate = useNavigate();
  const { pointSpendRecords, pointIncomeRecords } = useDialogueStore();
  const [activeTab, setActiveTab] = useState<'spend' | 'income'>('spend');

  return (
    <PrototypePhone className="bg-[#fbf9ff]">
      <PrototypeStatusBar />
      <header className="relative flex h-[62px] items-center px-4">
        <button
          type="button"
          aria-label="返回商城"
          onClick={() => navigate('/interaction-history')}
          className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#ececf0] bg-white text-[#19181f]"
        >
          <ChevronLeft size={25} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold text-[#19181f]">积分明细</h1>
      </header>

      <main className="h-[752px] overflow-y-auto px-5 pb-8 pt-3 scrollbar-hide">
        <div className="grid grid-cols-2 rounded-[15px] bg-[#efedf2] p-1">
          <button
            type="button"
            onClick={() => setActiveTab('spend')}
            className={`h-10 rounded-[12px] text-[13px] font-bold transition-colors ${activeTab === 'spend' ? 'bg-white text-[#7b58db] shadow-sm' : 'text-[#8f8994]'}`}
          >
            支出
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('income')}
            className={`h-10 rounded-[12px] text-[13px] font-bold transition-colors ${activeTab === 'income' ? 'bg-white text-[#7b58db] shadow-sm' : 'text-[#8f8994]'}`}
          >
            收入
          </button>
        </div>

        <section className="mt-4 rounded-[17px] bg-[#f1ecff] px-4 py-3 text-[12px] font-medium leading-5 text-[#735cb0]">
          {activeTab === 'spend'
            ? '记录在商城兑换物品、参与抽奖等产生的积分消耗。'
            : '记录互动获得的积分，以及签到、成长任务等活动奖励。'}
        </section>

        <div className="mt-5 space-y-3">
          {activeTab === 'spend' && (pointSpendRecords ?? []).map((record) => (
            <section key={record.id} className="flex items-center rounded-[19px] border border-[#ece9f1] bg-white p-4 shadow-[0_9px_24px_rgba(58,49,75,0.05)]">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] ${
                record.type === 'lottery' ? 'bg-[#fff3c7] text-[#e8ad12]' : 'bg-[#eee8ff] text-[#805ee0]'
              }`}>
                {record.type === 'lottery' ? <Sparkles size={24} /> : <Gift size={24} />}
              </span>
              <div className="ml-3 min-w-0 flex-1">
                <h2 className="truncate text-[15px] font-bold text-[#2b2730]">{record.title}</h2>
                <p className="mt-1 text-[11px] text-[#9b95a0]">{record.createdAt}</p>
              </div>
              <div className="ml-2 text-right">
                <p className="text-[17px] font-black text-[#ec5f7e]">-{record.points.toLocaleString()}</p>
                <p className="mt-1 text-[10px] text-[#a39ca8]">积分</p>
              </div>
            </section>
          ))}

          {activeTab === 'income' && (pointIncomeRecords ?? []).map((record) => (
            <section key={record.id} className="flex items-center rounded-[19px] border border-[#ece9f1] bg-white p-4 shadow-[0_9px_24px_rgba(58,49,75,0.05)]">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] ${
                record.type === 'interaction' ? 'bg-[#e8f8f0] text-[#46a979]' : 'bg-[#fff2d8] text-[#d99b28]'
              }`}>
                {record.type === 'interaction' ? <HeartHandshake size={24} /> : <CalendarHeart size={24} />}
              </span>
              <div className="ml-3 min-w-0 flex-1">
                <h2 className="truncate text-[15px] font-bold text-[#2b2730]">{record.title}</h2>
                <p className="mt-1 text-[11px] text-[#9b95a0]">{record.createdAt}</p>
              </div>
              <div className="ml-2 text-right">
                <p className="text-[17px] font-black text-[#43a477]">+{record.points.toLocaleString()}</p>
                <p className="mt-1 text-[10px] text-[#a39ca8]">积分</p>
              </div>
            </section>
          ))}

          {activeTab === 'spend' && (!pointSpendRecords || pointSpendRecords.length === 0) && (
            <div className="py-20 text-center text-[#aaa4af]">
              <ReceiptText size={34} className="mx-auto mb-3 opacity-50" />
              <p className="text-[13px] font-semibold">暂无积分支出记录</p>
            </div>
          )}
          {activeTab === 'income' && (!pointIncomeRecords || pointIncomeRecords.length === 0) && (
            <div className="py-20 text-center text-[#aaa4af]">
              <ReceiptText size={34} className="mx-auto mb-3 opacity-50" />
              <p className="text-[13px] font-semibold">暂无积分收入记录</p>
            </div>
          )}
        </div>
      </main>
    </PrototypePhone>
  );
};

export default PointSpendRecords;
