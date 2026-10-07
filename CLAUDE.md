# CLAUDE.md — Site institucional YAPI Pesquisa Clínica

> Leia este arquivo inteiro antes de qualquer tarefa. Depois leia `DESIGN.md` e `CONTENT.md`.
> As imagens em `reference/slide-XX.png` são a **fonte da verdade visual**. Em caso de dúvida, abra o slide correspondente e copie o que está lá.

## 1. Objetivo

Transformar a apresentação institucional do **YAPI Pesquisa Clínica** (16 slides, PDF) em um **site one-page** visualmente idêntico: mesmas cores, tipografia, proporções, fotos, textos e ordem. Cada slide vira uma **seção de tela cheia** (`min-height: 100vh` no desktop, com a mesma composição do slide 16:9). No mobile as colunas empilham, mantendo a identidade.

Público: patrocinadores da indústria farmacêutica e CROs (organizações de pesquisa clínica). Tom: sóbrio, premium, institucional.

## 2. Stack (obrigatória)

- **HTML5 + CSS3 + JavaScript puro**, sem framework e sem build. Um único `index.html`, `css/style.css`, `js/main.js`.
- Sem Tailwind, sem Bootstrap, sem jQuery. Fontes do sistema (ver DESIGN.md) — não carregar Google Fonts.
- Deploy alvo: Vercel ou Netlify como site estático (só subir a pasta).
- Compatível com Chrome, Edge, Safari, Firefox atuais e iOS/Android.

## 3. Estrutura de pastas

```
/
├── CLAUDE.md          ← este arquivo
├── DESIGN.md          ← sistema visual (tokens, componentes, layout por seção)
├── CONTENT.md         ← todo o texto do site, verbatim
├── PROMPTS.md         ← prompts para executar em sequência
├── reference/         ← slide-01.png … slide-16.png (NÃO publicar, só referência)
├── assets/img/        ← fotos e logo já recortados
├── index.html
├── css/style.css
└── js/main.js
```

## 4. Mapa slide → seção

| # | Slide (reference/) | id da seção | Fundo | Layout |
|---|---|---|---|---|
| 1 | slide-01 | `#inicio` | foto fachada + overlay | Hero full-bleed, texto canto inferior esquerdo |
| 2 | slide-02 | `#o-centro` | claro | Texto esq. 57% / foto dir. 43% sangrada |
| 3 | slide-03 | `#numeros` | escuro | Números esq. 59% / foto dir. 41% sangrada |
| 4 | slide-04 | `#areas` | claro | Tabela esq. 63% / nota lateral |
| 5 | slide-05 | `#localizacao` | claro | Texto esq. / mapa dir. |
| 6 | slide-06 | `#insercao` | claro | Foto esq. 34% sangrada / texto dir. |
| 7 | slide-07 | `#estrutura` | escuro | Título grande esq. / foto dir. 47% sangrada |
| 8 | slide-08 | `#recepcao` | claro | 2 fotos + texto lateral |
| 9 | slide-09 | `#consultorios` | claro | Número "9" + 2 fotos com legenda |
| 10 | slide-10 | `#tecnologias` | claro | 2 fotos + texto lateral |
| 11 | slide-11 | `#coordenacao` | claro | 2 fotos + 2 blocos de texto |
| 12 | slide-12 | `#suporte` | creme quente | Lista numerada 01–04 com divisórias |
| 13 | slide-13 | `#apoio` | marrom | 2 fotos verticais centralizadas com legenda |
| 14 | slide-14 | `#viabilidade` | claro | Texto esq. / lista numerada 01–04 dir. |
| 15 | slide-15 | `#principios` | escuro | Texto esq. / 4 valores dir. |
| 16 | slide-16 | `#contato` | painel bege + claro | Logo esq. / cards de contato dir. |

## 5. Regras de fidelidade (inegociáveis)

