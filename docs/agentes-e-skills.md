# Manual — agentes e skills

Guia de uso do que existe em `.opencode/` neste projeto. Para a lógica de economia
de tokens por trás dessas escolhas, veja o post `prompts-agentes-tokens`.

## Conceitos

| Recurso | O que é | Onde fica | Entra no contexto |
|---|---|---|---|
| `AGENTS.md` | fatos e convenções do projeto | raiz | sempre |
| Agente | perfil com prompt, permissões e modelo | `.opencode/agents/<id>.md` | quando selecionado |
| Skill | procedimento sob demanda | `.opencode/skills/<id>/SKILL.md` | só nome + descrição |

Um **subagente** roda em uma sessão filha, com contexto novo, e devolve apenas um
relatório. É a forma de explorar ou revisar sem inflar a conversa principal.

## Antes de começar

```sh
opencode reload          # após criar/editar agente ou skill
opencode debug agents    # lista os agentes carregados
```

Neste Linux o file watcher não funciona (`watcher backend not supported`), então
`reload` não é opcional: sem ele, arquivos novos não aparecem.

Atenção: `/agents` lista apenas agentes **principais**. Os subagentes deste projeto
(`reviewer`, `explorer`, `standards`) não aparecem lá por design — você os invoca
pela conversa.

## Agentes do projeto

### `reviewer`

Revisão de código somente-leitura. Não edita e não roda shell.

```text
Use o subagente reviewer para revisar meu diff atual.
```

Saída esperada: achados em ordem de severidade com `arquivo:linha`, o problema e a
correção sugerida. Se estiver tudo certo, responde “Sem achados.”.

Use quando: terminou uma mudança e quer uma segunda opinião antes de commitar.

### `explorer`

Mapeia código e devolve um resumo curto. Não edita, não roda shell e não acessa a web.

```text
Use o subagente explorer para mapear como os posts do blog são renderizados.
Use o subagente explorer para achar onde o tema claro/escuro é aplicado.
```

Saída: até 15 linhas, bullets com `arquivo:linha`. Ele para quando encontra a
resposta — não sai explorando o repositório inteiro.

Use quando: chegou em uma área desconhecida e não quer pagar a exploração no
contexto principal.

### `standards`

Guardião do padrão. Audita legibilidade, componentização e convenções, sem
implementar features. Pode rodar `npx astro check` e `npm run build`, mas não edita.

Três modos:

```text
Use o subagente standards em modo contrato antes de implementar o novo card.
Use o subagente standards para auditar meu diff.
Use o subagente standards para revisar src/components/ProjectMap.tsx.
```

- **contrato** — antes do código: lê implementações parecidas, lista o padrão a
  seguir, arquivos-modelo e armadilhas.
- **auditar** — depois do código: violações por severidade e refatoração mínima.
- **revisar componente** — foco em um arquivo.

Fluxo recomendado: **contrato → implementação → auditoria**.

### Agentes nativos

| Agente | Como usar |
|---|---|
| `build` | agente principal padrão; executa e edita |
| `plan` | explora e planeja sem editar; troca com `Shift+Tab` |
| `general` | subagente para pesquisa e tarefas multi-etapa |
| `explore` | subagente de busca e leitura |

`Shift+Tab` alterna agentes principais; `/agents` abre o seletor; `Ctrl+X` e depois
`A` também.

## Skills do projeto

### `new-post`

Cria um post em `src/content/blog` com frontmatter válido, e valida com o build.

```text
Use a skill new-post para escrever um post sobre economia de tokens.
```

O agente vai:

1. ler o schema em `src/content/config.ts` e posts recentes;
2. confirmar título, descrição, tags e rascunho;
3. rodar o script que gera o arquivo;
4. escrever o corpo;
5. rodar `npm run build` e conferir a rota gerada.

Uso manual do script (também serve para testar):

```sh
node .opencode/skills/new-post/scripts/new-post.mjs \
  --title "Meu post" \
  --description "Resumo curto" \
  --tags "ia,agentes" \
  --slug "meu-post" \
  --draft
```

| Flag | Obrigatória | Comportamento |
|---|---|---|
| `--title` | sim | vira o `title` do frontmatter |
| `--description` | não | vira o `description` |
| `--tags` | não | lista separada por vírgula; normaliza para kebab-case |
| `--slug` | não | nome do arquivo; sem ela, deriva do título |
| `--draft` | não | adiciona `draft: true` |

Regras que a skill já embute:

- data no formato `YYYY-MM-DD`;
- não sobrescreve arquivo existente;
- **não usar tabelas** no corpo (o projeto não tem `remark-gfm`);
- validar sempre com `npm run build`.

### `deploy-check`

Checklist antes de commitar/publicar. Não commita, não faz push, não roda `git add`.

```text
Use a skill deploy-check antes de eu commitar.
```

Ela verifica:

1. `git status --short` — arquivos inesperados, segredos, `node_modules`, `.astro/`;
2. `npx astro check` — precisa dar 0 errors;
3. `npm run build` — precisa terminar com `Complete!`;
4. rotas geradas em `blog/`;
5. relatório final com veredito `OK` ou `bloqueado`.

### `visual-refs`

Busca referências visuais no Pinterest com custo controlado: estética, paleta,
tipografia, layout e downloads selecionados.

```text
Use a skill visual-refs para buscar referências de dashboard escuro e minimalista.
```

Defaults que ela aplica:

| Parâmetro | Valor | Motivo |
|---|---:|---|
| `limit` | 8 | menos metadados por busca |
| `previews` | 4 | basta para triagem |
| Thumbnail | 236px | ~60–80 tokens por imagem |
| Alta resolução | 736px, só 1–3 finalistas | ~700 tokens por imagem |
| Buscas | no máximo 2 | evita repetição |
| Downloads | só os escolhidos | mantém a pasta limpa |

