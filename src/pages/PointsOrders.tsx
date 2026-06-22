import React, { useMemo, useState } from 'react';
import { Check, ChevronLeft, Copy, Headphones, ReceiptText, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ModalOverlay,
  PrototypePhone,
  PrototypeStatusBar,
} from '@/components/subscription/PrototypeUI';
import { useDialogueStore } from '@/store/useDialogueStore';

type PointOrderStatus = 'creating' | 'unpaid' | 'failed' | 'cancelled' | 'paid' | 'refunding' | 'refunded';

type DisplayPointOrder = {
  id: string;
  orderNo: string;
  deviceName: string;
  points: number;
  amount: number;
  channel: string;
  time: string;
  timeLabel: string;
  status: PointOrderStatus;
};

const DEMO_POINT_ORDERS: DisplayPointOrder[] = [
  {
    id: 'demo-creating',
    orderNo: 'PT20260622100421',
    deviceName: '肉派派',
    points: 10000,
    amount: 25,
    channel: 'App Store',
    time: '2026.06.22 10:04',
    timeLabel: '创建时间',
    status: 'creating',
  },
  {
    id: 'demo-unpaid',
    orderNo: 'PT20260622095218',
    deviceName: '肉派派',
    points: 1000,
    amount: 6,
    channel: 'App Store',
    time: '2026.06.22 09:52',
    timeLabel: '创建时间',
    status: 'unpaid',
  },
  {
    id: 'demo-failed',
    orderNo: 'PT20260621193802',
    deviceName: '肉派派',
    points: 100000,
    amount: 289,
    channel: 'App Store',
    time: '2026.06.21 19:38',
    timeLabel: '支付时间',
    status: 'failed',
  },
  {
    id: 'demo-cancelled',
    orderNo: 'PT20260621182145',
    deviceName: '肉派派',
    points: 10000,
    amount: 25,
    channel: 'App Store',
    time: '2026.06.21 18:21',
    timeLabel: '创建时间',
    status: 'cancelled',
  },
  {
    id: 'demo-refunding',
    orderNo: 'PT20260620141359',
    deviceName: '肉派派',
    points: 1000,
    amount: 6,
    channel: 'App Store',
    time: '2026.06.20 14:13',
    timeLabel: '申请时间',
    status: 'refunding',
  },
  {
    id: 'demo-refunded',
    orderNo: 'PT20260619172630',
    deviceName: '肉派派',
    points: 1000,
    amount: 6,
    channel: 'App Store',
    time: '2026.06.19 17:26',
    timeLabel: '退款时间',
    status: 'refunded',
  },
];

const STATUS_META: Record<PointOrderStatus, {
  label: string;
  className: string;
  note?: string;
  action?: string;
}> = {
  creating: {
    label: '创建中',
    className: 'bg-[#eef3ff] text-[#4c72c9]',
    note: '正在创建订单，请稍候。',
  },
  unpaid: {
    label: '未支付',
    className: 'bg-[#fff5dc] text-[#a36a12]',
    note: '订单已创建，等待用户完成支付。',
    action: '继续支付',
  },
  failed: {
    label: '支付失败',
    className: 'bg-[#ffe9e9] text-[#bc4949]',
    note: '支付未完成，未发放积分。',
    action: '重新支付',
  },
  cancelled: {
    label: '取消付款',
    className: 'bg-[#f0eef2] text-[#77717e]',
    note: '用户已取消本次付款。',
    action: '重新购买',
  },
  paid: {
    label: '支付成功',
    className: 'bg-[#e8f7ef] text-[#31845c]',
    note: '积分已发放到当前设备。',
  },
  refunding: {
    label: '退款中',
    className: 'bg-[#fff0df] text-[#b66a25]',
    note: '退款由支付渠道处理中，成功后会扣回对应积分。',
  },
  refunded: {
    label: '已退款',
    className: 'bg-[#eeeeef] text-[#77717e]',
    note: '退款已完成，对应积分已扣回。',
  },
};

