import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MallRedemptionStatus = 'processing' | 'success' | 'refunded';

export interface MallRedemptionOrder {
  id: string;
  itemId: string;
  title: string;
  cost: number;
  status: MallRedemptionStatus;
  retryCount: number;
  repeatable: boolean;
  inventoryEffect: 'battery' | 'renameCard' | 'aiPaper' | 'none';
  demoOutcome: 'success' | 'failure';
  createdAt: string;
  createdAtMs: number;
  updatedAtMs: number;
}

interface DialogueStore {
  points: number;
  luckyDrawSrTotal: number;
  luckyDrawSrCollected: number;
  dialogueCards: number;
  dialogueCardInventory: Record<string, number>;
  activeDialogueCard: {
    fills: number;
    activatedAt: string;
  } | null;
  placedVoiceBatteries: number;
  consumableInventory: {
    aiPaper: number;
    renameCard: number;
  };
  redeemedMallItems: Record<string, number>;
  equippedMallEyeId: string | null;
  equippedMallEyeshadowId: string | null;
  equippedMallVoiceId: string | null;
  mallRedemptionOrders: MallRedemptionOrder[];
  pointSpendRecords: {
    id: string;
    title: string;
    type: 'lottery' | 'exchange';
    points: number;
    createdAt: string;
  }[];
  pointIncomeRecords: {
    id: string;
    title: string;
    type: 'interaction' | 'activity';
    points: number;
    createdAt: string;
  }[];
  pointOrders: {
    id: string;
    orderNo: string;
    deviceName: string;
    points: number;
    amount: number;
    channel?: string;
    paidAt: string;
    status: 'creating' | 'unpaid' | 'failed' | 'cancelled' | 'paid' | 'processing' | 'timeout';
  }[];
  cardCost: number;
  exchangeCard: (count?: number) => boolean;
  exchangeDialogueCard: (days: number, cost: number, count?: number) => boolean;
  useCard: () => boolean;
  useDialogueCard: (days: number) => boolean;
  addVoiceBatteryToSlot: () => boolean;
  consumePlacedVoiceBattery: () => boolean;
  exchangeMallItem: (itemId: string, material: 'aiPaper' | 'renameCard', cost: number) => boolean;
  purchaseMallItem: (
    itemId: string,
    title: string,
    cost: number,
    options?: {
      repeatable?: boolean;
      inventoryEffect?: 'battery' | 'renameCard' | 'aiPaper' | 'none';
    },
  ) => 'success' | 'insufficient-points' | 'already-owned' | 'invalid';
  startMallRedemption: (
    itemId: string,
    title: string,
    cost: number,
    options?: {
      repeatable?: boolean;
      inventoryEffect?: 'battery' | 'renameCard' | 'aiPaper' | 'none';
      demoOutcome?: 'success' | 'failure';
    },
  ) => { result: 'processing' | 'insufficient-points' | 'already-owned' | 'already-processing' | 'invalid'; orderId?: string };
  markMallRedemptionRetry: (orderId: string, attempt: number) => void;
  completeMallRedemption: (orderId: string) => void;
  refundMallRedemption: (orderId: string) => void;
  equipMallItem: (itemId: string, kind: 'eye' | 'eyeshadow' | 'voice') => void;
  spendPoints: (title: string, type: 'lottery' | 'exchange', points: number) => boolean;
  clearActiveDialogueCard: () => void;
  resetMallState: () => void;
  resetMallRedemptions: () => void;
  addPoints: (amount: number) => void;
  purchasePoints: (points: number, amount: number, deviceName?: string, channel?: string) => void;
  recordPointOrder: (
    points: number,
    amount: number,
    deviceName?: string,
    channel?: string,
    status?: 'creating' | 'unpaid' | 'failed' | 'cancelled' | 'paid' | 'processing' | 'timeout',
  ) => void;
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const formatPaymentTime = (date: Date) => (
  `${formatDate(date)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
);

export const useDialogueStore = create<DialogueStore>()(
  persist(
    (set, get) => ({
      points: 1000,
      luckyDrawSrTotal: 30,
      luckyDrawSrCollected: 30,
      dialogueCards: 0,
      dialogueCardInventory: {},
      activeDialogueCard: null,
      placedVoiceBatteries: 0,
      consumableInventory: {
        aiPaper: 999,
        renameCard: 999,
      },
      redeemedMallItems: {},
      equippedMallEyeId: null,
      equippedMallEyeshadowId: null,
      equippedMallVoiceId: null,
      mallRedemptionOrders: [],
      pointSpendRecords: [
        { id: 'demo-lottery', title: '幸运抽奖机', type: 'lottery', points: 160, createdAt: '2026.08.13 15:42' },
        { id: 'demo-exchange', title: '兑换星河美瞳', type: 'exchange', points: 33600, createdAt: '2026.08.12 20:18' },
      ],
      pointIncomeRecords: [
        { id: 'demo-growth-reward', title: '成长阶段奖励', type: 'activity', points: 500, createdAt: '2026.08.13 09:30' },
        { id: 'demo-daily-interaction', title: '互动奖励', type: 'interaction', points: 120, createdAt: '2026.08.13 08:46' },
        { id: 'demo-checkin-reward', title: '运营活动', type: 'activity', points: 300, createdAt: '2026.08.12 09:12' },
      ],
      pointOrders: [],
      cardCost: 5000,
      exchangeCard: (count = 1) => {
        const state = get();
        const cost = state.cardCost * count;
        if (state.points < cost) return false;
        const inventory = state.dialogueCardInventory ?? {};
        set({
          points: state.points - cost,
          dialogueCards: state.dialogueCards + count,
          dialogueCardInventory: {
            ...inventory,
            1: (inventory[1] ?? 0) + count,
          },
        });
        return true;
      },
      exchangeDialogueCard: (_days, cost, count = 1) => {
        const state = get();
        const totalCost = cost * count;
        if (state.points < totalCost) return false;
        const key = '1';
        const inventory = state.dialogueCardInventory ?? {};
        set({
          points: state.points - totalCost,
          dialogueCardInventory: {
            ...inventory,
            [key]: (inventory[key] ?? 0) + count,
          },
          dialogueCards: state.dialogueCards + count,
        });
        return true;
      },
      useCard: () => {
        const state = get();
        const inventory = state.dialogueCardInventory ?? {};
        const oneDayCount = inventory[1] ?? state.dialogueCards;
        if (oneDayCount <= 0) return false;
        set({
          dialogueCards: Math.max(0, state.dialogueCards - 1),
          dialogueCardInventory: {
            ...inventory,
            1: Math.max(0, oneDayCount - 1),
          },
          activeDialogueCard: {
            fills: 1,
            activatedAt: formatPaymentTime(new Date()),
          },
        });
        return true;
      },
      useDialogueCard: (days) => {
        const state = get();
        const key = '1';
        const inventory = state.dialogueCardInventory ?? {};
        const count = Math.max(inventory[key] ?? 0, days === 1 ? state.dialogueCards : 0);
        if (count <= 0) return false;
        set({
          dialogueCards: Math.max(0, state.dialogueCards - 1),
          dialogueCardInventory: {
            ...inventory,
            [key]: Math.max(0, count - 1),
          },
          activeDialogueCard: {
            fills: 1,
            activatedAt: formatPaymentTime(new Date()),
          },
        });
        return true;
      },
      addVoiceBatteryToSlot: () => {
        const state = get();
        if (state.placedVoiceBatteries >= 4) return false;
        const inventory = state.dialogueCardInventory ?? {};
        const inventoryCount = inventory[1] ?? 0;
        const oneDayCount = Math.max(inventoryCount, state.dialogueCards);
        if (oneDayCount <= 0) return false;

        set({
          dialogueCards: Math.max(0, state.dialogueCards - 1),
          dialogueCardInventory: {
            ...inventory,
            1: Math.max(0, oneDayCount - 1),
          },
          placedVoiceBatteries: Math.min(4, state.placedVoiceBatteries + 1),
        });
        return true;
      },
      consumePlacedVoiceBattery: () => {
        const state = get();
        if (state.placedVoiceBatteries <= 0) return false;
        set({
          placedVoiceBatteries: Math.max(0, state.placedVoiceBatteries - 1),
        });
        return true;
      },
      exchangeMallItem: (itemId, material, cost) => {
        const state = get();
        const inventory = state.consumableInventory ?? { aiPaper: 999, renameCard: 999 };
        if ((inventory[material] ?? 0) < cost) return false;
        const redeemedItems = state.redeemedMallItems ?? {};
        set({
          consumableInventory: {
            ...inventory,
            [material]: inventory[material] - cost,
          },
          redeemedMallItems: {
            ...redeemedItems,
            [itemId]: (redeemedItems[itemId] ?? 0) + 1,
          },
        });
        return true;
      },
      purchaseMallItem: (itemId, title, cost, options = {}) => {
        if (!itemId || !Number.isFinite(cost) || cost <= 0) return 'invalid';

        const state = get();
        const redeemedItems = state.redeemedMallItems ?? {};
        if (!options.repeatable && (redeemedItems[itemId] ?? 0) > 0) return 'already-owned';
        if (state.points < cost) return 'insufficient-points';

        const now = new Date();
        const inventory = state.consumableInventory ?? { aiPaper: 0, renameCard: 0 };
        const cardInventory = state.dialogueCardInventory ?? {};
        const nextState: Partial<DialogueStore> = {
          points: state.points - cost,
          redeemedMallItems: {
            ...redeemedItems,
            [itemId]: (redeemedItems[itemId] ?? 0) + 1,
          },
          pointSpendRecords: [
            {
              id: `spend-${now.getTime()}-${itemId}-${(state.pointSpendRecords ?? []).length}`,
              title: `兑换${title}`,
              type: 'exchange',
              points: cost,
              createdAt: formatPaymentTime(now),
            },
            ...(state.pointSpendRecords ?? []),
          ],
        };

        if (options.inventoryEffect === 'battery') {
          nextState.dialogueCards = state.dialogueCards + 1;
          nextState.dialogueCardInventory = {
            ...cardInventory,
            1: (cardInventory[1] ?? 0) + 1,
          };
        } else if (options.inventoryEffect === 'renameCard') {
          nextState.consumableInventory = {
            ...inventory,
            renameCard: (inventory.renameCard ?? 0) + 1,
          };
        } else if (options.inventoryEffect === 'aiPaper') {
          nextState.consumableInventory = {
            ...inventory,
            aiPaper: (inventory.aiPaper ?? 0) + 1,
          };
        }

        set(nextState);
        return 'success';
      },
      startMallRedemption: (itemId, title, cost, options = {}) => {
        if (!itemId || !Number.isFinite(cost) || cost <= 0) return { result: 'invalid' };

        const state = get();
        const orders = state.mallRedemptionOrders ?? [];
        const existingProcessingOrder = orders.find((order) => order.itemId === itemId && order.status === 'processing');
        if (existingProcessingOrder) return { result: 'already-processing', orderId: existingProcessingOrder.id };

        const redeemedItems = state.redeemedMallItems ?? {};
        if (!options.repeatable && (redeemedItems[itemId] ?? 0) > 0) return { result: 'already-owned' };
        if (state.points < cost) return { result: 'insufficient-points' };

        const now = new Date();
        const orderId = `mall-${now.getTime()}-${itemId}`;
        const order: MallRedemptionOrder = {
          id: orderId,
          itemId,
          title,
          cost,
          status: 'processing',
          retryCount: 0,
          repeatable: options.repeatable === true,
          inventoryEffect: options.inventoryEffect ?? 'none',
          demoOutcome: options.demoOutcome ?? 'success',
          createdAt: formatPaymentTime(now),
          createdAtMs: now.getTime(),
          updatedAtMs: now.getTime(),
        };

        set({
          points: state.points - cost,
          mallRedemptionOrders: [order, ...orders],
          pointSpendRecords: [
            {
              id: `spend-${orderId}`,
              title: `兑换${title}`,
              type: 'exchange',
              points: cost,
              createdAt: formatPaymentTime(now),
            },
            ...(state.pointSpendRecords ?? []),
          ],
        });
        return { result: 'processing', orderId };
      },
      markMallRedemptionRetry: (orderId, attempt) => set((state) => ({
        mallRedemptionOrders: (state.mallRedemptionOrders ?? []).map((order) => (
          order.id === orderId && order.status === 'processing'
            ? { ...order, retryCount: Math.min(3, Math.max(order.retryCount, attempt)), updatedAtMs: Date.now() }
            : order
        )),
      })),
      completeMallRedemption: (orderId) => {
        const state = get();
        const order = (state.mallRedemptionOrders ?? []).find((item) => item.id === orderId);
        if (!order || order.status !== 'processing') return;

        const inventory = state.consumableInventory ?? { aiPaper: 0, renameCard: 0 };
        const cardInventory = state.dialogueCardInventory ?? {};
        const nextState: Partial<DialogueStore> = {
          redeemedMallItems: {
            ...(state.redeemedMallItems ?? {}),
            [order.itemId]: ((state.redeemedMallItems ?? {})[order.itemId] ?? 0) + 1,
          },
          mallRedemptionOrders: (state.mallRedemptionOrders ?? []).map((item) => (
            item.id === orderId ? { ...item, status: 'success', updatedAtMs: Date.now() } : item
          )),
        };

        if (order.inventoryEffect === 'battery') {
          nextState.dialogueCards = state.dialogueCards + 1;
          nextState.dialogueCardInventory = { ...cardInventory, 1: (cardInventory[1] ?? 0) + 1 };
        } else if (order.inventoryEffect === 'renameCard') {
          nextState.consumableInventory = { ...inventory, renameCard: (inventory.renameCard ?? 0) + 1 };
        } else if (order.inventoryEffect === 'aiPaper') {
          nextState.consumableInventory = { ...inventory, aiPaper: (inventory.aiPaper ?? 0) + 1 };
        }

        set(nextState);
      },
      refundMallRedemption: (orderId) => {
        const state = get();
        const order = (state.mallRedemptionOrders ?? []).find((item) => item.id === orderId);
        if (!order || order.status !== 'processing') return;
        const now = new Date();
        set({
          points: state.points + order.cost,
          mallRedemptionOrders: (state.mallRedemptionOrders ?? []).map((item) => (
            item.id === orderId ? { ...item, status: 'refunded', retryCount: 3, updatedAtMs: now.getTime() } : item
          )),
          pointIncomeRecords: (state.pointIncomeRecords ?? []).filter((record) => record.id !== `refund-${order.id}`),
        });
      },
      equipMallItem: (itemId, kind) => set(kind === 'eye'
        ? { equippedMallEyeId: itemId }
        : kind === 'eyeshadow'
          ? { equippedMallEyeshadowId: itemId }
          : { equippedMallVoiceId: itemId }),
      spendPoints: (title, type, points) => {
        const state = get();
        if (points <= 0 || state.points < points) return false;
        const now = new Date();
        set({
          points: state.points - points,
          pointSpendRecords: [
            {
              id: `spend-${now.getTime()}`,
              title,
              type,
              points,
              createdAt: formatPaymentTime(now),
            },
            ...(state.pointSpendRecords ?? []),
          ],
        });
        return true;
      },
      clearActiveDialogueCard: () => set({ activeDialogueCard: null }),
      resetMallState: () => set((state) => ({
        points: 1000,
        dialogueCards: 0,
        dialogueCardInventory: {},
        activeDialogueCard: null,
        placedVoiceBatteries: 0,
        consumableInventory: {
          aiPaper: 999,
          renameCard: 999,
        },
        redeemedMallItems: {},
        equippedMallEyeId: null,
        equippedMallEyeshadowId: null,
        equippedMallVoiceId: null,
        mallRedemptionOrders: [],
        pointSpendRecords: (state.pointSpendRecords ?? []).filter((record) => record.type === 'lottery'),
      })),
      resetMallRedemptions: () => set((state) => {
        const orders = state.mallRedemptionOrders ?? [];
        const pointsToRestore = orders
          .filter((order) => order.status !== 'refunded')
          .reduce((total, order) => total + order.cost, 0);
        return {
          points: state.points + pointsToRestore,
          redeemedMallItems: {},
          mallRedemptionOrders: [],
          equippedMallEyeId: null,
          equippedMallEyeshadowId: null,
          equippedMallVoiceId: null,
          pointSpendRecords: (state.pointSpendRecords ?? []).filter((record) => record.type !== 'exchange'),
          pointIncomeRecords: (state.pointIncomeRecords ?? []).filter((record) => !record.id.startsWith('refund-')),
        };
      }),
      addPoints: (amount) => set((state) => {
        const now = new Date();
        return {
          points: state.points + amount,
          pointIncomeRecords: [
            {
              id: `income-${now.getTime()}`,
              title: '互动获得积分',
              type: 'interaction',
              points: amount,
              createdAt: formatPaymentTime(now),
            },
            ...(state.pointIncomeRecords ?? []),
          ],
        };
      }),
      purchasePoints: (points, amount, deviceName = '肉派派', channel = 'App Store') => {
        const now = new Date();
        set((state) => ({
          points: state.points + points,
          pointOrders: [
            {
              id: `points-${now.getTime()}`,
              orderNo: `PT${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getTime()).slice(-6)}`,
              deviceName,
              points,
              amount,
              channel,
              paidAt: formatPaymentTime(now),
              status: 'paid',
            },
            ...state.pointOrders,
          ],
        }));
      },
      recordPointOrder: (points, amount, deviceName = '肉派派', channel = 'App Store', status = 'processing') => {
        const now = new Date();
        set((state) => ({
          pointOrders: [
            {
              id: `points-${now.getTime()}`,
              orderNo: `PT${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getTime()).slice(-6)}`,
              deviceName,
              points,
              amount,
              channel,
              paidAt: formatPaymentTime(now),
              status,
            },
            ...state.pointOrders,
          ],
        }));
      },
    }),
    {
      name: 'ropet-dialogue-prototype',
      version: 1,
      migrate: (persistedState, version) => (
        version < 1
          ? { ...(persistedState as DialogueStore), points: 1000 }
          : persistedState as DialogueStore
      ),
    },
  ),
);
