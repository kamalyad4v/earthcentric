"use client";

import React from "react";
import Link from "next/link";
import { OTPVerification } from "@/components/ui/otp-verify";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-accent/5 to-transparent">
      <div className="mb-6 w-full max-w-sm flex justify-start">
        <Link 
          href="/auth/login" 
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Login</span>
        </Link>
      </div>
      <OTPVerification />
    </div>
  );
}
