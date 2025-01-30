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
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdmin");
    if (isAdminLoggedIn === "true") {
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

      if (username === adminUsername && password === adminPassword) {
        localStorage.setItem("isAdmin", "true");
        onAdminLogin(true);
        setIsOpen(false);
        setUsername("");
        setPassword("");
        setIsAdmin(true);
      } else {
        setError("بيانات الاعتماد غير صحيحة");
      }
    } catch (error) {
      setError("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    onAdminLogin(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <FiUser className="w-5 h-5" />
          {isAdmin && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            {isAdmin ? "مرحباً بعودتك!" : "تسجيل دخول المسؤول"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {isAdmin ? (
              <div className="space-y-4">
                <p className="font-medium">أنت مسجل الدخول كمسؤول: {process.env.NEXT_PUBLIC_ADMIN_USERNAME}</p>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full transition-all duration-200 hover:bg-red-700"
                >
                  تسجيل الخروج
                </Button>
              </div>
            ) : (
              "الرجاء إدخال بيانات الاعتماد للوصول إلى لوحة التحكم"
            )}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-center text-sm">
            {error}
          </div>
        )}

        {!isAdmin && (
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                اسم المستخدم
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                  جاري التحميل...
                </div>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DialogLogin;
