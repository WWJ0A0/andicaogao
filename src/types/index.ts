// 宠物数据类型定义
export interface Pet {
  id: string;
  user_id: string;
  name: string;
  personality: string; // 性格：乐天派等
  growth_stage: string; // 成长阶段：认知形成期等
  companionship_days: number; // 已陪伴天数
  daily_interactions: number; // 今日互动次数
  created_at: string;
  updated_at: string;
}

// 互动记录定义
export interface Interaction {
  id: string;
  user_id: string;
  pet_id: string;
  type: 'touch' | 'feed' | 'play' | 'gallery' | 'diary';
  count: number;
  date: string;
}

// 画廊作品定义
export interface GalleryItem {
  id: string;
  user_id: string;
  title: string;
  image_url: string;
  created_at: string;
}

// 日记记录定义
export interface DiaryEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  drawing_data?: string; // 绘画数据
  created_at: string;
}

// 用户类型定义
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  last_login: string;
}

// 首页数据接口
export interface HomePageData {
  pet: Pet;
  todaysInteractions: number;
}