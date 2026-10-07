"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncGetPosts, asyncDeletePost, asyncUpdatePost, asyncToggleLike } from "../states/action";
import Link from "next/link";
import { Heart, MessageCircle, MoreHorizontal, Search, Edit3, Trash2, X, Loader2, PenLine, Users, ArrowUpRight, Clock3 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import AddPostModal from "../components/AddPostModal";
import type { Post } from "@/types";
import NextImage from "next/image";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts.list);
  const profile = useAppSelector((state) => state.users.profile);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  
  // Edit state
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);

  useEffect(() => {
    dispatch(asyncGetPosts());
  }, [dispatch]);

  const formatTime = (dateString?: string) => {
    try {
      if (!dateString) return "Waktu tidak diketahui";
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: localeId });
    } catch {
      return dateString;
    }
  };

  const handleDelete = async (postId: string | number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus postingan ini?")) return;
    await dispatch(asyncDeletePost(String(postId)));
    dispatch(asyncGetPosts());
    setOpenMenuId(null);
  };

  const handleLike = async (postId: string | number, isLiked: boolean) => {
    await dispatch(asyncToggleLike({ id: String(postId), like: isLiked ? 0 : 1 }));
    dispatch(asyncGetPosts());
  };

  const handleEditOpen = (post: Post) => {
    setEditingPost(post);
    setEditDescription(post.description || post.body || "");
    setOpenMenuId(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDescription.trim() || !editingPost) return;
    setIsEditLoading(true);
    try {
      await dispatch(asyncUpdatePost({ id: String(editingPost.id), body: { description: editDescription } })).unwrap();
      dispatch(asyncGetPosts());
      setEditingPost(null);
      setEditDescription("");
    } catch {
      alert("Gagal mengubah postingan.");
    }
    setIsEditLoading(false);
  };

  const isMyPost = (post: Post) => {
    return Boolean(profile && post.author?.id === profile.id);
  };

  return (
    <div className="mx-auto max-w-7xl py-1 sm:py-3">
      <header className="mb-7 flex flex-col justify-between gap-5 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:pb-7">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.19em] text-indigo-700">
            Delcom Posts <span className="mx-1 text-slate-300">/</span> Ruang komunitas
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.55rem]">
            Cerita dari komunitas<span className="text-lime-600">.</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Baca, beri apresiasi, lalu ikut berbagi perspektifmu.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-[#15172c] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 active:translate-y-0"
        >
          <PenLine className="h-4 w-4 text-lime-300" aria-hidden="true" />
          Tulis cerita
        </button>
      </header>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] xl:gap-10">
        <section aria-labelledby="feed-heading">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 id="feed-heading" className="text-lg font-bold tracking-tight text-slate-900">Terbaru</h2>
              <p className="mt-0.5 text-xs text-slate-500">Cerita publik dari anggota Delcom</p>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
              {posts?.length || 0} cerita
            </span>
          </div>

          {!posts || posts.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-5 py-14 text-center text-slate-500">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-100 text-lime-800">
                <Search className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="font-semibold text-slate-800">Belum ada cerita di sini.</p>
              <p className="mt-1 max-w-sm text-sm">Mulai percakapan dengan membagikan cerita pertama.</p>
              <button onClick={() => setIsModalOpen(true)} className="mt-5 rounded-full bg-[#15172c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
                Tulis cerita pertama
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <article key={post.id} className="group overflow-visible rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_6px_24px_-20px_rgba(15,23,42,0.22)] transition hover:border-slate-300 hover:shadow-[0_12px_34px_-22px_rgba(15,23,42,0.24)] sm:p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      {post.author?.photo ? (
                        <NextImage src={post.author.photo} alt="" width={40} height={40} unoptimized className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-slate-200" />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-800">
                          {post.author?.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-900">{post.author?.name || "Pengguna"}</h3>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock3 className="h-3 w-3" aria-hidden="true" />
                          {formatTime(post.created_at || post.createdAt)}
                        </p>
                      </div>
                    </div>

                    {isMyPost(post) && (
                      <div className="relative ml-2 shrink-0">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                          aria-label="Pilihan lainnya"
                          aria-expanded={openMenuId === post.id}
                          className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                          <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {openMenuId === post.id && (
                          <div className="absolute right-0 z-30 mt-1 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                            <button onClick={() => handleEditOpen(post)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50">
                              <Edit3 className="h-4 w-4 text-indigo-500" aria-hidden="true" /> Edit
                            </button>
                            <button onClick={() => handleDelete(post.id)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-rose-600 transition hover:bg-rose-50">
                              <Trash2 className="h-4 w-4" aria-hidden="true" /> Hapus
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700 line-clamp-5">
                    {post.description || post.body}
                  </p>

                  {post.cover && (
                    <div className="mt-4 overflow-hidden rounded-xl bg-slate-100">
                      <NextImage src={post.cover} alt="Sampul postingan" width={1280} height={720} unoptimized className="max-h-[26rem] w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]" />
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleLike(post.id, Boolean(post.isLiked))}
                        aria-label={`${post.isLiked ? "Batalkan suka" : "Sukai"} postingan, ${post.likes?.length || 0} suka`}
                        className={`group/like flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-semibold transition ${post.isLiked ? "text-rose-600" : "text-slate-500 hover:bg-rose-50 hover:text-rose-600"}`}
                      >
                        <Heart className={`h-4 w-4 transition-transform group-hover/like:scale-110 ${post.isLiked ? "fill-rose-500 text-rose-500" : ""}`} aria-hidden="true" />
                        {post.likes?.length || 0}
                      </button>
                      <Link href={`/posts/${post.id}#commentInput`} aria-label={`${post.comments?.length || 0} komentar`} className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-semibold text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700">
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        {post.comments?.length || 0}
                      </Link>
                    </div>
                    <Link href={`/posts/${post.id}`} className="group/read inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-lime-100 hover:text-slate-950">
                      Baca cerita
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/read:translate-x-0.5 group-hover/read:-translate-y-0.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className="overflow-hidden rounded-2xl border border-lime-200 bg-lime-100/70 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300 text-slate-900">
              <PenLine className="h-4 w-4" aria-hidden="true" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-lime-900/70">Punya sesuatu untuk dibagi?</p>
            <h2 className="mt-2 text-xl font-bold leading-snug tracking-tight text-slate-950">Satu cerita bisa membuka banyak sudut pandang.</h2>
            <button onClick={() => setIsModalOpen(true)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#15172c] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700">
              Mulai menulis <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-bold text-slate-900">Jelajahi Delcom</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">Temukan orang-orang dan cerita baru di komunitas.</p>
            <Link href="/users" className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700">
              <span className="flex items-center gap-2.5"><Users className="h-4 w-4 text-indigo-600" aria-hidden="true" /> Lihat anggota</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>

          <Link href="/profile" className="block rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Ruang personal</p>
            <div className="mt-3 flex items-center gap-3">
              {profile?.photo ? (
                <NextImage src={profile.photo} alt="" width={40} height={40} unoptimized className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-200 text-sm font-bold text-slate-900">
                  {profile?.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{profile?.name || "Lihat profilmu"}</p>
                <p className="truncate text-xs text-slate-400">Kelola akun dan fotomu</p>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            </div>
          </Link>

          <p className="px-1 text-[11px] leading-5 text-slate-400">Berbagi dengan hormat, dengarkan dengan terbuka.</p>
        </aside>
      </div>

      <AddPostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-900">Edit Postingan</h2>
              <button onClick={() => setEditingPost(null)} aria-label="Tutup" className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6">
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                aria-label="Isi postingan"
                className="h-40 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                required
              />
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setEditingPost(null)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={!editDescription.trim() || isEditLoading}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
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