Custo medido: 1 busca com 5 resultados + 2 previews ≈ 1.450 tokens; 8 previews
em 736px ≈ 6.000 tokens. Uma sessão típica fica em ~4–6k tokens.

## MCP do Pinterest

O projeto usa o servidor local `@sunkimkk/pinterest-mcp@1.2.0`, sem login e sem
API key. A configuração fica em `opencode.jsonc`:

```jsonc
{
  "mcp": {
    "servers": {
      "pinterest": {
        "type": "local",
        "command": ["npx", "-y", "@sunkimkk/pinterest-mcp@1.2.0"],
        "codemode": false,
        "environment": {
          "MCP_PINTEREST_DOWNLOAD_DIR": "/home/lacon/Pictures/pinterest-refs"
        }
      }
    }
  }
}
```

- `codemode: false` entrega as thumbnails como imagem; no Code Mode padrão elas
  podem virar texto.
- Downloads vão para `~/Pictures/pinterest-refs`.
- É uma API web não oficial: pode quebrar quando o Pinterest mudar. Use como
  referência, não como conteúdo publicável.
- Desconecte em `/mcps` quando não estiver usando. O schema fixo custa ~1.650
  tokens por turno; com cache é quase nada, mas em sessões de código puro não há
  motivo para mantê-lo.

## Como criar um agente novo

1. Crie `.opencode/agents/<id>.md` (ou `~/.config/opencode/agents/` para global).
2. Frontmatter + corpo. O corpo é o system prompt.

```md
---
description: Explica o que o agente faz (o modelo usa isso para escolhê-lo)
mode: subagent
steps: 10
permissions:
  - action: edit
    resource: "*"
    effect: deny
---

Instruções do agente aqui.
```

Campos que importam:

| Campo | Observação |
|---|---|
| `mode` | `primary`, `subagent` ou `all`; padrão é `primary` |
| `description` | obrigatória na prática, principalmente para subagente |
| `model` | opcional; sem ela, herda o modelo da sessão pai |
| `steps` | limite de passos; ao atingir, o agente resume e para |
| `permissions` | regras em ordem; a última que casa vence |
| `hidden` | some das listas, mas continua utilizável |

Ações comuns de permissão: `read`, `edit`, `shell`, `webfetch`, `websearch`,
`subagent`, `skill`. Para shell, o `resource` é o texto do comando.

Depois de criar: `opencode reload` e confira com `opencode debug agents`.

Referências prontas: `.opencode/agents/standards.md` (permissões e prompt longo) e
`.opencode/agents/explorer.md` (formato de saída enxuto).

## Como criar uma skill nova

1. Crie a pasta `.opencode/skills/<id>/`.
2. Crie `SKILL.md` dentro dela. **O ID é o nome da pasta**, não o `name`.
3. Opcional: `references/` e `scripts/` ao lado, com caminhos relativos à pasta da skill.

```md
---
name: Nome de exibição
description: Quando usar esta skill (o modelo lê só isto antes de carregar)
---

# Título

## Passos
1. ...
2. ...
```

Detalhes:

- `description` é o gatilho. Descrição vaga = skill nunca escolhida.
- Arquivos de apoio **não** carregam sozinhos; a skill precisa mandar ler ou executar.
- `metadata: { opencode/autoinvoke: false }` esconde do modelo, mas permite chamar por ID.
- Permissões: `{ action: "skill", resource: "<id>", effect: "allow" }`.
- Depois de criar: `opencode reload`.

## Fluxos prontos

### Escrever um post

```text
Use a skill new-post para escrever sobre <tema>.
```

### Revisar uma mudança

```text
Use o subagente explorer para localizar <área>, se precisar.
Use o subagente standards para auditar meu diff.
Use o subagente reviewer para revisar bugs e regressões.
```

### Implementar sem sair do padrão

```text
Use o subagente standards em modo contrato antes de implementar <feature>.
```

Depois da implementação:

```text
Use o subagente standards para auditar o que mudou.
```

### Antes do deploy

```text
Use a skill deploy-check.
```

### Entender código desconhecido

```text
Use o subagente explorer para explicar como <fluxo> funciona.
```

## Solução de problemas

**Os agentes não aparecem em `/agents`.**
São subagentes. Invoque pela conversa. Para aparecerem no seletor, mude para
`mode: all`.

**A skill não aparece.**
Confira o ID pela pasta (não pelo `name`), se existe `description`, se
`opencode/autoinvoke` não está `false`, e rode `opencode reload`.

**O subagente foi bloqueado por permissão.**
Ajuste `permissions` no arquivo do agente. Para shell, libere o comando exato ou um
padrão como `npm run build*`. Regras específicas vêm depois do `deny` amplo.

**O subagente parou no meio.**
Atingiu `steps`. Aumente o valor no frontmatter ou divida a tarefa.

**Custou muitos tokens.**
Prefira subagente para exploração, uma sessão por tarefa, `/compact` antes de algo
pesado e `/btw` para dúvidas paralelas.

## Referência rápida

```sh
opencode reload                 # recarrega config, agentes e skills
opencode debug agents           # lista agentes carregados
opencode debug config           # mostra a config resolvida
opencode mcp list               # servidores MCP ativos
```

No TUI:

- `Shift+Tab` — alterna agentes principais
- `/agents` — seletor de agente
- `@` — busca arquivo para anexar
- `@<skill-id>` — força o uso de uma skill
- `/btw <pergunta>` — pergunta paralela sem entrar no histórico
- `/compact` — compacta a sessão manualmente
