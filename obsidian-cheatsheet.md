# 🗒️ Obsidian — Cheatsheet

> Referência rápida de sintaxe, atalhos e recursos do Obsidian.
> Compatível com Obsidian 1.x (Markdown + extensões próprias).

---

## 📝 Markdown básico

```markdown
# Título H1
## Título H2
### Título H3

**negrito**        __negrito__
*itálico*          _itálico_
***negrito+itálico***
~~riscado~~
==destacado==
`código inline`

> citação
>> citação aninhada

---                (linha horizontal)

- item
  - subitem
1. numerado
- [ ] tarefa pendente
- [x] tarefa concluída
```

### Links

```markdown
[texto](https://exemplo.com)      link externo
[texto](Nota)                     link para nota (markdown)
[[Nome da Nota]]                  wikilink
[[Nome da Nota|texto exibido]]    wikilink com alias
[[Nome da Nota#Seção]]            link para heading
[[Nome da Nota#^bloco]]           link para bloco
![[Nome da Nota]]                 embed da nota inteira
![[imagem.png]]                   embed de imagem
![[imagem.png|300]]               imagem com largura 300
[^1]                              referência de nota de rodapé

[^1]: texto da nota de rodapé
```

### Imagens e mídia

```markdown
![alt](caminho/imagem.png)        imagem padrão
![[imagem.png]]                   imagem via wikilink (recomendado)
![[imagem.png|200x150]]           largura x altura
![[audio.mp3]]                    áudio embutido
![[video.mp4]]                    vídeo embutido
![[documento.pdf]]                PDF embutido
```

### Código

````markdown
```js
console.log("hello");
```

`código inline`
````

---

## 🧱 Callouts (blocos destacados)

```markdown
> [!note] Título opcional
> Conteúdo do callout.

> [!warning]
> Cuidado com isso.

> [!tip]- Recolhido por padrão
> O `-` deixa o bloco fechado.

> [!info]+ Aberto por padrão
> O `+` deixa o bloco aberto.
```

Tipos disponíveis:

| Tipo | Alias |
|------|-------|
| `note` | — |
| `abstract` | `summary`, `tldr` |
| `info` | — |
| `todo` | — |
| `tip` | `hint`, `important` |
| `success` | `check`, `done` |
| `question` | `help`, `faq` |
| `warning` | `caution`, `attention` |
| `failure` | `fail`, `missing` |
| `danger` | `error` |
| `bug` | — |
| `example` | — |
| `quote` | `cite` |

Callouts podem ser aninhados:

```markdown
> [!question] Pergunta
> > [!success] Resposta
> > Aqui vai a resposta.
```

---

## 🏷️ Tags

```markdown
#projeto
#projeto/ativo          tag aninhada
#area/saude/treino      múltiplos níveis
```

- Não use espaços; use `-` ou `_` (`#minha-tag`).
- Tags funcionam no corpo da nota ou na propriedade `tags`.
- Buscar: `tag:#projeto` ou `#projeto` no campo de busca.

---

## 📌 Propriedades (frontmatter)

```markdown
---
title: Minha Nota
aliases:
  - apelido
  - outro apelido
tags:
  - projeto
  - importante
created: 2026-11-11
due: 2026-12-01
status: em-andamento
rating: 5
done: false
author: "[[Fulano]]"
cssclasses:
  - wide
---
```

Tipos: `text`, `number`, `checkbox`, `date`, `datetime`, `list`, `tags`.

- `aliases` cria nomes alternativos para o wikilink.
- `cssclasses` aplica classes CSS customizadas.
- Abrir/ocultar frontmatter: comando `Toggle properties` ou nas configurações.

---

## 🔍 Busca (Search)

| Operador | Exemplo | Função |
|----------|---------|--------|
| `path:` | `path:pasta/` | busca no caminho |
| `file:` | `file:nota` | nome do arquivo |
| `content:` | `content:palavra` | conteúdo |
| `tag:` | `tag:#projeto` | tag |
| `line:` | `line:(a b)` | mesma linha |
| `block:` | `block:(a b)` | mesmo bloco |
| `section:` | `section:(a b)` | mesma seção |
| `task:` | `task:done` | tarefas (`todo`, `done`, etc.) |
| `task-todo:` | `task-todo:""` | tarefas sem texto |
| `match-case:` | `match-case:Obsidian` | diferencia maiúsculas |
| `ignore-case:` | `ignore-case:obsidian` | ignora caixa |
| `-` | `-tag:#x` | negação |
| `OR` | `a OR b` | ou lógico |
| `"..."` | `"frase exata"` | frase exata |
| `*` | `obs*` | curinga |
| `//` | `/padr[ae]o/` | regex |

