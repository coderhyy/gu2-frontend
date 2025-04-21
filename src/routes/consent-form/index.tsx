import { uploadFileRequest } from "@/api/actions/auth/auth.requests";
import { MemberType } from "@/api/actions/auth/auth.types";
import { getConsentsQueryOptions } from "@/api/actions/consent/consent.options";
import { createConsentRequest } from "@/api/actions/consent/consent.requests";
import { Consent } from "@/api/actions/consent/consent.types";
import { getPlayersQueryOptions } from "@/api/actions/player/player.options";
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
  guardian_contact_info: z
    .string()
    .min(1, { message: "Guardian contact info is required" }),
  guardian_name: z.string().min(1, { message: "Guardian name is required" }),
  player_id: z.string(),
});

export const Route = createFileRoute("/consent-form/")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const authData = useUserStore((state) => state.authData);
  const { data } = useQuery(getConsentsQueryOptions());
  const { data: players } = useQuery(
    getPlayersQueryOptions({ page: 1, size: 100 })
  );

  const [isCreateTournamentOpen, setIsCreateTournamentOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      guardian_contact_info: "",
      guardian_name: "",
      player_id: undefined,
    },
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync: uploadFile } = useMutation({
    mutationFn: uploadFileRequest,
    onSuccess: (data) => {
      form.setValue("guardian_contact_info", data.url);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      uploadFile(formData);
    }
  };

  const { isPending, mutateAsync: createConsent } = useMutation({
    mutationFn: createConsentRequest,
    onSettled: () => {
      queryClient.invalidateQueries(getConsentsQueryOptions());
    },
    onSuccess: () => {
      toast.success("Tournament created successfully");
      setIsCreateTournamentOpen(false);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createConsent({
      ...data,
      player_id: parseInt(data.player_id),
    } as unknown as Consent);
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
                  name="guardian_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guardian Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="pls enter your guardian name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guardian_contact_info"
                  render={() => (
                    <FormItem>
                      <FormLabel>Guardian Contact Info</FormLabel>
                      <FormControl>
                        <Input
                          accept="application/pdf"
                          disabled={isPending}
                          onChange={handleFileChange}
                          placeholder="pls enter your guardian contact info"
                          type="file"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="player_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value?.toString()}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select player" />
                          </SelectTrigger>
                          <SelectContent>
                            {players?.data.map((player) => (
                              <SelectItem
                                key={player.player_id}
                                value={player.player_id.toString()}
                              >
                                {player.member.name}
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
