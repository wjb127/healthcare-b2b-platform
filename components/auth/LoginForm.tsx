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
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = '이메일을 입력해주세요'
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      if (data.user) {
        // Get user profile to determine user type
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single()

        toast({
          title: '로그인 성공',
          description: '대시보드로 이동합니다.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })

        // Redirect based on user type
        if (profile?.user_type === 'A') {
          router.push('/dashboard/buyer')
        } else if (profile?.user_type === 'B') {
          router.push('/dashboard/supplier')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error: any) {
      toast({
        title: '로그인 실패',
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
        <Heading size="lg">로그인</Heading>

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

        <Button type="submit" colorScheme="brand" size="lg" width="full" isLoading={loading}>
          로그인
        </Button>

        <Text fontSize="sm">
          계정이 없으신가요?{' '}
          <Button variant="link" colorScheme="brand" onClick={() => router.push('/auth/signup')}>
            회원가입
          </Button>
        </Text>
      </VStack>
    </Box>
  )
}