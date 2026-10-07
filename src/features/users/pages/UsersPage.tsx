"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncGetUsers } from "../states/action";
import { Mail, Shield, User, Search, Users, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.list);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(asyncGetUsers());
  }, [dispatch]);

  const formatTime = (dateString: string) => {
    try {
      if (!dateString) return "Waktu tidak diketahui";
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: localeId });
    } catch (e) {
      return dateString;
    }
  };

  const filteredUsers = users?.filter((u: any) => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="mx-auto max-w-6xl py-2 sm:py-4">
      <section className="mb-8 flex flex-col justify-between gap-6 rounded-[2rem] border border-indigo-100/80 bg-gradient-to-br from-white via-white to-indigo-50/80 p-6 shadow-[0_12px_36px_-24px_rgba(49,46,129,0.28)] sm:flex-row sm:items-end sm:p-8">
        <div>
          <span className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-lime-800">
            <Sparkles className="h-3.5 w-3.5 text-lime-700" aria-hidden="true" />
            Orang-orang di Delcom
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Temukan komunitasmu.</h1>
          <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">Kenali lebih dekat anggota yang berbagi cerita dan ide di Delcom.</p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input 
            type="text" 
            aria-label="Cari pengguna"
            placeholder="Cari pengguna..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>
      </section>

      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 px-5 py-20 text-center text-slate-500">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-300">
            <Users className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="font-semibold text-slate-700">{searchQuery ? "Belum menemukan pengguna yang cocok." : "Belum ada pengguna yang terdaftar."}</p>
          <p className="mt-1 text-sm">Coba kata kunci lain atau kunjungi lagi nanti.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.map((u: any) => (
            <article key={u.id} className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-[0_8px_28px_-18px_rgba(15,23,42,0.22)] transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/[0.07]">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-indigo-50 via-violet-50 to-white" />
              
              <div className="relative mb-4 mt-3">
                {u.photo ? (
                  <img src={u.photo} alt="" className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white shadow-md" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-bold text-indigo-700 ring-4 ring-white shadow-md">
                    {u.name?.charAt(0) || "U"}
                  </div>
                )}
                {u.email_verified_at && (
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1.5 text-white ring-2 ring-white" title="Terverifikasi">
                    <Shield className="h-3 w-3" aria-hidden="true" />
                  </div>
                )}
              </div>
              
              <h3 className="mb-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-700">{u.name}</h3>
              <p className="mb-5 flex items-center justify-center gap-1.5 text-sm text-slate-500">
                <Mail className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                {u.email}
              </p>
              
              <div className="mt-auto flex w-full items-center justify-between border-t border-slate-100 pt-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" aria-hidden="true" /> ID {u.id}
                </span>
                <span>Bergabung {formatTime(u.created_at || u.createdAt)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}