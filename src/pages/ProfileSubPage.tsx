import React from 'react';
import { useNavigate } from 'react-router-dom';

type ProfileSubPageProps = {
  title: string;
};

const ProfileSubPage: React.FC<ProfileSubPageProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen flex justify-center bg-[#d8deea] overflow-hidden py-4">
      <div className="relative w-[393px] h-[852px] overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)] bg-white">
        <div className="flex items-center px-4 py-2">
          <button type="button" onClick={() => navigate('/pet-profile')} className="w-10 h-10 rounded-[12px] bg-[#f4f4f4] text-[#19181f]">
            ‹
          </button>
          <p className="ml-3 text-[20px] leading-8 text-[#19181f] font-medium">{title}</p>
        </div>
        <div className="px-5 pt-8 text-[#19181f99] text-[16px]">页面开发中</div>
      </div>
    </div>
  );
};

export default ProfileSubPage;
