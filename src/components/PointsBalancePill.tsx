import React from 'react';
import { Plus, Star } from 'lucide-react';

interface PointsBalancePillProps {
  points: number;
  onAdd: () => void;
  className?: string;
}

const PointsBalancePill: React.FC<PointsBalancePillProps> = ({ points, onAdd, className = '' }) => (
  <div className={`flex h-10 items-center rounded-[14px] border-2 border-[#7d5ce2] bg-white/95 p-1 shadow-[0_7px_18px_rgba(80,58,130,0.12)] backdrop-blur-sm ${className}`}>
    <div className="flex h-8 min-w-0 items-center pl-1 pr-2 text-[#34303a]">
      <span className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#4e91ff]">
        <Star size={17} fill="#ffe641" className="text-[#ffe641]" />
      </span>
      <strong className="truncate text-[16px] font-black">{points.toLocaleString()}</strong>
    </div>
    <span className="h-5 w-px bg-[#e5e0ea]" />
    <button type="button" onClick={onAdd} aria-label="获取更多积分" className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#8b66ef] text-white">
      <Plus size={17} strokeWidth={3} />
    </button>
  </div>
);

export default PointsBalancePill;
