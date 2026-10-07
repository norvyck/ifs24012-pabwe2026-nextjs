const fs = require('fs');
const path = require('path');

const files = {
  'src/features/posts/layouts/PostLayout.tsx': `import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarComponent />
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavbarComponent />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}`,
  'src/features/posts/components/NavbarComponent.tsx': `"use client";
export default function NavbarComponent() {
  return (
    <header className="bg-white shadow h-16 flex items-center px-4 justify-between">
      <div className="font-bold text-xl">Delcom Posts</div>
    </header>
  );
}`,
  'src/features/posts/components/SidebarComponent.tsx': `"use client";
import Link from "next/link";
export default function SidebarComponent() {
  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col hidden md:flex">
      <div className="p-4 font-bold text-xl border-b border-slate-700">Menu</div>
      <nav className="flex-1 p-2 space-y-2">
        <Link href="/" className="block p-2 rounded hover:bg-slate-700">Semua Postingan</Link>
        <Link href="/users" className="block p-2 rounded hover:bg-slate-700">Daftar Pengguna</Link>
        <Link href="/profile" className="block p-2 rounded hover:bg-slate-700">Profil Saya</Link>
      </nav>
    </aside>
  );
}`,
  'src/features/posts/pages/HomePage.tsx': `"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncGetPosts } from "../states/action";
import Link from "next/link";
import { formatDate } from "@/helpers/toolsHelper";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts.list);

  useEffect(() => {
    dispatch(asyncGetPosts());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Postingan Publik</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post: any) => (
          <div key={post.id} className="bg-white p-4 rounded shadow flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full" />
              <span className="font-bold">{post.author.name}</span>
            </div>
            {post.cover && <img src={post.cover} alt="Cover" className="w-full h-48 object-cover rounded" />}
            <p className="mt-2 line-clamp-3">{post.body}</p>
            <div className="text-sm text-gray-500 mt-2 flex justify-between">
              <span>{formatDate(post.createdAt)}</span>
              <Link href={\`/posts/\${post.id}\`} className="text-blue-600 font-semibold">Lihat Detail</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
  'src/features/posts/pages/DetailPage.tsx': `"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncGetPostDetail } from "../states/action";
import { formatDate } from "@/helpers/toolsHelper";

export default function DetailPage({ postId }: { postId: string }) {
  const dispatch = useAppDispatch();
  const post = useAppSelector((state) => state.posts.detail);

  useEffect(() => {
    dispatch(asyncGetPostDetail(postId));
  }, [dispatch, postId]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center gap-4 mb-4">
        <img src={(post as any).author.avatar} alt={(post as any).author.name} className="w-12 h-12 rounded-full" />
        <div>
          <div className="font-bold text-lg">{(post as any).author.name}</div>
          <div className="text-sm text-gray-500">{formatDate((post as any).createdAt)}</div>
        </div>
      </div>
      {(post as any).cover && <img src={(post as any).cover} alt="Cover" className="w-full max-h-96 object-cover rounded mb-4" />}
      <p className="text-lg whitespace-pre-wrap">{(post as any).body}</p>
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
