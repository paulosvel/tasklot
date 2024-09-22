import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Textarea,
  VStack,
  Alert,
  AlertIcon,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { createTask } from '@/api/api';
import axios from 'axios';

const CreateTaskPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [users, setUsers] = useState([]); // To hold user options for assignee
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false); // To track if form is valid
  const toast = useToast();
  const router = useRouter();

  // Fetching users for assigning tasks (simulating)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users'); // Simulate user data
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users for assignment', error);
      }
    };
    fetchUsers();
  }, []);

  // Validate form fields to check if all required fields are filled
  useEffect(() => {
    if (title && priority && dueDate && assignee) {
      setIsFormValid(true); // Form is valid if all fields are filled
    } else {
      setIsFormValid(false); // Form is invalid if any field is empty
    }
  }, [title, priority, dueDate, assignee]);

  const handleCreateTask = async () => {
    setError('');
    setLoading(true);

    try {
      // Send task creation request to the backend
      await createTask( title, description, priority, dueDate, assignee );

      toast({
        title: 'Task created successfully!',
        description: 'Your task has been added to the dashboard.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/dashboard'); // Redirect to dashboard
    } catch (error) {
      setError('Failed to create task. Please try again.');
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
          Create New Task
        </Heading>

        {error && (
          <Alert status="error" mb={6}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        <VStack spacing={4} align="stretch">
          <FormControl id="title" isRequired>
            <FormLabel color="purple.200" fontStyle="italic">Task Title</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              bg="blackAlpha.600"
              color="white"
              borderColor="purple.500"
              _placeholder={{ color: 'gray.500' }}
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400' }}
            />
          </FormControl>

          <FormControl id="description" isRequired>
            <FormLabel color="purple.200" fontStyle="italic">Task Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              bg="blackAlpha.600"
              color="white"
              borderColor="purple.500"
              _placeholder={{ color: 'gray.500' }}
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400' }}
            />
          </FormControl>

          <FormControl id="priority" isRequired>
            <FormLabel color="purple.200" fontStyle="italic">Priority</FormLabel>
            <Select
              placeholder="Select priority"
              bg="blackAlpha.600"
              color="white"
              borderColor="purple.500"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400', bg: 'blackAlpha.700' }}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              iconColor="white"
              sx={{
                'option[value=""]': {
                  color: 'black', 
                },
              }}
            >
              <option style={{color: 'black'}} value="Low">Low</option>
              <option style={{color: 'black'}} value="Medium">Medium</option>
              <option style={{color: 'black'}} value="High">High</option>
            </Select>
          </FormControl>

          <FormControl id="due-date" isRequired>
            <FormLabel color="purple.200" fontStyle="italic">Due Date</FormLabel>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              bg="blackAlpha.600"
              color="white"
              borderColor="purple.500"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400', bg: 'blackAlpha.700' }}
              css={{
                '::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)', // Ensure calendar icon visibility in dark mode
                },
              }}
            />
          </FormControl>

          <FormControl id="assignee" isRequired>
            <FormLabel color="purple.200" fontStyle="italic">Assign To</FormLabel>
            <Select
              placeholder="Select assignee"
              bg="blackAlpha.600"
              color="white"
              borderColor="purple.500"
              _hover={{ borderColor: 'purple.400' }}
              _focus={{ borderColor: 'purple.400', bg: 'blackAlpha.700' }}
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              iconColor="white" // Dropdown arrow color
            >
              {users.map(user => (
                <option key={user?.id} value={user?.id}>
                  {user?.name}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* Disable the button if the form is not valid */}
          <Button
            colorScheme="purple"
            size="lg"
            onClick={handleCreateTask}
            isLoading={loading}
            isDisabled={!isFormValid} // Disable button if form is invalid
            _hover={{ bg: 'purple.500', transform: 'scale(1.05)' }}
          >
            Create Task
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default CreateTaskPage;
