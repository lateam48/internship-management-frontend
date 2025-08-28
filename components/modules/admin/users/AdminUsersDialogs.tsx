"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { User, UserRole } from "@/types"
import type { CreateUserMutation, UpdateUserMutation, DeleteUserMutation } from "@/types/user"
import { SubmitButton } from "@/components/global"

const userFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["ADMIN", "TEACHER", "COMPANY", "STUDENT"]),
  sectorId: z.number({ required_error: "Sector is required" }),
})
type UserFormValues = z.infer<typeof userFormSchema>

interface AdminUsersCreateDialogProps {
  isOpen: boolean
  onClose: () => void
  createUserMutation: CreateUserMutation
  sectors: { id: number; name: string }[]
}

export function AdminUsersCreateDialog({ isOpen, onClose, createUserMutation, sectors }: AdminUsersCreateDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      role: "STUDENT",
    },
  })

  const onSubmit = async (values: UserFormValues) => {
    try {
      await createUserMutation.mutateAsync({ data: values })
      toast.success("User created successfully")
      onClose()
      form.reset()
    } catch {
      toast.error("Failed to create user")
    }
  }

  useEffect(() => {
    if (!isOpen) form.reset()
  }, [isOpen, form])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Add a new user to the system.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")}/>
            {form.formState.errors.email && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" {...form.register("firstName")}/>
            {form.formState.errors.firstName && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" {...form.register("lastName")}/>
            {form.formState.errors.lastName && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.lastName.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input id="username" {...form.register("username")}/>
            {form.formState.errors.username && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.username.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...form.register("password")}/>
            {form.formState.errors.password && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <Select value={form.watch("role")} onValueChange={val => form.setValue("role", val as UserRole)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="TEACHER">Teacher</SelectItem>
                <SelectItem value="COMPANY">Company</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.role && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.role.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="sector">Sector</Label>
            <Select
              value={String(form.watch("sectorId") ?? "")}
              onValueChange={val => form.setValue("sectorId", Number(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map(sector => (
                  <SelectItem key={sector.id} value={String(sector.id)}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.sectorId && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.sectorId.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <SubmitButton loading={createUserMutation.isPending} label="Create User" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface AdminUsersEditDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  updateUserMutation: UpdateUserMutation
  sectors: { id: number; name: string }[]
}

export function AdminUsersEditDialog({ isOpen, onClose, user, updateUserMutation, sectors }: AdminUsersEditDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      username: user?.username ?? "",
      password: "",
      role: user?.role ?? "STUDENT",
    },
  })

  useEffect(() => {
    if (user && isOpen) {
      form.reset({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: "",
        role: user.role,
        sectorId: user.sector?.id,
      })
    }
    if (!isOpen) form.reset()
  }, [user, isOpen, form])

  const currentValues = form.watch()
  const hasChanges = user && (
    currentValues.email !== user.email ||
    currentValues.firstName !== user.firstName ||
    currentValues.lastName !== user.lastName ||
    currentValues.username !== user.username ||
    currentValues.role !== user.role ||
    currentValues.sectorId !== user.sector?.id ||
    (currentValues.password && currentValues.password.length > 0)
  )

  const onSubmit = async (values: UserFormValues) => {
    if (!user) return
    try {
      await updateUserMutation.mutateAsync({ id: user.id, data: values })
      toast.success("User updated successfully")
      onClose()
    } catch {
      toast.error("Failed to update user")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" type="email" {...form.register("email")}/>
            {form.formState.errors.email && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="edit-firstName">First Name</Label>
            <Input id="edit-firstName" {...form.register("firstName")}/>
            {form.formState.errors.firstName && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="edit-lastName">Last Name</Label>
            <Input id="edit-lastName" {...form.register("lastName")}/>
            {form.formState.errors.lastName && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.lastName.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="edit-username">Username</Label>
            <Input id="edit-username" {...form.register("username")}/>
            {form.formState.errors.username && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.username.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="edit-password">Password</Label>
            <Input id="edit-password" type="password" {...form.register("password")}/>
            {form.formState.errors.password && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="edit-role">Role</Label>
            <Select value={form.watch("role")} onValueChange={val => form.setValue("role", val as UserRole)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="TEACHER">Teacher</SelectItem>
                <SelectItem value="COMPANY">Company</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.role && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.role.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="edit-sector">Sector</Label>
            <Select
              value={String(form.watch("sectorId") ?? "")}
              onValueChange={val => form.setValue("sectorId", Number(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map(sector => (
                  <SelectItem key={sector.id} value={String(sector.id)}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.sectorId && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.sectorId.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <SubmitButton 
              loading={updateUserMutation.isPending} 
              label="Update User" 
              disabled={!hasChanges}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface AdminUsersDeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  deleteUserMutation: DeleteUserMutation
}

export function AdminUsersDeleteDialog({ isOpen, onClose, user, deleteUserMutation }: AdminUsersDeleteDialogProps) {
  const handleDelete = async () => {
    if (!user) return
    try {
      await deleteUserMutation.mutateAsync(user.id)
      toast.success("User deleted successfully")
      onClose()
    } catch {
      toast.error("Failed to delete user")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {user?.firstName} {user?.lastName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <SubmitButton btnType="button" variant={"destructive"} onClick={handleDelete} loading={deleteUserMutation.isPending} label="Delete User" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 