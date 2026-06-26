---
title: Nixos minecraft server
description: criando um servidor de minecraft declarativo com nixos ❄️
date: 2026-06-20
tags: my
---
## um dia normar
nesse final de semanal eu comecei a tentar escrever um servidor de minecraft declarativo para  meu grupo de amigos meu
como a declartivade  do nixos e muito conveniente para configurar servicos eu optei criar todo ambiente infraestura nessa lingaugem.

## Objetivo e Problematica
Lendo a [ documentacao do nixos ](https://wiki.nixos.org/wiki/Minecraft_Server) da pra perceber que ele tem uma otima integracao built-in com o 
minecraft-server, o unico problema, meu problema na verdade e que ainda eu nao sei o usar flake e meu conhecimento com a lingaugem nix e bem limitado
vou usar esse projeto pra aprender mais da linguagem e o objetivo dele e *ter um servidor declarativo de minecraft com mods, que eu possa subir quando quiser em qualquer maquina sem problemas.*

## Servidor configurado em localhost
Logo de cara da pra configurar um servidor de minecrat vanilla bem facilmente so com a documentacao, pra comecar com ajuda de um video do [vimjoyer](https://www.youtube.com/watch?v=Fph7SMldxpI&t=1s)(sim eu aprendo melhor assistindo tutorias)
eu criar um modulo nix apenas para o servidor de minecraft e importar no meu configuration.nix.

```minecraft_serve.nix
{pkgs, lib, ...}:
{
  services.minecraft-server = {
    package = pkgs.papermc;
    enable = true;
    eula = true;
    declarative = true;
    openFirewall = true;
    jvmOpts = "-Xms2048M -Xmx2048M"; 
    
    serverProperties = {
      online-mode = false;
      server-port = 43000;
      difficulty = 3;
      gamemode = 0;
      max-players = 5;
      motd = "NixOS Minecraft server!";
      white-list = false;
      enable-rcon = true;
      "rcon.password" = "hunter2";
    };
    # whitelist = {
    #   username1 = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
    #   username2 = "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy";
    # };
  };
}
```
muito interessante reconher alguns parametros que sao repassados desse arquivo declarativo para o servidor do minecrat na compilacao.
como eu ainda nao sei flake esse arquivo esta importado na minha configuration.nix e esta inicializando com a minha maquina me custando 2G de memoria com 0 players no servidor T___T.

## MOds no meu client
Meu amigo(matteuszinho) me mandou uma lista de mods essesiais para o client do minecraft e 
mais alguns outros para o servidor, mas vou entrar nesse assunto posteriormente.
vou tentar instalar todos, separei aqui por categorias e descrevendo o que faz cada mod.


### 🛠️ APIs e Bibliotecas Base
*Mods técnicos que rodam nos bastidores e são necessários para que outros mods funcionem corretamente.*
* **[Architectury API](https://www.curseforge.com/minecraft/mc-mods/architectury-api)**: Biblioteca técnica necessária para o funcionamento de vários outros mods.
* **[Balm](https://www.curseforge.com/minecraft/mc-mods/balm)**: Biblioteca técnica necessária para os mods do desenvolvedor BlayTheNinth.
* **[BCLib Neoforge](https://www.curseforge.com/minecraft/mc-mods/bclib)**: Biblioteca base necessária para a geração dos mods BetterEnd e BetterNether.
* **[Cloth Config API](https://www.curseforge.com/minecraft/mc-mods/cloth-config)**: Tela de configuração técnica usada internamente por dezenas de outros mods.
* **[Collective](https://www.curseforge.com/minecraft/mc-mods/collective)**: Biblioteca de código compartilhada para todos os mods do criador Serilum.
* **[CreativeCore](https://www.curseforge.com/minecraft/mc-mods/creativecore)**: Biblioteca técnica essencial para mods de física, som e interface.
* **[Cristel Lib](https://www.curseforge.com/minecraft/mc-mods/cristellib)**: Biblioteca de código exigida por mods focados em estruturas, como o Towns and Towers.
* **[Forge Config API Port](https://modrinth.com/mod/forge-config-api-port)**: Ferramenta que garante compatibilidade para os arquivos de configuração entre diferentes plataformas de mods.
* **[GlitchCore](https://www.curseforge.com/minecraft/mc-mods/glitchcore)**: Biblioteca base técnica exigida por mods do desenvolvedor Glitchfiend (como o Serene Seasons).
* **[JamLib](https://modrinth.com/mod/jamlib)**: Biblioteca de código de suporte para mods específicos.
* **[Lithostitched](https://modrinth.com/mod/lithostitched)**: API para personalização avançada na geração de terrenos e mundos do jogo.
* **[Player Animator](https://www.curseforge.com/minecraft/mc-mods/playeranimator)**: Biblioteca que permite animações personalizadas, fluídas e complexas para o modelo do jogador.
* **[Puzzles Lib](https://www.curseforge.com/minecraft/mc-mods/puzzles-lib)**: Biblioteca de código unificada usada por dezenas de pequenos mods do autor Fuzs.
* **[Sophisticated Core](https://www.curseforge.com/minecraft/mc-mods/sophisticatedcore)**: Base de código essencial para o funcionamento correto do mod de mochilas.
* **[TerraBlender](https://www.curseforge.com/minecraft/mc-mods/terrablender)**: Ajuda a integrar novos biomas criados por mods suavemente no gerador de mundo do Minecraft.
* **[WorldWeaver Neoforge](https://modrinth.com/mod/worldweaver)**: Biblioteca para integração customizada de estruturas e geração de mundos em mods.
* **[WunderLib Neoforge](https://modrinth.com/mod/wunderlib)**: Biblioteca base de código auxiliar usada em conjunto com outros mods utilitários.
* **[YetAnotherConfigLib](https://modrinth.com/mod/yacl)**: Biblioteca focada na criação de menus de configuração limpos e bem projetados para os mods do seu pacote.
---
### ⚡ Otimização e Desempenho
*Mods focados em aumentar o FPS, renderização e eliminar lag.*
* **[Distant Horizons](https://modrinth.com/mod/distant-horizons)**: Adiciona um sistema de Nível de Detalhe (LOD) que permite ver distâncias gigantescas (centenas de chunks) sem causar lag.
* **[ImmediatelyFast](https://modrinth.com/mod/immediatelyfast)**: Otimiza fortemente o código do jogo, focado em acelerar a renderização da interface, mobs e partículas.
* **[Sodium](https://modrinth.com/mod/sodium)**: Motor de renderização alternativo que aumenta absurdamente o seu FPS e remove travamentos (stutters).
---
### 🌍 Geração de Mundo e Estruturas
*Mods que alteram as dimensões, adicionam novos biomas, ruínas e construções pelo mapa.*
* **[BetterEnd Neoforge](https://www.curseforge.com/minecraft/mc-mods/betterend)**: Reformula completamente a dimensão do The End com dezenas de novos biomas, blocos e criaturas.
* **[BetterNether Neoforge](https://www.curseforge.com/minecraft/mc-mods/betternether)**: Expande massivamente o Nether com novos biomas, plantas, materiais e estruturas.
* **[Dungeons and Taverns](https://modrinth.com/mod/dungeons-and-taverns)**: Adiciona diversas novas estruturas e masmorras geradas proceduralmente pelo mundo para explorar.
* **[Hopo Better Underwater Ruins](https://www.curseforge.com/minecraft/mc-mods/hopo-better-underwater-ruins)**: Revitaliza as ruínas subaquáticas do oceano com construções maiores, novos detalhes e saques melhores.
* **[Structory](https://modrinth.com/mod/structory)**: Adiciona novas construções e ruínas misteriosas abandonadas na natureza, muito bem encaixadas com o visual clássico do jogo.
* **[Terralith](https://modrinth.com/mod/terralith)**: Melhora incrivelmente a geração de montanhas, cavernas e vales no Overworld, usando apenas blocos originais do jogo.
* **[Towns and Towers](https://www.curseforge.com/minecraft/mc-mods/towns-and-towers)**: Introduz novos postos avançados de Pillagers e aldeias épicas focadas na estética de cada bioma.
---
### 🎒 Inventário e Armazenamento
*Facilidades para carregar itens e organizar seus pertences.*
* **[Gero's Backpacks!](https://modrinth.com/mod/geros-backpacks)**: Adiciona mochilas práticas e equilibradas para expandir a capacidade do seu inventário.
* **[Nemo's Inventory Transit](https://www.curseforge.com/minecraft/search?class=mc-mods&search=Nemo%27s)**: Mod focado em otimizar e gerenciar a movimentação/transição de itens no inventário.
* **[Sophisticated Backpacks](https://www.curseforge.com/minecraft/mc-mods/sophisticated-backpacks)**: Mochilas extremamente avançadas que podem ser coloridas, colocadas no chão e receber módulos (upgrades de fornalha, ímã, etc).
* **[TrashSlot](https://www.curseforge.com/minecraft/mc-mods/trashslot)**: Adiciona uma lixeira no canto do seu inventário onde você pode jogar fora ou deletar itens sem precisar jogá-los no chão.
---
### ✨ Visual, Áudio e Câmera
*Melhorias imersivas para gráficos, sons, física e perspectiva.*
* **[AmbientSounds 6](https://www.curseforge.com/minecraft/mc-mods/ambientsounds)**: Adiciona sons ambientes imersivos e dinâmicos de acordo com o bioma e a área.
* **[Armor Stand Arms](https://www.curseforge.com/minecraft/search?class=mc-mods&search=Armor+Stand+Arms)**: Faz com que os suportes de armadura venham com braços visíveis por padrão.
* **[[EMF] Entity Model Features](https://modrinth.com/mod/entity-model-features)**: Permite que pacotes de textura alterem os modelos (formatos 3D) das entidades, uma função clássica do OptiFine.
* **[[ETF] Entity Texture Features](https://modrinth.com/mod/entitytexturefeatures)**: Habilita texturas aleatórias e brilho (emissividade) nos mobs e entidades.
* **[Iris Shaders](https://modrinth.com/mod/iris)**: Suporte moderno e de alto desempenho para o uso de pacotes de Shaders (sombras e iluminação realista).
* **[ItemPhysic Full](https://www.curseforge.com/minecraft/mc-mods/itemphysic)**: Dá peso e física realista aos itens jogados no chão (eles rolam, deitam e flutuam em líquidos diferentes).
* **[Shoulder Surfing Reloaded](https://www.curseforge.com/minecraft/mc-mods/shoulder-surfing-reloaded)**: Substitui a câmera de terceira pessoa padrão por uma visão sobre o ombro fluida (estilo jogos de RPG de ação).
* **[Sound Physics Remastered](https://modrinth.com/mod/sound-physics-remastered)**: Aplica física real aos sons, gerando ecos profundos em cavernas e abafando ruídos que vêm de trás de paredes grossas.
* **[YDM's Weapon Master](https://www.curseforge.com/minecraft/mc-mods/ydms-weapon-master)**: Exibe visualmente as suas armas e ferramentas equipadas penduradas nas costas ou presas ao seu cinto.
---
### 🖥️ Interface e HUD
*Tudo que muda os menus do jogo ou o que você vê na tela (Mini-mapas, vida, menus).*
* **[Better Modlist](https://www.curseforge.com/minecraft/mc-mods/better-modlist)**: Melhora o visual e a organização da tela de mods (Mod Menu) nativa do jogo.
* **[BetterF3](https://modrinth.com/mod/betterf3)**: Substitui a tela de debug (F3) por uma versão organizada, colorida, personalizável e mais fácil de ler.
* **[Blur+](https://modrinth.com/mod/blur-plus)**: Adiciona um efeito de desfoque elegante no fundo da tela sempre que você abre o inventário ou um baú.
* **[Dynamic Crosshair](https://modrinth.com/mod/dynamiccrosshair)**: Altera a mira do jogo dinamicamente de acordo com o que você está olhando (por exemplo: um ícone diferente se olhar para um inimigo ou para um baú).
* **[Health Bars](https://www.curseforge.com/minecraft/search?class=mc-mods&search=Health+Bars)**: Exibe uma barra de vida flutuante acima dos inimigos e animais que tomam dano.
* **[Inventory HUD+](https://www.curseforge.com/minecraft/mc-mods/inventory-hud-forge)**: Mostra informações em tempo real na tela, como seu inventário, durabilidade da armadura e efeitos de poções ativos.
* **[JourneyMap](https://www.curseforge.com/minecraft/mc-mods/journeymap)**: Mapeia o mundo enquanto você explora, oferecendo um minimapa na tela e um mapa completo expansível.
* **[Just Enough Items (JEI)](https://www.curseforge.com/minecraft/mc-mods/jei)**: Mod utilitário que lista todos os itens e blocos do jogo e mostra a "receita" de como criar cada um deles.
---
### ⚙️ Qualidade de Vida (QoL) e Jogabilidade
*Pequenos e grandes ajustes que tornam a jogabilidade menos monótona e mais fluída.*
* **[Better Days](https://www.curseforge.com/minecraft/mc-mods/better-days)**: Permite ajustar a duração do dia e da noite, ou fazer o tempo acelerar visualmente em vez de pular direto.
* **[Bridging Mod](https://modrinth.com/mod/bridging-mod)**: Facilita a construção de pontes, permitindo colocar blocos à frente guiando-se pela borda, similar ao sistema da Bedrock Edition.
* **[Double Doors](https://www.curseforge.com/minecraft/mc-mods/double-doors)**: Faz com que portas duplas abram e fechem simultaneamente com um único clique.
* **[Enchanting Infuser](https://www.curseforge.com/minecraft/mc-mods/enchanting-infuser)**: Adiciona uma mesa de encantamento avançada onde você escolhe diretamente os encantamentos, eliminando o fator sorte (RNG).
* **[FallingTree](https://www.curseforge.com/minecraft/mc-mods/falling-tree)**: Derruba a árvore inteira de uma só vez quando você quebra apenas o bloco da base.
* **[Ore Harvester](https://www.curseforge.com/minecraft/mc-mods/ore-harvester)**: Permite minerar uma veia ou aglomerado inteiro de minérios quebrando apenas um bloco da cadeia.
* **[RightClickHarvest](https://modrinth.com/mod/rightclickharvest)**: Facilita a agricultura: colhe e replanta a semente imediatamente usando apenas o clique do botão direito do mouse.
* **[Serene Seasons](https://www.curseforge.com/minecraft/mc-mods/serene-seasons)**: Adiciona estações do ano dinâmicas que alteram o clima, nevascas e até as cores da grama e folhas.
* **[Skin Restorer](https://modrinth.com/mod/skinrestorer)**: Restaura e permite mudar skins de jogadores ativamente (geralmente usado em servidores offline/não-autenticados).
---
### 🪚 Construção e Decoração
*Novos blocos e opções arquitetônicas.*
* **[Macaw's Bridges](https://www.curseforge.com/minecraft/mc-mods/macaws-bridges)**: Adiciona diversos estilos e modelos de pontes de madeira e pedra prontos para construção.
* **[Macaw's Roofs](https://www.curseforge.com/minecraft/mc-mods/macaws-roofs)**: Inclui blocos reais focados em construção de telhados, calhas e toldos diagonais.