Exemplos:

```text
path:"Diário" tag:#pessoal "hoje"
file:.md -tag:#arquivo
task:todo due:2026-11-11
```

### Busca avançada / Dataview-like

```text
[propriedade:valor]        busca em propriedades
["campo":valor]
```

---

## ⌨️ Atalhos essenciais (padrão)

> Podem variar por tema/teclado. Veja em **Configurações → Atalhos**.

| Ação | Atalho |
|------|--------|
| Paleta de comandos | `Ctrl/Cmd + P` |
| Busca rápida (Quick Switcher) | `Ctrl/Cmd + O` |
| Busca global | `Ctrl/Cmd + Shift + F` |
| Nova nota | `Ctrl/Cmd + N` |
| Nova aba | `Ctrl/Cmd + T` |
| Fechar aba | `Ctrl/Cmd + W` |
| Abrir em nova janela | `Ctrl/Cmd + Shift + N` |
| Alternar modo leitura/edição | `Ctrl/Cmd + E` |
| Alternar barra lateral esquerda | `Ctrl/Cmd + Shift + L`? → `Ctrl/Cmd + B`* |
| Alternar barra lateral direita | `Ctrl/Cmd + Shift + B`? → `Ctrl/Cmd + R`* |
| Link rápido `[[` | digitar `[[` |
| Inserir template | variável |
| Negrito | `Ctrl/Cmd + B` |
| Itálico | `Ctrl/Cmd + I` |
| Destacado | `Ctrl/Cmd + Shift + H` |
| Código inline | `Ctrl/Cmd + E` (em edição) |
| Checklist | `Ctrl/Cmd + L` |
| Mover linha para cima/baixo | `Alt + ↑ / ↓` |
| Duplicar linha | `Ctrl/Cmd + Shift + D` |
| Zoom in/out | `Ctrl/Cmd + = / -` |
| Abrir grafo | `Ctrl/Cmd + G` |
| Abrir grafo local | `Ctrl/Cmd + Shift + G` |
| Abrir painel de tags | `Ctrl/Cmd + Shift + T`? → variável |
| Alternar tema | comando `Toggle theme` |

\* Consulte **Configurações → Atalhos** para o valor exato na sua instalação.

---

## 🧩 Templates

### Template simples (plugin nativo "Templates")

```markdown
---
created: {{date}}
tags:
  - 
---

# {{title}}

## Contexto


## Notas


## Tarefas
- [ ] 
```

Variáveis nativas: `{{date}}`, `{{time}}`, `{{title}}`.

Formatos: `{{date:YYYY-MM-DD}}`, `{{time:HH:mm}}`.

### Plugin Templater (recomendado)

```markdown
<% tp.date.now("YYYY-MM-DD") %>
<% tp.file.title %>
<% tp.file.creation_date("YYYY-MM-DD HH:mm") %>
<% tp.system.prompt("Nome do projeto") %>
<% tp.web.daily_quote() %>
```

---

## ✅ Tarefas

```markdown
- [ ] pendente
- [x] concluída
- [/] em andamento      (precisa de plugin/tema)
- [-] cancelada         (precisa de plugin/tema)
- [?] dúvida            (precisa de plugin/tema)
```

Consultas de tarefas:

```text
task:todo
task:done
task:todo path:"Projetos"
```

Plugins úteis: **Tasks**, **Dataview**, **Checklist**.

---

## 📊 Dataview (plugin)

```dataview
TABLE status, due, rating
FROM #projeto
WHERE status != "concluído"
SORT due ASC
```

```dataview
LIST
FROM "Diário"
WHERE file.day >= date(2026-01-01)
```

```dataview
TASK
FROM #tarefas
WHERE !completed
```

```dataview
TABLE WITHOUT ID file.link AS "Nota", length(file.inlinks) AS "Backlinks"
FROM ""
SORT length(file.inlinks) DESC
LIMIT 10
```

Campos úteis: `file.name`, `file.path`, `file.link`, `file.mtime`, `file.ctime`, `file.tags`, `file.inlinks`, `file.outlinks`.

---

## 🗓️ Notas diárias (Daily Notes)

```markdown
## {{date:dddd, DD [de] MMMM [de] YYYY}}

### Foco do dia
- 

### Tarefas
- [ ] 

### Diário


### Gratidão
- 
```

Configuração: **Configurações → Notas diárias** (formato, pasta, template).

Plugins relacionados: **Periodic Notes**, **Calendar**, **Journals**.

---

## 🕸️ Grafo e backlinks

