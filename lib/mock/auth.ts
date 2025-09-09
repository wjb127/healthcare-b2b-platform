import { User } from '@supabase/supabase-js';

export interface MockUser extends User {
  id: string;
  email: string;
  user_metadata: {
    user_type: 'A' | 'B';
    company_name: string;
  };
}

class MockAuthService {
  private currentUser: MockUser | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('mockUser');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    }
  }

  async signIn(email: string, password: string): Promise<{ user: MockUser | null; error: Error | null }> {
    const mockUsers: Record<string, MockUser> = {
      'buyer@example.com': {
        id: 'mock-buyer-id',
        email: 'buyer@example.com',
        user_metadata: {
          user_type: 'A',
          company_name: '서울대학교병원'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      },
      'supplier@example.com': {
        id: 'mock-supplier-id',
        email: 'supplier@example.com',
        user_metadata: {
          user_type: 'B',
          company_name: '메디칼소프트'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      }
    };

    const user = mockUsers[email];
    if (user) {
      this.currentUser = user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('mockUser', JSON.stringify(user));
      }
      return { user, error: null };
    }

    return { user: null, error: new Error('Invalid credentials') };
  }

  async signUp(email: string, password: string, userType: 'A' | 'B', companyName: string): Promise<{ user: MockUser | null; error: Error | null }> {
    const newUser: MockUser = {
      id: `mock-${Date.now()}`,
      email,
      user_metadata: {
        user_type: userType,
        company_name: companyName
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString()
    };

    this.currentUser = newUser;
    if (typeof window !== 'undefined') {
      localStorage.setItem('mockUser', JSON.stringify(newUser));
    }

    return { user: newUser, error: null };
  }

  async signOut(): Promise<{ error: Error | null }> {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mockUser');
    }
    return { error: null };
  }

  getUser(): MockUser | null {
    return this.currentUser;
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (this.currentUser) {
      callback('SIGNED_IN', { user: this.currentUser });
    }
    
    return {
      data: { subscription: { unsubscribe: () => {} } }
    };
  }
}

export const mockAuth = new MockAuthService();