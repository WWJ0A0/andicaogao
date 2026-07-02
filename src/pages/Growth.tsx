import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { usePetStore } from '@/store/usePetStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import {
  TRANSLATION_COLLAR_STAGE,
  getGrowthStageIndex,
  isTranslationCollarUnlocked,
} from '@/utils/translationCollar';

const stageMeta = [
  {
    name: '认知形成期',
    icon: '🌱',
    title: '认知形成期',
    description: '开始认识周围环境，对主人的互动有明显的反应。',
  },
  {
    name: '探索成长阶段',
    icon: '🌿',
    title: '探索成长阶段',
    description: '好奇心更强，会尝试理解你的习惯和互动方式。',
  },
  {
    name: '成熟期',
    icon: '🌳',
    title: '成熟期',
    description: '情绪表达更稳定，也会更主动地回应你的陪伴。',
  },
  {
    name: TRANSLATION_COLLAR_STAGE,
    icon: '🌳',
    title: '萌言萌语期',
    description: '它开始用自己的方式说话啦，也许句子还不太完整，但已经藏不住小小的真心。',
  },
];

const CollarPreview = () => (
  <div className="relative h-[94px] w-[138px] shrink-0">
    <div className="absolute bottom-2 left-1/2 h-3 w-[88px] -translate-x-1/2 rounded-[50%] bg-[#25212b]/10 blur-[8px]" />
    <div className="absolute right-2 top-[24px] h-[52px] w-[94px] -rotate-6 rounded-[50%] border border-[#c7cbd5] bg-gradient-to-br from-[#f4f6fb] via-[#d8dce7] to-[#a9aebc] shadow-[inset_0_8px_14px_rgba(255,255,255,0.78),0_10px_18px_rgba(61,65,80,0.15)]">
      <div className="absolute left-[15px] top-[10px] h-[28px] w-[54px] rounded-[50%] bg-[#fafbff]" />
      <div className="absolute left-[8px] top-[28px] h-[25px] w-[25px] rounded-full bg-gradient-to-br from-[#eef3ff] to-[#aeb4c2]">
        <div className="absolute inset-[4px] rounded-full border-2 border-[#62cfff] bg-[#c9edff]" />
      </div>
      <div className="absolute right-0 top-[30px] h-[14px] w-[28px] -rotate-12 rounded-full bg-gradient-to-br from-[#f4f5fa] to-[#9ba0ac]" />
    </div>
  </div>
);

const MengLanguagePreview = () => (
  <div className="relative h-[92px] w-[128px] shrink-0">
    <div className="absolute bottom-1 right-0 h-[62px] w-[74px] rounded-full bg-gradient-to-br from-[#fff7e4] to-[#f2eadf] opacity-85 blur-[1px]" />
    <div className="absolute right-[48px] top-[32px] flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#f4f0ec] shadow-[inset_0_4px_8px_rgba(255,255,255,0.8),0_8px_16px_rgba(70,57,87,0.08)]">
      <span className="absolute left-[9px] top-[13px] h-[6px] w-[6px] rounded-full bg-[#8f8990]" />
      <span className="absolute right-[9px] top-[13px] h-[6px] w-[6px] rounded-full bg-[#8f8990]" />
      <span className="absolute bottom-[9px] h-[5px] w-[13px] rounded-b-full border-b-2 border-[#c5bcb5]" />
    </div>
    <div className="absolute right-[6px] top-[18px] h-[46px] w-[42px] rotate-12 rounded-t-[24px] bg-gradient-to-br from-[#fff4ce] to-[#e4c372] shadow-[0_8px_14px_rgba(183,137,41,0.16)]">
      <span className="absolute left-[-10px] top-[9px] h-[22px] w-[16px] rounded-l-full border-4 border-[#f1d78d]" />
      <span className="absolute right-[-10px] top-[9px] h-[22px] w-[16px] rounded-r-full border-4 border-[#f1d78d]" />
      <span className="absolute bottom-[-14px] left-1/2 h-[16px] w-[12px] -translate-x-1/2 rounded-b bg-[#d2a948]" />
    </div>
    <button
      type="button"
      aria-label="播放萌萌语"
      className="absolute bottom-[10px] right-[4px] flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white shadow-[0_8px_18px_rgba(47,39,68,0.12)]"
    >
      <span className="ml-0.5 h-0 w-0 border-y-[7px] border-l-[10px] border-y-transparent border-l-[#222127]" />
    </button>
  </div>
);

