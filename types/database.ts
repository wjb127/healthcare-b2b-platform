export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_type: 'A' | 'B'
          company_name: string
          representative_name: string
          email: string
          phone: string | null
          business_number: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_type: 'A' | 'B'
          company_name: string
          representative_name: string
          email: string
          phone?: string | null
          business_number?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_type?: 'A' | 'B'
          company_name?: string
          representative_name?: string
          email?: string
          phone?: string | null
          business_number?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string
          region: string | null
          schedule_start: string | null
          schedule_end: string | null
          requirements: string
          budget_min: number | null
          budget_max: number | null
          deadline: string
          status: 'open' | 'closed' | 'awarded'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category: string
          region?: string | null
          schedule_start?: string | null
          schedule_end?: string | null
          requirements: string
          budget_min?: number | null
          budget_max?: number | null
          deadline: string
          status?: 'open' | 'closed' | 'awarded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: string
          region?: string | null
          schedule_start?: string | null
          schedule_end?: string | null
          requirements?: string
          budget_min?: number | null
          budget_max?: number | null
          deadline?: string
          status?: 'open' | 'closed' | 'awarded'
          created_at?: string
          updated_at?: string
        }
      }
      project_files: {
        Row: {
          id: string
          project_id: string
          file_name: string
          file_url: string
          file_size: number | null
          mime_type: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          project_id: string
          file_name: string
          file_url: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          file_name?: string
          file_url?: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_at?: string
        }
      }
      bids: {
        Row: {
          id: string
          project_id: string
          bidder_id: string
          amount: number
          delivery_days: number
          proposal: string
          status: 'submitted' | 'reviewed' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          bidder_id: string
          amount: number
          delivery_days: number
          proposal: string
          status?: 'submitted' | 'reviewed' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          bidder_id?: string
          amount?: number
          delivery_days?: number
          proposal?: string
          status?: 'submitted' | 'reviewed' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      bid_files: {
        Row: {
          id: string
          bid_id: string
          file_name: string
          file_url: string
          file_size: number | null
          mime_type: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          bid_id: string
          file_name: string
          file_url: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          bid_id?: string
          file_name?: string
          file_url?: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          read: boolean
          related_project_id: string | null
          related_bid_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          read?: boolean
          related_project_id?: string | null
          related_bid_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          read?: boolean
          related_project_id?: string | null
          related_bid_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: 'A' | 'B'
      project_status: 'open' | 'closed' | 'awarded'
      bid_status: 'submitted' | 'reviewed' | 'accepted' | 'rejected'
    }
  }
}