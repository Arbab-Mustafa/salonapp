"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await signIn("credentials", {
      username,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    setIsLoading(false);
  };

  return (
    <Card className="w-full shadow-lg border-pink-200">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <div className="w-64 h-32 relative mb-4">
          <Image
            src="/gemneyes-logo.png"
            alt="GemnEyes Hair and Beauty"
            fill
            priority
            className="object-contain"
          />
        </div>
        <CardTitle className="text-2xl text-center text-pink-700">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access the EPOS system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground text-center">
          GemnEyes Hair and Beauty EPOS System
        </p>
      </CardFooter>
    </Card>
  );
}
