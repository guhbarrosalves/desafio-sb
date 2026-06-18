'use client'

import { useEffect, useState } from 'react'

type Membro = {
  id: number
  nome: string
  cargo: string
}

type Cartao = {
  id: number
  titulo: string
  descricao: string | null
  status: string
  iniciadoEm: string | null
  membroId: number | null
  membro: Membro | null
  projeto: { nome: string }
}

type Props = {
  usuario: Membro
}

export default function PainelFuncionario({ usuario }: Props) {
  const [cartoes, setCartoes] = useState<Cartao[]>([])

  useEffect(() => {
    fetch('/api/cartoes')
      .then(res => res.json())
      .then(data => setCartoes(data))
  }, [])

  const meusCartoes = cartoes.filter(c => c.membroId === usuario.id)
  const disponiveis = cartoes.filter(c => c.membroId === null && c.status !== 'done')

  async function pegarCartao(cartaoId: number) {
    await fetch(`/api/cartoes/${cartaoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        membroId: usuario.id,
        status: 'doing',
        iniciadoEm: new Date().toISOString(),
      }),
    })
    const res = await fetch('/api/cartoes')
    const data = await res.json()
    setCartoes(data)
  }

  async function concluirCartao(cartaoId: number) {
    await fetch(`/api/cartoes/${cartaoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'done' }),
    })
    const res = await fetch('/api/cartoes')
    const data = await res.json()
    setCartoes(data)
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Meus cartões</h2>
        {meusCartoes.length === 0 ? (
          <p className="text-gray-400 text-sm">Você não tem cartões ainda. Pegue um abaixo!</p>
        ) : (
          <div className="flex flex-col gap-2">
            {meusCartoes.map(cartao => (
              <div key={cartao.id} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{cartao.titulo}</p>
                  <p className="text-sm text-gray-400">{cartao.projeto.nome}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    cartao.status === 'done'  ? 'bg-green-100 text-green-700' :
                    cartao.status === 'doing' ? 'bg-blue-100  text-blue-700'  :
                                                'bg-gray-100  text-gray-500'
                  }`}>
                    {cartao.status === 'done' ? 'Concluído' : cartao.status === 'doing' ? 'Em andamento' : 'A fazer'}
                  </span>
                  {cartao.status !== 'done' && (
                    <button
                      onClick={() => concluirCartao(cartao.id)}
                      className="text-xs text-green-600 hover:underline"
                    >
                      Concluir
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Cartões disponíveis</h2>
        {disponiveis.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhum cartão disponível no momento.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {disponiveis.map(cartao => (
              <div key={cartao.id} className="bg-white border border-dashed border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{cartao.titulo}</p>
                  <p className="text-sm text-gray-400">{cartao.projeto.nome}</p>
                </div>
                <button
                  onClick={() => pegarCartao(cartao.id)}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Pegar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}