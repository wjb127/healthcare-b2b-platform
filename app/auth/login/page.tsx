import LoginForm from '@/components/auth/LoginForm'
import { Container } from '@chakra-ui/react'

export default function LoginPage() {
  return (
    <Container maxW="container.xl" py={10}>
      <LoginForm />
    </Container>
  )
}