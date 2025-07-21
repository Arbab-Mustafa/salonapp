"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { OnScreenKeyboard } from "./on-screen-keyboard";
import { useCustomers } from "@/context/customer-context";
import { toast } from "sonner";

interface AddCustomerFormProps {
  onSuccess: (customer: { id: string; name: string }) => void;
  onCancel: () => void;
}

export function AddCustomerForm({ onSuccess, onCancel }: AddCustomerFormProps) {
  const { addCustomer } = useCustomers();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [activeField, setActiveField] = useState<
    "firstName" | "lastName" | "mobile" | "email" | null
  >(null);

  // Refs for each input
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Helper to get the current input ref
  const getActiveInputRef = () => {
    switch (activeField) {
      case "firstName":
        return firstNameRef;
      case "lastName":
        return lastNameRef;
      case "mobile":
        return mobileRef;
      case "email":
        return emailRef;
      default:
        return null;
    }
  };

  // Helper to determine if the blue ring should be shown
  const isActive = (field: typeof activeField) => activeField === field;

  // --- NEW: Global flag for keyboard interaction ---
  const setKeyboardActive = () => {
    (window as any)._keyboardActive = true;
  };
  const clearKeyboardActive = () => {
    (window as any)._keyboardActive = false;
  };
  const isKeyboardActive = () => (window as any)._keyboardActive;

  const handleKeyPress = (key: string) => {
    if (!activeField) return;
    setKeyboardActive();

    const updateField = (
      field: string,
      setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
      if (key === "backspace") {
        setter(field.slice(0, -1));
      } else if (key === "space") {
        setter(field + " ");
      } else if (key === "clear") {
        setter("");
      } else {
        setter(field + key);
      }
    };

    switch (activeField) {
      case "firstName":
        updateField(firstName, setFirstName);
        break;
      case "lastName":
        updateField(lastName, setLastName);
        break;
      case "mobile":
        if (
          key === "backspace" ||
          key === "clear" ||
          key === "space" ||
          /^[0-9]$/.test(key)
        ) {
          updateField(mobile, setMobile);
        }
        break;
      case "email":
        updateField(email, setEmail);
        break;
    }
    // DO NOT focus any input here!
    // Only the user tapping an input should change focus.
    setTimeout(clearKeyboardActive, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced validation
    if (!firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!mobile.trim()) {
      toast.error("Mobile number is required");
      return;
    }

    // Validate email format if provided
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Create full name
    const fullName = `${firstName} ${lastName}`.trim();

    // Add customer (now async, returns full object)
    const newCustomer = await addCustomer({
      name: fullName,
      phone: mobile,
      email: email.trim() || undefined, // Only send if not empty
      active: true,
    });

    if (newCustomer && newCustomer.id && newCustomer.name) {
      toast.success(`Customer ${fullName} added successfully`);
      onSuccess(newCustomer);
    } else {
      toast.error("Failed to add customer");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md h-[65vh] max-h-[65vh] flex flex-col justify-between p-2">
      <form className="flex-1 flex flex-col justify-center gap-2">
        <input
          ref={firstNameRef}
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          onFocus={() => setActiveField("firstName")}
          onBlur={e => {
            // Only clear if not clicking on keyboard
            if (!e.relatedTarget || !e.relatedTarget.classList.contains("keyboard-button")) {
              setActiveField(null);
            }
          }}
          className={`h-8 text-sm px-2 rounded border border-pink-200 mb-2 ${isActive("firstName") ? "ring-2 ring-blue-500" : ""}`}
          placeholder="Full Name"
        />
        <input
          ref={lastNameRef}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          onFocus={() => {
            setActiveField("lastName");
          }}
          onBlur={(e) => {
            if (isKeyboardActive()) {
              e.preventDefault();
              e.target.focus();
              return;
            }
            if (!e.relatedTarget || !e.relatedTarget.classList.contains("keyboard-button")) {
              setActiveField(null);
            }
          }}
          className={`h-8 text-sm px-2 rounded border border-pink-200 mb-2 ${isActive("lastName") ? "ring-2 ring-blue-500" : ""}`}
          placeholder="Last Name"
        />
        <input
          ref={mobileRef}
          value={mobile}
          onChange={e => setMobile(e.target.value)}
          onFocus={() => setActiveField("mobile")}
          onBlur={e => {
            if (!e.relatedTarget || !e.relatedTarget.classList.contains("keyboard-button")) {
              setActiveField(null);
            }
          }}
          className={`h-8 text-sm px-2 rounded border border-pink-200 mb-2 ${isActive("mobile") ? "ring-2 ring-blue-500" : ""}`}
          placeholder="Mobile Number"
        />
        <input
          ref={emailRef}
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={() => setActiveField("email")}
          onBlur={e => {
            if (!e.relatedTarget || !e.relatedTarget.classList.contains("keyboard-button")) {
              setActiveField(null);
            }
          }}
          className={`h-8 text-sm px-2 rounded border border-pink-200 mb-2 ${isActive("email") ? "ring-2 ring-blue-500" : ""}`}
          placeholder="Email"
        />
      </form>
      <div className="h-[30vh] max-h-[30vh] flex flex-col justify-end">
        <OnScreenKeyboard onKeyPress={handleKeyPress} />
      </div>
    </div>
  );
}
