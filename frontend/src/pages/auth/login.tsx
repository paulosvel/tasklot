// pages/auth/login.tsx
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../../api/api';
import { useStore } from '../../stores/useStore';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      localStorage.setItem('token', response.data.access_token); // Store token
      setIsLoggedIn(true); // Set isLoggedIn state
      toast({
        title: 'Logged in successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed!',
        description: 'Invalid credentials.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      bgGradient="linear(to-r, black, purple.900)"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="md" bg="blackAlpha.700" p={8} borderRadius="lg" boxShadow="xl">
        <Heading mb={6} color="white" textAlign="center">
          Login to Tasklot
        </Heading>

        {error && (
          <Alert status="error" mb={6}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        <VStack spacing={4} align="stretch">
          <FormControl id="email" isRequired>
            <FormLabel color="purple.200" fontStyle="italic">Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              bg="blackAlpha.600"
              color="white"
              borderColor="purple.500"
              _placeholder={{ color: 'gray.500' }}
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400' }}
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel color="purple.200" fontStyle="italic">Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              bg="blackAlpha.600"
              color="white"
              borderColor="purple.500"
              _placeholder={{ color: 'gray.500' }}
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400' }}
            />
          </FormControl>

          <Button
            colorScheme="purple"
            size="lg"
            onClick={handleSubmit}
            _hover={{ bg: 'purple.500', transform: 'scale(1.05)' }}
          >
            Login
          </Button>
        </VStack>

        <Text mt={6} color="gray.400" textAlign="center">
          Don't have an account?{' '}
          <Button
            variant="link"
            color="purple.400"
            onClick={() => router.push('/register')}
          >
            Register
          </Button>
        </Text>
      </Container>
    </Box>
  );
};

export default LoginPage;