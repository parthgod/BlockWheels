"use client";

import { useWeb3 } from "@/utils/web3";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const Navbar = () => {
  const { contract, account, connectWallet } = useWeb3();

  useEffect(() => {
    if (!contract) connectWallet();
  }, [contract]);

  const navItems = [
    {
      name: "Home",
      icon: "home",
      link: "/",
    },
    {
      name: "Discover",
      icon: "home",
      link: "/cars",
    },
    {
      name: "Sell car",
      icon: "car",
      link: "/register",
    },
    {
      name: "Profile",
      icon: "user",
      link: "/profile",
    },
  ];

  const pathname = usePathname();

  return (
    <div className="flex justify-between p-5 items-center h-full bg-blue-500">
      <Link
        href="/"
        className="font-bold text-3xl"
      >
        BlockWheels
      </Link>
      <div>
        {account ? (
          <ul className="flex gap-5">
            {navItems.map((item) => {
              const active = item.link === pathname ? "bg-white" : "";
              return (
                <li
                  key={item.name}
                  className={`p-2 rounded-md ${!active && "hover:bg-blue-200"} transition-all duration-300 ${active}`}
                >
                  <Link href={item.link}>
                    <span>{item.name}</span>
                    {/* <span>{item.icon}</span> */}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Navbar;
