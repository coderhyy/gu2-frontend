import { updatePlayerRequest } from "@/api/actions/player/player.requests";
import { Player } from "@/api/actions/player/player.types";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  position: z.string().optional(),
  skill_level: z.string().optional(),
  team_name: z.string().optional(),
});

function EditPlayerCell({ player }: { player: Player }) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: Omit<Player, "member" | "player_id">) =>
      updatePlayerRequest(player.player_id, data),
    onSuccess: () => {
      toast.success("Player updated successfully");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      position: player.position || "",
      skill_level: player.skill_level || "",
      team_name: player.team_name || "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutateAsync(data as Omit<Player, "member" | "player_id">);
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Player</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
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
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="pls enter your position"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skill_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Level</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="pls enter your skill level"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
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
  );
}

export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "member.name",
    header: "Member",
  },
  {
    accessorKey: "member.email",
    header: "Email",
  },
  {
    accessorKey: "member.phone",
    header: "Phone",
  },
  {
    accessorKey: "member.registration_date",
    header: "Registration Date",
  },
  {
    cell: ({ row }) => {
      const player = row.original;
      return <EditPlayerCell player={player} />;
    },
    header: "Actions",
    id: "actions",
  },
];
