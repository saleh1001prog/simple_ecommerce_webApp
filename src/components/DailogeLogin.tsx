"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiUser } from 'react-icons/fi';
import { Button } from "./ui/button";

function DialogLogin({ onAdminLogin }: { onAdminLogin: (loggedIn: boolean) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Dialog state
  const [isAdmin, setIsAdmin] = useState(false); // State for admin login

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdmin");
    if (isAdminLoggedIn === "true") {
      setIsAdmin(true); // User is logged in as admin
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
      console.log("Login successful");
      localStorage.setItem("isAdmin", "true"); // Set user as admin in localStorage
      onAdminLogin(true); // Notify parent that login was successful
      setIsOpen(false); // Close the dialog
      setUsername(""); // Reset username
      setPassword(""); // Reset password
      setError(""); // Reset error
      setIsAdmin(true); // Set admin login state to true
    } else {
      setError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin"); // Remove admin state from localStorage
    setIsAdmin(false); // Set admin login state to false
    onAdminLogin(false); // Notify parent that logout was successful
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        <FiUser />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isAdmin ? "Welcome Back!" : "Login for Admin"}</DialogTitle>
          <DialogDescription>
          {isAdmin ? (
    // Remove <div> and use a <p> or custom style here if needed.
    <>
      <>You are logged in as admin: {process.env.NEXT_PUBLIC_ADMIN_USERNAME}</>
      <button
        onClick={handleLogout}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </>
  ) : (
    <>Please enter your credentials to access the admin dashboard.</>
  )}
          </DialogDescription>
        </DialogHeader>

        {error && <div className="text-red-500">{error}</div>}

        {!isAdmin && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-2">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
            >
              Login
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DialogLogin;
