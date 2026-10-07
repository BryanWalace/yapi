# DESIGN.md — Sistema visual YAPI

> Medidas extraídas dos slides renderizados em **1456 × 819 px** (`reference/slide-XX.png`).
> Porcentagens = posição/tamanho relativo ao slide. No desktop, cada seção reproduz essa grade.
> Cores medidas por amostragem de pixel nos slides — use exatamente estes valores.

---

## 1. Paleta (tokens)

```css
:root {
  /* Fundos */
  --c-paper:      #F8F5F0; /* fundo claro padrão (slides 2,4,5,6,8–11,14,16) */
  --c-cream:      #F8F1E0; /* creme quente, só slide 12 */
  --c-earth:      #524C3E; /* fundo escuro (slides 3,7,15) e cabeçalho da tabela */
  --c-earth-2:    #5D513D; /* marrom da seção de apoio (slide 13) */
  --c-sand:       #DFC5AC; /* painel do logo (slide 16) */
  --c-row:        #EDE7DB; /* linha zebrada da tabela e cards de contato */
  --c-line:       #D9CBB4; /* divisórias finas (slide 12) */

  /* Texto */
  --c-ink:        #3A3833; /* títulos e texto sobre fundo claro */
  --c-ink-soft:   #4A4741; /* corpo de texto sobre fundo claro */
  --c-muted:      #7A756C; /* rodapé "YAPI PESQUISA CLÍNICA" e legendas */
  --c-ink-warm:   #5E5141; /* títulos/texto do slide 12 */
  --c-on-dark:    #F8F5F0; /* títulos sobre escuro */
  --c-beige:      #DFC7AB; /* números e destaques sobre escuro; eyebrow sobre escuro (#E2CFB2) */

  /* Acento */
  --c-gold:       #B37A27; /* eyebrows, subtítulos dourados, numeração 01–04, "9" */
  --c-gold-line:  #BF8C40; /* filete dourado do hero */
  --c-gold-warm:  #C8862E; /* numeração do slide 12 */
}
```

Regra de uso: fundo claro → texto `--c-ink`, eyebrow `--c-gold`. Fundo escuro → título `--c-on-dark`, números/destaques `--c-beige`, eyebrow `#E2CFB2`.

## 2. Tipografia

```css
--font-main: Verdana, Geneva, Tahoma, "DejaVu Sans", sans-serif; /* todos os slides */
--font-alt:  Arial, "Helvetica Neue", Helvetica, sans-serif;     /* só slides 12 e 13 */
```

Escala (desktop 1456px de largura → use `clamp()` para escalar com a viewport):

| Token | Uso | px no slide | CSS sugerido | Peso |
|---|---|---|---|---|
| `--fs-hero` | "Apresentação institucional" | 68 | `clamp(2.4rem, 4.7vw, 5.2rem)` | 700 |
| `--fs-display` | Título "Um centro dedicado à pesquisa" (s7), "9" (s9) | 72 / 110 | `clamp(2.6rem, 5vw, 5.5rem)` / `clamp(4rem, 7.6vw, 8rem)` | 700 |
| `--fs-h1` | Título de seção | 54 | `clamp(2rem, 3.7vw, 4rem)` | 700 |
| `--fs-stat` | Números slide 3 | 68 | `clamp(2.6rem, 4.7vw, 5rem)` | 700 |
| `--fs-h2` | "Votuporanga", "Base em prontuários", "Renata…" | 36 | `clamp(1.6rem, 2.5vw, 2.4rem)` | 700 |
| `--fs-h3` | Subtítulos laterais ("O cuidado começa na chegada") | 30 | `clamp(1.35rem, 2.05vw, 2rem)` | 700 |
| `--fs-lead` | Corpo grande (s6, s15 esq.) | 30 | `clamp(1.2rem, 2.05vw, 1.9rem)` | 400 |
| `--fs-body` | Corpo padrão | 23 | `clamp(1rem, 1.6vw, 1.45rem)` | 400 |
| `--fs-small` | Descrições de listas | 19 | `clamp(.95rem, 1.3vw, 1.2rem)` | 400 |
| `--fs-eyebrow` | Rótulo de seção | 15 | `clamp(.72rem, 1.03vw, .95rem)` | 700, UPPERCASE, `letter-spacing: .02em` |
| `--fs-foot` | "YAPI PESQUISA CLÍNICA" | 13 | `clamp(.65rem, .9vw, .8rem)` | 400, UPPERCASE |

- Títulos: `line-height: 1.1`, `letter-spacing: -0.01em`.
- Corpo: `line-height: 1.35` (os slides são compactos — não aumentar).
- Números de estatística: `line-height: 1`.

