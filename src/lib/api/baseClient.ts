import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export type Tables = Database['public']['Tables'];
export type TableNames = keyof Tables;

export class BaseAPIClient {
  constructor(protected supabase: SupabaseClient<Database>) {}

  protected async select<T extends TableNames>(table: T, query?: string) {
    const { data, error } = await this.supabase
      .from(table)
      .select(query ?? '*');
    
    if (error) throw error;
    return data as unknown as Tables[T]['Row'][];
  }

  protected async insert<T extends TableNames>(table: T, data: Tables[T]['Insert']) {
    const { data: result, error } = await this.supabase
      .from(table)
      .insert(data as any)
      .select()
      .single();
    
    if (error) throw error;
    return result as unknown as Tables[T]['Row'];
  }

  protected async update<T extends TableNames>(
    table: T,
    data: Partial<Tables[T]['Update']>,
    id: string
  ) {
    const { data: result, error } = await this.supabase
      .from(table)
      .update(data as any)
      .eq('id' as any, id)
      .select()
      .single();
    
    if (error) throw error;
    return result as unknown as Tables[T]['Row'];
  }

  protected async delete<T extends TableNames>(table: T, id: string) {
    const { error } = await this.supabase
      .from(table)
      .delete()
      .eq('id' as any, id);
    
    if (error) throw error;
  }

  protected async getById<T extends TableNames>(table: T, id: string) {
    const { data, error } = await this.supabase
      .from(table)
      .select()
      .eq('id' as any, id)
      .single();
    
    if (error) throw error;
    return data as unknown as Tables[T]['Row'];
  }

  protected async getByColumn<T extends TableNames>(
    table: T,
    column: keyof Tables[T]['Row'],
    value: string
  ) {
    const { data, error } = await this.supabase
      .from(table)
      .select()
      .eq(column as any, value)
      .single();
    
    if (error) throw error;
    return data as unknown as Tables[T]['Row'];
  }
} 