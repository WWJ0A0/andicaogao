import React, { useEffect, useState } from 'react';
import {
  BookHeart,
  Frame,
  Pause,
  Play,
  ReceiptText,
  Sparkles,
  Star,
  Volume2,
  X,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDialogueStore } from '@/store/useDialogueStore';
import BottomNav from '@/components/BottomNav';

const OpenEyesIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
    <circle cx="9" cy="14" r="7" fill="white" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="19" cy="14" r="7" fill="white" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="10.5" cy="14" r="2.8" fill="currentColor" />
    <circle cx="17.5" cy="14" r="2.8" fill="currentColor" />
  </svg>
);

const ClosedEyelidsIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
    <circle cx="9" cy="14" r="7" stroke="currentColor" strokeWidth="2" opacity="0.7" />
    <circle cx="19" cy="14" r="7" stroke="currentColor" strokeWidth="2" opacity="0.7" />
    <path d="M4.5 14.5C7.2 11.7 10.8 11.7 13.5 14.5M14.5 14.5C17.2 11.7 20.8 11.7 23.5 14.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const categories = [
  { id: 'featured', label: '推荐', icon: Sparkles },
  { id: 'eyes', label: '美瞳', icon: OpenEyesIcon },
  { id: 'eyelids', label: '眼影', icon: ClosedEyelidsIcon },
  { id: 'voice', label: '声音', icon: Volume2 },
  { id: 'frames', label: '画框', icon: Frame },
] as const;

const styleCategories = categories.filter(({ id }) => id !== 'featured');

type MallProduct = {
  id: string;
  category: 'eyes' | 'eyelids' | 'voice' | 'frames' | 'themes' | 'diaries';
  kind: 'eye' | 'voice' | 'frame' | 'theme' | 'diary';
  name: string;
  price: number;
  recommended?: boolean;
  discount?: number;
  discountLabel?: string;
  material: 'aiPaper' | 'renameCard';
  materialName: 'AI 画纸' | '改名卡';
  materialCost: number;
  tone: string;
  accent: string;
  eyeSpritePosition?: string;
  voiceDescription?: string;
  voiceImagePosition?: string;
};

