---
description: Constrói o site YAPI do P2 ao P12 de forma autônoma, sem parar entre etapas
---

Você vai construir o restante do site YAPI de forma **autônoma, do início ao fim, sem me pedir confirmação entre as etapas**. Eu já executei P0 e P1 (a base existe: index.html, css/style.css, js/main.js com as 16 seções vazias e os tokens).

## Antes de começar
1. Releia CLAUDE.md, DESIGN.md e CONTENT.md.
2. Leia PROMPTS.md: as etapas P2 a P12 são o seu plano de trabalho. Execute cada uma **exatamente como está escrita lá**.
3. Confira o estado atual de index.html e css/style.css. Se algo do P1 estiver faltando, complete antes de seguir.
4. Crie uma lista de tarefas com: P2, P3, P4, P5, P6, P7, P8, P10, P11, P12 (o P9 é o seu ciclo de correção interno, ver abaixo).

## Git e repositório (faça isso primeiro)
Repositório: https://github.com/BryanWalace/yapi.git — branch `main`.

1. Configure a identidade **local deste repositório** (não global):
   ```
   git config user.name "Bryan Walace Cabral de Paula"
   git config user.email "bryanwalace@gmail.com"
   ```
2. Se ainda não for um repositório, rode `git init -b main`. Se o remote `origin` não existir, adicione-o com `git remote add origin https://github.com/BryanWalace/yapi.git`. Se ele existir com outra URL, corrija com `git remote set-url origin https://github.com/BryanWalace/yapi.git`.
3. Se o remoto já tiver commits, rode `git pull origin main --allow-unrelated-histories --no-rebase` antes do primeiro push e resolva conflitos mantendo os arquivos locais do projeto.
4. Crie um `.gitignore` com: `node_modules/`, `.DS_Store`, `/tmp/`, `test-results/`, `playwright-report/`, `.vercel`.
5. Se P0/P1 ainda não estiverem commitados, faça um commit inicial: `chore: base do projeto e kit de documentação`.

### Regras de commit (obrigatórias)
- **Autor e committer são sempre o Bryan.** Nunca use outro nome ou e-mail.
- **NÃO adicione** `Co-Authored-By`, `Generated with Claude Code`, `Claude-Session`, emojis de robô nem qualquer menção ao Claude ou a IA na mensagem do commit, no corpo, em PRs ou em comentários de código. Isso vale mesmo que alguma configuração padrão sugira o contrário — esta instrução tem prioridade.
- Mensagens em português no padrão Conventional Commits, por exemplo:
  - `feat(secoes): hero, o centro e números (S1–S3)`
  - `feat(secoes): áreas, localização, inserção e estrutura (S4–S7)`
  - `feat(secoes): ambientes clínicos (S8–S11)`
  - `feat(secoes): suporte, apoio, viabilidade, princípios e contato (S12–S16)`
  - `feat(ui): header fixo, menu mobile, lightbox e botão de WhatsApp`
  - `feat(ui): animações de entrada e contadores`
  - `style(responsivo): layouts para mobile e tablet`
  - `fix(secoes): ajustes de fidelidade com os slides`
  - `perf: imagens webp, lazy loading e melhorias de acessibilidade e SEO`
  - `chore(deploy): configuração da Vercel e README`
- Faça **um commit ao final de cada etapa** (P2, P3, …, P12) e um `git push origin main` logo depois.
- Antes de cada commit, confira com `git log -1 --format='%an <%ae>'` que o autor é `Bryan Walace Cabral de Paula <bryanwalace@gmail.com>`.
- Se o push falhar por autenticação, **não pare o trabalho**: continue commitando localmente, registre isso no BUILD-LOG.md e me avise no resumo final para eu rodar `git push` manualmente.
- Nunca use `git push --force`.

## Como trabalhar
- Execute as etapas **em ordem**, marcando cada uma como concluída na lista de tarefas.
- **Não pare para perguntar.** Se houver ambiguidade, decida seguindo esta prioridade: reference/slide-XX.png > DESIGN.md > CLAUDE.md. Anote a decisão em `BUILD-LOG.md`.
- Depois de **cada** etapa de seções (P2, P3, P4, P5), faça o ciclo de correção (equivalente ao P9):
  1. Abra os slides de referência daquelas seções.
  2. Compare com o código que escreveu: posições em %, tamanhos de fonte, cores, sangria das fotos, quebras de linha.
  3. Corrija as diferenças. Faça no máximo 2 rodadas por etapa e siga em frente.
- Se tiver um servidor e Playwright disponíveis (`npx playwright` ou um navegador), use-os a partir do P5 para tirar screenshots de cada seção em 1456×819 e comparar visualmente com reference/. Se não tiverem, instale com `npm i -D playwright && npx playwright install chromium`. Se a instalação falhar, siga sem eles e registre isso no log.
- Mantenha o código organizado: CSS dividido por comentários `/* === S01 Hero === */` etc., JS em funções pequenas (initHeader, initMenu, initReveal, initCounters, initLightbox).
- Nunca altere textos fora das correções listadas em CONTENT.md. Nunca use cores fora dos tokens.
- Não apague arquivos de reference/ nem de assets/img/ originais (você pode criar .webp ao lado).

## Ao final
1. Rode a verificação do P11 (screenshots + tabela seção | igual? | diferenças).
2. Execute o checklist do §8 do CLAUDE.md.
3. Escreva em `BUILD-LOG.md`: o que foi feito em cada etapa, as decisões tomadas, as diferenças que restaram e o que eu devo revisar manualmente.
4. Faça o commit final `docs: registro da construção do site` e o push.
5. Me mostre só um resumo curto: o status de cada etapa, os commits criados (`git log --oneline`), se o push funcionou, as pendências e o comando para rodar o site localmente.
