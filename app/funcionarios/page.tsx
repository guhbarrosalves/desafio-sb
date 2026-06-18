'use client'

import { useEffect, useState } from 'react'
import KanbanBoard from '@/app/components/KanBanBoard'
import KpiPanel from '@/app/components/KpiPainel'
import SeletorUsuario from '@/app/components/SeletorUsuario'
import PainelFuncionario from '@/app/components/PainelFuncionario'
import ModalNovoCartao from '@/app/components/ModalNovoCartao'

type Membro = {
  id: number
  nome: string
  cargo: string
}

export default function Home() {
  const [usuario, setUsuario] = useState<Membro | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [recarregar, setRecarregar] = useState(0)

  useEffect(() => {
    const salvo = localStorage.getItem('usuario')
    if (salvo) {
      setUsuario(JSON.parse(salvo))
    }
  }, [])

  function handleSelecionar(membro: Membro) {
    localStorage.setItem('usuario', JSON.stringify(membro))
    setUsuario(membro)
  }

  function handleSair() {
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  function handleCriado() {
    setRecarregar(r => r + 1)
  }

  if (!usuario) {
    return <SeletorUsuario onSelecionar={handleSelecionar} />
  }

  const ehGestor = usuario.cargo === 'Gestor'

  if (ehGestor) {
    return (
      <main className="min-h-screen p-6 bg-gray-50">
        {modalAberto && (
          <ModalNovoCartao
            onFechar={() => setModalAberto(false)}
            onCriado={handleCriado}
          />
        )}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Painel do Time</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setModalAberto(true)}
              className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              + Novo cartao
            </button>
            <span className="text-sm text-gray-500">Ola, <span className="font-medium text-gray-700">{usuario.nome}</span></span>
            <button onClick={handleSair} className="text-sm text-red-500 hover:underline">Sair</button>
          </div>
        </div>
        <KpiPanel key={recarregar} />
        <KanbanBoard key={recarregar + 1000} />
      </main>
    )
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meu Painel</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Ola, <span className="font-medium text-gray-700">{usuario.nome}</span></span>
          <button onClick={handleSair} className="text-sm text-red-500 hover:underline">Sair</button>
        </div>
      </div>
      <PainelFuncionario usuario={usuario} />
    </main>
  )
}
