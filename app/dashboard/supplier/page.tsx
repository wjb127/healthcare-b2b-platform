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
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'
import { useRouter } from 'next/navigation'

export default function SupplierDashboard() {
  const [stats, setStats] = useState({
    totalBids: 0,
    pendingBids: 0,
    acceptedBids: 0,
    avgBidAmount: 0,
  })
  const [availableProjects, setAvailableProjects] = useState<any[]>([])
  const [myBids, setMyBids] = useState<any[]>([])
  const router = useRouter()
  const { user } = useAuth()
  const { getProjects, getBidsByUser, getProjectById } = useData()

  useEffect(() => {
    if (!user) return
    
    if (user.userType !== 'B') {
      router.push('/dashboard/buyer')
      return
    }
    
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = () => {
    if (!user) return
    
    // Get all open projects
    const allProjects = getProjects()
    const openProjects = allProjects.filter(p => p.status === 'open')
    setAvailableProjects(openProjects.slice(0, 5))
    
    // Get user's bids
    const userBids = getBidsByUser(user.id)
    const bidsWithProjects = userBids.map(bid => ({
      ...bid,
      project: getProjectById(bid.projectId)
    }))
    setMyBids(bidsWithProjects.slice(0, 5))
    
    const totalBids = userBids.length
    const pendingBids = userBids.filter(b => b.status === 'pending').length
    const acceptedBids = userBids.filter(b => b.status === 'accepted').length
    const avgBidAmount = totalBids > 0 
      ? userBids.reduce((sum, bid) => sum + bid.amount, 0) / totalBids 
      : 0

    setStats({
      totalBids,
      pendingBids,
      acceptedBids,
      avgBidAmount,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow'
      case 'accepted': return 'green'
      case 'rejected': return 'red'
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
    <DashboardLayout>
      <Box>
        <Heading mb={6}>공급업체 대시보드</Heading>

        {/* Stats Grid */}
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mb={8}>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>전체 입찰</StatLabel>
                  <StatNumber>{stats.totalBids}</StatNumber>
                  <StatHelpText>제출한 입찰 수</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>대기중 입찰</StatLabel>
                  <StatNumber>{stats.pendingBids}</StatNumber>
                  <StatHelpText>심사 대기중</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>낙찰된 입찰</StatLabel>
                  <StatNumber>{stats.acceptedBids}</StatNumber>
                  <StatHelpText>성공한 입찰</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>평균 입찰금액</StatLabel>
                  <StatNumber>{formatCurrency(stats.avgBidAmount)}</StatNumber>
                  <StatHelpText>평균 제안 금액</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Available Projects */}
        <Card mb={6}>
          <CardHeader>
            <Heading size="md">입찰 가능 프로젝트</Heading>
          </CardHeader>
          <CardBody>
            {availableProjects.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>프로젝트명</Th>
                    <Th>예산</Th>
                    <Th>마감일</Th>
                    <Th>발주처</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {availableProjects.map((project) => (
                    <Tr key={project.id}>
                      <Td fontWeight="medium">{project.title}</Td>
                      <Td>{formatCurrency(project.budget)}</Td>
                      <Td>{formatDate(project.deadline)}</Td>
                      <Td>{project.buyerCompany}</Td>
                      <Td>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => router.push(`/dashboard/supplier/projects/${project.id}`)}
                        >
                          입찰하기
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text color="gray.500">현재 입찰 가능한 프로젝트가 없습니다.</Text>
            )}
          </CardBody>
        </Card>

        {/* My Bids */}
        <Card>
          <CardHeader>
            <Heading size="md">내 입찰 현황</Heading>
          </CardHeader>
          <CardBody>
            {myBids.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>프로젝트명</Th>
                    <Th>입찰금액</Th>
                    <Th>납기일</Th>
                    <Th>상태</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {myBids.map((bid) => (
                    <Tr key={bid.id}>
                      <Td fontWeight="medium">{bid.project?.title}</Td>
                      <Td>{formatCurrency(bid.amount)}</Td>
                      <Td>{bid.deliveryTime}일</Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(bid.status)}>
                          {bid.status === 'pending' ? '대기중' : 
                           bid.status === 'accepted' ? '낙찰' : '탈락'}
                        </Badge>
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/dashboard/supplier/projects/${bid.projectId}`)}
                        >
                          상세보기
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text color="gray.500">제출한 입찰이 없습니다.</Text>
            )}
          </CardBody>
        </Card>
      </Box>
    </DashboardLayout>
  )
}