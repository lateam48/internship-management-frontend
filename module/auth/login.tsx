"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useState} from "react";

const LoginSchema = z.object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {email: "", password: ""}
    });

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function onSubmit(data: z.infer<typeof LoginSchema>) {
        setLoading(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                ...data,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            if (result?.ok) {
                router.push("/dashboard");
            }
        } catch (error: any) {
            toast.error("Authentication Failed", {
                description: error.message ?? "Invalid credentials",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="h-screen grid place-content-center md:max-w-md w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="admin@admin.com"
                                        {...field}
                                        disabled={loading}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        {...field}
                                        disabled={loading}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </Form>
        </section>
    );
}