# YAPI Pesquisa Clínica — site institucional

Site one-page feito a partir da apresentação institucional (16 slides). HTML, CSS e JavaScript puros, sem framework. O código-fonte fica na raiz (`index.html`, `css/style.css`, `js/main.js`, `assets/img/`); o build só copia e minifica para `dist/`.

## Rodar localmente

**Código-fonte** (sem instalar nada):

```bash
node tools/serve.js          # http://localhost:4173
```

**Build de produção:**

```bash
npm install
npm run build                # gera dist/ do zero
npm run preview              # serve dist/ em http://localhost:3000
```

O `npm run build`:
- copia para `dist/` só o que o site usa: `index.html`, CSS, JS, as imagens referenciadas (com os `.webp`), favicon, `robots.txt` e `sitemap.xml`;
- minifica HTML (html-minifier-terser), CSS e JS (esbuild), sem alterar os originais;
- põe hash no nome do CSS e do JS (`style.<hash>.css`, `main.<hash>.js`), o que permite cache de 1 ano;
- gera `dist/_headers` (regras de cache para a Cloudflare);
- confere se todo caminho de `dist/index.html` é relativo e existe em `dist/` (o build falha se algum estiver quebrado).

**Domínio:** `robots.txt` e `sitemap.xml` usam o placeholder `SITE_URL`. Quando houver domínio, defina a variável no build, e o placeholder é substituído; o `og:image` também passa a ser absoluto e entram `canonical` e `og:url`:

```bash
SITE_URL=https://www.seudominio.com.br npm run build
```

Na Vercel e na Cloudflare, cadastre `SITE_URL` como variável de ambiente do build.

> As imagens em `/assets/*` também têm cache de 1 ano. Se trocar uma foto, salve com **outro nome** (p.ex. `recepcao-1-v2.jpg`) para os visitantes receberem a nova.

## Deploy na Vercel (import do GitHub)

1. Acesse **vercel.com → Add New… → Project** e importe o repositório `BryanWalace/yapi`.
2. As configurações vêm do `vercel.json` (não precisa mudar nada):
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. (Opcional) Em **Environment Variables**, adicione `SITE_URL` com o domínio final.
4. Clique em **Deploy**. Cada push no `main` publica de novo automaticamente.
5. Domínio próprio: **Project → Settings → Domains**.

Pela linha de comando, como alternativa: `npm i -g vercel`, depois `vercel` (vincula o projeto) e `vercel --prod`.

## Deploy na Cloudflare (Workers com static assets)

A Cloudflare recomenda hoje **Workers** (e não Pages) para projetos novos. O `wrangler.toml` publica `dist/` como site estático, sem nenhum script de Worker; as regras de cache vêm de `dist/_headers`.

**Opção A — pelo terminal (wrangler):**

```bash
npx wrangler login           # uma vez: abre o navegador para autorizar
npm run deploy:cf            # = npm run build && npx wrangler deploy
```

O site fica em `https://yapi.<sua-conta>.workers.dev`. Para usar um domínio próprio: **Workers & Pages → yapi → Settings → Domains & Routes**.

**Opção B — pelo dashboard (deploy automático a cada push):**

1. **Workers & Pages → Create → Import a repository** e escolha `BryanWalace/yapi`.
2. Build command: `npm run build` · Deploy command: `npx wrangler deploy`.
3. (Opcional) Variável de build `SITE_URL` com o domínio final.
4. **Save and Deploy**.

> Prefere Cloudflare Pages? Também funciona com o mesmo `dist/`: `npm run build && npx wrangler pages deploy dist --project-name=yapi`.

## Ferramentas de verificação (opcional)

```bash
npx playwright install chromium
npm test                       # interações, textos de CONTENT.md e validação do HTML
SITE_DIR=dist node tools/check-ui.js   # os mesmos testes contra o build
node tools/check-dist.js       # com o preview rodando: console, requisições e imagens
npm run compare                # screenshots 1456×819 × reference/slide-XX.png (tmp/compare/)
npm run responsive             # screenshots em 375/768/1024/1440/1920 + scroll horizontal
npm run webp                   # regenera os .webp a partir dos originais
```

Documentação do projeto: `CLAUDE.md` (regras), `DESIGN.md` (sistema visual), `CONTENT.md` (textos) e `BUILD-LOG.md` (decisões e pendências).
