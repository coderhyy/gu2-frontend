import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { useUserStore } from "@/stores/user-store";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const authData = useUserStore.getState().authData;
    if (!authData) {
      if (
        location.pathname !== "/" &&
        location.pathname !== "/signin" &&
        location.pathname !== "/signup"
      ) {
        throw redirect({
          to: "/signin",
        });
      }
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
