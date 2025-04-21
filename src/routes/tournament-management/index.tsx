import { MemberType } from "@/api/actions/auth/auth.types";
import { getCoachesQueryOptions } from "@/api/actions/coach/coach.options";
import { getTournamentsQueryOptions } from "@/api/actions/tournament/tournament.options";
import { createTournamentRequest } from "@/api/actions/tournament/tournament.requests";
import { Tournament } from "@/api/actions/tournament/tournament.types";
import { DataTable } from "@/components/data-table";
import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { columns } from "./-components/columns";
const formSchema = z.object({
  coach_ids: z.array(z.string()).optional(),
  created_by: z.number(),
  event_date: z.date(),
  event_description: z.string().min(1, { message: "Description is required" }),
  event_location: z.string().min(1, { message: "Location is required" }),
  event_name: z.string().min(1, { message: "Tournament name is required" }),
  teams_involved: z.string().min(1, { message: "Teams involved is required" }),
});

export const Route = createFileRoute("/tournament-management/")({
  component: RouteComponent,
});

function RouteComponent() {
  const authData = useUserStore((state) => state.authData);
  const queryClient = useQueryClient();
  const { data } = useQuery(getTournamentsQueryOptions({ page: 1, size: 100 }));
  const { data: coaches } = useQuery(
    getCoachesQueryOptions({ page: 1, size: 100 })
  );

  const [isCreateTournamentOpen, setIsCreateTournamentOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      coach_ids: [],
      created_by: authData?.user.id,
      event_date: new Date(),
      event_description: "",
      event_location: "",
      event_name: "",
      teams_involved: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { isPending, mutateAsync: createTournament } = useMutation({
    mutationFn: createTournamentRequest,
    onSettled: () => {
      queryClient.invalidateQueries(
        getTournamentsQueryOptions({ page: 1, size: 100 })
      );
    },
    onSuccess: () => {
      toast.success("Tournament created successfully");
      setIsCreateTournamentOpen(false);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createTournament(data as unknown as Tournament);
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
                                " justify-start text-left font-normal",
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
