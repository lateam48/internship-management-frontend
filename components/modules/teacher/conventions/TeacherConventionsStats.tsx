interface TeacherConventionsStatsProps {
  pendingCount: number
  validatedCount: number
  approvedCount: number
  rejectedCount: number
  totalCount: number
}

export function TeacherConventionsStats({ 
  pendingCount, 
  validatedCount, 
  approvedCount,
  rejectedCount, 
  totalCount 
}: TeacherConventionsStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
      </div>
      <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">En attente</div>
      </div>
      <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-blue-600">{validatedCount}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Validées</div>
      </div>
      <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Approuvées</div>
      </div>
      <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Rejetées</div>
      </div>
    </div>
  )
} 