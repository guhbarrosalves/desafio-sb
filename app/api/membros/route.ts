import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET() {
  const membros = await prisma.membro.findMany({
    include: {
      cartoes: true, // traz os cartões de cada membro junto
    },
  })

  return NextResponse.json(membros)
}