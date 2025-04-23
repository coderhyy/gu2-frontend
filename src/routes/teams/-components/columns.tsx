import { MemberType } from "@/api/actions/auth/auth.types";
import { getCoachesQueryOptions } from "@/api/actions/coach/coach.options";
import { sendNotificationRequest } from "@/api/actions/notify/notify.requests";
import { getPlayersQueryOptions } from "@/api/actions/player/player.options";
import { getTeamsOptions } from "@/api/actions/team/team.options";
import {
  deleteTeamRequest,
  updateTeamRequest,
} from "@/api/actions/team/team.requests";
import { Team } from "@/api/actions/team/team.types";
import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  coach_ids: z.string().optional(),
  description: z.string(),
  founded_year: z.date(),
  home_venue: z.string(),
  player_ids: z.array(z.string()),
  team_name: z.string(),
});

function EditTeamCell({ team }: { team: Team }) {
  const queryClient = useQueryClient();
  const authData = useUserStore((state) => state.authData);
  const { data: coaches } = useQuery(
    getCoachesQueryOptions({ page: 1, size: 100 })
  );
  const { data: players } = useQuery(
    getPlayersQueryOptions({ page: 1, size: 100 })
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: Team) => updateTeamRequest(team.team_id, data),
    onSuccess: () => {
      toast.success("Team updated successfully");
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: getTeamsOptions().queryKey,
      });
    },
  });

  const { isPending: isDeletePending, mutateAsync: mutateDelete } = useMutation(
    {
      mutationFn: () => deleteTeamRequest(team.team_id.toString()),
      onError: () => {
        toast.error("Failed to delete team");
      },
      onSuccess: () => {
        toast.success("Team deleted successfully");
        setIsDeleteOpen(false);
        queryClient.invalidateQueries({
          queryKey: getTeamsOptions().queryKey,
        });
      },
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      coach_ids: team.coaches[0]?.coach_id.toString(),
      description: team.description,
      founded_year: new Date(team.founded_year),
      home_venue: team.home_venue,
      player_ids: team.players.map((player) => player.player_id.toString()),
      team_name: team.team_name,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutateAsync({
      ...data,
      coach_ids: [Number(data.coach_ids)],
    } as unknown as Team);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (error: any) => {
    console.error(error);
  };

  const { mutateAsync: mutateSendNotification } = useMutation({
    mutationFn: () =>
      sendNotificationRequest({
        content: `${team.team_name} has a competition on ${format(
          new Date(team.founded_year),
          "PPP"
        )}`,
        is_team_notification: true,
        sender_id: team.coaches[0]?.coach_id || 0,
        team_id: team.team_id,
        title: "competition notification",
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
                name="team_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="pls enter your team name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Description</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="pls enter your team description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="home_venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Home Venue</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="pls enter your team home venue"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="founded_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Founded Year</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className={cn(
                              "justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            variant={"outline"}
                          >
                            <CalendarIcon className="h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            initialFocus
                            mode="single"
                            onSelect={field.onChange}
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="player_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Players</FormLabel>
                    <FormControl>
                      <MultiSelect
                        onChange={field.onChange}
                        options={
                          players?.data?.map((player) => ({
                            label: player.member.name,
                            value: player.player_id.toString(),
                          })) || []
                        }
                        placeholder="Select players"
                        selected={field.value || []}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coach_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coaches</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString() || ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select coach" />
                        </SelectTrigger>
                        <SelectContent>
                          {coaches?.map((coach) => (
                            <SelectItem
                              key={coach.coach_id}
                              value={coach.coach_id.toString()}
                            >
                              {coach.member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* <MultiSelect
                        onChange={field.onChange}
                        options={
                          coaches?.map((coach) => ({
                            label: coach.member.name,
                            value: coach.coach_id.toString(),
                          })) || []
                        }
                        placeholder="Select coaches"
                        selected={field.value || []}
                      /> */}
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

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "team_name",
    header: "Team Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "founded_year",
    header: "Founded Year",
  },
  {
    accessorKey: "home_venue",
    header: "Home Venue",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
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
