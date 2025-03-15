"use client";

import { Socials } from "@/constants";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const [showUserModal, setShowUserModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowUserModal(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-[65px] fixed top-0 shadow-lg border-b border-white/10 bg-[#0a0118] backdrop-blur-md z-50 px-4 md:px-10">
      <div className="w-full h-full flex flex-row items-center justify-between m-auto px-[10px]">
        <div className="flex flex-1 items-center">
          <Link href="/" className="h-auto w-auto flex flex-row items-center">
            <Image
              src="/alpha_logo.svg"
              alt="logo"
              width={50}
              height={50}
              className="cursor-pointer hover:animate-slowspin"
            />

            <span className="font-bold ml-[10px] hidden md:block text-gray-300">
              Alpha
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="flex items-center justify-between gap-8 px-6 py-2 rounded-full text-gray-200">
            <Link
              href="/docs"
              className="hover:text-white border-r border-gray-700/80 pr-4 transition-colors"
            >
              Docs
            </Link>
            <Link
              href="https://www.thesendcoin.com/"
              className="hover:text-white border-r border-gray-700/80 pr-4 transition-colors"
            >
              The Send Coin
            </Link>
            <Link
              href="https://github.com/SendArcade/alpha-gui"
              className="hover:text-white transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 focus:outline-none"
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            // Close user modal when toggling mobile menu
            if (showUserModal) setShowUserModal(false);
          }}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute top-[65px] left-0 right-0 bg-[#0a0118] border-b border-white/10 p-4 md:hidden shadow-lg"
          >
            <div className="flex flex-col space-y-4">
              <Link
                href="/docs"
                className="text-gray-200 hover:text-white transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Docs
              </Link>
              <Link
                href="https://www.thesendcoin.com/"
                className="text-gray-200 hover:text-white transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                The Send Coin
              </Link>
              <Link
                href="https://github.com/SendArcade/alpha-gui"
                className="text-gray-200 hover:text-white transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                GitHub
              </Link>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 flex-1 justify-end">
          {session ? (
            <div className="flex items-center gap-4 relative">
              <button
                onClick={() => setShowUserModal(!showUserModal)}
                className="text-white flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#2A0E61] flex items-center justify-center overflow-hidden">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-sm">
                      {session.user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>
              </button>

              {/* User Modal */}
              {showUserModal && (
                <div
                  ref={modalRef}
                  className="absolute right-0 top-12 w-64 bg-[#0a0118] border border-[#7042f861] rounded-lg shadow-lg p-4 z-50"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-[#7042f861]">
                      <div className="w-10 h-10 rounded-full bg-[#2A0E61] flex items-center justify-center overflow-hidden">
                        {session.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-lg">
                            {session.user?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {session.user?.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      className="text-white hover:bg-[#2A0E61]/50 p-2 rounded-md transition-colors flex items-center gap-2"
                      onClick={() => setShowUserModal(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        setShowUserModal(false);
                        signOut();
                      }}
                      className="text-white hover:bg-red-500/20 p-2 rounded-md transition-colors flex items-center gap-2 text-left"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L14 11.586V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
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
