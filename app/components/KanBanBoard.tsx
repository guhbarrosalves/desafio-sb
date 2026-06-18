'use client'

import { useEffect, useState } from 'react'

type Membro = {
  id: number
  nome: string
}

type Cartao = {
  id: number
  titulo: string
  descricao: string | null
  status: string
  iniciadoEm: string | null
  membro: Membro | null
  projetoId: number
}

type Props = {
  projetoId: number
  key?: number
}

function formatTempoRelativo(dataIso: string): string {
  const data = new Date(dataIso)
  const agora = new Date()
  const diffMs = agora.getTime() - data.getTime()

  const diffMin = Math.floor(diffMs / (1000 * 60))
  const diffHoras = Math.floor(diffMin / 60)
  const diffDias = Math.floor(diffHoras / 24)

  if (diffDias > 0) return `pego há ${diffDias} ${diffDias === 1 ? 'dia' : 'dias'}`
  if (diffHoras > 0) return `pego há ${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`
  if (diffMin > 0) return `pego há ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`
  return 'pego agora mesmo'
}

export default function KanbanBoard({ projetoId }: Props) {
  const [cartoes, setCartoes] = useState<Cartao[]>([])

  useEffect(() => {
    fetch('/api/cartoes')
      .then(res => res.json())
      .then(data => setCartoes(data.filter((c: Cartao) => c.projetoId === projetoId)))
  }, [projetoId])

  const todo  = cartoes.filter(c => c.status === 'todo')
  const doing = cartoes.filter(c => c.status === 'doing')
  const done  = cartoes.filter(c => c.status === 'done')

  const colunas = [
    { label: 'A fazer',      cor: 'bg-gray-200',  cartoes: todo  },
    { label: 'Em andamento', cor: 'bg-blue-100',  cartoes: doing },
    { label: 'Concluido',    cor: 'bg-green-100', cartoes: done  },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {colunas.map(coluna => (
        <div key={coluna.label} className={'rounded-lg p-4 ' + coluna.cor}>
          <h2 className="font-semibold text-gray-700 mb-3">{coluna.label}</h2>
          <div className="flex flex-col gap-2">
            {coluna.cartoes.map(cartao => (
              <div key={cartao.id} className="bg-white rounded p-3 shadow-sm">
                <p className="font-medium text-gray-800">{cartao.titulo}</p>
                {cartao.membro && (
                  <p className="text-sm text-gray-500 mt-1">{cartao.membro.nome}</p>
                )}
                {cartao.iniciadoEm && (
                  <p className="text-xs text-gray-400 mt-1">{formatTempoRelativo(cartao.iniciadoEm)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}