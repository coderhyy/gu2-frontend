import { MemberType } from "@/api/actions/auth/auth.types";
import { getCoachesQueryOptions } from "@/api/actions/coach/coach.options";
import { getTournamentsQueryOptions } from "@/api/actions/tournament/tournament.options";
import {
  deleteTournamentRequest,
  updateTournamentRequest,
} from "@/api/actions/tournament/tournament.requests";
import { Tournament } from "@/api/actions/tournament/tournament.types";
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
  coach_ids: z.array(z.string()).optional(),
  event_date: z.date(),
  event_description: z.string(),
  event_location: z.string(),
  event_name: z.string(),
  teams_involved: z.string(),
});

function EditTrainingCell({ event }: { event: Tournament }) {
  const queryClient = useQueryClient();
  const authData = useUserStore((state) => state.authData);
  const { data: coaches } = useQuery(
    getCoachesQueryOptions({ page: 1, size: 100 })
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: Tournament) =>
      updateTournamentRequest(event.event_id.toString(), data),
    onSuccess: () => {
      toast.success("Tournament updated successfully");
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: getTournamentsQueryOptions({ page: 1, size: 100 }).queryKey,
      });
    },
  });

  const { isPending: isDeletePending, mutateAsync: mutateDelete } = useMutation(
    {
      mutationFn: () => deleteTournamentRequest(event.event_id.toString()),
      onError: () => {
        toast.error("Failed to delete training");
      },
      onSuccess: () => {
        toast.success("Training deleted successfully");
        setIsDeleteOpen(false);
        queryClient.invalidateQueries({
          queryKey: getTournamentsQueryOptions({ page: 1, size: 100 }).queryKey,
        });
      },
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      coach_ids: [],
      event_date: new Date(event.event_date),
      event_description: event.event_description,
      event_location: event.event_location,
      event_name: event.event_name,
      teams_involved: event.teams_involved,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutateAsync(data as unknown as Tournament);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (error: any) => {
    console.error(error);
  };

  return (
    <div className="flex gap-2">
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
            <DialogTitle>Edit Tournament</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              className="space-y-3"
              onSubmit={form.handleSubmit(onSubmit, onError)}
            >
              <FormField
                control={form.control}
                name="event_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="pls enter your tournament name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament Description</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="pls enter your tournament description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament Location</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="pls enter your tournament location"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament Date</FormLabel>
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
                name="teams_involved"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teams Involved</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="pls enter your tournament teams"
                        {...field}
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
                      <MultiSelect
                        onChange={field.onChange}
                        options={
                          coaches?.map((coach) => ({
                            label: coach.member.name,
                            value: coach.coach_id.toString(),
                          })) || []
                        }
                        placeholder="Select coaches"
                        selected={field.value || []}
                      />
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

export const columns: ColumnDef<Tournament>[] = [
  {
    accessorKey: "event_name",
    header: "Event Name",
  },
  {
    accessorKey: "event_date",
    header: "Event Date",
  },
  {
    accessorKey: "event_location",
    header: "Event Location",
  },
  {
    accessorKey: "event_description",
    header: "Event Description",
  },
  {
    accessorKey: "teams_involved",
    header: "Teams Involved",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
  {
    cell: ({ row }) => {
      const event = row.original;
      return <EditTrainingCell event={event} />;
    },

    header: "Actions",
    id: "actions",
  },
];
