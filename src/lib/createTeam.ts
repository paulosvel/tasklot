import { supabase } from "../lib/supabaseClient";

const createTeamWithAdmin = async (teamName,  currentUserId) => {
  // Step 1: Create the team
  const { data: teamData, error: teamError } = await supabase
    .from("teams")
    .insert([{ name: teamName }])
    .select();

  if (teamError) {
    console.error("Error creating team:", teamError);
    return { error: teamError.message };
  }

  // Get the created team's ID
  const teamId = teamData[0].id;

  // Step 2: Add creator to `team_members` table with admin role
  const { error: memberError } = await supabase
    .from("team_members")
    .insert([{ team_id: teamId, user_id: currentUserId, role: "admin" }]);

  if (memberError) {
    console.error("Error adding creator as admin:", memberError);
    return { error: memberError.message };
  }

  return { teamId };
};

export default createTeamWithAdmin;
