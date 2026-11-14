# this_dev_astro

Site pessoal em Astro 4 com ilhas React. Build publicado em VPS via GitHub Actions
(`.github/workflows/deploy.yml` envia `blog/**` para `/var/www`).

## Comandos

- `npm run dev` — servidor local
- `npm run build` — `prebuild` (dither) + Astro + `postbuild` (limpeza)
- `npx astro check` — typecheck (não existe script dedicado)
- `npm run dither` — reprocessa `assets/raw/` para `public/assets/dither/`
- `npm run preview` — preview do build

## Estrutura

- `src/pages` — rotas; `src/layouts` — layouts; `src/components` — componentes
- `src/styles/global.css` — variáveis e estilos globais
- `src/data/*.ts` — dados estáticos com tipos exportados
- `src/lib` — utilitários
- `src/content/blog` e `src/content/photos` — conteúdo validado por `src/content/config.ts`
- `assets/raw` — imagens fonte; `public/assets/dither` — gerado, não editar
- `blog/` — **saída do build** (`outDir`), não editar
- `packages/` — workspace Ametrine UI isolado, não importado pelo site

## Convenções

- TypeScript estrito (`astro/tsconfigs/strict`): sem `any`, use `import type`.
- `.astro` para páginas, layouts e conteúdo estático; `.tsx` para interatividade.
- CSS: variáveis de `global.css` e `<style>` escopado nos `.astro`. Não adicionar framework de CSS.
- Componentes: um por arquivo, `export default` nos `.tsx`, props tipadas acima do componente.
- Identificadores em inglês; textos de interface em pt-BR.
- Frontmatter de conteúdo deve seguir o schema de `src/content/config.ts`. Não invente campos.

## Verificação

- Código alterado: `npx astro check && npm run build`
- Conteúdo alterado: `npm run build` (valida o schema)
- Nunca editar `blog/` nem `public/assets/dither/` à mão.

## Armadilhas

- O build sai em `blog/`, não em `dist/`.
- `prebuild` regenera imagens com `sharp`; o build depende disso.
- `packages/` tem `package.json` próprio: comandos npm rodam lá, não na raiz.
- `packages/` está excluído do `tsconfig.json` da raiz.
