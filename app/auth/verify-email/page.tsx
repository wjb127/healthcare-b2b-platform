'use client'

import { Box, Heading, Text, VStack, Icon } from '@chakra-ui/react'
import { EmailIcon } from '@chakra-ui/icons'

export default function VerifyEmailPage() {
  return (
    <Box maxW="md" mx="auto" mt={20} p={6} textAlign="center">
      <VStack spacing={6}>
        <Icon as={EmailIcon} boxSize={16} color="brand.500" />
        <Heading size="lg">이메일을 확인해주세요</Heading>
        <Text color="gray.600">
          가입하신 이메일로 인증 링크를 보내드렸습니다.
          <br />
          이메일을 확인하여 인증을 완료해주세요.
        </Text>
      </VStack>
    </Box>
  )
}