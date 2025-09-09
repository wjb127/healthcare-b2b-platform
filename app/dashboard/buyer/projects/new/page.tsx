'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  useToast,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'

export default function NewProjectPage() {
  const router = useRouter()
  const toast = useToast()
  const { user } = useAuth()
  const { createProject } = useData()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: 0,
    deadline: '',
  })

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

    setLoading(true)

    try {
      const newProject = createProject({
        ...formData,
        status: 'open',
        createdBy: user.id,
        buyerCompany: user.companyName,
        buyerEmail: user.email,
      })

      toast({
        title: '프로젝트가 생성되었습니다',
        status: 'success',
        duration: 3000,
      })

      router.push('/dashboard/buyer')
    } catch (error) {
      toast({
        title: '프로젝트 생성 실패',
        description: '다시 시도해주세요',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <Box maxW="2xl" mx="auto">
        <VStack align="stretch" spacing={6}>
          <HStack justify="space-between">
            <Heading size="lg">새 프로젝트 등록</Heading>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/buyer')}
            >
              취소
            </Button>
          </HStack>

          <Card>
            <CardHeader>
              <Heading size="md">프로젝트 정보</Heading>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>프로젝트명</FormLabel>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="프로젝트 제목을 입력하세요"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>설명</FormLabel>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="프로젝트에 대한 상세 설명을 입력하세요"
                      rows={6}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>예산 (원)</FormLabel>
                    <NumberInput
                      value={formData.budget}
                      onChange={(value) => setFormData({ ...formData, budget: parseInt(value) || 0 })}
                      min={0}
                    >
                      <NumberInputField placeholder="예산을 입력하세요" />
                    </NumberInput>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>마감일</FormLabel>
                    <Input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    width="full"
                    isLoading={loading}
                  >
                    프로젝트 등록
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </DashboardLayout>
  )
}