## 3. Grade e espaçamento

- **Margem lateral**: 67px no slide = **4.6%** → `--gutter: clamp(20px, 4.6vw, 80px)`.
- **Eyebrow**: topo a 6.8% (≈56px). **Título**: topo a ~13% (≈108px).
- **Conteúdo** começa a ~27% do topo (≈219px).
- **Rodapé de seção**: a 95.5% do topo (≈782px), alinhado à margem esquerda.
- Seção desktop: `position: relative; min-height: 100vh; aspect-ratio: 16/9; max-height` livre. Se a tela for mais alta que 16:9, centralizar verticalmente o conteúdo.
- Fotos internas (slides 8, 10, 11): topo 26.7% (219px), altura 56.5% (463px). Foto A: x 4.6% → largura 31.6%. Foto B: x 37.7% → largura 26.5%. Gap entre fotos 1.5% (22px). Texto lateral começa em x 67.6% (984px).
- `object-fit: cover` em todas as fotos.

## 4. Componentes

### Eyebrow
```css
.eyebrow { font: 700 var(--fs-eyebrow)/1 var(--font-main); color: var(--c-gold); text-transform: uppercase; }
.on-dark .eyebrow { color: #E2CFB2; }
```

### Rodapé de seção
`.section-foot` absoluto, `left: var(--gutter); bottom: 4.5%`, `--fs-foot`, cor `--c-muted` (claro) ou `#C9BBA5` (escuro).

### Lista numerada (slides 12 e 14)
Número em `--c-gold`, bold, ~32px (s14) / ~44px (s12). Título bold `--fs-h3` ao lado. Descrição `--fs-small` abaixo (s14) ou na coluna da direita (s12).
- s12: grade de 3 colunas → número (x 4.3%), título (x 15%), descrição (x 50%). Divisória 1px `--c-line` entre itens, começando na coluna do título até 94.5% da largura.

### Tabela (slide 4)
- Largura 58.3% (67→916px). Cabeçalho `--c-earth`, texto branco bold 17px, altura 53px.
- 7 linhas de 63px, zebra: linhas ímpares `--c-row`, pares transparentes (`--c-paper`).
- Coluna 1 à esquerda com padding 21px, 24px regular. Coluna 2 centralizada sob o cabeçalho "Pacientes cadastrados", **bold** 26px.
- Sem bordas.

### Card de contato (slide 16)
Fundo `--c-row`, sem borda, sem raio, padding ~32px. Rótulo dourado bold uppercase 15px; valor 22px `--c-ink`.

### Botões (extra)
`.btn-outline`: borda 1.5px `--c-gold`, texto `--c-gold`, sem raio, padding 10px 20px, uppercase 13px bold; hover: fundo `--c-gold`, texto `--c-paper`.

## 5. Layout por seção (desktop)

