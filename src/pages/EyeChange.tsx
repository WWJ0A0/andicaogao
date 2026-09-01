import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Coins, EyeOff, Heart, LockKeyhole, Pause, Play, RotateCcw, Sparkles, Star, Volume2, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PointsBalancePill from '@/components/PointsBalancePill';
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
  eyelidStyle?: 'default' | 'gentle' | 'sleepy';
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
    name: '默认眼皮',
    locked: false,
    previewType: 'eyeshadow',
    eyelidStyle: 'default',
  },
  {
    id: 203,
    previewImg: '/images/moiedap1-khtkfqv.png',
    badge: null,
    name: '温柔眼皮',
    locked: true,
    source: 'lottery',
    productId: 'gentle-eyelids',
    previewType: 'eyeshadow',
    eyelidStyle: 'gentle',
  },
  {
    id: 204,
    previewImg: '/images/moiedap1-khtkfqv.png',
    badge: null,
    name: '困困眼皮',
    locked: true,
    source: 'lottery',
    productId: 'sleepy-eyelids',
    previewType: 'eyeshadow',
    eyelidStyle: 'sleepy',
  },
];

const mallPointPrices: Record<string, number> = {
  'galaxy-eyes': 4000,
  'caramel-eyes': 4000,
  'obsidian-eyes': 3000,
  'forest-eyes': 4000,
  'rainbow-pixel-eyes': 5000,
  'reindeer-eyes': 4000,
  'moon-pixel-eyes': 3000,
  'sunset-pixel-eyes': 2400,
  'mint-eyes': 3000,
  'vitality-eyelids': 48000,
  'sunset-eyelids': 48000,
  'gentle-eyelids': 10000,
  'sleepy-eyelids': 10000,
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

const eyeThemes = ['水果硬糖', '火焰微光', '绿色乐园', '节日限定', '赛博小猫', '梦境星球', '商城精选'];

const badgeStyle = {
  gold: 'bg-[#ffe1a1] text-[#ff9e19]',
  blue: 'bg-[#dbe7ff] text-[#779dff]',
  purple: 'bg-[#dfd3ff] text-[#a07cff]',
};

interface VoiceItem {
  id: number;
  name: string;
  description: string;
  imagePosition: string;
  productId: string | null;
  price: number;
  source: 'native' | 'shop' | 'lottery' | 'growth';
}

const voiceOptions: VoiceItem[] = [
  { id: 1, name: '原生声线', description: '来自 Ropet 星球的原生语言，\n轻轻哼唱，也会撒娇地小声回应。', imagePosition: '-260px -162px', productId: null, price: 0, source: 'native' },
  { id: 2, name: '豚豚语', description: '呜喂～呜喂～\nRopet 听一次就学会的小豚语言。', imagePosition: '-245px -314px', productId: 'cavy-talk', price: 6000, source: 'shop' },
  { id: 3, name: '咩咩语', description: '咩～咩～今天也想为你唱一首歌。', imagePosition: '-249px -474px', productId: 'little-lamb', price: 6000, source: 'shop' },
  { id: 4, name: '萌萌语', description: '只有最聪明的 Ropet 才能掌握的秘密语言。', imagePosition: '-261px -636px', productId: 'moe-language', price: 6000, source: 'growth' },
  { id: 5, name: '猫猫语', description: '喵呜～喵呜～\n从幸运抽奖机学会的猫猫语言。', imagePosition: '-260px -162px', productId: 'cat-talk', price: 6000, source: 'lottery' },
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

const EyeChange: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mallProductId = searchParams.get('product');
  const pageReturnTo = searchParams.get('returnTo');
  const mallReturnTo = pageReturnTo || '/interaction-history';
  const isMallPreview = searchParams.get('source') === 'mall' && Boolean(mallProductId);
  const [mallPreviewType, setMallPreviewType] = useState<'eye' | 'eyeshadow'>(
    mallEyeshadowOptions.some((item) => item.productId === mallProductId) ? 'eyeshadow' : 'eye',
  );
  const isEyeshadowPreview = mallPreviewType === 'eyeshadow';
  const redeemedMallItems = useDialogueStore((state) => state.redeemedMallItems);
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
  const [playingVoiceId, setPlayingVoiceId] = useState<number | null>(null);
  const [activeEyeTheme, setActiveEyeTheme] = useState('水果硬糖');
  const [myCollectionTab, setMyCollectionTab] = useState<'all' | 'pure'>('all');
  const [demoEmptyPure, setDemoEmptyPure] = useState(false);
  const [unlockTarget, setUnlockTarget] = useState<UnlockTarget | null>(null);
  const [outfitCheckoutOpen, setOutfitCheckoutOpen] = useState(false);
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
  const ownedMallEyeshadows = mallEyeshadowOptions
    .filter((eye) => eye.productId && (redeemedMallItems?.[eye.productId] ?? 0) > 0)
    .map((eye) => ({ ...eye, locked: false }));
  const previewOptions = isEyeshadowPreview
    ? isMallPreview ? mallEyeshadowOptions : [...defaultEyeshadowOptions, ...ownedMallEyeshadows]
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
        : [...nativeEyes.filter((eye) => !eye.locked), ...ownedMallEyes]
      : activeEyeTheme === '商城精选'
        ? mallEyeOptions.map((eye) => ({
          ...eye,
          locked: eye.productId && (redeemedMallItems?.[eye.productId] ?? 0) > 0 ? false : eye.locked,
        }))
      : nativeEyes;
  const displayedVoices = voiceOptions
    .filter((voice) => voice.source === 'native' || voice.source === 'lottery' || Boolean(voice.productId && (redeemedMallItems?.[voice.productId] ?? 0) > 0))
    .map((voice) => ({
      ...voice,
      locked: Boolean(voice.productId && (redeemedMallItems?.[voice.productId] ?? 0) <= 0),
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
  const unownedOutfitItems = selectedOutfitItems.filter((item) => (
    item.productId && (redeemedMallItems?.[item.productId] ?? 0) <= 0
  ));
  const checkoutSelectedItems = unownedOutfitItems.filter((item) => (
    item.productId && checkoutSelectedProductIds.includes(item.productId)
  ));
  const checkoutPointTotal = checkoutSelectedItems.reduce((total, item) => total + getEyePointPrice(item), 0);
  const selectedOutfitApplied = Boolean(currentOutfitEye && currentOutfitEyeshadow)
    && (currentOutfitEye?.productId ? equippedMallEyeId === currentOutfitEye.productId : appliedEyeId === currentOutfitEye?.id)
    && (currentOutfitEyeshadow?.productId ? equippedMallEyeshadowId === currentOutfitEyeshadow.productId : appliedEyeshadowId === currentOutfitEyeshadow?.id);
  const selectedVoiceApplied = appliedVoiceId === selectedVoiceId;
  const fullSelectionApplied = selectedOutfitApplied && selectedVoiceApplied;
  const unlockRequiresMall = Boolean(unlockTarget && (
    (unlockTarget.kind === 'voice' && unlockTarget.item.source === 'shop')
    || (unlockTarget.kind === 'eye' && unlockTarget.item.source === 'shop')
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
      const productIds = selectedOutfitItems.map((item) => item.productId).filter(Boolean).join(',');
      const returnPath = isMallPreview
        ? `/eye-change?source=mall&product=${mallProductId ?? ''}&outfit=${productIds}&returnTo=${encodeURIComponent(mallReturnTo)}`
        : `/eye-change?outfit=${productIds}`;
      navigate(`/points-store?returnTo=${encodeURIComponent(returnPath)}`);
      return;
    }

    setIsPurchasing(true);
    const startedOrders: { orderId: string; item: EyeItem }[] = [];
    for (const item of checkoutSelectedItems) {
      if (!item.productId) continue;
      const { result, orderId } = startMallRedemption(item.productId, item.name, getEyePointPrice(item), {
        demoOutcome: demoFulfillmentOutcome,
      });
      if (result === 'processing' && orderId) startedOrders.push({ orderId, item });
    }

    if (startedOrders.length !== checkoutSelectedItems.length) {
      startedOrders.forEach(({ orderId }) => refundMallRedemption(orderId));
      setIsPurchasing(false);
      setOutfitCheckoutOpen(false);
      setToast('搭配状态已变化，请重新选择');
      return;
    }

    window.setTimeout(() => {
      if (demoFulfillmentOutcome === 'failure') {
        startedOrders.forEach(({ orderId }) => refundMallRedemption(orderId));
        setIsPurchasing(false);
        setOutfitCheckoutOpen(false);
        setToast(`当前搭配兑换失败，${checkoutPointTotal.toLocaleString()} 积分已退回`);
        return;
      }

      startedOrders.forEach(({ orderId }) => completeMallRedemption(orderId));
      setIsPurchasing(false);
      setOutfitCheckoutOpen(false);
      const redeemedItems = startedOrders.map(({ item }) => item);
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
            onClick={() => {
              if (searchParams.has('equip')) {
                navigate('/', { replace: true });
                return;
              }
              navigate(pageReturnTo || (isMallPreview ? mallReturnTo : '/'), { replace: Boolean(pageReturnTo) });
            }}
            className={`flex w-10 h-10 items-center justify-center active:scale-95 transition-transform ${activeMode === 'eyes' ? 'text-white' : 'text-[#2f2b33]'}`}
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
            {unownedOutfitItems.length > 0
              ? `兑换${unownedOutfitItems.length > 1 ? unownedOutfitItems.length : ''}`
              : fullSelectionApplied ? '使用中' : '使用'}
          </button>
        </div>

        {activeMode === 'eyes' && (
          <>
        <div className="absolute bg-contain bg-center bg-no-repeat pointer-events-none" style={{ top: 122, left: -86, width: 560, height: 360, backgroundImage: "url('/images/moiedap1-khtkfqv.png')" }} />

        {isEyeshadowPreview && (
          <div className="pointer-events-none absolute inset-x-0 z-20" style={{ top: 284 }} aria-label={`Ropet 正在试戴${selectedEye.name}并眨眼`}>
            <span className={`eyeshadow-blink absolute left-[122px] h-[46px] w-[48px] rounded-[50%] bg-cover bg-center ${selectedEye.eyelidStyle ? `eyeshadow-${selectedEye.eyelidStyle}` : ''}`} style={selectedEye.eyelidStyle ? undefined : { backgroundImage: `url('${selectedEye.previewImg}')` }} />
            <span className={`eyeshadow-blink eyeshadow-blink-right absolute right-[122px] h-[46px] w-[48px] rounded-[50%] bg-cover bg-center ${selectedEye.eyelidStyle ? `eyeshadow-${selectedEye.eyelidStyle}` : ''}`} style={selectedEye.eyelidStyle ? undefined : { backgroundImage: `url('${selectedEye.previewImg}')` }} />
          </div>
        )}
        {!isEyeshadowPreview && (
          <div className="pointer-events-none absolute inset-x-0 z-20" style={{ top: 284 }} aria-label={`Ropet 正在试戴${selectedEye.name}并眨眼`}>
            <span className="eye-preview-blink absolute -top-[7px] left-[116px] h-[60px] w-[60px] rounded-[50%]" />
            <span className="eye-preview-blink eye-preview-blink-right absolute -top-[7px] right-[116px] h-[60px] w-[60px] rounded-[50%]" />
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
          {!isMallPreview && !isEyeshadowPreview && (
          <div className="relative h-16 border-b border-[#19181f0d]">
            <button
              type="button"
              aria-pressed={activeEyeTheme === 'MY'}
              onClick={() => {
                if (activeEyeTheme === 'MY') {
                  setActiveEyeTheme('水果硬糖');
                  if (nativeEyes[0]) setSelectedEyeId(nativeEyes[0].id);
                  return;
                }
                setActiveEyeTheme('MY');
                const firstOwnedEye = myCollectionTab === 'pure'
                  ? ownedMallEyes[0]
                  : [...nativeEyes.filter((eye) => !eye.locked), ...ownedMallEyes][0];
                if (firstOwnedEye) setSelectedEyeId(firstOwnedEye.id);
              }}
              className={`absolute left-5 top-[18px] flex h-7 items-center justify-center rounded-full border px-2 text-[10px] font-bold transition-colors focus:outline-none ${activeEyeTheme === 'MY' ? 'border-[#19181f] bg-[#19181f] text-white' : 'border-[#b9b5bf] text-[#9c98a3]'}`}
            >
              MY
            </button>
            <div className="absolute bottom-0 left-[62px] right-0 top-0 flex items-center gap-5 overflow-x-auto pr-4 scrollbar-hide">
              {activeEyeTheme === 'MY' ? (
                <>
                  <div className="flex h-9 shrink-0 items-center rounded-full bg-[#f2eff5] p-1">
                  {([
                    { id: 'all', label: '全部' },
                    { id: 'pure', label: '商城' },
                  ] as const).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      aria-pressed={myCollectionTab === tab.id}
                      onClick={() => {
                        setMyCollectionTab(tab.id);
                        const firstEye = tab.id === 'pure'
                          ? ownedMallEyes[0]
                          : [...nativeEyes.filter((eye) => !eye.locked), ...ownedMallEyes][0];
                        if (firstEye) setSelectedEyeId(firstEye.id);
                      }}
                      className={`h-7 rounded-full px-4 text-[12px] font-bold transition-colors ${myCollectionTab === tab.id ? 'bg-white text-[#19181f] shadow-sm' : 'text-[#aaa4af]'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                  </div>
                  {myCollectionTab === 'pure' && (
                    <button
                      type="button"
                      onClick={() => setDemoEmptyPure((current) => !current)}
                      className={`flex h-8 shrink-0 items-center rounded-full border px-3 text-[10px] font-bold transition-colors ${demoEmptyPure ? 'border-[#8d66ef] bg-[#f1ecff] text-[#7655cf]' : 'border-dashed border-[#c8c2ce] text-[#8e8793]'}`}
                    >
                      {demoEmptyPure ? <RotateCcw size={12} className="mr-1" /> : <EyeOff size={12} className="mr-1" />}
                      {demoEmptyPure ? '恢复商品' : '演示空态'}
                    </button>
                  )}
                </>
              ) : eyeThemes.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => {
                    setActiveEyeTheme(theme);
                    const firstEye = theme === '商城精选' ? mallEyeOptions[0] : nativeEyes[0];
                    if (firstEye) setSelectedEyeId(firstEye.id);
                  }}
                  className={`relative h-full shrink-0 whitespace-nowrap text-[15px] focus:outline-none ${activeEyeTheme === theme ? 'font-bold text-[#19181f]' : 'font-medium text-[#aaa4af]'}`}
                >
                  {theme}
                  {activeEyeTheme === theme && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#19181f]" />}
                </button>
              ))}
            </div>
          </div>
          )}

          <div className="overflow-y-auto scrollbar-hide px-4 pt-4 pb-10" style={{ height: isMallPreview || isEyeshadowPreview ? 443 : 379 }}>
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
                      {eye.eyelidStyle ? (
                        <>
                          <img src={eye.previewImg} alt={eye.name} className="absolute inset-0 h-full w-full scale-[1.34] object-contain object-center" />
                          <span className={`absolute left-[27px] top-[39px] h-[17px] w-[18px] rounded-full border-t-[4px] ${eye.eyelidStyle === 'gentle' ? '-rotate-[8deg] border-[#b47b83] bg-[#f3dfe2]' : eye.eyelidStyle === 'sleepy' ? 'rotate-[3deg] border-t-[6px] border-[#6f6670] bg-[#ddd9e0]' : 'border-[#8f7e79] bg-[#e8ddd8]'}`} />
                          <span className={`absolute right-[27px] top-[39px] h-[17px] w-[18px] rounded-full border-t-[4px] ${eye.eyelidStyle === 'gentle' ? 'rotate-[8deg] border-[#b47b83] bg-[#f3dfe2]' : eye.eyelidStyle === 'sleepy' ? '-rotate-[3deg] border-t-[6px] border-[#6f6670] bg-[#ddd9e0]' : 'border-[#8f7e79] bg-[#e8ddd8]'}`} />
                        </>
                      ) : (
                        <img src={eye.previewImg} alt={eye.name} className="absolute inset-0 h-full w-full object-cover" />
                      )}
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
                  {(eye.previewType === 'eyeshadow' ? appliedEyeshadowId : appliedEyeId) === eye.id && (
                    <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#8d66ef] text-white shadow-md">
                      <Check size={15} strokeWidth={3} />
                    </span>
                  )}
                  {eye.locked && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-[18px] bg-[#3f3f45]/25 text-white">
                      <LockKeyhole size={31} fill="white" className="drop-shadow-[0_4px_7px_rgba(0,0,0,0.38)]" />
                    </span>
                  )}
                  {eye.locked && eye.productId && (
                    <span className="absolute bottom-2 left-1/2 z-20 flex h-6 -translate-x-1/2 items-center rounded-full bg-[#27212c]/88 px-2.5 text-[10px] font-black text-white shadow-md backdrop-blur-sm">
                      ★ {getEyePointPrice(eye).toLocaleString()}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {displayedEyes.length === 0 && (
              <div className="flex h-[230px] flex-col items-center justify-center text-[#9a92a0]">
                <Sparkles size={25} strokeWidth={1.8} />
                <p className="mt-3 text-[15px] font-bold text-[#5f5963]">空空如也</p>
                <p className="mt-1 text-[11px] text-[#aaa4af]">还没有商城美瞳</p>
              </div>
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
          <div className="absolute inset-0 z-[85] flex items-end bg-black/48" onClick={() => !isPurchasing && setOutfitCheckoutOpen(false)}>
            <div className="absolute left-1/2 top-[76px] z-10 -translate-x-1/2" onClick={(event) => event.stopPropagation()}>
              <PointsBalancePill
                points={points}
                onAdd={() => {
                  const productIds = selectedOutfitItems.map((item) => item.productId).filter(Boolean).join(',');
                  const returnPath = isMallPreview
                    ? `/eye-change?source=mall&product=${mallProductId ?? ''}&outfit=${productIds}&returnTo=${encodeURIComponent(mallReturnTo)}`
                    : `/eye-change?outfit=${productIds}`;
                  navigate(`/points-store?returnTo=${encodeURIComponent(returnPath)}`);
                }}
                className="max-w-[176px]"
              />
            </div>
            <section className="w-full rounded-t-[28px] bg-white px-5 pb-8 pt-5 shadow-[0_-18px_45px_rgba(32,25,38,0.18)]" onClick={(event) => event.stopPropagation()}>
              <div className="mx-auto h-1 w-10 rounded-full bg-[#ddd8e1]" />
              <h2 className="mt-5 text-[21px] font-black text-[#29252d]">兑换当前搭配</h2>
              <p className="mt-1 text-[12px] text-[#918a96]">仅计算尚未拥有的装扮</p>

              <div className="mt-5 divide-y divide-[#eeeaf1] border-y border-[#eeeaf1]">
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
                    className={`flex h-[70px] w-full items-center gap-2 text-left transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8d66ef] ${selected ? 'opacity-100' : 'opacity-45'}`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border-2 transition-colors ${selected ? 'border-[#7c5ae0] bg-[#7c5ae0] text-white' : 'border-[#cfc9d4] bg-white text-transparent'}`}>
                      <Check size={13} strokeWidth={3.2} />
                    </span>
                    <span className="h-12 w-12 shrink-0 overflow-hidden rounded-[10px] bg-[#f4f1f6]">
                      {item.previewType === 'eyeshadow' ? (
                        <img src={item.previewImg} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="block h-full w-full bg-white bg-no-repeat" style={{ backgroundImage: `url('${item.previewImg}')`, backgroundPosition: item.spritePosition, backgroundSize: '300% 300%' }} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-[14px] text-[#312c35]">{item.name}</strong>
                      <span className="mt-1 block text-[11px] text-[#9a929f]">{item.source === 'lottery' ? '抽奖款 · 积分直接兑换' : `${item.previewType === 'eyeshadow' ? '眼影' : '美瞳'} · 永久拥有`}</span>
                    </span>
                    <strong className="flex items-center text-[14px] text-[#6d50c7]"><span className="mr-1 text-[#ffc52e]">★</span>{getEyePointPrice(item).toLocaleString()}</strong>
                  </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-end justify-between">
                <span className="text-[12px] text-[#8f8894]">已选 {checkoutSelectedItems.length} 件 · 当前积分 {points.toLocaleString()}</span>
                <span className="text-right">
                  <span className="block text-[10px] text-[#9a929f]">合计</span>
                  <strong className="text-[22px] font-black text-[#6d50c7]">★ {checkoutPointTotal.toLocaleString()}</strong>
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-[12px] bg-[#f2eff5] px-3 py-2">
                <span className="text-[10px] font-bold text-[#98919d]">原型结果</span>
                <div className="flex rounded-full bg-[#e7e2eb] p-0.5">
                  <button type="button" onClick={() => setDemoFulfillmentOutcome('success')} className={`h-7 rounded-full px-3 text-[10px] font-bold ${demoFulfillmentOutcome === 'success' ? 'bg-white text-[#6650b5] shadow-sm' : 'text-[#9a939f]'}`}>成功</button>
                  <button type="button" onClick={() => setDemoFulfillmentOutcome('failure')} className={`h-7 rounded-full px-3 text-[10px] font-bold ${demoFulfillmentOutcome === 'failure' ? 'bg-white text-[#d85c72] shadow-sm' : 'text-[#9a939f]'}`}>失败退款</button>
                </div>
              </div>

              {unownedOutfitItems.some((item) => item.source === 'lottery') && (
                <button type="button" onClick={() => navigate('/lucky-draw-2')} className="mt-3 flex h-11 w-full items-center justify-center rounded-[14px] border border-[#dcd3f3] bg-white text-[14px] font-bold text-[#7656ce]">
                  <Sparkles size={17} className="mr-2" />
                  去抽奖
                </button>
              )}
              <button type="button" onClick={confirmOutfitRedemption} disabled={isPurchasing || checkoutSelectedItems.length === 0} className="mt-5 flex h-12 w-full items-center justify-center rounded-[15px] bg-[#7c5ae0] text-[15px] font-bold text-white disabled:bg-[#bbb5c4] disabled:opacity-70">
                <Coins size={18} className="mr-2" />
                {checkoutSelectedItems.length === 0
                  ? '请选择要兑换的装扮'
                  : points >= checkoutPointTotal
                    ? `确认兑换 ${checkoutSelectedItems.length} 件`
                    : `积分不足 · 还差 ${(checkoutPointTotal - points).toLocaleString()}`}
              </button>
              <button type="button" onClick={() => setOutfitCheckoutOpen(false)} disabled={isPurchasing} className="mt-2 h-10 w-full text-[13px] font-semibold text-[#928b99] disabled:opacity-50">继续搭配</button>
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
          <div className="absolute inset-x-0 bottom-0 top-[116px] z-30 overflow-y-auto bg-white px-4 pb-10 pt-1 scrollbar-hide">
            <div className="space-y-[14px]">
              {displayedVoices.map((voice) => {
                const selected = selectedVoiceId === voice.id;
                const playing = playingVoiceId === voice.id;
                return (
                  <button
                    key={voice.id}
                    type="button"
                    onClick={() => voice.locked && voice.productId ? setUnlockTarget({ kind: 'voice', item: voice, price: voice.price }) : setSelectedVoiceId(voice.id)}
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
                      aria-label={voice.locked ? `获取${voice.name}` : playing ? `暂停${voice.name}` : `试听${voice.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (voice.locked && voice.productId) {
                          setUnlockTarget({ kind: 'voice', item: voice, price: voice.price });
                          return;
                        }
                        setPlayingVoiceId(playing ? null : voice.id);
                      }}
                      className="absolute bottom-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-[18px] bg-white text-[#19181f] shadow-[0_7px_18px_rgba(50,43,62,0.08)]"
                    >
                      {voice.locked ? <LockKeyhole size={22} /> : playing ? <Pause size={23} fill="currentColor" /> : <Play size={23} fill="currentColor" />}
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
