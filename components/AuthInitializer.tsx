"use client";

import { useFetchUser, useUser } from "@/store/authStore";
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function AuthInitializer() {
  const fetchUser = useFetchUser();
  const user = useUser();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);


  useEffect(() => {
    if (user?._id) {
      socket.emit("registerUser", user._id);
      console.log("📡 Socket registered:", user._id);
    }
  }, [user]);

  return null;
}
