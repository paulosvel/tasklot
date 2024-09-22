import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  VStack,
  Text,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import axios from 'axios';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    // Form validation
    if (email && password && confirmPassword && password === confirmPassword) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [email, password, confirmPassword]);

  const handleRegister = async () => {
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      // Send registration request
      const response = await axios.post('http://localhost:8080/auth/register', {
        email,
        password,
      });

      if (response.status === 200) {
        toast({
          title: 'Registration successful!',
          description: 'You can now login with your credentials.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/auth/login');
      }
    } catch (error) {
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false);
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
          Create an Account
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

          <FormControl id="confirmPassword" isRequired>
            <FormLabel color="purple.200" fontStyle="italic">Confirm Password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
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
            onClick={handleRegister}
            isLoading={loading}
            isDisabled={!isFormValid}
            _hover={{ bg: 'purple.500', transform: 'scale(1.05)' }}
          >
            Register
          </Button>
        </VStack>

        <Text mt={6} color="gray.400" textAlign="center">
          Already have an account?{' '}
          <Button
            variant="link"
            color="purple.400"
            onClick={() => router.push('/login')}
          >
            Login here
          </Button>
        </Text>
      </Container>
    </Box>
  );
};

export default RegisterPage;
