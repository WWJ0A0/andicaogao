import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type FamilyMemberId = 'grandma' | 'mama' | 'baba' | 'brother' | 'sister';

type AssistantContentLocationState = {
  familyId?: FamilyMemberId;
};

const AssistantContentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const familyId = (location.state as AssistantContentLocationState | null)?.familyId;
  const isBabaContent = familyId === 'baba';
  const isBrotherContent = familyId === 'brother';
  const isSisterContent = familyId === 'sister';
  const isGrandmaContent = familyId === 'grandma';
  const isFamilyVariantContent = isBabaContent || isBrotherContent || isSisterContent || isGrandmaContent;
  const cardBackgroundImage = isBabaContent
    ? '/images/mobeke4x-bzxkdpx.svg'
    : isBrotherContent
      ? '/images/mobf4fjl-1adv0xn.svg'
      : isSisterContent
        ? '/images/mobfkxr6-a907se7.svg'
        : isGrandmaContent
          ? '/images/mobfsieg-nnsgwyk.svg'
        : '/images/mo9um5rn-5meseuu.svg';
  const cardMainImage = isBabaContent
    ? '/images/mobeke4z-4aavzqk.png'
    : isBrotherContent
      ? '/images/mobf4fjo-9tn0r8p.png'
      : isSisterContent
        ? '/images/mobfkxr7-bfycrwa.png'
        : isGrandmaContent
          ? '/images/mobfsiei-ttbdx8b.png'
        : '/images/mo9um5rp-qstsl2d.png';
  const cardText = isBabaContent
    ? '天刚蒙蒙亮，爸爸换上轻便运动装出门慢跑。十分钟的晨跑唤醒沉睡的身体，舒展筋骨，以活力满满的状态拥抱崭新一天。'
    : isBrotherContent
      ? '清晨闹钟响起，弟弟迷迷糊糊爬起床。洗漱完毕后，认真检查书包课本和水杯，确认无误后，背着书包蹦蹦跳跳奔向学校。'
      : isSisterContent
        ? '姐姐，要记得睡前花两分钟，把校服仔细叠好放在床头，将发绳装进书包侧袋。提前准备好清晨要用的物品，第二天起床不再手忙脚乱，从容开启新的一天。'
        : isGrandmaContent
          ? '外婆，早饭吃完歇一会就把药吃了，别忘记啦。吃完在家慢慢散散步，活动活动筋骨，舒舒服服度过一整天。'
      : '妈妈，工作太认真啦，快点站起来活动活动，喝口水，拉伸一下，不要就坐太久啦，放松肌肉很重要哦。';
  const cardLogoImage = isBabaContent
    ? '/images/mobeke4x-00gy414.svg'
    : isBrotherContent
      ? '/images/mobf4fjl-li1x9f6.svg'
      : isSisterContent
        ? '/images/mobfkxr6-sx7apgr.svg'
        : isGrandmaContent
          ? '/images/mobfsieh-lhnvayn.svg'
        : '/images/mo9um5rn-uo2ohvv.svg';
  const vector3079Image = isBabaContent
    ? '/images/mobeke4x-ajr9axv.svg'
    : isBrotherContent
      ? '/images/mobf4fjl-yu7sykc.svg'
      : isSisterContent
        ? '/images/mobfkxr6-c6xaq24.svg'
        : isGrandmaContent
          ? '/images/mobfsieg-7gz9vpi.svg'
        : '/images/mo9um5rn-cuba1ag.svg';
  const vector3082Image = isBabaContent
    ? '/images/mobeke4x-w3e9imv.svg'
    : isBrotherContent
      ? '/images/mobf4fjl-705zjc3.svg'
      : isSisterContent
        ? '/images/mobfkxr6-a7xfv11.svg'
        : isGrandmaContent
          ? '/images/mobfsieg-3l60v3c.svg'
        : '/images/mo9um5rn-8b729qh.svg';
  const vector3080Image = isBabaContent
    ? '/images/mobeke4x-pg88rl2.svg'
    : isBrotherContent
      ? '/images/mobf4fjl-xvd3wrs.svg'
      : isSisterContent
        ? '/images/mobfkxr6-okjdbq7.svg'
        : isGrandmaContent
          ? '/images/mobfsieg-x69x0sk.svg'
        : '/images/mo9um5rn-7c2lt1f.svg';
  const vector3083Image = isBabaContent
    ? '/images/mobeke4x-p65ti1s.svg'
    : isBrotherContent
      ? '/images/mobf4fjl-l23pudh.svg'
      : isSisterContent
        ? '/images/mobfkxr6-wj0pxf2.svg'
        : isGrandmaContent
          ? '/images/mobfsieg-1cq7qm2.svg'
        : '/images/mo9um5rn-kazjqud.svg';
  const vector3081Image = isBabaContent
    ? '/images/mobeke4x-44g3m5q.svg'
    : isBrotherContent
      ? '/images/mobf4fjl-lptnmua.svg'
      : isSisterContent
        ? '/images/mobfkxr6-5h1je6l.svg'
        : isGrandmaContent
          ? '/images/mobfsieh-ikjaowl.svg'
        : '/images/mo9um5rn-whl1wwz.svg';
  const vector3084Image = isBabaContent
    ? '/images/mobeke4x-hoxare7.svg'
    : isBrotherContent
      ? '/images/mobf4fjl-kwbsruq.svg'
      : isSisterContent
        ? '/images/mobfkxr6-15sw82i.svg'
        : isGrandmaContent
          ? '/images/mobfsieh-680u3ol.svg'
        : '/images/mo9um5rn-yqip2ji.svg';

  return (
    <div className="relative w-full min-h-screen flex justify-center bg-[#d8deea] overflow-hidden py-4">
      <div className="relative w-[393px] h-[852px] overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)] bg-[#daceff]">
        <div className="relative mt-[-10px] w-[395px] h-[862px]">
          <div className="absolute top-0 left-0 flex flex-col items-center bg-[#ffffffcc] pt-[10px] pb-[742px] w-[393px] h-[852px]">
            <div className="flex items-start self-stretch pt-[14px] pr-[14px] pb-[9px] pl-[21px]">
              <p className="w-[54px] text-center tracking-[-0.3px] text-[#222222] text-[15px] font-semibold">9:41</p>
              <img src="/images/mo9tq0dl-rhk4u97.svg" className="mt-[4px] ml-[233px] w-[18px] h-[11px]" alt="cellular" />
              <img src="/images/mo9tq0dl-pywaerl.svg" className="mt-[3px] ml-[5px] w-[16px] h-[11px]" alt="wifi" />
              <img src="/images/mo9tq0dl-po7n025.svg" className="mt-[3px] ml-[7px] w-[24px] h-[11px]" alt="battery" />
            </div>

            <div className="relative flex items-center px-4 py-2 w-[393px] overflow-hidden">
              <button
                type="button"
                className="flex items-center justify-center border border-[#2222220d] rounded-[12px] p-[11px] w-[40px] h-[40px]"
                onClick={() => navigate('/home-lost')}
              >
                <img src="/images/mo9tq0dl-bdejanv.svg" className="w-[20px] h-[20px]" alt="back" />
              </button>

              <div className="absolute top-[12px] left-[304px] flex items-center justify-between rounded-[12px] bg-[#7c5ae0] pr-1 pl-[7px] w-[73px] h-[32px]">
                <p className="w-[32px] text-center text-white text-[14px] font-semibold">ON</p>
                <img src="/images/mo9tq0dl-ydjaa9x.svg" className="w-[24px] h-[24px]" alt="switch" />
              </div>

              <p className="absolute top-[19px] left-[150px] z-[1] w-[95px] h-[22px] leading-[22px] text-[#140707] text-[19px]">肉派小助手</p>
            </div>
          </div>

          <div className="absolute top-[122px] left-[20px] w-[352px] h-[504px]">
            <div className="relative w-[352px] h-[504px]">
              <div
                className={`absolute top-[14px] left-[9px] flex flex-col items-start w-[338px] h-[480px] bg-center bg-cover bg-no-repeat drop-shadow-[0_4px_4px_rgba(176,176,176,0.25)] ${
                  isFamilyVariantContent ? 'pt-[39px] pr-[19px] pb-[22px] pl-[31px]' : 'pt-8 pr-[19px] pb-[22px] pl-[27px]'
                }`}
                style={{ backgroundImage: `url('${cardBackgroundImage}')` }}
              >
                <img
                  src={cardMainImage}
                  className={isFamilyVariantContent ? 'ml-[5px] w-[261px] h-[265px] rounded-[17px]' : 'w-[286px] h-[288px]'}
                  alt="assistant-content"
                />
                <p className={`flex items-center w-[277px] h-[60px] leading-5 text-black text-[14px] ${isFamilyVariantContent ? 'mt-[43px]' : 'mt-[27px] ml-1'}`}>{cardText}</p>
                <img
                  src={cardLogoImage}
                  className={isFamilyVariantContent ? 'mt-[33px] ml-[220px] w-[68px] h-[18px]' : 'mt-[33px] ml-[224px] w-[68px] h-[18px]'}
                  alt="ropet"
                />
              </div>

              <img src={vector3079Image} className="absolute top-[100px] left-[3px] w-[16px] h-[16px]" alt="" />
              <img src={vector3082Image} className="absolute top-[341px] left-[1px] w-[18px] h-[15px]" alt="" />
              <img src={vector3080Image} className="absolute top-[120px] left-[2px] w-[17px] h-[16px]" alt="" />
              <img src={vector3083Image} className="absolute top-[361px] left-[1px] w-[18px] h-[16px]" alt="" />
              <img src={vector3081Image} className="absolute top-[140px] left-[2px] w-[17px] h-[16px]" alt="" />
              <img src={vector3084Image} className="absolute top-[381px] left-[1px] w-[18px] h-[16px]" alt="" />
              <div className="absolute top-[393px] left-[9px] bg-white w-[4px] h-[5px]" />
              <div className="absolute top-[372px] left-[9px] bg-white w-[4px] h-[6px]" />
              <div className="absolute top-[352px] left-[9px] bg-white w-[4px] h-[6px]" />
            </div>
          </div>

          <div className="absolute top-[754px] left-[1px] flex items-start justify-between pt-0 pr-[21px] pb-[54px] pl-5 w-[394px] h-[108px]">
            <div className="flex items-center justify-center border-2 border-[#2222221a] rounded-[16px] px-[44px] py-[11px] w-[132px] h-[54px]">
              <p className="leading-5 text-[#222222] text-[14px] font-medium">删除</p>
            </div>
            <div className="flex items-center justify-center rounded-[16px] bg-[#7c5ae0] px-[46px] py-[13px] w-[209px] h-[54px]">
              <p className="leading-5 text-white text-[14px] font-medium">分享</p>
            </div>
          </div>

          <div className="absolute bottom-0 left-[1px] flex items-start pt-[21px] pr-[131px] pb-[8px] pl-[129px] w-[394px] h-[34px]">
            <div className="rounded-[100px] bg-[#222222] w-[134px] h-[5px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantContentPage;
