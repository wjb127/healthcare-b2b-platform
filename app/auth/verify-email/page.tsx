'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Card,
  CardBody,
  VStack,
  Heading,
  Text,
  Button,
} from '@chakra-ui/react'

export default function VerifyEmailPage() {
  const router = useRouter()

  useEffect(() => {
    // In a real app, this would verify the email token
    // For demo, we'll just show a success message
    const timer = setTimeout(() => {
      router.push('/auth/login')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <Card maxW="md" w="full">
        <CardBody>
          <VStack spacing={6} textAlign="center">
            <Text fontSize="6xl">✅</Text>
            
            <Heading size="lg">이메일 인증 완료</Heading>
            
            <Text color="gray.600">
              이메일 인증이 완료되었습니다.
              잠시 후 로그인 페이지로 이동합니다.
            </Text>
            
            <Button
              colorScheme="blue"
              onClick={() => router.push('/auth/login')}
            >
              지금 로그인하기
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  )
}