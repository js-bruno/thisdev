# Ametrine UI (workspace isolado)

Framework CSS + React com estética inspirada no tema Ametrine: acrílico fosco,
cantos arredondados com _edge highlight_, paleta ametrine (roxo + citrino) e
animações _bouncy_.

Este workspace é **totalmente isolado do blog Astro** na raiz do repositório.
Nada aqui é importado pelo site; a única forma de visualizar é pelo Storybook.

## Estrutura

```
packages/
├─ core/   @thisdev/ui        CSS puro (@layer + CSS vars), zero runtime
├─ react/  @thisdev/ui-react  wrappers React + stories
└─ docs/   @thisdev/ui-docs   Storybook (documentação)
```

## Comandos

Instalar dependências (apenas deste workspace):

```sh
npm install --prefix packages
```

Subir o Storybook (docs dos componentes) em http://localhost:6006:

```sh
npm run storybook --prefix packages
```

Gerar o Storybook estático:

```sh
npm run build-storybook --prefix packages
```

Build dos pacotes (CSS + React):

```sh
npm run build --prefix packages
```

Typecheck do pacote React:

```sh
npm run typecheck --prefix packages
```

## Uso (quando for integrar em algum projeto)

```tsx
import "@thisdev/ui/styles.css";
import { Button, Card, Callout } from "@thisdev/ui-react";
```

Envolva a aplicação com a classe raiz e escolha o tema:

```html
<div class="aui-root" data-theme="dark">
  <!-- ... -->
</div>
```

### Tokens

Todo o tema deriva de poucos tokens. Para mudar a cor de destaque, basta trocar
a matiz (`--aui-hue`, `--aui-hue-2`):

```css
:root {
  --aui-hue: 295; /* ametista */
  --aui-hue-2: 82; /* citrino */
}
```

## Componentes

- **Ações**: Button, IconButton, Link
- **Exibição**: Badge, Tag, Card, Avatar, Divider, Table, CodeBlock
- **Formulários**: Field, Input, Textarea, Select, Checkbox, Radio, Switch
- **Feedback**: Callout, Spinner, Progress, Skeleton
- **Navegação**: Tabs, Accordion, Breadcrumb, Navbar
- **Overlays**: Dialog, Tooltip
- **Layout**: Container, Stack, Cluster, Grid

## Build

O CSS é empacotado com `esbuild` (compatível com NixOS). O pacote React usa
Vite em modo library + `vite-plugin-dts`, com `react`/`react-dom` externalizados.
