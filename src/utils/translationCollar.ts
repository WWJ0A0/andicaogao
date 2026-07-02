export const GROWTH_STAGES = [
  '认知形成期',
  '探索成长阶段',
  '成熟期',
  '萌言萌语期',
] as const;

export const TRANSLATION_COLLAR_STAGE = '萌言萌语期';

export const getGrowthStageIndex = (stage?: string | null) => {
  const index = GROWTH_STAGES.findIndex((item) => item === stage);
  return index < 0 ? 0 : index;
};

export const isTranslationCollarUnlocked = (stage?: string | null) => (
  getGrowthStageIndex(stage) >= GROWTH_STAGES.indexOf(TRANSLATION_COLLAR_STAGE)
);
