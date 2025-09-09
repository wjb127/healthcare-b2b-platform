'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useColorModeValue,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const sidebarBg = useColorModeValue('white', 'gray.800');
  
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = user.userType === 'A' 
    ? [
        { label: '대시보드', href: '/dashboard/buyer' },
        { label: '내 프로젝트', href: '/dashboard/buyer/projects' },
        { label: '새 프로젝트', href: '/dashboard/buyer/projects/new' },
      ]
    : [
        { label: '대시보드', href: '/dashboard/supplier' },
        { label: '프로젝트 목록', href: '/dashboard/supplier/projects' },
        { label: '내 입찰', href: '/dashboard/supplier/bids' },
      ];

  const SidebarContent = () => (
    <VStack align="stretch" spacing={4}>
      <Box p={4}>
        <Text fontSize="lg" fontWeight="bold">
          {user.companyName}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {user.userType === 'A' ? '구매자' : '공급업체'}
        </Text>
      </Box>
      
      <VStack align="stretch" spacing={1} px={2}>
        {menuItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? 'solid' : 'ghost'}
            colorScheme={pathname === item.href ? 'blue' : 'gray'}
            justifyContent="flex-start"
            onClick={() => {
              router.push(item.href);
              onClose();
            }}
          >
            {item.label}
          </Button>
        ))}
      </VStack>
      
      <Box px={2} mt="auto">
        <Button
          variant="outline"
          colorScheme="red"
          width="full"
          onClick={signOut}
        >
          로그아웃
        </Button>
      </Box>
    </VStack>
  );

  return (
    <Flex h="100vh" bg={bgColor}>
      <Box
        display={{ base: 'none', md: 'block' }}
        w="250px"
        bg={sidebarBg}
        borderRightWidth={1}
        p={4}
      >
        <SidebarContent />
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{user.companyName}</DrawerHeader>
          <DrawerBody>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Box flex={1} overflow="auto">
        <HStack
          display={{ base: 'flex', md: 'none' }}
          p={4}
          borderBottomWidth={1}
          bg={sidebarBg}
        >
          <IconButton
            icon={<HamburgerIcon />}
            aria-label="Open menu"
            onClick={onOpen}
          />
          <Text fontWeight="bold">{user.companyName}</Text>
        </HStack>
        
        <Box p={6}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
}