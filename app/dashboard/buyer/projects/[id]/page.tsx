'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Box,
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
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'
import * as XLSX from 'xlsx'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const { user } = useAuth()
  const { getProjectById, getBidsByProject, updateBidStatus } = useData()
  
  interface Project {
    id: string
    title: string
    description: string
    budget: number
    deadline: string
    status: string
    createdBy: string
    createdAt: string
    buyerCompany?: string
    buyerEmail?: string
  }

  interface Bid {
    id: string
    projectId: string
    bidderId: string
    amount: number
    deliveryTime: number
    proposal: string
    status: string
    bidderCompany?: string
    bidderEmail?: string
    createdAt: string
  }

  const [project, setProject] = useState<Project | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.userType !== 'A') {
      router.push('/dashboard')
      return
    }
    
    fetchProjectData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, user])

  const fetchProjectData = () => {
    const projectId = params.id as string
    const projectData = getProjectById(projectId)
    
    if (!projectData) {
      toast({
        title: '프로젝트를 찾을 수 없습니다',
        status: 'error',
        duration: 3000,
      })
      router.push('/dashboard/buyer')
      return
    }
    
    setProject(projectData)
    setBids(getBidsByProject(projectId))
    setLoading(false)
  }

  const handleAcceptBid = (bidId: string) => {
    updateBidStatus(bidId, 'accepted')
    
    // Reject other bids
    bids.forEach(bid => {
      if (bid.id !== bidId) {
        updateBidStatus(bid.id, 'rejected')
      }
    })
    
    toast({
      title: '입찰이 선택되었습니다',
      status: 'success',
      duration: 3000,
    })
    
    fetchProjectData()
  }

  const exportToExcel = () => {
    if (!project) return
    
    const ws = XLSX.utils.json_to_sheet(bids.map(bid => ({
      '업체명': bid.bidderCompany || 'Unknown',
      '입찰금액': bid.amount,
      '납기일': `${bid.deliveryTime}일`,
      '제안내용': bid.proposal,
      '상태': bid.status === 'pending' ? '대기중' : bid.status === 'accepted' ? '낙찰' : '탈락',
      '제출일': new Date(bid.createdAt).toLocaleDateString('ko-KR')
    })))
    
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '입찰목록')
    XLSX.writeFile(wb, `${project.title}_입찰목록.xlsx`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ko-KR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow'
      case 'accepted': return 'green'
      case 'rejected': return 'red'
      default: return 'gray'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Box>Loading...</Box>
      </DashboardLayout>
    )
  }

  if (!project) {
    return null
  }

  return (
    <DashboardLayout>
      <Box>
        <VStack align="stretch" spacing={6}>
          <HStack justify="space-between">
            <Heading size="lg">{project.title}</Heading>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/buyer')}
            >
              목록으로
            </Button>
          </HStack>

          <Card>
            <CardHeader>
              <Heading size="md">프로젝트 정보</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <HStack>
                  <Text fontWeight="bold" minW="120px">상태:</Text>
                  <Badge colorScheme={project.status === 'open' ? 'green' : 'gray'}>
                    {project.status === 'open' ? '진행중' : '마감'}
                  </Badge>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="120px">예산:</Text>
                  <Text>{formatCurrency(project.budget)}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="120px">마감일:</Text>
                  <Text>{formatDate(project.deadline)}</Text>
                </HStack>
                <Box>
                  <Text fontWeight="bold" mb={2}>설명:</Text>
                  <Text whiteSpace="pre-wrap">{project.description}</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">입찰 목록 ({bids.length}개)</Heading>
                {bids.length > 0 && (
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={exportToExcel}
                  >
                    엑셀 다운로드
                  </Button>
                )}
              </HStack>
            </CardHeader>
            <CardBody>
              {bids.length > 0 ? (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>업체명</Th>
                      <Th>입찰금액</Th>
                      <Th>납기일</Th>
                      <Th>제안내용</Th>
                      <Th>상태</Th>
                      <Th>제출일</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {bids.map((bid) => (
                      <Tr key={bid.id}>
                        <Td fontWeight="medium">{bid.bidderCompany || 'Unknown'}</Td>
                        <Td>{formatCurrency(bid.amount)}</Td>
                        <Td>{bid.deliveryTime}일</Td>
                        <Td maxW="300px" isTruncated>{bid.proposal}</Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(bid.status)}>
                            {bid.status === 'pending' ? '대기중' : 
                             bid.status === 'accepted' ? '낙찰' : '탈락'}
                          </Badge>
                        </Td>
                        <Td>{formatDate(bid.createdAt)}</Td>
                        <Td>
                          {bid.status === 'pending' && project.status === 'open' && (
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={() => handleAcceptBid(bid.id)}
                            >
                              선택
                            </Button>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Text color="gray.500">아직 제출된 입찰이 없습니다.</Text>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </DashboardLayout>
  )
}