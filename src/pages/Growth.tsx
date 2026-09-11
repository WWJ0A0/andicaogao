import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetStore } from '@/store/usePetStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import {
  TRANSLATION_COLLAR_STAGE,
  getGrowthStageIndex,
  isTranslationCollarUnlocked,
} from '@/utils/translationCollar';

const stages = [
  { title: '认知形成期', image: '/images/growth-stage-1.png' },
  { title: '个性展现期', image: '/images/growth-stage-2.png' },
  { title: '亲亲密密期', image: '/images/growth-stage-3.png' },
  { title: TRANSLATION_COLLAR_STAGE, image: '/images/growth-stage-4.png' },
] as const;

const Growth: React.FC = () => {
  const navigate = useNavigate();
  const pet = usePetStore((state) => state.pet);
  const { minorModeEnabled, voiceConsentGranted } = useSubscriptionStore();
  const currentStageIndex = getGrowthStageIndex(pet?.growth_stage);
  const [selectedStageIndex, setSelectedStageIndex] = useState(currentStageIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toast, setToast] = useState('');
  const [slideDirection, setSlideDirection] = useState<'next' | 'previous'>('next');
  const scrollRef = useRef<HTMLDivElement>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const selectedStageUnlocked = selectedStageIndex <= currentStageIndex;
  const selectedStage = stages[selectedStageIndex] ?? stages[0];
  const selectedImage = selectedStageIndex === 3 && !selectedStageUnlocked
    ? '/images/growth-stage-4-locked.png'
    : selectedStage.image;
  const imageHeight = selectedStageIndex === 0 ? 1240 : 852;

  useEffect(() => {
    setSelectedStageIndex(currentStageIndex);
  }, [currentStageIndex]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [selectedStageIndex]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 1600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const experienceTranslationCollar = () => {
    if (!isTranslationCollarUnlocked(pet?.growth_stage)) {
      setToast('成长到第 4 阶段后解锁');
      return;
    }
    if (minorModeEnabled) {
      setToast('青少年模式下暂不可用');
      return;
    }
    navigate(voiceConsentGranted ? '/dialogue-mode' : '/?dialogueConsent=1');
  };

  const togglePreview = () => {
    if (!selectedStageUnlocked) {
      setToast('成长到第 4 阶段后解锁');
      return;
    }
    setIsPlaying((current) => !current);
    setToast(isPlaying ? '已暂停试听' : '正在试听萌萌语');
  };

  const selectStage = (nextIndex: number) => {
    const boundedIndex = Math.min(stages.length - 1, Math.max(0, nextIndex));
    if (boundedIndex === selectedStageIndex) return;
    setSlideDirection(boundedIndex > selectedStageIndex ? 'next' : 'previous');
    setSelectedStageIndex(boundedIndex);
    setIsPlaying(false);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    selectStage(selectedStageIndex + (deltaX < 0 ? 1 : -1));
  };

  return (
    <div className="relative flex min-h-screen w-full justify-center overflow-hidden bg-[#d8deea] py-4">
      <div className="relative h-[852px] w-[393px] max-w-full overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        <div
          ref={scrollRef}
          className="relative h-full touch-pan-y overflow-y-auto scrollbar-hide"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { swipeStartRef.current = null; }}
        >
          <div className="relative w-full" style={{ height: imageHeight }}>
            <img
              key={`${selectedStageIndex}-${selectedImage}`}
              src={selectedImage}
              alt={`${selectedStage.title}${selectedStageUnlocked ? '已解锁' : '待解锁'}`}
              className={`absolute inset-0 h-full w-full object-fill growth-stage-slide-${slideDirection}`}
              draggable={false}
            />

            <button
              type="button"
              aria-label="返回"
              onClick={() => navigate('/')}
              className="absolute left-4 top-[48px] z-20 h-11 w-11 rounded-full bg-transparent active:bg-black/5"
            />
            <button
              type="button"
              aria-label="查看成长成就"
              onClick={() => setToast('成长成就即将开放')}
              className="absolute right-4 top-[48px] z-20 h-11 w-11 rounded-full bg-transparent active:bg-black/5"
            />

            <nav aria-label="养成阶段" className="absolute left-5 right-5 top-[171px] z-20 grid h-11 grid-cols-4">
              {stages.map((stage, index) => (
                <button
                  key={stage.title}
                  type="button"
                  aria-label={`查看${stage.title}`}
                  aria-current={selectedStageIndex === index ? 'page' : undefined}
                  onClick={() => selectStage(index)}
                  className="h-full bg-transparent active:bg-black/[0.03]"
                />
              ))}
            </nav>

            {selectedStageIndex === 3 && (
              <>
                <button
                  type="button"
                  aria-label={isPlaying ? '暂停试听萌萌语' : '试听萌萌语'}
                  onClick={togglePreview}
                  className="absolute left-[250px] top-[342px] z-20 h-[54px] w-[106px] rounded-full bg-transparent active:bg-black/5"
                />
                <button
                  type="button"
                  aria-label="去体验翻译项圈"
                  onClick={experienceTranslationCollar}
                  className="absolute left-[54px] top-[572px] z-20 h-[64px] w-[285px] rounded-full bg-transparent active:scale-[0.98]"
                />
              </>
            )}
          </div>
        </div>

        {toast && (
          <div
            role="status"
            className="pointer-events-none absolute left-1/2 top-24 z-40 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/75 px-4 py-2 text-sm font-medium text-white shadow-lg"
          >
            {toast}
          </div>
        )}
      </div>
    </div>
  );
};

export default Growth;