- `[[Nota]]` cria backlink automático.
- Painel **Backlinks** mostra quem aponta para a nota atual.
- **Grafo global** (`Ctrl/Cmd + G`) e **grafo local**.
- **Unlinked mentions**: mencione o nome da nota sem wikilink e o Obsidian sugere o link.
- Renomear nota atualiza os links automaticamente (se "Automatically update internal links" estiver ativo).

---

## 🎨 Canvas

Arquivo `.canvas` (JSON). Recursos:

- Cards de texto, notas, sites e mídia.
- Conexões com setas e rótulos.
- Agrupar com frames.
- Cores por card/grupo.
- Exportar como imagem.

---

## 🔌 Plugins nativos (Core)

Ativar em **Configurações → Plugins principais**:

| Plugin | Função |
|--------|--------|
| Backlinks | links de entrada |
| Canvas | quadro visual |
| Comandos | comandos rápidos |
| Notas diárias | diário |
| Exportar | PDF, HTML |
| Grafo | visualização |
| Gravador de áudio | notas de voz |
| Modelos (Templates) | templates |
| Notas aleatórias | descoberta |
| Palavras-chave (Tags) | gestão de tags |
| Pesquisa | busca |
| Spaces / Workspaces | layouts salvos |
| Sync / Publish | serviços pagos |

## 🧰 Plugins da comunidade (favoritos)

- **Dataview** — consultas tipo banco de dados.
- **Templater** — templates com lógica.
- **Tasks** — gestão de tarefas.
- **Calendar** — calendário de notas diárias.
- **Excalidraw** — desenho à mão.
- **Kanban** — quadros kanban.
- **Advanced Tables** — tabelas fáceis.
- **QuickAdd** — captura rápida.
- **Obsidian Git** — versionamento.
- **Style Settings** — customização de temas.
- **Linter** — padronização de notas.
- **Iconize** — ícones em notas/pastas.
- **Smart Connections** / **Copilot** — IA.

> ⚠️ Plugins da comunidade rodam código local. Instale apenas de fontes confiáveis.

---

## 📁 Estrutura recomendada (vault)

```text
Vault/
├── 00-Inbox/          captura rápida
├── 01-Diário/         notas diárias
├── 02-Projetos/       projetos ativos
├── 03-Áreas/          responsabilidades contínuas
├── 04-Recursos/       referências
├── 05-Arquivo/        concluídos
├── Templates/
├── Anexos/            imagens, PDFs
└── Home.md            nota índice (MOC)
```

### MOC (Map of Content)

```markdown
# 🗺️ Mapa — Projetos

## Ativos
- [[Projeto A]]
- [[Projeto B]]

## Concluídos
- [[Projeto antigo]]

## Referências
- [[Livro X]]
```

---

## ⚙️ Configurações úteis

- **Arquivos e links**
  - *New link format*: `Shortest path` ou `Relative path`.
  - *Use [[Wikilinks]]*: ativado.
  - *Automatically update internal links*: ativado.
  - *Default location for new notes*: pasta específica.
- **Aparência**
  - Temas: Minimal, Things, AnuPpuccin, Catppuccin.
  - *CSS snippets* em `.obsidian/snippets/`.
- **Editor**
  - *Show line number*, *Readable line length*, *Spellcheck*.
- **Backup**
  - Copie a pasta `.obsidian/` para preservar configurações.
  - Sincronize o vault via Git, Syncthing, iCloud, etc.

---

## 🧪 CSS snippets

`Arquivo → Abrir pasta de snippets` → criar `custom.css`:

```css
/* Deixa o texto mais confortável */
.markdown-preview-view {
  line-height: 1.7;
}

/* Oculta o título H1 duplicado */
.markdown-preview-view h1:first-of-type {
  display: none;
}
```

Ativar em **Configurações → Aparência → Snippets de CSS**.

---

## 🧭 Dicas rápidas

1. Digite `[[` para linkar; `![[` para embutir.
2. `Ctrl/Cmd + clique` abre link em nova aba.
3. `Ctrl/Cmd + P` é o canivete suíço — aprenda os comandos por ali.
4. Use **aliases** para nomes alternativos sem duplicar notas.
5. Padronize frontmatter com **Templater**.
6. Prefira links a pastas: o grafo cresce melhor.
7. Use `#tags` para estado e `[[links]]` para conceitos.
8. Faça backup do vault (Git/Sync) antes de plugins experimentais.
9. `Ctrl/Cmd + Shift + F` busca em todo o vault.
10. Mantenha um `Home.md` como ponto de entrada.

---

## 🔗 Referências

- Documentação oficial: <https://help.obsidian.md>
- Fórum: <https://forum.obsidian.md>
- Plugins: <https://obsidian.md/plugins>
- Temas: <https://obsidian.md/themes>

---

*Última atualização: 2026-11-11*
