import { getPlayersQueryOptions } from "@/api/actions/player/player.options";
import {
  deleteTrainingByIdRequest,
  updateTrainingByIdRequest,
} from "@/api/actions/training/training.requests";
import {
  CreateTrainingDto,
  Training,
} from "@/api/actions/training/training.types";
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

function EditTrainingCell({ training }: { training: Training }) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: players } = useQuery(
    getPlayersQueryOptions({ page: 1, size: 100 })
  );

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: CreateTrainingDto) =>
      updateTrainingByIdRequest(training.training_id.toString(), data),
    onSuccess: () => {
      toast.success("Training updated successfully");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["trainings"] });
    },
  });

  const { isPending: isDeletePending, mutateAsync: mutateDelete } = useMutation(
    {
      mutationFn: () =>
        deleteTrainingByIdRequest(training.training_id.toString()),
      onError: () => {
        toast.error("Failed to delete training");
      },
      onSuccess: () => {
        toast.success("Training deleted successfully");
        setIsDeleteOpen(false);
        queryClient.invalidateQueries({ queryKey: ["trainings"] });
      },
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      coach_id: training.coach.coach_id,
      player_ids: training.training_records.map((record) =>
        record.player.player_id.toString()
      ),
      training_date: training.training_date
        ? new Date(training.training_date)
        : undefined,
      training_details: training.training_details || "",
      training_location: training.training_location || "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutateAsync(data as unknown as CreateTrainingDto);
  };

  return (
    <div className="flex gap-2">
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Training</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
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
          <Button variant="destructive">Delete</Button>
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

export const columns: ColumnDef<Training>[] = [
  {
    accessorKey: "training_location",
    header: "Training Location",
  },
  {
    accessorKey: "training_details",
    header: "Training Details",
  },
  {
    accessorKey: "training_date",
    cell: ({ row }) => {
      const training = row.original;
      return <div>{format(training.training_date, "PPP")}</div>;
    },
    header: "Training Date",
  },
  {
    cell: ({ row }) => {
      const training = row.original;
      return <EditTrainingCell training={training} />;
    },

    header: "Actions",
    id: "actions",
  },
];
