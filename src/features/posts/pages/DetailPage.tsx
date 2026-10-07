"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncGetPostDetail } from "../states/action";
import { ArrowLeft, MessageCircle, Heart, Share2, Send, User } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { asyncToggleLike, asyncAddComment } from "../states/action";
import { showSuccessDialog, showErrorDialog } from "@/helpers/toolsHelper";

export default function DetailPage({ postId }: { postId: string }) {
  const dispatch = useAppDispatch();
  const post: any = useAppSelector((state) => state.posts.detail);
  const router = useRouter();
  
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(asyncGetPostDetail(postId));
  }, [dispatch, postId]);

  const handleLike = async () => {
    await dispatch(asyncToggleLike({ id: postId, like: post.isLiked ? 0 : 1 }));
    dispatch(asyncGetPostDetail(postId));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Tautan berhasil disalin ke clipboard!");
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(asyncAddComment({ id: postId, body: { comment: commentText } })).unwrap();
      showSuccessDialog("Berhasil", "Berhasil menambahkan komentar!");
      setCommentText("");
    } catch (error: any) {
      showErrorDialog("Gagal", error.message || "Gagal menambahkan komentar");
    } finally {
      setIsSubmitting(false);
      dispatch(asyncGetPostDetail(postId));
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "Waktu tidak diketahui";
      return format(new Date(dateString), "dd MMMM yyyy, HH:mm", { locale: localeId });
    } catch {
      return dateString;
    }
  };

  if (!post) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white/80 py-16">
        <div className="animate-pulse flex flex-col items-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600"></div>
          <p className="font-medium text-slate-500">Memuat cerita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-2 sm:py-4">
      <button 
        onClick={() => router.back()}
        className="mb-5 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-indigo-700 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Kembali ke cerita
      </button>

      <article className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_16px_50px_-30px_rgba(15,23,42,0.25)]">
        {post.cover && (
          <div className="relative h-56 w-full bg-slate-100 sm:h-80 lg:h-[26rem]">
            <img src={post.cover} alt="Sampul postingan" className="h-full w-full object-cover" />
          </div>
        )}
        
        <div className="p-5 sm:p-8 lg:p-10">
          <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-6 sm:mb-8 sm:gap-4 sm:pb-8">
            {post.author?.photo ? (
              <img src={post.author.photo} alt="" className="h-12 w-12 rounded-2xl object-cover ring-2 ring-slate-100 sm:h-14 sm:w-14" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-lg font-bold text-indigo-700 ring-2 ring-slate-100 sm:h-14 sm:w-14 sm:text-xl">
                {post.author?.name?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <h3 className="font-bold text-slate-900 sm:text-lg">{post.author?.name || "Pengguna"}</h3>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">{formatDate(post.created_at || post.createdAt)}</p>
            </div>
          </div>

          <div className="mb-8 max-w-none sm:mb-10">
            <p className="whitespace-pre-wrap text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">
              {post.description || post.body}
            </p>
          </div>

          <div className="flex items-center gap-3 border-t border-slate-100 pt-5 sm:gap-6 sm:pt-6">
            <button 
              onClick={handleLike}
              className={`group flex items-center gap-1.5 rounded-xl px-2 py-1.5 transition-colors sm:gap-2 ${post.isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'}`}
            >
              <div className={`rounded-lg p-2 transition-colors ${post.isLiked ? 'bg-rose-50' : 'group-hover:bg-rose-50'}`}>
                <Heart className={`h-5 w-5 sm:h-6 sm:w-6 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} aria-hidden="true" />
              </div>
              <span className="text-sm font-semibold sm:text-base">{post.likes?.length || 0}</span>
            </button>
            <button 
              onClick={() => document.getElementById('commentInput')?.focus()}
              className="group flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-slate-500 transition-colors hover:text-indigo-600 sm:gap-2"
            >
              <div className="rounded-lg p-2 transition-colors group-hover:bg-indigo-50">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </div>
              <span className="text-sm font-semibold sm:text-base">{post.comments?.length || 0}</span>
            </button>
            <button 
              onClick={handleShare}
              className="group ml-auto flex items-center gap-2 rounded-xl px-2 py-1.5 text-slate-500 transition-colors hover:text-teal-600"
            >
              <div className="rounded-lg p-2 transition-colors group-hover:bg-teal-50">
                <Share2 className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </div>
              <span className="hidden text-sm font-semibold sm:inline">Bagikan</span>
            </button>
          </div>
        </div>
      </article>
      
      <section className="mt-5 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.24)] sm:mt-6 sm:p-8 lg:p-10">
        <h3 className="mb-5 border-b border-slate-100 pb-4 text-lg font-bold text-slate-900 sm:mb-6 sm:text-xl">Percakapan <span className="ml-1 rounded-lg bg-indigo-50 px-2 py-1 text-sm font-semibold text-indigo-700">{post.comments?.length || 0}</span></h3>
        
        <form onSubmit={handleComment} className="mb-7 flex gap-2 sm:mb-8 sm:gap-4">
          <input 
            id="commentInput"
            type="text" 
            placeholder="Tulis komentar..." 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={isSubmitting}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50 sm:px-5"
          />
          <button 
            type="submit" 
            disabled={!commentText.trim() || isSubmitting}
            aria-label="Kirim komentar"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#15172c] text-white shadow-lg shadow-slate-900/15 transition hover:bg-indigo-700 hover:shadow-indigo-600/20 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Send className="h-4 w-4" aria-hidden="true" />}
          </button>
        </form>

        <div className="space-y-6">
          {!post.comments || post.comments.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
          ) : (
            post.comments.map((comment: any) => (
              <div key={comment.id} className="flex gap-3 sm:gap-4">
                {comment.author?.photo ? (
                  <img src={comment.author.photo} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover ring-2 ring-slate-100" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 ring-2 ring-slate-100">
                    <User className="h-5 w-5" aria-hidden="true" />
                  </div>
                )}
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-slate-100 bg-slate-50/80 p-4">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <h4 className="font-bold text-sm text-slate-900">{comment.author?.name || "Pengguna"}</h4>
                    <span className="text-xs text-slate-400">{formatDate(comment.created_at || comment.createdAt)}</span>
                  </div>
                  <p className="break-words text-sm leading-6 text-slate-700">{comment.comment || comment.description || comment.body}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}