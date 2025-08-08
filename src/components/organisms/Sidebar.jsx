import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "New Capture", href: "/new-capture", icon: "Plus" },
    { name: "Runs", href: "/runs", icon: "Play" },
    { name: "Leads", href: "/leads", icon: "Users" },
    { name: "Exports", href: "/exports", icon: "Download" },
    { name: "Integrations", href: "/integrations", icon: "Puzzle" },
    { name: "Settings", href: "/settings", icon: "Settings" },
    { name: "Help", href: "/help", icon: "HelpCircle" },
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white font-bold text-sm">
              S
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Siftin</span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors",
                          isActive
                            ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400"
                            : "text-gray-700 hover:text-primary-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-800"
                        )
                      }
                    >
                      <ApperIcon name={item.icon} className="h-5 w-5 shrink-0" />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div 
          className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Sidebar Panel */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out",
          isOpen ? "transform-none" : "-translate-x-full"
        )}>
          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white font-bold text-sm">
                  S
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Siftin</span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <ApperIcon name="X" className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <NavLink
                          to={item.href}
                          onClick={onClose}
                          className={({ isActive }) =>
                            cn(
                              "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors",
                              isActive
                                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400"
                                : "text-gray-700 hover:text-primary-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-800"
                            )
                          }
                        >
                          <ApperIcon name={item.icon} className="h-5 w-5 shrink-0" />
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;