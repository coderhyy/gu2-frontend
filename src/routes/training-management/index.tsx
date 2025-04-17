import { getPlayersQueryOptions } from "@/api/actions/player/player.options";
import { getTrainingsQueryOptions } from "@/api/actions/training/training.options";
import { createTrainingRequest } from "@/api/actions/training/training.requests";
import { CreateTrainingDto } from "@/api/actions/training/training.types";
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

export const Route = createFileRoute("/training-management/")({
  component: TrainingManagementPage,
});

const formSchema = z.object({
  coach_id: z.number(),
  player_ids: z.array(z.string()).optional(),
  training_date: z.date().optional(),
  training_details: z
    .string()
    .min(1, { message: "Training details is required" }),
  training_location: z
    .string()
    .min(1, { message: "Training location is required" }),
});

function TrainingManagementPage() {
  const { authData } = useUserStore();
  const queryClient = useQueryClient();
  const { data } = useQuery(getTrainingsQueryOptions({ page: 1, size: 100 }));
  const { data: players } = useQuery(
    getPlayersQueryOptions({ page: 1, size: 100 })
  );

  const [isCreateTrainingOpen, setIsCreateTrainingOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      coach_id: authData?.user.coach.coach_id,
      player_ids: [],
      training_date: new Date(),
      training_details: "",
      training_location: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { isPending, mutateAsync: createTraining } = useMutation({
    mutationFn: createTrainingRequest,
    onSettled: () => {
      queryClient.invalidateQueries(
        getTrainingsQueryOptions({ page: 1, size: 100 })
      );
    },
    onSuccess: () => {
      toast.success("Training created successfully");
      setIsCreateTrainingOpen(false);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createTraining(data as unknown as CreateTrainingDto);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (error: any) => {
    console.error(error);
  };

  return (
    <div className="p-4">
      <div className="mb-2 flex justify-end">
        <Dialog
          onOpenChange={setIsCreateTrainingOpen}
          open={isCreateTrainingOpen}
        >
          <DialogTrigger asChild>
            <Button>Add Training</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Training</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                className="space-y-3"
                onSubmit={form.handleSubmit(onSubmit, onError)}
              >
                <FormField
                  control={form.control}
                  name="training_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Details</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="pls enter your training details"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="training_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Location</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="pls enter your training location"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="training_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Date</FormLabel>
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
                  name="player_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Players</FormLabel>
                      <FormControl>
                        <MultiSelect
                          onChange={field.onChange}
                          options={
                            players?.data.map((player) => ({
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
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => setIsCreateTrainingOpen(false)}
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
                      "Create Training"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={data?.data || []} />
    </div>
  );
}
