import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkBase =
    "block px-4 py-3 rounded-md text-sm font-semibold transition-colors";
  const activeClass = "bg-primary text-primary-foreground";
  const inactiveClass =
    "text-foreground/80 hover:bg-secondary hover:text-foreground";

  return (
    <aside className="w-60 shrink-0 border-r bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-4 flex flex-col gap-4">
      <div className="text-xl font-extrabold tracking-tight text-foreground">
        Biochar
      </div>
      <nav className="flex flex-col gap-2">
        <NavLink to="/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}>
          Dashboard
        </NavLink>
        <NavLink to="/crop-data" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}>
          Crop specific data
        </NavLink>
      </nav>
      <div className="mt-auto text-xs text-foreground/60">
        © {new Date().getFullYear()} Biochar Cluster
      </div>
    </aside>
  );
}
