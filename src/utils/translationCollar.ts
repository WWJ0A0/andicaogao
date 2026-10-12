export const GROWTH_STAGES = [
  '认知形成期',
  '个性展现期',
  '亲亲密密期',
  '萌言萌语期',
] as const;

export const TRANSLATION_COLLAR_STAGE = '萌言萌语期';
export const GROWTH_STAGE_UNLOCK_NOTICE_KEY = 'ropet-growth-stage-unlock-notice-index';

export const getGrowthStageIndex = (stage?: string | null) => {
  const index = GROWTH_STAGES.findIndex((item) => item === stage);
  return index < 0 ? 0 : index;
};

export const isTranslationCollarUnlocked = (_stage?: string | null) => (
  true
);

export const isVoiceSelectionUnlocked = (stage?: string | null) => (
  getGrowthStageIndex(stage) >= GROWTH_STAGES.indexOf(TRANSLATION_COLLAR_STAGE)
);