const PointsOrders: React.FC = () => {
  const navigate = useNavigate();
  const { pointOrders } = useDialogueStore();
  const [copiedOrderNo, setCopiedOrderNo] = useState('');
  const [toast, setToast] = useState('');
  const [supportOrder, setSupportOrder] = useState<DisplayPointOrder | null>(null);

  const displayOrders = useMemo<DisplayPointOrder[]>(() => {
    const realOrders = pointOrders.map((order) => ({
      id: order.id,
      orderNo: order.orderNo,
      deviceName: order.deviceName,
      points: order.points,
      amount: order.amount,
      channel: order.channel || 'App Store',
      time: order.paidAt,
      timeLabel: '支付时间',
      status: order.status,
    }));
    return [...realOrders, ...DEMO_POINT_ORDERS];
  }, [pointOrders]);

  const copyOrderNo = (orderNo: string) => {
    void navigator.clipboard?.writeText(orderNo);
    setCopiedOrderNo(orderNo);
    window.setTimeout(() => setCopiedOrderNo(''), 1400);
  };

  const handleDemoAction = (label: string) => {
    setToast(`${label}：这里模拟调起支付渠道`);
    window.setTimeout(() => setToast(''), 1400);
  };

  return (
    <PrototypePhone className="bg-[#fbf9ff]">
      <PrototypeStatusBar />
      <div className="relative flex h-[62px] items-center px-4">
        <button
          type="button"
          aria-label="返回积分商城"
          onClick={() => navigate('/points-store')}
          className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#ececf0] bg-white text-[#19181f]"
        >
          <ChevronLeft size={25} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-medium text-[#19181f]">积分订单</h1>
      </div>

      <div className="h-[752px] overflow-y-auto px-5 pb-8 pt-3 scrollbar-hide">
        {toast && (
          <div className="fixed left-1/2 top-[116px] z-50 -translate-x-1/2 rounded-full bg-[#25212b] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
            {toast}
          </div>
        )}
        <section className="mb-4 rounded-[18px] bg-[#f4efff] px-4 py-3 text-[12px] leading-5 text-[#7258b6]">
          积分权益跟随当前设备；订单记录仅展示当前账号自己的支付订单。
        </section>
        {displayOrders.length > 0 ? (
          <>
            <section className="mb-3 rounded-[16px] border border-[#ece9f1] bg-white px-4 py-3">
              <p className="text-[13px] font-semibold text-[#26232a]">状态演示</p>
              <p className="mt-1 text-[11px] leading-5 text-[#96919c]">
                包含创建中、未支付、支付失败、取消付款、退款中、已退款和支付成功等状态。
              </p>
            </section>

            <div className="space-y-3">
            {displayOrders.map((order) => {
              const statusMeta = STATUS_META[order.status];
              return (
              <section key={order.id} className="rounded-[20px] border border-[#ece9f1] bg-white p-4 shadow-[0_10px_28px_rgba(58,49,75,0.05)]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#fff5ce] text-[#e5af19]">
                      <Star size={23} fill="#ffd943" />
                    </span>
                    <div className="ml-3">
                      <h2 className="text-[16px] font-semibold text-[#222127]">{order.points} 积分</h2>
                      <button
                        type="button"
                        aria-label="复制订单号"
                        onClick={() => copyOrderNo(order.orderNo)}
                        className="mt-1 inline-flex items-center text-[11px] text-[#96919c]"
                      >
                        订单号 {order.orderNo}
                        {copiedOrderNo === order.orderNo ? (
                          <Check size={13} className="ml-1 text-[#3f9c71]" />
                        ) : (
                          <Copy size={13} className="ml-1" />
                        )}
                      </button>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusMeta.className}`}>
                    {statusMeta.label}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-y-3 border-t border-[#efedf2] pt-3 text-[12px]">
                  <span className="text-[#96919c]">归属设备</span>
                  <strong className="text-right text-[#4d4852]">{order.deviceName}</strong>
                  <span className="text-[#96919c]">支付渠道</span>
                  <strong className="text-right text-[#4d4852]">{order.channel}</strong>
                  <span className="text-[#96919c]">{order.timeLabel}</span>
                  <strong className="text-right text-[#4d4852]">{order.time}</strong>
                  <span className="text-[#96919c]">实付金额</span>
                  <strong className="text-right text-[#4d4852]">￥{order.amount}.00</strong>
                </div>
                {(statusMeta.note || statusMeta.action) && (
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-[14px] bg-[#faf9fc] px-3 py-2">
                    {statusMeta.note && (
                      <p className="min-w-0 flex-1 text-[11px] leading-4 text-[#8f8a94]">{statusMeta.note}</p>
                    )}
                    {statusMeta.action && (
                      <button
                        type="button"
                        onClick={() => handleDemoAction(statusMeta.action as string)}
                        className="h-8 shrink-0 rounded-full bg-[#8b66ef] px-3 text-[11px] font-semibold text-white"
                      >
                        {statusMeta.action}
                      </button>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setSupportOrder(order)}
                  className="mt-3 flex h-9 w-full items-center justify-center rounded-full border border-[#eee9f5] bg-white text-[12px] font-semibold text-[#6f6875]"
                >
                  <Headphones size={15} className="mr-1.5 text-[#8b66ef]" />
                  订单有问题？联系客服
                </button>
              </section>
              );
            })}
            </div>
          </>
        ) : (
          <div className="pt-24 text-center">
            <ReceiptText size={44} className="mx-auto text-[#d7d3dc]" />
            <h2 className="mt-4 text-[18px] font-semibold text-[#26232a]">暂无积分订单</h2>
            <p className="mt-2 text-[12px] leading-5 text-[#96919c]">
              购买积分后的订单会展示在这里，悄悄话卡兑换记录暂不放入订单。
            </p>
            <button
              type="button"
              onClick={() => navigate('/points-store')}
              className="mt-5 h-10 rounded-full bg-[#8b66ef] px-5 text-[13px] font-semibold text-white"
            >
              去购买积分
            </button>
          </div>
        )}
      </div>

      {supportOrder && (
        <ModalOverlay>
          <div className="w-full rounded-[26px] bg-white px-5 pb-5 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[19px] font-semibold text-[#222127]">订单有问题？</h2>
              <button
                type="button"
                aria-label="关闭客服弹窗"
                onClick={() => setSupportOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f3f5] text-[#5f5b64]"
              >
                <X size={21} />
              </button>
            </div>
            <div className="mt-4 rounded-[18px] bg-[#f8f6ff] px-4 py-4 text-[13px] leading-6 text-[#5f536f]">
              开发票或退款请联系客服邮箱
              <button
                type="button"
                onClick={() => copyOrderNo('customerservice@ropetai.com')}
                className="mx-1 font-semibold text-[#6f4bd6] underline underline-offset-2"
              >
                customerservice@ropetai.com
              </button>
              。
            </div>
            <div className="mt-4 rounded-[16px] border border-[#efedf2] px-4 py-3 text-[12px] leading-5 text-[#8f8a94]">
              <p>订单号：{supportOrder.orderNo}</p>
              <p className="mt-1">请在邮件中附上订单号、问题类型和截图，方便客服核对。</p>
            </div>
            <button
              type="button"
              onClick={() => {
                copyOrderNo('customerservice@ropetai.com');
                setToast('客服邮箱已复制');
                setSupportOrder(null);
                window.setTimeout(() => setToast(''), 1400);
              }}
              className="mt-5 h-12 w-full rounded-[16px] bg-[#8b66ef] text-[14px] font-semibold text-white"
            >
              复制邮箱
            </button>
          </div>
        </ModalOverlay>
      )}
    </PrototypePhone>
  );
};

export default PointsOrders;
