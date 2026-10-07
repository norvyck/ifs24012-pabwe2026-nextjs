"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/helpers/apiHelper";
import { ArrowUpRight, BookOpen, Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.replace("/");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <section className="relative hidden overflow-hidden bg-[#101326] text-white lg:flex lg:min-h-screen lg:w-[48%] lg:flex-col lg:justify-between lg:px-14 lg:py-12 xl:px-20">
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-indigo-500/30 blur-[100px]" />
        <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-lime-400/15 blur-[110px]" />
        <div className="absolute -right-36 top-[29%] h-[28rem] w-[28rem] rounded-full border border-white/[0.08]" />
        <div className="absolute -right-20 top-[35%] h-80 w-80 rounded-full border border-lime-300/15" />
        <div className="absolute right-2 top-[42%] h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/20 to-lime-300/10 blur-2xl" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-300 text-lg font-black text-slate-950 shadow-lg shadow-lime-950/20">
            D
          </div>
          <span className="text-xl font-extrabold tracking-tight">Delcom Posts</span>
        </div>

        <div className="relative z-10 max-w-xl py-16">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-200/20 bg-lime-300/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-lime-200">
            <Sparkles className="h-4 w-4 text-lime-300" aria-hidden="true" />
            TEMPAT IDE BERTUMBUH
          </span>
          <h1 className="text-5xl font-extrabold leading-[1.12] tracking-tight xl:text-6xl">
            Cerita kecil,
            <br />
            <span className="font-serif text-lime-300">inspirasi besar.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-8 text-slate-300">
            Ruang untuk berbagi sudut pandang, menemukan komunitas, dan merayakan ide-ide baru.
          </p>

          <div className="mt-12 max-w-md rounded-3xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300/15 text-lime-200">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-sm leading-6 text-slate-200">
              “Setiap tulisan adalah awal dari percakapan yang berarti.”
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-lime-300">
              Komunitas Delcom
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-slate-400">
          <span>Delcom Posts</span>
          <span className="flex items-center gap-1.5">
            Komunitas yang menginspirasi
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </section>

      <section className="flex min-h-screen flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        {children}
      </section>
    </main>
  );
}