"use client";
import { useAppSelector } from "@/hooks/redux";
import { Bell, Menu, MessageSquare } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NextImage from "next/image";

export default function NavbarComponent({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const profile = useAppSelector((state) => state.users.profile);
  const [showNotif, setShowNotif] = useState(false);
  const pathname = usePathname();
  const pageTitle =
    pathname === "/"
      ? "Beranda"
      : pathname.startsWith("/users")
        ? "Komunitas"
        : pathname.startsWith("/profile")
          ? "Profil saya"
          : "Cerita komunitas";

  return (
    <header className="sticky top-0 z-10 flex h-[4.5rem] items-center justify-between border-b border-slate-200/70 bg-[#f7f7f2]/90 px-4 backdrop-blur-xl sm:px-7">
      <div className="flex min-w-0 items-center gap-3 sm:gap-5">
        <button
          type="button"
          aria-label="Buka menu"
          onClick={onMenuClick}
          className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:hidden"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold capitalize text-slate-900 sm:text-base">{pageTitle}</p>
          <p className="hidden text-xs text-slate-400 sm:block">Delcom Posts</p>
        </div>
      </div>
      <div className="relative flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <button 
            aria-label={showNotif ? "Tutup notifikasi" : "Buka notifikasi"}
            onClick={() => setShowNotif(!showNotif)}
            className="relative rounded-full p-2.5 text-slate-400 transition-colors hover:bg-white hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
          </button>
          
          {showNotif && (
            <div className="absolute right-0 z-50 mt-3 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="border-b border-slate-100 bg-slate-50/70 p-4">
                <h3 className="font-bold text-slate-800">Notifikasi</h3>
              </div>
              <div className="flex flex-col items-center justify-center px-5 py-8 text-center">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400">
                  <MessageSquare className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-sm text-slate-500">Belum ada notifikasi baru untuk saat ini.</p>
              </div>
            </div>
          )}
        </div>
        <span className="h-8 w-px bg-slate-200" aria-hidden="true" />
        <Link
          href="/profile"
          aria-label="Buka profil"
          className="group flex items-center gap-3 rounded-xl p-1 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <div className="hidden text-right sm:block">
            <p className="max-w-40 truncate text-sm font-semibold leading-tight text-slate-700 transition-colors group-hover:text-indigo-700">{profile?.name || "Memuat profil..."}</p>
            <p className="max-w-40 truncate text-xs text-slate-400">{profile?.email || ""}</p>
          </div>
          {profile?.photo ? (
            <NextImage src={profile.photo} alt="" width={40} height={40} unoptimized className="h-10 w-10 rounded-xl object-cover ring-2 ring-white shadow-sm" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-200 text-sm font-bold text-slate-900 ring-2 ring-white shadow-sm">
              {profile?.name?.charAt(0) || "U"}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}