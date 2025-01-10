import { SupabaseClient } from '@supabase/supabase-js';
import { handleAPIError } from './errors';
import { globalRateLimiter } from './rateLimiter';
import type { Database } from '@/types/supabase';

export type Tables = Database['public']['Tables'];
export type TableNames = keyof Tables;

export class BaseAPIClient {
  constructor(protected supabase: SupabaseClient<Database>) {}

  protected async execute<T>(
    operation: () => Promise<{ data: T | null; error: any }>
  ): Promise<T> {
    try {
      await globalRateLimiter.checkLimit();
      
      const { data, error } = await operation();
      
      if (error) {
        handleAPIError(error);
      }
      
      if (!data) {
        handleAPIError(new Error('No data returned from the API'));
      }
      
      return data as T;
    } catch (error) {
      handleAPIError(error);
    }
  }

  protected buildSelect<T extends TableNames>(
    table: T,
    query?: string
  ) {
    return this.supabase
      .from(table)
      .select(query ?? '*') as any;
  }

  protected buildInsert<T extends TableNames>(
    table: T,
    data: Tables[T]['Insert'] | Tables[T]['Insert'][]
  ) {
    return this.supabase
      .from(table)
      .insert(data) as any;
  }

  protected buildUpdate<T extends TableNames>(
    table: T,
    data: Tables[T]['Update'],
    column: keyof Tables[T]['Row'] & string,
    value: Tables[T]['Row'][keyof Tables[T]['Row'] & string]
  ) {
    return this.supabase
      .from(table)
      .update(data)
      .eq(column, value) as any;
  }

  protected buildDelete<T extends TableNames>(
    table: T,
    column: keyof Tables[T]['Row'] & string,
    value: Tables[T]['Row'][keyof Tables[T]['Row'] & string]
  ) {
    return this.supabase
      .from(table)
      .delete()
      .eq(column, value) as any;
  }
} 