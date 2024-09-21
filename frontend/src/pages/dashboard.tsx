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
  useColorModeValue,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useEffect } from 'react';
import { useStore } from '../stores/useStore';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import withAuth from '@/components/withAuth';

// Animations using framer-motion
const MotionBox = motion(Box);
const MotionGridItem = motion(GridItem);

const Dashboard: NextPage = () => {
  const tasks = useStore((state) => state.tasks);
  const fetchTasks = useStore((state) => state.fetchTasks);

  useEffect(() => {
    fetchTasks(); // Fetch tasks from the backend when the component mounts
  }, [fetchTasks]);

  // Dynamic colors for light/dark mode
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('lg', 'xl');
  const statusColor = (completed: boolean) => (completed ? 'green.400' : 'red.400');

  return (
    <Box
      bgGradient="linear(to-r, teal.300, blue.500)" // Background gradient
      minH="100vh"
      py={10}
    >
      <Container maxW="container.xl" py={8}>
        <Heading
          as="h1"
          size="2xl"
          mb={8}
          textAlign="center"
          color="white" // Modern white heading
        >
          Task Dashboard
        </Heading>

        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
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
              borderColor={task.completed ? 'green.400' : 'red.400'} // Border based on task status
            >
              <Heading as="h3" size="md" mb={4}>
                {task.title}
              </Heading>
              <Text fontSize="lg" mb={4}>
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
                colorScheme={task.completed ? 'green' : 'red'}
                mb={4}
              />

              <Button
                colorScheme="teal"
                variant="solid"
                mt={4}
                _hover={{ bg: 'teal.400', transform: 'scale(1.05)' }} // Smooth hover effect
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
