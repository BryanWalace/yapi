# BUILD-LOG — construção do site YAPI

Registro das etapas P2–P12 (PROMPTS.md), decisões e pendências.

## Ferramentas
- `tools/compare.js` — sobe um servidor local, tira screenshot de cada seção em 1456×819 (Playwright/Chromium) e gera `tmp/compare/sNN-cmp.png` (slide em cima, site embaixo).
- `tools/measure.js` — mede a caixa da "tinta" (texto) numa região do slide e do screenshot; usado para calibrar tamanho, entrelinha e posição com números em vez de olho.
- `tools/prepare-assets.js` — gera os derivados de imagem (mapa, logos transparentes, favicon). Os originais em `assets/img/` não são alterados.

## Decisões (prioridade: slide > DESIGN.md > CLAUDE.md)
1. **Mapa (S5)** — `assets/img/mapa-conectividade.jpg` do kit contém, na verdade, o slide 08 (Recepção). O mapa foi recortado de `reference/slide-05.png` (x 530–1389, y 231–714) para `assets/img/mapa-conectividade-s05.jpg` (860×484). Resolução limitada: **substituir pelo arquivo original do mapa quando houver**.
2. **Logo** — `logo-yapi.png` não tem transparência (fundo `--c-sand` embutido). Na S16 é usado como está (o fundo coincide com o painel). Para o header foram gerados `logo-yapi-header.png` (escuro) e `logo-yapi-header-light.png` (claro, para o header transparente sobre o hero) com o fundo removido, só com o logotipo "YAPI / PESQUISA CLÍNICA" — o logo vertical inteiro a 40px de altura ficaria ilegível. `favicon.png` = símbolo com fundo removido.
3. **Tipografia calibrada pelos slides** — as alturas das letras batem com DESIGN.md, mas as larguras não: títulos do slide são ~2,5% mais justos (`--ls-title: -0.025em`), eyebrow sem tracking extra, rodapé com `-0.03em`, corpo do texto mede 24px (DESIGN: 23px → `1.65vw`), entrelinha do corpo 1.25 (medida: 29–30px para 24px; DESIGN: 1.35). Legendas dos números (S3) 23px (DESIGN: 20px), "+5.000" ~51px (menor que os demais números no slide).
4. **S2** — no slide, o 2º e o 3º parágrafos estão justificados e o 1º não; reproduzido no desktop (no mobile tudo alinhado à esquerda).
5. **Filete bege no topo da foto da S3** e **faixa espelhada no pé da foto da S7** — tratados como defeitos do PDF, não reproduzidos.

## Etapas

### P2 — S1 Hero, S2 O Centro, S3 Números ✅
- Estrutura desktop: cada `.section` tem `aspect-ratio: 16/9` + `min-height: 100vh`; dentro, `.slide` (16:9) recebe as posições em %. Fotos sangradas (`.bleed`) são filhas da seção e cobrem toda a altura.
- Hero em `100svh`, conteúdo ancorado a 11,6% da base; overlay de DESIGN §5.
- S3 com `data-count`/`data-prefix`/`data-suffix` para os contadores.
- Correção: "estrutura dedicado" → "dedicada"; " ." solto removido.
- Ciclo de correção (2 rodadas): posições verticais e larguras dentro de ±2px do slide.

### P3 — S4 Áreas, S5 Localização, S6 Inserção, S7 Estrutura ✅
- S4: `<table>` semântica com `<caption>` oculta, cabeçalho `--c-earth`, zebra `--c-row`, sem bordas; linhas medidas no slide (cabeçalho 53px, linhas ~63,7px, x 67–916). Números começam em x 713 (no slide não estão exatamente centralizados sob o cabeçalho — seguido o slide). Cabeçalho medido 19,5px e números 27,5px (DESIGN: 17/26).
- S5: mapa recortado do slide 05 (ver Decisão 1), posição x 36,4% / y 28,2% / largura 59,07%.
- S6: foto sangrada à esquerda até 91% da altura; título com entrelinha 1,05 (medida).
- S7: título 3 linhas medido em 70,5px com entrelinha 1,04 (DESIGN: 72px); foto sangrada até 91%.
- Calibração global: `.lead` com `letter-spacing: -0.015em`; corpo com `+0.006em` (larguras medidas no slide).
- Ciclo de correção (2 rodadas): tudo dentro de ±3px do slide.

### P4 — S8 Recepção, S9 Consultórios, S10 Tecnologias, S11 Coordenação ✅
- Componente `.photo-pair` (foto A 31,66% / foto B 26,51%, gap 1,5%, topo 26,86%, altura 56,53%) + `.side-text` (x 67,58%, largura 27% — medida pela quebra de linha do slide). Fotos idênticas ao slide (diferença ≤1px).
- No DOM, o texto vem antes das fotos (ordem do mobile: eyebrow → título → texto → foto).
- S9: "9" (110px, dourado), "consultórios médicos" 32px, legendas 16px `--c-muted`; fotos x 33,24%/69,3%.
- Todas as fotos têm `data-lightbox` (JS no P6).
- Espaçamentos medidos: parágrafos laterais com entrelinha 1,17 e 2,1em entre si; descrição da S9 com entrelinha 1,15.
