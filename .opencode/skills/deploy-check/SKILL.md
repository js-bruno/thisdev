---
name: Deploy Check
description: Checklist pré-deploy do site Astro — types, build, status do git e rotas geradas
---

# Deploy check

Verifique e reporte. Não commite, não faça push e não rode `git add`.

## 1. Git

Rode `git status --short` e sinalize:

- arquivos inesperados: `.env`, credenciais, `node_modules`, `.astro/`;
- mudanças em `blog/` (é saída de build, mas é versionada);
- arquivos que não deveriam entrar no commit.

## 2. Tipos

Rode `npx astro check`. O resultado precisa ser **0 errors**.
Hints antigos são aceitáveis; liste-os.

## 3. Build

Rode `npm run build`. Precisa terminar com `Complete!`.
Lembre que ele roda o dither antes e limpa imagens fonte depois.

## 4. Rotas

Confirme que existem:

- `blog/index.html`
- `blog/blog/index.html`
- a rota do post alterado, se houver

## 5. Relatório

Responda com:

- veredito: `OK` ou `bloqueado`;
- comandos rodados e resultado;
- arquivos que não deveriam ir para o commit;
- se falhou, o erro exato e o próximo passo.
