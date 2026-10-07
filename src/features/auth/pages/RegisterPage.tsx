"use client";

import { useState } from "react";
import { useInput } from "@/hooks/useInput";
import { useAppDispatch } from "@/hooks/redux";
import { asyncRegister } from "../states/action";
import { useRouter } from "next/navigation";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

export default function RegisterPage() {
  const [name, onNameChange] = useInput("");
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(asyncRegister({ name, email, password })).unwrap();
      showSuccessDialog("Berhasil", "Pendaftaran berhasil, silakan login.");
      router.push("/auth/login");
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof err.message === "string"
          ? err.message
          : "Terjadi kesalahan. Silakan coba lagi.";
      showErrorDialog("Gagal Daftar", message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10";

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-300 shadow-lg shadow-lime-500/25">
          <span className="text-xl font-black text-slate-950">D</span>
        </div>
        <span className="text-xl font-extrabold tracking-tight text-slate-900">
          Delcom Posts
        </span>
      </div>

      <section className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.24)] sm:p-9">
        <div className="mb-7">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-lime-800">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Gabung komunitas
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-[2.15rem]">
            Mulai ceritamu
            <span className="font-serif italic text-indigo-600"> di sini.</span>
          </h1>
          <p className="mt-3 leading-relaxed text-slate-500">
            Buat akun dan temukan ruang untuk berbagi ide bersama Delcom.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="register-name-input"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nama lengkap
            </label>
            <div className="group relative">
              <User
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
                aria-hidden="true"
              />
              <input
                id="register-name-input"
                type="text"
                autoComplete="name"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={onNameChange}
                required
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="register-email-input"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email
            </label>
            <div className="group relative">
              <Mail
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
                aria-hidden="true"
              />
              <input
                id="register-email-input"
                type="email"
                autoComplete="email"
                placeholder="nama@email.com"
                value={email}
                onChange={onEmailChange}
                required
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="register-password-input"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Kata sandi
            </label>
            <div className="group relative">
              <Lock
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
                aria-hidden="true"
              />
              <input
                id="register-password-input"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={onPasswordChange}
                required
                className={`${inputClassName} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#15172c] py-3.5 text-base font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-900/20 active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Memproses...
              </>
            ) : (
              <>
                Buat akun
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </>
            )}
          </button>
        </form>

        <div className="mt-7 border-t border-slate-100 pt-6 text-center">
          <p className="text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-indigo-600 transition hover:text-indigo-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Masuk ke akun
            </Link>
          </p>
        </div>
      </section>

      <p className="mt-6 text-center text-xs font-medium tracking-wide text-slate-400">
        CERITA SERU DIMULAI DARI SINI
      </p>
    </div>
  );
}
