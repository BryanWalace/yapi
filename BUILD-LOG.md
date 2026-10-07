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

### P5 — S12 Suporte, S13 Apoio, S14 Viabilidade, S15 Princípios, S16 Contato ✅
- S12 e S13 em Arial (`.font-alt`); margem lateral medida em 4,26% (62px), não 4,6%. Fontes medidas maiores que o DESIGN: eyebrow 17px, título 59,6px (S12) / 55px (S13), números 54,6px, títulos dos itens 35px, descrições 29px.
- S12: lista em linhas de altura igual (16,5% do slide), com divisórias `--c-line` de x 14,08% a 94,3%. **Decisão:** no slide, a linha 04 e os números 02/03 estão um pouco deslocados (diagramação manual); usei a grade regular do DESIGN §4. "Contigência" → "Contingência" (correção permitida). "Organização operacional" a x 48,4%.
- S13: **sem rodapé "YAPI PESQUISA CLÍNICA"** — o slide 13 não tem (slide > CLAUDE.md §5.7). Fotos 24,86% × 66,2%, centralizadas, com `data-lightbox`.
- S14: destaque 28px / entrelinha 1,12; frase dourada 25,5px; lista com descrição 20,5px (largura medida pela quebra de linha).
- S15: destaque 34,4px; propósito 25,5px `--c-beige`; valores com título 31,6px e descrição 22,3px. Mancha clara no canto inferior direito do slide = defeito do PDF, não reproduzida.
- S16: painel `--c-sand` 32,3% × 91%; o logo original (com fundo sand embutido) funde-se ao painel. Cards `--c-row` sem raio; e-mail, endereço, WhatsApp e Instagram são links (externos com `target="_blank" rel="noopener"`). Ícones SVG inline monocromáticos `--c-ink`. Título 46px, nome 35,4px.
- Comparação com Playwright em 1456×819 a partir desta etapa (na prática desde o P2): tudo dentro de ±5px.

### P6 — Header, menu mobile, scroll, WhatsApp e lightbox ✅
- Header fixo 64px: transparente sobre o hero (logo claro, links `--c-on-dark`) e, após o hero, fundo `--c-paper` + borda `--c-line` (logo escuro, links `--c-ink`). Logo do header = `logo-yapi-header(-light).png` a 40px.
- Link ativo: o último destino do menu cujo topo passou de 40% da tela (as seções intermediárias contam para o item anterior — p.ex. S8–S13 → "Estrutura"). **Decisão:** o destaque dourado é um sublinhado de 2px `--c-gold`; o texto fica em `--c-ink` porque dourado sobre `--c-paper` (3,4:1) reprova AA em 14px. `aria-current="location"` no ativo.
- "Fale conosco" (`.btn-outline`, borda dourada) → `#contato`. Mesmo motivo de contraste: texto herda a cor do header (claro sobre o hero, `--c-ink` no header sólido); no hover, fundo dourado.
- Menu mobile (<1024px) em tela cheia `--c-earth`: fecha com ESC, com clique em link e ao passar para desktop; trava o scroll; `aria-expanded`/`aria-label` atualizados; foco preso no menu.
- `scroll-margin-top: 64px` nas seções; `scroll-behavior: smooth` só sem `prefers-reduced-motion`.
- WhatsApp flutuante: círculo 56px `--c-gold`, ícone `--c-paper`, `aria-label`.
- Lightbox: cada `img[data-lightbox]` vira `<button class="zoom">` (teclado); diálogo `aria-modal`, ESC/clique fora fecham, ← → navegam entre as fotos da mesma seção, foco preso e devolvido à foto. Botões em texto ("Anterior", "Próxima", "Fechar") para não usar ícones genéricos (CLAUDE.md §7).
- `tools/check-ui.js`: 27 verificações automáticas (header, link ativo, lightbox, menu, âncoras, scroll horizontal, console) — todas passando.

### P7 — Animações ✅
- `.reveal` (fade + 16px, 600ms ease-out) aplicado pelo JS a eyebrow, títulos, parágrafos, fotos, itens de lista, números, valores e cards, via IntersectionObserver (threshold 0,15), com atraso escalonado de 80ms entre irmãos (máx. 480ms). O hero não recebe reveal (não atrasar o LCP).
- **Decisão:** o deslocamento usa a propriedade CSS `translate` em vez de `transform` (DESIGN §7), porque vários elementos já usam `transform` para se posicionar (S12, S16); o efeito visual é idêntico.
- Contadores da S3: easeOutCubic, 1,4s, `toLocaleString('pt-BR')` (5.000), prefixo/sufixo por `data-prefix`/`data-suffix`; disparam uma vez com 40% da seção visível (ou o máximo possível se a seção for mais alta que a tela). O HTML já traz os valores finais (sem JS/SEO).
- Hero: zoom-out 1,06 → 1 em 2,5s.
- `prefers-reduced-motion`: sem reveal, sem contador animado, sem zoom, sem scroll suave.
- Bug encontrado pelo teste: no mobile "+450 mil" quebrava em 2 linhas e a contagem mudava a altura da página (âncoras deslocadas em 41px). Números com `white-space: nowrap` e `min(var(--fs-stat), 8.4vw)`.

