import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import { inviteToTeam, getUserTeams } from '@/api/api'; // Ensure this API function is defined

const InviteToTeamModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]); // State to hold teams
  const [selectedTeam, setSelectedTeam] = useState(''); // State to hold selected team
  const toast = useToast();

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

  const handleInviteToTeam = async () => {
    setLoading(true);
    try {
      const inviteData = {
        email: email,
        role: 'member', // or whatever role you want to assign
      };
      await inviteToTeam(selectedTeam, inviteData); // Pass the selected team and inviteData object
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Invite Member to Team</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="team" isRequired>
            <FormLabel>Select Team</FormLabel>
            <Select
              placeholder="Select team"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="email" isRequired mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter member's email"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="purple" onClick={handleInviteToTeam} isLoading={loading}>
            Invite Member
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InviteToTeamModal;