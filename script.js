document.addEventListener('DOMContentLoaded', () => {

  // =================================================================
  // CÓDIGO UNIFICADO DE DADOS E CONTROLES GERAIS
  // =================================================================
  const saveDataBtn = document.getElementById('saveData');
  const loadDataInput = document.getElementById('loadData');

  const saveData = () => {
    const combinedData = {
      npcProgress: npcModule.getSaveData(),
      missionProgress: missionModule.getSaveData()
    };
    const blob = new Blob([JSON.stringify(combinedData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'painel_mestre_rpg.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const loadData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.npcProgress) {
          npcModule.loadSaveData(data.npcProgress);
        }
        if (data.missionProgress) {
          missionModule.loadSaveData(data.missionProgress);
        }
      } catch (error) {
        alert('Erro ao carregar o arquivo. Verifique se ele está no formato JSON correto.');
        console.error("Load error:", error);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  saveDataBtn.addEventListener('click', saveData);
  loadDataInput.addEventListener('change', loadData);


  // =================================================================
  // MÓDULO DE PROGRESSO COM NPCS (ANTIGO script (1).js)
  // =================================================================
  const npcModule = (() => {
    let playerCount = 0;
    let selectedPlayer = null;
    const playerList = document.getElementById('player-list');
    const addPlayerBtn = document.getElementById('addPlayer');
    const playerNameInput = document.getElementById('playerName');
    const removePlayerBtn = document.getElementById('removePlayer');

    // SUBSTITUA TODA a função createNpc por esta
    // SUBSTITUA TODA a função createNpc por esta nova versão
    // SUBSTITUA a função createNpc por esta versão
    function createNpc(container, npcData = { name: '', hearts: 0, image: '', affinityText: '' }) {
      const npcContainer = document.createElement('div');
      npcContainer.classList.add('npc-item');

      // Removemos a classe 'collapsed' daqui, pois será controlada pelo container pai
      if (npcData.image) {
        npcContainer.style.backgroundImage = `url(${npcData.image})`;
      }

      npcContainer.dataset.affinityText = npcData.affinityText || '';

      // O evento de clique para expandir foi removido daqui

      const nameContainer = document.createElement('div');
      nameContainer.className = 'npc-name-container';

      if (npcData.name) {
        const nameDisplay = document.createElement('h4');
        nameDisplay.className = 'npc-name-display';
        nameDisplay.textContent = npcData.name;
        nameContainer.appendChild(nameDisplay);
      } else {
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Nome do NPC';
        nameInput.className = 'npc-name-input';
        nameInput.onclick = e => e.stopPropagation();

        const saveNameBtn = document.createElement('button');
        saveNameBtn.innerText = 'Salvar Nome';
        saveNameBtn.className = 'btn-save-name';
        saveNameBtn.onclick = (e) => {
          e.stopPropagation();
          const nameValue = nameInput.value.trim();
          if (nameValue) {
            const nameDisplay = document.createElement('h4');
            nameDisplay.className = 'npc-name-display';
            nameDisplay.textContent = nameValue;
            nameContainer.innerHTML = '';
            nameContainer.appendChild(nameDisplay);
            npcContainer.closest('.npc-entry').querySelector('.npc-trigger .npc-name').textContent = nameValue;

          }
        };
        nameContainer.appendChild(nameInput);
        nameContainer.appendChild(saveNameBtn);
      }
      npcContainer.appendChild(nameContainer);

      const heartsContainer = document.createElement('div');
      heartsContainer.classList.add('hearts');
      const hearts = [];
      for (let i = 0; i < 7; i++) {
        const heart = document.createElement('span');
        heart.classList.add('heart');
        heart.innerText = '❤️';
        hearts.push(heart);
        heartsContainer.appendChild(heart);
      }
      npcContainer.appendChild(heartsContainer);

      const controlDiv = document.createElement('div');
      controlDiv.classList.add('npc-controls');
      const minusButton = document.createElement('button');
      minusButton.innerText = '-';
      const plusButton = document.createElement('button');
      plusButton.innerText = '+';
      controlDiv.appendChild(minusButton);
      controlDiv.appendChild(plusButton);
      npcContainer.appendChild(controlDiv);

      let currentHearts = npcData.hearts;
      const updateHearts = () => {
        hearts.forEach((heart, index) => {
          heart.classList.toggle('active', index < currentHearts);
        });
        // Atualiza o contador de corações no trigger quando os corações mudam
        const trigger = container.previousElementSibling;
        if (trigger && trigger.classList.contains('npc-trigger')) {
          const heartCountSpan = trigger.querySelector('.heart-count');
          if (heartCountSpan) heartCountSpan.textContent = `(❤️ ${currentHearts}/7)`;
        }
      };

      minusButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentHearts > 0) currentHearts--;
        updateHearts();
      });
      plusButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentHearts < hearts.length) currentHearts++;
        updateHearts();
      });

      const affinityTextDisplay = document.createElement('p');
      affinityTextDisplay.className = 'npc-affinity-text';
      affinityTextDisplay.textContent = npcContainer.dataset.affinityText;
      npcContainer.appendChild(affinityTextDisplay);

      const actionsDiv = document.createElement('div');
      actionsDiv.classList.add('npc-actions');

      const affinityBtn = document.createElement('button');
      affinityBtn.innerText = 'Anotações';
      affinityBtn.onclick = (e) => {
        e.stopPropagation();
        const currentText = npcContainer.dataset.affinityText;
        const newText = prompt("Digite as anotações sobre a afinidade do NPC:", currentText);
        if (newText !== null) {
          npcContainer.dataset.affinityText = newText;
          affinityTextDisplay.textContent = newText;
        }
      };

      const imageButton = document.createElement('button');
      imageButton.innerText = 'Adicionar Imagem';
      imageButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.onchange = (event) => {
          const file = event.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (readEvent) => {
            npcContainer.style.backgroundImage = `url(${readEvent.target.result})`;
          };
          reader.readAsDataURL(file);
        };
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
      });

      const removeNpcButton = document.createElement('button');
      removeNpcButton.innerText = 'Remover NPC';
      removeNpcButton.addEventListener('click', (e) => {
        e.stopPropagation();
        container.parentElement.remove(); // Remove a entrada inteira (trigger + container)
      });

      actionsDiv.appendChild(affinityBtn);
      actionsDiv.appendChild(imageButton);
      actionsDiv.appendChild(removeNpcButton);
      npcContainer.appendChild(actionsDiv);

      // A MUDANÇA PRINCIPAL: Adiciona o card ao container recebido como parâmetro
      container.appendChild(npcContainer);
      updateHearts();
    }

    // SUBSTITUA TODA a função createPlayer por esta versão corrigida
    function createPlayer(playerData) {
      const playerContainer = document.createElement('div');
      playerContainer.classList.add('player-container', 'collapsed');
      playerContainer.id = `player${playerCount}`;

      const playerTitle = document.createElement('h3');
      playerTitle.innerHTML = `${playerData.name} <span class="toggle-arrow">▼</span>`;

      playerTitle.addEventListener('click', () => {
        playerContainer.classList.toggle('collapsed');
      });
      playerContainer.appendChild(playerTitle);

      const collapsibleContent = document.createElement('div');
      collapsibleContent.className = 'collapsible-content';

      const npcListContainer = document.createElement('div');
      npcListContainer.className = 'npc-list';

      // --- LÓGICA RESTAURADA PARA EXIBIR NPCs EXISTENTES ---
      if (playerData.npcs) {
        playerData.npcs.forEach(npcData => {
          const npcEntry = document.createElement('div');
          npcEntry.className = 'npc-entry';

          const npcTrigger = document.createElement('h5');
          npcTrigger.className = 'npc-trigger';
          const heartCount = npcData.hearts || 0;
          npcTrigger.innerHTML = `<span class="npc-name">${npcData.name || 'Novo NPC'}</span><span class="heart-count">(❤️ ${heartCount}/7)</span>`;

          const npcCardContainer = document.createElement('div');
          npcCardContainer.className = 'npc-card-container collapsed';

          npcTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (npcCardContainer.innerHTML === '') {
              createNpc(npcCardContainer, npcData);
            }
            npcCardContainer.classList.toggle('collapsed');
          });

          npcEntry.appendChild(npcTrigger);
          npcEntry.appendChild(npcCardContainer);
          npcListContainer.appendChild(npcEntry);
        });
      }
      collapsibleContent.appendChild(npcListContainer);

      // --- LÓGICA CORRIGIDA PARA O BOTÃO "ADICIONAR NPC" ---
      const addNpcButton = document.createElement('button');
      addNpcButton.innerText = 'Adicionar NPC';
      addNpcButton.addEventListener('click', (e) => {
        e.stopPropagation();
        // Cria um novo NPC vazio
        const npcData = { name: '', hearts: 0, image: '', affinityText: '' };
        const npcEntry = document.createElement('div');
        npcEntry.className = 'npc-entry';

        const npcTrigger = document.createElement('h5');
        npcTrigger.className = 'npc-trigger';
        npcTrigger.innerHTML = `<span class="npc-name">Novo NPC</span> <span class="heart-count">(❤️ 0/7)</span>`;

        const npcCardContainer = document.createElement('div');
        npcCardContainer.className = 'npc-card-container collapsed';

        npcTrigger.addEventListener('click', (ev) => {
          ev.stopPropagation();
          if (npcCardContainer.innerHTML === '') {
            createNpc(npcCardContainer, npcData);
          }
          npcCardContainer.classList.toggle('collapsed');
        });

        npcEntry.appendChild(npcTrigger);
        npcEntry.appendChild(npcCardContainer);
        npcListContainer.appendChild(npcEntry);
      });

      collapsibleContent.appendChild(addNpcButton);
      playerContainer.appendChild(collapsibleContent);

      playerContainer.addEventListener('click', (e) => {
        if (e.target === playerContainer || e.target === playerTitle || e.target.classList.contains('toggle-arrow')) {
          document.querySelectorAll('.player-container').forEach(p => p.classList.remove('selected'));
          playerContainer.classList.add('selected');
          selectedPlayer = playerContainer;
        }
      });

      playerList.appendChild(playerContainer);
      playerCount++;
    }

    addPlayerBtn.addEventListener('click', () => {
      const playerName = playerNameInput.value.trim();
      if (playerName) {
        createPlayer({ name: playerName, npcs: [] });
        playerNameInput.value = '';
      }
    });

    removePlayerBtn.addEventListener('click', () => {
      if (!selectedPlayer) {
        alert("Selecione um jogador para remover.");
        return;
      }
      const playerName = selectedPlayer.querySelector('h3').innerText;
      if (confirm(`Deseja realmente remover o jogador "${playerName}"?`)) {
        selectedPlayer.remove();
        selectedPlayer = null;
      }
    });

    // SUBSTITUA TODA a função getSaveData por esta
    function getSaveData() {
      const data = [];
      document.querySelectorAll('.player-container').forEach(player => {
        const playerName = player.querySelector('h3').innerText;
        const npcs = [];
        player.querySelectorAll('.npc-item').forEach(npc => {

          // --- NOVO: Lógica para obter o nome (seja do input ou do texto salvo) ---
          let npcName = '';
          const nameDisplay = npc.querySelector('.npc-name-display');
          if (nameDisplay) {
            npcName = nameDisplay.textContent;
          } else {
            const nameInput = npc.querySelector('.npc-name-input');
            if (nameInput) {
              // Se o nome ainda não foi salvo, não o incluímos para que o input apareça no load
              npcName = '';
            }
          }

          const npcHearts = npc.querySelectorAll('.heart.active').length;
          let imageUrl = npc.style.backgroundImage;
          imageUrl = (imageUrl && imageUrl !== 'none') ? imageUrl.slice(5, -2) : '';

          // --- NOVO: Obtém o texto de afinidade do dataset ---
          const affinityText = npc.dataset.affinityText || '';

          npcs.push({ name: npcName, hearts: npcHearts, image: imageUrl, affinityText: affinityText });
        });
        data.push({ name: playerName, npcs });
      });
      return data;
    }

    function loadSaveData(data) {
      playerList.innerHTML = '';
      playerCount = 0;
      selectedPlayer = null;
      data.forEach(playerData => createPlayer(playerData));
    }

    return { getSaveData, loadSaveData };

  })();


  // =================================================================
  // MÓDULO DE AVENTURAS SEM FIM (ANTIGO script.js)
  // =================================================================
  const missionModule = (() => {
    // DATA ARRAYS
    const solicitantes = [
      {
        nome: "Antiquário",
        descricao: "Esse pequeno chalé de madeira tem um ar misterioso e simpático, com grandes janelas de vidro pontilhado colorido e um pergolado coberto por rosas minúsculas na entrada. Seu interior exibe um salão apinhado de estantes contendo todo tipo de item, mágico ou não. Durante o dia é possível encontrar Ashtad, sentada na sacada, geralmente lendo; e durante a noite Khordad cuida do lugar, iluminado à luz de velas.",
        servicos: "Compra e venda de acessórios mágicos. Sempre que um personagem procura um acessório específico, role sua disponibilidade: 75% para acessórios menores, 50% para acessórios médios e 25% para acessórios maiores.",
        honrarias: "Você recebe um acessório mágico menor (caso seja um personagem de patamar veterano), médio (campeão) ou maior (lenda) à sua escolha.",
        imagem: "https://i.pinimg.com/originals/43/5d/8d/435d8df737a6c400b2f0710d37d3b5fb.gif"
      },
      {
        nome: "Arena",
        descricao: "Este anfiteatro é um lugar para combatentes testarem seus talentos e ganharem algum dinheiro. A grande campeã, Caliandre, está sempre pronta para lutar de forma amistosa, trazendo à tona as habilidades dos personagens. Também é possível encontrar aqui o minotauro Juno, antigo gladiador de Tapista; e Martin, que em vida era um mercenário em Portsmouth. Os combates reúnem espectadores de Candeh’ssa, ansiosos para ver os heróis lutando, em confrontos (quase) nunca mortais. Combates contra criaturas ou viajantes planares às vezes acontecem na arena.",
        servicos: "Uma vez por repouso em Candeh’ssa, cada personagem pode participar de um combate na arena e fazer uma aposta em tibares. Seu desempenho em combate é representado com um teste de Luta. Um personagem também pode apostar em uma luta como expectador, sem participar dela. Neste caso, use Jogatina.",
        honrarias: "Você recebe um poder de combate à sua escolha",
        imagem: "https://static.wikia.nocookie.net/mashle/images/2/2f/Sounds_Movement_Spell_%28Anime%29.gif"
      },

      {
        nome: "Biblioteca",
        descricao: "Essa construção alta tem arquitetura de linhas retas e elegantes, com colunas ornamentais em mármore branco, e cercada de grandes espelhos d’água. Fica próxima ao antiquário e ao bosque, sendo destino recorrente de Eh’mmed, o Sábio; Teclis, o escriba; e Barossa, a Estudiosa. É normal encontrar qualquer deles nos corredores silenciosos da biblioteca, muitas vezes surpreendendo visitantes curiosos — afinal, não são necessariamente “recepcionistas” do lugar.",
        servicos: "Meios para testes de Conhecimento e outras perícias próprias para encontrar informações sobre qualquer assunto. Também vende pergaminhos. Para comprar um pergaminho com uma magia específica, role 1d6. Se o resultado é maior que o círculo do pergaminho desejado, ele está disponível.",
        honrarias: "Quando você faz um teste de Conhecimento ou Misticismo, pode pagar 1 PM para rolar dois dados e escolher o melhor resultado.",
        imagem: "https://i.imgflip.com/9hc3ud.gif"
      },
      {
        nome: "Bosque",
        descricao: "Não muito distante da cidade, após caminhada breve, pode-se chegar a um belo bosque lilás. As altas copas das árvores dividem espaço com pequenos arbustos, em uma vegetação diversa que se mistura. Luz do dia atravessa a folhagem, desenhando sombras no solo forrado de folhas secas. Nenhum vozerio urbano chega até aqui, apenas os sons da natureza: vento nas folhas, canto de pássaros, zumbido de insetos, algum animal maior passando pela mata. Cheiro de terra molhada se mescla ao amadeirado das árvores e perfume das rosas onipresentes. Frutas silvestres e cogumelos também são abundantes. Em meio a tanta beleza e paz, pode-se ver Lassan-ce, a protetora do bosque, andando livremente. Além dela, há outra moradora: a tímida Viridriane.",
        servicos: " Clareiras para treinos e meditação, território de caça ou coleta de materiais e ingredientes encontrados nos ermos.",
        honrarias: "Você pode usar a habilidade Marca da Presa como um caçador de mesmo nível (Tormenta20, p. 50). Se já tem esta habilidade, cada dado de dano dela aumenta em um passo (de +2d10 para +2d12 por exemplo)",
        imagem: "https://64.media.tumblr.com/5ae76b1b0de4c5c910bb17d753efbe95/tumblr_p5lt0qX26B1uhx88zo1_500.gif"
      },

      {
        nome: "Casa de Banho",
        descricao: "Esta ampla construção de pedra poderia parecer imponente e agressiva, mas curiosamente não é; seus vapores e cheiros adocicados são como um leve afago aos que passam em frente. Ao entrar, são recebidos por Aaliyah, a concierge do lugar. Dentro, belas pinturas de paisagens relaxantes revestem as paredes, levando até salas de banho azulejadas em azul muito claro e limpo. Pequenos banquinhos de madeira se espalham no aposento aberto, ao lado de baldes e buchas vegetais. Lavar-se aqui é obrigatório, antes de chegar ao propósito verdadeiro do lugar. Após a limpeza corporal, é permitido adentrar o paraíso: vapor delicioso eleva-se da água quente, tornando o lugar aconchegante. Sob inebriante cheiro de almíscar e lavanda, a sensação é de estar no céu. Como se estas águas termais pudessem levar todo o cansaço, todos os problemas, para bem longe.",
        servicos: " Seus PV máximos aumentam em +5 por patamar. Uma noite aqui também remove qualquer condição temporária.",
        honrarias: " Uma vez por dia, você obtém o resultado máximo nos dados de cura de uma de suas habilidades de cura.",
        imagem: "https://media.tenor.com/kDhmlgCEhoYAAAAM/kimetsu-no-yaiba-demon-slayer.gif"

      },
      {
        nome: "Churrascaria",
        descricao: "Fumaça com cheiro de carne exala constante da chaminé ao lado deste grande prédio. Em seu vasto salão circular, muitas mesas e cadeiras cercando a bancada de um grande cozinheiro — literal e figurativamente falando. Tonhão, o churrasqueiro, segue virando espetos e salgando carnes, enquanto Punddin, a gourmand, prepara pratos principais e acompanhamentos. Quem acredita que comida não é arte, nunca viu esses dois trabalhando juntos.",
        servicos: "Bebidas e pratos comuns sem custo, quaisquer outras por seu custo normal. Também pode-se preparar o famoso misturadinho dos deuses, prato exclusivo feito com insumos fornecidos pelos heróis. Cada porção pode ter até três acompanhamentos diferentes, exigindo um ingrediente ou um mantimento (veja Ameaças de Arton, p. 401) por acompanhamento. Os efeitos dos acompanhamentos são cumulativos e contam como um único bônus de alimentação. Aumenta o deslocamento em +1,5m. Uma porção de misturadinho com quaisquer acompanhamentos custa T$ 50.",
        honrarias: " Você recebe +2 em Fortitude e, uma vez por dia, pode remover uma de suas condições de cansaço",
        imagem: "https://i0.wp.com/beneaththetangles.com/wp-content/uploads/2022/09/uwp826573.gif"
      },
      {
        nome: "Estalagem",
        descricao: "Esta construção térrea está entre as mais chamativas para recém-chegados a Candeh’ssa, com seu interior todo revestido de madeira escura e vitrais coloridos. Apesar da imponência, é um lugar tranquilo e quase sempre vazio, ainda que muito bem cuidado por Mahin. Oferece todo tipo de acomodação para diferentes hóspedes com diferentes necessidades, incluindo tanques de água salgada e um grande jardim interno.",
        servicos: " Seus PV máximos aumentam em +5 por patamar. Inclui vários quartos especiais para sereias, elfos-do-mar, devotos de Allihanna…",
        honrarias: " Seu descanso recupera 1 PM e 1 PV adicional por nível.",
        imagem: "https://media0.giphy.com/media/1O6gSiOvd9t2aBA9uf/giphy.gif?cid=6c09b952v2a02ybzay1teempa57z2e1v1al629epj5k7p16g&ep=v1_internal_gif_by_id&rid=giphy.gif"
      },
      {
        nome: "Guilda",
        descricao: "Salão comunal com dois andares, a guilda está sempre agitada. Cidadãos de Candeh’ssa requisitam e cumprem missões postadas no grande quadro atrás do balcão, onde a amistosa Myssia, a recepcionista, os gerencia. Longas mesas com assentos acomodam grupos de aventureiros para planejar novas incursões ou celebrar aquelas bem-sucedidas.",
        servicos: "A guilda oferece missões requisitadas por outros NPCs. A natureza de cada missão e sua recompensa podem ser escolhidas pelo mestre, ou resolvidas aleatoriamente usando a tabela na página 34.",
        honrarias: "Você recebe uma recompensa adicional em cada missão. Role 1d6 novamente na coluna Recompensa da Tabela 0-3: Missões Aleatórias.",
        imagem: "https://i.pinimg.com/originals/a3/af/42/a3af429c423aafafea02e923dc3f7ca7.gif"
      },
      {
        nome: "Laboratório",
        descricao: "O interior deste casebre, abarrotado de frascos com ingredientes alquímicos e maquinários estranhos, é também o lar de Nthanda e Frann. Suas chaminés exalam incessante fumaça colorida, e ocasionalmente é possível ouvir explosões em seu interior.",
        servicos: "Itens alquímicos. Também  vende poções mágicas. Para comprar uma poção de uma 1d6. Se o resultado é maior que o círculo da poção desejada, ela está disponível.",
        honrarias: "A CD dos itens alquímicos que você usa aumenta em +2; ou você recebe uma engenhoca que simula uma magia de círculo que pode criar, e que não conta em seu limite de engenhocas.",
        imagem: "https://i.gifer.com/9BaN.gif"
      },
      {
        nome: "Mercado",
        descricao: "Antes mesmo de chegar à praça principal, pode-se ouvir o burburinho. Bazares se espalham de forma aparentemente caótica, mas o olhar atento logo percebe certa organização. Mercadores anunciam suas ofertas, clientes negociam pechinchas. Vocês logo percebem estar no coração comercial de Candeh’ssa: o Mercado. Aqui se encontra todo tipo de mercadoria — assim como todo tipo de gente. Uma enorme banca se sobressai, oferecendo quinquilharias estranhamente ordenadas, apesar da grande quantidade. Esta tenda pertence a Tharuk, o mercador, e sua filha Nahiri. Também chama atenção uma banca menor, porém cheirosa e vistosa: pertence a Lyssara, a florista.",
        servicos: "Todos os itens comuns (não mágicos) presentes no livro básico Tormenta20, não encontrados nos outros locais de Candeh’ssa (bem como quaisquer outras coisas a critério do mestre).",
        honrarias: "Uma vez por repouso, você recebe 30% de desconto no preço de um único item.",
        imagem: "https://i.pinimg.com/originals/31/c6/30/31c63081c66f0fadd715a9d73da6a134.gif"
      },
      {
        nome: "Oficina",
        descricao: "Instalada em uma casa de pedra com um amplo pátio, onde é possível avistar uma forja e diversas bancadas de trabalho, a Oficina de Candeh’ssa é também morada dos três mestres artífices da cidade: Harko, o armeiro; Phylla, a couraceira; e Kandor, o artesão. Quando um deles trabalha, é normal reunir pequenos bandos de admiradores; mesmo após séculos, não cansam de testemunhar o trabalho destes grandes mestres.",
        servicos: " Armas, escudos e armaduras normais e superiores e aplicação de melhorias em itens destas categorias. Também é possível comprar versões mágicas destes itens ou solicitar a aplicação de encantos. Para isso, role a disponibilidade do item (veja o quadro na p. 29). Chance de 75% para itens menores, 50% para itens médios e 25% para itens maiores. Para a disponibilidade de encantos, considere o nível que o item terá se o encanto for aplicado.",
        honrarias: "Um item do personagem recebe uma melhoria à sua escolha (exceto material especial), cujos pré-requisitos cumpra.",
        imagem: "https://i.imgflip.com/9rtida.gif"
      },
      {
        nome: "Pesqueiro",
        descricao: "Próxima ao melhor ponto de pesca no lago central de Candeh’ssa, uma casa modesta oferece equipamentos e iscas para aqueles buscando um desafio repousante. Um pequeno cais contém alguns botes a remo para aluguel (sem custo para os aventureiros). Não muito longe, sistemas de redes formam criadouros de peixes para manter o lago sempre abastecido. Nerus, a pescadora, e seu atual marido, Andris, são encontrados com frequência nos arredores.",
        servicos: " O Pesqueiro oferece descanso e… peixes. Um personagem que escolha ficar aqui faz um teste de Sobrevivência (CD 15). Se passar, consegue um pescado (peixe, crustáceo, molusco etc.). Para cada 10 que excede a CD, um pescado adicional. Pescados podem ser oferecidos a Andris para serem tratados, rendendo 1 recurso natural (Ameaças de Arton, p. 401) do tipo mantimento ou osso por pescado. Um personagem também pode vender cada pescado por 2d10 x 10 T$ cada.",
        honrarias: " Uma arma à sua escolha recebe a melhoria lanajuste (Ameaças de Arton, p. 400), cumulativa com outros materiais especiais. Se já tem esta melhoria, a arma recebe +1 em sua margem de ameaça",
        imagem: "https://66.media.tumblr.com/c08c5dff642f175e9e5f164e45445fa6/tumblr_ppy8hoTgl61vk2qmmo1_500.gif"
      },
      {
        nome: "Taverna",
        descricao: "Nesta cidade de repouso para aventureiros, os deuses sabem que não poderia faltar uma boa taverna! Aberta e bem frequentada todas as horas do dia, oferece um salão aconchegante com grandes mesas, pinturas festivas e o perene perfume de boa comida preparada por Nima, a taverneira. Existe um palco para sediar apresentações de bardos e dançarinas (diz- -se que certa elfa celestial, arquimaga épica quando ainda viva, faz apresentações ocasionais), também disponível para aventureiros. Oferece também mesas de jogo gerenciadas pela crupiê Artemisia. A taverna é vigiada pelo sempre atento Bragi, que desencoraja qualquer briga (isto é, exceto quando os aventureiros se esforçam para começar uma).",
        servicos: " Quaisquer itens da categoria Alimentação. Sempre cheia, a taverna é também lugar propício para testes de Jogatina nas mesas de jogo e Investigação sobre as masmorras ou a própria cidade. Personagens treinados em Atuação podem se apresentar no palco para obter alguns tibares.",
        honrarias: "Você recebe +2 em testes de perícias baseadas em Carisma e, uma vez por aventura, pode fazer um teste de Diplomacia para mudar atitude como ação completa sem sofrer a penalidade padrão de –10.",
        imagem: "https://theanimeharvest.wordpress.com/wp-content/uploads/2016/04/konosuba-puking.gif"
      },
      {
        nome: "Templo",
        descricao: "No centro de Candeh’ssa, este estabelecimento se destaca por sua imponência. Vinte colunas se erguem ao redor, dedicadas a cada deus do Panteão, trazendo cada uma a efígie de seu patrono no topo. Suas pilastras afiladas fazem a estrutura inteira lembrar uma majestosa coroa, enquanto o interior é adorado com mosaicos e vitrais mágicos. O templo é cuidado por muitos espíritos e gênios, que respondem às duas autoridades locais: Rafiq, o Piedoso, que ministra ritos dedicados aos deuses de energia positiva, e Tanit, a Oculta, celebrante dedicada aos deuses de energia negativa.",
        servicos: " Ritos de penitência para devotos que tenham violado Obrigações & Restrições de suas divindades. Também oferece água benta, itens esotéricos que afetam magias divinas e serviços de magias divinas. Devotos de deuses que canalizam energia positiva recebem 10% de desconto em qualquer transação.",
        honrarias: " Caso seja devoto, você recebe um poder concedido extra de sua divindade.",
        imagem: "https://pa1.aminoapps.com/6698/c05c82e7f98a99cbf8151f265f39dc645e11de46_00.gif"
      }
    ];
    const objetivos = [
      {
        nome: "Caça",
        descricao: "Abater uma criatura particularly perigosa na masmorra e trazê-la para Candeh’ssa. Role a tabela de encontros da próxima masmorra para determinar a criatura; ela recebe um bônus de +2 em testes de perícia e na Defesa."
      },
      {
        nome: "Entrega",
        descricao: "Deixar um item em uma câmara numerada específica da masmorra (que pode ou não estar sendo protegida por uma criatura). Qualquer que seja a natureza do item, ele ocupa 2d4 espaços e retorna automaticamente para a cidade se a masmorra não é concluída (o que significa que a missão falha)."
      },
      {
        nome: "Escolta",
        descricao: "Um dos NPCs do estabelecimento precisa entrar em uma masmorra. Ele atua como um parceiro iniciante que não fornece benefícios, é vulnerável e precisa percorrer a masmorra com o grupo, do início ao fim. Se morrer, a missão falha e o NPC não estará mais disponível."
      },
      {
        nome: "Manufatura",
        descricao: "Fabricar um item específico, que só pode ser produzido em determinado local da masmorra. Para fabricar o item, os personagens precisam gastar 1 dia e matérias-primas especiais (fornecidas pelo solicitante) que ocupam 1d3 espaços, e passar em um teste de Ofício (CD 15 + nível da masmorra)."
      },
      {
        nome: "Pesquisa",
        descricao: "Os aventureiros devem registrar algum fenômeno ou aparição em uma câmara numerada específica da masmorra. Isso é um teste estendido (CD 15 + nível da masmorra, 3 sucessos) de Conhecimento, Investigação ou Sobrevivência (conforme a natureza da pesquisa), em que cada teste representa 1 hora. Em uma falha total, a pesquisa resulta em um acidente perigoso; os pontos de vida máximos de cada personagem diminuem em 1 por nível de personagem até a conclusão da próxima masmorra."
      },
      {
        nome: "Recuperação",
        descricao: "Resgatar um item em uma masmorra. O item estará em uma das câmaras numeradas, ocupa 2d4 espaços e, uma vez recuperado, atrai a atenção das criaturas locais: elas recebem +2 em testes de ataque contra os personagens."
      },
      {
        nome: "Resgate",
        descricao: "Um habitante precisa ser resgatado da masmorra. Ele está em uma das câmaras numeradas. Uma vez resgatado, ele atua como descrito em Escolta, mas sua presença atiça as ameaças da masmorra; essas criaturas recebem +2 em rolagens de dano contra os aventureiros."
      },
      {
        nome: "Ritual",
        descricao: "Executar um ritual numa câmara numerada específica da masmorra. Isso é um teste estendido (CD 15 + nível da masmorra, 3 sucessos) de Misticismo ou Religião (conforme a natureza do ritual), em que cada teste representa 1 hora. Em uma falha total, o ritual resulta em um desastre sobrenatural; os pontos de mana máximos de cada personagem diminuem em 1 por nível de personagem até a conclusão da próxima masmorra."
      }
    ];
    const recompensas = [
      {
        nome: "Afinidade",
        descricao: "Você recebe 1d4 pontos de afinidade com um habitante, à sua escolha, do estabelecimento solicitante. Esta recompensa só pode ser recebida uma vez para cada habitante."
      },
      {
        nome: "Favor",
        descricao: "Você recebe um favor de um habitante do estabelecimento solicitante. Pode ser um uso adicional da honraria (nesse caso, dois personagens podem se beneficiar ou a honraria não conta no limite de um personagem). Ou a ajuda do habitante, atuando como um parceiro na próxima masmorra. Ou outro favor a sua escolha, aprovado pelo mestre e que faça sentido com a personalidade e serviços do NPC."
      },
      {
        nome: "Informação",
        descricao: "Você recebe uma informação útil, como uma dica para se aproximar de um NPC, o Agrado dos Deuses de uma das próximas masmorras, ou uma dica importante sobre perigos e desafios futuros. Você decide a informação, mas o mestre deve aprová-la."
      },
      {
        nome: "Poder",
        descricao: "Você recebe um benefício de treinamento, definido aleatoriamente, que dura até o fim da próxima masmorra."
      },
      {
        nome: "Tesouro (Riquezas)",
        descricao: "Você ganha um bem material. Role na tabela Tesouros (Tormenta20, p. 328), na coluna de riquezas, na linha correspondente a seu nível."
      },
      {
        nome: "Tesouro (Item)",
        descricao: "Você ganha um bem material. Role na tabela Tesouros (Tormenta20, p. 328), na coluna de itens, na linha correspondente a seu nível."
      },
      {
        nome: "Tesouro (Ambos)",
        descricao: "Você ganha um bem material. Role na tabela Tesouros (Tormenta20, p. 328), na coluna de riquezas e de itens, na linha correspondente a seu nível."
      }
    ];
    // ADICIONE ESTA NOVA FUNÇÃO DENTRO DO missionModule
    function displayUnlockedHonors() {
      const container = document.getElementById('honrarias-conquistadas-list');
      if (!container) return; // Se o container não existir, não faz nada

      container.innerHTML = ''; // Limpa a lista antes de recriar

      if (honrariasLiberadas.size === 0) {
        container.innerHTML = '<p class="empty-list-message">Nenhuma honraria foi conquistada ainda.</p>';
        return;
      }

      honrariasLiberadas.forEach(nomeSolicitante => {
        const solicitanteData = solicitantes.find(s => s.nome === nomeSolicitante);
        if (solicitanteData) {
          const honorItem = document.createElement('div');
          honorItem.className = 'unlocked-honor-item';
          honorItem.innerHTML = `
                <img src="${solicitanteData.imagem}" class="unlocked-honor-image" alt="${solicitanteData.nome}">
                <div class="unlocked-honor-text">
                    <strong>${solicitanteData.nome}:</strong>
                    <p>${solicitanteData.honrarias}</p>
                </div>
            `;
          container.appendChild(honorItem);
        }
      });
    }

    let numeroMissao = 1;
    const honrariasLiberadas = new Set();
    const resultadosContainer = document.getElementById("resultados-missoes");
    const listaCompletadas = document.getElementById("lista-missoes-completadas");
    const solicitantesContainer = document.getElementById('solicitantes-container');
    const filtroSelect = document.getElementById('filtroSolicitante');

    // SUBSTITUA TODA a função init() por esta nova versão
    function init() {
      // Init Filter
      solicitantes.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.nome;
        opt.textContent = s.nome;
        filtroSelect.appendChild(opt);
      });
      filtroSelect.addEventListener('change', applyFilter);

      // Init Solicitantes Cards
      solicitantesContainer.innerHTML = ''; // Limpar antes de adicionar
      solicitantes.forEach(s => {
        const card = document.createElement('div');
        card.className = 'solicitante-card collapsed'; // Começa recolhido
        card.dataset.solicitanteNome = s.nome;

        // Adiciona o evento de clique no card inteiro para alternar
        card.addEventListener('click', () => {
          card.classList.toggle('collapsed');
        });

        // --- Conteúdo Visível (Recolhido) ---
        const visibleContent = document.createElement('div');
        visibleContent.className = 'solicitante-visible-content';
        visibleContent.innerHTML = `
            <img src="${s.imagem}" alt="${s.nome}">
            <h5>${s.nome}</h5>
        `;

        // --- Conteúdo Expansível ---
        const collapsibleContent = document.createElement('div');
        collapsibleContent.className = 'solicitante-collapsible-content';
        collapsibleContent.innerHTML = `
            <p><strong>Descrição:</strong> ${s.descricao}</p>
            <p><strong>Serviços:</strong> ${s.servicos}</p>
        `;

        // Div de Honrarias (separada para a regra especial)
        const honrariasDiv = document.createElement('div');
        honrariasDiv.className = 'honrarias';
        honrariasDiv.innerHTML = `<p><strong>Honrarias:</strong> ${s.honrarias}</p>`;

        card.appendChild(visibleContent);
        card.appendChild(collapsibleContent);
        card.appendChild(honrariasDiv); // Adiciona honrarias fora do conteúdo expansível

        solicitantesContainer.appendChild(card);
      });

      document.getElementById('gerarAventura').addEventListener('click', gerarAventura);
    }

    function applyFilter() {
      const sel = filtroSelect.value;
      document.querySelectorAll('#resultados-missoes .mission-box').forEach(box => {
        box.style.display = (sel === 'Todos' || box.dataset.solicitante === sel) ? '' : 'none';
      });
      document.querySelectorAll('#lista-missoes-completadas li').forEach(li => {
        li.style.display = (sel === 'Todos' || li.dataset.solicitante === sel) ? '' : 'none';
      });
      document.querySelectorAll('#solicitantes-container .solicitante-card').forEach(card => {
        card.style.display = (sel === 'Todos' || card.dataset.solicitanteNome === sel) ? '' : 'none';
      });
    }

    function gerarAventura() {
      if (resultadosContainer.children.length >= 4) {
        alert("Você já tem 4 missões. Complete algumas antes de criar mais.");
        return;
      }
      const solicitante = solicitantes[Math.floor(Math.random() * solicitantes.length)];
      const objetivo = objetivos[Math.floor(Math.random() * objetivos.length)];
      const recompensa = recompensas[Math.floor(Math.random() * recompensas.length)];

      renderizarMissaoPendente({
        num: numeroMissao,
        sol: solicitante.nome,
        obj: objetivo.nome,
        rec: recompensa.nome
      });
      numeroMissao++;
    }

    function renderizarMissaoPendente(data) {
      const box = document.createElement("div");
      box.className = "mission-box";
      box.dataset.numMissao = data.num;
      box.dataset.solicitante = data.sol;
      box.dataset.objetivo = data.obj;
      box.dataset.recompensa = data.rec;

      box.innerHTML = `
            <h4>Missão #${data.num}</h4>
            <p><strong>Solicitante:</strong> ${data.sol}</p>
            <p><strong>Objetivo:</strong> <span class="clickable">${data.obj}</span></p>
            <p><strong>Recompensa:</strong> <span class="clickable">${data.rec}</span></p>
            <div class="mission-status">
              <button class="btn-success">✔</button>
              <button class="btn-fail">✖</button>
            </div>
        `;

      box.querySelector('.btn-success').onclick = (e) => marcarStatus(e.target, 'sucesso');
      box.querySelector('.btn-fail').onclick = (e) => marcarStatus(e.target, 'falha');
      box.querySelector('p:nth-of-type(2) .clickable').onclick = () => mostrarDetalhes('objetivo', data.obj);
      box.querySelector('p:nth-of-type(3) .clickable').onclick = () => mostrarDetalhes('recompensa', data.rec);

      resultadosContainer.appendChild(box);
      applyFilter(); // Garante que o filtro seja aplicado na nova missão
    }

    function marcarStatus(botao, status) {
      const box = botao.closest(".mission-box");
      const missionData = {
        num: box.dataset.numMissao,
        sol: box.dataset.solicitante,
        obj: box.dataset.objetivo,
        rec: box.dataset.recompensa,
        status: status
      };

      if (status === 'falha') {
        missionData.rec = 'Nenhuma';
      } else {
        if (!honrariasLiberadas.has(missionData.sol)) {
          honrariasLiberadas.add(missionData.sol);
          revelarHonrarias(missionData.sol);
          displayUnlockedHonors(); // <-- ADICIONE ESTA LINHA

        }
      }
      renderizarMissaoCompletada(missionData);
      box.remove();
    }

    function renderizarMissaoCompletada(data) {
      const li = document.createElement('li');
      li.className = data.status === 'sucesso' ? 'status-sucesso' : 'status-falha';
      li.dataset.solicitante = data.sol;
      li.innerHTML = `Missão #${data.num} (${data.status}) - Solicitante: ${data.sol} - Recompensa: <span class="clickable">${data.rec}</span>`;

      const recompensaSpan = li.querySelector('.clickable');
      if (recompensaSpan && data.rec !== 'Nenhuma') {
        recompensaSpan.onclick = () => mostrarDetalhes('recompensa', data.rec);
      }

      listaCompletadas.appendChild(li);
      sortCompletedList();
      applyFilter();
    }

    function revelarHonrarias(nomeSolicitante) {
      document.querySelectorAll('.solicitante-card').forEach(card => {
        if (card.dataset.solicitanteNome === nomeSolicitante) {
          const honElem = card.querySelector('.honrarias');
          if (honElem) honElem.classList.add('revealed');
        }
      });
    }

    function mostrarDetalhes(tipo, nome) {
      let data = (tipo === 'objetivo') ? objetivos.find(o => o.nome === nome) : recompensas.find(r => r.nome === nome);
      if (!data) return;

      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-content">
          <h4>${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: ${nome}</h4>
          <p>${data.descricao}</p>
          <button>Fechar</button>
        </div>
      `;
      modal.querySelector('button').onclick = () => modal.remove();
      modal.onclick = (e) => { if (e.target === modal) modal.remove() };
      document.body.appendChild(modal);
    }

    function sortCompletedList() {
      const items = Array.from(listaCompletadas.children);
      items.sort((a, b) => {
        const numA = parseInt(a.textContent.match(/#(\d+)/)[1]);
        const numB = parseInt(b.textContent.match(/#(\d+)/)[1]);
        return numA - numB;
      }).forEach(item => listaCompletadas.appendChild(item));
    }

    function getSaveData() {
      const pendentes = Array.from(resultadosContainer.children).map(box => ({
        num: box.dataset.numMissao,
        sol: box.dataset.solicitante,
        obj: box.dataset.objetivo,
        rec: box.dataset.recompensa,
      }));

      const completadas = Array.from(listaCompletadas.children).map(li => {
        const match = li.textContent.match(/#(\d+) \((.+?)\) - Solicitante: (.+?) - Recompensa: (.+)/);
        return {
          num: match[1],
          status: match[2],
          sol: match[3].trim(),
          rec: match[4]
        };
      });

      return {
        numeroMissao,
        honrariasLiberadas: Array.from(honrariasLiberadas),
        pendentes,
        completadas,
      };
    }

    function loadSaveData(data) {
      resultadosContainer.innerHTML = '';
      listaCompletadas.innerHTML = '';
      honrariasLiberadas.clear();

      numeroMissao = data.numeroMissao || 1;

      data.honrariasLiberadas.forEach(honra => {
        honrariasLiberadas.add(honra);
        revelarHonrarias(honra);
      });

      data.pendentes.forEach(missao => renderizarMissaoPendente(missao));
      data.completadas.forEach(missao => renderizarMissaoCompletada(missao));

      sortCompletedList();
      displayUnlockedHonors(); // <-- ADICIONE ESTA LINHA

    }

    init(); // Inicializa o módulo

    return { getSaveData, loadSaveData };
  })();

});