### P8 — Responsivo ✅
- `tools/responsive.js` tira screenshots por seção em 375, 768, 1024, 1440 e 1920px e lista elementos que vazam a viewport. **Resultado final: 0px de scroll horizontal em todas as larguras.**
- **Bug corrigido:** com `aspect-ratio: 16/9` + `min-height: 100vh` na própria seção, telas mais altas que 16:9 (p.ex. 1440×900) ganhavam 160px de scroll horizontal (o min-height vira largura mínima pelo aspect-ratio). Agora só o `.slide` interno é 16:9; a seção tem `min-height: 100vh` e centraliza o slide (DESIGN §3).
- **Decisão (desktop ≥1200px):** tipografia 100% proporcional ao slide (tokens em `vw`, sem os tetos dos `clamp()`), para que 1920px pareça o slide ampliado; os `clamp()` do DESIGN continuam valendo abaixo de 1200px.
- Tablet (768–1199px): sem aspect-ratio, padding vertical 96px; 2 colunas com foto sangrada nas S2, S3, S6, S7 e painel bege sangrado na S16; pares de fotos lado a lado com a mesma altura; S14/S15 em 2 colunas.
- Mobile (<768px): 1 coluna (eyebrow → título → texto → foto), fotos sangradas em largura total com 60vh, pares de fotos empilhados (S13 também), S12 com número + título na linha e descrição abaixo, cards de contato em 1 coluna, rodapés estáticos, tabela S4 mantida como tabela.
- Abaixo de 1200px as quebras forçadas (↵) dos títulos/destaques são ignoradas (evitam palavras órfãs em colunas estreitas).
- Bug corrigido: legenda da S13 coberta pela foto seguinte no mobile (`.zoom` com `height: 100%` dentro de item de grid).

### P10 — Performance, acessibilidade e SEO ✅
- **Imagens:** `.webp` gerados ao lado dos originais (`tools/make-webp.js`) e servidos via `<picture>` com fallback `.jpg/.png` (`picture { display: contents }` para não mudar o layout). Fotos 50–75% menores; logo da S16 226KB → 21KB. Hero com `srcset` 1280/1920/2400 e, **em tela retrato, um recorte 900×1350 (e 600×900) enquadrando o letreiro e a entrada** (no celular a foto 16:9 em `cover` mostraria só a árvore, ampliada).
- `loading="lazy"` + `decoding="async"` em todas as imagens, exceto o hero (`fetchpriority="high"`); `width`/`height` em todas.
- JS do header sem reflow forçado (posições medidas só no load/resize).
- `robots.txt` (bloqueia `/reference/`). HTML validado com `html-validate` (0 erros).
- Hierarquia: `h1` só no hero → `h2` títulos de seção → `h3` subtítulos. Skip link "Pular para o conteúdo", `:focus-visible` 2px `--c-gold`, todos os controles acessíveis por teclado.
- `tools/check-content.js`: 136 trechos de texto + 17 alts de CONTENT.md presentes; title e description idênticos; correções do PDF aplicadas.
- **Lighthouse (servidor local, sem compressão/cache):** mobile Performance 96 · Acessibilidade 96 · Boas práticas 100 · SEO 100; desktop 100 · 96 · 100 · 100. (Antes do WebP: mobile Performance 79, LCP 5,8s → 2,8s.)

#### ⚠️ Contraste AA — decisão a revisar
Mantive as cores dos slides (prioridade slide > DESIGN > CLAUDE). Pares da paleta que **não** atingem AA (4,5:1) em texto pequeno:

| Par | Razão | Onde |
|---|---|---|
| `--c-gold` sobre `--c-paper` | 3,37 | eyebrows (15px), "E-MAIL"/"ENDEREÇO" |
| `--c-gold` sobre `--c-row` | 2,98 | rótulos dos cards da S16 |
| `--c-gold-warm` sobre `--c-cream` | 2,70 | eyebrow da S12 |
| `--c-muted` sobre `--c-paper` | 4,21 | rodapés, legendas da S9 |
| `--c-muted` sobre `--c-cream` | 4,06 | rodapés da S12 |
| `--c-muted` sobre `--c-row` | 3,72 | "Coordenação do YAPI" |