1. **Textos**: copiar exatamente de `CONTENT.md`. Não reescrever, não "melhorar", não adicionar frases de marketing. Únicas correções permitidas são as listadas em CONTENT.md §Correções.
2. **Cores**: usar somente os tokens de `DESIGN.md`. Nenhum hex fora da paleta.
3. **Tipografia**: Verdana (Tahoma/sans-serif como fallback) em todo o site, exceto slides 12 e 13 que usam Arial/Helvetica (ver DESIGN.md). Títulos em **bold**, grandes, `letter-spacing` levemente negativo.
4. **Fotos sangradas**: nas seções 2, 3, 6 e 7 a foto encosta na borda da tela (topo, base e lateral), sem margem, sem cantos arredondados, sem sombra.
5. **Sem cantos arredondados** em fotos, tabelas e cards. Sem sombras. Sem gradientes (exceto o overlay escuro do hero).
6. **Rótulo de seção** (eyebrow) em caixa alta, bold, pequeno, dourado no topo de cada seção — igual ao slide.
7. **Rodapé de seção**: "YAPI PESQUISA CLÍNICA" em caixa alta, pequeno, no canto inferior esquerdo de cada seção (como nos slides). Na seção 12 também "Organização operacional" ao centro.
8. Proporções: no desktop (≥1200px) cada seção deve parecer o slide em 16:9. Use `aspect-ratio: 16/9` com `min-height: 100vh` como guia e a grade descrita no DESIGN.md (posições em % do slide de 1456×819).

## 6. Além do PDF ("algo a mais")

Adicionar sem quebrar a fidelidade visual:
- **Header fixo** fino (64px), transparente sobre o hero e com fundo `--c-paper` + borda inferior `--c-line` após rolar. Logo à esquerda (`assets/img/logo-yapi.png`, 40px de altura), links: O Centro · Números · Estrutura · Viabilidade · Princípios · Contato. Botão "Fale conosco" (borda dourada) → `#contato`.
- **Menu mobile** (hambúrguer) em tela cheia, fundo `--c-earth`.
- **Animações sutis**: fade + translateY(16px) ao entrar na viewport (IntersectionObserver), 600ms, `ease-out`. Contadores animados nos números da seção 3 (7, 9, 450 mil, 53, 5.000). Respeitar `prefers-reduced-motion`.
- **Lightbox** simples nas fotos das seções 8–11 e 13 (clique amplia, ESC fecha).
- **Botão WhatsApp flutuante** (canto inferior direito, cor `--c-gold`) → `https://wa.me/5517997588160`.
- Links reais na seção 16: `mailto:contato@clinicalresearch.com.br`, `https://wa.me/5517997588160`, `https://instagram.com/yapiclinicalresearch`, endereço → Google Maps.
- **SEO**: `<title>YAPI Pesquisa Clínica · Votuporanga, SP</title>`, meta description, Open Graph com `hero-fachada.jpg`, `lang="pt-BR"`, JSON-LD `MedicalOrganization` com endereço e telefone.
- **Acessibilidade**: `alt` descritivo em todas as fotos (lista em CONTENT.md), contraste AA, foco visível dourado, navegação por teclado, tabela da seção 4 como `<table>` semântica.
- **Performance**: `loading="lazy"` em tudo menos o hero; `width`/`height` nas imagens; converter para WebP mantendo o JPG como fallback via `<picture>` (opcional).

## 7. Não fazer

- Não usar ícones genéricos nem emojis (exceto ícones de WhatsApp e Instagram na seção 16, em SVG inline monocromático `--c-ink`).
- Não inventar seções, depoimentos, formulários ou estatísticas.
- Não trocar fotos nem usar imagens de banco.
- Não publicar a pasta `reference/`.
- Não usar `localStorage`, cookies ou trackers.

## 8. Definição de pronto (checklist)

- [ ] As 16 seções existem na ordem e com os ids do §4.
- [ ] Screenshot de cada seção em 1456×819 comparado lado a lado com `reference/slide-XX.png` — posição, cor e tamanho de texto batem.
- [ ] Responsivo em 375px, 768px, 1024px, 1440px, 1920px sem scroll horizontal.
- [ ] Lighthouse ≥ 90 em Performance, Acessibilidade, Boas práticas e SEO.
- [ ] Todos os links de contato funcionam.
- [ ] Nenhum texto difere de `CONTENT.md`.
