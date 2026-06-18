# Gestão de Atividades — Quatro5

Ferramenta de gestão de atividades para o time do Ricardo, dono de uma empresa com 10 pessoas. Resolve a dispersão de tarefas entre planilha, papel e WhatsApp, dando visibilidade do que está em andamento, quem está sobrecarregado e quais prazos estão em risco.

## Stack

- Next.js 16 (App Router)
- TypeScript
- SQLite + Prisma 7 (adapter `@prisma/adapter-better-sqlite3`)
- Tailwind CSS 4
- Node.js v20

## Como rodar

```bash
# instalar dependências
npm install

# gerar o client do Prisma
npx prisma generate

# criar o banco e aplicar as migrations
npx prisma migrate dev

# popular o banco com dados de exemplo (10 funcionários + Ricardo, 3 projetos, cartões em diferentes status)
npx prisma db seed

# rodar a aplicação
npm run dev
```

Acesse `http://localhost:3000`. Na tela inicial, selecione um nome na lista — escolha **Ricardo** para ver o painel de gestão completo, ou qualquer outro nome para ver o painel de funcionário.

## Metodologia escolhida: Kanban puro

Optei por Kanban puro, pelo fato de corresponder a todas as dores de Ricardo.

“O trabalho do time vive espalhado em planilha, papel e grupo de WhatsApp. Eu nunca sei o que está em
andamento de verdade.”

Cada projeto agora possui um Kanban próprio facilitando a organização do que deve ser feito unicamente em um só lugar.

“Tem gente afogada de tarefa e gente ociosa — e eu só descubro quando alguém reclama ou quando algo
não sai.”

Agora, todas as tarefas ficam visiveis a partir do segmento que estão (to do, doing e done) e o seu responsável direto. Dessa forma, Ricardo consegue ver quem está mais atarefado e quem está ocioso.

“Prazo combinado com cliente estoura e eu só fico sabendo depois que estourou. Ninguém me avisa antes.”

Agora, o projeto com o prazo mais curto fica em destaque no site e a partir disso, Ricardo consegue acelerar o desenvolvimento do projeto, se o prazo for curto, através de uma reunião com seus funcionários. 

“Na reunião de segunda-feira ninguém tem número nenhum. A conversa é toda baseada em ‘acho que foi
uma boa semana’.

Nesse projeto, Ricardo consegue ver quanto um projeto avançou através do destaque que mostra o progresso de cada projeto quando se anda pelas abas disponíveis. Dessa forma, as reuniões agora podem ser conduzidas por números, trazendo mais clareza se a semana foi boa ou não.

## Indicadores (KPIs)

**Progresso geral (%).** Mostra quanto do projeto já foi concluído. Decisão: na reunião de segunda, Ricardo sabe se o projeto está no ritmo esperado sem precisar perguntar pessoa por pessoa.

**Cartões ativos.** Conta quantos cartões estão em "to do " ou "doing" no momento. Decisão: ajuda Ricardo a perceber se o time como um todo está sobrecarregado (muitos cartões ativos) ou ocioso (poucos), sem depender de alguém reclamar.

**Cartões lentos (mais de 7 dias em "doing").** Identifica há quanto tempo um funcionário recebeu/pegou um cartão em dias/horas/minutos e se ele está lento quanto ao desenvolvimento. Decisão: Assim, ele consegue compreender com o funcionário responsável pelo cartão o motivo da demora.

**Prazo mais próximo.** Mostra qual projeto tem o prazo mais perto. Decisão: direciona a atenção do Ricardo pro projeto mais urgente primeiro, em vez de distribuir atenção igualmente entre todos.

## Cortes

Sistema de login.

Criação de mais projetos.

Edição e exclusão de cartões depois de criados.

Sem correção retroativa de dados — cartões que já existiam no banco antes da funcionalidade de "tempo desde que foi pego" não têm esse dado preenchido (ficam sem a informação até receberem uma atualização de status).