const Growth: React.FC = () => {
  const navigate = useNavigate();
  const { pet, setPet } = usePetStore();
  const { minorModeEnabled, voiceConsentGranted } = useSubscriptionStore();
  const currentStageIndex = getGrowthStageIndex(pet?.growth_stage);
  const [selectedStageIndex, setSelectedStageIndex] = useState(currentStageIndex);
  const collarUnlocked = isTranslationCollarUnlocked(pet?.growth_stage);
  const activeStage = stageMeta[selectedStageIndex] ?? stageMeta[0];
  const selectedStageUnlocked = selectedStageIndex <= currentStageIndex;
  const selectedIsCollarStage = selectedStageIndex >= getGrowthStageIndex(TRANSLATION_COLLAR_STAGE);

  useEffect(() => {
    setSelectedStageIndex(currentStageIndex);
  }, [currentStageIndex]);

  const switchDemoStage = () => {
    if (!pet) return;
    const nextStage = collarUnlocked ? '成熟期' : TRANSLATION_COLLAR_STAGE;
    setPet({
      ...pet,
      growth_stage: nextStage,
    });
    setSelectedStageIndex(getGrowthStageIndex(nextStage));
  };
  const experienceTranslationCollar = () => {
    if (!collarUnlocked) return;
    navigate(voiceConsentGranted ? '/dialogue-mode' : '/?dialogueConsent=1');
  };

  return (
    <PageLayout title="ropet 成长阶段">
      <div className="flex flex-col gap-6 pt-6">
        <div className="rounded-[24px] bg-[#f4f4f6] p-5 shadow-sm">
          <div className="flex items-start justify-between px-1">
            {stageMeta.map((stage, index) => {
              const reached = index <= currentStageIndex;
              const active = index === selectedStageIndex;

              return (
                <button
                  key={stage.name}
                  type="button"
                  onClick={() => setSelectedStageIndex(index)}
                  className="relative flex flex-1 flex-col items-center"
                >
                  {index < stageMeta.length - 1 && (
                    <span className="absolute left-1/2 top-[24px] h-[2px] w-full translate-x-[24px] border-t-2 border-dotted border-[#d9d5df]" />
                  )}
                  <div
                    className={`relative z-10 flex h-[50px] w-[50px] items-center justify-center rounded-full text-[24px] shadow-sm ${
                      active
                        ? `border-4 border-[#dfff38] ${reached ? 'bg-[#f8fff0]' : 'bg-[#eeeeef] grayscale opacity-55'}`
                        : reached
                          ? 'bg-white'
                          : 'bg-[#eeeeef] grayscale opacity-55'
                    }`}
                  >
                    {stage.icon}
                  </div>
                </button>
              );
            })}
          </div>

          <section className="relative mt-4 rounded-[18px] bg-[#eeeeef] px-5 py-5">
            <span className="absolute right-[42px] top-[-14px] h-0 w-0 border-x-[14px] border-b-[18px] border-x-transparent border-b-[#eeeeef]" />
            <h2 className="text-[20px] font-semibold leading-[28px] text-[#222127]">{activeStage.title}</h2>
            <p className="mt-3 text-[13px] font-medium leading-[24px] text-[#77737d]">
              {activeStage.description}
            </p>
          </section>

          {!minorModeEnabled && selectedIsCollarStage && (
            <div className="mt-4 space-y-4">
              <section className={`rounded-[18px] bg-white p-4 shadow-[0_8px_24px_rgba(47,39,68,0.05)] ${
                selectedStageUnlocked ? '' : 'opacity-75'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[18px] font-semibold leading-[25px] text-[#222127]">萌萌语</h3>
                    <p className="mt-3 max-w-[210px] text-[13px] font-medium leading-[22px] text-[#8b8792]">
                      {collarUnlocked
                        ? `「咯」一声，「哼」一下，${pet?.name ?? 'ropet'} 的喜欢藏不下！萌萌语期解锁。`
                        : '成长到第 4 阶段后解锁，听见 ropet 用自己的方式表达喜欢。'}
                    </p>
                  </div>
                  <div className={selectedStageUnlocked ? '' : 'grayscale opacity-50'}>
                    <MengLanguagePreview />
                  </div>
                </div>
              </section>

              <section className={`rounded-[18px] bg-white p-4 shadow-[0_8px_24px_rgba(47,39,68,0.05)] ${
                selectedStageUnlocked ? '' : 'opacity-75'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-2 inline-flex rounded-[8px] bg-[#6fca24] px-2 py-1 text-[11px] font-bold text-white">
                      新功能
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[18px] font-semibold leading-[25px] text-[#222127]">翻译项圈</h3>
                      <span className="rounded-[4px] bg-[#fff0a6] px-1.5 py-0.5 text-[9px] font-bold text-[#d39b1f]">NEW</span>
                    </div>
                    <p className="mt-2 max-w-[178px] text-[12px] font-medium leading-[20px] text-[#8b8792]">
                      {selectedStageUnlocked ? '多种趣味音效，Ta 的声音有更多可能！' : '成长到第 4 阶段后解锁，让 Ta 的声音有更多可能。'}
                    </p>
                    {selectedStageUnlocked && (
                      <button
                        type="button"
                        onClick={experienceTranslationCollar}
                        className="mt-4 h-[32px] rounded-full border border-[#92d365] bg-white px-5 text-[13px] font-semibold text-[#68b82e]"
                      >
                        去体验
                      </button>
                    )}
                  </div>
                  <CollarPreview />
                </div>
              </section>
            </div>
          )}

          <button
            type="button"
            onClick={switchDemoStage}
            className="mx-auto mt-6 flex h-[34px] items-center justify-center rounded-full border border-[#dedbe3] bg-white px-4 text-[12px] font-semibold text-[#8b8792]"
          >
            {collarUnlocked ? '演示未到第四阶段' : '演示到第四阶段'}
          </button>

          <div className="mt-[120px] flex items-center justify-center gap-3 text-[12px] text-[#c1bdc8]">
            <span className="h-px w-[92px] bg-[#dedbe3]" />
            更多内容将在后续版本更新
            <span className="h-px w-[92px] bg-[#dedbe3]" />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Growth;
