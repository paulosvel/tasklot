// components/TeamInviteForm.tsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import useUserStore from "../store/userStore";

const TeamInviteForm = ({ invitedUserId }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { currentUserId, teamId } = useUserStore();

  const handleInvite = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error: inviteError } = await supabase
        .from("notifications")
        .insert([{ team_id: teamId, email, user_id: invitedUserId }]);

      if (inviteError) {
        setError("Error sending invitation");
        console.error("Invite error:", inviteError);
      } else {
        setSuccess("Invitation sent successfully!");
        setEmail("");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("Unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Invite to Team</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="User Email"
        className="w-full mb-4 border rounded p-2"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {isLoading ? "Sending..." : "Send Invitation"}
      </button>
    </form>
  );
};

export default TeamInviteForm;
