"use client"

interface CompanyConventionsHeaderProps {
  count: number
}

export function CompanyConventionsHeader({ count }: Readonly<CompanyConventionsHeaderProps>) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground">Conventions de stage</h1>
      <p className="mt-2 text-muted-foreground">
        Gérez vos conventions de stage ({count} convention{count !== 1 ? "s" : ""})
      </p>
    </div>
  )
}