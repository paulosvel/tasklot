import React, { useEffect } from "react";
import useUserStore from "../store/userStore";
import { supabase } from "../lib/supabaseClient";

const TeamSelector = () => {
  const { currentUserId, teams, setTeams, setTeamId } = useUserStore();
  const fetchUserTeams = async (userId) => {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("admin_id", userId);
  
    if (error) {
      console.error("Error fetching teams:", error);
      return [];
    }
    return data;
  };
  useEffect(() => {
    const fetchTeams = async () => {
      if (currentUserId) {
        const userTeams = await fetchUserTeams(currentUserId);
        setTeams(userTeams);
      }
    };

    fetchTeams();
  }, [currentUserId, setTeams]);

  return (
    <div>
      <h2>Select a Team</h2>
      <select onChange={(e) => setTeamId(e.target.value)} defaultValue="">
        <option value="" disabled>Select a team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TeamSelector;