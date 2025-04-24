import { MemberType } from "@/api/actions/auth/auth.types";
import { getAllNotificationsOptions } from "@/api/actions/notify/notify.options";
import { sendNotificationRequest } from "@/api/actions/notify/notify.requests";
import { getTeamsOptions } from "@/api/actions/team/team.options";
import { Team } from "@/api/actions/team/team.types";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { columns } from "./-components/columns";
const formSchema = z.object({
  content: z.string(),
  sender_id: z.number(),
  team_id: z.string(),
  title: z.string(),
});

export const Route = createFileRoute("/notify/")({
  component: RouteComponent,
});

function RouteComponent() {
  const authData = useUserStore((state) => state.authData);
  const queryClient = useQueryClient();
  const { data } = useQuery(getAllNotificationsOptions());

  const { data: teams } = useQuery(getTeamsOptions());

  const [isCreateTournamentOpen, setIsCreateTournamentOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: "",
      sender_id: authData?.user.coach?.coach_id || 0,
      team_id: "",
      title: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { isPending, mutateAsync: createTeam } = useMutation({
    mutationFn: sendNotificationRequest,
    onSettled: () => {
      queryClient.invalidateQueries(getAllNotificationsOptions());
    },
    onSuccess: () => {
      toast.success("Notification sent successfully");
      setIsCreateTournamentOpen(false);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createTeam({
      ...data,
      is_team_notification: true,
      team_id: Number(data.team_id),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (error: any) => {
    console.error(error);
  };

  return (
    <div className="p-4">
      <div className="mb-2 flex justify-end">
        <Dialog
          onOpenChange={setIsCreateTournamentOpen}
          open={isCreateTournamentOpen}
        >
          <DialogTrigger asChild>
            <Button
              disabled={
                authData?.user.member_type === MemberType.PLAYER ||
                authData?.user.member_type === MemberType.MEMBER
              }
            >
              Add Tournament
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Tournament</DialogTitle>
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

                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => setIsCreateTournamentOpen(false)}
                    variant={"outline"}
                  >
                    Cancel
                  </Button>
                  <Button disabled={isPending} type="submit">
                    {isPending ? (
                      <>
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Create Tournament"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
