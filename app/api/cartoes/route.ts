import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET() {
  const cartoes = await prisma.cartao.findMany({
    include: {
      membro: true,
      projeto: true,
    },
  })

  return NextResponse.json(cartoes)
}

export async function POST(request: Request) {
  const body = await request.json()

  const cartao = await prisma.cartao.create({
    data: {
      titulo: body.titulo,
      descricao: body.descricao,
      status: body.status ?? 'todo',
      projetoId: body.projetoId,
      membroId: body.membroId ?? null,
    },
  })

  return NextResponse.json(cartao, { status: 201 })
}