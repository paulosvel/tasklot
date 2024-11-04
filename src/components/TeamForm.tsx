import React, { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import useUserStore from "../store/userStore";

const TeamForm = () => {
  const [name, setName] = useState("");
  const router = useRouter();
  const { currentUserId } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create the team
      const { data: teamData, error: teamError } = await supabase.from("teams").insert([
        {
          name,
          admin_id: currentUserId,
        },
      ]).select();

      if (teamError) {
        console.error("Error creating team:", teamError);
        return;
      }

      // Add the current user as a member of the team
      const teamId = teamData[0].id;
      const { error: memberError } = await supabase.from("team_members").insert([
        {
          team_id: teamId,
          user_id: currentUserId,
          role: "admin", // or any role you want to assign
        },
      ]);

      if (memberError) {
        console.error("Error adding member to team:", memberError);
        return;
      }

      // Redirect or show success message
      router.push("/dashboard"); // Redirect to dashboard or team page
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Team Name"
        required
      />
      <button type="submit">Create Team</button>
    </form>
  );
};

export default TeamForm;
