"use client";
import { useState, useRef } from "react";
import { X, Image as ImageIcon, Loader2, Upload } from "lucide-react";
import { useAppDispatch } from "@/hooks/redux";
import { asyncAddPost, asyncUpdatePostCover, asyncGetPosts } from "../states/action";
import { getErrorMessage } from "@/helpers/apiHelper";
import NextImage from "next/image";

export default function AddPostModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await dispatch(asyncAddPost({ description })).unwrap();
      const postId = result?.data?.post_id;

      if (coverFile) {
        if (postId == null) {
          throw new Error("API tidak mengembalikan ID postingan untuk mengunggah cover.");
        }
        const formData = new FormData();
        formData.append("cover", coverFile);
        await dispatch(asyncUpdatePostCover({ id: String(postId), formData })).unwrap();
      }
      
      setIsLoading(false);
      setDescription("");
      removeCover();
      dispatch(asyncGetPosts()); // Refresh data
      onClose();
    } catch (error) {
      setIsLoading(false);
      alert(getErrorMessage(error, "Gagal menambahkan postingan. Silakan coba lagi."));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/50 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 p-5 sm:p-6">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">Bagikan dengan komunitas</p>
            <h2 className="text-xl font-bold text-slate-900">Tulis cerita baru</h2>
          </div>
          <button 
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
          <div className="mb-4">
            <textarea
              aria-label="Isi postingan baru"
              placeholder="Apa yang ingin Anda bagikan?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-36 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label htmlFor="cover-upload" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ImageIcon className="h-4 w-4 text-indigo-600" aria-hidden="true" /> Gambar sampul <span className="font-normal text-slate-400">(opsional)</span>
            </label>
            
            <input
              id="cover-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {!coverPreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 p-6 text-slate-400 transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <Upload className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold">Pilih gambar untuk diunggah</span>
                <span className="text-xs text-slate-400">Format gambar yang didukung</span>
              </button>
            ) : (
              <div className="relative h-40 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <NextImage src={coverPreview} alt="Pratinjau sampul" fill unoptimized sizes="100vw" className="object-cover" />
                <button
                  type="button"
                  aria-label="Hapus gambar"
                  onClick={removeCover}
                  className="absolute right-3 top-3 rounded-xl bg-slate-950/60 p-2 text-white transition-colors hover:bg-slate-950/80"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={!description.trim() || isLoading}
              className="flex items-center gap-2 rounded-xl bg-[#15172c] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/15 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Mengirim..." : "Posting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
