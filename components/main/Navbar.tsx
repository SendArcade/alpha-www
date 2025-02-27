"use client";

import { Socials } from "@/constants";
import Image from "next/image";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 px-10">
      <div className="w-full h-full flex flex-row items-center justify-between m-auto px-[10px]">
        <Link href="/" className="h-auto w-auto flex flex-row items-center">
          <Image
            src="/send_arcade_logo.svg"
            alt="logo"
            width={50}
            height={50}
            className="cursor-pointer hover:animate-slowspin"
          />

          <span className="font-bold ml-[10px] hidden md:block text-gray-300">
            Send Arcade Alpha
          </span>
        </Link>

        <div className="w-[500px] h-full flex flex-row items-center justify-between md:mr-20">
          <div className="flex items-center justify-between w-full h-auto border border-[#7042f861] bg-[#0300145e] mr-[15px] px-[20px] py-[10px] rounded-full text-gray-200">
            <a
              href="https://github.com/SendArcade/alpha-gui"
              className="cursor-pointer"
            >
              Docs
            </a>
            <a href="https://www.thesendcoin.com/" className="cursor-pointer">
              The Send Coin
            </a>
            <a
              href="https://github.com/SendArcade/alpha-gui"
              className="cursor-pointer"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="flex flex-row gap-5 z-50">
          {Socials.map((social) => (
            <a
              href={`${social.link}`}
              key={social.name}
              className="cursor-pointer"
            >
              <Image
                src={social.src}
                alt={social.name}
                width={24}
                height={24}
              />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-[#2A0E61] hover:bg-[#2A0E61]/80 text-white transition-colors duration-200"
              >
                Dashboard
              </Link>
              <span className="text-white">{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
