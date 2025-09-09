'use client'

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  SimpleGrid,
  Icon,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { FaHandshake, FaChartLine, FaShieldAlt, FaUsers } from 'react-icons/fa'

const Feature = ({ title, text, icon }: any) => {
  return (
    <Stack align={'center'} textAlign="center">
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'brand.500'}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600} fontSize="lg">{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  )
}

export default function HomePage() {
  const router = useRouter()
  const bgGradient = useColorModeValue(
    'linear(to-r, brand.400, brand.600)',
    'linear(to-r, brand.200, brand.400)'
  )

  return (
    <Box>
      {/* Hero Section */}
      <Box bgGradient={bgGradient} color="white">
        <Container maxW={'7xl'} py={{ base: 20, md: 28 }}>
          <Stack
            align={'center'}
            spacing={{ base: 8, md: 10 }}
            direction={{ base: 'column', md: 'row' }}
          >
            <Stack flex={1} spacing={{ base: 5, md: 8 }}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
              >
                <Text as={'span'}>
                  Healthcare B2B
                </Text>
                <br />
                <Text as={'span'} fontSize={{ base: '2xl', sm: '3xl', lg: '5xl' }}>
                  비딩 플랫폼
                </Text>
              </Heading>
              <Text color={'gray.100'} fontSize={{ base: 'md', lg: 'lg' }}>
                의료 기관과 공급업체를 연결하는 투명하고 효율적인 비딩 시스템.
                최적의 파트너를 찾아 경쟁력 있는 가격으로 거래하세요.
              </Text>
              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={{ base: 'column', sm: 'row' }}
              >
                <Button
                  rounded={'full'}
                  size={'lg'}
                  fontWeight={'normal'}
                  px={6}
                  colorScheme={'whiteAlpha'}
                  bg={'white'}
                  color={'brand.500'}
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => router.push('/auth/signup')}
                >
                  지금 시작하기
                </Button>
                <Button
                  rounded={'full'}
                  size={'lg'}
                  fontWeight={'normal'}
                  px={6}
                  variant="outline"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  onClick={() => router.push('/auth/login')}
                >
                  로그인
                </Button>
              </Stack>
            </Stack>
            <Flex
              flex={1}
              justify={'center'}
              align={'center'}
              position={'relative'}
              w={'full'}
            >
              <Box
                position={'relative'}
                height={'350px'}
                rounded={'2xl'}
                width={'full'}
                overflow={'hidden'}
                bg="whiteAlpha.200"
                p={10}
              >
                <VStack spacing={4} align="center" justify="center" h="full">
                  <Icon as={FaHandshake} w={20} h={20} color="white" />
                  <Text fontSize="2xl" fontWeight="bold">
                    신뢰할 수 있는 거래
                  </Text>
                  <Text textAlign="center">
                    투명한 비딩 시스템으로
                    <br />
                    공정한 거래를 보장합니다
                  </Text>
                </VStack>
              </Box>
            </Flex>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box p={8} bg="gray.50">
        <Container maxW={'7xl'} py={16}>
          <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'} mb={10}>
            <Heading fontSize={'3xl'}>주요 기능</Heading>
            <Text color={'gray.600'} fontSize={'lg'}>
              효율적인 B2B 거래를 위한 완벽한 솔루션
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <Feature
              icon={<Icon as={FaUsers} w={10} h={10} />}
              title={'구매자/공급자 매칭'}
              text={'검증된 의료기관과 공급업체를 연결하여 최적의 파트너를 찾아드립니다.'}
            />
            <Feature
              icon={<Icon as={FaChartLine} w={10} h={10} />}
              title={'실시간 비교 분석'}
              text={'여러 공급업체의 견적을 한눈에 비교하고 최적의 조건을 선택하세요.'}
            />
            <Feature
              icon={<Icon as={FaShieldAlt} w={10} h={10} />}
              title={'안전한 거래'}
              text={'검증된 업체만 참여하는 안전한 거래 환경을 제공합니다.'}
            />
            <Feature
              icon={<Icon as={FaHandshake} w={10} h={10} />}
              title={'투명한 프로세스'}
              text={'모든 비딩 과정이 투명하게 공개되어 공정한 경쟁을 보장합니다.'}
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box p={8}>
        <Container maxW={'7xl'} py={16}>
          <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'} mb={10}>
            <Heading fontSize={'3xl'}>이용 방법</Heading>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <Box>
              <Heading size="lg" mb={4} color="brand.500">
                구매자 (의료기관)
              </Heading>
              <VStack align="start" spacing={3}>
                <HStack>
                  <Text fontWeight="bold">1.</Text>
                  <Text>프로젝트 요구사항 등록</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">2.</Text>
                  <Text>공급업체 응찰 접수</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">3.</Text>
                  <Text>견적 비교 및 분석</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">4.</Text>
                  <Text>최적 공급업체 선정</Text>
                </HStack>
              </VStack>
            </Box>

            <Box>
              <Heading size="lg" mb={4} color="brand.500">
                공급자 (벤더)
              </Heading>
              <VStack align="start" spacing={3}>
                <HStack>
                  <Text fontWeight="bold">1.</Text>
                  <Text>진행중인 프로젝트 확인</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">2.</Text>
                  <Text>경쟁력 있는 견적 제출</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">3.</Text>
                  <Text>실시간 응찰 현황 확인</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">4.</Text>
                  <Text>낙찰 및 계약 진행</Text>
                </HStack>
              </VStack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bgGradient={bgGradient} color="white">
        <Container maxW={'7xl'} py={16}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={8}
            align="center"
            justify="center"
          >
            <Stack spacing={4} maxW="2xl" textAlign={{ base: 'center', md: 'left' }}>
              <Heading fontSize={{ base: '2xl', md: '3xl' }}>
                지금 바로 시작하세요
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }}>
                투명하고 효율적인 B2B 거래의 새로운 기준을 경험해보세요.
              </Text>
            </Stack>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
              <Button
                rounded={'full'}
                size={'lg'}
                fontWeight={'normal'}
                px={6}
                bg={'white'}
                color={'brand.500'}
                _hover={{ bg: 'gray.100' }}
                onClick={() => router.push('/auth/signup')}
              >
                무료로 시작하기
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
