# PROMPTS.md — Sequência para o Claude no VS Code

**Como usar:** extraia o kit numa pasta vazia, abra no VS Code, inicie o Claude (Claude Code) na raiz e cole **um prompt por vez**, esperando terminar e conferindo antes do próximo. Se algo sair diferente do slide, use o prompt de correção (P9).

---

## P0 — Contexto (cole primeiro)
```
Leia CLAUDE.md, DESIGN.md e CONTENT.md por completo. Depois abra as 16 imagens em reference/ (slide-01.png a slide-16.png) e as fotos em assets/img/.
Não escreva código ainda. Me responda em até 15 linhas: (1) o mapa slide → seção que você entendeu, (2) a paleta e fontes que vai usar, (3) qualquer dúvida ou conflito entre os arquivos.
```

## P1 — Base do projeto
```
Crie a base do site seguindo CLAUDE.md §2 e §3:
- index.html com lang="pt-BR", <head> completo (meta viewport, title e description de CONTENT.md, Open Graph com assets/img/hero-fachada.jpg, JSON-LD MedicalOrganization com endereço e telefone do CONTENT.md S16), e as 16 <section> vazias com os ids do mapa (CLAUDE.md §4), cada uma com eyebrow, título e rodapé "YAPI PESQUISA CLÍNICA".
- css/style.css com TODOS os tokens de DESIGN.md §1 e §2 em :root, reset leve, classes .section, .on-dark, .eyebrow, .section-foot, .reveal.
- js/main.js vazio com 'use strict'.
Não use frameworks. Mostre a estrutura final de arquivos ao terminar.
```

## P2 — Seções 1 a 3 (hero, o centro, números)
```
Implemente as seções #inicio, #o-centro e #numeros exatamente como reference/slide-01.png, slide-02.png e slide-03.png, usando o layout de DESIGN.md §5 (S1, S2, S3) e os textos de CONTENT.md.
- Fotos sangradas (sem margem, sem raio, sem sombra) nas S2 e S3.
- Posições em % do slide 1456×819 no desktop (≥1200px).
- Números da S3 já com data-attributes para o contador (data-count="450" data-suffix=" mil" data-prefix="+", etc.).
Depois compare cada seção com o slide de referência e liste qualquer diferença que restou.
```

## P3 — Seções 4 a 7 (áreas, localização, inserção, estrutura)
```
Implemente #areas, #localizacao, #insercao e #estrutura iguais a reference/slide-04 a slide-07, seguindo DESIGN.md §4 (tabela) e §5 (S4–S7).
- A tabela da S4 é <table> semântica: cabeçalho --c-earth, zebra --c-row, números em bold centralizados na coluna 2, sem bordas.
- O mapa da S5 é a imagem assets/img/mapa-conectividade.jpg inteira (já contém a legenda).
- S6: foto à esquerda sangrada para a borda esquerda e topo, terminando a 91% da altura.
- S7: título grande em 3 linhas, foto à direita sangrada.
Compare com os slides e corrija diferenças de tamanho de fonte e posição.
```

## P4 — Seções 8 a 11 (ambientes)
```
Implemente #recepcao, #consultorios, #tecnologias e #coordenacao iguais a reference/slide-08 a slide-11 (DESIGN.md §3 "Fotos internas" e §5 S8–S11).
Crie um componente reutilizável .photo-pair (2 fotos lado a lado com larguras 31.6% e 26.5% do slide, gap 1.5%) + .side-text (coluna a partir de 67.6%).
S9 tem layout próprio: "9" gigante dourado à esquerda e as fotos com legendas "Consultório 1" e "Consultório 3".
Adicione data-lightbox em todas as fotos dessas seções (o JS vem depois).
```

## P5 — Seções 12 a 16 (suporte, apoio, viabilidade, princípios, contato)
```
Implemente #suporte, #apoio, #viabilidade, #principios e #contato iguais a reference/slide-12 a slide-16 (DESIGN.md §4 e §5 S12–S16).
- S12 e S13 usam --font-alt (Arial). S12 com fundo --c-cream, lista 01–04 em 3 colunas com divisórias finas, e "Organização operacional" no rodapé central.
- S13: duas fotos verticais centralizadas com legendas.
- S16: painel bege à esquerda com logo; à direita card grande + grid 2×2 de cards. Ícones de WhatsApp e Instagram em SVG inline monocromático. Todos os links de CONTENT.md S16 funcionando (abrir externos em nova aba com rel="noopener").
Aplique as correções de digitação listadas em CONTENT.md.
```

