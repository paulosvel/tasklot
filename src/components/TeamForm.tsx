import React, { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import createTeamWithAdmin from "../lib/createTeam";

const TeamForm = ({ currentUserId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { teamId, error } = await createTeamWithAdmin(name, currentUserId);

    if (error) {
      console.error("Team creation error:", error);
      return;
    }

    // Redirect or show success message
    console.log("Team created with ID:", teamId);
    router.push("/dashboard"); // Redirect to dashboard or team page
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
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Team Description"
      />
      <button type="submit">Create Team</button>
    </form>
  );
};

export default TeamForm;
