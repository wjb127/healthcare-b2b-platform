export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: 'open' | 'closed' | 'in_progress';
  created_by: string;
  created_at: string;
  buyer?: {
    company_name: string;
    email: string;
  };
}

export interface Bid {
  id: string;
  project_id: string;
  bidder_id: string;
  amount: number;
  delivery_time: number;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  bidder?: {
    company_name: string;
    email: string;
  };
  project?: Project;
}

export interface Profile {
  id: string;
  user_type: 'A' | 'B';
  company_name: string;
  business_registration_number: string;
  representative_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  created_at: string;
}

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'MRI 장비 구매',
    description: '최신 3T MRI 장비 구매를 위한 입찰입니다. 설치 및 유지보수 포함.',
    budget: 5000000000,
    deadline: '2024-12-31',
    status: 'open',
    created_by: 'mock-buyer-id',
    created_at: '2024-01-15T10:00:00Z',
    buyer: {
      company_name: '서울대학교병원',
      email: 'buyer@example.com'
    }
  },
  {
    id: 'proj-2',
    title: '병원 정보 시스템 업그레이드',
    description: 'EMR 시스템 전면 개편 및 클라우드 마이그레이션 프로젝트',
    budget: 800000000,
    deadline: '2024-11-30',
    status: 'open',
    created_by: 'mock-buyer-id',
    created_at: '2024-01-20T14:30:00Z',
    buyer: {
      company_name: '서울대학교병원',
      email: 'buyer@example.com'
    }
  },
  {
    id: 'proj-3',
    title: '의료 소모품 연간 공급 계약',
    description: '수술실 및 병동용 의료 소모품 연간 공급업체 선정',
    budget: 300000000,
    deadline: '2024-10-15',
    status: 'in_progress',
    created_by: 'mock-buyer-id-2',
    created_at: '2024-01-10T09:00:00Z',
    buyer: {
      company_name: '삼성서울병원',
      email: 'buyer2@example.com'
    }
  }
];

export const mockBids: Bid[] = [
  {
    id: 'bid-1',
    project_id: 'proj-1',
    bidder_id: 'mock-supplier-id',
    amount: 4800000000,
    delivery_time: 90,
    proposal: 'GE Healthcare의 최신 SIGNA Premier 3.0T MRI를 제안합니다. 10년 유지보수 포함.',
    status: 'pending',
    created_at: '2024-01-16T11:00:00Z',
    bidder: {
      company_name: '메디칼소프트',
      email: 'supplier@example.com'
    }
  },
  {
    id: 'bid-2',
    project_id: 'proj-1',
    bidder_id: 'mock-supplier-id-2',
    amount: 4900000000,
    delivery_time: 60,
    proposal: 'Siemens Magnetom Vida 3T MRI 공급. 빠른 설치와 교육 프로그램 포함.',
    status: 'pending',
    created_at: '2024-01-17T09:30:00Z',
    bidder: {
      company_name: '헬스케어솔루션',
      email: 'supplier2@example.com'
    }
  },
  {
    id: 'bid-3',
    project_id: 'proj-2',
    bidder_id: 'mock-supplier-id',
    amount: 750000000,
    delivery_time: 180,
    proposal: '검증된 EMR 솔루션과 안전한 클라우드 마이그레이션을 제공합니다.',
    status: 'accepted',
    created_at: '2024-01-21T10:00:00Z',
    bidder: {
      company_name: '메디칼소프트',
      email: 'supplier@example.com'
    }
  }
];

export const mockProfiles: Profile[] = [
  {
    id: 'mock-buyer-id',
    user_type: 'A',
    company_name: '서울대학교병원',
    business_registration_number: '123-45-67890',
    representative_name: '김병원',
    contact_email: 'buyer@example.com',
    contact_phone: '02-1234-5678',
    address: '서울특별시 종로구 대학로 101',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'mock-supplier-id',
    user_type: 'B',
    company_name: '메디칼소프트',
    business_registration_number: '987-65-43210',
    representative_name: '이공급',
    contact_email: 'supplier@example.com',
    contact_phone: '02-9876-5432',
    address: '서울특별시 강남구 테헤란로 123',
    created_at: '2024-01-01T00:00:00Z'
  }
];

class MockDataService {
  private projects: Project[] = [...mockProjects];
  private bids: Bid[] = [...mockBids];
  private profiles: Profile[] = [...mockProfiles];

  getProjects(userId?: string): Project[] {
    if (userId) {
      return this.projects.filter(p => p.created_by === userId);
    }
    return this.projects;
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  createProject(project: Omit<Project, 'id' | 'created_at'>): Project {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.projects.push(newProject);
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updates };
      return this.projects[index];
    }
    return undefined;
  }

  getBids(projectId?: string, bidderId?: string): Bid[] {
    let result = [...this.bids];
    if (projectId) {
      result = result.filter(b => b.project_id === projectId);
    }
    if (bidderId) {
      result = result.filter(b => b.bidder_id === bidderId);
    }
    return result.map(bid => ({
      ...bid,
      project: this.projects.find(p => p.id === bid.project_id)
    }));
  }

  createBid(bid: Omit<Bid, 'id' | 'created_at'>): Bid {
    const newBid: Bid = {
      ...bid,
      id: `bid-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.bids.push(newBid);
    return newBid;
  }

  updateBidStatus(bidId: string, status: 'accepted' | 'rejected'): Bid | undefined {
    const index = this.bids.findIndex(b => b.id === bidId);
    if (index !== -1) {
      this.bids[index].status = status;
      return this.bids[index];
    }
    return undefined;
  }

  getProfile(userId: string): Profile | undefined {
    return this.profiles.find(p => p.id === userId);
  }

  createProfile(profile: Omit<Profile, 'id' | 'created_at'>): Profile {
    const newProfile: Profile = {
      ...profile,
      id: `profile-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.profiles.push(newProfile);
    return newProfile;
  }

  updateProfile(id: string, updates: Partial<Profile>): Profile | undefined {
    const index = this.profiles.findIndex(p => p.id === id);
    if (index !== -1) {
      this.profiles[index] = { ...this.profiles[index], ...updates };
      return this.profiles[index];
    }
    return undefined;
  }
}

export const mockData = new MockDataService();