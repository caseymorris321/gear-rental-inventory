"use client";

import { useState } from "react";
import { UserButton } from "@stackframe/stack";
import { BarChart3, Package, Plus, Settings, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Sidebar({
  currentPath = "/dashboard",
}: {
  currentPath: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Add Product", href: "/add-product", icon: Plus },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg md:hidden"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 bg-gray-900 text-white w-64 min-h-screen p-6 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white md:hidden"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-7 h-7" />
            <span className="text-lg font-semibold">Gear Rental</span>
          </div>
        </div>

        <nav className="space-y-1">
          <div className="text-sm font-semibold text-gray-400 uppercase">
            Inventory
          </div>
          {navigation.map((item: (typeof navigation)[number], key: number) => {
            const IconComponent = item.icon;
            const isActive = currentPath === item.href;
            return (
              <Link
                href={item.href}
                key={key}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 py-2 px-3 rounded-lg  ${
                  isActive
                    ? "bg-purple-100 text-gray-800"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-md">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <UserButton showUserInfo />
          </div>
        </div>
      </div>
    </>
  );
}
