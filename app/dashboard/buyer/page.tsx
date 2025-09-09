'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Text,
} from '@chakra-ui/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function BuyerDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    openProjects: 0,
    totalBids: 0,
    avgBidAmount: 0,
  })
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch projects
      const { data: projects } = await supabase
        .from('projects')
        .select('*, bids(amount)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (projects) {
        setRecentProjects(projects.slice(0, 5))
        
        const totalProjects = projects.length
        const openProjects = projects.filter(p => p.status === 'open').length
        const allBids = projects.flatMap(p => p.bids || [])
        const totalBids = allBids.length
        const avgBidAmount = totalBids > 0 
          ? allBids.reduce((sum, bid) => sum + bid.amount, 0) / totalBids 
          : 0

        setStats({
          totalProjects,
          openProjects,
          totalBids,
          avgBidAmount,
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'green'
      case 'closed': return 'gray'
      case 'awarded': return 'blue'
      default: return 'gray'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ko-KR')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount)
  }

  return (
    <DashboardLayout userType="A">
      <Box>
        <Heading mb={6}>구매자 대시보드</Heading>

        {/* Stats Grid */}
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mb={8}>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>전체 프로젝트</StatLabel>
                  <StatNumber>{stats.totalProjects}</StatNumber>
                  <StatHelpText>등록된 프로젝트 수</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>진행중 프로젝트</StatLabel>
                  <StatNumber>{stats.openProjects}</StatNumber>
                  <StatHelpText>응찰 진행중</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>받은 응찰</StatLabel>
                  <StatNumber>{stats.totalBids}</StatNumber>
                  <StatHelpText>전체 응찰 수</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>평균 응찰금액</StatLabel>
                  <StatNumber>{formatCurrency(stats.avgBidAmount)}</StatNumber>
                  <StatHelpText>평균 견적 금액</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <Heading size="md">최근 프로젝트</Heading>
          </CardHeader>
          <CardBody>
            {recentProjects.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>프로젝트명</Th>
                    <Th>카테고리</Th>
                    <Th>마감일</Th>
                    <Th>응찰수</Th>
                    <Th>상태</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {recentProjects.map((project) => (
                    <Tr key={project.id}>
                      <Td fontWeight="medium">{project.title}</Td>
                      <Td>{project.category}</Td>
                      <Td>{formatDate(project.deadline)}</Td>
                      <Td>{project.bids?.length || 0}</Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(project.status)}>
                          {project.status === 'open' ? '진행중' : 
                           project.status === 'closed' ? '마감' : '낙찰'}
                        </Badge>
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/dashboard/buyer/projects/${project.id}`)}
                        >
                          상세보기
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text color="gray.500">등록된 프로젝트가 없습니다.</Text>
            )}
          </CardBody>
        </Card>
      </Box>
    </DashboardLayout>
  )
}