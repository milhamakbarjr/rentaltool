/**
 * Supabase Database Types
 *
 * Auto-generated TypeScript types for database schema
 * Generate with: supabase gen types typescript --linked > src/types/supabase.ts
 *
 * For now, these are manually defined based on schema
 * Run the command above after linking to Supabase project for auto-generation
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          business_name: string | null
          phone_number: string | null
          timezone: string
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          business_name?: string | null
          phone_number?: string | null
          timezone?: string
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          business_name?: string | null
          phone_number?: string | null
          timezone?: string
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          icon?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          icon?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      inventory_items: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          name: string
          description: string | null
          quantity_total: number
          condition: 'new' | 'good' | 'fair' | 'needs_repair'
          purchase_cost: number | null
          purchase_date: string | null
          pricing: Json
          deposit_required: number
          minimum_rental_period: number
          photos: string[]
          specifications: Json
          status: 'available' | 'rented' | 'maintenance' | 'retired'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          name: string
          description?: string | null
          quantity_total?: number
          condition?: 'new' | 'good' | 'fair' | 'needs_repair'
          purchase_cost?: number | null
          purchase_date?: string | null
          pricing?: Json
          deposit_required?: number
          minimum_rental_period?: number
          photos?: string[]
          specifications?: Json
          status?: 'available' | 'rented' | 'maintenance' | 'retired'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          quantity_total?: number
          condition?: 'new' | 'good' | 'fair' | 'needs_repair'
          purchase_cost?: number | null
          purchase_date?: string | null
          pricing?: Json
          deposit_required?: number
          minimum_rental_period?: number
          photos?: string[]
          specifications?: Json
          status?: 'available' | 'rented' | 'maintenance' | 'retired'
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string
          full_name: string
          phone_number: string
          email: string | null
          address: string | null
          id_number: string | null
          customer_type: 'individual' | 'business'
          tags: string[]
          reliability_score: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          phone_number: string
          email?: string | null
          address?: string | null
          id_number?: string | null
          customer_type?: 'individual' | 'business'
          tags?: string[]
          reliability_score?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          phone_number?: string
          email?: string | null
          address?: string | null
          id_number?: string | null
          customer_type?: 'individual' | 'business'
          tags?: string[]
          reliability_score?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rentals: {
        Row: {
          id: string
          user_id: string
          customer_id: string
          rental_number: string
          status: 'draft' | 'upcoming' | 'active' | 'completed' | 'cancelled' | 'overdue'
          start_date: string
          end_date: string
          actual_return_date: string | null
          total_amount: number
          deposit_amount: number
          payment_status: 'unpaid' | 'partial' | 'paid'
          delivery_required: boolean
          delivery_address: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          customer_id: string
          rental_number?: string
          status?: 'draft' | 'upcoming' | 'active' | 'completed' | 'cancelled' | 'overdue'
          start_date: string
          end_date: string
          actual_return_date?: string | null
          total_amount?: number
          deposit_amount?: number
          payment_status?: 'unpaid' | 'partial' | 'paid'
          delivery_required?: boolean
          delivery_address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          customer_id?: string
          rental_number?: string
          status?: 'draft' | 'upcoming' | 'active' | 'completed' | 'cancelled' | 'overdue'
          start_date?: string
          end_date?: string
          actual_return_date?: string | null
          total_amount?: number
          deposit_amount?: number
          payment_status?: 'unpaid' | 'partial' | 'paid'
          delivery_required?: boolean
          delivery_address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rental_items: {
        Row: {
          id: string
          rental_id: string
          item_id: string
          quantity: number
          rate: number
          rate_type: 'hourly' | 'daily' | 'weekly' | 'monthly'
          subtotal: number
          condition_on_pickup: 'new' | 'good' | 'fair' | 'needs_repair' | null
          condition_on_return: 'new' | 'good' | 'fair' | 'damaged' | 'missing' | null
          pickup_photos: string[]
          return_photos: string[]
          damage_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          rental_id: string
          item_id: string
          quantity?: number
          rate: number
          rate_type?: 'hourly' | 'daily' | 'weekly' | 'monthly'
          subtotal: number
          condition_on_pickup?: 'new' | 'good' | 'fair' | 'needs_repair' | null
          condition_on_return?: 'new' | 'good' | 'fair' | 'damaged' | 'missing' | null
          pickup_photos?: string[]
          return_photos?: string[]
          damage_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          rental_id?: string
          item_id?: string
          quantity?: number
          rate?: number
          rate_type?: 'hourly' | 'daily' | 'weekly' | 'monthly'
          subtotal?: number
          condition_on_pickup?: 'new' | 'good' | 'fair' | 'needs_repair' | null
          condition_on_return?: 'new' | 'good' | 'fair' | 'damaged' | 'missing' | null
          pickup_photos?: string[]
          return_photos?: string[]
          damage_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          rental_id: string
          amount: number
          payment_method: 'cash' | 'card' | 'transfer' | 'other'
          payment_type: 'rental_fee' | 'deposit' | 'late_fee' | 'damage_charge'
          status: 'pending' | 'completed' | 'refunded'
          transaction_date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          rental_id: string
          amount: number
          payment_method?: 'cash' | 'card' | 'transfer' | 'other'
          payment_type?: 'rental_fee' | 'deposit' | 'late_fee' | 'damage_charge'
          status?: 'pending' | 'completed' | 'refunded'
          transaction_date?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          rental_id?: string
          amount?: number
          payment_method?: 'cash' | 'card' | 'transfer' | 'other'
          payment_type?: 'rental_fee' | 'deposit' | 'late_fee' | 'damage_charge'
          status?: 'pending' | 'completed' | 'refunded'
          transaction_date?: string
          notes?: string | null
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          category: string
          amount: number
          description: string | null
          receipt_url: string | null
          expense_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          amount: number
          description?: string | null
          receipt_url?: string | null
          expense_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          amount?: number
          description?: string | null
          receipt_url?: string | null
          expense_date?: string
          created_at?: string
        }
      }
    }
    Views: {
      rental_summary: {
        Row: {
          id: string
          user_id: string
          rental_number: string
          status: string
          start_date: string
          end_date: string
          actual_return_date: string | null
          total_amount: number
          deposit_amount: number
          payment_status: string
          created_at: string
          customer_id: string
          customer_name: string
          customer_phone: string
          reliability_score: number
          item_count: number
          total_paid: number
        }
      }
      inventory_utilization: {
        Row: {
          id: string
          user_id: string
          name: string
          category_id: string | null
          quantity_total: number
          status: string
          total_rentals: number
          total_revenue: number
          purchase_cost: number | null
          roi_percentage: number | null
        }
      }
    }
    Functions: {
      generate_rental_number: {
        Args: {
          p_user_id: string
        }
        Returns: string
      }
      check_item_availability: {
        Args: {
          p_item_id: string
          p_start_date: string
          p_end_date: string
          p_exclude_rental_id?: string
        }
        Returns: {
          available_quantity: number
          booked_quantity: number
        }[]
      }
      calculate_customer_reliability_score: {
        Args: {
          p_customer_id: string
        }
        Returns: number
      }
      update_rental_status: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
