import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, AudioWaveform, Backpack, Check, CircleChevronRight, Coins, Eye, EyeClosed, EyeOff, Heart, RotateCcw, ShoppingBag, Sparkles, Star, Volume2, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PointsBalancePill from '@/components/PointsBalancePill';
import { useDialogueStore } from '@/store/useDialogueStore';
import { usePetStore } from '@/store/usePetStore';
import { getGrowthStageIndex, TRANSLATION_COLLAR_STAGE } from '@/utils/translationCollar';

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
  eyelidStyle?: 'default' | 'gentle' | 'sleepy';
  eyelidTone?: 'aqua' | 'violet';
}

const eyeOptions: EyeItem[] = [
  { id: 1, previewImg: '/images/moiedap1-f2gtmg8.png', badge: 'gold', name: '青柠乐园', locked: false },
  { id: 2, previewImg: '/images/moiedap1-xzckozh.png', badge: 'blue', name: '海盐星空', locked: false },
  { id: 3, previewImg: '/images/moiedap1-qz3xk9i.png', badge: 'purple', name: '葡萄汽水', locked: false },
  { id: 4, previewImg: '/images/moiedap1-mv1a2by.png', badge: 'purple', name: '梦境星球', locked: false },
  { id: 5, previewImg: '/images/moiedap1-zzutaa1.png', badge: 'blue', name: '焦糖方糖', locked: true, source: 'shop', productId: 'caramel-eyes' },
  { id: 6, previewImg: '/images/moiedap1-8ejuy2s.png', badge: 'purple', name: '午夜霓虹', locked: true, source: 'lottery', productId: 'midnight-neon-eyes' },
  { id: 7, previewImg: '/images/moiedap1-bw1zyjm.png', badge: 'gold', name: '森林硬糖', locked: true, source: 'shop', productId: 'forest-eyes' },
  { id: 8, previewImg: '/images/moiedap2-dy43oj7.png', badge: 'gold', name: '蓝莓硬糖', locked: true, source: 'lottery', productId: 'blueberry-candy-eyes' },
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
    previewImg: '/images/mall-product-vitality-eyelids.png',
    badge: 'purple',
    name: '元气眼影',
    locked: true,
    source: 'shop',
    productId: 'vitality-eyelids',
    previewType: 'eyeshadow',
  },
  {
    id: 202,
    previewImg: '/images/mall-product-sunset-eyelids.png',
    badge: 'gold',
    name: '晚霞眼影',
    locked: true,
    source: 'shop',
    productId: 'sunset-eyelids',
    previewType: 'eyeshadow',
  },
];

const defaultEyeshadowOptions: EyeItem[] = [
  {
    id: 200,
    previewImg: '/images/moiedap1-khtkfqv.png',
    badge: null,
    name: '默认眼影',
    locked: false,
    previewType: 'eyeshadow',
    eyelidStyle: 'default',
    eyelidTone: 'aqua',
  },
  {
    id: 203,
    previewImg: '/images/moiedap1-khtkfqv.png',
    badge: null,
    name: '温柔眼影',
    locked: false,
    previewType: 'eyeshadow',
    eyelidStyle: 'gentle',
    eyelidTone: 'violet',
  },
  {
    id: 204,
    previewImg: '/images/moiedap1-khtkfqv.png',
    badge: null,
    name: '困困眼影',
    locked: false,
    previewType: 'eyeshadow',
    eyelidStyle: 'sleepy',
    eyelidTone: 'aqua',
  },
  {
    id: 205,
    previewImg: '/images/moiedap1-khtkfqv.png',
    badge: null,
    name: '清晨眼影',
    locked: true,
    productId: 'morning-eyelids',
    previewType: 'eyeshadow',
    eyelidStyle: 'default',
    eyelidTone: 'aqua',
  },
  {
    id: 206,
    previewImg: '/images/moiedap1-khtkfqv.png',
    badge: null,
    name: '星夜眼影',
    locked: true,
    productId: 'starlight-eyelids',
    previewType: 'eyeshadow',
    eyelidStyle: 'gentle',
    eyelidTone: 'violet',
  },
  {
    id: 207,
    previewImg: '/images/moiedap1-khtkfqv.png',
    badge: null,
    name: '晴空眼影',
    locked: true,
    productId: 'clear-sky-eyelids',
    previewType: 'eyeshadow',
    eyelidStyle: 'sleepy',
    eyelidTone: 'aqua',
  },
];

const mallPointPrices: Record<string, number> = {
  'galaxy-eyes': 5000,
  'caramel-eyes': 4000,
  'obsidian-eyes': 3000,
  'forest-eyes': 5000,
  'rainbow-pixel-eyes': 5000,
  'reindeer-eyes': 4000,
  'moon-pixel-eyes': 4000,
  'sunset-pixel-eyes': 2400,
  'mint-eyes': 3000,
  'vitality-eyelids': 4000,
  'sunset-eyelids': 4000,
  'gentle-eyelids': 4000,
  'sleepy-eyelids': 4000,
  'morning-eyelids': 4000,
  'starlight-eyelids': 4000,
  'clear-sky-eyelids': 4000,
};

const mallBundleOffers = [
  { id: 'galaxy-vitality-bundle', name: '眼妆搭配 01', itemIds: ['galaxy-eyes', 'vitality-eyelids'], discount: 0.8 },
  { id: 'forest-sunset-bundle', name: '眼妆搭配 02', itemIds: ['forest-eyes', 'sunset-eyelids'], discount: 0.8 },
] as const;

const faceEyeSpritePositions: Record<string, string> = {
  'galaxy-eyes': '-16px -12px',
  'caramel-eyes': '-99px -12px',
  'obsidian-eyes': '-182px -12px',
  'forest-eyes': '-16px -90px',
  'rainbow-pixel-eyes': '-99px -90px',
  'reindeer-eyes': '-182px -90px',
  'moon-pixel-eyes': '-16px -168px',
  'sunset-pixel-eyes': '-99px -168px',
  'mint-eyes': '-182px -168px',
};

const eyePointPrices = {
  gold: 4000,
  purple: 3000,
  blue: 2400,
} as const;

const getEyePointPrice = (eye: EyeItem) => (
  eye.productId && mallPointPrices[eye.productId]
    ? mallPointPrices[eye.productId]
    : eye.badge
      ? eyePointPrices[eye.badge]
      : 3000
);

const eyeThemes = ['蜡笔画', '次元漫画', '糖心蛋', '夏日气泡', '光感果冻'];

const badgeStyle = {
  gold: 'bg-[#ffe1a1] text-[#ff9e19]',
  blue: 'bg-[#dbe7ff] text-[#779dff]',
  purple: 'bg-[#dfd3ff] text-[#a07cff]',
};

interface VoiceItem {
  id: number;
  name: string;
  gridImagePosition: string;
  detailImagePosition: string;
  description: string;
  productId: string | null;
  price: number;
  originalPrice?: number;
  source: 'native' | 'shop' | 'lottery' | 'growth';
}

const voiceOptions: VoiceItem[] = [
  { id: 1, name: '原声', gridImagePosition: '-24px -129px', detailImagePosition: '-57px -309px', description: '来自 Ropet 星球的原生语言，轻轻哼唱，也会撒娇地小声回应。', productId: null, price: 0, source: 'native' },
  { id: 2, name: '萌萌语(ropiropi)', gridImagePosition: '-205px -129px', detailImagePosition: '-491px -309px', description: 'ropiropi～只有最聪明的 Ropet 才能掌握的秘密语言，听起来轻快又可爱。', productId: 'moe-language', price: 2000, originalPrice: 3200, source: 'growth' },
  { id: 3, name: '豚鼠语', gridImagePosition: '-24px -403px', detailImagePosition: '-57px -966px', description: 'uwei～uwei～豚鼠怎么叫？Ropet 自从听了一次后就潜心钻研，终于掌握了这门外语！', productId: 'cavy-talk', price: 6000, source: 'shop' },
  { id: 4, name: '修猫语', gridImagePosition: '-205px -403px', detailImagePosition: '-491px -966px', description: '喵呜～喵呜～从幸运抽奖机学会的猫猫语言，每一声都像在悄悄撒娇。', productId: 'cat-talk', price: 6000, source: 'lottery' },
];

