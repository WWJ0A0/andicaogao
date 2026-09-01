import React, { useMemo, useRef, useState } from 'react';
import { ArrowLeft, Award, BadgeCheck, ChevronRight, ImagePlus, Medal, PenLine, Sparkles, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type CampaignScreen = 'home' | 'submit' | 'results';

const selectedWorks = [
  { id: 1, name: '莓果云朵熊', designer: 'Mia', tone: 'from-[#ffd5e2] via-[#fff0cf] to-[#d9c8ff]', emoji: '🍓', own: true },
  { id: 2, name: '星夜漫游者', designer: 'Moon7', tone: 'from-[#bab1ff] via-[#d9e6ff] to-[#fff3c7]', emoji: '🌙' },
  { id: 3, name: '抹茶奶油团', designer: 'Aki', tone: 'from-[#cce8bb] via-[#f3f5c9] to-[#fff0d6]', emoji: '🍵' },
  { id: 4, name: '海盐苏打梦', designer: 'Nono', tone: 'from-[#bde9ff] via-[#e7f8ff] to-[#e4d5ff]', emoji: '🫧' },
  { id: 5, name: '焦糖小侦探', designer: '阿栗', tone: 'from-[#f0c894] via-[#fff0ce] to-[#ddc5ac]', emoji: '🔎' },
  { id: 6, name: '花园散步日', designer: 'Luna', tone: 'from-[#ffcbdc] via-[#e9f3c2] to-[#fff6de]', emoji: '🌷' },
];

const PlushMascot: React.FC<{ small?: boolean }> = ({ small = false }) => (
  <div className={`relative ${small ? 'h-28 w-28' : 'h-52 w-52'}`}>
    <span className="absolute bottom-2 left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-full bg-[#7654a6]/15 blur-md" />
    <img
      src="/images/mo0uw8au-tlddmuo.png"
      alt="Ropet 毛绒套展示"
      className="relative h-full w-full object-contain drop-shadow-[0_18px_18px_rgba(70,47,95,0.18)]"
    />
  </div>
);

const H5Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-[100dvh] w-full bg-[#cfd5df]">
    <div className="relative mx-auto min-h-[100dvh] w-full max-w-[500px] overflow-hidden bg-[#f5eddd] text-black shadow-[0_0_60px_rgba(0,0,0,0.15)]">
      {children}
    </div>
  </div>
);

const TopBar: React.FC<{ title: string; onBack: () => void; action?: React.ReactNode }> = ({ title, onBack, action }) => (
  <header className="relative z-20 flex h-[92px] items-center justify-between px-5 pt-3">
    <button type="button" onClick={onBack} aria-label="返回" className="flex h-11 w-11 -rotate-6 items-center justify-center border-[3px] border-black bg-white text-black shadow-[5px_5px_0_#000] active:translate-y-0.5">
      <ArrowLeft size={22} />
    </button>
    <h1 className="absolute left-1/2 top-[38px] -translate-x-1/2 -rotate-1 bg-black px-5 py-2 text-[14px] font-black tracking-[1px] text-white shadow-[5px_5px_0_#e60012]">{title}</h1>
    <div className="min-w-10 text-right">{action}</div>
  </header>
);

const CampaignHome: React.FC = () => {
  const navigate = useNavigate();
  return (
    <H5Shell>
      <div className="absolute inset-0 opacity-[0.13]" style={{ backgroundImage: 'radial-gradient(#000 1.3px,transparent 1.3px)', backgroundSize: '7px 7px' }} />
      <div className="absolute -left-24 top-28 h-80 w-[145%] -rotate-6 bg-[#e60012]" />
      <div className="absolute -right-24 top-[410px] h-24 w-72 rotate-12 bg-black" />
      <TopBar title="ROPET DESIGN HEIST" onBack={() => navigate(-1)} action={<button type="button" onClick={() => navigate('/plush-design/results')} className="-rotate-2 border-[3px] border-black bg-[#ffe632] px-3 py-2 text-[10px] font-black shadow-[4px_4px_0_#000]">RESULT<br /><span className="text-[12px]">入选名单</span></button>} />
      <main className="relative z-10 mx-auto max-w-[430px] px-4 pb-10 sm:px-5">
        <section className="relative min-h-[500px] overflow-hidden border-[4px] border-black bg-[#f5eddd] px-5 pb-5 pt-6 shadow-[8px_8px_0_#000] [clip-path:polygon(0_0,94%_0,100%_8%,96%_100%,4%_97%)]">
          <span className="inline-block -rotate-3 border-[3px] border-black bg-[#ffe632] px-4 py-2 text-[11px] font-black tracking-[1.5px] shadow-[4px_4px_0_#000]">LIMITED MISSION</span>
          <h2 className="relative mt-5 max-w-[270px] text-[38px] font-black leading-[40px] tracking-[-2px]">设计你的<br /><span className="inline-block bg-black px-2 text-white">ROPet</span><br /><span className="text-[#e60012] [text-shadow:2px_2px_0_#000]">毛绒套!</span></h2>
          <span className="absolute right-3 top-24 rotate-6 border-[3px] border-black bg-[#ffe632] px-3 py-2 text-[12px] font-black italic shadow-[4px_4px_0_#000]">WANTED!</span>
          <p className="relative mt-5 max-w-[250px] border-l-[6px] border-[#e60012] bg-white px-3 py-3 text-[11px] font-black leading-5 shadow-[4px_4px_0_#000]">发布到社媒并提交作品，有机会被官方选中打样并正式量产。</p>
          <div className="absolute -right-8 top-[180px]"><PlushMascot /></div>
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-[3px] border-white bg-black px-4 py-3 text-white shadow-[5px_5px_0_#e60012]">
            <div><p className="text-[8px] font-black tracking-[2px] text-[#ffe632]">DEADLINE</p><p className="mt-1 text-[15px] font-black">09.20 / 24:00</p></div>
            <span className="border-2 border-white px-3 py-2 text-[9px] font-black">全球创作者可参与</span>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center"><span className="mr-3 flex h-9 w-9 -rotate-6 items-center justify-center border-[3px] border-black bg-[#e60012] text-white"><Sparkles size={18} /></span><h3 className="bg-black px-4 py-2 text-[14px] font-black tracking-[1px] text-white">MISSION REWARDS</h3></div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[
              { icon: Award, title: '第一件', text: '实物样品', color: '#ffb12e' },
              { icon: Medal, title: '限定', text: '设计师徽章', color: '#8b62ee' },
              { icon: PenLine, title: '正式商品', text: '设计署名', color: '#f06f9d' },
            ].map(({ icon: Icon, title, text, color }) => (
              <div key={text} className="relative border-[3px] border-black bg-white p-3 shadow-[5px_5px_0_#000]">
                <span className="flex h-9 w-9 items-center justify-center border-2 border-black" style={{ backgroundColor: color, color: '#fff' }}><Icon size={19} /></span>
                <strong className="mt-3 block text-[12px] font-black">{title}</strong>
                <span className="mt-0.5 block text-[9px] font-bold text-black/55">{text}</span>
              </div>
            ))}
          </div>
        </section>

        <button type="button" onClick={() => navigate('/plush-design/submit')} className="mt-8 flex h-16 w-full items-center justify-center border-[4px] border-black bg-[#e60012] text-[17px] font-black italic text-white shadow-[8px_8px_0_#000] active:translate-y-0.5">
          接受任务 / 我要参加 <ChevronRight size={20} className="ml-1" strokeWidth={3} />
        </button>
        <p className="mt-5 text-center text-[9px] font-bold text-black/40">提交即表示同意活动规则与作品授权说明</p>
      </main>
    </H5Shell>
  );
};

const CampaignSubmit: React.FC = () => {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const [postUrl, setPostUrl] = useState('');
  const [workName, setWorkName] = useState('');
  const [designerName, setDesignerName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const ready = postUrl.trim() && workName.trim() && designerName.trim() && previewUrl;

  if (submitted) {
    return (
      <H5Shell>
        <div className="absolute inset-0 bg-[#f5eddd]" />
        <div className="absolute inset-0 opacity-[0.13]" style={{ backgroundImage: 'radial-gradient(#000 1.4px,transparent 1.4px)', backgroundSize: '7px 7px' }} />
        <div className="absolute -left-20 top-16 h-48 w-[130%] -rotate-6 bg-[#e60012]" />
        <main className="relative z-10 flex min-h-[100dvh] flex-col items-center px-6 pt-36 text-center">
          <span className="flex h-20 w-20 rotate-6 items-center justify-center border-[4px] border-black bg-[#ffe632] text-black shadow-[7px_7px_0_#000]"><BadgeCheck size={45} /></span>
          <h1 className="mt-8 -rotate-2 bg-black px-5 py-2 text-[30px] font-black italic text-white shadow-[7px_7px_0_#e60012]">投稿成功!</h1>
          <p className="mt-7 border-[3px] border-black bg-white px-8 py-4 text-[14px] font-bold leading-7 text-black shadow-[5px_5px_0_#000]">入选结果将在<br /><strong className="text-[22px] text-[#e60012]">09 月 28 日</strong>公布。</p>
          <div className="mt-8 w-full -rotate-1 border-[3px] border-black bg-[#ffe632] p-4 text-left shadow-[6px_6px_0_#000]">
            <p className="text-[10px] font-black tracking-[2px] text-black/60">MISSION SUBMITTED</p>
            <p className="mt-2 text-[17px] font-black text-black">{workName}</p>
            <p className="mt-1 text-[11px] font-bold text-black/60">设计师 · {designerName}</p>
          </div>
          <button type="button" onClick={() => navigate('/interaction-history')} className="mt-8 w-full border-[4px] border-black bg-[#e60012] py-4 text-[16px] font-black text-white shadow-[7px_7px_0_#000]">完成 / 返回商城</button>
        </main>
      </H5Shell>
    );
  }

  return (
    <H5Shell>
      <div className="absolute inset-0 bg-[#f5eddd]" />
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(#000 1.2px,transparent 1.2px)', backgroundSize: '7px 7px' }} />
      <div className="absolute -right-32 top-8 h-52 w-[120%] rotate-6 bg-[#e60012]" />
      <TopBar title="提交作品" onBack={() => navigate('/plush-design')} />
      <main className="relative z-10 mx-auto max-w-[430px] px-4 pb-8 sm:px-5">
        <div className="mb-5 inline-block -rotate-2 border-[3px] border-black bg-[#ffe632] px-4 py-2 text-[13px] font-black shadow-[4px_4px_0_#000]">MISSION FILE / 投稿资料</div>
        <section className="mb-4 flex items-center border-[3px] border-black bg-white p-3 shadow-[5px_5px_0_#000]">
          <span className="flex h-10 w-10 rotate-6 items-center justify-center border-2 border-black bg-[#e60012] text-[18px]">🐾</span>
          <div className="ml-3"><p className="text-[10px] font-bold text-black/50">投稿账号（App 自动带入）</p><p className="mt-0.5 text-[13px] font-black text-black">Ropet_123456</p></div>
          <BadgeCheck size={18} className="ml-auto text-[#e60012]" />
        </section>

        <div className="space-y-3">
          <label className="block"><span className="inline-block bg-black px-2 py-1 text-[10px] font-black text-white">01 / 社媒帖子链接</span><input value={postUrl} onChange={(e) => setPostUrl(e.target.value)} placeholder="粘贴已发布作品的帖子链接" className="mt-1.5 h-11 w-full border-[3px] border-black bg-white px-3 text-[12px] font-bold outline-none focus:shadow-[4px_4px_0_#e60012]" /></label>
          <div><span className="inline-block bg-black px-2 py-1 text-[10px] font-black text-white">02 / 作品图片</span><input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) setPreviewUrl(URL.createObjectURL(file)); }} />
            {previewUrl ? <div className="relative mt-1.5 h-32 overflow-hidden border-[3px] border-black bg-white shadow-[5px_5px_0_#000]"><img src={previewUrl} alt="作品预览" className="h-full w-full object-cover" /><button type="button" onClick={() => setPreviewUrl('')} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center border-2 border-white bg-black text-white"><X size={17} /></button></div> : <button type="button" onClick={() => fileInput.current?.click()} className="mt-1.5 flex h-28 w-full flex-col items-center justify-center border-[3px] border-dashed border-black bg-[#ffe632] text-black shadow-[5px_5px_0_#000]"><ImagePlus size={25} /><span className="mt-1.5 text-[11px] font-black">UPLOAD / 上传作品图片</span><span className="mt-0.5 text-[8px] font-bold text-black/50">支持 JPG、PNG</span></button>}
          </div>
          <label className="block"><span className="inline-block bg-black px-2 py-1 text-[10px] font-black text-white">03 / 作品名称</span><input value={workName} onChange={(e) => setWorkName(e.target.value)} maxLength={24} placeholder="给你的设计起个名字" className="mt-1.5 h-11 w-full border-[3px] border-black bg-white px-3 text-[12px] font-bold outline-none focus:shadow-[4px_4px_0_#e60012]" /></label>
          <label className="block"><span className="inline-block bg-black px-2 py-1 text-[10px] font-black text-white">04 / 设计师展示昵称</span><input value={designerName} onChange={(e) => setDesignerName(e.target.value)} maxLength={16} placeholder="入选展示时使用" className="mt-1.5 h-11 w-full border-[3px] border-black bg-white px-3 text-[12px] font-bold outline-none focus:shadow-[4px_4px_0_#e60012]" /></label>
        </div>
        <aside className="mt-5 border-l-[5px] border-[#e60012] bg-white px-3 py-2 text-[9px] font-bold leading-5 text-black shadow-[3px_3px_0_#000]">
          上传并提交作品，即视为你已阅读并同意
          <button type="button" onClick={() => setShowAgreement(true)} className="ml-1 font-black text-[#e60012] underline underline-offset-2">《活动投稿与作品授权免责协议》</button>
        </aside>
        <button type="button" disabled={!ready} onClick={() => setSubmitted(true)} className="mt-5 flex h-14 w-full -rotate-1 items-center justify-center border-[4px] border-black bg-[#e60012] text-[15px] font-black italic text-white shadow-[7px_7px_0_#000] disabled:bg-[#888] disabled:shadow-[4px_4px_0_#000]"><Upload size={18} className="mr-2" />SUBMIT / 提交作品</button>
      </main>
      {showAgreement && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-3" onClick={() => setShowAgreement(false)}>
          <section className="w-full max-w-[430px] border-[4px] border-black bg-[#f5eddd] p-5 shadow-[8px_8px_0_#e60012]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between"><h2 className="bg-black px-3 py-2 text-[14px] font-black text-white">投稿与作品授权免责协议</h2><button type="button" onClick={() => setShowAgreement(false)} className="flex h-9 w-9 items-center justify-center border-[3px] border-black bg-[#ffe632]"><X size={18} /></button></div>
            <div className="mt-4 space-y-2 text-[11px] font-bold leading-5 text-black/75">
              <p>1. 投稿者确认拥有作品的完整著作权，且作品不侵犯任何第三方合法权益。</p>
              <p>2. 投稿即授权主办方在本活动宣传、评审和结果展示范围内使用作品及展示昵称。</p>
              <p>3. 入选作品的打样、量产及商业授权将另行联系并签署正式协议。</p>
              <p>4. 因投稿内容侵权或信息不实产生的责任由投稿者承担。</p>
            </div>
            <button type="button" onClick={() => setShowAgreement(false)} className="mt-5 h-12 w-full border-[3px] border-black bg-[#e60012] text-[13px] font-black text-white shadow-[4px_4px_0_#000]">我知道了</button>
          </section>
        </div>
      )}
    </H5Shell>
  );
};

const CampaignResults: React.FC = () => {
  const navigate = useNavigate();
  const works = useMemo(() => selectedWorks, []);
  return (
    <H5Shell>
      <div className="absolute inset-0 bg-[#f5eddd]" />
      <div className="absolute inset-0 opacity-[0.13]" style={{ backgroundImage: 'radial-gradient(#000 1.3px,transparent 1.3px)', backgroundSize: '7px 7px' }} />
      <div className="absolute -left-20 top-16 h-52 w-[135%] -rotate-6 bg-[#e60012]" />
      <TopBar title="入选结果" onBack={() => navigate('/plush-design')} />
      <main className="relative z-10 mx-auto max-w-[430px] px-4 pb-10 sm:px-5">
        <div className="text-center"><span className="inline-block rotate-12 border-[3px] border-black bg-[#ffe632] px-3 py-1 text-[18px] font-black shadow-[4px_4px_0_#000]">MISSION COMPLETE!</span><h2 className="mx-auto mt-5 w-fit -rotate-2 bg-black px-5 py-3 text-[28px] font-black italic text-white shadow-[7px_7px_0_#e60012]">本期入选设计公布</h2><p className="mt-5 text-[11px] font-black text-black/60">感谢每一位设计师带来的奇思妙想</p></div>
        <section className="mt-6 -rotate-1 border-[4px] border-black bg-[#ffe632] p-4 shadow-[7px_7px_0_#000]">
          <div className="flex items-center"><span className="flex h-11 w-11 rotate-6 items-center justify-center border-[3px] border-black bg-[#e60012] text-white"><Sparkles size={23} /></span><div className="ml-3"><strong className="text-[15px] font-black text-black">恭喜，你的设计入选啦！</strong><p className="mt-1 text-[10px] font-bold text-black/65">我们将联系你进行后续打样。</p></div></div>
          <p className="mt-3 border-t-[3px] border-black pt-3 text-[10px] font-bold leading-5 text-black/60">限定设计师徽章将由官方发放至当前 App 账号。</p>
        </section>
        <section className="mt-5 grid grid-cols-2 gap-3">
          {works.map((work, index) => <article key={work.id} className={`relative overflow-hidden border-[3px] border-black bg-white p-2.5 shadow-[5px_5px_0_#000] ${index % 2 ? 'rotate-1' : '-rotate-1'}`}>
            {work.own && <span className="absolute left-2 top-2 z-10 -rotate-3 border-2 border-black bg-[#e60012] px-2 py-1 text-[9px] font-black text-white">我的作品!</span>}
            <div className={`flex h-28 items-center justify-center border-2 border-black bg-gradient-to-br ${work.tone}`}><span className="text-[42px] drop-shadow-sm">{work.emoji}</span><div className="absolute mt-7 scale-[0.56]"><PlushMascot small /></div></div>
            <h3 className="mt-3 truncate text-[12px] font-black text-black">{work.name}</h3><p className="mt-1 text-[9px] font-bold text-black/50">设计师 · {work.designer}</p>
          </article>)}
        </section>
      </main>
    </H5Shell>
  );
};

const PlushDesignCampaign: React.FC<{ screen: CampaignScreen }> = ({ screen }) => {
  if (screen === 'submit') return <CampaignSubmit />;
  if (screen === 'results') return <CampaignResults />;
  return <CampaignHome />;
};

export default PlushDesignCampaign;
