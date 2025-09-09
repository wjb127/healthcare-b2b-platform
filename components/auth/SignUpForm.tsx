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
  RadioGroup,
  Radio,
  HStack,
  Heading,
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'A' as 'A' | 'B',
    companyName: '',
    businessRegistrationNumber: '',
    representativeName: '',
    contactPhone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.userType,
      {
        companyName: formData.companyName,
        businessRegistrationNumber: formData.businessRegistrationNumber,
        representativeName: formData.representativeName,
        contactPhone: formData.contactPhone,
        address: formData.address,
      }
    );

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <Box maxW="lg" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={4}>
        <Heading size="lg">회원가입</Heading>
        
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>사용자 유형</FormLabel>
              <RadioGroup
                value={formData.userType}
                onChange={(value) => setFormData({ ...formData, userType: value as 'A' | 'B' })}
              >
                <HStack spacing={4}>
                  <Radio value="A">구매자 (의료기관)</Radio>
                  <Radio value="B">공급업체</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>이메일</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>비밀번호</FormLabel>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="최소 6자 이상"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>비밀번호 확인</FormLabel>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="비밀번호를 다시 입력하세요"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>회사명</FormLabel>
              <Input
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="회사명을 입력하세요"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>사업자등록번호</FormLabel>
              <Input
                value={formData.businessRegistrationNumber}
                onChange={(e) => setFormData({ ...formData, businessRegistrationNumber: e.target.value })}
                placeholder="123-45-67890"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>대표자명</FormLabel>
              <Input
                value={formData.representativeName}
                onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                placeholder="대표자명을 입력하세요"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>연락처</FormLabel>
              <Input
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="02-1234-5678"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>주소</FormLabel>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="회사 주소를 입력하세요"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={loading}
            >
              회원가입
            </Button>
          </VStack>
        </form>

        <Text>
          이미 계정이 있으신가요?{' '}
          <Link color="blue.500" onClick={() => router.push('/auth/login')}>
            로그인
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}