"use client";

import { Button } from '@/components/ui/button';
import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Header() {
  const { user, isSignedIn } = useUser();

  return (
    <header className="pe-15 flex justify-between items-center relative z-20">
      {/* Logo */}
      <div className="p-2">
        <Image
          src="/PennyTrail.png"
          alt="logo"
          width={200}
          height={100}
        />
      </div>

      {/* Auth or Get Started */}
      {isSignedIn ? (
        <div className="z-20">
          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <Link href="/sign-in">
          <Button className="bg-[#9333ea] text-white hover:bg-[#7e22ce]">
            Get Started
          </Button>
        </Link>
      )}
    </header>
  );
}

export default Header;

