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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
} from '@chakra-ui/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { createClient } from '@/lib/supabase/client'
import * as XLSX from 'xlsx'

export default function BuyerProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [project, setProject] = useState<any>(null)
  const [bids, setBids] = useState<any[]>([])
  const [selectedBid, setSelectedBid] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single()

      if (projectData) {
        setProject(projectData)

        // Fetch all bids for this project
        const { data: bidsData } = await supabase
          .from('bids')
          .select(`
            *,
            profiles!bids_bidder_id_fkey(company_name, representative_name, phone, email)
          `)
          .eq('project_id', params.id)
          .order('amount', { ascending: true })

        if (bidsData) {
          setBids(bidsData)
        }
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptBid = async (bidId: string) => {
    try {
      // Update bid status to accepted
      const { error: bidError } = await supabase
        .from('bids')
        .update({ status: 'accepted' })
        .eq('id', bidId)

      if (bidError) throw bidError

      // Update other bids to rejected
      const { error: rejectError } = await supabase
        .from('bids')
        .update({ status: 'rejected' })
        .eq('project_id', params.id)
        .neq('id', bidId)

      if (rejectError) throw rejectError

      // Update project status to awarded
      const { error: projectError } = await supabase
        .from('projects')
        .update({ status: 'awarded' })
        .eq('id', params.id)

      if (projectError) throw projectError

      toast({
        title: '낙찰 완료',
        description: '선택한 응찰자에게 프로젝트가 낙찰되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      onClose()
      fetchProjectData()
    } catch (error: any) {
      toast({
        title: '낙찰 실패',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const exportToExcel = () => {
    const data = bids.map(bid => ({
      '회사명': bid.profiles?.company_name,
      '담당자': bid.profiles?.representative_name,
      '연락처': bid.profiles?.phone,
      '이메일': bid.profiles?.email,
      '응찰금액': bid.amount,
      '납기일수': bid.delivery_days,
      '제안내용': bid.proposal,
      '제출일': new Date(bid.created_at).toLocaleDateString('ko-KR'),
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '응찰 비교표')
    XLSX.writeFile(wb, `${project.title}_응찰비교표.xlsx`)

    toast({
      title: '다운로드 완료',
      description: '엑셀 파일이 다운로드되었습니다.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
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
      <DashboardLayout userType="A">
        <Text>로딩중...</Text>
      </DashboardLayout>
    )
  }

  if (!project) {
    return (
      <DashboardLayout userType="A">
        <Text>프로젝트를 찾을 수 없습니다.</Text>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="A">
      <Box maxW="6xl" mx="auto">
        <HStack justify="space-between" mb={6}>
          <Heading>{project.title}</Heading>
          <HStack>
            <Badge
              colorScheme={
                project.status === 'open' ? 'green' :
                project.status === 'closed' ? 'gray' : 'blue'
              }
              fontSize="md"
              px={3}
              py={1}
            >
              {project.status === 'open' ? '진행중' :
               project.status === 'closed' ? '마감' : '낙찰완료'}
            </Badge>
            {bids.length > 0 && (
              <Button colorScheme="green" onClick={exportToExcel}>
                엑셀 다운로드
              </Button>
            )}
          </HStack>
        </HStack>

        <Tabs>
          <TabList>
            <Tab>프로젝트 정보</Tab>
            <Tab>응찰 현황 ({bids.length})</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
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
                      <Text>{formatDate(project.deadline)}</Text>
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
                    <Divider />
                    <Box>
                      <Text fontWeight="bold" mb={2}>상세 요구사항:</Text>
                      <Text whiteSpace="pre-wrap">{project.requirements}</Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            <TabPanel>
              {bids.length > 0 ? (
                <Card>
                  <CardBody>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>순위</Th>
                          <Th>회사명</Th>
                          <Th>응찰금액</Th>
                          <Th>납기일수</Th>
                          <Th>상태</Th>
                          <Th></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {bids.map((bid, index) => (
                          <Tr key={bid.id}>
                            <Td>{index + 1}</Td>
                            <Td fontWeight="medium">{bid.profiles?.company_name}</Td>
                            <Td>{formatCurrency(bid.amount)}</Td>
                            <Td>{bid.delivery_days}일</Td>
                            <Td>
                              <Badge colorScheme={
                                bid.status === 'accepted' ? 'green' :
                                bid.status === 'rejected' ? 'red' :
                                bid.status === 'reviewed' ? 'blue' : 'yellow'
                              }>
                                {bid.status === 'submitted' ? '제출됨' :
                                 bid.status === 'reviewed' ? '검토중' :
                                 bid.status === 'accepted' ? '낙찰' : '탈락'}
                              </Badge>
                            </Td>
                            <Td>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedBid(bid)
                                  onOpen()
                                }}
                              >
                                상세보기
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
              ) : (
                <Card>
                  <CardBody>
                    <Text color="gray.500" textAlign="center">
                      아직 응찰이 없습니다.
                    </Text>
                  </CardBody>
                </Card>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Bid Detail Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>응찰 상세 정보</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedBid && (
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">회사명:</Text>
                    <Text>{selectedBid.profiles?.company_name}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">담당자:</Text>
                    <Text>{selectedBid.profiles?.representative_name}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">연락처:</Text>
                    <Text>{selectedBid.profiles?.phone}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">이메일:</Text>
                    <Text>{selectedBid.profiles?.email}</Text>
                  </HStack>
                  <Divider />
                  <HStack justify="space-between">
                    <Text fontWeight="bold">응찰 금액:</Text>
                    <Text fontSize="lg" fontWeight="bold" color="brand.500">
                      {formatCurrency(selectedBid.amount)}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">납기 일수:</Text>
                    <Text>{selectedBid.delivery_days}일</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold">제출일:</Text>
                    <Text>{formatDate(selectedBid.created_at)}</Text>
                  </HStack>
                  <Divider />
                  <Box>
                    <Text fontWeight="bold" mb={2}>제안 내용:</Text>
                    <Text whiteSpace="pre-wrap" bg="gray.50" p={4} borderRadius="md">
                      {selectedBid.proposal}
                    </Text>
                  </Box>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                닫기
              </Button>
              {project.status === 'open' && selectedBid?.status === 'submitted' && (
                <Button
                  colorScheme="brand"
                  onClick={() => handleAcceptBid(selectedBid.id)}
                >
                  낙찰하기
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </DashboardLayout>
  )
}