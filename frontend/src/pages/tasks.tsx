// pages/tasks.tsx
import {
  Box,
  Button,
  Container,
  Heading,
  List,
  ListItem,
  Stack,
  Text,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useState } from 'react';

const TasksPage: NextPage = () => {
  const [tasks, setTasks] = useState<string[]>(['Task 1', 'Task 2', 'Task 3']);

  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" size="lg" mb={6}>
        Tasks
      </Heading>
      <Stack spacing={4}>
        <List spacing={3}>
          {tasks.map((task, index) => (
            <ListItem key={index} p={4} borderRadius="md" bg="gray.100">
              <Text fontSize="lg">{task}</Text>
            </ListItem>
          ))}
        </List>
        <Button colorScheme="teal" size="md">
          Add New Task
        </Button>
      </Stack>
    </Container>
  );
};

export default TasksPage;
