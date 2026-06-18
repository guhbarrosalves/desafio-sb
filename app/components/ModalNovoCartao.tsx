'use client'

import { useEffect, useState } from 'react'

type Membro = {
  id: number
  nome: string
}

type Props = {
  onFechar: () => void
  onCriado: () => void
  projetoId: number
}

export default function ModalNovoCartao({ onFechar, onCriado, projetoId }: Props) {
  const [membros, setMembros] = useState<Membro[]>([])
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [membroId, setMembroId] = useState('')

  useEffect(() => {
    fetch('/api/membros').then(r => r.json()).then(setMembros)
  }, [])

  async function handleCriar() {
    if (!titulo) return

    await fetch('/api/cartoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo,
        descricao,
        projetoId,
        membroId: membroId ? Number(membroId) : null,
      }),
    })

    onCriado()
    onFechar()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Novo cartao</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Titulo do cartao"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400"
          />

          <input
            type="text"
            placeholder="Descricao (opcional)"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400"
          />

          <select
            value={membroId}
            onChange={e => setMembroId(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400"
          >
            <option value="">Sem responsavel (disponivel para todos)</option>
            {membros.map(m => (
              <option key={m.id} value={m.id}>{m.nome}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onFechar} className="text-sm text-gray-500 hover:underline px-3 py-2">
            Cancelar
          </button>
          <button onClick={handleCriar} className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Criar cartao
          </button>
        </div>
      </div>
    </div>
  )
}