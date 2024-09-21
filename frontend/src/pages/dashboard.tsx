import { Box, Container, Grid, GridItem, Heading, Text, Button } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useEffect } from 'react';
import { useStore } from '../stores/useStore';
import withAuth from '@/components/withAuth';

const Dashboard: NextPage = () => {
  const tasks = useStore((state) => state.tasks);
  const fetchTasks = useStore((state) => state.fetchTasks);

  useEffect(() => {
    fetchTasks(); // Fetch tasks from the backend when the component mounts
  }, [fetchTasks]);

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="lg" mb={6}>
        Dashboard
      </Heading>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {tasks.map((task) => (
          <GridItem key={task.id} w="100%" bg="white" p={6} borderRadius="md" boxShadow="md">
            <Heading as="h3" size="md" mb={4}>
              {task.title}
            </Heading>
            <Text>{task.description}</Text>
            <Text>Status: {task.completed ? 'Completed' : 'Pending'}</Text>
            <Button colorScheme="teal" mt={4}>Edit Task</Button>
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
};

export default withAuth(Dashboard);
