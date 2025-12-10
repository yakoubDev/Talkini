"use client";
import { useLogout, useUser } from "@/store/authStore";
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
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <Link href={"/"}>
        <h1 className="font-bold text-4xl">Talkini</h1>
      </Link>
      <div className="flex items-center gap-6 px-2">
        {links.map(
          (link, index) =>
            link.isVisible && (
              <Link
                className="font-semibold hover:text-orange-500"
                key={index}
                href={link.path}
              >
                {link.name}
              </Link>
            )
        )}
        {user && (
          <button
            className="bg-red-500 hover:bg-red-500/75 p-1 rounded cursor-pointer"
            onClick={() => logout()}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
