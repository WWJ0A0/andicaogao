import { createClient } from '@supabase/supabase-js';

// 这些值应从环境变量中获取
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 宠物相关操作
export const petApi = {
  // 获取宠物信息
  async getPet(userId: string) {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 更新互动次数
  async updateInteractions(petId: string, interactions: number) {
    const { error } = await supabase
      .from('pets')
      .update({ daily_interactions: interactions })
      .eq('id', petId);
    
    if (error) throw error;
  },

  // 记录互动
  async recordInteraction(userId: string, petId: string, type: 'touch' | 'feed' | 'play' | 'gallery' | 'diary') {
    const { error } = await supabase
      .from('interactions')
      .insert({
        user_id: userId,
        pet_id: petId,
        type,
        count: 1,
        date: new Date().toISOString().split('T')[0]
      });
    
    if (error) throw error;
  }
};