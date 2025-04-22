import { updateProfileRequest } from "@/api/actions/auth/auth.requests";
import { MemberType, UpdateProfileArgs } from "@/api/actions/auth/auth.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Save, User } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// import { PlayerFormModal } from "./-components/player-form-modal";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

const formSchema = z.object({
  consent_form_url: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  phone: z.string().optional(),
  player_member_form: z.string().optional(),
});

function ProfilePage() {
  const { authData, setAuthData } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: authData?.user.email || "",
      name: authData?.user.name || "",
      phone: authData?.user.phone || "",
    },
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: (args: UpdateProfileArgs) =>
      updateProfileRequest(authData?.user.id.toString() || "", args),
    onError: () => {
      toast.error("Failed to update profile");
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      setIsEditing(false);

      if (authData) {
        setAuthData({
          ...authData,
          user: {
            ...authData.user,
            ...data,
          },
        });
      }
    },
  });

  const onSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (values: any) => {
      updateProfile({
        ...values,
        consent_form_url: values.consent_form_url || "",
        phone: values.phone || "",
      });
    },
    [updateProfile]
  );

  // const [playerFormOpen, setPlayerFormOpen] = useState(false);

  if (!authData) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login first</h1>
        <p>You need to login to view and edit your personal information</p>
      </div>
    );
  }

  const { user } = authData;
  const isCoach = user.member_type === MemberType.COACH;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://github.com/shadcn.png`} />
                <AvatarFallback className="text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-center mt-4">{user.name}</CardTitle>
            <CardDescription className="text-center">
              {
                MemberType[
                  user.member_type.toUpperCase() as keyof typeof MemberType
                ]
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 opacity-70" />
                <span>ID: {user.id}</span>
              </div>
              {isCoach && (
                <div>
                  <p className="text-sm font-medium mb-1">Team Name</p>
                  <p className="text-sm text-muted-foreground">
                    {user.coach?.team_name || "Not set"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Edit your personal information"
                    : "View and manage your personal information"}
                </CardDescription>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "default" : "outline"}
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled
                          placeholder="Enter your email"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          placeholder="Enter your name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          placeholder="Enter your phone number"
                        />
                      </FormControl>
                      <FormDescription>
                        Used for receiving system notifications and emergency
                        contact
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="consent_form_url"
                  render={() => (
                    <FormItem>
                      <FormLabel> Consent Form</FormLabel>
                      <FormControl>
                        <PlayerFormModal
                          onOpenChange={setPlayerFormOpen}
                          onSubmit={(data) =>
                            onSubmit({
                              player_member_form: JSON.stringify(data),
                            })
                          }
                          open={playerFormOpen}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {isEditing && (
                  <Button className="w-full" type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save changes
                  </Button>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Change Password</h3>
              <p className="text-sm text-muted-foreground">
                Update your password regularly to protect your account
              </p>
            </div>

            <Button variant="outline">Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
