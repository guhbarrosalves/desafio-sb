import KanbanBoard from '@/app/components/KanBanBoard'
import KpiPanel from '@/app/components/KpiPainel'

export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Painel do Time — Ricardo
      </h1>
      <KpiPanel />
      <KanbanBoard />
    </main>
  )
}