'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  useToast,
  NumberInput,
  NumberInputField,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'

export default function SupplierProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const { user } = useAuth()
  const { getProjectById, getBidsByProject, createBid } = useData()
  
  const [project, setProject] = useState<any>(null)
  const [existingBid, setExistingBid] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    amount: 0,
    deliveryTime: 30,
    proposal: '',
  })

  useEffect(() => {
    if (!user || user.userType !== 'B') {
      router.push('/dashboard')
      return
    }
    
    fetchProjectData()
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
      router.push('/dashboard/supplier')
      return
    }
    
    setProject(projectData)
    
    // Check if user already submitted a bid
    const bids = getBidsByProject(projectId)
    const userBid = bids.find(bid => bid.bidderId === user?.id)
    setExistingBid(userBid)
    
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: '로그인이 필요합니다',
        status: 'error',
        duration: 3000,
      })
      return
    }

    setSubmitting(true)

    try {
      const newBid = createBid({
        projectId: params.id as string,
        bidderId: user.id,
        amount: formData.amount,
        deliveryTime: formData.deliveryTime,
        proposal: formData.proposal,
        status: 'pending',
        bidderCompany: user.companyName,
        bidderEmail: user.email,
      })

      toast({
        title: '입찰이 제출되었습니다',
        status: 'success',
        duration: 3000,
      })

      router.push('/dashboard/supplier')
    } catch (error) {
      toast({
        title: '입찰 제출 실패',
        description: '다시 시도해주세요',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setSubmitting(false)
    }
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
      <Box maxW="3xl" mx="auto">
        <VStack align="stretch" spacing={6}>
          <HStack justify="space-between">
            <Heading size="lg">{project.title}</Heading>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/supplier')}
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
                  <Text fontWeight="bold" minW="120px">발주처:</Text>
                  <Text>{project.buyerCompany}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="120px">상태:</Text>
                  <Badge colorScheme={project.status === 'open' ? 'green' : 'gray'}>
                    {project.status === 'open' ? '입찰 진행중' : '마감'}
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

          {existingBid ? (
            <Card>
              <CardHeader>
                <Heading size="md">제출한 입찰</Heading>
              </CardHeader>
              <CardBody>
                <Alert status={existingBid.status === 'accepted' ? 'success' : existingBid.status === 'rejected' ? 'error' : 'info'}>
                  <AlertIcon />
                  {existingBid.status === 'accepted' ? '축하합니다! 낙찰되었습니다.' :
                   existingBid.status === 'rejected' ? '아쉽게도 선정되지 않았습니다.' :
                   '입찰이 심사 중입니다.'}
                </Alert>
                <VStack align="stretch" spacing={3} mt={4}>
                  <HStack>
                    <Text fontWeight="bold" minW="120px">입찰금액:</Text>
                    <Text>{formatCurrency(existingBid.amount)}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold" minW="120px">납기일:</Text>
                    <Text>{existingBid.deliveryTime}일</Text>
                  </HStack>
                  <Box>
                    <Text fontWeight="bold" mb={2}>제안내용:</Text>
                    <Text whiteSpace="pre-wrap">{existingBid.proposal}</Text>
                  </Box>
                  <HStack>
                    <Text fontWeight="bold" minW="120px">상태:</Text>
                    <Badge colorScheme={getStatusColor(existingBid.status)}>
                      {existingBid.status === 'pending' ? '심사중' :
                       existingBid.status === 'accepted' ? '낙찰' : '탈락'}
                    </Badge>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ) : project.status === 'open' ? (
            <Card>
              <CardHeader>
                <Heading size="md">입찰 제출</Heading>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>입찰금액 (원)</FormLabel>
                      <NumberInput
                        value={formData.amount}
                        onChange={(value) => setFormData({ ...formData, amount: parseInt(value) || 0 })}
                        min={0}
                        max={project.budget}
                      >
                        <NumberInputField placeholder="입찰 금액을 입력하세요" />
                      </NumberInput>
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        예산: {formatCurrency(project.budget)}
                      </Text>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>납기일 (일)</FormLabel>
                      <NumberInput
                        value={formData.deliveryTime}
                        onChange={(value) => setFormData({ ...formData, deliveryTime: parseInt(value) || 30 })}
                        min={1}
                      >
                        <NumberInputField placeholder="납기일을 입력하세요" />
                      </NumberInput>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>제안내용</FormLabel>
                      <Textarea
                        value={formData.proposal}
                        onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
                        placeholder="제안 내용을 상세히 작성해주세요"
                        rows={6}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      width="full"
                      isLoading={submitting}
                    >
                      입찰 제출
                    </Button>
                  </VStack>
                </form>
              </CardBody>
            </Card>
          ) : (
            <Alert status="warning">
              <AlertIcon />
              이 프로젝트는 마감되었습니다.
            </Alert>
          )}
        </VStack>
      </Box>
    </DashboardLayout>
  )
}