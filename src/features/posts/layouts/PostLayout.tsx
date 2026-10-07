"use client";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken } from "@/helpers/apiHelper";
import { useAppDispatch } from "@/hooks/redux";
import { asyncGetProfile } from "@/features/users/states/action";

const subscribeToAuth = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
};
const getAuthSnapshot = () => Boolean(getAccessToken());
const getServerAuthSnapshot = () => false;

export default function PostLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isAuthorized = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getServerAuthSnapshot
  );
  const isPublicRoute =
    pathname === "/users" ||
    pathname === "/profile" ||
    /^\/posts\/[^/]+$/.test(pathname);
  const canRenderPage = isAuthorized || isPublicRoute;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthorized && !isPublicRoute) {
      router.replace("/auth/login");
      return;
    }
    if (isAuthorized) dispatch(asyncGetProfile());
  }, [router, dispatch, isAuthorized, isPublicRoute]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMobileMenuOpen]);

  if (!canRenderPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50" role="status">
        <p className="text-slate-600">Memeriksa sesi...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f7f2] font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-indigo-700 focus:shadow-lg"
      >
        Lewati ke konten utama
      </a>
      {isMobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Tutup menu navigasi"
        />
      )}
      <SidebarComponent
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="relative z-0 flex flex-1 flex-col overflow-hidden">
        <NavbarComponent onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main id="main-content" tabIndex={-1} className="relative z-0 flex-1 w-full overflow-auto p-4 sm:px-7 sm:py-6 lg:px-10 lg:py-8">
          <div className="relative z-10 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}