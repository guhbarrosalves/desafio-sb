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
      .then(setMembros)
  }, [])

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="mb-6">
        <a href="/" className="text-sm text-blue-500 hover:underline">{'< Voltar'}</a>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">Funcionarios</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {membros.map(membro => {
          const ativos = membro.cartoes.filter(c => c.status !== 'done')
          const concluidos = membro.cartoes.filter(c => c.status === 'done')

          return (
            <div key={membro.id} className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold text-gray-800">{membro.nome}</h2>
              <p className="text-sm text-gray-500 mb-3">{membro.cargo}</p>

              <div className="mb-3">
                <h3 className="text-xs font-medium text-gray-400 uppercase mb-1">Ativos ({ativos.length})</h3>
                {ativos.length === 0 && <p className="text-sm text-gray-400">Nenhum cartao ativo</p>}
                {ativos.map(c => (
                  <p key={c.id} className="text-sm text-gray-700">{c.titulo}</p>
                ))}
              </div>

              <div>
                <h3 className="text-xs font-medium text-gray-400 uppercase mb-1">Concluidos ({concluidos.length})</h3>
                {concluidos.length === 0 && <p className="text-sm text-gray-400">Nenhum cartao concluido</p>}
                {concluidos.map(c => (
                  <p key={c.id} className="text-sm text-gray-700">{c.titulo}</p>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}