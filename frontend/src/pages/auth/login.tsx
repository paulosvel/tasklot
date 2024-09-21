// pages/auth/login.tsx
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
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
    <Center minH="100vh" bg="gray.50">
      <Box
        maxW="md"
        w="full"
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="md"
      >
        <Text fontSize="2xl" mb={4} textAlign="center" fontWeight="bold">
          Login to Your Account
        </Text>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              w="full"
              mt={4}
            >
              Sign In
            </Button>
          </Stack>
        </form>
        <Text mt={4} textAlign="center">
          Don’t have an account?{' '}
          <Button
            variant="link"
            colorScheme="teal"
            onClick={() => router.push('/auth/register')}
          >
            Register
          </Button>
        </Text>
      </Box>
    </Center>
  );
};

export default LoginPage;
