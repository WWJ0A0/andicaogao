import React, { useMemo, useState } from 'react';
import { Check, ChevronLeft, KeyRound, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrototypePhone, PrototypeStatusBar } from '@/components/subscription/PrototypeUI';
import { useDialogueStore } from '@/store/useDialogueStore';
import { usePetStore } from '@/store/usePetStore';

const DEMO_CODES: Record<string, number> = { 'ROPET-6K': 6000, 'ROPET-19K': 19000, 'ROPET-48K': 48000, 'ROPET-206K': 206800 };

const RedeemCode: React.FC = () => {
  const navigate = useNavigate();
  const { pet } = usePetStore();
  const { points, purchasePoints } = useDialogueStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [redeemedPoints, setRedeemedPoints] = useState<number | null>(null);
  const normalizedCode = useMemo(() => code.trim().toUpperCase(), [code]);

  const redeem = () => {
    const amount = DEMO_CODES[normalizedCode];
    if (!amount) return setError('兑换码无效，请检查后重新输入');
    purchasePoints(amount, 0, pet?.name || '肉派派', '官网兑换码');
    setError('');
    setRedeemedPoints(amount);
  };

  if (redeemedPoints !== null) return (
    <PrototypePhone className="bg-white">
      <PrototypeStatusBar />
      <header className="relative flex h-[62px] items-center px-4"><h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-medium text-[#19181f]">兑换成功</h1></header>
      <main className="flex h-[690px] flex-col items-center px-6 pt-[72px] text-center">
        <div className="relative flex h-[116px] w-[116px] items-center justify-center rounded-full bg-[#f0ebff]"><span className="absolute inset-3 rounded-full bg-[#8b66ef] shadow-[0_15px_30px_rgba(139,102,239,0.3)]" /><Check size={44} className="relative text-white" strokeWidth={3} /><Sparkles size={24} className="absolute -right-1 top-1 text-[#f1bd37]" /></div>
        <h2 className="mt-8 text-[25px] font-semibold text-[#242129]">积分已到账</h2>
        <p className="mt-3 text-[13px] leading-6 text-[#8c8690]">兑换的积分已发放至当前绑定的<br />{pet?.name || 'Ropet'}</p>
        <div className="mt-8 w-full rounded-[22px] bg-[#f8f5ff] px-5 py-5"><div className="flex items-center justify-center text-[#7b58da]"><Star size={24} fill="currentColor" /><strong className="ml-2 text-[32px]">+{redeemedPoints.toLocaleString()}</strong></div><div className="mt-4 flex items-center justify-between border-t border-[#e8e1f6] pt-4 text-[12px]"><span className="text-[#99929e]">当前积分余额</span><strong className="text-[15px] text-[#3c3741]">{points.toLocaleString()}</strong></div></div>
        <button type="button" onClick={() => navigate('/points-store')} className="mt-auto h-[54px] w-full rounded-[18px] bg-[#8b66ef] text-[16px] font-semibold text-white shadow-[0_12px_24px_rgba(139,102,239,0.24)]">完成</button>
        <button type="button" onClick={() => { setCode(''); setRedeemedPoints(null); }} className="mt-2 h-11 text-[13px] font-semibold text-[#7d7584]">继续兑换</button>
      </main>
    </PrototypePhone>
  );

  return (
    <PrototypePhone className="bg-white">
      <PrototypeStatusBar />
      <header className="relative flex h-[62px] items-center px-4"><button type="button" aria-label="返回" onClick={() => navigate('/pet-basic-settings')} className="flex h-11 w-11 items-center justify-center rounded-[14px] text-[#19181f]"><ChevronLeft size={28} /></button><h1 className="absolute left-1/2 -translate-x-1/2 text-[20px] font-medium text-[#19181f]">兑换码</h1><button type="button" disabled={!normalizedCode} onClick={redeem} className={`ml-auto h-11 min-w-[72px] rounded-[18px] px-4 text-[15px] font-semibold text-white ${normalizedCode ? 'bg-[#8b66ef]' : 'bg-[#d8d7db]'}`}>确定</button></header>
      <main className="px-5 pt-7">
        <div className={`flex min-h-[62px] items-center rounded-[18px] border px-4 ${error ? 'border-[#ed7b83] bg-[#fffafb]' : 'border-[#e6e3e8] bg-[#fafafa]'}`}><KeyRound size={20} className="mr-3 shrink-0 text-[#aaa4ad]" /><input value={code} onChange={(event) => { setCode(event.target.value); setError(''); }} onKeyDown={(event) => { if (event.key === 'Enter' && normalizedCode) redeem(); }} autoCapitalize="characters" autoComplete="off" placeholder="请输入兑换码" aria-label="兑换码" className="min-w-0 flex-1 bg-transparent text-[17px] uppercase text-[#242129] outline-none placeholder:normal-case placeholder:text-[#c8c5cb]" /></div>
        {error ? <p className="mt-3 px-2 text-[12px] text-[#d75862]">{error}</p> : <p className="mt-4 text-center text-[13px] leading-6 text-[#aaa5ad]">所兑换的积分将直接发放至<br />当前与您配对的 {pet?.name || 'ropet'}。</p>}
        <section className="mt-10 rounded-[20px] bg-[#f8f6fb] px-4 py-4 text-[12px] leading-6 text-[#817a86]"><strong className="block text-[13px] text-[#4a444f]">如何获得兑换码？</strong><p className="mt-1">请前往 Ropet 官方商城下单，兑换码将由网站客服发送给您。</p><button type="button" onClick={() => navigate('/points-store')} className="mt-3 font-semibold text-[#7c58dc]">查看购买指引 →</button></section>
        <p className="mt-5 text-center text-[10px] text-[#bbb6be]">原型演示可用：ROPET-6K</p>
      </main>
    </PrototypePhone>
  );
};

export default RedeemCode;
