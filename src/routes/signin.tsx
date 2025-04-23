import { loginRequest } from "@/api/actions/auth/auth.requests";
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
import { useUserStore } from "@/stores/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { LoaderCircle, PartyPopper } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/signin")({
  component: SignInPage,
});

const formSchema = z.object({
  email: z.string().email("pls enter a valid email"),
  password: z.string().min(6, "pls enter a valid password"),
});

function SignInPage() {
  const { setAuthData } = useUserStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { isPending, mutateAsync } = useMutation({
    mutationFn: loginRequest,
    onError: () => {
      toast.error("Login failed");
    },
    onSuccess: (data) => {
      setAuthData(data);
      toast.success("Login successful");
      router.navigate({ to: "/" });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutateAsync(values);
  };

  return (
    <div className="max-w-sm mx-auto flex flex-col gap-4 justify-center">
      <div className="flex flex-col items-center pb-6">
        <PartyPopper size={40} />
        <p className="text-xl font-medium">Welcome Back</p>
        <p className="text-small text-default-500">
          Log in to your account to continue
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
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

          <div className="flex w-full items-center justify-between px-1 py-2">
            <div className="flex items-center space-x-2">
              <Checkbox disabled={isPending} id="terms" />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="terms"
              >
                Remember me
              </label>
            </div>
            <span className="text-gray-500">Forgot password?</span>
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
                Signing in...
              </>
            ) : (
              "Sign In"
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
        <Link className="text-primary" to="/signup">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
