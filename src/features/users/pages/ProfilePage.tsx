"use client";
import { useRef, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncGetProfile, asyncUpdateProfilePhoto, asyncUpdateProfile } from "../states/action";
import { asyncLogout } from "@/features/auth/states/action";
import { useRouter } from "next/navigation";
import { LogOut, Settings, Camera, Mail, KeyRound, Shield, Edit3, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { showSuccessDialog, showErrorDialog } from "@/helpers/toolsHelper";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const profile: any = useAppSelector((state) => state.users.profile);
  const router = useRouter();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);

  useEffect(() => {
    if (!profile) {
      dispatch(asyncGetProfile());
    }
  }, [dispatch, profile]);

  const onLogout = async () => {
    await dispatch(asyncLogout());
    router.push("/auth/login");
  };

  const compressImage = (file: File, maxSizeKB = 500, maxDimension = 800): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;

          // Resize if larger than maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, width, height);

          // Start with high quality and reduce if needed
          let quality = 0.8;
          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) return reject(new Error("Gagal mengompresi gambar"));
                if (blob.size > maxSizeKB * 1024 && quality > 0.1) {
                  quality -= 0.1;
                  tryCompress();
                } else {
                  resolve(new File([blob], file.name, { type: "image/jpeg" }));
                }
              },
              "image/jpeg",
              quality
            );
          };
          tryCompress();
        };
        img.onerror = () => reject(new Error("Gagal memuat gambar"));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Gagal membaca file"));
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Compress image to avoid 413 error
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append("photo", compressedFile);
      await dispatch(asyncUpdateProfilePhoto(formData)).unwrap();
      showSuccessDialog("Berhasil", "Foto profil berhasil diperbarui!");
      dispatch(asyncGetProfile());
    } catch (error: any) {
      showErrorDialog("Gagal", error.message || "Gagal memperbarui foto profil");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "-";
      return format(new Date(dateString), "dd MMMM yyyy", { locale: localeId });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="mx-auto max-w-5xl py-2 sm:py-4">
      <div className="mb-8">
        <span className="mb-3 inline-flex items-center rounded-full border border-lime-200 bg-lime-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-lime-800">
          Ruang personal
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Profil saya</h1>
        <p className="mt-2 text-sm text-slate-500">Kelola informasi akun dan preferensi personalmu.</p>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_16px_50px_-30px_rgba(15,23,42,0.25)]">
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 sm:h-44">
          <div className="absolute -right-8 -top-24 h-64 w-64 rounded-full border-[36px] border-white/[0.08]" />
          <div className="absolute bottom-[-7rem] left-1/3 h-48 w-48 rounded-full bg-violet-300/20 blur-3xl" />
        </div>
        
        <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="relative -mt-14 mb-8 flex flex-col items-center gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:gap-6">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handlePhotoChange} 
            />
            <button
              type="button"
              aria-label="Ubah foto profil"
              disabled={isUploading}
              className="group relative cursor-pointer rounded-[1.35rem] text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 disabled:cursor-wait"
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              {profile?.photo ? (
                <img src={profile.photo} alt="" className={`h-28 w-28 rounded-[1.35rem] object-cover ring-4 ring-white shadow-xl sm:h-32 sm:w-32 ${isUploading ? 'opacity-50' : ''}`} />
              ) : (
                <div className={`flex h-28 w-28 items-center justify-center rounded-[1.35rem] bg-indigo-100 text-4xl font-bold text-indigo-700 ring-4 ring-white shadow-xl sm:h-32 sm:w-32 ${isUploading ? 'opacity-50' : ''}`}>
                  {profile?.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center rounded-[1.35rem] bg-slate-950/45 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Camera className="h-7 w-7 text-white" aria-hidden="true" />
              </div>
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-[1.35rem] bg-slate-950/25">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                </div>
              )}
            </button>
            
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h2 className="break-words text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{profile?.name || "Memuat..."}</h2>
              <p className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-slate-500 sm:justify-start">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                {profile?.email || "..."}
                {profile?.email_verified_at && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <Shield className="h-3 w-3" aria-hidden="true" /> Terverifikasi
                  </span>
                )}
              </p>
            </div>

            <div className="flex w-full gap-2 sm:w-auto sm:gap-3">
              <button 
                onClick={() => {
                  setEditName(profile?.name || "");
                  setEditEmail(profile?.email || "");
                  setIsEditOpen(true);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:flex-none sm:px-5"
              >
                <Edit3 className="h-4 w-4" aria-hidden="true" /> Edit profil
              </button>
              <button onClick={onLogout} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 font-semibold text-rose-700 transition hover:bg-rose-100 sm:flex-none sm:px-5">
                <LogOut className="h-4 w-4" aria-hidden="true" /> Keluar
              </button>
            </div>
          </div>

          <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-2 sm:mt-12 sm:gap-6">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
              <h3 className="mb-5 border-b border-slate-200/70 pb-3 text-base font-bold text-slate-900">Informasi personal</h3>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs font-medium text-slate-400">Nama lengkap</p>
                  <p className="break-words font-semibold text-slate-800">{profile?.name || "-"}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-slate-400">Alamat email</p>
                  <p className="break-words font-semibold text-slate-800">{profile?.email || "-"}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-slate-400">Tanggal bergabung</p>
                  <p className="font-semibold text-slate-800">{formatDate(profile?.created_at)}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
              <h3 className="mb-5 border-b border-slate-200/70 pb-3 text-base font-bold text-slate-900">Pengaturan akun</h3>
              <div className="space-y-3">
                <button className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/60">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-white group-hover:text-indigo-600">
                      <KeyRound className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-800">Ubah Kata Sandi</p>
                      <p className="text-xs text-slate-500">Perbarui kredensial keamanan Anda</p>
                    </div>
                  </div>
                </button>
                <button className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/60">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-white group-hover:text-indigo-600">
                      <Settings className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-800">Preferensi Akun</p>
                      <p className="text-xs text-slate-500">Atur notifikasi dan privasi</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-900">Edit profil</h2>
              <button onClick={() => setIsEditOpen(false)} aria-label="Tutup" className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editName.trim()) return;
                setIsEditLoading(true);
                try {
                  await dispatch(asyncUpdateProfile({ name: editName, email: editEmail })).unwrap();
                  showSuccessDialog("Berhasil", "Profil berhasil diperbarui!");
                  dispatch(asyncGetProfile());
                  setIsEditOpen(false);
                } catch (error: any) {
                  showErrorDialog("Gagal", error.message || "Gagal memperbarui profil");
                } finally {
                  setIsEditLoading(false);
                }
              }}
              className="space-y-5 p-6"
            >
              <div>
                <label htmlFor="edit-name" className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
              <div>
                <label htmlFor="edit-email" className="block text-sm font-semibold text-slate-700 mb-2">Alamat Email</label>
                <input
                  id="edit-email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => setIsEditOpen(false)} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!editName.trim() || isEditLoading}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isEditLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isEditLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}