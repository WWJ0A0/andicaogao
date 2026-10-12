import React, { useEffect, useRef, useState } from 'react';
import { LockKeyhole, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePetStore } from '@/store/usePetStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import {
  TRANSLATION_COLLAR_STAGE,
  getGrowthStageIndex,
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
  const { minorModeEnabled } = useSubscriptionStore();
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

  const openVoiceSettings = () => {
    if (minorModeEnabled) {
      setToast('青少年模式下暂不可用');
      return;
    }
    navigate('/dialogue-mode/voice');
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
                <section className={`absolute left-[35px] top-[410px] z-20 h-[260px] w-[323px] overflow-hidden rounded-[16px] border bg-[#f8f9fd] px-4 pt-[42px] shadow-[0_10px_24px_rgba(71,66,93,0.06)] ${
                  selectedStageUnlocked ? 'border-[#e0ddea]' : 'border-[#e5e3e9] grayscale-[0.35]'
                }`}>
                  <span className={`absolute left-0 top-0 flex h-[27px] min-w-[62px] items-center justify-center rounded-br-[10px] px-3 text-[13px] font-black text-white ${
                    selectedStageUnlocked ? 'bg-[#9c7af2]' : 'bg-[#bbb7c3]'
                  }`}>
                    {selectedStageUnlocked ? 'NEW' : '待解锁'}
                  </span>

                  <div className="flex items-start justify-between">
                    <div className="max-w-[188px]">
                      <h2 className="text-[20px] font-extrabold text-[#37323d]">momo音色</h2>
                      <p className="mt-2 text-[13px] font-medium leading-[20px] text-[#85808c]">
                        成长到萌言萌语期，解锁软萌、灵动的专属音色。
                      </p>
                    </div>
                    <div className={`relative mt-[-3px] flex h-[82px] w-[92px] items-center justify-center rounded-[28px] ${
                      selectedStageUnlocked ? 'bg-[#eee8ff] text-[#815de5]' : 'bg-[#ecebf0] text-[#aaa6b0]'
                    }`}>
                      <Volume2 size={45} strokeWidth={1.8} />
                      {!selectedStageUnlocked && (
                        <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#aaa6b0] shadow">
                          <LockKeyhole size={17} />
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="去设置语言和音色"
                    onClick={openVoiceSettings}
                    className="absolute bottom-[34px] left-[31px] flex h-[53px] w-[261px] items-center justify-center rounded-[17px] border border-[#8b66ef] bg-white text-[16px] font-bold text-[#7653dc] shadow-[0_8px_18px_rgba(139,102,239,0.1)] active:scale-[0.98]"
                  >
                    去设置
                  </button>
                </section>
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
