import { useUserStore } from "@/stores/user-store";
import { Link, useRouter } from "@tanstack/react-router";
import { Cat } from "lucide-react";
import { toast } from "sonner";

import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
export function Header() {
  const router = useRouter();
  const { authData, setAuthData } = useUserStore();

  const logout = () => {
    setAuthData(null);
    toast.success("Logged out successfully");
  };

  return (
    <header className="flex justify-between items-center p-4">
      <Cat />

      <div className="flex gap-2">
        <Link className="[&.active]:font-bold [&.active]:text-primary" to="/">
          Home
        </Link>
        <Link
          className="[&.active]:font-bold [&.active]:text-primary"
          to="/player-manage"
        >
          Player Manage
        </Link>
        <Link
          className="[&.active]:font-bold [&.active]:text-primary"
          to="/training-management"
        >
          Training Management
        </Link>
      </div>

      <div className="flex gap-2">
        <ModeToggle />

        {authData?.token ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  {authData.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{authData.user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.navigate({ to: "/profile" })}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={logout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={() => router.navigate({ to: "/signin" })}
            variant="outline"
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
