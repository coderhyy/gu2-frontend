import { MemberType } from "@/api/actions/auth/auth.types";
import { getNotificationsOptions } from "@/api/actions/notify/notify.options";
import { Notify } from "@/api/actions/notify/notify.types";
import { useUserStore } from "@/stores/user-store";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import { Bell, Cat } from "lucide-react";
import { toast } from "sonner";

import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
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

  const { data: notifications } = useQuery(
    getNotificationsOptions(authData?.user.player?.player_id || 0)
  );

  const logout = () => {
    setAuthData(null);
    toast.success("Logged out successfully");
  };

  return (
    <header className="flex justify-between items-center p-4">
      <Cat />

      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link className="[&.active]:font-bold [&.active]:text-primary" to="/">
            Home
          </Link>
        </Button>

        {(authData?.user.member_type === MemberType.ADMIN ||
          authData?.user.member_type === MemberType.COACH) && (
          <Button asChild variant="outline">
            <Link
              className="[&.active]:font-bold [&.active]:text-primary"
              to="/teams"
            >
              Teams Management
            </Link>
          </Button>
        )}

        {(authData?.user.member_type === MemberType.ADMIN ||
          authData?.user.member_type === MemberType.COACH) && (
          <>
            <Button asChild variant="outline">
              <Link
                className="[&.active]:font-bold [&.active]:text-primary"
                to="/player-manage"
              >
                Player Management
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link
                className="[&.active]:font-bold [&.active]:text-primary"
                to="/training-management"
              >
                Training Management
              </Link>
            </Button>
          </>
        )}
        <Button asChild variant="outline">
          <Link
            className="[&.active]:font-bold [&.active]:text-primary"
            to="/tournament-management"
          >
            Tournament Management
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link
            className="[&.active]:font-bold [&.active]:text-primary"
            to="/consent-form"
          >
            Consent Form
          </Link>
        </Button>
      </div>

      <div className="flex gap-2">
        <ModeToggle />

        {authData?.token && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative" size="icon" variant="outline">
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications && notifications.length > 0 ? (
                notifications.map((notification: Notify) => (
                  <DropdownMenuItem
                    className="flex flex-col items-start gap-1"
                    key={notification.notification_id}
                  >
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {notification.content}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(
                        new Date(notification.created_at),
                        "yyyy-MM-dd HH:mm"
                      )}
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

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
