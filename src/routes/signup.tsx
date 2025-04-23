import { registerRequest } from "@/api/actions/auth/auth.requests";
import { MemberType } from "@/api/actions/auth/auth.types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { LoaderCircle, PartyPopper } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
});

const formSchema = z
  .object({
    confirmPassword: z.string().min(6, "pls enter a valid password"),
    contact_info: z.string().optional(),
    date_of_birth: z.string().optional(),
    email: z.string().email("pls enter a valid email"),
    member_type: z.enum([
      MemberType.COACH,
      MemberType.PLAYER,
      MemberType.MEMBER,
    ]),
    name: z.string().min(1, "pls enter your name"),
    password: z.string().min(6, "pls enter a valid password"),
    phone: z.string().optional(),
    position: z.string().optional(),
    skill_level: z.string().optional(),
    team_name: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

function RouteComponent() {
  const { setAuthData } = useUserStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      confirmPassword: "",
      contact_info: "",
      email: "",
      member_type: MemberType.MEMBER,
      name: "",
      password: "",
      phone: "",
      position: "",
      skill_level: "",
      team_name: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { isPending, mutateAsync } = useMutation({
    mutationFn: registerRequest,
    onError: () => {
      toast.error("Signup failed");
    },
    onSuccess: (data) => {
      setAuthData(data);
      toast.success("Signup successful");
      router.navigate({ to: "/" });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...rest } = values;
    mutateAsync(rest);
  };

  return (
    <div className="max-w-sm mx-auto flex flex-col gap-4 justify-center">
      <div className="flex flex-col items-center pb-6">
        <PartyPopper size={40} />
        <p className="text-xl font-medium">Welcome</p>
        <p className="text-small text-default-500">
          Create an account to continue
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="pls enter your name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
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

          <FormField
            control={form.control}
            name="contact_info"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Info</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="pls enter your contact info"
                    {...field}
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="pls enter your phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="pls enter your date of birth"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="member_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Member Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={MemberType.COACH}>Coach</SelectItem>
                      <SelectItem value={MemberType.PLAYER}>Player</SelectItem>
                      <SelectItem value={MemberType.MEMBER}>Member</SelectItem>
                      <SelectItem value={MemberType.CHAIRMAN}>
                        Chairman
                      </SelectItem>
                      <SelectItem value={MemberType.EVENT_ASSISTANT}>
                        Event Assistant
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="pls enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="pls enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="pls confirm your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full items-center justify-between px-1 py-2">
            <div className="flex items-center space-x-2">
              <Checkbox disabled={isPending} id="terms" />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="terms"
              >
                I agree to the terms and conditions
              </label>
            </div>
          </div>

          <Button
            className="w-full"
            color="primary"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </Form>

      {/* <div className="flex items-center gap-4 py-2">
        <hr className="flex-1" />
        <p className="shrink-0 text-tiny text-default-500">OR</p>
        <hr className="flex-1" />
      </div>

      <div className="flex flex-col gap-2">
        <Button disabled={isPending} variant="outline">
          <Facebook size={24} />
          Continue with Facebook
        </Button>
        <Button disabled={isPending} variant="outline">
          <Github size={24} />
          Continue with Github
        </Button>
      </div> */}

      <p className="text-center text-sm">
        Need to create an account?&nbsp;
        <Link className="text-primary" to="/signin">
          Sign In
        </Link>
      </p>
    </div>
  );
}
