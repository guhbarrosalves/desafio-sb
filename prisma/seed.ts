import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: './prisma/dev.db' })
const prisma = new PrismaClient({ adapter })
async function main() {

  await prisma.cartao.deleteMany()
  await prisma.projeto.deleteMany()
  await prisma.membro.deleteMany()

  // Cria os 10 membros do time do Ricardo
  
  await prisma.membro.createMany({
    data: [
      { nome: "Ricardo",          cargo: "Gestor"},
      { nome: "João Pedro",       cargo: "Desenvolvedor Frontend Sênior" },
      { nome: "Estevão",          cargo: "Desenvolvedor Backend Sênior" },
      { nome: "Matheus Ferreira", cargo: "Desenvolvedor Frontend Júnior" },
      { nome: "Valentina Alves",  cargo: "Analista de Dados" },
      { nome: "Anitta",           cargo: "UX Designer" },
      { nome: "Bianca Gomes",     cargo: "Desenvolvedora Backend Júnior" },
      { nome: "Vinicius Ferreira",cargo: "Engenheiro de QA" },
      { nome: "Maria Clara",      cargo: "Estagiária de Desenvolvimento" },
      { nome: "Eduardo Henrique", cargo: "DevOps" },
      { nome: "José Roberto",     cargo: "Gerente de Projetos" },
    ],
  })

  // Busca todos os membros criados para pegar os IDs
  // O banco gera os IDs automaticamente (1, 2, 3...)
  
  const membros = await prisma.membro.findMany()

  // Função auxiliar para achar um membro pelo nome
  const m = (nome: string) => membros.find(mb => mb.nome === nome)!

  // Cria 3 projetos fictícios com prazos diferentes
  const projeto1 = await prisma.projeto.create({
    data: {
      nome: "Redesign do Site Institucional",
      prazo: new Date("2026-07-15"), // prazo próximo — urgente
    },
  })

  const projeto2 = await prisma.projeto.create({
    data: {
      nome: "Sistema de Relatórios Internos",
      prazo: new Date("2026-08-30"),
    },
  })

  const projeto3 = await prisma.projeto.create({
    data: {
      nome: "App Mobile de Vendas",
      prazo: new Date("2026-09-20"),
    },
  })

  // Cria os cartões vinculados aos projetos e membros
  // status pode ser: "todo", "doing", "done"
  // iniciadoEm é quando o funcionário pegou o cartão
  await prisma.cartao.createMany({
    data: [
      // Projeto 1 — Redesign do Site
      {
        titulo: "Criar wireframes das páginas",
        descricao: "Desenhar a estrutura das páginas principais",
        status: "done",
        projetoId: projeto1.id,
        membroId: m("Anitta").id,
        iniciadoEm: new Date("2026-06-01"),
      },
      {
        titulo: "Desenvolver página inicial",
        descricao: "Implementar o novo layout em React",
        status: "doing",
        projetoId: projeto1.id,
        membroId: m("João Pedro").id,
        iniciadoEm: new Date("2026-06-05"),
      },
      {
        titulo: "Desenvolver página de contato",
        descricao: "Formulário com validação e envio de e-mail",
        status: "todo",
        projetoId: projeto1.id,
        membroId: m("Matheus Ferreira").id,
        iniciadoEm: null,
      },
      {
        titulo: "Configurar hospedagem",
        descricao: "Deploy na AWS com CI/CD",
        status: "todo",
        projetoId: projeto1.id,
        membroId: m("Eduardo Henrique").id,
        iniciadoEm: null,
      },
      {
        titulo: "Testes de usabilidade",
        descricao: "Validar fluxos com usuários reais",
        status: "todo",
        projetoId: projeto1.id,
        membroId: m("Vinicius Ferreira").id,
        iniciadoEm: null,
      },

      // Projeto 2 — Sistema de Relatórios
      {
        titulo: "Modelar banco de dados",
        descricao: "Definir estrutura das tabelas de relatórios",
        status: "done",
        projetoId: projeto2.id,
        membroId: m("Estevão").id,
        iniciadoEm: new Date("2026-06-03"),
      },
      {
        titulo: "Criar APIs de relatórios",
        descricao: "Endpoints para geração de dados",
        status: "doing",
        projetoId: projeto2.id,
        membroId: m("Bianca Gomes").id,
        iniciadoEm: new Date("2026-06-10"),
      },
      {
        titulo: "Dashboard de visualização",
        descricao: "Gráficos e tabelas para os relatórios",
        status: "todo",
        projetoId: projeto2.id,
        membroId: m("Valentina Alves").id,
        iniciadoEm: null,
      },
      {
        titulo: "Documentação técnica",
        descricao: "Documentar todas as APIs criadas",
        status: "todo",
        projetoId: projeto2.id,
        membroId: m("Maria Clara").id,
        iniciadoEm: null,
      },

      // Projeto 3 — App Mobile
      {
        titulo: "Definir arquitetura do app",
        descricao: "Escolher tecnologias e estrutura do projeto",
        status: "doing",
        projetoId: projeto3.id,
        membroId: m("José Roberto").id,
        iniciadoEm: new Date("2026-06-08"),
      },
      {
        titulo: "Tela de login",
        descricao: "Autenticação com e-mail e senha",
        status: "todo",
        projetoId: projeto3.id,
        membroId: m("João Pedro").id,
        iniciadoEm: null,
      },
      {
        titulo: "Integração com API de vendas",
        descricao: "Conectar app com o backend existente",
        status: "todo",
        projetoId: projeto3.id,
        membroId: m("Estevão").id,
        iniciadoEm: null,
      },
    ],
  })

  console.log("✅ Banco populado com sucesso!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
