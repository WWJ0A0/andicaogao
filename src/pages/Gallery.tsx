import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleAlert, TriangleAlert } from 'lucide-react';

type GenerationState = 'generating' | 'failed' | 'dismissed';
type QueueFailureState = 'idle' | 'failed' | 'dismissed';
type FailureKind = 'policy' | 'timeout';

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const repeatBlocks = [0, 1, 2];
  const [generationState, setGenerationState] = useState<GenerationState>('generating');
  const [timeoutFailureState, setTimeoutFailureState] = useState<QueueFailureState>('idle');
  const [activeFailure, setActiveFailure] = useState<FailureKind | null>(null);

  const showFailureDemo = () => {
    setActiveFailure(null);
    setGenerationState('failed');
    setTimeoutFailureState('failed');
  };

  const acknowledgeFailure = () => {
    if (activeFailure === 'policy') {
      setGenerationState('dismissed');
    }
    if (activeFailure === 'timeout') {
      setTimeoutFailureState('dismissed');
    }
    setActiveFailure(null);
  };

  return (
    <div className="relative w-full min-h-screen flex justify-center bg-[#d8deea] overflow-hidden py-4">
      <div className="relative w-[393px] h-[852px] overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        <div className="relative z-20">
        <div className="flex items-start px-[21px] pt-[14px] pb-[9px]">
          <p className="w-[54px] text-center tracking-[-0.3px] text-black text-[15px] font-semibold">9:41</p>
          <img src="/images/mo9q701s-osierul.svg" className="mt-[4px] ml-[233px] w-[18px] h-[11px]" alt="cellular" />
          <img src="/images/mo9q701s-p4ewtoa.svg" className="mt-[3px] ml-[5px] w-[16px] h-[11px]" alt="wifi" />
          <img src="/images/mo9q701s-1gqz4y0.svg" className="mt-[3px] ml-[7px] w-[24px] h-[11px]" alt="battery" />
        </div>

        <div className="relative flex items-center px-4 py-2 w-[393px]">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center justify-center border border-[#2222220d] bg-[#ffffff80] rounded-[12px] p-[11px] w-[40px] h-[40px]"
          >
            <img src="/images/mo9q701s-48eceqn.svg" className="w-[40px] h-[40px] contrast-125" alt="back" />
          </button>

          <div className="absolute top-[12px] left-[304px] flex items-center justify-between rounded-[12px] bg-[#9a84ee] pr-[4px] pl-[7px] w-[73px] h-[32px]">
            <p className="w-[32px] text-center text-white text-[14px] font-semibold">ON</p>
            <img src="/images/mo9q701s-qgh50ij.svg" className="w-[24px] h-[24px]" alt="switch" />
          </div>

          <div className="absolute top-[12px] left-[162px] flex items-center justify-between z-[1] w-[74px] h-[32px]">
            <p className="leading-[32px] text-[#222222] text-[18px] font-medium">绘画梦</p>
            <img src="/images/mo9q701s-44315es.svg" className="w-[16px] h-[16px]" alt="help" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 px-5">
          <p className="leading-5 tracking-[1px] text-[#222222] text-[20px] font-semibold">拍拍画廊</p>
          <div className="flex items-center justify-between rounded-[16px] bg-[#22222208] py-[3px] pr-[4px] pl-[9px] w-[76px] h-[28px]">
            <p className="leading-[22px] text-[#222222cc] text-[12px] font-medium">See all</p>
            <img src="/images/mo9q701s-2w2wsd0.svg" className="rounded-[10px] w-[20px] h-[20px]" alt="see-all" />
          </div>
        </div>
        </div>

        <div className="absolute z-0 left-0 right-0 top-[166px] bottom-0 overflow-y-auto scrollbar-hide pb-[48px]">
          <div className="flex items-center justify-between mt-[23px] pr-[42px] pl-[16px]">
              <div className="relative w-[154px] h-[174px] rotate-[2deg]">
                <div className="absolute top-[4px] left-[12px] w-[140px] h-[167px]">
                  <div className="absolute top-[4px] left-[8px] rounded-[2px] shadow-[0_2px_3px_0_#00000014] bg-white w-[128px] h-[160px] rotate-[3deg]" />
                  <div className="absolute top-[1px] left-[-1px] rounded-[2px] shadow-[0_2px_3px_0_#00000014] bg-white w-[128px] h-[160px]" />
                </div>
                <img src="/images/mo9q701s-28a1xlm.png" className="absolute top-[1px] left-[-1px] w-[147px] h-[175px]" alt="remaining-paper" />
                <p className="absolute top-[134px] left-[54px] w-[72px] h-[16px] leading-[16px] text-[10px] text-[#22222299] rotate-[-8deg]">
                  ·剩余相纸 <span className="text-[#7c5ae0] text-[16px]">0</span> 张
                </p>
              </div>

              <div className="relative ml-[53px] w-[128px] h-[160px]">
                {generationState === 'generating' && (
                  <div
                    className="absolute top-0 left-0 w-[128px] h-[160px] rotate-[-6deg]"
                    role="status"
                    aria-live="polite"
                    aria-label="绘画中，正在生成图片"
                  >
                    <div className="absolute top-[-6px] left-[-8px] rounded-[2px] shadow-[0_2px_3px_0_#0000001f] bg-white w-[128px] h-[160px]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pb-[3px]">
                      <span className="gallery-painting-brush text-[25px] leading-none" aria-hidden="true">🖌️</span>
                      <p className="mt-[10px] text-[15px] leading-[20px] font-semibold text-[#222222]">绘画中</p>
                      <p className="mt-[2px] text-[11px] leading-[16px] text-[#22222266]">正在生成中...</p>
                      <div className="mt-[10px] flex gap-[4px]" aria-hidden="true">
                        <span className="gallery-painting-dot" />
                        <span className="gallery-painting-dot gallery-painting-dot-delay-1" />
                        <span className="gallery-painting-dot gallery-painting-dot-delay-2" />
                      </div>
                    </div>
                  </div>
                )}

                {generationState === 'failed' && (
                  <button
                    type="button"
                    onClick={() => setActiveFailure('policy')}
                    className="absolute top-0 left-0 w-[128px] h-[160px] rotate-[-6deg] text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c5ae0] focus-visible:ring-offset-2"
                    aria-label="绘画失败，点击查看原因"
                  >
                    <span className="absolute top-[-6px] left-[-8px] rounded-[2px] shadow-[0_2px_3px_0_#0000001f] bg-white w-[128px] h-[160px]" />
                    <span className="absolute inset-0 flex flex-col items-center justify-center pb-[3px]">
                      <span className="flex items-center justify-center rounded-full bg-[#2222220a] w-[34px] h-[34px]" aria-hidden="true">
                        <CircleAlert className="w-[22px] h-[22px] text-[#777777]" strokeWidth={1.8} />
                      </span>
                      <span className="mt-[10px] text-[15px] leading-[20px] font-semibold text-[#222222]">绘画失败</span>
                      <span className="mt-[3px] text-[11px] leading-[16px] text-[#7c5ae0]">点击查看原因</span>
                    </span>
                  </button>
                )}

                {generationState === 'dismissed' && (
                  <div className="absolute top-0 left-0 w-[128px] h-[157px] rotate-[3deg] gallery-photo-fill-in">
                    <div className="absolute top-[-3px] left-[-4px] rounded-[2px] shadow-[0_2px_3px_0_#0000001f] bg-white w-[128px] h-[157px]" />
                    <img src="/images/mo9q701z-5h3ua8r.png" className="absolute top-[4px] left-[5px] rounded-[3px] w-[114px] h-[114px]" alt="新补位的画廊照片" />
                    <p className="absolute z-[2] top-[130px] left-[84px] w-[34px] h-[11px] leading-[11px] text-[#555555] text-[11px]">ropet</p>
                    <p className="absolute z-[2] top-[142px] left-[80px] w-[38px] h-[11px] leading-[11px] text-[#55555599] text-[9px]">2025.10.10</p>
                  </div>
                )}

                {generationState !== 'dismissed' && (
                  <div className="absolute right-[-24px] bottom-[-23px] flex items-center p-1 w-[52px] h-[52px] pointer-events-none">
                    <img src="/images/mo9q701z-sdk9y4p.png" className="w-[43px] h-[45px]" alt="" />
                  </div>
                )}
              </div>
          </div>

          {repeatBlocks.map((blockIndex) => (
            <div key={blockIndex} className={blockIndex === 0 ? '' : 'mt-[28px]'}>
              <div className="flex items-start mt-[28px] pr-[42px] pl-[23px]">
                <div className="relative mt-[8px] w-[128px] h-[160px]">
                  <div className="absolute top-0 left-0 w-[128px] h-[160px] rotate-[-5deg]">
                    <div className="absolute top-[-5px] left-[-7px] rounded-[2px] shadow-[0_2px_3px_0_#0000001f] bg-white w-[128px] h-[160px]" />
                    <p className="absolute z-[2] top-[142px] left-[80px] w-[38px] h-[11px] leading-[11px] text-[#55555599] text-[9px]">2025.10.10</p>
                    <img src="/images/mo9q701z-5h3ua8r.png" className="absolute top-[18px] left-[2px] rounded-[3px] w-[114px] h-[114px]" alt="photo-a" />
                    <p className="absolute z-[2] top-[130px] left-[84px] w-[34px] h-[11px] leading-[11px] text-[#555555] text-[11px]">ropet</p>
                  </div>
                  <div className="absolute top-[69px] left-[-14px] w-[38px] h-[38px] rotate-[-19deg]">
                    <div className="absolute top-[-1px] left-[1px] rounded-full bg-[#c4f53d] w-[38px] h-[38px]" />
                    <div className="absolute top-[2px] left-[2px] w-[33px] h-[33px]" />
                    <img src="/images/mo9q701s-d7efyo4.png" className="absolute top-[11px] left-[9px] w-[20px] h-[17px]" alt="sticker-green" />
                  </div>
                </div>

                <div className="relative ml-[71px] w-[128px] h-[157px]">
                  {blockIndex === 0 && timeoutFailureState === 'failed' ? (
                    <button
                      type="button"
                      onClick={() => setActiveFailure('timeout')}
                      className="absolute top-0 left-0 w-[128px] h-[157px] rotate-[3deg] text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c5ae0] focus-visible:ring-offset-2"
                      aria-label="绘画超时，点击查看原因"
                    >
                      <span className="absolute top-[-3px] left-[-4px] rounded-[2px] shadow-[0_2px_3px_0_#0000001f] bg-white w-[128px] h-[157px]" />
                      <span className="absolute inset-0 flex flex-col items-center justify-center pb-[3px]">
                        <span className="flex items-center justify-center rounded-full bg-[#2222220a] w-[34px] h-[34px]" aria-hidden="true">
                          <CircleAlert className="w-[22px] h-[22px] text-[#777777]" strokeWidth={1.8} />
                        </span>
                        <span className="mt-[10px] text-[15px] leading-[20px] font-semibold text-[#222222]">绘画失败</span>
                        <span className="mt-[3px] text-[11px] leading-[16px] text-[#7c5ae0]">点击查看原因</span>
                      </span>
                    </button>
                  ) : (
                    <div className={`absolute top-0 left-0 w-[128px] h-[157px] rotate-[3deg] ${blockIndex === 0 && timeoutFailureState === 'dismissed' ? 'gallery-photo-fill-in' : ''}`}>
                      <div className="absolute top-[-3px] left-[-4px] rounded-[2px] shadow-[0_2px_3px_0_#0000001f] bg-white w-[128px] h-[157px]" />
                      <p className="absolute z-[2] top-[130px] left-[84px] w-[34px] h-[11px] leading-[11px] text-[#555555] text-[11px]">ropet</p>
                      <p className="absolute z-[2] top-[142px] left-[80px] w-[38px] h-[11px] leading-[11px] text-[#55555599] text-[9px]">2025.10.09</p>
                      <img src="/images/mo9q701z-mi7ihka.png" className="absolute top-[4px] left-[5px] rounded-[3px] w-[114px] h-[114px]" alt="photo-b" />
                    </div>
                  )}
                  <img src="/images/mo9q701s-9pfdfrb.png" className="absolute top-[-11px] left-[9px] w-[21px] h-[24px] rotate-[14deg]" alt="clip-aqua" />
                </div>
              </div>

              <div className="flex items-start mt-[18px] pr-[38px] pl-[39px]">
                <div className="relative mt-[19px] w-[128px] h-[157px]">
                  <div className="absolute top-0 left-0 rounded-[2px] shadow-[0_2px_3px_0_#0000001f] bg-white pt-[7px] pr-[7px] pb-[5px] pl-[7px] w-[128px] h-[157px]">
                    <img src="/images/mo9q701z-8rjv56t.png" className="rounded-[3px] w-[114px] h-[114px]" alt="photo-c" />
                    <p className="absolute z-[2] top-[130px] left-[84px] w-[34px] h-[11px] leading-[11px] text-[#555555] text-[11px]">ropet</p>
                    <p className="absolute z-[2] top-[142px] left-[80px] w-[38px] h-[11px] leading-[11px] text-[#55555599] text-[9px]">2025.10.08</p>
                  </div>
                  <img src="/images/mo9q701s-wxc7fva.svg" className="absolute top-[-8px] left-[5px] w-[21px] h-[24px]" alt="clip-pink" />
                </div>

                <div className="relative ml-[59px] w-[128px] h-[157px] rotate-[-6deg]">
                  <div className="absolute top-[-6px] left-[-8px] rounded-[2px] shadow-[0_2px_3px_0_#0000001f] bg-white w-[128px] h-[157px]" />
                  <p className="absolute z-[2] top-[130px] left-[84px] w-[34px] h-[11px] leading-[11px] text-[#555555] text-[11px]">ropet</p>
                  <p className="absolute z-[2] top-[142px] left-[80px] w-[38px] h-[11px] leading-[11px] text-[#55555599] text-[9px]">2025.10.07</p>
                  <img src="/images/mo9q701z-wplss2w.png" className="absolute top-[16px] left-[1px] rounded-[3px] w-[114px] h-[114px]" alt="photo-d" />
                </div>
              </div>

              <div className="flex items-start mt-[37px] pr-[42px] pl-[47px]">
                <div className="relative mt-[22px] w-[128px] h-[160px]">
                  <div className="absolute top-0 left-0 w-[128px] h-[160px] rotate-[-5deg]">
                    <div className="absolute top-[-5px] left-[-7px] rounded-[2px] shadow-[0_2px_3px_0_#0000001f] bg-white w-[128px] h-[160px]" />
                    <p className="absolute top-[138px] left-[90px] w-[37px] h-[11px] leading-[11px] text-[#55555599] text-[9px]">2025.10.10</p>
                    <img src="/images/mo9q701z-8auqqgs.png" className="absolute top-[18px] left-[2px] rounded-[3px] w-[114px] h-[114px]" alt="photo-e" />
                    <p className="absolute top-[73px] left-[47px] w-[34px] h-[11px] leading-[11px] text-[#555555] text-[11px]">ropet</p>
                  </div>
                  <div className="absolute top-[9px] right-[-9px] w-[38px] h-[38px] rotate-[-19deg]">
                    <div className="absolute top-[-1px] left-[1px] rounded-full bg-[#c4f53d] w-[38px] h-[38px]" />
                    <div className="absolute top-[2px] left-[2px] w-[33px] h-[33px]" />
                    <img src="/images/mo9q701s-d7efyo4.png" className="absolute top-[11px] left-[9px] w-[20px] h-[17px]" alt="sticker-green-2" />
                  </div>
                </div>

                <div className="relative ml-[48px] w-[128px] h-[157px] rotate-[3deg]">
                  <div className="absolute top-[-3px] left-[-4px] rounded-[2px] shadow-[0_2px_3px_0_#0000001f] bg-white w-[128px] h-[157px]" />
                  <p className="absolute top-[130px] left-[84px] w-[34px] h-[11px] leading-[11px] text-[#555555] text-[11px]">ropet</p>
                  <p className="absolute top-[142px] left-[80px] w-[38px] h-[11px] leading-[11px] text-[#55555599] text-[9px]">2025.10.09</p>
                  <img src="/images/mo9q701z-mi7ihka.png" className="absolute top-[4px] left-[5px] rounded-[3px] w-[114px] h-[114px]" alt="photo-f" />
                </div>
              </div>
            </div>
          ))}

          <div className="h-[34px]" />
        </div>

        <button
          type="button"
          onClick={showFailureDemo}
          className="absolute z-40 right-[12px] bottom-[45px] flex items-center gap-[5px] rounded-[14px] bg-[#222222d9] px-[10px] h-[30px] text-white text-[11px] font-medium shadow-[0_3px_10px_rgba(34,34,34,0.2)]"
          aria-label="演示绘画生成失败"
        >
          <TriangleAlert className="w-[13px] h-[13px]" strokeWidth={2} />
          演示失败
        </button>

        {activeFailure && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-[#22222266] px-[42px]" role="presentation">
            <div
              className="w-full rounded-[18px] bg-white px-[22px] pt-[24px] pb-[18px] text-center shadow-[0_14px_40px_rgba(34,34,34,0.2)]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="gallery-failure-title"
              aria-describedby="gallery-failure-description"
            >
              <div className="mx-auto flex items-center justify-center rounded-full bg-[#f1eff6] w-[44px] h-[44px]" aria-hidden="true">
                <CircleAlert className="w-[26px] h-[26px] text-[#6f6a78]" strokeWidth={1.8} />
              </div>
              <h2 id="gallery-failure-title" className="mt-[14px] text-[18px] leading-[25px] font-semibold text-[#222222]">
                这张画作暂时无法绘制
              </h2>
              {activeFailure === 'timeout' ? (
                <p id="gallery-failure-description" className="mt-[8px] text-[13px] leading-[20px] text-[#22222299]">
                  当前绘画请求较多，多次尝试后仍未完成。<br />请稍后再试。
                </p>
              ) : (
                <p id="gallery-failure-description" className="mt-[8px] text-[13px] leading-[20px] text-[#22222299]">
                  画面中可能包含受版权保护的内容，<br />或其他不符合内容政策的内容。
                </p>
              )}
              <p className="mt-[12px] text-[12px] leading-[18px] text-[#22222266]">AI 画纸已退回</p>
              <button
                type="button"
                onClick={acknowledgeFailure}
                className="mt-[18px] w-full h-[42px] rounded-[12px] bg-[#8b6ee8] text-white text-[15px] font-semibold"
              >
                知道了
              </button>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-[394px] h-[34px] flex items-start pt-[21px] px-[129px] pb-[8px] pointer-events-none">
          <div className="rounded-[100px] bg-[#222222] w-[134px] h-[5px]" />
        </div>
      </div>
    </div>
  );
};

export default Gallery;
