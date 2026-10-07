# YAPI Pesquisa Clínica — site institucional

Site one-page feito a partir da apresentação institucional (16 slides). HTML, CSS e JavaScript puros, sem framework e sem build: `index.html`, `css/style.css`, `js/main.js` e `assets/img/`.

## Rodar localmente

Não precisa instalar nada. Qualquer servidor estático serve:

```bash
node tools/serve.js          # http://localhost:4173
# ou
npx serve .
# ou
python -m http.server 4173
```

## Publicar na Vercel

```bash
npm i -g vercel   # uma vez
vercel            # primeira vez: vincula o projeto (preview)
vercel --prod     # publica em produção
```

O `vercel.json` publica a pasta como site estático (sem install/build) com cache longo para `/assets/*`. O `.vercelignore` deixa de fora `reference/`, os `.md`, `tools/` e `node_modules/`.

Depois de definir o domínio, troque o `og:image` do `index.html` por uma URL absoluta (`https://seu-dominio/assets/img/hero-fachada.jpg`).

## Ferramentas de verificação (opcional)

```bash
npm install                    # Playwright, sharp, Lighthouse, html-validate
npx playwright install chromium
npm test                       # interações, textos de CONTENT.md e validação do HTML
npm run compare                # screenshots 1456×819 × reference/slide-XX.png (saída em tmp/compare/)
npm run responsive             # screenshots em 375/768/1024/1440/1920 + scroll horizontal
npm run webp                   # regenera os .webp a partir dos originais
```

Documentação do projeto: `CLAUDE.md` (regras), `DESIGN.md` (sistema visual), `CONTENT.md` (textos) e `BUILD-LOG.md` (decisões e pendências).
