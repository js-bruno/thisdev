---
name: Visual References
description: Busca referências visuais no Pinterest com custo controlado — estética, paleta, tipografia, layout e downloads selecionados
---

# Referências visuais

Use o servidor MCP `pinterest` para buscar referências e analisar imagens. O objetivo é responder ao briefing visual com o menor custo de contexto possível.

## Defaults econômicos

| Parâmetro | Valor | Motivo |
|---|---:|---|
| `limit` | 8 | 20 resultados custam ~3x mais tokens |
| `previews` | 4 | 4 thumbnails bastam para triagem |
| Thumbnail | 236px | ~60–80 tokens por imagem |
| Alta resolução | 736px, só 1–3 finalistas | ~700 tokens por imagem |
| Rodadas de busca | no máximo 2 | refine o termo; não repita |
| Downloads | só os escolhidos | download não retorna imagem, mas polui a pasta |

## Fluxo

1. **Briefing** — confirme em uma frase: estilo, paleta, tipo de interface e mood. Se o pedido já estiver claro, não pergunte.
2. **Busca** — use a busca do Pinterest com `limit: 8`, `previews: 4`, `media: "image"` e palavras em inglês (mais resultados).
3. **Triagem** — olhe as 4 thumbnails e descarte. Se o briefing ainda não estiver claro, faça no máximo uma segunda busca com termos diferentes.
4. **Finalistas** — para 1–3 pins, use `preview_images` com `size: "736x"` nas URLs escolhidas e analise:
   - paleta: cor dominante + 3–5 tons;
   - tipografia: serifada/sans, peso, contraste;
   - layout: grid, densidade, hierarquia;
   - mood: em uma frase.
5. **Download** — baixe só os finalistas para `~/Pictures/pinterest-refs/<tema>`.
6. **Entrega** — devolva uma tabela curta: título, link, paleta, por que serve. Não cole JSON bruto nem base64 na resposta.

## Guardrails

- Não peça `previews: 16` nem `limit: 20` na primeira rodada.
- Não use 736px para triagem; só para os finalistas.
- Não faça mais de 2 buscas sem o usuário pedir.
- Não baixe mais de 5 imagens por pedido.
- Se a thumbnail já responde, pare.
- Imagens do Pinterest são referência, não conteúdo publicável. Não copie para `src/` nem para o blog sem direitos.
- Se o servidor falhar, avise e ofereça buscar por palavras-chave/links em vez de insistir.

## Custo esperado

- 1 busca com 4 previews: ~1.500–2.000 tokens.
- 3 previews em 736px: ~2.100 tokens.
- Sessão típica: ~4–6k tokens, fração de centavo.