const products: MallProduct[] = [
  { id: 'galaxy-eyes', category: 'eyes', kind: 'eye', name: '紫曜星河', price: 4000, recommended: true, discount: 0.7, discountLabel: '7折', material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#d9c8ff] via-[#f5efff] to-white', accent: '#6d41d8', eyeSpritePosition: '0% 0%' },
  { id: 'caramel-eyes', category: 'eyes', kind: 'eye', name: '熔岩落日', price: 5200, recommended: true, discount: 0.8, discountLabel: '8折', material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#ffd0ad] via-[#fff0d8] to-white', accent: '#d4512f', eyeSpritePosition: '50% 0%' },
  { id: 'obsidian-eyes', category: 'eyes', kind: 'eye', name: '黑曜夜幕', price: 4800, recommended: true, discount: 0.8, discountLabel: '8折', material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#c6c1c9] via-[#eeebf0] to-white', accent: '#383238', eyeSpritePosition: '100% 0%' },
  { id: 'forest-eyes', category: 'eyes', kind: 'eye', name: '圣诞森语', price: 5600, recommended: true, discount: 0.75, discountLabel: '限时75折', material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#bcd7a8] via-[#edf5d8] to-white', accent: '#3f8248', eyeSpritePosition: '0% 50%' },
  { id: 'rainbow-pixel-eyes', category: 'eyes', kind: 'eye', name: '像素彩虹', price: 6200, recommended: true, discount: 0.8, discountLabel: '8折', material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#ffe1b9] via-[#f1e2ff] to-white', accent: '#8c62e8', eyeSpritePosition: '50% 50%' },
  { id: 'reindeer-eyes', category: 'eyes', kind: 'eye', name: '金夜驯鹿', price: 6800, recommended: true, discount: 0.8, discountLabel: '8折', material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#d6b98c] via-[#fff0d6] to-white', accent: '#80633b', eyeSpritePosition: '100% 50%' },
  { id: 'moon-pixel-eyes', category: 'eyes', kind: 'eye', name: '月光像素', price: 5800, recommended: true, discount: 0.8, discountLabel: '8折', material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#cdd7ff] via-[#efeaff] to-white', accent: '#827be6', eyeSpritePosition: '0% 100%' },
  { id: 'sunset-pixel-eyes', category: 'eyes', kind: 'eye', name: '霓虹像素', price: 6400, recommended: true, discount: 0.75, discountLabel: '限时75折', material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#e2b8ff] via-[#ffe2da] to-white', accent: '#ad3eca', eyeSpritePosition: '50% 100%' },
  { id: 'mint-eyes', category: 'eyes', kind: 'eye', name: '碧海像素', price: 6000, recommended: true, discount: 0.8, discountLabel: '8折', material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#b8e9dd] via-[#eafff8] to-white', accent: '#28a7b8', eyeSpritePosition: '100% 100%' },
  { id: 'vitality-eyelids', category: 'eyelids', kind: 'eye', name: '元气眼影', price: 48000, material: 'renameCard', materialName: '改名卡', materialCost: 10, tone: 'from-[#ffd1df] via-[#fff0f4] to-white', accent: '#ff7ca6' },
  { id: 'cavy-talk', category: 'voice', kind: 'voice', name: 'Cavy Talk', price: 36000, material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#f4f3f5] via-white to-white', accent: '#8b66ef', voiceDescription: 'Uwei~uwei~ How do guinea pigs sound?\nRopet learned this cute little language after one listen.', voiceImagePosition: '-245px -314px' },
  { id: 'little-lamb', category: 'voice', kind: 'voice', name: 'Little Lamb', price: 42000, material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#f4f3f5] via-white to-white', accent: '#8b66ef', voiceDescription: 'I am a lamb, baa baa, do you like my beautiful singing?', voiceImagePosition: '-249px -474px' },
  { id: 'starlight-frame', category: 'frames', kind: 'frame', name: '新年封面', price: 52000, material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#ffe5f0] via-[#fff4f8] to-white', accent: '#f47eb5' },
  { id: 'grape-theme', category: 'themes', kind: 'theme', name: '葡萄汽水主题', price: 68000, material: 'renameCard', materialName: '改名卡', materialCost: 10, tone: 'from-[#cbb8ff] via-[#eee8ff] to-white', accent: '#815ee5' },
  { id: 'cloud-diary', category: 'diaries', kind: 'diary', name: '云朵日记皮肤', price: 42000, material: 'aiPaper', materialName: 'AI 画纸', materialCost: 20, tone: 'from-[#bfe9ff] via-[#effaff] to-white', accent: '#55b8e9' },
];

const MallStore: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { points, luckyDrawSrTotal, luckyDrawSrCollected, consumableInventory, redeemedMallItems, exchangeMallItem, spendPoints } = useDialogueStore();
  const remainingSrRewards = Math.max(0, luckyDrawSrTotal - luckyDrawSrCollected);
  const initialShop = searchParams.get('shop');
  const initialCategory = styleCategories.some(({ id }) => id === initialShop)
    ? initialShop as (typeof categories)[number]['id']
    : 'featured';
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]['id']>(initialCategory);
  const [toast, setToast] = useState('');
  const [confirmingProduct, setConfirmingProduct] = useState<MallProduct | null>(null);
  const [buyingProduct, setBuyingProduct] = useState<MallProduct | null>(null);
  const [purchasedProduct, setPurchasedProduct] = useState<MallProduct | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const visibleProducts = activeCategory === 'featured'
    ? products.filter((item) => item.recommended)
    : products.filter((item) => item.category === activeCategory);

  useEffect(() => {
    const productId = searchParams.get('buy');
    if (!productId) return;
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    if (product.kind === 'eye') {
      const returnTo = `/interaction-history?shop=${product.category === 'eyelids' ? 'eyelids' : 'eyes'}`;
      navigate(`/eye-change?source=mall&product=${product.id}&returnTo=${encodeURIComponent(returnTo)}&redeem=1`, { replace: true });
      return;
    }
    setBuyingProduct(product);
  }, [navigate, searchParams]);

  useEffect(() => {
    const productId = searchParams.get('purchased');
    if (!productId) return;
    const product = products.find((item) => item.id === productId);
    if (product) setPurchasedProduct(product);
  }, [searchParams]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 1600);
  };

  const getMaterialCount = (material: 'aiPaper' | 'renameCard') => (
    consumableInventory?.[material] ?? 999
  );

  const confirmExchange = () => {
    if (!confirmingProduct) return;
    const succeeded = exchangeMallItem(
      confirmingProduct.id,
      confirmingProduct.material,
      confirmingProduct.materialCost,
    );
    if (!succeeded) {
      setConfirmingProduct(null);
      showToast(`${confirmingProduct.materialName}数量不足`);
      return;
    }
    const itemName = confirmingProduct.name;
    setConfirmingProduct(null);
    showToast(`${itemName}已兑换并放入小窝`);
  };

  const getPointPrice = (item: MallProduct) => (
    item.discount ? Math.round(item.price * item.discount) : item.price
  );

  const confirmPointPurchase = () => {
    if (!buyingProduct) return;
    const pointPrice = getPointPrice(buyingProduct);
    if (!spendPoints(`兑换${buyingProduct.name}`, 'exchange', pointPrice)) {
      setBuyingProduct(null);
      showToast('积分不足，请先获取更多积分');
      return;
    }
    const purchasedItem = buyingProduct;
    exchangeMallItem(buyingProduct.id, 'aiPaper', 0);
    setBuyingProduct(null);
    setSearchParams({ shop: activeCategory });
    setPurchasedProduct(purchasedItem);
  };

  const openProduct = (item: MallProduct) => {
    if (item.kind === 'eye') {
      const returnTo = `/interaction-history?shop=${activeCategory}`;
      navigate(`/eye-change?source=mall&product=${item.id}&returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    setBuyingProduct(item);
  };

  return (
    <div className="relative flex min-h-screen w-full justify-center overflow-hidden bg-[#d8deea] py-4">
      <div className="relative h-[852px] w-[393px] overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-b from-[#ead8ff] via-[#ffe9f3] to-[#fff8df] shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        <div
          className="pointer-events-none absolute -left-[58px] -top-[28px] h-[865px] w-[504px] bg-cover bg-center opacity-55"
          style={{ backgroundImage: 'url(/images/mo1d92xj-hha9qft.svg)' }}
        />

        {activeCategory !== 'featured' && <header className="absolute inset-x-0 top-0 z-30 px-5 pt-3">
          <div className="flex h-[36px] items-center justify-between rounded-[12px] bg-[#f7f1ff]/72 px-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center text-[18px] font-black text-[#2f2a34]">
                <Star size={17} className="mr-1 text-[#ffc52e]" fill="#ffc52e" />{points.toLocaleString()}
              </span>
              <button type="button" aria-label="获取更多积分" onClick={() => navigate('/points-store?returnTo=/interaction-history')} className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d9cdef] bg-[#eee8f8] text-[14px] font-bold leading-none text-[#7656c9]">+</button>
            </div>
            <button type="button" aria-label="查看积分明细" onClick={() => navigate('/points-orders')} className="flex h-8 items-center gap-1 px-1 text-[10px] font-bold text-[#625b68]">
              <ReceiptText size={15} />明细
            </button>
          </div>

        </header>}

        <main className={`absolute bottom-[86px] left-0 right-0 overflow-y-auto pb-10 scrollbar-hide ${activeCategory === 'featured' ? 'top-0 px-0' : 'top-[52px] px-5'}`}>
          {activeCategory === 'featured' && (
            <>
              <button
                type="button"
                aria-label="进入常驻抽奖活动"
                onClick={() => navigate('/lucky-draw-2')}
                className="relative block h-[196px] w-full overflow-hidden rounded-b-[24px] bg-[#f6ecff] text-left shadow-[0_9px_24px_rgba(95,69,130,0.13)] transition-transform duration-150 active:scale-[0.99]"
              >
                <img src="/images/mall-lucky-hero-v2.png" alt="高冷君站在装有奖品的幸运抽奖机旁" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute inset-y-0 left-0 w-[32%] bg-gradient-to-r from-[#fffaf2]/82 to-transparent" />
                <span className="absolute left-5 top-6 text-[22px] font-black text-[#29222f] [text-shadow:0_1px_0_white]">幸运抽奖机</span>
                <span className="absolute left-5 top-[60px] rounded-[9px] bg-white/70 px-3 py-1.5 text-[11px] font-black text-[#5f4a6d] backdrop-blur-sm">
                  {remainingSrRewards === 0 ? '全收集' : `剩余 ${remainingSrRewards} 个 SR`}
                </span>
                <span className="absolute bottom-5 left-5 rounded-full border border-[#e4b83b] bg-[#ffd85f] px-5 py-2.5 text-[10px] font-black tracking-[0.8px] text-[#4b3821] shadow-[0_6px_12px_rgba(183,132,26,0.20),inset_0_1px_0_rgba(255,255,255,0.75)]">ITEM DRAW</span>
                <span className="mall-new-badge absolute left-[148px] top-6 overflow-hidden rounded-full bg-[#ff5c7f] px-2.5 py-1 text-[9px] font-black tracking-[1px] text-white">NEW</span>
              </button>

              <header className="px-5 pt-3">
                <div className="flex h-[36px] items-center justify-between rounded-[12px] bg-[#f7f1ff]/72 px-3">
                  <div className="flex items-center gap-2">
                  <span className="flex items-center text-[11px] font-semibold text-[#7c7481]">
                    <span className="flex items-center text-[18px] font-black text-[#2f2a34]">
                      <Star size={17} className="mr-1 text-[#ffc52e]" fill="#ffc52e" />{points.toLocaleString()}
                    </span>
                  </span>
                  <button type="button" aria-label="获取更多积分" onClick={() => navigate('/points-store?returnTo=/interaction-history')} className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d9cdef] bg-[#eee8f8] text-[14px] font-bold leading-none text-[#7656c9]">
                    +
                  </button>
                  </div>
                  <button type="button" aria-label="查看积分明细" onClick={() => navigate('/points-orders')} className="flex h-8 items-center gap-1 px-1 text-[10px] font-bold text-[#625b68]">
                    <ReceiptText size={15} />明细
                  </button>
                </div>
              </header>
            </>
          )}

          <nav aria-label="商城一级入口" className={`relative flex h-[52px] items-center border-b border-[#e5dfea] ${activeCategory === 'featured' ? 'mx-5 mt-1' : ''}`}>
            <button type="button" onClick={() => { setActiveCategory('featured'); setSearchParams({ shop: 'featured' }); }} className={`relative flex h-[52px] flex-1 items-center justify-center text-[15px] font-bold transition-colors ${activeCategory === 'featured' ? 'text-[#332e38]' : 'text-[#aaa2b0]'}`}>
              今日推荐
              {activeCategory === 'featured' && <span className="absolute bottom-0 h-[3px] w-10 rounded-full bg-[#8062df]" />}
            </button>
            <button type="button" onClick={() => { const next = activeCategory === 'featured' ? 'eyes' : activeCategory; setActiveCategory(next); setSearchParams({ shop: next }); }} className={`relative flex h-[52px] flex-1 items-center justify-center text-[15px] font-bold transition-colors ${activeCategory !== 'featured' ? 'text-[#332e38]' : 'text-[#aaa2b0]'}`}>
              装扮派派
              {activeCategory !== 'featured' && <span className="absolute bottom-0 h-[3px] w-10 rounded-full bg-[#8062df]" />}
            </button>
          </nav>

          <div className={activeCategory === 'featured' ? 'relative mt-3 px-5 pb-10' : 'relative mt-2 bg-white/16 px-1 pb-10 pt-2'}>
          {activeCategory === 'featured' && (
            <>
              <section aria-label="限时活动" className="mt-1">
              <button
                type="button"
                aria-label="进入Ropet毛绒套设计征集H5"
                onClick={() => navigate('/plush-design')}
                className="relative flex h-[52px] w-full items-center overflow-hidden rounded-[13px] border border-[#e3d8f4] bg-white/72 px-4 text-left shadow-[0_5px_14px_rgba(98,70,132,0.07)] transition-transform active:-translate-y-0.5"
              >
                <span className="absolute inset-y-0 left-0 w-[4px] bg-[#ef5d78]" />
                <span className="absolute right-0 top-0 h-full w-[48px] bg-[#f3edff]" />
                <span className="relative z-10 ml-1 min-w-0 pr-12">
                  <span className="inline-block rounded-[3px] bg-[#ffe568] px-2 py-0.5 text-[7px] font-black tracking-[1px] text-[#55421b]">LIMITED MISSION</span>
                  <strong className="mt-1 block truncate text-[12px] font-black text-[#3b3441]">把你的脑洞，做成真的 Ropet</strong>
                </span>
                <span className="absolute right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#8462df] text-[17px] font-black text-white">→</span>
              </button>
              </section>

              <section className="mt-8" aria-label="限时收藏">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black tracking-[2px] text-[#d65d7a]">LIMITED COLLECTION</span>
                    <h2 className="mt-0.5 text-[21px] font-black text-[#2d2931]">限时收藏</h2>
                  </div>
                  <span className="rounded-full bg-[#fff0f4] px-3 py-1 text-[10px] font-bold text-[#d25c79]">剩余 3 天</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6">
                  {visibleProducts.slice(0, 6).map((item, index) => {
                    const owned = (redeemedMallItems?.[item.id] ?? 0) > 0;
                    const status = owned ? '✓ 已拥有' : index === 0 ? 'SR' : index === 1 ? '限定' : index === 2 ? 'NEW' : item.discountLabel ?? '限时';
                    return (
                      <button key={item.id} type="button" onClick={() => openProduct(item)} className="group relative min-w-0 pb-1 text-left transition-transform duration-150 active:-translate-y-1 active:scale-[1.03]">
                        <span className={`absolute left-1 top-0 z-20 rounded-[5px] px-1.5 py-0.5 text-[8px] font-black text-white shadow-sm ${owned ? 'bg-[#6eaa83]' : index === 0 ? 'bg-[#8b66ef]' : index === 1 ? 'bg-[#e65d7e]' : 'bg-[#514a54]'}`}>{status}</span>
                        <span className="relative flex h-[112px] items-end justify-center overflow-hidden rounded-[18px] bg-gradient-to-b from-white/70 to-[#efe5ff]/45">
                          <span className="absolute bottom-2 h-[20px] w-[108px] rounded-[50%] bg-[#d8d0df] shadow-[inset_0_5px_7px_rgba(255,255,255,0.8),0_7px_8px_rgba(66,51,77,0.15)]" />
                          <span className="mall-product-ropet relative z-10 mb-3 h-[100px] w-[126px] bg-contain bg-center bg-no-repeat transition-transform duration-150 group-active:-translate-y-1" style={{ backgroundImage: "url('/images/moiedap1-khtkfqv.png')" }}>
                            <span className="absolute left-[39px] top-[40px] h-[23px] w-[23px] rounded-full bg-no-repeat mix-blend-multiply" style={{ backgroundImage: "url('/images/mall-eye-collection.png')", backgroundPosition: item.eyeSpritePosition, backgroundSize: '300% auto' }} />
                            <span className="absolute right-[39px] top-[40px] h-[23px] w-[23px] rounded-full bg-no-repeat mix-blend-multiply" style={{ backgroundImage: "url('/images/mall-eye-collection.png')", backgroundPosition: item.eyeSpritePosition, backgroundSize: '300% auto' }} />
                          </span>
                        </span>
                        <strong className="block truncate px-1 text-[10px] font-black text-[#37313b]">{item.name}</strong>
                        <span className={`mt-1 flex h-7 items-center rounded-[7px] px-2 text-[10px] font-black ${owned ? 'bg-[#e8f3eb] text-[#4f8b65]' : 'bg-[#f1ebf8] text-[#6f50c2]'}`}>
                          {owned ? '已拥有' : <><Star size={12} className="mr-1 text-[#ffc52e]" fill="#ffc52e" />{getPointPrice(item).toLocaleString()}</>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {activeCategory !== 'featured' && (
            <nav aria-label="装扮派派分类" className="relative mt-1 grid grid-cols-4 gap-1.5 rounded-[16px] bg-white/42 p-2 scrollbar-hide">
              {styleCategories.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-label={label}
                  title={label}
                  onClick={() => { setActiveCategory(id); setSearchParams({ shop: id }); }}
                  className={`relative flex h-[42px] min-w-0 items-center justify-center gap-1 rounded-[12px] transition-all active:translate-y-0.5 ${activeCategory === id ? 'border-2 border-[#8664df] bg-white/62 text-[#3d3645] shadow-[0_3px_8px_rgba(91,61,162,0.10)]' : 'border border-[#e2d9ee] bg-white/42 text-[#746b7d]'}`}
                >
                  <Icon size={16} className="relative z-10 shrink-0" />
                  <span className="relative z-10 truncate text-[10px] font-bold">{label}</span>
                </button>
              ))}
            </nav>
          )}

          {activeCategory === 'voice' ? (
            <section className="relative mt-4 grid grid-cols-2 gap-x-3 gap-y-6" aria-label="声音商品列表">
              {visibleProducts.map((item) => {
                const playing = playingVoiceId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openProduct(item)}
                    className="group relative min-w-0 pb-1 text-left transition-transform duration-150 active:-translate-y-1 active:scale-[1.02]"
                  >
                    <span className="relative flex h-[110px] items-center justify-center overflow-hidden rounded-t-[16px] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(244,237,249,0.55))]">
                      <span className="absolute bottom-2 h-[21px] w-[108px] rounded-[50%] bg-[#d9cce8] shadow-[inset_0_5px_7px_rgba(255,255,255,0.88),0_6px_7px_rgba(73,45,90,0.16)]" />
                      <span
                        className="absolute bottom-0 right-[-8px] h-[112px] w-[132px] bg-no-repeat transition-transform duration-150 group-active:-translate-y-1"
                        style={{
                          backgroundImage: "url('/images/voice-change-reference.png')",
                          backgroundSize: '393px 858px',
                          backgroundPosition: item.voiceImagePosition,
                        }}
                      />
                      <span
                        role="button"
                        aria-label={playing ? `暂停${item.name}` : `试听${item.name}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setPlayingVoiceId(playing ? null : item.id);
                        }}
                        className="absolute bottom-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/95 text-[#19181f] shadow-[0_6px_14px_rgba(50,43,62,0.14)]"
                      >
                        {playing ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}
                      </span>
                    </span>
                    <span className="mt-1.5 block rounded-[7px] bg-[#f3edfb] px-2 py-1.5">
                      <strong className="block truncate text-[11px] text-[#3c3542]">{item.name}</strong>
                      <span className="mt-1 flex items-center text-[12px] font-black text-[#7656d8]">
                        <Star size={15} className="mr-1 text-[#ffc52e]" fill="#ffc52e" />{item.price.toLocaleString()}
                      </span>
                    </span>
                  </button>
                );
              })}
            </section>
          ) : activeCategory !== 'featured' ? (
          <section className="relative mt-4 grid grid-cols-2 gap-x-3 gap-y-6" aria-label="商城商品列表">
            {visibleProducts.map((item) => {
              const owned = (redeemedMallItems?.[item.id] ?? 0) > 0;
              return (
              <button
                key={item.id}
                type="button"
                onClick={() => openProduct(item)}
                className="group relative min-w-0 pb-1 text-left transition-transform duration-150 active:-translate-y-1 active:scale-[1.03]"
              >
                {(owned || (item.discount && item.discountLabel)) && (
                  <span className={`absolute left-1 top-0 z-20 rounded-[5px] px-1.5 py-0.5 text-[8px] font-black text-white shadow-sm ${owned ? 'bg-[#6eaa83]' : 'bg-[#e65d7e]'}`}>
                    {owned ? '✓ 已拥有' : item.discountLabel}
                  </span>
                )}
                <span className="relative flex h-[112px] items-end justify-center overflow-hidden rounded-[18px] bg-gradient-to-b from-white/70 to-[#efe5ff]/45">
                  <span className="absolute left-1/2 top-2 h-[82px] w-[112px] -translate-x-1/2 rounded-[50%] bg-white/75 blur-[1px]" />
                  <span className="absolute bottom-2 h-[20px] w-[108px] rounded-[50%] bg-[#d8d0df] shadow-[inset_0_5px_7px_rgba(255,255,255,0.8),0_7px_8px_rgba(66,51,77,0.15)]" />
                  {item.kind === 'eye' && (
                    <span className="mall-product-ropet relative z-10 mb-1 h-[104px] w-[132px] shrink-0 bg-contain bg-center bg-no-repeat transition-transform group-active:-translate-y-1" style={{ backgroundImage: "url('/images/moiedap1-khtkfqv.png')" }}>
                      {item.eyeSpritePosition && (
                        <>
                          <span className="absolute left-[41px] top-[42px] h-[24px] w-[24px] rounded-full bg-no-repeat mix-blend-multiply" style={{ backgroundImage: "url('/images/mall-eye-collection.png')", backgroundPosition: item.eyeSpritePosition, backgroundSize: '300% auto' }} />
                          <span className="absolute right-[41px] top-[42px] h-[24px] w-[24px] rounded-full bg-no-repeat mix-blend-multiply" style={{ backgroundImage: "url('/images/mall-eye-collection.png')", backgroundPosition: item.eyeSpritePosition, backgroundSize: '300% auto' }} />
                        </>
                      )}
                      {!item.eyeSpritePosition && item.category === 'eyelids' && (
                        <>
                          <span className="absolute left-[39px] top-[40px] flex h-[25px] w-[27px] items-center justify-center rounded-full bg-[#f7f2ef] shadow-[0_1px_3px_rgba(96,67,79,0.12)]">
                            <span className="mt-1 h-[11px] w-[20px] rounded-[50%] border-t-[4px] border-[#ff83b0]" />
                          </span>
                          <span className="absolute right-[39px] top-[40px] flex h-[25px] w-[27px] items-center justify-center rounded-full bg-[#f7f2ef] shadow-[0_1px_3px_rgba(96,67,79,0.12)]">
                            <span className="mt-1 h-[11px] w-[20px] rounded-[50%] border-t-[4px] border-[#ff83b0]" />
                          </span>
                        </>
                      )}
                    </span>
                  )}
                  {item.kind === 'voice' && (
                    <span className="flex h-[66px] w-[82px] items-center justify-center rounded-[22px] bg-white shadow-[0_9px_15px_rgba(70,55,94,0.12)]">
                      <Volume2 size={37} style={{ color: item.accent }} />
                    </span>
                  )}
                  {item.kind === 'frame' && (
                    <span className="relative flex h-[92px] w-[86px] items-start justify-center rounded-[12px] border border-[#e8e5e8] bg-[#f7f6f7] pt-3 shadow-[0_7px_14px_rgba(70,55,94,0.08)]">
                      <span className="h-[64px] w-[52px] rounded-b-[27px] shadow-[0_5px_8px_rgba(244,126,181,0.22)]" style={{ backgroundColor: item.accent }} />
                    </span>
                  )}
                  {item.kind === 'theme' && (
                    <span className="relative h-[82px] w-[48px] rounded-[13px] border-[4px] border-white shadow-[0_9px_15px_rgba(70,55,94,0.16)]" style={{ backgroundColor: item.accent }}>
                      <span className="absolute left-1.5 right-1.5 top-3 h-3 rounded-full bg-white/80" />
                      <span className="absolute bottom-2 left-1.5 h-6 w-6 rounded-[7px] bg-white/65" />
                    </span>
                  )}
                  {item.kind === 'diary' && (
                    <span className="relative flex h-[78px] w-[64px] items-center justify-center rounded-r-[13px] border-l-[7px] border-white bg-white/85 shadow-[0_9px_15px_rgba(70,55,94,0.12)]">
                      <BookHeart size={30} style={{ color: item.accent }} />
                    </span>
                  )}
                </span>
                <strong className="mt-1.5 block truncate px-1 text-[10px] font-black text-[#37313b]">{item.name}</strong>
                <span className={`mt-1 flex h-7 items-center rounded-[7px] px-2 text-[10px] font-black ${owned ? 'bg-[#e8f3eb] text-[#4f8b65]' : 'bg-[#f1ebf8] text-[#6f50c2]'}`}>
                  {owned ? '已拥有' : (
                  item.discount ? (
                    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                      <span className="flex items-center text-[#7656d8]">
                        <Star size={15} className="mr-1 text-[#ffc52e]" fill="#ffc52e" />
                        {Math.round(item.price * item.discount).toLocaleString()}
                      </span>
                      <span className="text-[9px] font-semibold text-[#9f97a7] line-through">{item.price.toLocaleString()}</span>
                    </span>
                  ) : (
                    <><Star size={16} className="mr-1 text-[#ffc52e]" fill="#ffc52e" />{item.price.toLocaleString()}</>
                  )
                  )}
                </span>
              </button>
              );
            })}
          </section>
          ) : null}

          {activeCategory !== 'featured' && visibleProducts.length === 0 && (
            <div className="mt-5 rounded-[20px] bg-white/60 py-12 text-center text-[13px] font-semibold text-[#968da1]">该分类商品正在上新</div>
          )}
          </div>
        </main>

        {toast && (
          <div
            role="status"
            aria-live="polite"
            className="pointer-events-none absolute bottom-[190px] left-1/2 z-[90] w-max max-w-[320px] -translate-x-1/2 rounded-full border border-white/25 bg-[#29232f]/95 px-6 py-3.5 text-center text-[13px] font-bold text-white shadow-[0_12px_34px_rgba(24,18,31,0.38)] backdrop-blur-md"
          >
            {toast}
          </div>
        )}

        <BottomNav />

        {confirmingProduct && (
          <div className="absolute inset-0 z-[70] flex items-end bg-black/45" onClick={() => setConfirmingProduct(null)}>
            <section className="w-full rounded-t-[26px] bg-white px-5 pb-8 pt-5" onClick={(event) => event.stopPropagation()}>
              <h2 className="text-[19px] font-black text-[#2e2932]">确认兑换{confirmingProduct.name}？</h2>
              <p className="mt-2 text-[13px] leading-6 text-[#81798b]">
                将消耗 {confirmingProduct.materialCost} 张{confirmingProduct.materialName}，兑换后道具不可恢复。
              </p>
              <div className="mt-4 rounded-[15px] bg-[#f6f2ff] px-4 py-3 text-[13px] font-bold text-[#6f50c2]">
                当前拥有 {getMaterialCount(confirmingProduct.material)} 张
              </div>
              <button
                type="button"
                disabled={getMaterialCount(confirmingProduct.material) < confirmingProduct.materialCost}
                onClick={confirmExchange}
                className="mt-5 h-12 w-full rounded-[14px] bg-[#8b66ef] text-[14px] font-bold text-white disabled:bg-[#cbc5d6]"
              >
                {getMaterialCount(confirmingProduct.material) >= confirmingProduct.materialCost ? '确认兑换' : '道具数量不足'}
              </button>
              <button type="button" onClick={() => setConfirmingProduct(null)} className="mt-2 h-11 w-full text-[13px] font-semibold text-[#928b99]">取消</button>
            </section>
          </div>
        )}

        {buyingProduct && (
          <div className="absolute inset-0 z-[115] flex items-center justify-center bg-black/55 px-8" onClick={() => setBuyingProduct(null)}>
            <section className="w-full rounded-[20px] bg-white px-6 py-6 text-center shadow-[0_18px_42px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()}>
              <h2 className="text-[18px] font-semibold text-[#222127]">兑换{buyingProduct.name}</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#222127]">
                本次兑换需要 {getPointPrice(buyingProduct).toLocaleString()} 积分，
                <br />
                当前剩余积分 {points.toLocaleString()}。
              </p>
              <div className="mt-4 flex items-center justify-center gap-3 text-[#222127]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ffe49a] text-[13px]">★</span>
                <span className="text-[16px] font-semibold">{getPointPrice(buyingProduct).toLocaleString()}</span>
                <span className="text-[16px] font-semibold">=</span>
                <span className="flex items-center gap-2 rounded-[8px] border border-[#e9e5ef] bg-[#f7f7f8] p-1.5 pr-3 text-[14px] font-semibold">
                  {buyingProduct.kind === 'voice' ? (
                    <span role="img" aria-label={buyingProduct.name} className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#eee8ff] text-[#7656d8]">
                      <Volume2 size={23} strokeWidth={2.3} />
                    </span>
                  ) : buyingProduct.category === 'eyelids' ? (
                    <span role="img" aria-label={buyingProduct.name} className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#ffe8f1] text-[#e66e9f]">
                      <ClosedEyelidsIcon className="h-6 w-6" />
                    </span>
                  ) : (
                    <span
                      role="img"
                      aria-label={buyingProduct.name}
                      className="h-10 w-10 rounded-[7px] bg-white bg-no-repeat"
                      style={{
                        backgroundImage: "url('/images/mall-eye-collection.png')",
                        backgroundPosition: buyingProduct.eyeSpritePosition,
                        backgroundSize: '300% 300%',
                      }}
                    />
                  )}
                  × 1
                </span>
              </div>
              <p className="mt-3 text-[12px] text-[#8b8792]">
                兑换成功后将直接放入{buyingProduct.kind === 'voice' ? '我的声音' : buyingProduct.category === 'eyelids' ? '我的眼影' : buyingProduct.kind === 'eye' ? '我的美瞳' : '我的装扮'}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (points >= getPointPrice(buyingProduct)) {
                    confirmPointPurchase();
                    return;
                  }
                  const returnTo = `/interaction-history?shop=${activeCategory}&buy=${buyingProduct.id}`;
                  navigate(`/points-store?returnTo=${encodeURIComponent(returnTo)}`);
                }}
                className="mt-5 h-12 w-full rounded-[14px] bg-[#7c5ae0] text-[15px] font-semibold text-white"
              >
                {points >= getPointPrice(buyingProduct) ? '确定兑换' : '去购买积分'}
              </button>
              <button type="button" onClick={() => setBuyingProduct(null)} className="mt-3 h-11 w-full rounded-[14px] border border-[#e6e1ed] bg-white text-[14px] font-semibold text-[#4f4a55]">取消</button>
            </section>
          </div>
        )}

        {purchasedProduct && (
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
            <div className="absolute left-1/2 top-[355px] h-[330px] w-[330px] -translate-x-1/2 rounded-full bg-white/65 blur-[38px]" />

            <header className="relative z-10 flex h-[72px] items-center justify-between px-6 pt-2">
              <strong className="text-[16px]">9:41</strong>
              <button
                type="button"
                aria-label="关闭兑换成功页面"
                onClick={() => setPurchasedProduct(null)}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/90 text-white"
              >
                <X size={27} strokeWidth={1.8} />
              </button>
            </header>

            <main className="relative z-10 flex flex-col items-center px-6 pt-16">
              <h1 className="text-center text-[49px] font-black tracking-[-2px] text-white [text-shadow:0_7px_0_#17121a]">兑换成功</h1>
              <p className="mt-4 text-[12px] font-black tracking-[3px] text-[#855c16]">SUPER RARE ITEM</p>

              <section className="relative mt-12 h-[330px] w-[245px] rotate-3 rounded-[30px] bg-gradient-to-br from-[#ffc43f] via-[#ffac79] to-[#ff98d2] p-[10px] shadow-[0_24px_42px_rgba(135,82,11,0.30)]">
                <div className="relative h-[262px] overflow-hidden rounded-[23px] bg-white">
                  <span className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#ffc947] to-[#ff8c75] px-3 py-1 text-[11px] font-black text-white shadow-sm">◆ SR</span>
                  <span
                    role="img"
                    aria-label={purchasedProduct.name}
                    className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 bg-white bg-no-repeat"
                    style={{
                      backgroundImage: "url('/images/mall-eye-collection.png')",
                      backgroundPosition: purchasedProduct.eyeSpritePosition,
                      backgroundSize: '300% 300%',
                    }}
                  />
                </div>
                <strong className="flex h-[58px] items-center justify-center truncate px-3 text-[22px] font-black text-white">{purchasedProduct.name}</strong>
              </section>

              <button
                type="button"
                onClick={() => navigate('/eye-change')}
                className="mt-16 h-14 w-full max-w-[300px] rounded-full bg-black text-[18px] font-bold text-white shadow-[0_10px_20px_rgba(100,60,0,0.22)]"
              >
                去装扮
              </button>
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default MallStore;
