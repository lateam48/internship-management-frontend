"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { Sector } from "@/types"

export function AdminSectorsStats({ sectors }: { sectors: Sector[] | undefined }) {
  return (
    <Card className="mb-8 rounded-lg shadow-md border border-border dark:border-border">
      <CardContent className="p-6 flex items-center">
        <div className="p-3 rounded-full bg-accent flex items-center justify-center">
          <Building2 className="h-7 w-7 text-primary" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-muted-foreground">Total des secteurs</p>
          <p className="text-3xl font-extrabold text-foreground">{sectors?.length || 0}</p>
        </div>
      </CardContent>
    </Card>
  )
} 