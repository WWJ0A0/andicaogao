import React from 'react';
import { useNavigate } from 'react-router-dom';

const PetBasicSettings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen flex justify-center bg-[#d8deea] overflow-hidden py-4">
      <div className="relative w-[393px] h-[852px] overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)] bg-white">
        <div className="flex flex-col items-start w-[393px] h-[852px] bg-white">
          <div className="flex flex-col items-start self-stretch">
            <div className="flex items-start self-stretch pt-[14px] pr-[14px] pb-[9px] pl-[21px]">
              <p className="w-[54px] text-center tracking-[-0.3px] text-[#19181f] text-[15px] font-semibold">9:41</p>
              <img src="/images/mo9sq26i-zkywkxs.svg" className="mt-1 ml-[233px] w-[18px] h-[11px]" alt="cellular" />
              <img src="/images/mo9sq26i-vyvuzvc.svg" className="mt-[3px] ml-[5px] w-[16px] h-[11px]" alt="wifi" />
              <img src="/images/mo9sq26i-cqvt8uc.svg" className="mt-[3px] ml-[7px] w-[24px] h-[11px]" alt="battery" />
            </div>

            <div className="relative flex items-center px-4 py-2 w-[393px] overflow-hidden">
              <img
                src="/images/mo9sq26i-lpgwpyq.svg"
                className="w-10 h-10 cursor-pointer"
                alt="back"
                onClick={() => navigate('/pet-profile')}
              />
              <p className="absolute top-3 left-[128px] w-[137px] h-8 leading-8 text-[#19181f] text-[20px] font-medium">ropet 基础设置</p>
            </div>
          </div>

          <div className="flex flex-col items-start self-stretch mt-5 gap-2">
            <div className="relative w-[393px] h-[65px] cursor-pointer">
              <p className="absolute top-5 left-5 w-[353px] h-[25px] tracking-[-0.3px] text-[#19181fcc] text-[18px]">性别</p>
              <p className="absolute top-[22px] left-[325px] w-4 h-[22px] leading-[22px] text-[#19181f66] text-[16px]">女</p>
              <img src="/images/mo9sq26i-53fvpjs.png" className="absolute top-5 left-[349px] w-6 h-6 rotate-180" alt="chevron" />
            </div>

            <div className="relative w-[393px] h-[65px] cursor-pointer">
              <p className="absolute top-5 left-5 w-[353px] h-[25px] tracking-[-0.3px] text-[#19181fcc] text-[18px]">生物钟</p>
              <p className="absolute top-[22px] left-[246px] w-[95px] h-[22px] leading-[22px] text-[#19181f66] text-[16px]">23:30-08:00</p>
              <img src="/images/mo9sq26i-53fvpjs.png" className="absolute top-5 left-[349px] w-6 h-6 rotate-180" alt="chevron" />
            </div>
          </div>

          <div className="flex items-start self-stretch mt-[560px] mr-[-1px] ml-[1px] pt-[21px] pr-[130px] pb-[8px] pl-[129px]">
            <div className="rounded-[100px] bg-[#19181f] w-[134px] h-[5px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetBasicSettings;
