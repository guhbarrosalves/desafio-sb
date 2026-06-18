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

type Projeto = {
  id: number
  nome: string
}

export default function Home() {
  const [usuario, setUsuario] = useState<Membro | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [recarregar, setRecarregar] = useState(0)
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [projetoAtivo, setProjetoAtivo] = useState<number | null>(null)

  useEffect(() => {
    const salvo = localStorage.getItem('usuario')
    if (salvo) setUsuario(JSON.parse(salvo))
  }, [])

  useEffect(() => {
    fetch('/api/projetos')
      .then(res => res.json())
      .then(data => {
        setProjetos(data)
        if (data.length > 0) setProjetoAtivo(data[0].id)
      })
  }, [recarregar])

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
        {modalAberto && projetoAtivo && (
          <ModalNovoCartao
            onFechar={() => setModalAberto(false)}
            onCriado={handleCriado}
            projetoId={projetoAtivo}
          />
        )}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Painel do Time</h1>
            <div className="flex gap-4 mt-1">
              <a href="/funcionarios" className="text-sm text-blue-500 hover:underline">Funcionarios</a>
            </div>
          </div>
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
        <div className="flex gap-2 mb-4 mt-6">
          {projetos.map(p => (
            <button
              key={p.id}
              onClick={() => setProjetoAtivo(p.id)}
              className={projetoAtivo === p.id ? 'px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white' : 'px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:border-blue-400'}
            >
              {p.nome}
            </button>
          ))}
        </div>
        {projetoAtivo && <KanbanBoard key={recarregar + '-' + projetoAtivo} projetoId={projetoAtivo} />}
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
