const fs = require('fs');
const path = require('path');

const files = {
  // Routes & Layouts
  'src/app/auth/layout.tsx': `export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">{children}</div>;
}`,
  'src/app/auth/login/page.tsx': `import LoginPage from "@/features/auth/pages/LoginPage";
export default function Page() { return <LoginPage />; }`,
  'src/app/auth/register/page.tsx': `import RegisterPage from "@/features/auth/pages/RegisterPage";
export default function Page() { return <RegisterPage />; }`,
  
  'src/app/(dashboard)/layout.tsx': `import PostLayout from "@/features/posts/layouts/PostLayout";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <PostLayout>{children}</PostLayout>;
}`,
  'src/app/(dashboard)/page.tsx': `import HomePage from "@/features/posts/pages/HomePage";
export default function Page() { return <HomePage />; }`,
  'src/app/(dashboard)/posts/[postId]/page.tsx': `import DetailPage from "@/features/posts/pages/DetailPage";
export default function Page({ params }: { params: { postId: string } }) { return <DetailPage postId={params.postId} />; }`,
  'src/app/(dashboard)/users/page.tsx': `import UsersPage from "@/features/users/pages/UsersPage";
export default function Page() { return <UsersPage />; }`,
  'src/app/(dashboard)/profile/page.tsx': `import ProfilePage from "@/features/users/pages/ProfilePage";
export default function Page() { return <ProfilePage />; }`,

  // Testing utils
  'src/setupTests.ts': `import "@testing-library/jest-dom";`,
  'src/test-utils.tsx': `import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/store";

export function renderWithProviders(ui: React.ReactElement) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper }) };
}
`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.resolve(process.cwd(), filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created ' + filepath);
});
