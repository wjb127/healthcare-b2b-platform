'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  userType: 'A' | 'B';
  companyName: string;
  profile?: {
    businessRegistrationNumber?: string;
    representativeName?: string;
    contactPhone?: string;
    address?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userType: 'A' | 'B', companyData: any) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<string, User> = {
  'buyer@example.com': {
    id: 'buyer-001',
    email: 'buyer@example.com',
    userType: 'A',
    companyName: '서울대학교병원',
    profile: {
      businessRegistrationNumber: '123-45-67890',
      representativeName: '김병원',
      contactPhone: '02-1234-5678',
      address: '서울특별시 종로구 대학로 101'
    }
  },
  'supplier@example.com': {
    id: 'supplier-001',
    email: 'supplier@example.com',
    userType: 'B',
    companyName: '메디칼소프트',
    profile: {
      businessRegistrationNumber: '987-65-43210',
      representativeName: '이공급',
      contactPhone: '02-9876-5432',
      address: '서울특별시 강남구 테헤란로 123'
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const mockUser = mockUsers[email];
      if (mockUser) {
        setUser(mockUser);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        
        if (mockUser.userType === 'A') {
          router.push('/dashboard/buyer');
        } else {
          router.push('/dashboard/supplier');
        }
        
        return { error: null };
      }
      return { error: new Error('이메일 또는 비밀번호가 올바르지 않습니다.') };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, userType: 'A' | 'B', companyData: any) => {
    try {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        userType,
        companyName: companyData.companyName,
        profile: {
          businessRegistrationNumber: companyData.businessRegistrationNumber,
          representativeName: companyData.representativeName,
          contactPhone: companyData.contactPhone,
          address: companyData.address
        }
      };
      
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      if (userType === 'A') {
        router.push('/dashboard/buyer');
      } else {
        router.push('/dashboard/supplier');
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  const updateProfile = async (profileData: any) => {
    if (!user) return { error: new Error('사용자가 로그인되어 있지 않습니다.') };
    
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        ...profileData
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}