import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Progress,
  Icon,
  Flex,
  useColorModeValue,
  Spacer,
  Avatar,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useEffect } from 'react';
import { useStore } from '../stores/useStore';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useRouter } from 'next/router';
import withAuth from '@/components/withAuth';
import { logout } from '@/api/api';
// Animations using framer-motion
const MotionBox = motion(Box as any);
const MotionGridItem = motion(GridItem as any);

const Dashboard: NextPage = () => {
  const tasks = useStore((state) => state.tasks);
  const fetchTasks = useStore((state) => state.fetchTasks);
  // const logout = useStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    fetchTasks(); // Fetch tasks from the backend when the component mounts
  }, [fetchTasks]);

  // Colors for dark mode
  const cardBg = useColorModeValue('purple.700', 'blackAlpha.800');
  const cardShadow = useColorModeValue('2xl', 'dark-lg');
  const statusColor = (completed: boolean) => (completed ? 'purple.400' : 'red.400');
  const headingColor = useColorModeValue('purple.200', 'whiteAlpha.900');
  const textColor = useColorModeValue('purple.100', 'whiteAlpha.800');

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <Box
      bgGradient="linear(to-r, black, purple.900)" // Dark background with purple accents
      minH="100vh"
      py={10}
    >
      {/* Navbar */}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        padding={4}
        bg="blackAlpha.300"
        boxShadow="md"
        borderBottom="1px solid rgba(255,255,255,0.1)"
        mb={10}
      >
        <Flex align="center">
          <Avatar name="Task Manager" src="/logo.png" size="md" mr={4} />
          <Heading as="h1" size="lg" color={headingColor}>Task Manager</Heading>
        </Flex>
        <Spacer />
        <Button
          colorScheme="red"
          variant="outline"
          size="md"
          onClick={handleLogout}
          _hover={{ bg: 'red.500', color: 'white' }}
        >
          Logout
        </Button>
      </Flex>

      <Container maxW="container.xl">
        <Heading
          as="h1"
          size="2xl"
          mb={8}
          textAlign="center"
          color={headingColor}
          fontWeight="bold"
        >
          Your Tasks
        </Heading>

        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={8}>
          {tasks.map((task) => (
            <MotionGridItem
              key={task.id}
              w="100%"
              bg={cardBg}
              p={8}
              borderRadius="lg"
              boxShadow={cardShadow}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              border="2px solid"
              borderColor={task.completed ? 'purple.400' : 'red.400'} // Purple for completed tasks
              bgGradient="linear(to-br, blackAlpha.900, blackAlpha.700)" // Gradient for task card
            >
              <Heading as="h3" size="md" mb={4} fontWeight="bold" color={headingColor}>
                {task.title}
              </Heading>
              <Text fontSize="lg" mb={4} fontStyle="italic" color={textColor}>
                {task.description}
              </Text>

              {/* Task Status with Icon */}
              <Box display="flex" alignItems="center" mb={4}>
                <Icon as={task.completed ? FaCheckCircle : FaTimesCircle} color={statusColor(task.completed)} mr={2} />
                <Text fontWeight="bold" color={statusColor(task.completed)}>
                  {task.completed ? 'Completed' : 'Pending'}
                </Text>
              </Box>

              {/* Progress Bar to show task status */}
              <Progress
                value={task.completed ? 100 : 50} // Example, assume 50% if not completed
                size="sm"
                colorScheme={task.completed ? 'purple' : 'red'}
                mb={4}
                borderRadius="lg"
              />

              <Button
                colorScheme="purple"
                variant="solid"
                mt={4}
                _hover={{ bg: 'purple.500', transform: 'scale(1.05)' }} // Smooth hover effect
                _focus={{ boxShadow: 'outline' }}
                size="md"
              >
                Edit Task
              </Button>
            </MotionGridItem>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default withAuth(Dashboard);