**S1 Hero (`#inicio`)** — `hero-fachada.jpg` cobre 100%, `object-position: center 40%`. Overlay: `linear-gradient(to top, rgba(20,18,14,.75) 0%, rgba(20,18,14,.35) 35%, rgba(20,18,14,0) 60%)`. Filete dourado 2.5px × 9.1% (133px) em `--c-gold-line` a 62% do topo. Eyebrow "YAPI PESQUISA CLÍNICA" bege-claro (#E2CFB2) a 66%. Título branco `--fs-hero` a 73%. Subtítulo "Votuporanga · São Paulo, Brasil" branco 22px a 86%. Rodapé a 95%.

**S2 O Centro** — fundo `--c-paper`. Coluna texto 4.6% → 55%. Título 2 linhas `--fs-h1`. Três parágrafos `--fs-body` com ~60px entre eles. Foto `centro-corredor-claraboia.jpg` de x 57.4% até 100%, altura 100%, sangrada.

**S3 Números** — fundo `--c-earth`, classe `.on-dark`. Título "O YAPI em números" `--c-on-dark`. Grade 2×2: col 1 em x 4.6%, col 2 em x 38.6%; linha 1 topo 31%, linha 2 topo 56%. Número `--fs-stat` `--c-beige`, legenda 20px `--c-on-dark` logo abaixo. Linha 3: "+5.000" à esq. e legenda na mesma linha a partir de x 24%. Foto `numeros-letreiro.jpg` de x 59.2% até 100%, sangrada.

**S4 Áreas** — tabela à esquerda (ver componente). Lateral em x 67.4%: "Base em prontuários" `--fs-h2` em `--c-gold`; dois parágrafos `--fs-body` `--c-ink-soft`.

**S5 Localização** — esq.: "Votuporanga" `--fs-h2` bold `--c-ink`, "São Paulo" `--fs-h3` regular `--c-gold`, parágrafo `--fs-body`. Dir.: `mapa-conectividade.jpg` de x 36.3% a 95.5%, topo 28%, altura 59% (já contém a legenda "Conectividade regional" — é uma imagem única).

**S6 Inserção** — foto `acesso-sala-espera.jpg` x 0 → 34.3%, altura 0 → 91% (não chega no rodapé; rodapé fica abaixo dela). Texto a partir de x 39.4%: título 2 linhas `--fs-h1`; 1º parágrafo `--fs-lead`; 2º e 3º `--fs-body`.

**S7 Estrutura** — fundo `--c-earth`. Título 3 linhas `--fs-display` `--c-on-dark` a 24% do topo. Parágrafo `--fs-lead` branco a 59%; lista "Consultórios, farmácia…" `--fs-body` `--c-beige` a 77%. Foto `estrutura-recepcao.jpg` x 53.2% → 100%, altura 0 → 91%.

**S8 Recepção** — fotos `recepcao-1.jpg` / `recepcao-2.jpg`. Lateral: h3 "O cuidado começa na chegada" + 2 parágrafos.

**S9 Consultórios** — esq.: "9" `--fs-display` grande `--c-gold`, "consultórios médicos" 32px `--c-ink`, parágrafo `--fs-body`. Fotos: `consultorio-1.jpg` x 33.2% largura 34.5%; `consultorio-3.jpg` x 69.3% largura 26.1%; ambas topo 26.7% altura 56.5%. Legendas 16px `--c-muted` 2% abaixo.

**S10 Tecnologias** — igual S8 com `tecnologia-1/2.jpg`.

**S11 Coordenação** — igual S8 com `coordenacao-reuniao/monitoria.jpg`; lateral com dois blocos (h3 + parágrafo).

**S12 Suporte** — fundo `--c-cream`, `font-family: var(--font-alt)`, títulos `--c-ink-warm`. Lista 01–04 (ver componente). Rodapé esq. + "Organização operacional" centralizado (x 48.5%).

**S13 Apoio** — fundo `--c-earth-2`, `--font-alt`. Eyebrow `#E2CFB2`, título `--c-on-dark` 52px. Duas fotos verticais 362×542 (24.9% × 66%) centralizadas, gap 56px, topo 23%. Legendas centralizadas 17px `#E2CFB2`.

**S14 Viabilidade** — esq. (até 46%): parágrafo `--fs-lead`, parágrafo `--fs-body`, frase final `--fs-body` `--c-gold`. Dir. a partir de 52.6%: lista 01–04 (número 32px `--c-gold` + título 30px bold + descrição 19px).

**S15 Princípios** — fundo `--c-earth`. Esq.: parágrafo `--fs-lead` `--c-on-dark`; parágrafo `--fs-body` `--c-beige`. Dir. a partir de 53.4%: 4 valores, título 30px bold `--c-beige`, descrição 19px `--c-on-dark`.

**S16 Contato** — painel esq. x 0 → 32.3%, altura 0 → 91%, fundo `--c-sand`: logo centralizado (largura ~17% do slide), "Venha nos conhecer" 44px bold `--c-ink` centralizado, "Votuporanga / São Paulo, Brasil" 18px. Dir. de 36.7% a 95.5%: eyebrow, título 2 linhas 44px, card largo (Renata Pires de Assis 34px bold + "Coordenação do YAPI" 22px `--c-muted`), depois grid 2×2 de cards (E-mail, Endereço, WhatsApp com ícone, Instagram com ícone) com gap 22px.

## 6. Responsivo

- **≥1200px**: grade de slide descrita acima (posições em %).
- **768–1199px**: manter 2 colunas onde houver foto sangrada, mas remover `aspect-ratio`; `min-height: auto`, padding vertical 96px.
- **<768px**: tudo em 1 coluna. Ordem: eyebrow → título → texto → foto. Fotos sangradas viram largura total (`margin-inline: calc(-1 * var(--gutter))`), altura 60vh. Grades de 2 fotos viram 1 por linha. Tabela S4 continua tabela (cabe em 375px com fonte 15px). Números S3 em 2×2 mantidos. S12: número + título numa linha, descrição abaixo. Rodapés de seção ficam estáticos no fim de cada seção.
- O hero sempre `100svh`.

## 7. Movimento

```css
.reveal { opacity: 0; transform: translateY(16px); transition: opacity .6s ease-out, transform .6s ease-out; }
.reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }
```
Contadores: 1.4s, easeOutCubic, formato pt-BR (`5.000`, `450 mil`), começa quando 40% da seção estiver visível.
