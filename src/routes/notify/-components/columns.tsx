import { MemberType } from "@/api/actions/auth/auth.types";
import { getAllNotificationsOptions } from "@/api/actions/notify/notify.options";
import {
  deleteNotificationRequest,
  sendNotificationRequest,
  updateNotificationRequest,
} from "@/api/actions/notify/notify.requests";
import {
  Notify,
  SendNotificationArgs,
} from "@/api/actions/notify/notify.types";
import { getTeamsOptions } from "@/api/actions/team/team.options";
import { Team } from "@/api/actions/team/team.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/stores/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  content: z.string(),
  sender_id: z.number(),
  team_id: z.string(),
  title: z.string(),
});

function EditTeamCell({ team }: { team: Notify }) {
  const queryClient = useQueryClient();
  const authData = useUserStore((state) => state.authData);
  const { data: teams } = useQuery(getTeamsOptions());

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: SendNotificationArgs) =>
      updateNotificationRequest(team.notification_id, data),
    onSuccess: () => {
      toast.success("Notification updated successfully");
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: getAllNotificationsOptions().queryKey,
      });
    },
  });

  const { isPending: isDeletePending, mutateAsync: mutateDelete } = useMutation(
    {
      mutationFn: () => deleteNotificationRequest(team.notification_id),
      onError: () => {
        toast.error("Failed to delete notification");
      },
      onSuccess: () => {
        toast.success("Notification deleted successfully");
        setIsDeleteOpen(false);
        queryClient.invalidateQueries({
          queryKey: getAllNotificationsOptions().queryKey,
        });
      },
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: team.content,
      sender_id: team.sender.coach_id,
      team_id: team.team.team_id.toString(),
      title: team.title,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutateAsync({
      ...data,
      is_team_notification: false,
      team_id: Number(data.team_id),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (error: any) => {
    console.error(error);
  };

  const { mutateAsync: mutateSendNotification } = useMutation({
    mutationFn: () =>
      sendNotificationRequest({
        content: team.content,
        is_team_notification: true,
        sender_id: authData?.user.coach?.coach_id || 0,
        team_id: team.team.team_id,
        title: team.title,
      }),
    onError: () => {
      toast.error("Failed to send notification");
    },
    onSuccess: () => {
      toast.success("Notification sent successfully");
    },
  });

  return (
    <div className="flex gap-2">
      <Button onClick={() => mutateSendNotification()} variant="outline">
        Send Notification
      </Button>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={
              authData?.user.member_type === MemberType.PLAYER ||
              authData?.user.member_type === MemberType.MEMBER
            }
            variant="outline"
          >
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              className="space-y-3"
              onSubmit={form.handleSubmit(onSubmit, onError)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="pls enter your title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="pls enter your content"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="team_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Id</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString() || ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Team" />
                        </SelectTrigger>
                        <SelectContent>
                          {teams?.data?.map((team: Team) => (
                            <SelectItem
                              key={team.team_id}
                              value={team.team_id.toString()}
                            >
                              {team.team_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog onOpenChange={setIsDeleteOpen} open={isDeleteOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={
              authData?.user.member_type === MemberType.PLAYER ||
              authData?.user.member_type === MemberType.MEMBER
            }
            variant="destructive"
          >
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Training</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this training?
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setIsDeleteOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isDeletePending}
              onClick={() => mutateDelete()}
              variant="destructive"
            >
              {isDeletePending ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const columns: ColumnDef<Notify>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "content",
    header: "Content",
  },
  {
    accessorKey: "team.team_name",
    header: "Team Name",
  },
  {
    accessorKey: "created_at",
    cell: ({ row }) => {
      const team = row.original;
      return <div>{format(new Date(team.created_at), "PPP")}</div>;
    },
    header: "Created At",
  },
  {
    accessorKey: "updated_at",
    cell: ({ row }) => {
      const team = row.original;
      return <div>{format(new Date(team.updated_at), "PPP")}</div>;
    },
    header: "Updated At",
  },
  {
    cell: ({ row }) => {
      const team = row.original;
      return <EditTeamCell team={team} />;
    },

    header: "Actions",
    id: "actions",
  },
];
