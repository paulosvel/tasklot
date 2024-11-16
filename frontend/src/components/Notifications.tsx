// components/Notifications.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import useUserStore from "../store/userStore";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUserEmail, currentUserId } = useUserStore();
  console.log(currentUserId);
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*, teams(name)")
        .eq("email", currentUserEmail)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
      } else {
        setNotifications(data);
      }

      setIsLoading(false);
    };
    console.log(currentUserEmail);
    if (currentUserEmail){
      fetchNotifications();
      console.log('correct');
    }
      
      
  }, [currentUserEmail]);

  const handleResponse = async (invitationId, status) => {
    try {
      // Fetch the notification to get the team_id
      const { data: notificationData, error: notificationError } = await supabase
        .from("notifications")
        .select("team_id, user_id")
        .eq("id", invitationId)
        .single();

      if (notificationError) throw notificationError;

      const { team_id, user_id } = notificationData;

      // Update the invitation status
      const { error: updateError } = await supabase
        .from("invitations")
        .update({ status })
        .eq("id", invitationId);

      if (updateError) throw updateError;

      if (status === "accepted") {
        // Add the user to the team using the team_id from the notification
        const { error: memberError } = await supabase
          .from("team_members")
          .insert([{ team_id, user_id: currentUserId, role: 'member' }]);

        if (memberError) throw memberError;

        // Optionally, notify the team admin
        await supabase.from("notifications").insert([
          {
            user_id, // The admin's user ID
            message: `User with ID ${currentUserId} accepted your team invitation.`,
          },
        ]);
      }

      // Refresh notifications after response
      fetchNotifications();
    } catch (error) {
      console.error("Error handling invitation response:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification?.id} className="p-2 bg-gray-100 mb-2">
            <p>
              You have been invited to join the team: {notification?.teams?.name}
            </p>
            <button
              onClick={() => handleResponse(notification.id, "accepted")}
              className="bg-green-500 text-white py-1 px-2 rounded mr-2"
            >
              Accept
            </button>
            <button
              onClick={() => handleResponse(notification.id, "declined")}
              className="bg-red-500 text-white py-1 px-2 rounded"
            >
              Decline
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
