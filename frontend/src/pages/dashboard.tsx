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
  useDisclosure,
  Select,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useStore } from '../stores/useStore';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useRouter } from 'next/router';
import withAuth from '@/components/withAuth';
import { getUserTeams, logout } from '@/api/api';
import CreateTeamModal from '@/components/CreateTeamModal';
import InviteToTeamModal from '@/components/InviteTeamModal';

const MotionBox = motion(Box as any);
const MotionGridItem = motion(GridItem as any);

const Dashboard: NextPage = () => {
  const tasks = useStore((state) => state.tasks);
  const fetchTasks = useStore((state) => state.fetchTasks);
  const user = useStore((state) => state.user);
  const router = useRouter();
  const { isOpen: isCreateTeamOpen, onOpen: onCreateTeamOpen, onClose: onCreateTeamClose } = useDisclosure();
  const { isOpen: isInviteToTeamOpen, onOpen: onInviteToTeamOpen, onClose: onInviteToTeamClose } = useDisclosure();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const userTeams = await getUserTeams(); // Fetch user teams
        setTeams(userTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const goToCreateTaskPage = () => {
    router.push('/create-task');
  };

  const isAdmin = user?.teams?.some((team: { role: string; }) => team.role === 'admin');

  const handleInviteToTeam = async () => {
    setLoading(true);
    try {
        const inviteData = {
            email: email,
            role: 'member', // or whatever role you want to assign
        };
        await inviteToTeam(selectedTeam, inviteData); // Pass the inviteData object
        toast({
            title: 'Member invited successfully!',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        onClose();
    } catch (error) {
        toast({
            title: 'Failed to invite member.',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Box
      bgGradient="linear(to-r, black, purple.900)"
      minH="100vh"
      py={10}
    >
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
          <Heading as="h1" size="lg" color="white">Task Manager</Heading>
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
        <Flex justify="space-between" mb={6}>
          <Heading as="h1" size="2xl" color="white" fontWeight="bold">
            Your Tasks
          </Heading>
          
          <Flex>
            <Button
              colorScheme="purple"
              size="md"
              onClick={goToCreateTaskPage}
              _hover={{ bg: 'purple.500', transform: 'scale(1.05)' }}
              mr={4}
            >
              Create New Task
            </Button>
            <Button
              colorScheme="purple"
              size="md"
              onClick={onCreateTeamOpen}
              _hover={{ bg: 'purple.500', transform: 'scale(1.05)' }}
              mr={4}
            >
              Create Team
            </Button>
            <Button
              colorScheme="purple"
              size="md"
              onClick={onInviteToTeamOpen}
              _hover={{ bg: 'purple.500', transform: 'scale(1.05)' }}
              mr={4}
            >
              Invite to Team
            </Button>
            {isAdmin && (
              <Button
                colorScheme="purple"
                size="md"
                onClick={onInviteToTeamOpen}
                _hover={{ bg: 'purple.500', transform: 'scale(1.05)' }}
              >
                Invite to Team
              </Button>
            )}
          </Flex>
        </Flex>

        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={8}>
          {tasks.map((task) => (
            <MotionGridItem
              key={task.id}
              w="100%"
            
              p={8}
              borderRadius="lg"
        
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              border="2px solid"
              borderColor={task.completed ? 'purple.400' : 'red.400'}
              bgGradient="linear(to-br, blackAlpha.900, blackAlpha.700)"
            >
              <Heading as="h3" size="md" mb={4} fontWeight="bold" color="white">
                {task.title}
              </Heading>
              <Text fontSize="lg" mb={4} fontStyle="italic" color="white">
                {task.description}
              </Text>

              <Box display="flex" alignItems="center" mb={4}>
                <Icon as={task.completed ? FaCheckCircle : FaTimesCircle} color={task.completed ? 'purple' : 'red'} mr={2} />
                <Text fontWeight="bold" color={task.completed ? 'purple' : 'red'}>
                  {task.completed ? 'Completed' : 'Pending'}
                </Text>
              </Box>

              <Progress
                value={task.completed ? 100 : 50}
                size="sm"
                colorScheme={task.completed ? 'purple' : 'red'}
                mb={4}
                borderRadius="lg"
              />

              <Button
                colorScheme="purple"
                variant="solid"
                mt={4}
                _hover={{ bg: 'purple.500', transform: 'scale(1.05)' }}
                _focus={{ boxShadow: 'outline' }}
                size="md"
              >
                Edit Task
              </Button>
            </MotionGridItem>
          ))}
        </Grid>
      </Container>

      <CreateTeamModal isOpen={isCreateTeamOpen} onClose={onCreateTeamClose} />
      <InviteToTeamModal isOpen={isInviteToTeamOpen} onClose={onInviteToTeamClose} selectedTeam={selectedTeam} />
    </Box>
  );
};

export default withAuth(Dashboard);
