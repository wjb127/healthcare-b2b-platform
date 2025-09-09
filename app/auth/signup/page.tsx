import SignUpForm from '@/components/auth/SignUpForm'
import { Container } from '@chakra-ui/react'

export default function SignUpPage() {
  return (
    <Container maxW="container.xl" py={10}>
      <SignUpForm />
    </Container>
  )
}