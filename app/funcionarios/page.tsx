'use client'

import { useEffect, useState } from 'react'

type Cartao = {
  id: number
  titulo: string
  status: string
}

type Membro = {
  id: number
  nome: string
  cargo: string
  cartoes: Cartao[]
}

export default function Funcionarios() {
  const [membros, setMembros] = useState<Membro[]>([])

  useEffect(() => {
    fetch('/api/membros')
      .then(res => res.json())
      .then(data => setMembros(data))
  }, [])

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <a href="/" className="text-sm text-blue-600 hover:underline mb-6 block">
        ← Voltar ao painel
      </a>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Funcionários
      </h1>
      <div className="grid grid-cols-2 gap-4">
        {membros.map(membro => {
          const ativos = membro.cartoes.filter(c => c.status !== 'done')
          const concluidos = membro.cartoes.filter(c => c.status === 'done')

          return (
            <div key={membro.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{membro.nome}</p>
                  <p className="text-sm text-gray-500">{membro.cargo}</p>
                </div>
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {ativos.length} ativo{ativos.length !== 1 ? 's' : ''}
                </span>
              </div>

              {ativos.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-400 uppercase mb-1">Em andamento</p>
                  {ativos.map(c => (
                    <p key={c.id} className="text-sm text-gray-700 py-1 border-b border-gray-50 last:border-0">
                      {c.titulo}
                    </p>
                  ))}
                </div>
              )}

              {concluidos.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase mb-1">Concluídos</p>
                  {concluidos.map(c => (
                    <p key={c.id} className="text-sm text-gray-400 line-through py-1">
                      {c.titulo}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}