import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Heart, LockKeyhole, Pause, Play, ShoppingBag, Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDialogueStore } from '@/store/useDialogueStore';

interface EyeItem {
  id: number;
  previewImg: string;
  spritePosition?: string;
  badge: 'gold' | 'blue' | 'purple' | null;
  name: string;
  locked: boolean;
  source?: 'lottery' | 'shop';
  productId?: string;
  previewType?: 'eye' | 'eyeshadow';
}

const eyeOptions: EyeItem[] = [
  { id: 1, previewImg: '/images/moiedap1-f2gtmg8.png', badge: 'gold', name: '青柠乐园', locked: false },
  { id: 2, previewImg: '/images/moiedap1-xzckozh.png', badge: 'blue', name: '海盐星空', locked: false },
  { id: 3, previewImg: '/images/moiedap1-qz3xk9i.png', badge: 'purple', name: '葡萄汽水', locked: false },
  { id: 4, previewImg: '/images/moiedap1-mv1a2by.png', badge: 'purple', name: '梦境星球', locked: false },
  { id: 5, previewImg: '/images/moiedap1-zzutaa1.png', badge: 'blue', name: '焦糖方糖', locked: true, source: 'shop', productId: 'caramel-eyes' },
  { id: 6, previewImg: '/images/moiedap1-8ejuy2s.png', badge: 'purple', name: '午夜霓虹', locked: true, source: 'lottery' },
  { id: 7, previewImg: '/images/moiedap1-bw1zyjm.png', badge: 'gold', name: '森林硬糖', locked: true, source: 'shop', productId: 'forest-eyes' },
  { id: 8, previewImg: '/images/moiedap2-dy43oj7.png', badge: 'gold', name: '蓝莓硬糖', locked: true, source: 'lottery' },
  { id: 9, previewImg: '/images/moi8vfl3-8043skg.png', badge: 'purple', name: '薄荷星环', locked: true, source: 'shop', productId: 'mint-eyes' },
];

const mallEyeOptions: EyeItem[] = [
  { id: 101, previewImg: '/images/mall-eye-collection.png', spritePosition: '0% 0%', badge: 'gold', name: '紫曜星河', locked: true, source: 'shop', productId: 'galaxy-eyes' },
  { id: 102, previewImg: '/images/mall-eye-collection.png', spritePosition: '50% 0%', badge: 'gold', name: '熔岩落日', locked: true, source: 'shop', productId: 'caramel-eyes' },
  { id: 103, previewImg: '/images/mall-eye-collection.png', spritePosition: '100% 0%', badge: 'blue', name: '黑曜夜幕', locked: true, source: 'shop', productId: 'obsidian-eyes' },
  { id: 104, previewImg: '/images/mall-eye-collection.png', spritePosition: '0% 50%', badge: 'gold', name: '圣诞森语', locked: true, source: 'shop', productId: 'forest-eyes' },
  { id: 105, previewImg: '/images/mall-eye-collection.png', spritePosition: '50% 50%', badge: 'gold', name: '像素彩虹', locked: true, source: 'shop', productId: 'rainbow-pixel-eyes' },
  { id: 106, previewImg: '/images/mall-eye-collection.png', spritePosition: '100% 50%', badge: 'gold', name: '金夜驯鹿', locked: true, source: 'shop', productId: 'reindeer-eyes' },
  { id: 107, previewImg: '/images/mall-eye-collection.png', spritePosition: '0% 100%', badge: 'purple', name: '月光像素', locked: true, source: 'shop', productId: 'moon-pixel-eyes' },
  { id: 108, previewImg: '/images/mall-eye-collection.png', spritePosition: '50% 100%', badge: 'blue', name: '霓虹像素', locked: true, source: 'shop', productId: 'sunset-pixel-eyes' },
  { id: 109, previewImg: '/images/mall-eye-collection.png', spritePosition: '100% 100%', badge: 'blue', name: '碧海像素', locked: true, source: 'shop', productId: 'mint-eyes' },
];

const mallEyeshadowOptions: EyeItem[] = [
  {
    id: 201,
    previewImg: '/images/moiedap1-khtkfqv.png',
    badge: 'purple',
    name: '元气眼影',
    locked: true,
    source: 'shop',
    productId: 'vitality-eyelids',
    previewType: 'eyeshadow',
  },
];

