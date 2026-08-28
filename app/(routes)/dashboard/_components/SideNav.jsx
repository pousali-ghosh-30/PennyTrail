"use client";

import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const colorClasses = {
  blue: {
    text: "text-blue-700",
    icon: "text-blue-600",
    iconBg: "bg-blue-100",
    activeText: "text-blue-100",
    activeBg: "bg-blue-600",
    activeIcon: "text-blue-100",
    activeIconBg: "bg-blue-700",
    hoverBg: "hover:bg-blue-500",
    borderColor: "border-blue-600",
  },
  emerald: {
    text: "text-emerald-700",
    icon: "text-emerald-600",
    iconBg: "bg-emerald-100",
    activeText: "text-emerald-100",
    activeBg: "bg-emerald-600",
    activeIcon: "text-emerald-100",
    activeIconBg: "bg-emerald-700",
    hoverBg: "hover:bg-emerald-500",
    borderColor: "border-emerald-600",
  },
  rose: {
    text: "text-rose-700",
    icon: "text-rose-600",
    iconBg: "bg-rose-100",
    activeText: "text-rose-100",
    activeBg: "bg-rose-600",
    activeIcon: "text-rose-100",
    activeIconBg: "bg-rose-700",
    hoverBg: "hover:bg-rose-500",
    borderColor: "border-rose-600",
  },
  orange: {
    text: "text-orange-700",
    icon: "text-orange-600",
    iconBg: "bg-orange-100",
    activeText: "text-orange-100",
    activeBg: "bg-orange-600",
    activeIcon: "text-orange-100",
    activeIconBg: "bg-orange-700",
    hoverBg: "hover:bg-orange-500",
    borderColor: "border-orange-600",
  },
  purple: {
    text: "text-purple-700",
    icon: "text-purple-600",
    iconBg: "bg-purple-100",
    activeText: "text-purple-100",
    activeBg: "bg-purple-600",
    activeIcon: "text-purple-100",
    activeIconBg: "bg-purple-700",
    hoverBg: "hover:bg-purple-500",
    borderColor: "border-purple-600",
  },
};

function SideNav() {
  const path = usePathname();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const ref = document.referrer;
    if (
      ref.includes("/sign-in") ||
      ref.includes("/sign-up")
    ) {
      setAnimate(true);
    }
  }, []);

  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
      color: "blue",
    },
    {
      id: 2,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
      color: "emerald",
    },
    {
      id: 3,
      name: "Expenses",
      icon: ReceiptText,
      path: "/dashboard/expenses",
      color: "rose",
    },
    {
      id: 5,
      name: "Statistics",
      icon: BarChart3,
      path: "/dashboard/statistics",
      color: "purple",
    },
    {
      id: 4,
      name: "Upgrade",
      icon: ShieldCheck,
      path: "/dashboard/upgrade",
      color: "orange",
    },
  ];

  return (
    <motion.div
      initial={animate ? { x: -100, opacity: 0 } : false}
      animate={{ x: 0, opacity: 1, width: 260 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-screen p-4 border shadow-sm bg-white flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <Image src="/PennyTrail.png" alt="Logo" width={200} height={100} />
      </div>

      <div className="flex-1">
        {menuList.map((menu) => {
          const isActive =
            menu.path === "/dashboard"
              ? path === "/dashboard"
              : path.startsWith(menu.path);

          const color = colorClasses[menu.color];
          const textColor = isActive ? color.activeText : color.text;
          const bgColor = isActive ? color.activeBg : "bg-transparent";
          const iconColor = isActive ? color.activeIcon : color.icon;
          const iconBg = isActive ? color.activeIconBg : color.iconBg;
          const hoverBg = color.hoverBg;
          const borderColor = color.borderColor;

          return (
            <Link href={menu.path} key={menu.id} className="block">
              <motion.h2
                layout
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`flex items-center text-base font-semibold p-3 rounded-lg mb-2 transition-all duration-200 
                  ${textColor} ${bgColor} ${hoverBg} relative`}
              >
                <span
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-tr-lg rounded-br-lg ${
                    isActive ? borderColor : "opacity-0"
                  } transition-all duration-300`}
                />
                <span
                  className={`w-9 h-9 flex items-center justify-center rounded-full ${iconBg} ${iconColor} shrink-0`}
                >
                  <menu.icon className="w-5 h-5" />
                </span>
                <span className="ml-3">{menu.name}</span>
              </motion.h2>
            </Link>
          );
        })}
      </div>

      <div className="p-3 mt-auto flex items-center gap-2 text-sm text-gray-600">
        <UserButton />
        <span>Profile</span>
      </div>
    </motion.div>
  );
}

export default SideNav;