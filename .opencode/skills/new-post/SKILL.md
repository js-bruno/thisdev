---
name: New Blog Post
description: Cria um post em src/content/blog seguindo o schema, o tom do blog e valida com o build
---

# Novo post

## 1. Contexto

- Leia `src/content/config.ts` para confirmar os campos aceitos.
- Leia 2 posts recentes em `src/content/blog/` para captar o tom.
- Confirme com o usuário: título, descrição, tags e se é rascunho.

## 2. Gerar o arquivo

A partir da raiz do projeto:

```sh
node .opencode/skills/new-post/scripts/new-post.mjs \
  --title "Título do post" \
  --description "Resumo curto" \
  --tags "ia,agentes" \
  --slug "meu-post"
```

- `--slug` é opcional; sem ele, o script deriva do título.
- `--draft` adiciona `draft: true`.
- O script não sobrescreve arquivo existente.

## 3. Escrever o corpo

- Edite o arquivo criado, mantendo o frontmatter gerado.
- Português, tom pessoal e informal, como os posts existentes.
- Headings com `##`; blocos de código sempre com linguagem.
- **Não use tabelas**: o projeto não tem `remark-gfm`.

## 4. Validar

- Rode `npm run build`.
- Confirme que `blog/blog/<slug>/index.html` foi gerado.
- Se o schema falhar, corrija o frontmatter; não invente campos.