Textos dourados grandes (≥24px, p.ex. "Base em prontuários", "São Paulo", frase da S14, numeração) passam no critério de texto grande (3:1). O Lighthouse só reprova os rodapés porque, durante a auditoria, os eyebrows fora da tela estão com opacidade 0 (reveal) — **os eyebrows também reprovam AA**. Se quiser AA estrito: dourado `#966621` (4,58:1 sobre paper) e cinza `#716D64` (4,58:1 sobre cream) só em textos pequenos — fica fora da paleta, por isso não apliquei.

### P11 — Comparação final (Playwright, 1456×819) ✅
Screenshots de cada seção em `tmp/compare/sNN.png`, composições slide × site em `sNN-cmp.png` e mapas de diferença por pixel em `diff-sheet.png` (`tools/compare.js` + `tools/diff.js`). Posições e larguras de texto medidas com `tools/measure.js`.

**Correções feitas nesta etapa** (commit `fix(secoes)`):
- `compare.js` rolava com `scrollIntoView`, que respeita o `scroll-margin-top` do header → os últimos 64px dos screenshots vinham da seção seguinte. Agora rola até o topo exato (o site estava correto).
- S2: o tracking do corpo adicionado no P3 fazia "multidisciplinar" descer de linha; o 2º parágrafo justificado estava 14px mais largo que no slide (723px).
- S15: o destaque usava o tracking apertado dos outros destaques e "que" subia de linha; corrigido para 35px sem tracking.
- S16: logo 11px mais baixo; S11: 2º bloco lateral +9px; S14: descrições da lista 21px.

| Seção | Igual? | Diferença média* | Diferenças restantes |
|---|---|---|---|
| S1 Hero | ✅ | 8,6 | Textos alinhados (±2px). Diferença vem da foto: o overlay do DESIGN não reproduz exatamente o escurecimento do PDF. |
| S2 O Centro | ✅ | 9,0 | Textos e quebras iguais; diferença na textura da foto (reamostragem). |
| S3 Números | ✅ | 9,0 | Filete bege no topo da foto não reproduzido (defeito do PDF); demais ±2px. |
| S4 Áreas | ✅ | 4,5 | Coluna de números ~3px à direita. |
| S5 Localização | ✅ | 3,8 | Mapa recortado do próprio slide (resolução limitada — ver pendências). |
| S6 Inserção | ✅ | 6,1 | ±2px. |
| S7 Estrutura | ✅ | 3,2 | Faixa espelhada sob a foto não reproduzida (defeito do PDF). |
| S8 Recepção | ✅ | 3,7 | ±2px. |
| S9 Consultórios | ✅ | 3,3 | Legendas 1px. |
| S10 Tecnologias | ✅ | 3,4 | ±3px. |
| S11 Coordenação | ✅ | 5,4 | ±4px no 2º bloco. |
| S12 Suporte | ⚠️ quase | 8,5 | Grade regular (DESIGN) × diagramação irregular do slide: descrições até 7px, linha 04 deslocada 15px no slide. Intencional. |
| S13 Apoio | ✅ | 1,8 | Sem rodapé, como no slide. |
| S14 Viabilidade | ✅ | 6,8 | ±3px. |
| S15 Princípios | ✅ | 6,7 | Mancha clara no canto do slide não reproduzida (defeito do PDF). |
| S16 Contato | ✅ | 5,3 | ±3px. |

\* média da diferença absoluta por pixel (0–255) entre o slide e o screenshot; abaixo de ~10 = só antialiasing e textura de foto.

### P12 — Deploy ✅
- `vercel.json`: site estático (`framework: null`, sem install/build, `outputDirectory: "."`), `Cache-Control: public, max-age=31536000, immutable` em `/assets/*`; CSS/JS com revalidação (os nomes não têm hash); `X-Content-Type-Options` e `Referrer-Policy`.
- `.vercelignore`: `reference/`, `*.md` (inclui PROMPTS.md), `LEIA-ME.txt`, `tools/`, `tmp/`, `node_modules/`, `package*.json`, `.claude/` e o `mapa-conectividade.jpg` errado do kit.
- `README.md`: como rodar localmente (`node tools/serve.js`, `npx serve .` ou `python -m http.server`) e publicar (`vercel --prod`).
- `package.json` com scripts `start`, `test`, `compare`, `responsive`, `webp` (só ferramentas de desenvolvimento; o site não depende de nada).
- Não testado aqui: o deploy real na Vercel (precisa da sua conta/CLI autenticada).

---

## Checklist de pronto (CLAUDE.md §8)