const mallPointPrices: Record<string, number> = {
  'galaxy-eyes': 2800,
  'caramel-eyes': 4160,
  'obsidian-eyes': 3840,
  'forest-eyes': 4200,
  'rainbow-pixel-eyes': 4960,
  'reindeer-eyes': 5440,
  'moon-pixel-eyes': 4640,
  'sunset-pixel-eyes': 4800,
  'mint-eyes': 4800,
  'vitality-eyelids': 48000,
};

const eyeThemes = ['水果硬糖', '火焰微光', '绿色乐园', '节日限定', '赛博小猫', '梦境星球'];

const badgeStyle = {
  gold: 'bg-[#ffe1a1] text-[#ff9e19]',
  blue: 'bg-[#dbe7ff] text-[#779dff]',
  purple: 'bg-[#dfd3ff] text-[#a07cff]',
};

const voiceOptions = [
  { id: 1, name: 'Original Voice', description: "Ropet’s native language from Ropet Planet!\nHums and whimpers full of affection.", imagePosition: '-260px -162px' },
  { id: 2, name: 'Cavy Talk', description: 'Uwei~uwei~ How do guinea pigs sound?\nRopet learned this cute little language after one listen.', imagePosition: '-245px -314px' },
  { id: 3, name: 'Little Lamb', description: 'I am a lamb, baa baa, do you like my beautiful singing?', imagePosition: '-249px -474px' },
  { id: 4, name: 'Moe Language', description: 'This is the language that only the most advanced ropet can master! Top secret!', imagePosition: '-261px -636px' },
];

function EyeBadge({ type }: { type: NonNullable<EyeItem['badge']> }) {
  return (
    <div className={`absolute left-[8px] top-[8px] w-6 h-6 rounded-full ${badgeStyle[type]} flex items-center justify-center text-[13px] font-black shadow-[0_4px_10px_rgba(96,80,150,0.16)]`}>
      ◆
    </div>
  );
}

