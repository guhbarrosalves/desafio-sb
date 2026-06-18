'use client'

import { useEffect, useState } from 'react'

type Membro = {
  id: number
  nome: string
  cargo: string
}

type Props = {
  onSelecionar: (membro: Membro) => void
}

export default function SeletorUsuario({ onSelecionar }: Props) {
  const [membros, setMembros] = useState<Membro[]>([])

  useEffect(() => {
    fetch('/api/membros')
      .then(res => res.json())
      .then(data => setMembros(data))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo</h1>
        <p className="text-gray-500 mb-6">Quem é você?</p>
        <div className="flex flex-col gap-2">
          {membros.map(membro => (
            <button
              key={membro.id}
              onClick={() => onSelecionar(membro)}
              className="text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <p className="font-medium text-gray-800">{membro.nome}</p>
              <p className="text-sm text-gray-500">{membro.cargo}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}