'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormErrorMessage,
} from '@chakra-ui/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { createClient } from '@/lib/supabase/client'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [project, setProject] = useState<any>(null)
  const [myBid, setMyBid] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [bidForm, setBidForm] = useState({
    amount: '',
    deliveryDays: '',
    proposal: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const supabase = createClient()

  useEffect(() => {
    fetchProjectData()
  }, [params.id])

  const fetchProjectData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch project details
      const { data: projectData } = await supabase
        .from('projects')
        .select(`
          *,
          profiles!projects_user_id_fkey(company_name, representative_name)
        `)
        .eq('id', params.id)
        .single()

      if (projectData) {
        setProject(projectData)

        // Check if I already bid on this project
        const { data: bidData } = await supabase
          .from('bids')
          .select('*')
          .eq('project_id', params.id)
          .eq('bidder_id', user.id)
          .single()

        if (bidData) {
          setMyBid(bidData)
        }
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!bidForm.amount) newErrors.amount = '응찰 금액을 입력해주세요'
    if (Number(bidForm.amount) <= 0) newErrors.amount = '유효한 금액을 입력해주세요'
    if (!bidForm.deliveryDays) newErrors.deliveryDays = '납기 일수를 입력해주세요'
    if (Number(bidForm.deliveryDays) <= 0) newErrors.deliveryDays = '유효한 일수를 입력해주세요'
    if (!bidForm.proposal) newErrors.proposal = '제안서를 작성해주세요'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitBid = async () => {
    if (!validate()) return

    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('bids')
        .insert({
          project_id: params.id,
          bidder_id: user.id,
          amount: Number(bidForm.amount),
          delivery_days: Number(bidForm.deliveryDays),
          proposal: bidForm.proposal,
          status: 'submitted',
        })

      if (error) throw error

      toast({
        title: '응찰 완료',
        description: '응찰이 성공적으로 제출되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      onClose()
      fetchProjectData()
    } catch (error: any) {
      toast({
        title: '응찰 실패',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setSubmitting(false)
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

  if (loading) {
    return (
      <DashboardLayout userType="B">
        <Text>로딩중...</Text>
      </DashboardLayout>
    )
  }

  if (!project) {
    return (
      <DashboardLayout userType="B">
        <Text>프로젝트를 찾을 수 없습니다.</Text>
      </DashboardLayout>
    )
  }

  const isDeadlinePassed = new Date(project.deadline) < new Date()

  return (
    <DashboardLayout userType="B">
      <Box maxW="4xl" mx="auto">
        <HStack justify="space-between" mb={6}>
          <Heading>{project.title}</Heading>
          <Badge
            colorScheme={project.status === 'open' ? 'green' : 'gray'}
            fontSize="md"
            px={3}
            py={1}
          >
            {project.status === 'open' ? '진행중' : '마감'}
          </Badge>
        </HStack>

        <Card mb={6}>
          <CardHeader>
            <Heading size="md">프로젝트 정보</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Text fontWeight="bold">구매자:</Text>
                <Text>{project.profiles?.company_name}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">카테고리:</Text>
                <Text>{project.category}</Text>
              </HStack>
              {project.region && (
                <HStack justify="space-between">
                  <Text fontWeight="bold">지역:</Text>
                  <Text>{project.region}</Text>
                </HStack>
              )}
              <HStack justify="space-between">
                <Text fontWeight="bold">응찰 마감일:</Text>
                <Text color={isDeadlinePassed ? 'red.500' : 'inherit'}>
                  {formatDate(project.deadline)}
                </Text>
              </HStack>
              {project.schedule_start && project.schedule_end && (
                <HStack justify="space-between">
                  <Text fontWeight="bold">프로젝트 기간:</Text>
                  <Text>
                    {formatDate(project.schedule_start)} ~ {formatDate(project.schedule_end)}
                  </Text>
                </HStack>
              )}
              {(project.budget_min || project.budget_max) && (
                <HStack justify="space-between">
                  <Text fontWeight="bold">예산 범위:</Text>
                  <Text>
                    {project.budget_min && formatCurrency(project.budget_min)}
                    {project.budget_min && project.budget_max && ' ~ '}
                    {project.budget_max && formatCurrency(project.budget_max)}
                  </Text>
                </HStack>
              )}
            </VStack>
          </CardBody>
        </Card>

        <Card mb={6}>
          <CardHeader>
            <Heading size="md">상세 요구사항</Heading>
          </CardHeader>
          <CardBody>
            <Text whiteSpace="pre-wrap">{project.requirements}</Text>
          </CardBody>
        </Card>

        {myBid ? (
          <Card>
            <CardHeader>
              <Heading size="md">내 응찰 내역</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Text fontWeight="bold">응찰 금액:</Text>
                  <Text>{formatCurrency(myBid.amount)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">납기 일수:</Text>
                  <Text>{myBid.delivery_days}일</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">상태:</Text>
                  <Badge colorScheme={
                    myBid.status === 'accepted' ? 'green' :
                    myBid.status === 'rejected' ? 'red' :
                    myBid.status === 'reviewed' ? 'blue' : 'yellow'
                  }>
                    {myBid.status === 'submitted' ? '제출됨' :
                     myBid.status === 'reviewed' ? '검토중' :
                     myBid.status === 'accepted' ? '낙찰' : '탈락'}
                  </Badge>
                </HStack>
                <Divider />
                <Box>
                  <Text fontWeight="bold" mb={2}>제안 내용:</Text>
                  <Text whiteSpace="pre-wrap">{myBid.proposal}</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Box textAlign="center">
            {!isDeadlinePassed && project.status === 'open' ? (
              <Button colorScheme="brand" size="lg" onClick={onOpen}>
                응찰하기
              </Button>
            ) : (
              <Text color="gray.500">응찰 마감되었습니다</Text>
            )}
          </Box>
        )}

        {/* Bid Submission Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>응찰서 제출</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired isInvalid={!!errors.amount}>
                  <FormLabel>응찰 금액 (원)</FormLabel>
                  <Input
                    type="number"
                    value={bidForm.amount}
                    onChange={(e) => setBidForm({ ...bidForm, amount: e.target.value })}
                    placeholder="응찰 금액을 입력하세요"
                  />
                  <FormErrorMessage>{errors.amount}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.deliveryDays}>
                  <FormLabel>납기 일수</FormLabel>
                  <Input
                    type="number"
                    value={bidForm.deliveryDays}
                    onChange={(e) => setBidForm({ ...bidForm, deliveryDays: e.target.value })}
                    placeholder="프로젝트 완료까지 필요한 일수"
                  />
                  <FormErrorMessage>{errors.deliveryDays}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.proposal}>
                  <FormLabel>제안서</FormLabel>
                  <Textarea
                    value={bidForm.proposal}
                    onChange={(e) => setBidForm({ ...bidForm, proposal: e.target.value })}
                    placeholder="프로젝트 수행 계획과 강점을 작성해주세요"
                    rows={8}
                  />
                  <FormErrorMessage>{errors.proposal}</FormErrorMessage>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                취소
              </Button>
              <Button
                colorScheme="brand"
                onClick={handleSubmitBid}
                isLoading={submitting}
              >
                응찰 제출
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </DashboardLayout>
  )
}