## P6 — Header, menu mobile e extras
```
Implemente os extras de CLAUDE.md §6:
1. Header fixo de 64px: transparente sobre o hero (logo e links claros), e ao rolar além do hero fica com fundo --c-paper, borda inferior --c-line e links --c-ink. Link ativo destacado em --c-gold conforme a seção visível.
2. Menu hambúrguer <1024px em tela cheia com fundo --c-earth, fecha com ESC e ao clicar num link; trava o scroll do body enquanto aberto; aria-expanded correto.
3. Scroll suave com compensação da altura do header (scroll-margin-top).
4. Botão WhatsApp flutuante (círculo 56px, --c-gold, ícone branco) → https://wa.me/5517997588160 com aria-label.
5. Lightbox para [data-lightbox]: overlay escuro, imagem centralizada, fecha com ESC/clique fora, setas ← → navegam entre fotos da mesma seção, foco preso no lightbox.
```

## P7 — Animações
```
Implemente o movimento de DESIGN.md §7:
- .reveal com IntersectionObserver (threshold 0.15), aplicado a eyebrow, título, parágrafos, fotos e itens de lista, com atraso escalonado de 80ms entre irmãos.
- Contadores da S3 (7, 9, +450 mil, 53, +5.000) com easeOutCubic em 1.4s, formatando em pt-BR, disparando uma vez quando 40% da seção estiver visível.
- Hero: leve zoom-out da foto (scale 1.06 → 1) em 2.5s no carregamento.
- Tudo desativado com prefers-reduced-motion.
```

## P8 — Responsivo
```
Aplique DESIGN.md §6 e teste mentalmente em 375, 768, 1024, 1440 e 1920px:
- <768px: 1 coluna, ordem eyebrow → título → texto → foto; fotos sangradas ocupam largura total com 60vh; pares de fotos empilham; S12 com número+título numa linha e descrição abaixo; grid de contato vira 1 coluna; rodapés de seção estáticos.
- 768–1199px: sem aspect-ratio fixo, padding vertical 96px, 2 colunas onde há foto sangrada.
- Hero sempre 100svh.
Garanta zero scroll horizontal (verifique elementos com width > 100vw). Liste o que ajustou.
```

## P9 — Prompt de correção (use quantas vezes precisar)
```
A seção #[ID] não está igual a reference/slide-[NN].png. Abra o slide e compare com o código. Diferenças que vejo: [descreva — ex.: título menor, foto não encosta na borda, cor do número errada].
Corrija usando só os tokens de DESIGN.md e mantendo o texto de CONTENT.md. Não altere outras seções.
```

## P10 — Performance, acessibilidade e SEO
```
Revise o projeto inteiro:
- loading="lazy" e decoding="async" em todas as imagens exceto o hero (fetchpriority="high"); width/height em todas.
- Gere versões .webp das fotos em assets/img/ (se tiver sharp ou cwebp disponível) e use <picture> com fallback .jpg.
- alt de CONTENT.md em todas as imagens; hierarquia h1 (só no hero) → h2 (título de seção) → h3.
- :focus-visible com outline 2px --c-gold; contraste AA; skip-link "Pular para o conteúdo".
- Valide HTML sem erros.
Me entregue um checklist do §8 de CLAUDE.md marcando o que está ok.
```

## P11 — Comparação final
```
Rode um servidor local (npx serve . ou python -m http.server) e, se tiver Playwright disponível, tire screenshots de cada seção em viewport 1456×819 salvando em /tmp/compare/. Compare cada uma com reference/slide-XX.png e me dê uma tabela: seção | igual? | diferenças restantes. Corrija o que for simples e liste o resto.
```

## P12 — Deploy
```
Prepare o deploy estático na Vercel: crie vercel.json com cache longo para /assets/*, um .vercelignore com reference/, *.md e PROMPTS.md, e um README.md curto com como rodar localmente e publicar (vercel --prod).
```
