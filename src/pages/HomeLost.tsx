import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type DailyReminder = {
  id: number;
  text: string;
  time: string;
};
type CustomReminder = {
  id: number;
  text: string;
  time: string;
};

type Weekday = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

type FeedItem = {
  kind: 'surprise' | 'apathy' | 'heart' | 'none';
  text: string;
  time: string;
};

type FamilyMember = {
  id: 'grandma' | 'mama' | 'baba' | 'brother' | 'sister';
  label: string;
  avatar: string;
  badge?: string;
};

type FamilyReminderPreset = {
  custom: string;
  dailyMorning: string;
  dailyNight: string;
};

const HomeLost: React.FC = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [micPulse, setMicPulse] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const [customRemindersByFamily, setCustomRemindersByFamily] = useState<Record<FamilyMember['id'], CustomReminder[]>>({
    grandma: [{ id: 1, text: '提醒奶奶经常走动', time: '12 : 22 pm' }],
    mama: [{ id: 1, text: '提醒我饭后吃药', time: '12 : 22 pm' }],
    baba: [{ id: 1, text: '提醒爸爸早上慢跑10分钟', time: '12 : 22 pm' }],
    brother: [{ id: 1, text: '提醒我上学带书包', time: '12 : 22 pm' }],
    sister: [{ id: 1, text: '提醒姐姐早上7点起床洗漱', time: '12 : 22 pm' }],
  });
  const [dailyReminders, setDailyReminders] = useState<DailyReminder[]>([
    { id: 1, text: '叫mama早上8点起床', time: 'everyday' },
    { id: 2, text: '叫mama晚上11点睡觉', time: 'everyday' }
  ]);
  const [newReminderText, setNewReminderText] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [selectedWeekday, setSelectedWeekday] = useState<Weekday>('Sun');
  const [centerFamilyIndex, setCenterFamilyIndex] = useState(2);
  const [isCenterAvatarPop, setIsCenterAvatarPop] = useState(false);
  const [familyDotColor, setFamilyDotColor] = useState('#cfcfcf');
  const reminderScrollRef = useRef<HTMLDivElement | null>(null);
  const familyTouchStartXRef = useRef<number | null>(null);
  const familyPopTimerRef = useRef<number | null>(null);
  const dragActiveRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const nextReminderIdRef = useRef(3);
  const nextCustomReminderIdRef = useRef(2);

  const handleMicClick = () => {
    setIsRecording((prev) => !prev);
    setMicPulse(true);
    window.setTimeout(() => setMicPulse(false), 450);
  };

  const handleReminderPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!reminderScrollRef.current) return;
    dragActiveRef.current = true;
    startXRef.current = event.clientX;
    startScrollLeftRef.current = reminderScrollRef.current.scrollLeft;
  };

  const handleReminderPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragActiveRef.current || !reminderScrollRef.current) return;
    const deltaX = event.clientX - startXRef.current;
    reminderScrollRef.current.scrollLeft = startScrollLeftRef.current - deltaX;
  };

  const handleReminderPointerEnd = () => {
    dragActiveRef.current = false;
  };

  const getEditFontClass = (text: string) => {
    const len = text.replace(/\s/g, '').length;
    if (len > 42) return 'text-[8px] leading-[10px]';
    if (len > 34) return 'text-[9px] leading-[12px]';
    if (len > 26) return 'text-[10px] leading-[13px]';
    if (len > 20) return 'text-[11px] leading-[14px]';
    if (len > 14) return 'text-[12px] leading-[16px]';
    if (len > 10) return 'text-[14px] leading-[18px]';
    return 'text-[16px] leading-[21px]';
  };

  const getFeedEmoji = (item: FeedItem) => {
    if (/做得很好|鼓励|努力|坚持|加把劲|别放弃/.test(item.text)) return '💪';
    if (item.kind === 'heart' || /闷闷不乐|难过|陪着你|开心/.test(item.text)) return '❤️';
    if (/困|起床|早安|睡/.test(item.text)) return '🥱';
    if (item.kind === 'apathy' || /久坐|活动|喝水/.test(item.text)) return '😐';
    return '🙂';
  };

  const formatNowTime = () => {
    const now = new Date();
    const hour24 = now.getHours();
    const minute = now.getMinutes();
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const meridiem = hour24 >= 12 ? 'pm' : 'am';
    return `${String(hour12).padStart(2, '0')} : ${String(minute).padStart(2, '0')} ${meridiem}`;
  };

  const weekdayList: Weekday[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mamaDayFeedMap: Record<Weekday, FeedItem[]> = {
    Sun: [
      { kind: 'surprise', text: 'mama 起床啦，看起来有点困，先伸个懒腰再起床 。', time: '08 : 22 am' },
      { kind: 'apathy', text: 'mama 坐太久了呀，站起来走两步，还要记得喝口水哦。', time: '09 : 22 am' },
      { kind: 'none', text: '我发现你最近都睡得更晚些，要不要把睡觉提醒改到 23:30？', time: '10 : 28 am' },
      { kind: 'heart', text: '看到 mama 闷闷不乐啦，别难过，我会一直紧紧陪着你！', time: '11 : 22 am' },
      { kind: 'heart', text: 'mama 要下班啦，记得穿好外套哦，今天外面刮大风啦。', time: '08 : 22 am' },
      { kind: 'apathy', text: '今天屏幕时间有点长，记得让眼睛休息一下。', time: '12 : 05 pm' },
      { kind: 'none', text: '下午任务较多，先从最简单的一件开始吧。', time: '01 : 16 pm' },
      { kind: 'heart', text: '做得很好，今天每一步都在进步。', time: '02 : 30 pm' },
      { kind: 'surprise', text: '喝水提醒：现在补一杯温水正合适。', time: '03 : 40 pm' },
      { kind: 'none', text: '今晚想早睡的话，我可以提前 30 分钟提醒你。', time: '08 : 12 pm' },
      { kind: 'heart', text: '辛苦啦，记得给自己一点放松时间。', time: '09 : 05 pm' },
      { kind: 'apathy', text: '坐姿有点久了，起来活动下颈肩吧。', time: '09 : 48 pm' }
    ],
    Mon: [
      { kind: 'surprise', text: 'mama 早安，今天也要慢慢来，我会一直陪着你。', time: '08 : 05 am' },
      { kind: 'apathy', text: '久坐提醒：起来活动两分钟，肩颈会舒服很多。', time: '10 : 10 am' },
      { kind: 'none', text: '你已经做得很好啦，记得给自己一点鼓励。', time: '03 : 40 pm' },
      { kind: 'heart', text: '中午记得按时吃饭，下午状态会更好。', time: '12 : 18 pm' },
      { kind: 'heart', text: '今晚回家路上注意保暖，风有点大。', time: '06 : 25 pm' }
    ],
    Tue: [
      { kind: 'surprise', text: 'mama 起床后先喝一口温水吧。', time: '07 : 58 am' },
      { kind: 'apathy', text: '久坐有一会儿了，起来活动下肩膀和颈部。', time: '11 : 06 am' },
      { kind: 'none', text: '今晚可能会晚睡，要不要把睡眠提醒提前 20 分钟？', time: '09 : 48 pm' },
      { kind: 'heart', text: '别给自己太大压力，你已经很棒啦。', time: '04 : 20 pm' },
      { kind: 'heart', text: '下班后记得带上钥匙和充电器。', time: '06 : 10 pm' }
    ],
    Wed: [
      { kind: 'surprise', text: 'mama 早呀，今天先做一件最重要的小事吧。', time: '08 : 15 am' },
      { kind: 'apathy', text: '你已经连续工作很久啦，站起来走走再继续。', time: '11 : 20 am' },
      { kind: 'none', text: '今天节奏有点紧，要不要把提醒频率调低一点？', time: '01 : 18 pm' },
      { kind: 'heart', text: '心情低落时也没关系，我在。', time: '03 : 06 pm' },
      { kind: 'heart', text: '下班路上记得带伞，晚上可能有风。', time: '06 : 06 pm' }
    ],
    Thu: [
      { kind: 'surprise', text: '今日提醒：饭后吃药，别忘啦。', time: '12 : 25 pm' },
      { kind: 'apathy', text: '坐太久了，活动一下腿部会更舒服。', time: '02 : 30 pm' },
      { kind: 'none', text: '我发现你今天喝水偏少，记得补水哦。', time: '03 : 40 pm' },
      { kind: 'heart', text: '你在努力前进，我一直为你加油。', time: '05 : 18 pm' },
      { kind: 'heart', text: '今晚早点休息，明天会更有精神。', time: '09 : 02 pm' },
      { kind: 'none', text: '晚餐后散步 10 分钟，会更放松。', time: '07 : 06 pm' },
      { kind: 'apathy', text: '注意补充水分，今天气候偏干。', time: '08 : 11 pm' },
      { kind: 'heart', text: '今天也很棒，给自己一个微笑。', time: '09 : 35 pm' }
    ],
    Fri: [
      { kind: 'apathy', text: '今天步数偏少，晚点出去散散步吗？', time: '05 : 35 pm' },
      { kind: 'apathy', text: '午后有点疲惫，起来走动两分钟吧。', time: '02 : 26 pm' },
      { kind: 'none', text: '周末作息计划要不要提前定一下？', time: '09 : 12 pm' },
      { kind: 'heart', text: '辛苦一周啦，今晚可以奖励自己一下。', time: '07 : 45 pm' },
      { kind: 'heart', text: '明天睡个好觉，把电量补满。', time: '10 : 18 pm' }
    ],
    Sat: [
      { kind: 'surprise', text: '周末快乐！今天想听你分享一件开心的小事。', time: '09 : 00 am' },
      { kind: 'apathy', text: '久坐提醒：起来走走，顺便喝口水。', time: '11 : 10 am' },
      { kind: 'none', text: '今天安排很满，记得给自己留一点休息时间。', time: '01 : 35 pm' },
      { kind: 'heart', text: '你已经很努力啦，慢一点也没关系。', time: '04 : 05 pm' },
      { kind: 'heart', text: '晚上外出记得加件外套。', time: '07 : 30 pm' },
      { kind: 'surprise', text: '早餐记得吃，能量会更稳定。', time: '09 : 40 am' },
      { kind: 'none', text: '下午安排两件最重要的小任务就很好。', time: '02 : 20 pm' },
      { kind: 'apathy', text: '眼睛有点疲劳，远眺 20 秒吧。', time: '03 : 26 pm' },
      { kind: 'heart', text: '今天也有很多闪光点，继续保持。', time: '06 : 12 pm' },
      { kind: 'none', text: '睡前把明天待办写 3 条，会更安心。', time: '10 : 08 pm' }
    ]
  };

  const handleAddDailyReminder = () => {
    if (newReminderText !== null) return;
    setNewReminderText('');
    setEditingCard('new');
  };

  const handleConfirmNewReminder = () => {
    if (newReminderText === null) return;
    if (newReminderText.replace(/\s/g, '').length > 0) {
      const nextId = nextReminderIdRef.current;
      nextReminderIdRef.current += 1;
      setDailyReminders((prev) => [{ id: nextId, text: newReminderText, time: 'everyday' }, ...prev]);
    }
    setNewReminderText(null);
    setEditingCard(null);
  };

  const updateDailyReminderText = (id: number, text: string) => {
    setDailyReminders((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)));
  };

  const updateCustomReminderText = (id: number, text: string) => {
    setCustomRemindersByFamily((prev) => ({
      ...prev,
      [currentFamilyId]: prev[currentFamilyId].map((item) => (item.id === id ? { ...item, text } : item))
    }));
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const value = inputValue.trim();
    if (!value) return;
    const nextId = nextCustomReminderIdRef.current;
    nextCustomReminderIdRef.current += 1;
    setCustomRemindersByFamily((prev) => ({
      ...prev,
      [currentFamilyId]: [{ id: nextId, text: value, time: formatNowTime() }, ...prev[currentFamilyId]]
    }));
    setInputValue('');
  };

  const handleSwitchClick = () => {
    setIsSwitchOn((prev) => !prev);
  };

  const familyMembers: FamilyMember[] = [
    { id: 'grandma', label: '外婆', avatar: '/images/mobbuc07-qg814av.svg', badge: '2' },
    { id: 'mama', label: '妈妈', avatar: '/images/mobbuc02-vudflq1.svg' },
    { id: 'baba', label: '爸爸', avatar: '/images/mobal5ah-gjfrjio.svg' },
    { id: 'brother', label: '弟弟', avatar: '/images/mobbuc0e-rwlaldf.svg', badge: '1' },
    { id: 'sister', label: '姐姐', avatar: '/images/mobbuc0a-zss99oa.svg' }
  ];
  const familyReminderPresets: Record<FamilyMember['id'], FamilyReminderPreset> = {
    grandma: {
      custom: '提醒奶奶经常走动',
      dailyMorning: '提醒奶奶早上8点吃药',
      dailyNight: '提醒奶奶晚上7点吃药'
    },
    mama: {
      custom: '提醒我饭后吃药',
      dailyMorning: '叫mama早上8点起床',
      dailyNight: '叫mama晚上11点睡觉'
    },
    baba: {
      custom: '提醒爸爸早上慢跑10分钟',
      dailyMorning: '叫爸爸早上6点起床做早饭',
      dailyNight: '晚上安排大家上床睡觉'
    },
    brother: {
      custom: '提醒我上学带书包',
      dailyMorning: '叫弟弟早上7点起床吃饭',
      dailyNight: '叫弟弟晚上九点睡觉'
    },
    sister: {
      custom: '提醒姐姐早上7点起床洗漱',
      dailyMorning: '提醒姐姐记得带好书包',
      dailyNight: '提醒姐姐晚上10点睡觉'
    }
  };
  const familyDayFeedMap: Record<FamilyMember['id'], Record<Weekday, FeedItem[]>> = {
    mama: mamaDayFeedMap,
    brother: {
      Sun: [
        { kind: 'surprise', text: '弟弟起床啦，今天上学前记得把书包和水杯都检查一遍。', time: '07 : 05 am' },
        { kind: 'none', text: '早餐要吃好一点，去学校才更有精神。', time: '07 : 18 am' },
        { kind: 'apathy', text: '写作业坐久了，起来活动活动肩膀和腿。', time: '04 : 25 pm' },
        { kind: 'heart', text: '今天有认真完成任务，记得夸夸弟弟自己。', time: '05 : 10 pm' },
        { kind: 'surprise', text: '放学回家先把书包整理好，明天会轻松很多。', time: '06 : 08 pm' },
        { kind: 'none', text: '晚饭别挑食，吃饱了晚上学习状态更稳。', time: '06 : 45 pm' },
        { kind: 'apathy', text: '眼睛看书有点久了，远眺 20 秒休息一下。', time: '07 : 16 pm' },
        { kind: 'heart', text: '今天做得不错，哪怕只进步一点点也很棒。', time: '07 : 42 pm' },
        { kind: 'surprise', text: '作业完成后把第二天课程用品提前放进书包。', time: '08 : 10 pm' },
        { kind: 'none', text: '洗漱前记得把闹钟调好，明天起床不会慌张。', time: '08 : 36 pm' },
        { kind: 'heart', text: '准备睡觉啦，早点休息身体会更有力气。', time: '08 : 55 pm' },
        { kind: 'apathy', text: '睡前别一直看屏幕，眼睛和大脑都要放松。', time: '09 : 05 pm' }
      ],
      Mon: [
        { kind: 'surprise', text: '弟弟早安，今天上学前别忘了胸卡和作业本。', time: '06 : 58 am' },
        { kind: 'none', text: '第一节课前先喝两口水，嗓子会舒服些。', time: '08 : 10 am' },
        { kind: 'apathy', text: '放学写作业前先站起来活动两分钟。', time: '05 : 05 pm' },
        { kind: 'heart', text: '今天上课认真听讲就已经很棒啦。', time: '06 : 20 pm' },
        { kind: 'none', text: '晚上九点前准备睡觉，明天起床会轻松很多。', time: '08 : 40 pm' }
      ],
      Tue: [
        { kind: 'surprise', text: '弟弟出门前看看书包里有没有装好语文书。', time: '07 : 00 am' },
        { kind: 'apathy', text: '下午做题久了，记得活动手腕和脖子。', time: '04 : 48 pm' },
        { kind: 'none', text: '回家先整理书桌，再开始写作业会更快。', time: '05 : 26 pm' },
        { kind: 'heart', text: '今天每完成一项任务，都值得给自己一个赞。', time: '06 : 12 pm' },
        { kind: 'none', text: '睡前把第二天要带的东西提前放门口。', time: '08 : 58 pm' }
      ],
      Wed: [
        { kind: 'surprise', text: '弟弟起床啦，今天记得带好书包和水壶。', time: '07 : 02 am' },
        { kind: 'apathy', text: '放学后先伸伸腰，再坐下写作业。', time: '04 : 35 pm' },
        { kind: 'none', text: '晚饭后把不会的题目单独标出来，等会更好复习。', time: '06 : 30 pm' },
        { kind: 'heart', text: '坚持完成今天的小目标，已经非常棒。', time: '07 : 22 pm' },
        { kind: 'none', text: '九点前上床休息，明天精神更好。', time: '08 : 46 pm' }
      ],
      Thu: [
        { kind: 'surprise', text: '弟弟出门前再确认一次作业本有没有带齐。', time: '06 : 56 am' },
        { kind: 'none', text: '课间记得多喝水，别让嗓子太干。', time: '10 : 08 am' },
        { kind: 'apathy', text: '写字时间太长了，起来活动下手臂吧。', time: '05 : 02 pm' },
        { kind: 'heart', text: '今天也有认真努力，继续保持。', time: '06 : 16 pm' },
        { kind: 'none', text: '睡前把明天校服准备好，早上会更从容。', time: '08 : 52 pm' },
        { kind: 'apathy', text: '眼睛累了就看远一点，休息 20 秒。', time: '07 : 40 pm' },
        { kind: 'heart', text: '学习累了也没关系，慢慢来就好。', time: '08 : 05 pm' },
        { kind: 'none', text: '刷牙洗脸后就准备睡觉啦。', time: '09 : 00 pm' }
      ],
      Fri: [
        { kind: 'surprise', text: '弟弟今天周五啦，上学前别忘带回执单。', time: '07 : 04 am' },
        { kind: 'apathy', text: '做完作业后起来走走，放松一下腿脚。', time: '05 : 18 pm' },
        { kind: 'none', text: '周末计划可以提前想一想，但先把今天任务完成。', time: '06 : 24 pm' },
        { kind: 'heart', text: '辛苦一周了，今天也值得被表扬。', time: '07 : 35 pm' },
        { kind: 'none', text: '晚上按时睡，周末也别熬太晚。', time: '09 : 02 pm' }
      ],
      Sat: [
        { kind: 'surprise', text: '弟弟周末也别忘了整理书包，下周会轻松很多。', time: '08 : 30 am' },
        { kind: 'none', text: '上午先把最重要的作业做完，下午就更轻松。', time: '10 : 05 am' },
        { kind: 'apathy', text: '坐着看书太久了，起来活动一下吧。', time: '03 : 16 pm' },
        { kind: 'heart', text: '今天认真完成一点点，也是在进步。', time: '05 : 12 pm' },
        { kind: 'none', text: '晚上九点前准备睡觉，明天状态更好。', time: '08 : 40 pm' },
        { kind: 'surprise', text: '记得把铅笔盒和课本收回固定位置。', time: '06 : 10 pm' },
        { kind: 'apathy', text: '看屏幕时间有点长，休息一下眼睛。', time: '07 : 06 pm' },
        { kind: 'heart', text: '今天也值得给自己一个大拇指。', time: '07 : 50 pm' },
        { kind: 'none', text: '睡前把明天想做的事写一小条吧。', time: '08 : 22 pm' },
        { kind: 'surprise', text: '睡前别忘了把水杯放回书包旁边。', time: '08 : 55 pm' }
      ]
    },
    baba: {
      Sun: [
        { kind: 'surprise', text: '爸爸早上慢跑 10 分钟，身体会更舒展。', time: '06 : 05 am' },
        { kind: 'none', text: '做早饭前先喝杯温水，整个人会更清醒。', time: '06 : 20 am' },
        { kind: 'heart', text: '今天照顾大家很辛苦，也记得照顾自己。', time: '08 : 10 am' },
        { kind: 'apathy', text: '工作久了起来活动下肩背，别一直坐着。', time: '11 : 18 am' },
        { kind: 'none', text: '中午抽空休息 15 分钟，下午状态会更好。', time: '01 : 05 pm' },
        { kind: 'heart', text: '今天的安排已经很满了，慢一点也没关系。', time: '03 : 12 pm' },
        { kind: 'apathy', text: '如果腰有点酸，站起来走几步再继续。', time: '04 : 26 pm' },
        { kind: 'surprise', text: '傍晚记得带大家早点准备晚饭和洗漱。', time: '06 : 08 pm' },
        { kind: 'none', text: '晚饭后带大家收拾一下，家里会更轻松。', time: '07 : 02 pm' },
        { kind: 'heart', text: '今天爸爸很可靠，家里人都感受得到。', time: '08 : 00 pm' },
        { kind: 'surprise', text: '晚上安排大家上床睡觉，明天精神更好。', time: '09 : 05 pm' },
        { kind: 'none', text: '睡前把明早要做的事在脑子里顺一遍就够了。', time: '09 : 35 pm' }
      ],
      Mon: [
        { kind: 'surprise', text: '爸爸早起做早饭前先活动一下四肢。', time: '05 : 58 am' },
        { kind: 'none', text: '上班前检查钥匙和证件，别落东西。', time: '07 : 20 am' },
        { kind: 'apathy', text: '工作忙的时候也记得起来走动两分钟。', time: '11 : 40 am' },
        { kind: 'heart', text: '今天做得已经很好，不必给自己太多压力。', time: '05 : 50 pm' },
        { kind: 'none', text: '晚饭后安排全家早点洗漱休息。', time: '08 : 48 pm' }
      ],
      Tue: [
        { kind: 'surprise', text: '爸爸出门前记得把早餐和水都准备好。', time: '06 : 12 am' },
        { kind: 'apathy', text: '长时间开车或坐着后，活动下腿和肩膀。', time: '10 : 55 am' },
        { kind: 'none', text: '下午抽空补一杯水，别一直忙到忘记。', time: '03 : 10 pm' },
        { kind: 'heart', text: '一家人都很依赖你，但你也要记得休息。', time: '06 : 30 pm' },
        { kind: 'none', text: '晚上早点安排大家睡觉，明早不会慌。', time: '09 : 12 pm' }
      ],
      Wed: [
        { kind: 'surprise', text: '爸爸今天也从一顿热早餐开始吧。', time: '06 : 08 am' },
        { kind: 'apathy', text: '肩膀有点紧的话，试试转一转放松一下。', time: '11 : 08 am' },
        { kind: 'none', text: '中午别只顾着忙，吃饭要按时。', time: '12 : 28 pm' },
        { kind: 'heart', text: '今天每一步安排都很稳，继续保持。', time: '06 : 05 pm' },
        { kind: 'none', text: '睡前把明天早饭要用的食材先想好。', time: '09 : 02 pm' }
      ],
      Thu: [
        { kind: 'surprise', text: '爸爸早上慢跑一下，今天状态会更好。', time: '06 : 00 am' },
        { kind: 'none', text: '出门前确认煤气、电器都检查过。', time: '07 : 18 am' },
        { kind: 'apathy', text: '坐久了腰背会酸，起来活动活动。', time: '02 : 16 pm' },
        { kind: 'heart', text: '今天照顾家里和工作都很不容易，辛苦啦。', time: '06 : 42 pm' },
        { kind: 'none', text: '晚上记得督促大家早点上床睡觉。', time: '09 : 00 pm' },
        { kind: 'surprise', text: '晚饭后散步 10 分钟，会更放松。', time: '07 : 08 pm' },
        { kind: 'heart', text: '你做的每件小事都在照顾这个家。', time: '08 : 10 pm' },
        { kind: 'none', text: '睡前把第二天安排在心里过一遍即可。', time: '09 : 22 pm' }
      ],
      Fri: [
        { kind: 'surprise', text: '爸爸周五也别忘了晨间拉伸和喝水。', time: '06 : 06 am' },
        { kind: 'apathy', text: '忙到中午了，站起来活动两分钟吧。', time: '12 : 05 pm' },
        { kind: 'none', text: '晚饭前先想好周末全家的安排。', time: '05 : 42 pm' },
        { kind: 'heart', text: '这一周辛苦了，今晚早点休息。', time: '07 : 30 pm' },
        { kind: 'none', text: '睡前安排好孩子们的作息，明天会轻松很多。', time: '09 : 08 pm' }
      ],
      Sat: [
        { kind: 'surprise', text: '爸爸周末也别忘了晨跑和简单拉伸。', time: '07 : 10 am' },
        { kind: 'none', text: '今天可以带大家安排点轻松的家庭活动。', time: '10 : 18 am' },
        { kind: 'apathy', text: '忙家务一阵子后，坐下休息两分钟。', time: '02 : 30 pm' },
        { kind: 'heart', text: '家里因为有你会更踏实，辛苦啦。', time: '05 : 05 pm' },
        { kind: 'none', text: '晚上提前安排大家洗漱休息，节奏会更顺。', time: '08 : 46 pm' },
        { kind: 'surprise', text: '出门前检查钥匙和手机，别匆忙忘带。', time: '11 : 06 am' },
        { kind: 'apathy', text: '搬动东西后活动下腰背，别硬撑。', time: '04 : 18 pm' },
        { kind: 'heart', text: '今天的陪伴对家人来说很重要。', time: '06 : 10 pm' },
        { kind: 'none', text: '睡前把明天早餐思路定一下就好。', time: '09 : 16 pm' },
        { kind: 'surprise', text: '记得给自己也留一点安静放松时间。', time: '09 : 40 pm' }
      ]
    },
    sister: {
      Sun: [
        { kind: 'surprise', text: '姐姐早上 7 点起床洗漱，别赖床太久哦。', time: '07 : 00 am' },
        { kind: 'none', text: '出门前记得带好书包和水杯。', time: '07 : 18 am' },
        { kind: 'heart', text: '今天也会是认真又闪闪发光的一天。', time: '08 : 22 am' },
        { kind: 'apathy', text: '写作业久了就起来活动一下肩膀。', time: '04 : 36 pm' },
        { kind: 'none', text: '放学回家先把书包整理好，明天会更轻松。', time: '05 : 25 pm' },
        { kind: 'heart', text: '如果今天有点累，慢一点也没有关系。', time: '06 : 10 pm' },
        { kind: 'surprise', text: '晚上把要交的作业提前放进书包里。', time: '07 : 05 pm' },
        { kind: 'apathy', text: '眼睛有点累了，离开屏幕休息一下。', time: '07 : 42 pm' },
        { kind: 'none', text: '睡前先把闹钟设好，明早不会着急。', time: '08 : 20 pm' },
        { kind: 'heart', text: '今天已经很努力啦，值得给自己一个拥抱。', time: '08 : 48 pm' },
        { kind: 'surprise', text: '晚上 10 点前准备睡觉，明天精神会更好。', time: '09 : 30 pm' },
        { kind: 'none', text: '睡前把校服和发绳放好，明天更从容。', time: '09 : 45 pm' }
      ],
      Mon: [
        { kind: 'surprise', text: '姐姐早安，书包和作业本都带好了吗？', time: '06 : 58 am' },
        { kind: 'none', text: '出门前照照镜子，别忘了整理发型。', time: '07 : 12 am' },
        { kind: 'apathy', text: '放学写作业前先活动两分钟更舒服。', time: '05 : 08 pm' },
        { kind: 'heart', text: '今天认真完成任务就已经很棒啦。', time: '06 : 26 pm' },
        { kind: 'none', text: '晚上 10 点前记得准备睡觉。', time: '09 : 22 pm' }
      ],
      Tue: [
        { kind: 'surprise', text: '姐姐别忘了把水杯和作业本带进书包。', time: '07 : 05 am' },
        { kind: 'apathy', text: '久坐写字后要起来活动一下脖子。', time: '04 : 42 pm' },
        { kind: 'none', text: '回家后先洗漱换衣服，再开始做事。', time: '05 : 18 pm' },
        { kind: 'heart', text: '今天每一点努力都会慢慢变成进步。', time: '06 : 40 pm' },
        { kind: 'none', text: '睡前把明早要穿的衣服准备好。', time: '09 : 16 pm' }
      ],
      Wed: [
        { kind: 'surprise', text: '姐姐今天也从整齐的洗漱开始吧。', time: '07 : 02 am' },
        { kind: 'none', text: '记得看看书包里有没有少带课本。', time: '07 : 22 am' },
        { kind: 'apathy', text: '下午有点累的话，先伸伸懒腰再继续。', time: '04 : 55 pm' },
        { kind: 'heart', text: '今天也很好，别忘了给自己一点鼓励。', time: '06 : 18 pm' },
        { kind: 'none', text: '晚上早点睡，明天起床会更轻松。', time: '09 : 05 pm' }
      ],
      Thu: [
        { kind: 'surprise', text: '姐姐出门前再确认一下书包拉链和文具盒。', time: '06 : 57 am' },
        { kind: 'none', text: '上午记得多喝水，保持状态。', time: '10 : 16 am' },
        { kind: 'apathy', text: '写作业太久啦，起来走两步再继续。', time: '05 : 12 pm' },
        { kind: 'heart', text: '今天认真坚持下去就很了不起。', time: '06 : 22 pm' },
        { kind: 'none', text: '睡前把第二天的东西收好，别到早上慌张。', time: '09 : 14 pm' },
        { kind: 'surprise', text: '洗漱完后早点关灯休息。', time: '09 : 40 pm' },
        { kind: 'heart', text: '今天的努力我都看见啦。', time: '08 : 18 pm' },
        { kind: 'none', text: '明天要用的本子记得放最上面。', time: '08 : 42 pm' }
      ],
      Fri: [
        { kind: 'surprise', text: '姐姐周五上学前记得带好作业和水杯。', time: '07 : 06 am' },
        { kind: 'apathy', text: '放学回家后先休息一小会儿再继续。', time: '05 : 06 pm' },
        { kind: 'none', text: '周末计划可以想，但先把今天事情做好。', time: '06 : 12 pm' },
        { kind: 'heart', text: '这周辛苦啦，今晚早点睡更舒服。', time: '08 : 06 pm' },
        { kind: 'none', text: '10 点前上床睡觉，明早会轻松很多。', time: '09 : 18 pm' }
      ],
      Sat: [
        { kind: 'surprise', text: '姐姐周末也记得把书包整理好，避免下周手忙脚乱。', time: '08 : 20 am' },
        { kind: 'none', text: '上午先完成最重要的一件事，后面会轻松些。', time: '10 : 12 am' },
        { kind: 'apathy', text: '坐着太久了，起来活动活动再继续。', time: '03 : 08 pm' },
        { kind: 'heart', text: '今天的每一点坚持都很值得。', time: '05 : 00 pm' },
        { kind: 'none', text: '晚上 10 点左右就准备休息吧。', time: '09 : 08 pm' },
        { kind: 'surprise', text: '洗漱用品和发圈记得放回原位。', time: '06 : 20 pm' },
        { kind: 'apathy', text: '眼睛累了就看远一点，别一直盯着屏幕。', time: '07 : 12 pm' },
        { kind: 'heart', text: '今天也有很多值得表扬的小地方。', time: '08 : 16 pm' },
        { kind: 'none', text: '明天的出门物品可以提前准备。', time: '08 : 42 pm' },
        { kind: 'surprise', text: '睡前把闹钟和充电器都检查一下。', time: '09 : 28 pm' }
      ]
    },
    grandma: {
      Sun: [
        { kind: 'surprise', text: '奶奶早上起床后先慢慢活动一下腿脚。', time: '07 : 35 am' },
        { kind: 'none', text: '早饭后记得按时吃药，不要忘啦。', time: '08 : 02 am' },
        { kind: 'apathy', text: '坐久了就起来在屋里走一走，腿会舒服些。', time: '10 : 26 am' },
        { kind: 'heart', text: '今天阳光不错，奶奶心情也要亮亮的。', time: '11 : 18 am' },
        { kind: 'none', text: '中午吃饭别着急，慢慢吃更舒服。', time: '12 : 10 pm' },
        { kind: 'apathy', text: '下午记得多活动手脚，别一直坐着。', time: '02 : 42 pm' },
        { kind: 'heart', text: '今天身体状态不错的话，可以在家里多走几步。', time: '03 : 36 pm' },
        { kind: 'surprise', text: '傍晚别忘了喝点温水，嗓子会舒服些。', time: '05 : 08 pm' },
        { kind: 'none', text: '晚上 7 点的药要按时吃，别拖太晚。', time: '06 : 50 pm' },
        { kind: 'heart', text: '奶奶今天也要照顾好自己，大家都会更放心。', time: '07 : 16 pm' },
        { kind: 'apathy', text: '看电视久了就站起来走几步活动活动。', time: '08 : 05 pm' },
        { kind: 'none', text: '睡前把明早的药和水先放好会更方便。', time: '08 : 42 pm' }
      ],
      Mon: [
        { kind: 'surprise', text: '奶奶起床后先伸伸腿，再开始一天。', time: '07 : 40 am' },
        { kind: 'none', text: '早上 8 点的药记得吃。', time: '08 : 00 am' },
        { kind: 'apathy', text: '上午坐久了就起来慢慢走一会儿。', time: '10 : 30 am' },
        { kind: 'heart', text: '今天也请奶奶多照顾自己一点。', time: '03 : 18 pm' },
        { kind: 'none', text: '晚上 7 点别忘了按时吃药。', time: '06 : 52 pm' }
      ],
      Tue: [
        { kind: 'surprise', text: '奶奶早上记得先喝点温水。', time: '07 : 28 am' },
        { kind: 'none', text: '吃完早饭后按时服药会更稳妥。', time: '08 : 06 am' },
        { kind: 'apathy', text: '下午记得在家里多走动几分钟。', time: '03 : 10 pm' },
        { kind: 'heart', text: '今天精神不错的话，可以晒晒太阳。', time: '04 : 40 pm' },
        { kind: 'none', text: '晚上药要提前准备好，别忘记。', time: '06 : 48 pm' }
      ],
      Wed: [
        { kind: 'surprise', text: '奶奶早安，今天也从慢慢活动开始。', time: '07 : 32 am' },
        { kind: 'none', text: '饭后按时吃药，身体会更安心。', time: '08 : 08 am' },
        { kind: 'apathy', text: '看电视久了，起来走动两圈吧。', time: '11 : 20 am' },
        { kind: 'heart', text: '奶奶笑一笑，今天也会是舒服的一天。', time: '03 : 42 pm' },
        { kind: 'none', text: '晚上 7 点记得吃药。', time: '06 : 56 pm' }
      ],
      Thu: [
        { kind: 'surprise', text: '奶奶起床后先活动下膝盖和手臂。', time: '07 : 26 am' },
        { kind: 'none', text: '早上药放在显眼处，吃完更放心。', time: '08 : 03 am' },
        { kind: 'apathy', text: '下午别一直坐着，慢慢走动几步。', time: '02 : 56 pm' },
        { kind: 'heart', text: '今天天气还不错，可以在窗边晒晒太阳。', time: '04 : 12 pm' },
        { kind: 'none', text: '晚上 7 点的药别忘了。', time: '06 : 50 pm' },
        { kind: 'apathy', text: '腿脚有点僵时，站起来缓一缓。', time: '05 : 26 pm' },
        { kind: 'heart', text: '奶奶今天也要保持好心情。', time: '07 : 22 pm' },
        { kind: 'none', text: '睡前把明早吃药的水杯放好。', time: '08 : 18 pm' }
      ],
      Fri: [
        { kind: 'surprise', text: '奶奶今天也先慢慢起床，不着急。', time: '07 : 38 am' },
        { kind: 'none', text: '早饭后按时吃药，别漏掉。', time: '08 : 02 am' },
        { kind: 'apathy', text: '中午后记得多活动一下手脚。', time: '01 : 48 pm' },
        { kind: 'heart', text: '身体舒服一点的时候，心情也会更好。', time: '04 : 30 pm' },
        { kind: 'none', text: '晚上 7 点药物提醒已到。', time: '06 : 58 pm' }
      ],
      Sat: [
        { kind: 'surprise', text: '奶奶周末也记得慢慢活动身体。', time: '08 : 05 am' },
        { kind: 'none', text: '早上 8 点药别忘记吃。', time: '08 : 12 am' },
        { kind: 'apathy', text: '坐久了就起来在房间里走走。', time: '11 : 16 am' },
        { kind: 'heart', text: '奶奶今天状态不错，要继续保持哦。', time: '03 : 10 pm' },
        { kind: 'none', text: '晚上 7 点记得服药。', time: '06 : 50 pm' },
        { kind: 'surprise', text: '喝点温水，嗓子和胃都会舒服一点。', time: '09 : 20 am' },
        { kind: 'apathy', text: '下午晒晒太阳再活动几步会更放松。', time: '02 : 06 pm' },
        { kind: 'heart', text: '今天也要开开心心过一天。', time: '05 : 02 pm' },
        { kind: 'none', text: '睡前把明天药物准备在手边。', time: '08 : 10 pm' },
        { kind: 'surprise', text: '休息前记得关好窗，别着凉。', time: '08 : 38 pm' }
      ]
    }
  };

  const rotateFamily = (delta: number) => {
    const total = familyMembers.length;
    setCenterFamilyIndex((prev) => {
      const next = (prev + delta + total) % total;
      setFamilyDotColor(getFamilyColorById(familyMembers[next].id));
      return next;
    });
  };

  const triggerCenterAvatarPop = () => {
    setIsCenterAvatarPop(true);
    if (familyPopTimerRef.current !== null) {
      window.clearTimeout(familyPopTimerRef.current);
    }
    familyPopTimerRef.current = window.setTimeout(() => {
      setIsCenterAvatarPop(false);
      familyPopTimerRef.current = null;
    }, 180);
  };

  const handleFamilyPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    familyTouchStartXRef.current = event.clientX;
  };

  const handleFamilyPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (familyTouchStartXRef.current === null) return;
    const delta = event.clientX - familyTouchStartXRef.current;
    if (Math.abs(delta) > 24) {
      rotateFamily(delta < 0 ? 1 : -1);
    }
    familyTouchStartXRef.current = null;
  };

  const getFamilyByOffset = (offset: number) => {
    const total = familyMembers.length;
    return familyMembers[(centerFamilyIndex + offset + total) % total];
  };

  const getFamilyColorById = (id: FamilyMember['id']) => {
    if (id === 'mama') return '#61de70';
    if (id === 'grandma') return '#ff4d4f';
    if (id === 'brother') return '#4f88ff';
    if (id === 'sister') return '#ffc239';
    return '#cfcfcf';
  };
  const getCustomCardColor = (id: FamilyMember['id']) => {
    if (id === 'baba') return '#bfa8ff';
    if (id === 'grandma') return '#ff4d4f';
    if (id === 'mama') return '#61de70';
    if (id === 'brother') return '#4f88ff';
    if (id === 'sister') return '#ffc239';
    return '#cfcfcf';
  };
  const currentFamilyId = familyMembers[centerFamilyIndex].id;
  const currentDayFeeds = familyDayFeedMap[currentFamilyId][selectedWeekday];

  const applyFamilyReminderPreset = (id: FamilyMember['id']) => {
    const preset = familyReminderPresets[id];
    setDailyReminders((prev) =>
      prev.map((item, index) => {
        if (index === 0) return { ...item, text: preset.dailyMorning };
        if (index === 1) return { ...item, text: preset.dailyNight };
        return item;
      })
    );
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex justify-center bg-[#d8deea] py-4">
      <div className="relative w-[393px] h-[852px] overflow-hidden bg-[#daceff] rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        <div
          className={`absolute inset-0 ${isSwitchOn ? 'bg-[#ffffffcc]' : 'bg-[#ffffffcc]'}`}
          style={{ filter: isSwitchOn ? 'none' : 'grayscale(1) brightness(0.86)' }}
        >
          <div className="flex items-start px-[21px] pt-[14px] pb-[9px]">
            <p className="w-[54px] text-center text-[15px] text-[#222222] font-semibold tracking-[-0.3px]">9:41</p>
            <img src="/images/mo8lqwf4-x0x2r72.svg" className="mt-[4px] ml-[233px] w-[18px] h-[11px]" alt="cellular" />
            <img src="/images/mo8lqwf4-i7btfeg.svg" className="mt-[3px] ml-[5px] w-[16px] h-[11px]" alt="wifi" />
            <img src="/images/mo8lqwf4-maus1cz.svg" className="mt-[3px] ml-[7px] w-[24px] h-[11px]" alt="battery" />
          </div>

          <div className="relative flex items-center px-4 py-2">
            <button type="button" onClick={() => navigate('/')} className="flex items-center justify-center border border-[#2222220d] rounded-[12px] w-[40px] h-[40px]">
              <img src="/images/mo8lqwf4-t273epl.svg" className="w-[20px] h-[20px]" alt="back" />
            </button>
            <p className="absolute top-[19px] left-[150px] text-[19px] leading-[22px] text-[#140707]">肉派小助手</p>
            <div
              className={`absolute top-[12px] left-[304px] rounded-[12px] px-[7px] pr-1 w-[73px] h-[32px] cursor-pointer ${isSwitchOn ? 'bg-[#7c5ae0]' : 'bg-[#9a9a9a]'}`}
              onClick={handleSwitchClick}
            >
              <p className={`absolute top-[7px] w-[32px] text-center text-[14px] text-white font-semibold ${isSwitchOn ? 'left-[7px]' : 'right-[7px]'}`}>
                {isSwitchOn ? 'ON' : 'OFF'}
              </p>
              <img
                src="/images/mo8lqwf4-tq9m7bh.svg"
                className="absolute top-[4px] w-[24px] h-[24px] transition-all duration-200"
                style={{ left: `${isSwitchOn ? 45 : 4}px` }}
                alt="switch"
              />
            </div>
          </div>

          <div className="relative mt-[10px] w-full h-[130px] overflow-hidden">
            <div className="pointer-events-none absolute left-1/2 top-[-168px] -translate-x-1/2 flex items-center w-[511px] h-[278px]">
              <div className="flex grow items-start rounded-full pt-[9px] pr-[18px] pb-3 pl-[18px] blur-[2px]">
                <div className="rounded-full w-[475px] h-[257px] outline outline-[9px] outline-[#f6f3fd]" />
              </div>
            </div>

            <div
              className="absolute top-[-2mm] left-1/2 -translate-x-1/2 w-[343px] h-[115px] touch-pan-x"
              onPointerDown={handleFamilyPointerDown}
              onPointerUp={handleFamilyPointerUp}
              onPointerCancel={handleFamilyPointerUp}
            >
              {[
                { x: 0, y: 25, w: 46, h: 56 },
                { x: 62, y: 41, w: 46, h: 56 },
                { x: 114, y: 0, w: 114, h: 115 },
                { x: 240, y: 43, w: 46, h: 56 },
                { x: 297, y: 30, w: 46, h: 56 }
              ].map((slot, slotIndex) => {
                const offset = slotIndex - 2;
                const member = getFamilyByOffset(offset);
                const total = familyMembers.length;
                const targetIndex = (centerFamilyIndex + offset + total) % total;
                const isCenter = offset === 0;

                return (
                  <button
                    key={`${member.id}-${slotIndex}`}
                    type="button"
                    className={`absolute appearance-none border-0 bg-transparent p-0 overflow-visible transition-all duration-200 ${isCenter ? 'z-[999]' : 'z-10'}`}
                    style={{ left: `${slot.x}px`, top: `${slot.y}px`, width: `${slot.w}px`, height: `${slot.h}px` }}
                    onPointerDown={() => setFamilyDotColor(getFamilyColorById(member.id))}
                    onClick={() => {
                      setCenterFamilyIndex(targetIndex);
                      setFamilyDotColor(getFamilyColorById(member.id));
                      applyFamilyReminderPreset(member.id);
                      triggerCenterAvatarPop();
                    }}
                  >
                    {isCenter ? (
                      <div className={`relative w-[114px] h-[115px] transition-transform duration-200 ${isCenterAvatarPop ? 'scale-[1.06]' : 'scale-100'}`}>
                        <img src={member.avatar} className="absolute top-[13px] left-[13px] w-[89px] h-[89px] object-contain rounded-full" alt={`${member.label}头像`} />
                        <p className="absolute top-[97px] left-[45px] w-[24px] h-[18px] text-[12px] leading-[18px] tracking-[-0.3px] text-[#785ae3] font-semibold">{member.label}</p>
                        {member.badge && member.id !== 'baba' && (
                          <div className="absolute top-[14px] left-[88px] rounded-full bg-[#ff0000] min-w-[12px] h-[12px] px-[3px] flex items-center justify-center">
                            <span className="text-[8px] leading-[10px] text-white font-semibold">{member.badge}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative w-[46px] h-[56px]">
                        {member.id === 'grandma' && (
                          <div className="relative w-[40px] h-[53px]">
                            <div className="absolute top-[3px] left-0 w-[40px] h-[50px]">
                              <img src={member.avatar} className="absolute top-[-2px] left-[-2px] w-[44px] h-[44px] object-contain rounded-full" alt={member.label} />
                              <p className="absolute top-[41px] left-[13px] w-[12px] h-[9px] text-[6px] leading-[9px] tracking-[-0.3px] text-[#3b3b3b] font-semibold">{member.label}</p>
                            </div>
                            <div className="absolute top-0 left-[30px] w-[8px] h-[9px]">
                              <div className="absolute top-[1px] left-0 rounded-full bg-[#ff0000] w-[8px] h-[8px]" />
                              <p className="absolute top-0 left-[2px] w-[4px] h-[9px] text-[6px] leading-[9px] tracking-[-0.3px] text-white font-semibold">{member.badge}</p>
                            </div>
                          </div>
                        )}

                        {member.id === 'mama' && (
                          <div className="relative w-[40px] h-[50px]">
                            <img src={member.avatar} className="absolute top-[-2px] left-[-2px] w-[44px] h-[44px] object-contain rounded-full" alt={member.label} />
                            <p className="absolute top-[41px] left-[13px] w-[12px] h-[9px] text-[6px] leading-[9px] tracking-[-0.3px] text-[#3c3c3c] font-semibold">{member.label}</p>
                          </div>
                        )}

                        {member.id === 'baba' && (
                          <div className="relative w-[40px] h-[50px]">
                            <img src={member.avatar} className="absolute top-[-2px] left-[-2px] w-[44px] h-[44px] object-contain rounded-full" alt={member.label} />
                            <p className="absolute top-[41px] left-[13px] w-[12px] h-[9px] text-[6px] leading-[9px] tracking-[-0.3px] text-[#3c3c3c] font-semibold">{member.label}</p>
                          </div>
                        )}

                        {member.id === 'sister' && (
                          <div className="relative w-[38px] h-[48px]">
                            <img src={member.avatar} className="absolute top-[-2px] left-[-2px] w-[42px] h-[42px] object-contain rounded-full" alt={member.label} />
                            <p className="absolute top-[39px] left-[14px] w-[12px] h-[9px] text-[6px] leading-[9px] tracking-[-0.3px] text-[#3c3c3c] font-semibold">{member.label}</p>
                          </div>
                        )}

                        {member.id === 'brother' && (
                          <div className="flex flex-col items-start w-[40px] h-[51px]">
                            <div className="relative mt-[-2px] ml-[-2px] w-[44px] h-[44px]">
                              <img src={member.avatar} className="w-[44px] h-[44px] object-contain rounded-full" alt={member.label} />
                              <div className="absolute top-[4px] right-[4px] rounded-full bg-[#ff0000] min-w-[10px] h-[10px] px-[2px] flex items-center justify-center">
                                <span className="text-[5px] leading-[8px] text-white font-semibold">{member.badge}</span>
                              </div>
                            </div>
                            <p className="mt-0 ml-4 text-[6px] leading-[9px] tracking-[-0.3px] text-[#3c3c3c] font-semibold">{member.label}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="absolute top-[calc(202px+3mm-15mm-1mm)] left-[calc(16px-2mm)] z-[999] cursor-pointer" onClick={handleAddDailyReminder}>
            <p
              className="absolute top-[50px] left-[10px] w-[76px] h-[27px] text-center tracking-[-0.3px] text-[17px] leading-[27px] font-bold text-[#000000]"
              style={{ fontFamily: '"HarmonyOS Sans SC", "HarmonyOS Sans", "PingFang SC", sans-serif' }}
            >TODO</p>
          </div>

          <div className="absolute top-[calc(202px+3mm-1mm)] right-[calc(27px+2mm)] z-[999] w-[56px] h-[22px]">
            <button
              type="button"
              onClick={handleAddDailyReminder}
              className="absolute left-[-217px] top-auto w-[14px] h-[14px] rounded-full bg-[#474aa9] flex items-center justify-center"
            >
              <span
                className="text-[18px] leading-[28px] font-bold text-white"
                style={{ fontFamily: '"HarmonyOS Sans SC", "HarmonyOS Sans", "PingFang SC", sans-serif', marginTop: '-0.8mm' }}
              >+</span>
            </button>
          </div>

          <div
            ref={reminderScrollRef}
            className="absolute top-[calc(202px+3mm)] left-[27px] w-[351px] h-[170px] overflow-x-auto overflow-y-visible whitespace-nowrap scrollbar-hide touch-pan-x [scroll-behavior:smooth] [webkit-overflow-scrolling:touch] cursor-grab active:cursor-grabbing"
            onPointerDown={handleReminderPointerDown}
            onPointerMove={handleReminderPointerMove}
            onPointerUp={handleReminderPointerEnd}
            onPointerCancel={handleReminderPointerEnd}
            onPointerLeave={handleReminderPointerEnd}
          >
            <div className="mt-[4.5mm] inline-flex items-center gap-[15px] pr-[18px] min-w-max origin-top-left scale-[0.92]">
              {customRemindersByFamily[currentFamilyId].map((reminder, index) => {
                const editingKey = `custom-${reminder.id}`;
                return (
                  <div key={reminder.id} className="w-[132px] h-[140px] rounded-[35px] pt-[13px] pl-[16px] pr-[49px] pb-[30px] shrink-0" style={{ backgroundColor: getCustomCardColor(currentFamilyId) }}>
                    <p className="text-[14px] leading-[21px] tracking-[-0.3px] text-[#161616] font-medium">定制提醒</p>
                    {editingCard === editingKey ? (
                      <textarea
                        autoFocus
                        value={reminder.text}
                        onChange={(event) => updateCustomReminderText(reminder.id, event.target.value)}
                        onBlur={() => setEditingCard(null)}
                        className={`mt-[15px] w-[102px] h-[45px] resize-none bg-white/70 rounded-[6px] px-1 tracking-[-0.3px] text-black font-semibold outline-none ${getEditFontClass(reminder.text)}`}
                      />
                    ) : (
                      <p
                        className="mt-[15px] w-[102px] min-h-[42px] overflow-visible whitespace-normal text-[16px] leading-[21px] tracking-[-0.3px] text-black font-semibold cursor-text"
                        onDoubleClick={() => setEditingCard(editingKey)}
                      >
                        {reminder.text.replace(/\n/g, '')}
                      </p>
                    )}
                    <div className="mt-[4px] mr-[28px] flex items-center justify-between min-w-[61px] h-[15px]">
                      <div className="w-[10px] h-[10px] rounded-full bg-white" />
                      <p className="text-[10px] leading-[15px] tracking-[-0.3px] text-[#828282] font-medium">{reminder.time}</p>
                    </div>
                  </div>
                );
              })}

              {newReminderText !== null && (
                <div className="w-[132px] h-[140px] rounded-[35px] bg-[#efefef] pt-[13px] px-[11px] pb-[30px] shrink-0">
                  <p className="text-[14px] leading-[21px] tracking-[-0.3px] text-[#828282] font-medium">每日提醒</p>
                  <textarea
                    autoFocus
                    value={newReminderText}
                    onChange={(event) => setNewReminderText(event.target.value)}
                    onBlur={handleConfirmNewReminder}
                    className={`mt-[15px] w-full max-w-full h-[45px] resize-none bg-white rounded-[6px] px-1 tracking-[-0.3px] text-black font-semibold outline-none ${getEditFontClass(newReminderText)}`}
                  />
                  <div className="mt-[4px] mr-[28px] flex items-center justify-between min-w-[61px] h-[15px]">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#61de70]" />
                    <p className="text-[10px] leading-[15px] tracking-[-0.3px] text-[#828282] font-medium">everyday</p>
                  </div>
                </div>
              )}

              {dailyReminders.map((reminder) => {
                const editingKey = `daily-${reminder.id}`;
                return (
                  <div key={reminder.id} className="w-[132px] h-[140px] rounded-[35px] bg-[#efefef] pt-[13px] px-[11px] pb-[30px] shrink-0">
                    <p className="text-[14px] leading-[21px] tracking-[-0.3px] text-[#828282] font-medium">每日提醒</p>
                    {editingCard === editingKey ? (
                      <textarea
                        autoFocus
                        value={reminder.text}
                        onChange={(event) => updateDailyReminderText(reminder.id, event.target.value)}
                        onBlur={() => setEditingCard(null)}
                        className={`mt-[15px] w-full max-w-full h-[45px] resize-none bg-white rounded-[6px] px-1 tracking-[-0.3px] text-black font-semibold outline-none ${getEditFontClass(reminder.text)}`}
                      />
                    ) : (
                      <p className={`mt-[15px] w-full max-w-full min-h-[42px] overflow-visible whitespace-normal break-words tracking-[-0.3px] text-black font-semibold cursor-text ${getEditFontClass(reminder.text)}`} onDoubleClick={() => setEditingCard(editingKey)}>
                        {reminder.text.replace(/\n/g, '')}
                      </p>
                    )}
                    <div className="mt-[4px] mr-[28px] flex items-center justify-between min-w-[61px] h-[15px]">
                      <div className="w-[10px] h-[10px] rounded-full bg-[#61de70]" />
                      <p className="text-[10px] leading-[15px] tracking-[-0.3px] text-[#828282] font-medium">{reminder.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="absolute top-[376px] left-[22px] w-[351px] h-[347px]">
            <img src="/images/mo8lqwf4-d5wfc9x.svg" className="absolute top-[12px] left-[8px] w-[335px] h-[355px]" alt="shadow1" />
            <img src="/images/mo8lqwf4-8eysjys.svg" className="absolute top-[3px] left-[10px] w-[331px] h-[354px]" alt="shadow2" />
            <div className="absolute top-[3mm] left-0 w-[351px] h-[347px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/mo8lqwf4-dqfw77i.svg)' }}>
              <div className="absolute top-[58px] left-[28px] right-[26px] bottom-[49px] overflow-y-auto scrollbar-hide">
                {currentDayFeeds.map((item, index) => (
                  <div key={`${selectedWeekday}-feed-${index}`}>
                    <div className={`relative ${index === 0 ? '' : 'mt-[9px]'}`}>
                      <span className="absolute top-[3px] left-[1px] inline-flex items-center justify-center w-[15px] h-[15px] text-[14px] leading-none">{getFeedEmoji(item)}</span>
                      <p
                        className="ml-[25px] w-[260px] h-[22px] overflow-hidden whitespace-nowrap text-ellipsis text-[11px] leading-[22px] tracking-[-0.43px] text-black cursor-pointer"
                        onClick={() => {
                          if (/喝水/.test(item.text)) {
                            navigate('/drink-water-reminder');
                            return;
                          }
                          navigate('/assistant-content', { state: { familyId: currentFamilyId } });
                        }}
                      >
                        {item.text}
                      </p>
                    </div>
                    <div className="mt-[6px] ml-[3px] flex items-center justify-between mr-[245px] min-w-[49px] h-[11px]">
                      <div className="w-[7px] h-[7px] rounded-full bg-[#61de70]" />
                      <p className="text-[7px] leading-[11px] tracking-[-0.3px] text-[#828282] font-medium">{item.time}</p>
                    </div>
                    <div className="mt-[2px] ml-[2px] w-[288px] h-px bg-[#e9e9e9]" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 left-[-5px] w-[361px] h-[47px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/mo8lqwf4-oonvk2a.svg)' }}>
              <div className="absolute top-[20px] left-[35px] inline-flex items-center gap-[24px] text-white text-[12px] font-medium">
                {weekdayList.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedWeekday(day)}
                    className={`text-[12px] leading-[17px] font-medium ${selectedWeekday === day ? 'text-white' : 'text-white/70'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="absolute top-[9px] left-[35px] right-[34px] flex items-center justify-between">
                <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: familyDotColor }} />
                <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: familyDotColor }} />
              </div>
            </div>
            <div className="absolute top-[-7px] left-[31px] w-[8px] h-[23px] rounded-[3px] bg-white" />
            <div className="absolute top-[-7px] left-[313px] w-[8px] h-[23px] rounded-[3px] bg-white" />
          </div>

          <div className={`absolute bottom-[42px] left-[32px] w-[325px] h-[50px] rounded-[32px] px-[24px] pr-[17px] flex items-center justify-between ${isRecording ? 'bg-[#ecfff0] border border-[#61de70]' : 'bg-white'}`}>
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={isRecording ? '录音中... 点击麦克风结束' : 'Message'}
              className="w-[230px] h-[29px] bg-transparent outline-none text-[17px] leading-[22px] text-[#3c3c3ccc] placeholder:text-[#3c3c3c4d]"
            />
            <button type="button" onClick={handleMicClick} className={`w-[35px] h-[26px] flex items-center justify-center rounded-full transition-all ${isRecording ? 'bg-[#61de70]' : ''} ${micPulse ? 'animate-bounce' : ''}`}>
              <img src="/images/mo8lqwf5-fjsuegj.svg" className={`w-[35px] h-[26px] ${isRecording ? 'brightness-0 invert' : ''}`} alt="microphone" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-[1px] flex items-start pt-[21px] px-[129px] pb-[8px] w-[394px] h-[34px]">
          <div className="rounded-[100px] bg-[#222222] w-[134px] h-[5px]" />
        </div>
        <div className="absolute bottom-0 left-0 flex items-start pt-[21px] px-[129px] pb-[8px] w-[394px] h-[34px]">
          <div className="rounded-[100px] bg-[#222222] w-[134px] h-[5px]" />
        </div>
      </div>
    </div>
  );
};

export default HomeLost;
