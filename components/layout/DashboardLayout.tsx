'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  IconButton,
  useDisclosure,
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface DashboardLayoutProps {
  children: ReactNode
  userType: 'A' | 'B'
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profileData)
      } else {
        router.push('/auth/login')
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const menuItems = userType === 'A' 
    ? [
        { label: '대시보드', href: '/dashboard/buyer' },
        { label: '프로젝트 관리', href: '/dashboard/buyer/projects' },
        { label: '새 프로젝트', href: '/dashboard/buyer/projects/new' },
        { label: '응찰 비교', href: '/dashboard/buyer/bids' },
        { label: '알림', href: '/dashboard/notifications' },
      ]
    : [
        { label: '대시보드', href: '/dashboard/supplier' },
        { label: '프로젝트 찾기', href: '/dashboard/supplier/projects' },
        { label: '내 응찰', href: '/dashboard/supplier/bids' },
        { label: '알림', href: '/dashboard/notifications' },
      ]

  const SidebarContent = () => (
    <VStack align="stretch" spacing={4} p={4}>
      <Box>
        <Text fontSize="2xl" fontWeight="bold" color="brand.500">
          B2B Platform
        </Text>
        <Badge colorScheme={userType === 'A' ? 'blue' : 'green'}>
          {userType === 'A' ? '구매자' : '공급자'}
        </Badge>
      </Box>
      <Divider />
      <VStack align="stretch" spacing={2}>
        {menuItems.map((item) => (
          <Button
            key={item.href}
            as={Link}
            href={item.href}
            variant={pathname === item.href ? 'solid' : 'ghost'}
            colorScheme={pathname === item.href ? 'brand' : 'gray'}
            justifyContent="flex-start"
            onClick={onClose}
          >
            {item.label}
          </Button>
        ))}
      </VStack>
    </VStack>
  )

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Flex
        bg="white"
        px={4}
        py={3}
        borderBottomWidth={1}
        borderBottomColor="gray.200"
        align="center"
        justify="space-between"
      >
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<HamburgerIcon />}
        />
        
        <Text fontSize="xl" fontWeight="bold" display={{ base: 'none', md: 'block' }}>
          Healthcare B2B Platform
        </Text>

        <HStack spacing={4}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost">
              <HStack>
                <Avatar size="sm" name={profile?.representative_name} />
                <VStack spacing={0} align="start" display={{ base: 'none', md: 'flex' }}>
                  <Text fontSize="sm" fontWeight="medium">
                    {profile?.company_name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {profile?.representative_name}
                  </Text>
                </VStack>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => router.push('/dashboard/profile')}>
                프로필 설정
              </MenuItem>
              <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <Flex>
        {/* Desktop Sidebar */}
        <Box
          display={{ base: 'none', md: 'block' }}
          w="250px"
          bg="white"
          borderRightWidth={1}
          borderRightColor="gray.200"
          minH="calc(100vh - 64px)"
        >
          <SidebarContent />
        </Box>

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth={1}>
              <HStack justify="space-between">
                <Text>메뉴</Text>
                <IconButton
                  onClick={onClose}
                  variant="ghost"
                  aria-label="close menu"
                  icon={<CloseIcon />}
                />
              </HStack>
            </DrawerHeader>
            <DrawerBody p={0}>
              <SidebarContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main Content */}
        <Box flex={1} p={6}>
          {children}
        </Box>
      </Flex>
    </Box>
  )
}