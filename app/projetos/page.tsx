'use client'

import { useEffect, useState } from 'react'
import ModalNovoCartao from '@/app/components/ModalNovoCartao'

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
  const [modalAberto, setModalAberto] = useState(false)
  const [recarregar, setRecarregar] = useState(0)

  useEffect(() => {
    fetch('/api/projetos')
      .then(res => res.json())
      .then(data => setProjetos(data))
  }, [recarregar])

  function handleCriado() {
    setRecarregar(r => r + 1)
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      {modalAberto && (
        <ModalNovoCartao
          onFechar={() => setModalAberto(false)}
          onCriado={handleCriado}
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <div>
          <a href="/" className="text-sm text-blue-600 hover:underline block mb-1">← Voltar ao painel</a>
          <h1 className="text-2xl font-bold text-gray-800">Projetos</h1>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          + Novo cartao
        </button>
      </div>
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
                <span className={diasRestantes <= 30 ? 'text-sm px-3 py-1 rounded-full font-medium bg-red-100 text-red-700' : 'text-sm px-3 py-1 rounded-full font-medium bg-green-100 text-green-700'}>
                  {diasRestantes} dias restantes
                </span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Progresso</span>
                  <span>{concluidos}/{total} cartoes — {progresso}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: progresso + '%' }} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {projeto.cartoes.map(cartao => (
                  <div key={cartao.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className={cartao.status === 'done' ? 'text-sm font-medium line-through text-gray-400' : 'text-sm font-medium text-gray-700'}>
                        {cartao.titulo}
                      </p>
                      {cartao.membro && <p className="text-xs text-gray-400">{cartao.membro.nome}</p>}
                    </div>
                    <span className={cartao.status === 'done' ? 'text-xs px-2 py-1 rounded-full bg-green-100 text-green-700' : cartao.status === 'doing' ? 'text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700' : 'text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500'}>
                      {cartao.status === 'done' ? 'Concluido' : cartao.status === 'doing' ? 'Em andamento' : 'A fazer'}
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
