const fs = require('fs');
const path = require('path');

const files = {
  // Auth Pages
  'src/features/auth/pages/LoginPage.tsx': `"use client";
import { useInput } from "@/hooks/useInput";
import { useAppDispatch } from "@/hooks/redux";
import { asyncLogin } from "../states/action";
import { useRouter } from "next/navigation";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import Link from "next/link";

export default function LoginPage() {
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(asyncLogin({ email, password })).unwrap();
      showSuccessDialog("Berhasil", "Login berhasil!");
      router.push("/");
    } catch (err: any) {
      showErrorDialog("Gagal Login", err.message);
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Masuk Akun</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input type="email" placeholder="Email" value={email} onChange={onEmailChange} required className="border p-2 rounded" />
        <input type="password" placeholder="Kata Sandi" value={password} onChange={onPasswordChange} required className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded font-semibold mt-2">Masuk Sekarang</button>
      </form>
      <div className="mt-4 text-center">
        Belum punya akun? <Link href="/auth/register" className="text-blue-600">Daftar Baru</Link>
      </div>
    </div>
  );
}`,
  'src/features/auth/pages/RegisterPage.tsx': `"use client";
import { useInput } from "@/hooks/useInput";
import { useAppDispatch } from "@/hooks/redux";
import { asyncRegister } from "../states/action";
import { useRouter } from "next/navigation";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import Link from "next/link";

export default function RegisterPage() {
  const [name, onNameChange] = useInput("");
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(asyncRegister({ name, email, password })).unwrap();
      showSuccessDialog("Berhasil", "Pendaftaran berhasil, silakan login.");
      router.push("/auth/login");
    } catch (err: any) {
      showErrorDialog("Gagal Daftar", err.message);
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Daftar Baru</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input type="text" placeholder="Nama Lengkap" value={name} onChange={onNameChange} required className="border p-2 rounded" />
        <input type="email" placeholder="Email" value={email} onChange={onEmailChange} required className="border p-2 rounded" />
        <input type="password" placeholder="Kata Sandi" value={password} onChange={onPasswordChange} required className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded font-semibold mt-2">Daftar Sekarang</button>
      </form>
      <div className="mt-4 text-center">
        Sudah punya akun? <Link href="/auth/login" className="text-blue-600">Masuk Akun</Link>
      </div>
    </div>
  );
}`,
  // Users Pages
  'src/features/users/pages/UsersPage.tsx': `"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncGetUsers } from "../states/action";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.list);

  useEffect(() => {
    dispatch(asyncGetUsers());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Daftar Pengguna</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u: any) => (
          <div key={u.id} className="bg-white p-4 rounded shadow flex items-center gap-4">
            <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full" />
            <div>
              <div className="font-bold">{u.name}</div>
              <div className="text-gray-500 text-sm">{u.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
  'src/features/users/pages/ProfilePage.tsx': `"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncGetProfile } from "../states/action";
import { asyncLogout } from "@/features/auth/states/action";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.users.profile);
  const router = useRouter();

  useEffect(() => {
    dispatch(asyncGetProfile());
  }, [dispatch]);

  const onLogout = async () => {
    await dispatch(asyncLogout());
    router.push("/auth/login");
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>
      <div className="flex flex-col items-center gap-4 mb-6">
        <img src={(profile as any).avatar} alt="Avatar" className="w-24 h-24 rounded-full" />
        <div className="text-center">
          <div className="font-bold text-xl">{(profile as any).name}</div>
          <div className="text-gray-500">{(profile as any).email}</div>
        </div>
      </div>
      <button onClick={onLogout} className="w-full bg-red-600 text-white p-2 rounded font-semibold">Keluar Akun</button>
    </div>
  );
}`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.resolve(process.cwd(), filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created ' + filepath);
});