const EyeChange: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mallProductId = searchParams.get('product');
  const mallReturnTo = searchParams.get('returnTo') || '/interaction-history';
  const isMallPreview = searchParams.get('source') === 'mall' && Boolean(mallProductId);
  const [mallPreviewType, setMallPreviewType] = useState<'eye' | 'eyeshadow'>(
    mallProductId === 'vitality-eyelids' ? 'eyeshadow' : 'eye',
  );
  const isEyeshadowPreview = isMallPreview && mallPreviewType === 'eyeshadow';
  const redeemedMallItems = useDialogueStore((state) => state.redeemedMallItems);
  const points = useDialogueStore((state) => state.points);
  const spendPoints = useDialogueStore((state) => state.spendPoints);
  const exchangeMallItem = useDialogueStore((state) => state.exchangeMallItem);
  const [selectedEyeId, setSelectedEyeId] = useState(1);
  const [appliedEyeId, setAppliedEyeId] = useState(1);
  const [activeMode, setActiveMode] = useState<'eyes' | 'voice'>('eyes');
  const [selectedVoiceId, setSelectedVoiceId] = useState(1);
  const [appliedVoiceId, setAppliedVoiceId] = useState(1);
  const [playingVoiceId, setPlayingVoiceId] = useState<number | null>(null);
  const [activeEyeTheme, setActiveEyeTheme] = useState(eyeThemes[0]);
  const [lockedEye, setLockedEye] = useState<EyeItem | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(searchParams.get('redeem') === '1');

  const previewOptions = isEyeshadowPreview ? mallEyeshadowOptions : mallEyeOptions;
  const displayedEyes = (isMallPreview ? previewOptions : eyeOptions).map((eye) => ({
    ...eye,
    locked: isMallPreview
      ? true
      : eye.source === 'shop' && eye.productId
        ? !(redeemedMallItems?.[eye.productId] > 0)
        : eye.locked,
  }));
  const selectedEye = displayedEyes.find((eye) => eye.id === selectedEyeId) || displayedEyes[0];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (!isMallPreview || !mallProductId) return;
    const previewEye = previewOptions.find((eye) => eye.productId === mallProductId);
    if (previewEye) {
      setActiveMode('eyes');
      setSelectedEyeId(previewEye.id);
    }
  }, [isMallPreview, mallProductId, isEyeshadowPreview]);

  useEffect(() => {
    if (isMallPreview && searchParams.get('redeem') === '1') setShowRedeemModal(true);
  }, [isMallPreview, searchParams]);

  const handleEyeSelect = (eye: EyeItem) => {
    if (isMallPreview && eye.productId) {
      setSelectedEyeId(eye.id);
      return;
    }
    if (eye.locked) {
      setLockedEye(eye);
      return;
    }
    setSelectedEyeId(eye.id);
  };

  const switchMallPreviewType = (type: 'eye' | 'eyeshadow') => {
    if (!isMallPreview || mallPreviewType === type) return;
    setMallPreviewType(type);
    setSelectedEyeId(type === 'eyeshadow' ? mallEyeshadowOptions[0].id : mallEyeOptions[0].id);
  };

  const applySelection = () => {
    if (activeMode === 'eyes' && isMallPreview && selectedEye.productId) {
      setShowRedeemModal(true);
      return;
    }
    if (activeMode === 'eyes') setAppliedEyeId(selectedEyeId);
    if (activeMode === 'voice') setAppliedVoiceId(selectedVoiceId);
  };

  const selectionApplied = activeMode === 'eyes'
    ? appliedEyeId === selectedEyeId
    : appliedVoiceId === selectedVoiceId;

  const selectedPointPrice = selectedEye.productId ? (mallPointPrices[selectedEye.productId] ?? 0) : 0;

  const confirmMallRedemption = () => {
    if (!selectedEye.productId || !selectedPointPrice) return;
    if (points < selectedPointPrice) {
      const returnTo = `/eye-change?source=mall&product=${selectedEye.productId}&returnTo=${encodeURIComponent(mallReturnTo)}&redeem=1`;
      navigate(`/points-store?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    if (!spendPoints(`兑换${selectedEye.name}`, 'exchange', selectedPointPrice)) return;
    exchangeMallItem(selectedEye.productId, 'aiPaper', 0);
    const separator = mallReturnTo.includes('?') ? '&' : '?';
    navigate(`${mallReturnTo}${separator}purchased=${selectedEye.productId}`);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#d8deea] overflow-hidden flex justify-center py-4">
      <div className="relative w-[393px] h-[852px] mx-auto overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)] bg-white">
        <div className="absolute inset-x-0 top-0 bg-cover bg-center" style={{ height: activeMode === 'eyes' ? 452 : 852, backgroundImage: "url('/images/moiedap1-dbc8fds.png')" }} />

        <div className="relative z-20 flex items-center justify-between px-[28px] pt-[18px] text-[#19181f]">
          <div className="text-[16px] font-semibold">9:41</div>
          <div className="flex items-center gap-[5px]">
            <div className="flex items-end gap-[2px]">
              <span className="block w-[3px] h-[7px] rounded-full bg-[#19181f]" />
              <span className="block w-[3px] h-[9px] rounded-full bg-[#19181f]" />
              <span className="block w-[3px] h-[12px] rounded-full bg-[#19181f]" />
              <span className="block w-[3px] h-[15px] rounded-full bg-[#19181f]" />
            </div>
            <div className="w-[18px] h-[12px] rounded-t-full border-t-[3px] border-[#19181f]" />
            <div className="w-[25px] h-[13px] rounded-[4px] border-[2px] border-[#19181f] relative">
              <div className="absolute top-[2px] right-[-4px] w-[2px] h-[5px] rounded-r bg-[#19181f]" />
            </div>
          </div>
        </div>

        <div className="relative z-20 flex items-center justify-between px-5 pt-[18px]">
          <button
            type="button"
            onClick={() => navigate(isMallPreview ? mallReturnTo : '/')}
            className={`flex w-10 h-10 items-center justify-center active:scale-95 transition-transform ${activeMode === 'eyes' ? 'text-white' : 'text-[#2f2b33]'}`}
            aria-label="返回"
          >
            <ArrowLeft size={30} strokeWidth={2.2} />
          </button>

          {isMallPreview ? (
            <div className="absolute left-1/2 flex h-10 -translate-x-1/2 items-center justify-center rounded-full bg-white/75 px-6 text-[14px] font-bold text-[#302b34] shadow-sm backdrop-blur-sm">
              {isEyeshadowPreview ? '试眼影' : '试美瞳'}
            </div>
          ) : (
            <div className="absolute left-1/2 flex h-10 w-[170px] -translate-x-1/2 rounded-full bg-[#b7a8c8]/65 p-1 backdrop-blur-sm">
              {[
                { id: 'eyes', label: '眼睛' },
                { id: 'voice', label: '声音' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveMode(item.id as 'eyes' | 'voice')}
                  className={`flex-1 rounded-full text-[13px] font-bold transition-colors ${activeMode === item.id ? 'bg-white text-[#2e2932] shadow-sm' : 'text-[#625a69]'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={applySelection}
            className="h-10 min-w-[68px] rounded-full bg-[#8d66ef] px-4 text-[16px] font-semibold text-white shadow-[0_8px_18px_rgba(141,102,239,0.28)] active:scale-95 transition-transform"
          >
            {isMallPreview && activeMode === 'eyes' ? '兑换' : activeMode === 'voice' ? (selectionApplied ? '使用' : '应用') : (selectionApplied ? '使用中' : '应用')}
          </button>
        </div>

        {activeMode === 'eyes' && (
          <>
        <div className="absolute bg-contain bg-center bg-no-repeat pointer-events-none" style={{ top: 122, left: -86, width: 560, height: 360, backgroundImage: "url('/images/moiedap1-khtkfqv.png')" }} />

        {isEyeshadowPreview && (
          <div className="pointer-events-none absolute inset-x-0 z-20" style={{ top: 284 }} aria-label="Ropet 正在试戴元气眼影并眨眼">
            <span className="eyeshadow-blink absolute left-[122px] h-[46px] w-[48px] rounded-[50%]" />
            <span className="eyeshadow-blink eyeshadow-blink-right absolute right-[122px] h-[46px] w-[48px] rounded-[50%]" />
          </div>
        )}

        <div className="absolute left-5 z-30 flex flex-col items-center gap-3" style={{ top: 294 }}>
          <button
            type="button"
            aria-label="切换到试美瞳"
            onClick={() => switchMallPreviewType('eye')}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-[20px] transition-all ${isEyeshadowPreview ? 'bg-white/75 opacity-55 shadow-[0_4px_10px_rgba(20,16,32,0.06)]' : 'bg-white shadow-[0_6px_14px_rgba(20,16,32,0.12)] ring-2 ring-[#8d66ef]'}`}
          >
            <span className="relative block w-7 h-4">
              <span className="absolute left-0 top-0 w-4 h-4 rounded-full border-2 border-[#19181f] bg-white">
                <span className="absolute left-[5px] top-[5px] w-[5px] h-[5px] rounded-full bg-[#19181f]" />
              </span>
              <span className="absolute right-0 top-0 w-4 h-4 rounded-full border-2 border-[#19181f] bg-white">
                <span className="absolute left-[5px] top-[5px] w-[5px] h-[5px] rounded-full bg-[#19181f]" />
              </span>
            </span>
          </button>
          <button
            type="button"
            aria-label="切换到试眼影"
            onClick={() => switchMallPreviewType('eyeshadow')}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-[18px] transition-all ${isEyeshadowPreview ? 'bg-white opacity-100 shadow-[0_6px_14px_rgba(20,16,32,0.14)] ring-2 ring-[#8d66ef]' : 'bg-white/85 opacity-70 shadow-[0_6px_14px_rgba(20,16,32,0.08)]'}`}
          >
            <span className="relative block w-7 h-4">
              <span className={`absolute left-0 top-0 w-4 h-4 rounded-full border-2 bg-white ${isEyeshadowPreview ? 'border-[#8d66ef]' : 'border-[#a3a0aa]'}`}>
                <span className={`absolute left-[4px] top-[6px] w-[6px] h-[2px] rounded-full ${isEyeshadowPreview ? 'bg-[#8d66ef]' : 'bg-[#a3a0aa]'}`} />
              </span>
              <span className={`absolute right-0 top-0 w-4 h-4 rounded-full border-2 bg-white ${isEyeshadowPreview ? 'border-[#8d66ef]' : 'border-[#a3a0aa]'}`}>
                <span className={`absolute left-[4px] top-[6px] w-[6px] h-[2px] rounded-full ${isEyeshadowPreview ? 'bg-[#8d66ef]' : 'bg-[#a3a0aa]'}`} />
              </span>
            </span>
          </button>
        </div>

        {!isMallPreview && (
          <div className="absolute right-5 z-30" style={{ top: 358 }}>
            <button className="w-10 h-10 rounded-full bg-white/90 shadow-[0_6px_14px_rgba(20,16,32,0.12)] flex items-center justify-center">
              <Heart className="w-[22px] h-[22px] fill-[#ff86bf] text-[#ff86bf]" />
            </button>
          </div>
        )}

        <div className="absolute left-1/2 z-30 -translate-x-1/2 rounded-[14px] bg-white/60 px-4 py-[6px] text-[14px] leading-4 text-[#19181f66] backdrop-blur-sm" style={{ top: 364 }}>
          {selectedEye.name}
        </div>

        <div className="absolute left-0 right-0 z-40 rounded-t-[30px] bg-white shadow-[0_-10px_32px_rgba(25,24,31,0.06)]" style={{ top: 409, height: 443 }}>
          {!isMallPreview && (
          <div className="relative h-16 border-b border-[#19181f0d]">
            <>
              <button type="button" className="absolute left-5 top-[18px] flex h-7 w-7 items-center justify-center rounded-full border border-[#b9b5bf] text-[10px] font-bold text-[#9c98a3]">
                MY
              </button>
            </>
            <div className="absolute bottom-0 left-[62px] right-[72px] top-0 flex items-center gap-5 overflow-x-auto pr-5 scrollbar-hide">
              {eyeThemes.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setActiveEyeTheme(theme)}
                  className={`relative h-full shrink-0 whitespace-nowrap text-[15px] ${activeEyeTheme === theme ? 'font-bold text-[#19181f]' : 'font-medium text-[#aaa4af]'}`}
                >
                  {theme}
                  {activeEyeTheme === theme && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#19181f]" />}
                </button>
              ))}
            </div>
            <div className="absolute bottom-0 right-0 top-0 flex w-[76px] items-center justify-center bg-gradient-to-l from-white via-white to-white/70 pl-2">
              <button
                type="button"
                onClick={() => navigate('/interaction-history')}
                className="rounded-full bg-[#8d66ef] px-3 py-2 text-[11px] font-bold text-white shadow-[0_6px_14px_rgba(111,78,197,0.20)]"
              >
                去商城
              </button>
            </div>
          </div>
          )}

          <div className="overflow-y-auto scrollbar-hide px-4 pt-4 pb-10" style={{ height: isMallPreview ? 443 : 379 }}>
            <div className="grid grid-cols-3 gap-x-[16px] gap-y-[18px]">
              {displayedEyes.map((eye) => (
                <button
                  key={eye.id}
                  type="button"
                  onClick={() => handleEyeSelect(eye)}
                  className="relative flex items-center justify-center overflow-hidden transition-transform active:scale-95"
                  style={{
                    width: 108,
                    height: 108,
                    borderRadius: 20,
                    background: eye.locked ? '#858589' : '#f6f5f7',
                    border: selectedEye.id === eye.id ? '3px solid #8d66ef' : '3px solid transparent',
                  }}
                >
                  {eye.previewType === 'eyeshadow' ? (
                    <span className={`relative h-[96px] w-[96px] overflow-hidden rounded-[17px] bg-gradient-to-b from-[#f6e6f1] to-white ${eye.locked ? 'opacity-55' : ''}`}>
                      <img src={eye.previewImg} alt={eye.name} className="absolute inset-0 h-full w-full scale-[1.34] object-contain object-center" />
                      <span className="absolute left-[27px] top-[39px] h-[17px] w-[18px] rounded-full bg-gradient-to-b from-[#f28cbd] via-[#d871ac] to-[#8d66ef] opacity-90" />
                      <span className="absolute right-[27px] top-[39px] h-[17px] w-[18px] rounded-full bg-gradient-to-b from-[#f28cbd] via-[#d871ac] to-[#8d66ef] opacity-90" />
                    </span>
                  ) : eye.spritePosition ? (
                    <span
                      role="img"
                      aria-label={eye.name}
                      className={`h-[96px] w-[96px] bg-white bg-no-repeat ${eye.locked ? 'opacity-50' : ''}`}
                      style={{ backgroundImage: `url('${eye.previewImg}')`, backgroundPosition: eye.spritePosition, backgroundSize: '300% 300%' }}
                    />
                  ) : (
                    <img
                      src={eye.previewImg}
                      alt={eye.name}
                      className={`object-contain ${eye.locked ? 'opacity-40 grayscale-[25%]' : ''}`}
                      style={{ width: 96, height: 96 }}
                    />
                  )}
                  {eye.badge && <EyeBadge type={eye.badge} />}
                  {appliedEyeId === eye.id && (
                    <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#8d66ef] text-white shadow-md">
                      <Check size={15} strokeWidth={3} />
                    </span>
                  )}
                  {eye.locked && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-[18px] bg-[#3f3f45]/25 text-white">
                      <LockKeyhole size={31} fill="white" className="drop-shadow-[0_4px_7px_rgba(0,0,0,0.38)]" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="absolute left-1/2 bottom-[8px] -translate-x-1/2 w-[134px] h-[5px] rounded-full bg-black" />
        </div>
          </>
        )}

        {activeMode === 'voice' && (
          <div className="absolute inset-0 z-10 bg-white" />
        )}

        {lockedEye && (
          <div className="absolute inset-0 z-[80] flex items-end bg-black/45" onClick={() => setLockedEye(null)}>
            <section className="w-full rounded-t-[28px] bg-white px-5 pb-8 pt-5" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center">
                <img src={lockedEye.previewImg} alt={lockedEye.name} className="h-16 w-16 rounded-[18px] bg-[#f4f1f7] object-contain" />
                <div className="ml-3"><h2 className="text-[19px] font-black text-[#2e2932]">{lockedEye.name}</h2><p className="mt-1 text-[11px] text-[#928a99]">这款美瞳尚未获得</p></div>
              </div>
              <div className="mt-5 rounded-[17px] bg-[#f5f1ff] px-4 py-4 text-[12px] leading-6 text-[#6f5a98]">
                {lockedEye.source === 'lottery' ? '这是抽奖限定美瞳，可前往幸运抽奖机参与抽取。' : '这是商城精品美瞳，可前往换装店试戴并使用积分购买。'}
              </div>
              <button
                type="button"
                onClick={() => navigate(lockedEye.source === 'lottery' ? '/lucky-draw-2' : `/interaction-history?shop=eyes&product=${lockedEye.productId ?? ''}`)}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-[16px] bg-[#8d66ef] text-[14px] font-bold text-white"
              >
                {lockedEye.source === 'lottery' ? <Sparkles size={18} className="mr-2" /> : <ShoppingBag size={18} className="mr-2" />}
                {lockedEye.source === 'lottery' ? '去抽奖获得' : '去商城购买'}
              </button>
              <button type="button" onClick={() => setLockedEye(null)} className="mt-2 h-11 w-full text-[13px] font-semibold text-[#928b99]">暂不前往</button>
            </section>
          </div>
        )}

        {showRedeemModal && isMallPreview && selectedEye.productId && (
          <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/55 px-8" onClick={() => setShowRedeemModal(false)}>
            <section className="w-full rounded-[20px] bg-white px-6 py-6 text-center shadow-[0_18px_42px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()}>
              <h2 className="text-[18px] font-semibold text-[#222127]">兑换{selectedEye.name}</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#222127]">
                本次兑换需要 {selectedPointPrice.toLocaleString()} 积分，
                <br />
                当前剩余积分 {points.toLocaleString()}。
              </p>
              <div className="mt-4 flex items-center justify-center gap-3 text-[#222127]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ffe49a] text-[13px]">★</span>
                <span className="text-[16px] font-semibold">{selectedPointPrice.toLocaleString()}</span>
                <span className="text-[16px] font-semibold">=</span>
                <span className="flex items-center gap-2 rounded-[8px] border border-[#e9e5ef] bg-[#f7f7f8] p-1.5 pr-3 text-[14px] font-semibold">
                  {isEyeshadowPreview ? (
                    <span role="img" aria-label={selectedEye.name} className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#ffe8f1] text-[#e66e9f]">
                      <span className="relative block h-6 w-7">
                        <span className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-current"><span className="absolute left-[3px] top-[6px] h-[2px] w-[6px] rounded-full bg-current" /></span>
                        <span className="absolute right-0 top-1 h-4 w-4 rounded-full border-2 border-current"><span className="absolute left-[3px] top-[6px] h-[2px] w-[6px] rounded-full bg-current" /></span>
                      </span>
                    </span>
                  ) : (
                    <span
                      role="img"
                      aria-label={selectedEye.name}
                      className="h-10 w-10 rounded-[7px] bg-white bg-no-repeat"
                      style={{ backgroundImage: `url('${selectedEye.previewImg}')`, backgroundPosition: selectedEye.spritePosition, backgroundSize: '300% 300%' }}
                    />
                  )}
                  × 1
                </span>
              </div>
              <p className="mt-3 text-[12px] text-[#8b8792]">兑换成功后将直接放入{isEyeshadowPreview ? '我的眼影' : '我的美瞳'}</p>
              <button type="button" onClick={confirmMallRedemption} className="mt-5 h-12 w-full rounded-[14px] bg-[#7c5ae0] text-[15px] font-semibold text-white">
                {points >= selectedPointPrice ? '确定兑换' : '去购买积分'}
              </button>
              <button type="button" onClick={() => setShowRedeemModal(false)} className="mt-3 h-11 w-full rounded-[14px] border border-[#e6e1ed] bg-white text-[14px] font-semibold text-[#4f4a55]">取消</button>
            </section>
          </div>
        )}

        {activeMode === 'voice' && (
          <>
          <button
            type="button"
            onClick={() => navigate('/interaction-history')}
            className="absolute left-4 right-4 top-[116px] z-30 flex h-10 items-center rounded-[15px] border border-[#ece5ff] bg-[#f8f5ff] px-4 text-[#7656ce] shadow-[0_6px_18px_rgba(104,78,165,0.06)] active:scale-[0.99] transition-transform"
          >
            <ShoppingBag size={16} strokeWidth={2.2} />
            <span className="ml-2 text-[12px] font-bold">发现更多声线</span>
            <span className="ml-auto flex items-center text-[11px] font-semibold">
              去商城
              <ChevronRight size={15} className="ml-0.5" />
            </span>
          </button>
          <div className="absolute inset-x-0 bottom-0 top-[166px] z-30 overflow-y-auto bg-white px-4 pb-10 scrollbar-hide">
            <div className="space-y-[14px]">
              {voiceOptions.map((voice) => {
                const selected = selectedVoiceId === voice.id;
                const playing = playingVoiceId === voice.id;
                return (
                  <button
                    key={voice.id}
                    type="button"
                    onClick={() => setSelectedVoiceId(voice.id)}
                    className={`relative h-[151px] w-full overflow-hidden rounded-[24px] bg-[#f7f6f7] px-5 py-6 text-left transition-colors ${selected ? 'border-[3px] border-[#8d66ef]' : 'border border-[#e7e4e7]'}`}
                  >
                    <h3 className="relative z-10 text-[20px] font-medium text-[#302c34]">{voice.name}</h3>
                    <p className="relative z-10 mt-3 max-w-[230px] whitespace-pre-line text-[12px] leading-[20px] text-[#8b858f]">{voice.description}</p>
                    <span
                      className="absolute bottom-1 right-0 h-[104px] w-[116px] bg-no-repeat"
                      style={{
                        backgroundImage: "url('/images/voice-change-reference.png')",
                        backgroundSize: '393px 852px',
                        backgroundPosition: voice.imagePosition,
                      }}
                    />
                    <span className="pointer-events-none absolute bottom-1 right-[66px] z-[1] h-[104px] w-[54px] bg-gradient-to-r from-[#f7f6f7] via-[#f7f6f7]/90 to-transparent" />
                    <span
                      role="button"
                      aria-label={playing ? `暂停${voice.name}` : `试听${voice.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setPlayingVoiceId(playing ? null : voice.id);
                      }}
                      className="absolute bottom-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-[18px] bg-white text-[#19181f] shadow-[0_7px_18px_rgba(50,43,62,0.08)]"
                    >
                      {playing ? <Pause size={23} fill="currentColor" /> : <Play size={23} fill="currentColor" />}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="fixed bottom-[24px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black" />
          </div>
          </>
        )}

      </div>
    </div>
  );
};

export default EyeChange;
