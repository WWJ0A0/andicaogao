import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PointsLedger from '@/components/PointsLedger';
import { PrototypePhone, PrototypeStatusBar } from '@/components/subscription/PrototypeUI';

const PointSpendRecords: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PrototypePhone className="bg-[#fbf9ff]">
      <PrototypeStatusBar />
      <header className="relative flex h-[62px] items-center px-4">
        <button type="button" aria-label="返回上一级" onClick={() => navigate(-1)} className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#ececf0] bg-white text-[#19181f]">
          <ChevronLeft size={25} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold text-[#19181f]">积分明细</h1>
      </header>
      <main className="h-[752px] overflow-y-auto px-5 pb-8 pt-3 scrollbar-hide">
        <PointsLedger />
      </main>
    </PrototypePhone>
  );
};

export default PointSpendRecords;
