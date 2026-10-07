"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserCircle } from "lucide-react";
import clsx from "clsx";

export default function SidebarComponent({
  isOpen = false,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const menu = [
    { name: "Beranda", href: "/", icon: LayoutDashboard },
    { name: "Komunitas", href: "/users", icon: Users },
    { name: "Profil saya", href: "/profile", icon: UserCircle },
  ];

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r border-slate-200/80 bg-[#f2f3ed] text-slate-600 shadow-2xl transition-transform duration-300 md:relative md:z-20 md:translate-x-0 md:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
      aria-label="Navigasi utama"
    >
      <div className="flex items-center gap-3 border-b border-slate-200/80 px-5 py-5">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#15172c] shadow-md shadow-slate-900/10">
          <span className="text-lg font-black text-white">D</span>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#f2f3ed] bg-lime-400" />
        </div>
        <div>
          <p className="text-sm font-extrabold tracking-tight text-slate-900">Delcom Posts</p>
          <p className="mt-0.5 text-[10px] font-medium tracking-wide text-slate-500">Ruang berbagi cerita</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-7">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">
          Navigasi
        </p>
        {menu.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={clsx(
                "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-medium transition-all duration-200",
                isActive
                  ? "bg-white font-semibold text-slate-950 shadow-sm ring-1 ring-slate-200/70"
                  : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
              )}
            >
              <Icon
                className={clsx(
                  "h-[18px] w-[18px] transition-colors",
                  isActive ? "text-indigo-700" : "text-slate-400 group-hover:text-indigo-700"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <div className="rounded-2xl border border-slate-200 bg-white/75 p-4">
          <div className="mb-2.5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-lime-500" />
            <p className="text-xs font-semibold text-slate-800">Ruang komunitas</p>
          </div>
          <p className="text-[10px] leading-4 text-slate-500">Tempat berbagi ide dan cerita.</p>
        </div>
      </div>
    </aside>
  );
}