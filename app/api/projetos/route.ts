import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET() {
  const projetos = await prisma.projeto.findMany({
    include: {
      cartoes: {
        include: {
          membro: true,
        },
      },
    },
  })

  return NextResponse.json(projetos)
}