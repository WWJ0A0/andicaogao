import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  spendPoints: (title: string, type: 'lottery' | 'exchange', points: number) => boolean;
  clearActiveDialogueCard: () => void;
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
      points: 1300,
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
      pointSpendRecords: [
        { id: 'demo-lottery', title: '幸运抽奖机', type: 'lottery', points: 160, createdAt: '2026.08.13 15:42' },
        { id: 'demo-exchange', title: '兑换星河美瞳', type: 'exchange', points: 33600, createdAt: '2026.08.12 20:18' },
      ],
      pointIncomeRecords: [
        { id: 'demo-growth-reward', title: '成长阶段奖励', type: 'activity', points: 500, createdAt: '2026.08.13 09:30' },
        { id: 'demo-daily-interaction', title: '今日互动奖励', type: 'interaction', points: 120, createdAt: '2026.08.13 08:46' },
        { id: 'demo-checkin-reward', title: '连续签到活动', type: 'activity', points: 300, createdAt: '2026.08.12 09:12' },
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
    { name: 'ropet-dialogue-prototype' },
  ),
);
