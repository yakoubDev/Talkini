"use client";
import { useLogout, useUser } from "@/store/authStore";
import { User } from "lucide-react";
import Link from "next/link";

const Nav = () => {
  const user = useUser();
  const links = [
    {
      name: "Home",
      path: "/",
      isVisible: true,
    },
    {
      name: "Friends",
      path: "/friends",
      isVisible: user,
    },
    {
      name: "Signup",
      path: "/signup",
      isVisible: !user,
    },
    {
      name: "Login",
      path: "/login",
      isVisible: !user,
    },
  ];
  const logout = useLogout();

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="mx-auto px-4 md:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="font-bold text-3xl md:text-4xl bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent hover:from-blue-300 hover:to-blue-500 transition-all">
              Talkini
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 md:gap-4">
            {links.map(
              (link, index) =>
                link.isVisible && (
                  <Link
                    key={index}
                    href={link.path}
                    className="px-3 py-2 text-sm md:text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                  >
                    {link.name}
                  </Link>
                )
            )}

            {user && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 text-sm md:text-base font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-lg cursor-pointer transition-all shadow-lg shadow-orange-600/20"
                >
                  Logout
                </button>

                <Link href={"/profile"} className="bg-white/5 hover:bg-white/10 transition-all cursor-pointer p-2 rounded-full">
                  <User className="text-white"/>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
