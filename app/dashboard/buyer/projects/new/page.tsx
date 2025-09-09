'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  Select,
  HStack,
  useToast,
  FormErrorMessage,
  Card,
  CardBody,
  FormHelperText,
} from '@chakra-ui/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { createClient } from '@/lib/supabase/client'

export default function NewProjectPage() {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    region: '',
    scheduleStart: '',
    scheduleEnd: '',
    requirements: '',
    budgetMin: '',
    budgetMax: '',
    deadline: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const supabase = createClient()

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title) newErrors.title = '프로젝트명을 입력해주세요'
    if (!formData.category) newErrors.category = '카테고리를 선택해주세요'
    if (!formData.requirements) newErrors.requirements = '요구사항을 입력해주세요'
    if (!formData.deadline) newErrors.deadline = '마감일을 설정해주세요'
    
    if (formData.budgetMin && formData.budgetMax) {
      if (Number(formData.budgetMin) > Number(formData.budgetMax)) {
        newErrors.budgetMax = '최대 예산은 최소 예산보다 커야 합니다'
      }
    }

    if (formData.scheduleStart && formData.scheduleEnd) {
      if (new Date(formData.scheduleStart) > new Date(formData.scheduleEnd)) {
        newErrors.scheduleEnd = '종료일은 시작일 이후여야 합니다'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: formData.title,
          category: formData.category,
          region: formData.region || null,
          schedule_start: formData.scheduleStart || null,
          schedule_end: formData.scheduleEnd || null,
          requirements: formData.requirements,
          budget_min: formData.budgetMin ? Number(formData.budgetMin) : null,
          budget_max: formData.budgetMax ? Number(formData.budgetMax) : null,
          deadline: formData.deadline,
          status: 'open',
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: '프로젝트 등록 완료',
        description: '프로젝트가 성공적으로 등록되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push(`/dashboard/buyer/projects/${data.id}`)
    } catch (error: any) {
      toast({
        title: '프로젝트 등록 실패',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout userType="A">
      <Box maxW="3xl" mx="auto">
        <Heading mb={6}>새 프로젝트 등록</Heading>

        <Card>
          <CardBody>
            <VStack spacing={6} as="form" onSubmit={handleSubmit}>
              <FormControl isRequired isInvalid={!!errors.title}>
                <FormLabel>프로젝트명</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="프로젝트 제목을 입력하세요"
                />
                <FormErrorMessage>{errors.title}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.category}>
                <FormLabel>카테고리</FormLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="카테고리를 선택하세요"
                >
                  <option value="의료기기">의료기기</option>
                  <option value="의료소모품">의료소모품</option>
                  <option value="의약품">의약품</option>
                  <option value="병원설비">병원설비</option>
                  <option value="IT솔루션">IT솔루션</option>
                  <option value="의료서비스">의료서비스</option>
                  <option value="기타">기타</option>
                </Select>
                <FormErrorMessage>{errors.category}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>지역</FormLabel>
                <Input
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="서울, 경기, 부산 등"
                />
              </FormControl>

              <HStack spacing={4} width="full">
                <FormControl isInvalid={!!errors.scheduleStart}>
                  <FormLabel>프로젝트 시작일</FormLabel>
                  <Input
                    type="date"
                    value={formData.scheduleStart}
                    onChange={(e) => setFormData({ ...formData, scheduleStart: e.target.value })}
                  />
                  <FormErrorMessage>{errors.scheduleStart}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.scheduleEnd}>
                  <FormLabel>프로젝트 종료일</FormLabel>
                  <Input
                    type="date"
                    value={formData.scheduleEnd}
                    onChange={(e) => setFormData({ ...formData, scheduleEnd: e.target.value })}
                  />
                  <FormErrorMessage>{errors.scheduleEnd}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isRequired isInvalid={!!errors.requirements}>
                <FormLabel>상세 요구사항</FormLabel>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="프로젝트의 상세 요구사항을 입력하세요"
                  rows={6}
                />
                <FormErrorMessage>{errors.requirements}</FormErrorMessage>
              </FormControl>

              <HStack spacing={4} width="full">
                <FormControl isInvalid={!!errors.budgetMin}>
                  <FormLabel>예산 범위 (최소)</FormLabel>
                  <Input
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                    placeholder="최소 예산 (원)"
                  />
                  <FormErrorMessage>{errors.budgetMin}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.budgetMax}>
                  <FormLabel>예산 범위 (최대)</FormLabel>
                  <Input
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                    placeholder="최대 예산 (원)"
                  />
                  <FormErrorMessage>{errors.budgetMax}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isRequired isInvalid={!!errors.deadline}>
                <FormLabel>응찰 마감일</FormLabel>
                <Input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
                <FormHelperText>응찰 접수 마감 일시를 설정하세요</FormHelperText>
                <FormErrorMessage>{errors.deadline}</FormErrorMessage>
              </FormControl>

              <HStack spacing={4} width="full">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/buyer/projects')}
                  isDisabled={loading}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  colorScheme="brand"
                  isLoading={loading}
                  loadingText="등록중..."
                >
                  프로젝트 등록
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </DashboardLayout>
  )
}