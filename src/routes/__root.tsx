import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootPage,
});

function RootPage() {
  return (
    <>
      <Header />

      <Outlet />

      <Toaster position="top-center" richColors />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  );
}
