import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'
import { mockAuth } from '@/lib/mock/auth'
import { mockData } from '@/lib/mock/data'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = async () => {
  if (USE_MOCK) {
    return createMockServerClient();
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            console.error('Error setting cookies:', error)
          }
        },
      },
    }
  )
}

function createMockServerClient() {
  return {
    auth: {
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        return await mockAuth.signIn(email, password);
      },
      signUp: async ({ email, password, options }: any) => {
        const userType = options?.data?.user_type || 'A';
        const companyName = options?.data?.company_name || 'Test Company';
        return await mockAuth.signUp(email, password, userType, companyName);
      },
      signOut: async () => {
        return await mockAuth.signOut();
      },
      getUser: async () => {
        const user = mockAuth.getUser();
        return { data: { user }, error: null };
      },
      onAuthStateChange: (callback: any) => {
        return mockAuth.onAuthStateChange(callback);
      }
    },
    from: (table: string) => {
      return {
        select: (columns?: string) => ({
          eq: (column: string, value: any) => ({
            single: async () => {
              if (table === 'profiles') {
                const profile = mockData.getProfile(value);
                return { data: profile, error: null };
              }
              if (table === 'projects') {
                const project = mockData.getProjectById(value);
                return { data: project, error: null };
              }
              return { data: null, error: null };
            },
            order: (column: string, options?: any) => ({
              data: null,
              error: null,
              then: async (resolve: any) => {
                if (table === 'projects') {
                  const projects = mockData.getProjects(value);
                  resolve({ data: projects, error: null });
                } else if (table === 'bids') {
                  const bids = mockData.getBids(value);
                  resolve({ data: bids, error: null });
                } else {
                  resolve({ data: [], error: null });
                }
              }
            }),
            then: async (resolve: any) => {
              if (table === 'bids') {
                const bids = mockData.getBids(column === 'project_id' ? value : undefined, column === 'bidder_id' ? value : undefined);
                resolve({ data: bids, error: null });
              } else {
                resolve({ data: [], error: null });
              }
            }
          }),
          order: (column: string, options?: any) => ({
            then: async (resolve: any) => {
              if (table === 'projects') {
                const projects = mockData.getProjects();
                resolve({ data: projects, error: null });
              } else if (table === 'bids') {
                const bids = mockData.getBids();
                resolve({ data: bids, error: null });
              } else {
                resolve({ data: [], error: null });
              }
            }
          }),
          single: async () => {
            if (table === 'profiles') {
              const user = mockAuth.getUser();
              if (user) {
                const profile = mockData.getProfile(user.id);
                return { data: profile, error: null };
              }
            }
            return { data: null, error: null };
          },
          then: async (resolve: any) => {
            if (table === 'projects') {
              const projects = mockData.getProjects();
              resolve({ data: projects, error: null });
            } else if (table === 'bids') {
              const bids = mockData.getBids();
              resolve({ data: bids, error: null });
            } else {
              resolve({ data: [], error: null });
            }
          }
        }),
        insert: (data: any) => ({
          select: () => ({
            single: async () => {
              if (table === 'projects') {
                const user = mockAuth.getUser();
                const newProject = mockData.createProject({
                  ...data,
                  created_by: user?.id || 'unknown',
                  buyer: {
                    company_name: user?.user_metadata?.company_name || 'Unknown',
                    email: user?.email || 'unknown@example.com'
                  }
                });
                return { data: newProject, error: null };
              } else if (table === 'bids') {
                const newBid = mockData.createBid(data);
                return { data: newBid, error: null };
              } else if (table === 'profiles') {
                const newProfile = mockData.createProfile(data);
                return { data: newProfile, error: null };
              }
              return { data: null, error: null };
            }
          })
        }),
        update: (data: any) => ({
          eq: (column: string, value: any) => ({
            select: () => ({
              single: async () => {
                if (table === 'projects') {
                  const updated = mockData.updateProject(value, data);
                  return { data: updated, error: null };
                } else if (table === 'profiles') {
                  const updated = mockData.updateProfile(value, data);
                  return { data: updated, error: null };
                } else if (table === 'bids' && data.status) {
                  const updated = mockData.updateBidStatus(value, data.status);
                  return { data: updated, error: null };
                }
                return { data: null, error: null };
              }
            })
          })
        }),
        delete: () => ({
          eq: (column: string, value: any) => ({
            then: async (resolve: any) => {
              resolve({ data: null, error: null });
            }
          })
        })
      };
    }
  } as any;
}