- [x] **As 16 seções existem na ordem e com os ids do §4** — `#inicio` … `#contato`.
- [x] **Screenshot de cada seção em 1456×819 comparado com `reference/slide-XX.png`** — ver tabela do P11; posições e larguras de texto dentro de ±4px (S12: grade regular intencional).
- [x] **Responsivo em 375, 768, 1024, 1440 e 1920px sem scroll horizontal** — 0px em todas (`tools/responsive.js`).
- [x] **Lighthouse ≥ 90** — mobile: Performance 96 · Acessibilidade 96 · Boas práticas 100 · SEO 100; desktop: 100 · 96 · 100 · 100 (servidor local sem compressão/cache; na Vercel tende a melhorar).
- [x] **Todos os links de contato funcionam** — `mailto:`, WhatsApp (`wa.me`), Instagram e Google Maps com os endereços de CONTENT.md; os externos respondem 200 e abrem em nova aba (`rel="noopener"`). WhatsApp também no botão flutuante.
- [x] **Nenhum texto difere de CONTENT.md** — `tools/check-content.js`: 136 trechos + 17 alts + title + description; só as 3 correções permitidas.
- Extras do §6: header fixo, menu mobile, animações e contadores, lightbox, WhatsApp flutuante, SEO (title, description, Open Graph, JSON-LD `MedicalOrganization`, `lang="pt-BR"`), acessibilidade (alts, foco dourado, teclado, `<table>` semântica, skip link), performance (lazy, width/height, WebP com `<picture>`) — todos implementados.
- §7: sem ícones genéricos/emojis (só WhatsApp e Instagram em SVG monocromático), sem `localStorage`, cookies ou trackers, sem imagens de banco, `reference/` fora do deploy.

## Revisar manualmente

1. **Mapa da S5** — `assets/img/mapa-conectividade.jpg` do kit é, na verdade, o slide 08. Usei um recorte do slide 05 (860×484). Se tiver o arquivo original do mapa, salve como `assets/img/mapa-conectividade-s05.jpg` e rode `npm run webp`.
2. **Contraste AA** — ver a tabela no P10. As cores dos slides foram mantidas; eyebrows dourados, rótulos dos cards e rodapés cinza não atingem 4,5:1. Decidir se troca por `#966621`/`#716D64` em textos pequenos.
3. **Logo** — o header usa versões geradas por mim com o fundo removido (`logo-yapi-header*.png`) e a versão clara foi recolorida para `--c-paper`. Conferir se a marca aprova; o ideal é receber o logo vetorial (SVG) oficial.
4. **Hero no celular** — em tela retrato uso um recorte que mostra o letreiro (em vez do centro da foto). Conferir num celular real.
5. **Domínio** — trocar o `og:image` por URL absoluta quando o domínio existir (e, se quiser, adicionar `<link rel="canonical">` e `url` no JSON-LD).
6. **Instagram** — confirmar que `@yapiclinicalresearch` é o perfil certo (o Instagram responde 200 mesmo para perfis inexistentes).
7. **Tipografia no Mac/iOS/Android** — os tamanhos foram calibrados com o Verdana do Windows. No Android não há Verdana (cai em DejaVu Sans/Roboto); conferir quebras de linha nesses aparelhos.
8. **Rodapé da S13** — omitido porque o slide 13 não tem; se preferir a regra do CLAUDE.md §5.7, basta adicionar `<p class="section-foot" aria-hidden="true">YAPI PESQUISA CLÍNICA</p>` no fim da `#apoio`.

## Build e deploy (após o P12)
- `npm run build` (`tools/build.js`) gera `dist/` do zero: só os arquivos referenciados pelo HTML, HTML minificado (html-minifier-terser, `conservativeCollapse` para não colar palavras quando os `<br>` somem no mobile), CSS/JS minificados (esbuild) com hash no nome, `_headers`, `robots.txt` e `sitemap.xml` (placeholder `SITE_URL`, substituído se a variável for definida no build). O build falha se algum caminho de `dist/index.html` for absoluto ou não existir.
- Vercel: `vercel.json` com `buildCommand: npm run build`, `outputDirectory: dist` e cache imutável para `/assets/*`, `/css/*`, `/js/*`.
- Cloudflare: **Workers com static assets** (`wrangler.toml`, `[assets] directory = "./dist"`) — a documentação oficial diz "Start new projects with Workers". Deploy: `npm run deploy:cf` (= build + `wrangler deploy`); `wrangler deploy --dry-run` validado.
- Testes do build: `tools/check-dist.js` (via `npm run preview`) — 0 erros de console, 0 requisições com falha, todas as imagens carregadas (16 em .webp) no desktop e no mobile; `SITE_DIR=dist` em `check-ui.js`/`check-content.js` — todos passando; `html-validate dist/index.html` — 0 erros.
- `npm audit`: o `serve` puxava `compression` vulnerável (só no preview local); corrigido com `overrides` para `compression@^1.8.2` → 0 vulnerabilidades.
