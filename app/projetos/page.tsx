'use client'

import { useEffect, useState } from 'react'

type Cartao = {
  id: number
  titulo: string
  status: string
  iniciadoEm: string | null
  membro: { nome: string } | null
}

type Projeto = {
  id: number
  nome: string
  prazo: string
  criadoEm: string
  cartoes: Cartao[]
}

export default function ProjetoPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([])

  useEffect(() => {
    fetch('/api/projetos')
      .then(res => res.json())
      .then(data => setProjetos(data))
  }, [])

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <a href="/" className="text-sm text-blue-600 hover:underline mb-6 block">
        ← Voltar ao painel
      </a>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Projetos
      </h1>
      <div className="flex flex-col gap-6">
        {projetos.map(projeto => {
          const total = projeto.cartoes.length
          const concluidos = projeto.cartoes.filter(c => c.status === 'done').length
          const progresso = total > 0 ? Math.round((concluidos / total) * 100) : 0
          const prazo = new Date(projeto.prazo)
          const hoje = new Date()
          const diasRestantes = Math.ceil((prazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))

          return (
            <div key={projeto.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-800">{projeto.nome}</h2>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${diasRestantes <= 30 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {diasRestantes} dias restantes
                </span>
              </div>

              {/* Barra de progresso */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Progresso</span>
                  <span>{concluidos}/{total} cartões — {progresso}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${progresso}%` }}
                  />
                </div>
              </div>

              {/* Lista de cartões */}
              <div className="flex flex-col gap-2">
                {projeto.cartoes.map(cartao => (
                  <div key={cartao.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className={`text-sm font-medium ${cartao.status === 'done' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {cartao.titulo}
                      </p>
                      {cartao.membro && (
                        <p className="text-xs text-gray-400">{cartao.membro.nome}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      cartao.status === 'done'  ? 'bg-green-100 text-green-700' :
                      cartao.status === 'doing' ? 'bg-blue-100  text-blue-700'  :
                                                  'bg-gray-100  text-gray-500'
                    }`}>
                      {cartao.status === 'done' ? 'Concluído' : cartao.status === 'doing' ? 'Em andamento' : 'A fazer'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}