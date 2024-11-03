// lib/auth.ts

import { supabase } from './supabaseClient';

export const respondToInvitation = async (invitationId, status, userId) => {
  try {
    // Update the invitation status
    const { data, error } = await supabase
      .from("invitations")
      .update({ status })
      .eq("id", invitationId);

    if (error) throw error;

    if (status === "accepted") {
      // If accepted, add the user to the team
      const { error: memberError } = await supabase
        .from("team_members")
        .insert([{ team_id: data[0].team_id, user_id: userId }]);

      if (memberError) throw memberError;

      // Send notification to team admin
      await supabase.from("notifications").insert([
        {
          user_id: data[0].user_id, // The admin's user ID
          message: `User with ID ${userId} accepted your team invitation.`,
        },
      ]);
    }

    return { success: true };
  } catch (error) {
    console.error("Error handling invitation response:", error);
    return { success: false, error };
  }
};
