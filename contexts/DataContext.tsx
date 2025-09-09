'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: 'open' | 'closed' | 'in_progress';
  createdBy: string;
  createdAt: string;
  buyerCompany?: string;
  buyerEmail?: string;
}

export interface Bid {
  id: string;
  projectId: string;
  bidderId: string;
  amount: number;
  deliveryTime: number;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  bidderCompany?: string;
  bidderEmail?: string;
}

interface DataContextType {
  projects: Project[];
  bids: Bid[];
  getProjects: () => Project[];
  getProjectById: (id: string) => Project | undefined;
  getProjectsByUser: (userId: string) => Project[];
  createProject: (project: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  getBidsByProject: (projectId: string) => Bid[];
  getBidsByUser: (userId: string) => Bid[];
  createBid: (bid: Omit<Bid, 'id' | 'createdAt'>) => Bid;
  updateBidStatus: (bidId: string, status: 'accepted' | 'rejected') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'MRI 장비 구매',
    description: '최신 3T MRI 장비 구매를 위한 입찰입니다. 설치 및 유지보수 포함.',
    budget: 5000000000,
    deadline: '2024-12-31',
    status: 'open',
    createdBy: 'buyer-001',
    createdAt: '2024-01-15T10:00:00Z',
    buyerCompany: '서울대학교병원',
    buyerEmail: 'buyer@example.com'
  },
  {
    id: 'proj-2',
    title: '병원 정보 시스템 업그레이드',
    description: 'EMR 시스템 전면 개편 및 클라우드 마이그레이션 프로젝트',
    budget: 800000000,
    deadline: '2024-11-30',
    status: 'open',
    createdBy: 'buyer-001',
    createdAt: '2024-01-20T14:30:00Z',
    buyerCompany: '서울대학교병원',
    buyerEmail: 'buyer@example.com'
  },
  {
    id: 'proj-3',
    title: '의료 소모품 연간 공급 계약',
    description: '수술실 및 병동용 의료 소모품 연간 공급업체 선정',
    budget: 300000000,
    deadline: '2024-10-15',
    status: 'in_progress',
    createdBy: 'buyer-002',
    createdAt: '2024-01-10T09:00:00Z',
    buyerCompany: '삼성서울병원',
    buyerEmail: 'buyer2@example.com'
  }
];

const initialBids: Bid[] = [
  {
    id: 'bid-1',
    projectId: 'proj-1',
    bidderId: 'supplier-001',
    amount: 4800000000,
    deliveryTime: 90,
    proposal: 'GE Healthcare의 최신 SIGNA Premier 3.0T MRI를 제안합니다. 10년 유지보수 포함.',
    status: 'pending',
    createdAt: '2024-01-16T11:00:00Z',
    bidderCompany: '메디칼소프트',
    bidderEmail: 'supplier@example.com'
  },
  {
    id: 'bid-2',
    projectId: 'proj-1',
    bidderId: 'supplier-002',
    amount: 4900000000,
    deliveryTime: 60,
    proposal: 'Siemens Magnetom Vida 3T MRI 공급. 빠른 설치와 교육 프로그램 포함.',
    status: 'pending',
    createdAt: '2024-01-17T09:30:00Z',
    bidderCompany: '헬스케어솔루션',
    bidderEmail: 'supplier2@example.com'
  },
  {
    id: 'bid-3',
    projectId: 'proj-2',
    bidderId: 'supplier-001',
    amount: 750000000,
    deliveryTime: 180,
    proposal: '검증된 EMR 솔루션과 안전한 클라우드 마이그레이션을 제공합니다.',
    status: 'accepted',
    createdAt: '2024-01-21T10:00:00Z',
    bidderCompany: '메디칼소프트',
    bidderEmail: 'supplier@example.com'
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [bids, setBids] = useState<Bid[]>(initialBids);

  const getProjects = () => projects;

  const getProjectById = (id: string) => {
    return projects.find(p => p.id === id);
  };

  const getProjectsByUser = (userId: string) => {
    return projects.filter(p => p.createdBy === userId);
  };

  const createProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setProjects([...projects, newProject]);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
  };

  const getBidsByProject = (projectId: string) => {
    return bids.filter(b => b.projectId === projectId);
  };

  const getBidsByUser = (userId: string) => {
    return bids.filter(b => b.bidderId === userId);
  };

  const createBid = (bid: Omit<Bid, 'id' | 'createdAt'>) => {
    const newBid: Bid = {
      ...bid,
      id: `bid-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setBids([...bids, newBid]);
    return newBid;
  };

  const updateBidStatus = (bidId: string, status: 'accepted' | 'rejected') => {
    setBids(bids.map(b => 
      b.id === bidId ? { ...b, status } : b
    ));
  };

  return (
    <DataContext.Provider value={{
      projects,
      bids,
      getProjects,
      getProjectById,
      getProjectsByUser,
      createProject,
      updateProject,
      getBidsByProject,
      getBidsByUser,
      createBid,
      updateBidStatus
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}