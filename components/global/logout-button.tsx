"use client"
import { Button } from "@/components/ui/button";
import {signOut} from "next-auth/react";

export function LogoutButton() {
    return (
        <Button onClick={() => signOut({redirectTo : "/login"})}>
            Logout
        </Button>
    )
}