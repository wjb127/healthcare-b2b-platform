'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  RadioGroup,
  Radio,
  Stack,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react'
import { createClient } from '@/lib/supabase/client'

export default function SignUpForm() {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'A',
    companyName: '',
    representativeName: '',
    phone: '',
    businessNumber: '',
    address: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = '이메일을 입력해주세요'
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요'
    if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
    }
    if (!formData.companyName) newErrors.companyName = '회사명을 입력해주세요'
    if (!formData.representativeName) {
      newErrors.representativeName = '담당자명을 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const supabase = createClient()

    try {
      // Sign up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            user_type: formData.userType as 'A' | 'B',
            company_name: formData.companyName,
            representative_name: formData.representativeName,
            phone: formData.phone,
            business_number: formData.businessNumber,
            address: formData.address,
          })
          .eq('id', authData.user.id)

        if (profileError) throw profileError

        toast({
          title: '회원가입 성공',
          description: '이메일을 확인해주세요.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })

        router.push('/auth/verify-email')
      }
    } catch (error: any) {
      toast({
        title: '회원가입 실패',
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
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Heading size="lg">회원가입</Heading>

        <FormControl isRequired>
          <FormLabel>사용자 유형</FormLabel>
          <RadioGroup
            value={formData.userType}
            onChange={(value) => setFormData({ ...formData, userType: value })}
          >
            <Stack direction="row" spacing={4}>
              <Radio value="A">구매자 (요청자)</Radio>
              <Radio value="B">공급자 (응찰자)</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.email}>
          <FormLabel>이메일</FormLabel>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.password}>
          <FormLabel>비밀번호</FormLabel>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.confirmPassword}>
          <FormLabel>비밀번호 확인</FormLabel>
          <Input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.companyName}>
          <FormLabel>회사명</FormLabel>
          <Input
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
          />
          <FormErrorMessage>{errors.companyName}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.representativeName}>
          <FormLabel>담당자명</FormLabel>
          <Input
            value={formData.representativeName}
            onChange={(e) =>
              setFormData({ ...formData, representativeName: e.target.value })
            }
          />
          <FormErrorMessage>{errors.representativeName}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>전화번호</FormLabel>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </FormControl>

        <FormControl>
          <FormLabel>사업자등록번호</FormLabel>
          <Input
            value={formData.businessNumber}
            onChange={(e) =>
              setFormData({ ...formData, businessNumber: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>주소</FormLabel>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </FormControl>

        <Button type="submit" colorScheme="brand" size="lg" width="full" isLoading={loading}>
          회원가입
        </Button>

        <Text fontSize="sm">
          이미 계정이 있으신가요?{' '}
          <Button variant="link" colorScheme="brand" onClick={() => router.push('/auth/login')}>
            로그인
          </Button>
        </Text>
      </VStack>
    </Box>
  )
}