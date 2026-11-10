# LocusCRM: Frontend

SPA do LocusCRM (React 19, TypeScript, Vite, Tailwind 4 e Firebase Auth).
A API fica em `D:\DEV\NODE\busca-leads-api`. O trabalho planejado está em `D:\DEV\NODE\busca-leads-api\docs\ROADMAP.md`.

## Comandos
- `npm run dev`: servidor local do Vite
- `npm run verify`: lint, TypeScript e build, obrigatório antes de concluir uma mudança

## Estrutura
- `src/views`: telas. A navegação é por estado em `App.tsx`, sem rotas.
- `src/components`: `radar`, `crm`, `IA`, `plans`, `common` e `layout`
- `src/hooks`: lógica de tela, como `useCRM*` e `useRadar`
- `src/services/api`: toda chamada HTTP passa por aqui

## Regras obrigatórias
- Use o alias `@/` e os tipos de `src/types.ts`.
- Regras de plano e cota são garantidas pelo backend. O frontend apenas reflete o estado.
- Limites da API (429 com `SEARCHES_LIMIT`, `AI_USAGE_LIMIT` ou `FUNNEL_LIMIT`) abrem o `LimitModal`.
- Atualizações otimistas precisam reverter o estado e avisar com toast em caso de erro.
- Nenhum segredo em variável `VITE_`, pois tudo que usa esse prefixo vai para o navegador.
- Nunca ler `.env`. Consulte `.env.example`.

## Contrato com a API
Mudanças de API são compatíveis primeiro: o backend muda, depois o frontend, e só então o formato antigo é removido.

## Definição de pronto
`npm run verify` passa, a tela alterada foi testada ou isso foi dito explicitamente, e o roadmap está atualizado.
Commits só quando solicitado, um assunto por commit, em português e no formato `tipo: descrição`.
