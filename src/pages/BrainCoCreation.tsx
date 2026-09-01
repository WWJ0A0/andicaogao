import React, { useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, ImagePlus, Send, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDialogueStore } from '@/store/useDialogueStore';

const suggestionTypes = ['分享温情瞬间', 'Po 出独特装扮', '期待互动能力', '反馈使用问题'];

const BrainMascot: React.FC = () => (
  <div className="relative h-[106px] w-[172px]" aria-hidden="true">
    <span className="absolute left-4 top-7 h-16 w-20 rounded-[46%] bg-[#ffb0b8] shadow-[inset_0_-7px_0_rgba(224,88,105,0.12)]" />
    <span className="absolute left-0 top-10 h-12 w-12 rounded-full bg-[#ffb0b8]" />
    <span className="absolute left-12 top-3 h-16 w-16 rounded-full bg-[#ffb0b8]" />
    <span className="absolute left-[82px] top-5 h-[72px] w-[74px] rounded-full bg-[#ffb0b8]" />
    <span className="absolute left-[142px] top-11 h-10 w-10 rounded-full bg-[#ffb0b8]" />
    <span className="absolute left-[76px] top-[52px] h-2 w-2 rounded-full bg-[#cf5361]" />
    <span className="absolute left-[108px] top-[52px] h-2 w-2 rounded-full bg-[#cf5361]" />
    <span className="absolute left-[87px] top-[68px] h-4 w-7 rounded-b-full bg-white" />
    <span className="absolute bottom-0 left-[88px] h-8 w-5 rounded-b-full bg-[#ffb0b8]" />
  </div>
);

const BrainCoCreation: React.FC = () => {
  const navigate = useNavigate();
  const addPoints = useDialogueStore((state) => state.addPoints);
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState(suggestionTypes[0]);
  const [content, setContent] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [submissionRewarded, setSubmissionRewarded] = useState(false);
  const canSubmit = content.trim().length > 0;

  const submitSuggestion = () => {
    if (!canSubmit) return;
    const earnsReward = !rewardClaimed;
    setSubmissionRewarded(earnsReward);
    if (earnsReward) {
      addPoints(160);
      setRewardClaimed(true);
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#d8deea] py-4">
      <div className="relative mx-auto h-[852px] w-[393px] overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,#d7f4ff_0%,#f0e2ff_58%,#e1c8ff_100%)] shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        <header className="relative z-20 flex h-[88px] items-end justify-center px-5 pb-3">
          <span className="absolute left-7 top-4 text-[15px] font-semibold text-[#19181f]">9:41</span>
          <button type="button" onClick={() => navigate(-1)} aria-label="返回" className="absolute bottom-2 left-4 flex h-11 w-11 items-center justify-center text-[#19181f]"><ArrowLeft size={27} /></button>
          <h1 className="text-[21px] font-black text-[#19181f]">大脑共创计划</h1>
        </header>

        <main className="relative z-10 h-[764px] overflow-y-auto px-4 pb-8 scrollbar-hide">
          <div className="relative h-[118px]">
            <div className="absolute left-2 top-7 flex gap-2">
              {['#fff35d', '#ff8d99', '#6dcaf4', '#b56bec'].map((color, index) => <span key={color} className="h-11 w-11 rounded-[48%_48%_45%_45%] border-[3px] border-white" style={{ backgroundColor: color, transform: `translateY(${index % 2 ? 5 : 0}px)` }} />)}
            </div>
            <div className="absolute -right-1 top-0"><BrainMascot /></div>
            <span className="absolute left-[116px] top-1 -rotate-6 rounded-full bg-white px-3 py-1 text-[13px] font-black italic text-[#9a64e2] shadow-sm">Ohhhh!</span>
          </div>

          <section className="relative -mt-4 rounded-[24px] bg-white px-5 pb-6 pt-6 shadow-[0_16px_36px_rgba(104,76,139,0.12)]">
            <h2 className="text-[22px] font-black text-[#25212a]">Dear Rihana</h2>
            <p className="mt-3 text-[13px] leading-6 text-[#7e7784]">哈喽呀，Ropet 最亲密的伙伴，我们诚挚地邀请你提出宝贵意见，请在这里畅所欲言！</p>
            <p className="text-[13px] font-bold leading-6 text-[#7d58d8]">每日可提交 10 次共创建议，每日首次提交即获 160 抽奖积分。</p>

            <div className="my-5 h-px bg-[#ece8ef]" />
            <h3 className="text-[15px] font-black text-[#302b33]">选择想要共创的类型</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {suggestionTypes.map((type) => <button key={type} type="button" onClick={() => setSelectedType(type)} className={`h-10 rounded-full border text-[12px] font-bold ${selectedType === type ? 'border-[#8b66ef] bg-[#f0ebff] text-[#7353cf]' : 'border-[#ddd9df] bg-[#fafafa] text-[#514b55]'}`}>{type}</button>)}
            </div>

            <label className="mt-5 block">
              <textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={1000} placeholder="感谢您的分享！说说你的想法或遇到的问题吧。" className="h-[190px] w-full resize-none rounded-[18px] bg-[#f7f7f8] p-4 text-[13px] leading-6 text-[#403a44] outline-none placeholder:text-[#c0bac3] focus:ring-2 focus:ring-[#b49aed]" />
              <span className="-mt-8 mr-3 block text-right text-[11px] text-[#aaa3ad]">{content.length}/1000</span>
            </label>

            <div className="mt-7 flex items-end gap-3">
              <div>
                <p className="mb-2 text-[14px] font-black text-[#302b33]">上传图片 <span className="font-medium text-[#a19aa5]">{previewUrl ? 1 : 0}/1</span></p>
                <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) setPreviewUrl(URL.createObjectURL(file)); }} />
                <button type="button" onClick={() => fileInput.current?.click()} className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-[14px] border border-[#ded9e1] bg-[#fafafa] text-[#c8c2cb]">
                  {previewUrl ? <img src={previewUrl} alt="上传预览" className="h-full w-full object-cover" /> : <ImagePlus size={25} />}
                </button>
              </div>
              <button type="button" disabled={!canSubmit} onClick={submitSuggestion} className="mb-0 flex h-12 flex-1 items-center justify-center rounded-full bg-[#8b66ef] text-[15px] font-bold text-white shadow-[0_9px_20px_rgba(113,77,210,0.24)] disabled:bg-[#d6d2d9] disabled:shadow-none"><Send size={17} className="mr-2" />提交</button>
            </div>
          </section>
        </main>

        {submitted && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-7" onClick={() => setSubmitted(false)}>
            <section className="relative w-full rounded-[22px] bg-white px-6 py-7 text-center" onClick={(event) => event.stopPropagation()}>
              <button type="button" onClick={() => setSubmitted(false)} aria-label="关闭" className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#f1eff3]"><X size={17} /></button>
              <CheckCircle2 size={48} className="mx-auto text-[#7b5bdd]" />
              <h2 className="mt-4 text-[21px] font-black text-[#2d2831]">提交成功</h2>
              <p className="mt-2 text-[13px] leading-6 text-[#827b86]">感谢参与大脑共创计划<br /><strong className="text-[#7554ce]">{submissionRewarded ? '已获得 160 抽奖积分' : '今日首次提交奖励已领取'}</strong></p>
              <button type="button" onClick={() => navigate(-1)} className="mt-5 h-11 w-full rounded-full bg-[#19181f] text-[13px] font-bold text-white">完成</button>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrainCoCreation;
