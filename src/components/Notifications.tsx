// components/Notifications.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const Notifications = ({ currentUserId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
      } else {
        setNotifications(data);
      }

      setIsLoading(false);
    };

    if (currentUserId) fetchNotifications();
  }, [currentUserId]);

  const markAsRead = async (id) => {
    try {
      await supabase.from("notifications").update({ read: true }).eq("id", id);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-2 ${notification.read ? "bg-gray-100" : "bg-blue-100"}`}
            onClick={() => markAsRead(notification.id)}
          >
            <p>{notification.message}</p>
            <small className="text-gray-500">{new Date(notification.created_at).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
