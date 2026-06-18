import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const cartao = await prisma.cartao.update({
    where: { id: Number(id) },
    data: {
      status: body.status,
      membroId: body.membroId,
      iniciadoEm: body.iniciadoEm,
    },
  })

  return NextResponse.json(cartao)
}