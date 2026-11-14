---
title: Prompts melhores, menos tokens
description: O que aprendi ajustando agentes, contexto e sessões para gastar menos token sem perder qualidade
date: 2026-11-14
tags:
  - ia
  - agentes
  - produtividade
---

Toda vez que você manda uma mensagem para um agente, ele não recebe só aquela
mensagem. Recebe o system prompt, os schemas das ferramentas, as instruções do
projeto, todo o histórico da sessão e cada saída de ferramenta que já passou por
ali. O seu prompt é a menor parte da conta.

Por isso, "escrever prompts melhores" rende pouco se o contexto em volta
continua inflado. O que funciona é atacar as duas pontas: pedir melhor e parar
de arrastar lixo.

## 1. Ensine o projeto uma vez, não em toda sessão

O maior desperdício que eu tinha era repetir o óbvio: quais comandos rodar, onde
fica cada coisa, o que não pode ser editado. Isso vira dezenas de `read` e
`grep` exploratórios por sessão — e tudo isso fica no contexto para sempre.

A solução é um `AGENTS.md` na raiz:

```md
# meu-projeto

## Comandos
- `npm run dev` — servidor local
- `npm run build` — build de produção
- `npx astro check` — typecheck

## Convenções
- TypeScript estrito, sem `any`.
- Componentes em `src/components`, um por arquivo.
- Não editar `blog/` nem arquivos gerados.

## Armadilhas
- O build sai em `blog/`, não em `dist/`.
```

Duas regras: seja curto (50 a 100 linhas) e só escreva o que o agente **não**
descobre lendo o código. Instrução óbvia é custo fixo em todo request.

## 2. Peça com alvo e critério de pronto

Prompt vago gera iteração. Iteração gera contexto. Contexto gera custo.

Ruim:

```text
arruma o layout da página inicial
```

Bom:

```text
Corrija o alinhamento do hero em src/components/Hero.astro.
Pronto quando `npm run build` passar e o hero não quebrar em telas de 375px.
```

O segundo prompt custa algumas linhas a mais e economiza três rodadas de
tentativa e erro. Quase sempre vale.

## 3. Aponte o arquivo em vez de colar o conteúdo

Colar um arquivo inteiro duplica tokens: ele já está no disco, o agente pode ler
só o trecho que precisa. Use `@caminho/arquivo` no TUI, ou cite o caminho com a
faixa de linhas.

```text
Explique @src/layouts/BlogPostLayout.astro#20-45
```

## 4. Peça plano antes de código em tarefa grande

Em tarefa pequena, plano é burocracia. Em tarefa grande, plano é economia: um
erro de direção descoberto no plano custa uma resposta; descoberto depois de
cinco arquivos editados custa a sessão inteira.

```text
Antes de editar, liste os arquivos que vai tocar e a abordagem.
Não escreva código ainda.
```

## 5. Delegue exploração para subagentes

Subagente roda em uma sessão filha, com contexto novo, e devolve só um
relatório. A exploração inteira — arquivos lidos, buscas, tentativas — fica lá,
não no seu contexto principal.

```text
Use o subagente explorer para mapear como os posts são renderizados.
```

O ganho é dobrado: você não paga a exploração no histórico e recebe um resumo
curto em vez de um despejo de código. Vale o mesmo para revisão de diff.

## 6. Skills em vez de instruções gigantes

Se você tem um procedimento que repete — publicar post, fazer release, rodar
checklist de deploy — não enfie tudo no `AGENTS.md`. Coloque em uma skill.

A diferença é o que entra no contexto: da skill, só **nome e descrição**
aparecem. O corpo é carregado quando ela é usada. É a mesma lógica de importar
um módulo em vez de colar o arquivo inteiro no início do programa.

## 7. Configure a compactação

Sessão longa uma hora vai encher o contexto. A compactação troca a conversa
antiga por um resumo, mas vale ajustar:

```jsonc
{
  "compaction": {
    "auto": true,
    "keep": { "tokens": 15000 },
    "buffer": 32000
  },
  "agents": {
    "compaction": { "model": "opencode-go/deepseek-v4.1-flash" }
  }
}
```

- `buffer` mantém espaço livre para a compactação acontecer antes de estourar,
  evitando o erro de contexto cheio e o retry caro.
- `keep` preserva os tokens recentes, onde normalmente está o detalhe da tarefa.
- Usar um modelo barato só para resumir não muda a qualidade do trabalho.

Detalhe que descobri na prática: a documentação aceita `"buffer": "20%"`, mas a
versão que eu uso ignorou o percentual em silêncio. Com um número de tokens
funcionou.

## 8. Uma sessão por tarefa

Esse é o hábito mais barato de todos e o que eu mais esquecia.

- Tarefa nova, sessão nova. Histórico irrelevante é imposto.
- Use `/compact` antes de começar algo pesado, em vez de deixar a compactação
  automática acontecer no meio do trabalho.
- Use `/btw` para perguntas paralelas: a resposta usa o contexto, mas não entra
  na conversa, então não encarece os prompts seguintes.
- Peça respostas curtas quando só precisa da conclusão.

## 9. Cuidado com MCPs

Cada servidor MCP adiciona schemas de ferramentas em **todo** request. Não é
custo por uso, é custo fixo. Se você não usa um servidor todo dia, ele está
pagando aluguel no seu contexto sem fazer nada.

Vale revisar a lista de tempos em tempos e remover o que virou peso morto.

## O que eu faço na prática

1. `AGENTS.md` curto com comandos, convenções e armadilhas.
2. Prompt com alvo, restrição e critério de pronto.
3. Arquivo apontado, não colado.
4. Plano antes de mexer em mais de um arquivo.
5. Exploração e revisão em subagente.
6. Procedimento recorrente em skill.
7. Compactação configurada, resumo em modelo barato.
8. Sessão nova por tarefa e `/btw` para dúvidas paralelas.
9. Auditoria de MCPs de vez em quando.

Nada disso é sobre escrever um prompt mais bonito. É sobre parar de pagar duas
vezes pela mesma informação: uma quando você explica, outra quando o agente
redescobre sozinho.
