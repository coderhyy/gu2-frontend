import { uploadFileRequest } from "@/api/actions/auth/auth.requests";
import { MemberType } from "@/api/actions/auth/auth.types";
import { getConsentsQueryOptions } from "@/api/actions/consent/consent.options";
import {
  deleteConsentRequest,
  updateConsentRequest,
} from "@/api/actions/consent/consent.requests";
import { Consent } from "@/api/actions/consent/consent.types";
import { getPlayersQueryOptions } from "@/api/actions/player/player.options";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { ArrowLeftIcon, ArrowRightIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "sonner";
import { z } from "zod";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const formSchema = z.object({
  consent_signed: z.boolean().optional(),
  guardian_contact_info: z.string(),
  guardian_name: z.string(),
  player_id: z.string(),
  signed_date: z.date().optional(),
});

function EditTrainingCell({ consent }: { consent: Consent }) {
  const queryClient = useQueryClient();
  const authData = useUserStore((state) => state.authData);
  const { data: players } = useQuery(
    getPlayersQueryOptions({ page: 1, size: 100 })
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: Consent) =>
      updateConsentRequest(consent.consent_id.toString(), data),
    onSuccess: () => {
      toast.success("Consent updated successfully");
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: getConsentsQueryOptions().queryKey,
      });
    },
  });

  const { isPending: isDeletePending, mutateAsync: mutateDelete } = useMutation(
    {
      mutationFn: () => deleteConsentRequest(consent.consent_id.toString()),
      onError: () => {
        toast.error("Failed to delete consent");
      },
      onSuccess: () => {
        toast.success("Consent deleted successfully");
        setIsDeleteOpen(false);
        queryClient.invalidateQueries({
          queryKey: getConsentsQueryOptions().queryKey,
        });
      },
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      consent_signed: consent.consent_signed === 1 ? true : false,
      guardian_contact_info: consent.guardian_contact_info,
      guardian_name: consent.guardian_name,
      player_id: consent.player.player_id.toString(),
      signed_date: consent.signed_date
        ? new Date(consent.signed_date)
        : undefined,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutateAsync({
      ...data,
      player_id: parseInt(data.player_id),
    } as unknown as Consent);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (error: any) => {
    console.error(error);
  };

  const [isAgreeOpen, setIsAgreeOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log(numPages);

    setNumPages(numPages);
  };

  return (
    <div className="flex gap-2">
      {(authData?.user.member_type === MemberType.ADMIN ||
        authData?.user.member_type === MemberType.COACH) && (
        <>
          <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit</Button>
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
                <Button
                  onClick={() => setIsDeleteOpen(false)}
                  variant="outline"
                >
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
        </>
      )}

      {(authData?.user.member_type === MemberType.PLAYER ||
        authData?.user.member_type === MemberType.MEMBER) && (
        <Dialog onOpenChange={setIsAgreeOpen} open={isAgreeOpen}>
          <DialogTrigger asChild>
            <Button disabled={consent.consent_signed === 1} variant="outline">
              view
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-fit">
            <DialogHeader>
              <DialogTitle>Consent Form</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <Document
              file={
                import.meta.env.VITE_API_BASE_URL +
                consent.guardian_contact_info
              }
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page className="w-full" pageNumber={pageNumber} width={600} />
              <div className="flex justify-between items-center mt-2">
                <p>
                  Page {pageNumber} of {numPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    disabled={pageNumber === 1}
                    onClick={() => setPageNumber(pageNumber - 1)}
                    size="sm"
                  >
                    <ArrowLeftIcon />
                  </Button>
                  <Button
                    disabled={pageNumber === numPages}
                    onClick={() => setPageNumber(pageNumber + 1)}
                    size="sm"
                  >
                    <ArrowRightIcon />
                  </Button>
                </div>
              </div>
            </Document>

            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button
                onClick={async () => {
                  await mutateAsync({
                    consent_signed: true,
                    signed_date: new Date().toISOString(),
                  } as unknown as Consent);
                  setIsAgreeOpen(false);
                }}
                type="button"
              >
                Agree
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export const columns: ColumnDef<Consent>[] = [
  {
    accessorKey: "player.member.name",
    header: "Player",
  },
  {
    accessorKey: "guardian_name",
    header: "Guardian Name",
  },
  {
    accessorKey: "consent_signed",
    cell: ({ row }) => {
      const consent = row.original;
      return (
        <Badge variant={consent.consent_signed ? "default" : "outline"}>
          {consent.consent_signed ? "Yes" : "No"}
        </Badge>
      );
    },
    header: "Consent Signed",
  },
  {
    accessorKey: "signed_date",
    cell: ({ row }) => {
      const consent = row.original;
      return consent.signed_date
        ? format(new Date(consent.signed_date), "PPP")
        : "N/A";
    },
    header: "Signed Date",
  },
  {
    cell: ({ row }) => {
      const consent = row.original;
      return <EditTrainingCell consent={consent} />;
    },

    header: "Actions",
    id: "actions",
  },
];
