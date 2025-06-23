export function TeacherConventionsStats({ pendingCount, validatedCount }: { pendingCount: number; validatedCount: number }) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="bg-yellow-100 dark:bg-yellow-900 rounded px-4 py-2 text-yellow-800 dark:text-yellow-200 font-semibold">
        En attente: {pendingCount}
      </div>
      <div className="bg-blue-100 dark:bg-blue-900 rounded px-4 py-2 text-blue-800 dark:text-blue-200 font-semibold">
        Validées: {validatedCount}
      </div>
    </div>
  )
} 