type UnlockTarget =
  | { kind: 'eye'; item: EyeItem; price: number }
  | { kind: 'voice'; item: VoiceItem; price: number };

function EyeBadge({ type }: { type: NonNullable<EyeItem['badge']> }) {
  return (
    <div className={`absolute left-[8px] top-[8px] w-6 h-6 rounded-full ${badgeStyle[type]} flex items-center justify-center text-[13px] font-black shadow-[0_4px_10px_rgba(96,80,150,0.16)]`}>
      ◆
    </div>
  );
}

function ShopSourceBadge() {
  return (
    <span className="pointer-events-none absolute left-0 top-0 z-10 flex h-9 w-11 items-center justify-center rounded-[13px] bg-[#f4f3f5]">
      <img src="/images/shop-source-badge.png" alt="商城" className="h-8 w-8" />
    </span>
  );
}

const EyeChange: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mallProductId = searchParams.get('product');
  const mallBundleId = searchParams.get('bundle');
  const activeBundleOffer = mallBundleOffers.find((bundle) => bundle.id === mallBundleId);
  const pageReturnTo = searchParams.get('returnTo');
  const mallReturnTo = pageReturnTo || '/interaction-history';
  const isMallPreview = searchParams.get('source') === 'mall' && Boolean(mallProductId);
  const [mallPreviewType, setMallPreviewType] = useState<'eye' | 'eyeshadow'>(
    mallEyeshadowOptions.some((item) => item.productId === mallProductId) ? 'eyeshadow' : 'eye',
  );
  const isEyeshadowPreview = mallPreviewType === 'eyeshadow';
  const redeemedMallItems = useDialogueStore((state) => state.redeemedMallItems);
  const pet = usePetStore((state) => state.pet);
  const points = useDialogueStore((state) => state.points);
  const startMallRedemption = useDialogueStore((state) => state.startMallRedemption);
  const completeMallRedemption = useDialogueStore((state) => state.completeMallRedemption);
  const refundMallRedemption = useDialogueStore((state) => state.refundMallRedemption);
  const equippedMallEyeId = useDialogueStore((state) => state.equippedMallEyeId);
  const equippedMallEyeshadowId = useDialogueStore((state) => state.equippedMallEyeshadowId);
  const equippedMallVoiceId = useDialogueStore((state) => state.equippedMallVoiceId);
  const equipMallItem = useDialogueStore((state) => state.equipMallItem);
  const [selectedEyeId, setSelectedEyeId] = useState(1);
  const eyeSelectionRef = useRef(1);
  const eyeshadowSelectionRef = useRef(defaultEyeshadowOptions[0].id);
  const [appliedEyeId, setAppliedEyeId] = useState(1);
  const [appliedEyeshadowId, setAppliedEyeshadowId] = useState(defaultEyeshadowOptions[0].id);
  const [activeMode, setActiveMode] = useState<'eyes' | 'voice'>('eyes');
  const [selectedVoiceId, setSelectedVoiceId] = useState(1);
  const [appliedVoiceId, setAppliedVoiceId] = useState(1);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<number | null>(null);
  const [activeEyeTheme, setActiveEyeTheme] = useState('MY');
  const [myCollectionTab, setMyCollectionTab] = useState<'all' | 'pure' | 'favorite'>('all');
  const [demoEmptyPure, setDemoEmptyPure] = useState(false);
  const [unlockTarget, setUnlockTarget] = useState<UnlockTarget | null>(null);
  const [outfitCheckoutOpen, setOutfitCheckoutOpen] = useState(false);
  const [outfitPointsInsufficientOpen, setOutfitPointsInsufficientOpen] = useState(false);
  const [outfitRedemptionSuccess, setOutfitRedemptionSuccess] = useState<{ items: EyeItem[]; total: number } | null>(null);
  const [checkoutSelectedProductIds, setCheckoutSelectedProductIds] = useState<string[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [toast, setToast] = useState('');
  const [demoFulfillmentOutcome, setDemoFulfillmentOutcome] = useState<'success' | 'failure'>('success');

  const nativeEyes = eyeOptions.filter((eye) => eye.source !== 'shop').map((eye) => ({
    ...eye,
    locked: eye.productId && (redeemedMallItems?.[eye.productId] ?? 0) > 0 ? false : eye.locked,
  }));
  const ownedMallEyes = mallEyeOptions
    .filter((eye) => eye.productId && (redeemedMallItems?.[eye.productId] ?? 0) > 0)
    .map((eye) => ({ ...eye, locked: false }));
  const previewOptions = isEyeshadowPreview
    ? isMallPreview ? mallEyeshadowOptions : defaultEyeshadowOptions
    : mallEyeOptions;
  const displayedEyes = isEyeshadowPreview
    ? previewOptions.map((eye) => ({
      ...eye,
      locked: eye.productId && (redeemedMallItems?.[eye.productId] ?? 0) > 0 ? false : eye.locked,
    }))
    : isMallPreview
    ? previewOptions.map((eye) => ({
      ...eye,
      locked: eye.productId && (redeemedMallItems?.[eye.productId] ?? 0) > 0 ? false : eye.locked,
    }))
    : activeEyeTheme === 'MY'
      ? myCollectionTab === 'pure'
        ? demoEmptyPure ? [] : ownedMallEyes
        : myCollectionTab === 'favorite'
          ? nativeEyes.filter((eye) => !eye.locked).slice(0, 3)
          : [...nativeEyes.filter((eye) => !eye.locked), ...ownedMallEyes]
      : nativeEyes;
  const growthVoiceUnlocked = getGrowthStageIndex(pet?.growth_stage) >= getGrowthStageIndex(TRANSLATION_COLLAR_STAGE);
  const displayedVoices = voiceOptions.map((voice) => ({
    ...voice,
    locked: voice.source === 'native'
      ? false
      : voice.source === 'growth'
        ? !growthVoiceUnlocked
        : Boolean(voice.productId && (redeemedMallItems?.[voice.productId] ?? 0) <= 0),
  }));
  const selectedEye = displayedEyes.find((eye) => eye.id === selectedEyeId) || displayedEyes[0] || nativeEyes[0];
  const currentOutfitEye = [...eyeOptions, ...mallEyeOptions]
    .find((eye) => eye.id === (isEyeshadowPreview ? eyeSelectionRef.current : selectedEyeId));
  const currentOutfitEyeshadow = [...defaultEyeshadowOptions, ...mallEyeshadowOptions]
    .find((eye) => eye.id === (isEyeshadowPreview ? selectedEyeId : eyeshadowSelectionRef.current));
  const selectedOutfitEye = currentOutfitEye?.productId ? currentOutfitEye : undefined;
  const selectedOutfitEyeshadow = currentOutfitEyeshadow?.productId ? currentOutfitEyeshadow : undefined;
  const selectedOutfitItems = [selectedOutfitEye, selectedOutfitEyeshadow]
    .filter((item): item is EyeItem => Boolean(item?.productId));
  const faceEyeStyle = currentOutfitEye?.productId && faceEyeSpritePositions[currentOutfitEye.productId]
    ? {
        backgroundImage: `url('${currentOutfitEye.previewImg}')`,
        backgroundPosition: faceEyeSpritePositions[currentOutfitEye.productId],
        backgroundSize: '251px 239px',
      }
    : currentOutfitEye
      ? {
          backgroundImage: `url('${currentOutfitEye.previewImg}')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }
      : undefined;
  const eyeshadowPreviewTone = currentOutfitEyeshadow?.productId === 'sunset-eyelids'
    ? 'sunset'
    : currentOutfitEyeshadow?.productId === 'vitality-eyelids'
      ? 'vitality'
      : currentOutfitEyeshadow?.eyelidTone === 'violet' ? 'violet' : 'neutral';
  const unownedOutfitItems = selectedOutfitItems.filter((item) => (
    item.productId && (redeemedMallItems?.[item.productId] ?? 0) <= 0
  ));
  const checkoutSelectedItems = unownedOutfitItems.filter((item) => (
    item.productId && checkoutSelectedProductIds.includes(item.productId)
  ));
  const checkoutOriginalPointTotal = checkoutSelectedItems.reduce((total, item) => total + getEyePointPrice(item), 0);
  const checkoutHasBundleDiscount = Boolean(activeBundleOffer
    && checkoutSelectedItems.length === activeBundleOffer.itemIds.length
    && activeBundleOffer.itemIds.every((itemId) => checkoutSelectedProductIds.includes(itemId)));
  const checkoutPointTotal = checkoutHasBundleDiscount && activeBundleOffer
    ? Math.round(checkoutOriginalPointTotal * activeBundleOffer.discount)
    : checkoutOriginalPointTotal;
  const selectedOutfitApplied = Boolean(currentOutfitEye && currentOutfitEyeshadow)
    && (currentOutfitEye?.productId ? equippedMallEyeId === currentOutfitEye.productId : appliedEyeId === currentOutfitEye?.id)
    && (currentOutfitEyeshadow?.productId ? equippedMallEyeshadowId === currentOutfitEyeshadow.productId : appliedEyeshadowId === currentOutfitEyeshadow?.id);
  const selectedVoiceApplied = appliedVoiceId === selectedVoiceId;
  const fullSelectionApplied = selectedOutfitApplied && selectedVoiceApplied;
  const outfitActionLabel = unownedOutfitItems.length > 0
    ? `兑换${unownedOutfitItems.length > 1 ? unownedOutfitItems.length : ''}`
    : fullSelectionApplied ? '使用中' : '使用';
  const unlockRequiresMall = Boolean(unlockTarget && (
    (unlockTarget.kind === 'voice' && unlockTarget.item.source === 'shop')
    || (unlockTarget.kind === 'eye' && unlockTarget.item.source === 'shop')
  ));
  const voiceDetailOwned = Boolean(unlockTarget?.kind === 'voice' && (
    !unlockTarget.item.productId
    || (unlockTarget.item.source === 'growth' && growthVoiceUnlocked)
    || (redeemedMallItems?.[unlockTarget.item.productId] ?? 0) > 0
  ));

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const savedOutfitIds = (searchParams.get('outfit') ?? '').split(',').filter(Boolean);
    const savedEye = [...eyeOptions, ...mallEyeOptions].find((eye) => eye.productId && savedOutfitIds.includes(eye.productId));
    const savedEyeshadow = mallEyeshadowOptions.find((eye) => eye.productId && savedOutfitIds.includes(eye.productId));
    if (savedEye) eyeSelectionRef.current = savedEye.id;
    if (savedEyeshadow) eyeshadowSelectionRef.current = savedEyeshadow.id;
    if (!isMallPreview || !mallProductId) {
      if (savedEye) {
        setMallPreviewType('eye');
        setSelectedEyeId(savedEye.id);
        if (mallEyeOptions.some((eye) => eye.id === savedEye.id)) setActiveEyeTheme('商城精选');
      } else if (savedEyeshadow) {
        setMallPreviewType('eyeshadow');
        setSelectedEyeId(savedEyeshadow.id);
      }
      return;
    }
    const previewEye = [...mallEyeOptions, ...mallEyeshadowOptions].find((eye) => eye.productId === mallProductId);
    if (previewEye) {
      setActiveMode('eyes');
      setMallPreviewType(previewEye.previewType === 'eyeshadow' ? 'eyeshadow' : 'eye');
      setSelectedEyeId(previewEye.id);
      if (previewEye.previewType === 'eyeshadow') eyeshadowSelectionRef.current = previewEye.id;
      else eyeSelectionRef.current = previewEye.id;
    }
  }, [isMallPreview, mallProductId, searchParams]);

  useEffect(() => {
    const equipProductId = searchParams.get('equip');
    if (!equipProductId || !(redeemedMallItems?.[equipProductId] > 0)) return;

    const mallEye = mallEyeOptions.find((eye) => eye.productId === equipProductId);
    if (mallEye) {
      setActiveMode('eyes');
      setActiveEyeTheme('MY');
      setMyCollectionTab('pure');
      setSelectedEyeId(mallEye.id);
      setAppliedEyeId(mallEye.id);
      return;
    }

    const mallEyeshadow = mallEyeshadowOptions.find((eye) => eye.productId === equipProductId);
    if (mallEyeshadow) {
      setActiveMode('eyes');
      setMallPreviewType('eyeshadow');
      setSelectedEyeId(mallEyeshadow.id);
      setAppliedEyeshadowId(mallEyeshadow.id);
      eyeshadowSelectionRef.current = mallEyeshadow.id;
      return;
    }

    const voice = voiceOptions.find((item) => item.productId === equipProductId);
    if (voice) {
      setActiveMode('voice');
      setSelectedVoiceId(voice.id);
      setAppliedVoiceId(voice.id);
    }
  }, [redeemedMallItems, searchParams]);

  useEffect(() => {
    const viewProductId = searchParams.get('view');
    if (searchParams.get('mode') !== 'voice' || !viewProductId) return;
    const voice = voiceOptions.find((item) => item.productId === viewProductId);
    if (!voice) return;
    setActiveMode('voice');
    setSelectedVoiceId(voice.id);
  }, [searchParams]);

  useEffect(() => {
    const equippedEye = mallEyeOptions.find((eye) => eye.productId === equippedMallEyeId);
    if (equippedEye) setAppliedEyeId(equippedEye.id);
    const equippedEyeshadow = mallEyeshadowOptions.find((eye) => eye.productId === equippedMallEyeshadowId);
    if (equippedEyeshadow) setAppliedEyeshadowId(equippedEyeshadow.id);
    const equippedVoice = voiceOptions.find((voice) => voice.productId === equippedMallVoiceId);
    if (equippedVoice) setAppliedVoiceId(equippedVoice.id);
  }, [equippedMallEyeId, equippedMallEyeshadowId, equippedMallVoiceId]);

  useEffect(() => {
    const unlockId = searchParams.get('unlock');
    const unlockMode = searchParams.get('mode');
    if (!unlockId || !unlockMode) return;
    if (unlockMode === 'voice') {
      const voice = voiceOptions.find((item) => item.productId === unlockId);
      if (voice && voice.productId && !(redeemedMallItems?.[voice.productId] > 0)) {
        setActiveMode('voice');
        setUnlockTarget({ kind: 'voice', item: voice, price: voice.price });
      }
      return;
    }
    const eye = eyeOptions.find((item) => item.productId === unlockId);
    if (eye && eye.productId && !(redeemedMallItems?.[eye.productId] > 0)) {
      setUnlockTarget({ kind: 'eye', item: eye, price: getEyePointPrice(eye) });
    }
  }, [redeemedMallItems, searchParams]);

  const handleEyeSelect = (eye: EyeItem) => {
    if (eye.productId) {
      if (eye.previewType === 'eyeshadow') eyeshadowSelectionRef.current = eye.id;
      else eyeSelectionRef.current = eye.id;
      setSelectedEyeId(eye.id);
      return;
    }
    if (eye.locked) {
      setUnlockTarget({ kind: 'eye', item: eye, price: getEyePointPrice(eye) });
      return;
    }
    setSelectedEyeId(eye.id);
  };

  const switchMallPreviewType = (type: 'eye' | 'eyeshadow') => {
    if (mallPreviewType === type) return;
    if (mallPreviewType === 'eyeshadow') eyeshadowSelectionRef.current = selectedEyeId;
    else eyeSelectionRef.current = selectedEyeId;
    setMallPreviewType(type);
    if (type === 'eyeshadow') {
      const nextEyeshadowId = isMallPreview && !mallEyeshadowOptions.some((item) => item.id === eyeshadowSelectionRef.current)
        ? mallEyeshadowOptions[0].id
        : eyeshadowSelectionRef.current;
      eyeshadowSelectionRef.current = nextEyeshadowId;
      setSelectedEyeId(nextEyeshadowId);
      return;
    }
    const nextEyeId = isMallPreview && !mallEyeOptions.some((item) => item.id === eyeSelectionRef.current)
      ? mallEyeOptions[0].id
      : eyeSelectionRef.current;
    eyeSelectionRef.current = nextEyeId;
    setSelectedEyeId(nextEyeId);
  };

  const equipCurrentSelection = () => {
    selectedOutfitItems.forEach((item) => {
      if (!item.productId) return;
      equipMallItem(item.productId, item.previewType === 'eyeshadow' ? 'eyeshadow' : 'eye');
      if (item.previewType === 'eyeshadow') setAppliedEyeshadowId(item.id);
      else setAppliedEyeId(item.id);
    });
    if (currentOutfitEye && !currentOutfitEye.productId) setAppliedEyeId(currentOutfitEye.id);
    if (currentOutfitEyeshadow && !currentOutfitEyeshadow.productId) setAppliedEyeshadowId(currentOutfitEyeshadow.id);
    setAppliedVoiceId(selectedVoiceId);
  };

  const applySelection = () => {
    if (unownedOutfitItems.length > 0) {
      setDemoFulfillmentOutcome('success');
      setCheckoutSelectedProductIds(unownedOutfitItems.map((item) => item.productId).filter((id): id is string => Boolean(id)));
      setOutfitCheckoutOpen(true);
      return;
    }
    equipCurrentSelection();
    setToast('当前搭配已应用');
  };

  const confirmDirectRedemption = () => {
    if (!unlockTarget || isPurchasing || !unlockTarget.item.productId) return;
    const productId = unlockTarget.item.productId;
    if (points < unlockTarget.price) {
      const returnTo = `/eye-change?mode=${unlockTarget.kind}&unlock=${unlockTarget.item.productId}`;
      navigate(`/points-store?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    setIsPurchasing(true);
    const target = unlockTarget;
    const { result, orderId } = startMallRedemption(target.item.productId, target.item.name, target.price, {
      demoOutcome: demoFulfillmentOutcome,
    });
    if (result === 'insufficient-points') {
      setIsPurchasing(false);
      const returnTo = `/eye-change?mode=${unlockTarget.kind}&unlock=${unlockTarget.item.productId}`;
      navigate(`/points-store?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    if (result === 'already-owned') {
      setIsPurchasing(false);
      setUnlockTarget(null);
      setToast('该商品已拥有');
      return;
    }
    if (result !== 'processing' || !orderId) {
      setIsPurchasing(false);
      setUnlockTarget(null);
      setToast('兑换失败，请稍后重试');
      return;
    }
    window.setTimeout(() => {
      if (demoFulfillmentOutcome === 'failure') {
        refundMallRedemption(orderId);
        setIsPurchasing(false);
        setUnlockTarget(null);
        setToast(`「${target.item.name}」兑换失败，${target.price.toLocaleString()} 积分已退回`);
        return;
      }
      completeMallRedemption(orderId);
      if (isMallPreview) {
        const separator = mallReturnTo.includes('?') ? '&' : '?';
        navigate(`${mallReturnTo}${separator}purchased=${productId}`);
        return;
      }
      if (target.kind === 'eye') setSelectedEyeId(target.item.id);
      if (target.kind === 'voice') setSelectedVoiceId(target.item.id);
      setIsPurchasing(false);
      setUnlockTarget(null);
      setToast(`「${target.item.name}」兑换成功`);
    }, 1200);
  };

  const confirmOutfitRedemption = () => {
    if (isPurchasing || checkoutSelectedItems.length === 0) return;
    if (points < checkoutPointTotal) {
      setOutfitPointsInsufficientOpen(true);
      return;
    }

    setIsPurchasing(true);
    const startedOrderIds: string[] = [];
    if (checkoutHasBundleDiscount && activeBundleOffer) {
      const { result, orderId } = startMallRedemption(activeBundleOffer.id, activeBundleOffer.name, checkoutPointTotal, {
        demoOutcome: demoFulfillmentOutcome,
        grantedItemIds: checkoutSelectedItems.map((item) => item.productId).filter((id): id is string => Boolean(id)),
      });
      if (result === 'processing' && orderId) startedOrderIds.push(orderId);
    } else {
      for (const item of checkoutSelectedItems) {
        if (!item.productId) continue;
        const { result, orderId } = startMallRedemption(item.productId, item.name, getEyePointPrice(item), {
          demoOutcome: demoFulfillmentOutcome,
        });
        if (result === 'processing' && orderId) startedOrderIds.push(orderId);
      }
    }

    const expectedOrderCount = checkoutHasBundleDiscount ? 1 : checkoutSelectedItems.length;
    if (startedOrderIds.length !== expectedOrderCount) {
      startedOrderIds.forEach((orderId) => refundMallRedemption(orderId));
      setIsPurchasing(false);
      setOutfitCheckoutOpen(false);
      setToast('搭配状态已变化，请重新选择');
      return;
    }

    window.setTimeout(() => {
      if (demoFulfillmentOutcome === 'failure') {
        startedOrderIds.forEach((orderId) => refundMallRedemption(orderId));
        setIsPurchasing(false);
        setOutfitCheckoutOpen(false);
        setToast(`当前搭配兑换失败，${checkoutPointTotal.toLocaleString()} 积分已退回`);
        return;
      }

      startedOrderIds.forEach((orderId) => completeMallRedemption(orderId));
      setIsPurchasing(false);
      setOutfitCheckoutOpen(false);
      const redeemedItems = checkoutSelectedItems;
      if (!redeemedItems.some((item) => item.source === 'shop')) {
        equipCurrentSelection();
        setToast(`${redeemedItems.length} 件装扮兑换成功，已应用当前搭配`);
        return;
      }
      setOutfitRedemptionSuccess({
        items: redeemedItems,
        total: checkoutPointTotal,
      });
    }, 1200);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#d8deea] overflow-hidden flex justify-center py-4">
      <div className="relative w-[393px] h-[852px] mx-auto overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)] bg-white">
        <div className="absolute inset-x-0 top-0 bg-[#f3eef4]" style={{ height: activeMode === 'eyes' ? 452 : 852 }} />

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
            onClick={() => {
              if (searchParams.has('equip')) {
                navigate('/', { replace: true });
                return;
              }
              navigate(pageReturnTo || (isMallPreview ? mallReturnTo : '/'), { replace: Boolean(pageReturnTo) });
            }}
            className="flex h-10 w-10 items-center justify-center text-[#2f2b33] transition-transform active:scale-95"
            aria-label="返回"
          >
            <ArrowLeft size={30} strokeWidth={2.2} />
          </button>

          {!outfitCheckoutOpen && (isMallPreview ? (
            <PointsBalancePill
              points={points}
              onAdd={() => {
                const returnPath = `${window.location.pathname}${window.location.search}`;
                navigate(`/points-store?returnTo=${encodeURIComponent(returnPath)}`);
              }}
              className="absolute left-1/2 max-w-[162px] -translate-x-1/2"
            />
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
          ))}

          <button
            type="button"
            onClick={applySelection}
            disabled={unownedOutfitItems.length === 0 && fullSelectionApplied}
            className="h-10 min-w-[68px] rounded-full bg-[#8d66ef] px-4 text-[16px] font-semibold text-white shadow-[0_8px_18px_rgba(141,102,239,0.28)] transition-all active:scale-95 disabled:cursor-default disabled:bg-[#b8b2bd] disabled:shadow-none disabled:active:scale-100"
          >
            {outfitActionLabel}
          </button>
        </div>

        {activeMode === 'eyes' && (
          <>
        <div className="absolute bg-contain bg-center bg-no-repeat pointer-events-none" style={{ top: 122, left: -86, width: 560, height: 360, backgroundImage: "url('/images/moiedap1-khtkfqv.png')" }} />

        <div className="pointer-events-none absolute inset-x-0 z-20" style={{ top: 284 }} aria-label={`Ropet 正在试戴${currentOutfitEye?.name ?? ''}${currentOutfitEyeshadow ? `和${currentOutfitEyeshadow.name}` : ''}并眨眼`}>
          <span className="eye-preview-blink absolute -top-[7px] left-[116px] h-[60px] w-[60px] rounded-[50%] bg-no-repeat" style={faceEyeStyle} />
          <span className="eye-preview-blink eye-preview-blink-right absolute -top-[7px] right-[116px] h-[60px] w-[60px] rounded-[50%] bg-no-repeat" style={faceEyeStyle} />
          {currentOutfitEyeshadow && (
            <>
              <span className={`eyeshadow-preview eyeshadow-preview-${eyeshadowPreviewTone} absolute -top-[10px] left-[116px] h-[56px] w-[60px] rounded-[50%]`} />
              <span className={`eyeshadow-preview eyeshadow-preview-right eyeshadow-preview-${eyeshadowPreviewTone} absolute -top-[10px] right-[116px] h-[56px] w-[60px] rounded-[50%]`} />
            </>
          )}
        </div>

        <div className="absolute left-5 z-30 flex flex-col items-center gap-3" style={{ top: 294 }}>
          <button
            type="button"
            aria-label="切换到试美瞳"
            onClick={() => switchMallPreviewType('eye')}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${isEyeshadowPreview ? 'bg-white/75 opacity-70 shadow-[0_4px_10px_rgba(20,16,32,0.06)]' : 'bg-white text-[#29262d] shadow-[0_6px_14px_rgba(20,16,32,0.12)] ring-[3px] ring-[#8d66ef]'}`}
          >
            <Eye size={30} strokeWidth={2.8} />
          </button>
          <button
            type="button"
            aria-label="切换到试眼影"
            onClick={() => switchMallPreviewType('eyeshadow')}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${isEyeshadowPreview ? 'bg-white text-[#29262d] shadow-[0_6px_14px_rgba(20,16,32,0.14)] ring-[3px] ring-[#8d66ef]' : 'bg-white/85 text-[#29262d] opacity-80 shadow-[0_6px_14px_rgba(20,16,32,0.08)]'}`}
          >
            <EyeClosed size={31} strokeWidth={2.8} />
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
          {!isMallPreview && !isEyeshadowPreview && (
          <div className="border-b border-[#19181f0d] bg-white">
            <div className="relative h-[62px] border-b border-[#19181f0a]">
            <button
              type="button"
              aria-pressed={activeEyeTheme === 'MY'}
              onClick={() => {
                if (activeEyeTheme === 'MY') {
                  setActiveEyeTheme(eyeThemes[0]);
                  if (nativeEyes[0]) setSelectedEyeId(nativeEyes[0].id);
                  return;
                }
                setActiveEyeTheme('MY');
                const firstOwnedEye = myCollectionTab === 'pure'
                  ? ownedMallEyes[0]
                  : [...nativeEyes.filter((eye) => !eye.locked), ...ownedMallEyes][0];
                if (firstOwnedEye) setSelectedEyeId(firstOwnedEye.id);
              }}
              className={`absolute left-5 top-[15px] flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black transition-all focus:outline-none ${activeEyeTheme === 'MY' ? 'bg-[#19181f] text-white shadow-[0_5px_12px_rgba(25,24,31,.18)]' : 'bg-[#f4f2f5] text-[#77717c]'}`}
            >
              MY
            </button>
            <div className="absolute bottom-0 left-[66px] right-0 top-0 flex items-center gap-6 overflow-x-auto pr-5 scrollbar-hide">
              {eyeThemes.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => {
                    setActiveEyeTheme(theme);
                    const firstEye = theme === '商城精选' ? mallEyeOptions[0] : nativeEyes[0];
                    if (firstEye) setSelectedEyeId(firstEye.id);
                  }}
                  className={`relative h-full shrink-0 whitespace-nowrap text-[14px] focus:outline-none ${activeEyeTheme === theme ? 'font-bold text-[#19181f]' : 'font-medium text-[#aaa4af]'}`}
                >
                  {theme}
                  {activeEyeTheme === theme && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#19181f]" />}
                </button>
              ))}
            </div>
            </div>

            <div className="flex h-[58px] items-center gap-4 px-5">
              {([
                { id: 'all', label: '全部装扮', icon: Backpack },
                { id: 'pure', label: '已拥有', icon: ShoppingBag },
                { id: 'favorite', label: '我的收藏', icon: Heart },
              ] as const).map((tab) => {
                const Icon = tab.icon;
                const selected = activeEyeTheme === 'MY' && myCollectionTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-label={tab.label}
                    aria-pressed={selected}
                    onClick={() => {
                      setActiveEyeTheme('MY');
                      setMyCollectionTab(tab.id);
                      const firstEye = tab.id === 'pure'
                        ? ownedMallEyes[0]
                        : tab.id === 'favorite'
                          ? nativeEyes.filter((eye) => !eye.locked)[0]
                          : [...nativeEyes.filter((eye) => !eye.locked), ...ownedMallEyes][0];
                      if (firstEye) setSelectedEyeId(firstEye.id);
                    }}
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${selected ? 'bg-[#f2eff5] text-[#242129]' : 'text-[#aaa5ae]'}`}
                  >
                    <Icon size={22} strokeWidth={selected ? 2.3 : 2} fill={tab.id === 'favorite' && selected ? 'currentColor' : 'none'} />
                  </button>
                );
              })}
              {activeEyeTheme === 'MY' && myCollectionTab === 'pure' && (
                <button
                  type="button"
                  onClick={() => setDemoEmptyPure((current) => !current)}
                  className="ml-auto flex h-7 items-center rounded-full border border-dashed border-[#d2cdd6] px-2.5 text-[9px] font-bold text-[#9a939f]"
                >
                  {demoEmptyPure ? <RotateCcw size={11} className="mr-1" /> : <EyeOff size={11} className="mr-1" />}
                  {demoEmptyPure ? '恢复' : '空态'}
                </button>
              )}
            </div>
          </div>
          )}

          <div className="overflow-y-auto scrollbar-hide px-4 pt-4 pb-10" style={{ height: isMallPreview || isEyeshadowPreview ? 443 : 321 }}>
            {isEyeshadowPreview && !isMallPreview && (
              <h2 className="mb-5 px-1 text-[18px] font-semibold text-[#29252d]">眼影</h2>
            )}
            <div className="grid grid-cols-3 gap-x-[16px] gap-y-[10px]">
              {displayedEyes.map((eye) => (
                <button
                  key={eye.id}
                  type="button"
                  onClick={() => handleEyeSelect(eye)}
                  aria-label={`${eye.name}${eye.locked ? `，${getEyePointPrice(eye).toLocaleString()}积分` : '，已拥有'}`}
                  className="relative flex h-[132px] w-[108px] flex-col items-center justify-start transition-transform active:scale-95"
                >
                  <span className={`relative flex h-[96px] w-[96px] shrink-0 items-center justify-center overflow-hidden rounded-[17px] bg-[#f6f5f7] ${selectedEye.id === eye.id ? 'ring-[3px] ring-[#8d66ef]' : ''}`}>
                    {eye.previewType === 'eyeshadow' ? (
                    <span className="relative h-[96px] w-[96px] overflow-hidden rounded-[17px] bg-[#f3f3f3]">
                      {eye.eyelidStyle ? (
                        <span className="flex h-full w-full items-center justify-center gap-4">
                          {[0, 1].map((side) => (
                            <span
                              key={side}
                              className={`relative h-[30px] w-[30px] rounded-full border shadow-[inset_0_5px_8px_rgba(255ავის,255,255,0.45),0_3px_8px_rgba(80,100,160,0.14)] ${eye.eyelidTone === 'violet' ? 'border-[#8175e4] bg-gradient-to-b from-[#b9b5ff] via-[#9996ee] to-[#7779df]' : 'border-[#56b9cc] bg-gradient-to-b from-[#9be9f2] via-[#78cfdf] to-[#55b7cc]'}`}
                            >
                              <span className={`absolute inset-x-[3px] bottom-[8px] h-px rounded-full ${eye.eyelidTone === 'violet' ? 'bg-[#655dce]' : 'bg-[#429caf]'}`} />
                            </span>
                          ))}
                        </span>
                      ) : (
                        <img src={eye.previewImg} alt={eye.name} className="absolute inset-0 h-full w-full object-cover" />
                      )}
                    </span>
                  ) : eye.spritePosition ? (
                    <span
                      role="img"
                      aria-label={eye.name}
                      className="h-[96px] w-[96px] bg-no-repeat mix-blend-multiply"
                      style={{ backgroundImage: `url('${eye.previewImg}')`, backgroundPosition: eye.spritePosition, backgroundSize: '300% 300%' }}
                    />
                  ) : (
                    <img
                      src={eye.previewImg}
                      alt={eye.name}
                      className="object-contain"
                      style={{ width: 96, height: 96 }}
                    />
                  )}
                  </span>
                  {eye.source === 'shop'
                    ? <ShopSourceBadge />
                    : eye.badge && !eye.spritePosition && <EyeBadge type={eye.badge} />}
                  <span className="mt-2 flex h-5 items-center justify-center text-[12px] font-medium text-[#242129]">
                    {eye.locked ? (
                      <><Coins size={14} className="mr-1 text-[#f2b52d]" strokeWidth={2.2} />{getEyePointPrice(eye).toLocaleString()}</>
                    ) : (
                      <span className="text-[#aaa6ac]">已拥有</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
            {displayedEyes.length === 0 && (
              <button
                type="button"
                onClick={() => navigate('/interaction-history?shop=eyes')}
                className="flex h-[250px] w-full flex-col items-center justify-center text-[#8d66ef] transition-transform active:scale-[0.98]"
              >
                <img src="/images/shop-source-badge.png" alt="" className="h-[112px] w-[112px]" />
                <span className="mt-4 flex items-center text-[16px] font-medium">
                  去商城购买
                  <CircleChevronRight size={18} className="ml-1" fill="#8d66ef" color="white" />
                </span>
              </button>
            )}
          </div>

          <div className="absolute left-1/2 bottom-[8px] -translate-x-1/2 w-[134px] h-[5px] rounded-full bg-black" />
        </div>
          </>
        )}

        {activeMode === 'voice' && (
          <div className="absolute inset-0 z-10 bg-white" />
        )}

        {outfitCheckoutOpen && (
          <div className="absolute inset-0 z-[85] flex items-end bg-black/48" onClick={() => {
            if (isPurchasing) return;
            setOutfitCheckoutOpen(false);
            setOutfitPointsInsufficientOpen(false);
          }}>
            <div className="absolute left-1/2 top-[275px] z-10 flex h-[36px] min-w-[88px] -translate-x-1/2 items-center justify-center gap-1.5 rounded-full bg-white/85 px-3 text-[17px] font-semibold text-[#242129] shadow-[0_5px_15px_rgba(35,29,43,0.14)] backdrop-blur-md" onClick={(event) => event.stopPropagation()}>
              <Coins size={18} className="text-[#f6b91d]" fill="#fff2b1" />
              {points.toLocaleString()}
            </div>
            <section className="flex h-[531px] w-full flex-col rounded-t-[14px] bg-white pt-5 shadow-[0_-18px_45px_rgba(32,25,38,0.18)]" onClick={(event) => event.stopPropagation()}>
              <h2 className="px-5 text-[20px] font-semibold text-[#29252d]">兑换确认</h2>

              <div className="mt-4 px-5">
                {unownedOutfitItems.map((item) => {
                  const selected = Boolean(item.productId && checkoutSelectedProductIds.includes(item.productId));
                  return (
                  <button
                    key={item.productId}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      if (!item.productId || isPurchasing) return;
                      setCheckoutSelectedProductIds((current) => current.includes(item.productId as string)
                        ? current.filter((id) => id !== item.productId)
                        : [...current, item.productId as string]);
                    }}
                    className={`flex h-[112px] w-full items-center text-left transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8d66ef] ${selected ? 'opacity-100' : 'opacity-45'}`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${selected ? 'border-[#8059e8] bg-[#8059e8] text-white' : 'border-[#cfc9d4] bg-white text-transparent'}`}>
                      <Check size={15} strokeWidth={3.2} />
                    </span>
                    <span className="ml-3 h-[92px] w-[92px] shrink-0 overflow-hidden rounded-[14px] bg-[#f4f3f5]">
                      {item.previewType === 'eyeshadow' || !item.spritePosition ? (
                        <img src={item.previewImg} alt="" className="h-full w-full object-contain" />
                      ) : (
                        <span className="block h-full w-full bg-white bg-no-repeat" style={{ backgroundImage: `url('${item.previewImg}')`, backgroundPosition: item.spritePosition, backgroundSize: '300% 300%' }} />
                      )}
                    </span>
                    <span className="ml-3 min-w-0 flex-1">
                      <strong className="block truncate text-[16px] font-semibold text-[#312c35]">{item.name}</strong>
                      <span className="mt-2 flex items-center text-[14px] text-[#242129]">
                        <Coins size={15} className="mr-1 text-[#f6b91d]" fill="#fff2b1" />
                        {getEyePointPrice(item).toLocaleString()}
                      </span>
                    </span>
                  </button>
                  );
                })}
              </div>

              <div className="mt-auto border-t border-[#ece9ee] px-5 pb-[52px] pt-5">
                <div className="flex items-center justify-between text-[13px] text-[#7f7983]">
                  <span>总计</span>
                  <strong className="flex items-center text-[18px] font-semibold text-[#302c34]">
                    {checkoutHasBundleDiscount && <span className="mr-2 text-[12px] font-medium text-[#9a949e] line-through">{checkoutOriginalPointTotal.toLocaleString()}</span>}
                    <Coins size={18} className="mr-1 text-[#f6b91d]" fill="#fff2b1" />
                    {checkoutPointTotal.toLocaleString()}
                  </strong>
                </div>

                <div className={`mt-4 grid gap-3 ${unownedOutfitItems.some((item) => item.source !== 'shop') ? 'grid-cols-[122px_1fr]' : 'grid-cols-1'}`}>
                  {unownedOutfitItems.some((item) => item.source !== 'shop') && (
                    <button type="button" onClick={() => navigate('/lucky-draw-2')} className="flex h-[52px] items-center justify-center rounded-[14px] border-2 border-[#ece9ee] bg-white text-[15px] font-semibold text-[#302c34]">
                      抽奖获得
                    </button>
                  )}
                  <button type="button" onClick={confirmOutfitRedemption} disabled={isPurchasing || checkoutSelectedItems.length === 0} className="flex h-[52px] items-center justify-center rounded-[14px] bg-[#7c55e7] text-[15px] font-semibold text-white disabled:bg-[#bbb5c4] disabled:opacity-70">
                    积分兑换
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {outfitPointsInsufficientOpen && (
          <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/45 px-8">
            <section className="w-full rounded-[24px] bg-white px-6 py-7 text-center shadow-[0_18px_42px_rgba(0,0,0,0.18)]">
              <h2 className="text-[18px] font-semibold text-[#222127]">当前积分不足</h2>
              <p className="mt-3 text-[15px] leading-6 text-[#6f6875]">去购买更多积分</p>
              <button
                type="button"
                onClick={() => {
                  const productIds = selectedOutfitItems.map((item) => item.productId).filter(Boolean).join(',');
                  const bundleQuery = activeBundleOffer ? `&bundle=${activeBundleOffer.id}` : '';
                  const returnPath = isMallPreview
                    ? `/eye-change?source=mall&product=${mallProductId ?? ''}&outfit=${productIds}${bundleQuery}&returnTo=${encodeURIComponent(mallReturnTo)}`
                    : `/eye-change?outfit=${productIds}`;
                  navigate(`/points-store?returnTo=${encodeURIComponent(returnPath)}`);
                }}
                className="mt-6 h-12 w-full rounded-[16px] bg-[#8b66ef] text-[15px] font-semibold text-white"
              >
                去购买
              </button>
              <button
                type="button"
                onClick={() => setOutfitPointsInsufficientOpen(false)}
                className="mt-3 h-11 w-full rounded-[16px] border border-[#e6e1ed] bg-white text-[14px] font-semibold text-[#4f4a55]"
              >
                算了
              </button>
            </section>
          </div>
        )}

        {outfitRedemptionSuccess && (
          <div className="absolute inset-0 z-[140] overflow-hidden bg-gradient-to-b from-[#ffb719] via-[#ffd95a] to-[#ffb517] text-[#17121a]">
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 30 }).map((_, index) => (
                <Star
                  key={index}
                  className="absolute text-white"
                  fill="white"
                  strokeWidth={0}
                  style={{
                    width: 54 + (index % 3) * 16,
                    height: 54 + (index % 3) * 16,
                    left: `${(index * 37) % 112 - 8}%`,
                    top: `${(index * 23) % 108 - 5}%`,
                    transform: `rotate(${(index % 5) * 13}deg)`,
                  }}
                />
              ))}
            </div>
            <div className="absolute left-1/2 top-[330px] h-[370px] w-[370px] -translate-x-1/2 rounded-full bg-white/65 blur-[42px]" />

            <header className="relative z-10 flex h-[72px] items-center justify-between px-6 pt-2">
              <strong className="text-[16px]">9:41</strong>
              <button type="button" aria-label="关闭兑换成功页面" onClick={() => setOutfitRedemptionSuccess(null)} className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/90 text-white">
                <X size={27} strokeWidth={1.8} />
              </button>
            </header>

            <main role="dialog" aria-modal="true" aria-labelledby="outfit-success-title" className="relative z-10 flex flex-col items-center px-6 pt-10 text-center">
              <h2 id="outfit-success-title" className="text-[47px] font-black leading-none text-white [text-shadow:0_7px_0_#17121a]">兑换成功</h2>
              <p className="mt-5 text-[12px] font-black tracking-[2px] text-[#855c16]">{outfitRedemptionSuccess.items.length} 件装扮已放入衣橱</p>

              <section className="relative mt-10 h-[250px] w-[280px]">
                {outfitRedemptionSuccess.items.map((item, index) => {
                  const cardOffset = (index - (outfitRedemptionSuccess.items.length - 1) / 2) * 74;
                  const cardRotation = (index - (outfitRedemptionSuccess.items.length - 1) / 2) * 10;
                  return (
                  <div
                    key={item.productId}
                    className="absolute left-1/2 top-0 w-[168px] rounded-[24px] bg-gradient-to-br from-[#ffc43f] via-[#ffac79] to-[#ff98d2] p-2 shadow-[0_20px_36px_rgba(135,82,11,0.28)]"
                    style={{
                      zIndex: index + 1,
                      transform: `translateX(calc(-50% + ${cardOffset}px)) rotate(${cardRotation}deg)`,
                      transformOrigin: '50% 88%',
                    }}
                  >
                    <span className="relative mx-auto flex h-[154px] w-full items-center justify-center overflow-hidden rounded-[18px] bg-white">
                      <span className="absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#ffc947] to-[#ff8c75] px-2.5 py-0.5 text-[9px] font-black text-white shadow-sm">◆ SR</span>
                      {item.previewType === 'eyeshadow' ? (
                        <img src={item.previewImg} alt={item.name} className="h-full w-full object-cover" />
                      ) : item.spritePosition ? (
                        <span role="img" aria-label={item.name} className="h-full w-full bg-white bg-no-repeat" style={{ backgroundImage: `url('${item.previewImg}')`, backgroundPosition: item.spritePosition, backgroundSize: '300% 300%' }} />
                      ) : (
                        <img src={item.previewImg} alt={item.name} className="h-full w-full object-contain" />
                      )}
                    </span>
                    <strong className="flex h-[44px] items-center justify-center truncate px-2 text-[15px] font-black text-white">{item.name}</strong>
                  </div>
                  );
                })}
              </section>

              <button
                type="button"
                onClick={equipCurrentSelection}
                disabled={fullSelectionApplied}
                className="mt-10 flex h-14 w-full max-w-[300px] items-center justify-center rounded-full bg-black text-[18px] font-bold text-white shadow-[0_10px_20px_rgba(100,60,0,0.22)] disabled:cursor-default disabled:bg-black/85"
              >
                {fullSelectionApplied ? '已穿戴' : '一键穿戴'}
              </button>
            </main>
          </div>
        )}

        {unlockTarget && isMallPreview && unlockTarget.kind === 'eye' ? (
          <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black/55 px-8" onClick={() => setUnlockTarget(null)}>
            <section className="w-full rounded-[28px] bg-white px-6 pb-6 pt-7 text-center shadow-[0_22px_54px_rgba(0,0,0,0.22)]" onClick={(event) => event.stopPropagation()}>
              <h2 className="text-[20px] font-black text-[#29252d]">兑换{unlockTarget.item.name}</h2>
              <p className="mt-4 text-[14px] leading-6 text-[#3f3944]">
                本次兑换需要 {unlockTarget.price.toLocaleString()} 积分，<br />当前剩余积分 {points.toLocaleString()}。
              </p>
              <div className="mt-5 flex items-center justify-center gap-3 text-[18px] font-black text-[#2e2932]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffe19a] text-[15px]">★</span>
                <span>{unlockTarget.price.toLocaleString()}</span>
                <span>=</span>
                <span className="flex items-center gap-2 rounded-[10px] border border-[#e5e1e9] bg-[#f5f4f7] p-2 pr-3">
                  {unlockTarget.item.spritePosition ? (
                    <span className="h-11 w-11 rounded-[7px] bg-white bg-no-repeat" style={{ backgroundImage: `url('${unlockTarget.item.previewImg}')`, backgroundPosition: unlockTarget.item.spritePosition, backgroundSize: '300% 300%' }} />
                  ) : (
                    <img src={unlockTarget.item.previewImg} alt={unlockTarget.item.name} className={`h-11 w-11 rounded-[7px] bg-white ${unlockTarget.item.previewType === 'eyeshadow' ? 'object-cover' : 'object-contain'}`} />
                  )}
                  <span className="text-[15px]">× 1</span>
                </span>
              </div>
              <p className="mt-4 text-[12px] text-[#8f8894]">兑换成功后将直接放入{unlockTarget.item.previewType === 'eyeshadow' ? '我的眼影' : '我的美瞳'}</p>
              <p className="mt-1 text-[11px] text-[#aaa3ad]">一次性商品，兑换后不可重复购买。</p>
              <div className="mt-5 flex items-center justify-between rounded-[12px] bg-[#f2eff5] px-3 py-2">
                <span className="text-[10px] font-bold text-[#98919d]">原型结果</span>
                <div className="flex rounded-full bg-[#e7e2eb] p-0.5">
                  <button type="button" onClick={() => setDemoFulfillmentOutcome('success')} className={`h-7 rounded-full px-3 text-[10px] font-bold ${demoFulfillmentOutcome === 'success' ? 'bg-white text-[#6650b5] shadow-sm' : 'text-[#9a939f]'}`}>成功</button>
                  <button type="button" onClick={() => setDemoFulfillmentOutcome('failure')} className={`h-7 rounded-full px-3 text-[10px] font-bold ${demoFulfillmentOutcome === 'failure' ? 'bg-white text-[#d85c72] shadow-sm' : 'text-[#9a939f]'}`}>失败退款</button>
                </div>
              </div>
              <button type="button" onClick={confirmDirectRedemption} disabled={isPurchasing} className="mt-5 h-12 w-full rounded-[14px] bg-[#7c5ae0] text-[15px] font-bold text-white disabled:opacity-55">
                {points >= unlockTarget.price ? '确定兑换' : '去购买积分'}
              </button>
              <button type="button" onClick={() => setUnlockTarget(null)} disabled={isPurchasing} className="mt-3 h-11 w-full rounded-[14px] border border-[#e6e1ed] bg-white text-[14px] font-bold text-[#4f4a55]">取消</button>
            </section>
          </div>
        ) : unlockTarget?.kind === 'voice' ? (
          <div
            className="absolute inset-0 z-[80] flex items-end bg-[rgba(0,0,0,0.48)]"
            onClick={() => {
              setPreviewingVoiceId(null);
              setUnlockTarget(null);
            }}
          >
            <section
              aria-label={`${unlockTarget.item.name}声音详情`}
              className="relative h-[676px] w-full overflow-hidden rounded-t-[28px] bg-white shadow-[0_-18px_42px_rgba(31,25,38,0.18)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2">
                <PointsBalancePill
                  points={points}
                  onAdd={() => {
                    const returnTo = `/eye-change?mode=voice&unlock=${unlockTarget.item.productId ?? ''}`;
                    navigate(`/points-store?returnTo=${encodeURIComponent(returnTo)}`);
                  }}
                  className="max-w-[176px]"
                />
              </div>
              <div
                role="img"
                aria-label={`${unlockTarget.item.name}场景预览`}
                className="h-[384px] w-full bg-no-repeat"
                style={{
                  backgroundImage: "url('/images/voice-grid-reference.png')",
                  backgroundPosition: unlockTarget.item.detailImagePosition,
                  backgroundSize: '942px 2056px',
                }}
              />

              <div className="flex h-[292px] flex-col px-5 pb-5 pt-4">
                <div className="flex items-center gap-2">
                  <h2 className="min-w-0 flex-1 truncate text-[19px] font-bold text-[#28242c]">{unlockTarget.item.name}</h2>
                  <button
                    type="button"
                    aria-label={previewingVoiceId === unlockTarget.item.id ? `暂停${unlockTarget.item.name}` : `试听${unlockTarget.item.name}`}
                    onClick={() => setPreviewingVoiceId((current) => current === unlockTarget.item.id ? null : unlockTarget.item.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8b61ea] text-white"
                  >
                    <AudioWaveform
                      size={19}
                      strokeWidth={2.4}
                      className={previewingVoiceId === unlockTarget.item.id ? 'animate-pulse' : ''}
                    />
                  </button>
                </div>

                <p className="mt-3 text-[12px] leading-[20px] text-[#8d8791]">
                  {unlockTarget.item.source === 'growth'
                    ? `${growthVoiceUnlocked ? '第四阶段已解锁。' : '第四阶段解锁。'}${unlockTarget.item.description}`
                    : unlockTarget.item.description}
                </p>

                <div className="mt-auto flex w-full gap-3">
                  {!voiceDetailOwned && (unlockTarget.item.source === 'lottery' || unlockTarget.item.source === 'shop') && (
                    <button
                      type="button"
                      onClick={() => navigate('/lucky-draw-2')}
                      className="flex h-[52px] flex-1 items-center justify-center rounded-[14px] border border-[#8259e5] bg-white text-[15px] font-semibold text-[#8259e5]"
                    >
                      去抽奖
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (unlockTarget.item.source === 'growth' && !growthVoiceUnlocked) {
                        setPreviewingVoiceId(null);
                        setUnlockTarget(null);
                        navigate('/growth');
                        return;
                      }
                      if (!voiceDetailOwned) {
                        confirmDirectRedemption();
                        return;
                      }
                      setSelectedVoiceId(unlockTarget.item.id);
                      setAppliedVoiceId(unlockTarget.item.id);
                      setPreviewingVoiceId(null);
                      setUnlockTarget(null);
                      setToast(`已使用「${unlockTarget.item.name}」`);
                    }}
                    disabled={isPurchasing}
                    className="flex h-[52px] flex-1 items-center justify-center rounded-[14px] bg-[#8259e5] text-[15px] font-semibold text-white disabled:opacity-60"
                  >
                    {voiceDetailOwned
                      ? '使用'
                      : unlockTarget.item.source === 'growth'
                        ? '去查看'
                        : isPurchasing
                          ? '购买中…'
                          : '去购买'}
                  </button>
                </div>
              </div>
            </section>
          </div>
        ) : unlockTarget ? (
          <div className="absolute inset-0 z-[80] flex items-end bg-black/45" onClick={() => setUnlockTarget(null)}>
            <section className="w-full rounded-t-[28px] bg-white px-5 pb-8 pt-5" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center">
                {unlockTarget.kind === 'eye' ? <img src={unlockTarget.item.previewImg} alt={unlockTarget.item.name} className="h-16 w-16 rounded-[18px] bg-[#f4f1f7] object-contain" /> : <span className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#f1ecff] text-[#7c5ae0]"><Volume2 size={28} strokeWidth={2.2} /></span>}
                <div className="ml-3"><h2 className="text-[19px] font-black text-[#2e2932]">{unlockTarget.item.name}</h2><p className="mt-1 text-[11px] text-[#928a99]">这款{unlockTarget.kind === 'eye' ? '美瞳' : '声线'}尚未获得</p></div>
              </div>
              <div className="mt-5 rounded-[17px] bg-[#f5f1ff] px-4 py-3 text-[12px] leading-6 text-[#6f5a98]">{unlockRequiresMall ? '这是商城限定商品，可以在当前页使用积分兑换。' : '可以去幸运抽奖机碰碰运气，也可以使用积分直接兑换。'}</div>
              {!unlockRequiresMall && <button type="button" onClick={() => navigate('/lucky-draw-2')} className="mt-5 flex h-12 w-full items-center justify-center rounded-[16px] bg-[#8d66ef] text-[14px] font-bold text-white"><Sparkles size={18} className="mr-2" />去抽奖获得</button>}
              <button type="button" onClick={confirmDirectRedemption} disabled={isPurchasing} className={`${unlockRequiresMall ? 'mt-5 bg-[#8d66ef] text-white' : 'mt-3 border border-[#ddd4f5] bg-white text-[#7656ce]'} flex h-12 w-full items-center justify-center rounded-[16px] text-[14px] font-bold disabled:opacity-60`}><Coins size={18} className="mr-2" />{isPurchasing ? '兑换中…' : points >= unlockTarget.price ? `${unlockTarget.price.toLocaleString()} 积分直接兑换` : `积分不足 · 需 ${unlockTarget.price.toLocaleString()}`}</button>
              <p className="mt-3 text-center text-[11px] text-[#aaa3b0]">当前积分 {points.toLocaleString()}</p>
              <button type="button" onClick={() => setUnlockTarget(null)} className="mt-1 h-10 w-full text-[13px] font-semibold text-[#928b99]">暂不获取</button>
            </section>
          </div>
        ) : null}

        {isPurchasing && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/25">
            <div className="flex h-20 w-20 items-center justify-center rounded-[20px] bg-white/95 shadow-[0_12px_30px_rgba(35,28,44,0.18)]">
              <RotateCcw size={30} className="animate-spin text-[#8d66ef]" />
            </div>
          </div>
        )}

        {toast && (
          <div className="absolute left-1/2 top-24 z-[110] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#252229]/92 px-4 py-2.5 text-[12px] font-bold text-white shadow-lg">
            {toast}
          </div>
        )}

        {activeMode === 'voice' && (
          <>
          <div className="absolute inset-x-0 bottom-0 top-[116px] z-30 overflow-y-auto bg-[#fafafa] px-6 pb-10 pt-[13px] scrollbar-hide">
            <div className="grid grid-cols-2 gap-x-[17px] gap-y-[22px]">
              {displayedVoices.map((voice) => {
                const selected = selectedVoiceId === voice.id;
                return (
                  <button
                    key={voice.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setPreviewingVoiceId(null);
                      setUnlockTarget({ kind: 'voice', item: voice, price: voice.price });
                    }}
                    className="w-[164px] text-left transition-transform active:scale-[0.98]"
                  >
                    <span
                      role="img"
                      aria-label={voice.name}
                      className={`block h-[202px] w-[164px] rounded-[10px] bg-no-repeat ${selected ? 'ring-2 ring-[#8d66ef] ring-offset-2 ring-offset-[#fafafa]' : ''}`}
                      style={{
                        backgroundImage: "url('/images/voice-grid-reference.png')",
                        backgroundSize: '393px 858px',
                        backgroundPosition: voice.gridImagePosition,
                      }}
                    />
                    <span className="mt-2 block truncate text-[15px] font-semibold leading-5 text-[#29252d]">
                      {voice.name}
                    </span>
                    <span className="mt-1 flex h-5 items-center text-[12px] leading-5">
                      {voice.source === 'growth' || !voice.locked ? (
                        <span className={`font-medium ${voice.locked ? 'text-[#a19ca4]' : 'text-[#7656ef]'}`}>
                          {voice.locked ? '未解锁' : '已解锁'}
                        </span>
                      ) : (
                        <span className="flex items-center font-medium text-[#7656ef]">
                          <Coins size={13} className="mr-1 text-[#f6b91d]" fill="#fff2b1" />
                          {voice.price.toLocaleString()} 积分
                        </span>
                      )}
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
