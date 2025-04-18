import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { useUserStore } from "@/stores/user-store";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  beforeLoad: async () => {
    const authData = useUserStore.getState().authData;
    if (!authData) {
      throw redirect({
        to: "/signin",
      });
    }
  },
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
