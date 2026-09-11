import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const helpItems = ['ropet说明书', '配件使用说明', '常见问题'];

const HelpCenter: React.FC = () => {
  const navigate = useNavigate();
  const supportRef = useRef<HTMLDivElement>(null);

  const handleItemClick = (label: string) => {
    if (label === '常见问题') {
      supportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative flex min-h-screen w-full justify-center overflow-hidden bg-[#d8deea] py-4">
      <main className="relative h-[852px] w-[393px] overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        <header className="absolute inset-x-0 top-0 z-10 h-[96px] bg-white">
          <div className="flex h-[44px] items-center px-5 pt-3 text-[#19181f]">
            <span className="w-[54px] text-center text-[15px] font-semibold">9:41</span>
            <span className="ml-auto flex items-center gap-[6px]" aria-hidden="true">
              <img src="/images/mo9s88nl-ptaelav.svg" className="h-[11px] w-[18px]" alt="" />
              <img src="/images/mo9s88nl-e5y9xvi.svg" className="h-[11px] w-[16px]" alt="" />
              <img src="/images/mo9s88nl-1n65kfn.svg" className="h-[11px] w-[24px]" alt="" />
            </span>
          </div>
          <div className="relative flex h-[52px] items-center justify-center px-4">
            <button
              type="button"
              onClick={() => navigate('/pet-profile')}
              className="absolute left-4 flex h-10 w-10 items-center justify-center text-[#19181f] active:scale-95"
              aria-label="返回个人中心"
            >
              <ChevronLeft size={30} strokeWidth={2} />
            </button>
            <h1 className="text-[19px] font-semibold text-[#19181f]">帮助与客服</h1>
          </div>
        </header>

        <div className="scrollbar-hide absolute inset-x-0 bottom-0 top-[96px] overflow-y-auto bg-white pb-8">
          <nav aria-label="帮助中心分类" className="px-5 pt-3">
            {helpItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleItemClick(item)}
                className="flex h-[70px] w-full items-center justify-between border-b border-[#f1f1f2] text-left text-[#19181f] active:opacity-50"
              >
                <span className="text-[17px] leading-6">{item}</span>
                <ChevronRight size={19} className="text-[#88858b]" strokeWidth={1.8} />
              </button>
            ))}
          </nav>

          <section ref={supportRef} className="mx-5 mt-5 scroll-mt-4 rounded-[8px] border border-[#e6e6e8] px-4 pb-5 pt-4">
            <h2 className="text-left text-[17px] font-semibold text-[#19181f]">WhatsApp即时客服</h2>
            <div className="mt-3">
              <img
                src="/images/ropet-whatsapp-qr-clean.png"
                alt="Ropet AI Robot Pet WhatsApp 客服二维码"
                width="720"
                height="720"
                className="mx-auto block h-auto w-[260px] max-w-full"
              />
            </div>
            <div className="mt-3 flex items-center border-t border-[#eeeeef] pt-4">
              <img
                src="/images/ropet-whatsapp-avatar.jpg"
                alt="Ropet AI Robot Pet 头像"
                className="h-12 w-12 shrink-0 rounded-full border border-[#eeeeef] object-cover"
              />
              <div className="ml-3 min-w-0">
                <p className="text-[14px] font-semibold text-[#19181f]">Ropet AI Robot Pet</p>
                <p className="mt-1 text-[10px] leading-[15px] text-[#99969d]">
                  Scan or upload this QR code using the WhatsApp camera to add me on WhatsApp.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HelpCenter;
