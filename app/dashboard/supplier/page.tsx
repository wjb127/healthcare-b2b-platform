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

export default function SupplierDashboard() {
  const [stats, setStats] = useState({
    totalBids: 0,
    acceptedBids: 0,
    pendingBids: 0,
    avgBidAmount: 0,
  })
  const [recentBids, setRecentBids] = useState<any[]>([])
  const [openProjects, setOpenProjects] = useState<any[]>([])
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

      // Fetch my bids
      const { data: bids } = await supabase
        .from('bids')
        .select(`
          *,
          projects (
            id,
            title,
            category,
            deadline,
            status
          )
        `)
        .eq('bidder_id', user.id)
        .order('created_at', { ascending: false })

      if (bids) {
        setRecentBids(bids.slice(0, 5))
        
        const totalBids = bids.length
        const acceptedBids = bids.filter(b => b.status === 'accepted').length
        const pendingBids = bids.filter(b => b.status === 'submitted').length
        const avgBidAmount = totalBids > 0 
          ? bids.reduce((sum, bid) => sum + bid.amount, 0) / totalBids 
          : 0

        setStats({
          totalBids,
          acceptedBids,
          pendingBids,
          avgBidAmount,
        })
      }

      // Fetch open projects
      const { data: projects } = await supabase
        .from('projects')
        .select('*, profiles!projects_user_id_fkey(company_name)')
        .eq('status', 'open')
        .gte('deadline', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(5)

      if (projects) {
        setOpenProjects(projects)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'yellow'
      case 'reviewed': return 'blue'
      case 'accepted': return 'green'
      case 'rejected': return 'red'
      default: return 'gray'
    }
  }

  const getBidStatusText = (status: string) => {
    switch (status) {
      case 'submitted': return '제출됨'
      case 'reviewed': return '검토중'
      case 'accepted': return '낙찰'
      case 'rejected': return '탈락'
      default: return status
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
    <DashboardLayout userType="B">
      <Box>
        <Heading mb={6}>공급자 대시보드</Heading>

        {/* Stats Grid */}
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mb={8}>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>전체 응찰</StatLabel>
                  <StatNumber>{stats.totalBids}</StatNumber>
                  <StatHelpText>제출한 응찰 수</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>낙찰 성공</StatLabel>
                  <StatNumber>{stats.acceptedBids}</StatNumber>
                  <StatHelpText>낙찰받은 프로젝트</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>대기중 응찰</StatLabel>
                  <StatNumber>{stats.pendingBids}</StatNumber>
                  <StatHelpText>결과 대기중</StatHelpText>
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
                  <StatHelpText>평균 제출 금액</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Open Projects */}
        <Card mb={6}>
          <CardHeader>
            <Heading size="md">새로운 프로젝트</Heading>
          </CardHeader>
          <CardBody>
            {openProjects.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>프로젝트명</Th>
                    <Th>구매자</Th>
                    <Th>카테고리</Th>
                    <Th>마감일</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {openProjects.map((project) => (
                    <Tr key={project.id}>
                      <Td fontWeight="medium">{project.title}</Td>
                      <Td>{project.profiles?.company_name}</Td>
                      <Td>{project.category}</Td>
                      <Td>{formatDate(project.deadline)}</Td>
                      <Td>
                        <Button
                          size="sm"
                          colorScheme="brand"
                          onClick={() => router.push(`/dashboard/supplier/projects/${project.id}`)}
                        >
                          상세보기
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text color="gray.500">현재 진행중인 프로젝트가 없습니다.</Text>
            )}
          </CardBody>
        </Card>

        {/* My Recent Bids */}
        <Card>
          <CardHeader>
            <Heading size="md">최근 응찰 내역</Heading>
          </CardHeader>
          <CardBody>
            {recentBids.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>프로젝트명</Th>
                    <Th>응찰금액</Th>
                    <Th>납기일수</Th>
                    <Th>상태</Th>
                    <Th>제출일</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {recentBids.map((bid) => (
                    <Tr key={bid.id}>
                      <Td fontWeight="medium">{bid.projects?.title}</Td>
                      <Td>{formatCurrency(bid.amount)}</Td>
                      <Td>{bid.delivery_days}일</Td>
                      <Td>
                        <Badge colorScheme={getBidStatusColor(bid.status)}>
                          {getBidStatusText(bid.status)}
                        </Badge>
                      </Td>
                      <Td>{formatDate(bid.created_at)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text color="gray.500">응찰 내역이 없습니다.</Text>
            )}
          </CardBody>
        </Card>
      </Box>
    </DashboardLayout>
  )
}