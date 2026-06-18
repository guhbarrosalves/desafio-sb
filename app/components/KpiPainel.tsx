'use client'

import { useEffect, useState } from 'react'

type Cartao = {
  id: number
  status: string
  iniciadoEm: string | null
  membroId: number | null
}

type Projeto = {
  id: number
  nome: string
  prazo: string
  criadoEm: string
  cartoes: Cartao[]
}

export default function KpiPanel() {
  const [projetos, setProjetos] = useState<Projeto[]>([])

  useEffect(() => {
    fetch('/api/projetos')
      .then(res => res.json())
      .then(data => setProjetos(data))
  }, [])

  // Junta todos os cartões de todos os projetos num array só
  const todosCartoes = projetos.flatMap(p => p.cartoes)

  // KPI 1 — Progresso geral
  const total = todosCartoes.length
  const concluidos = todosCartoes.filter(c => c.status === 'done').length
  const progresso = total > 0 ? Math.round((concluidos / total) * 100) : 0

  // KPI 2 — Cartões ativos (todo + doing)
  const ativos = todosCartoes.filter(c => c.status !== 'done').length

  // KPI 3 — Cartões lentos (em doing há mais de 7 dias)
  const hoje = new Date()
  const lentos = todosCartoes.filter(c => {
    if (c.status !== 'doing' || !c.iniciadoEm) return false
    const dias = (hoje.getTime() - new Date(c.iniciadoEm).getTime()) / (1000 * 60 * 60 * 24)
    return dias > 7
  }).length

  // KPI 4 — Prazo mais próximo
  const prazos = projetos
    .map(p => ({ nome: p.nome, prazo: new Date(p.prazo) }))
    .sort((a, b) => a.prazo.getTime() - b.prazo.getTime())
  const proximoPrazo = prazos[0]

  const kpis = [
    { label: 'Progresso geral',   valor: `${progresso}%`,         cor: 'bg-blue-50  border-blue-200'   },
    { label: 'Cartões ativos',    valor: `${ativos}`,             cor: 'bg-yellow-50 border-yellow-200' },
    { label: 'Cartões lentos',    valor: `${lentos}`,             cor: 'bg-red-50    border-red-200'    },
    { label: 'Prazo mais próximo',valor: proximoPrazo ? `${proximoPrazo.nome} — ${proximoPrazo.prazo.toLocaleDateString('pt-BR')}` : '—', cor: 'bg-green-50 border-green-200' },
  ]

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {kpis.map(kpi => (
        <div key={kpi.label} className={`rounded-lg border p-4 ${kpi.cor}`}>
          <p className="text-sm text-gray-500">{kpi.label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{kpi.valor}</p>
        </div>
      ))}
    </div>
  )
}