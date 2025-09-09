'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Link,
  Alert,
  AlertIcon,
  Heading,
  Divider,
  HStack,
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    setError('');
    const { error } = await signIn(demoEmail, 'demo');
    
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={4}>
        <Heading size="lg">로그인</Heading>
        
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>이메일</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>비밀번호</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={loading}
            >
              로그인
            </Button>
          </VStack>
        </form>

        <Divider />
        
        <VStack spacing={3} width="full">
          <Text fontSize="sm" color="gray.600">데모 계정으로 체험하기</Text>
          <HStack spacing={2} width="full">
            <Button
              onClick={() => handleDemoLogin('buyer@example.com')}
              colorScheme="teal"
              variant="outline"
              size="sm"
              flex={1}
              isLoading={loading}
            >
              구매자 체험
            </Button>
            <Button
              onClick={() => handleDemoLogin('supplier@example.com')}
              colorScheme="purple"
              variant="outline"
              size="sm"
              flex={1}
              isLoading={loading}
            >
              공급업체 체험
            </Button>
          </HStack>
        </VStack>

        <Text>
          계정이 없으신가요?{' '}
          <Link color="blue.500" onClick={() => router.push('/auth/signup')}>
            회원가입
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}