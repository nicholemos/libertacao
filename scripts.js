// Lista de solicitantes com seus detalhes
const solicitantes = [
    { 
        nome: "Antiquário",
        descricao: "Esse pequeno chalé de madeira tem um ar misterioso e simpático, com grandes janelas de vidro pontilhado colorido e um pergolado coberto por rosas minúsculas na entrada. Seu interior exibe um salão apinhado de estantes contendo todo tipo de item, mágico ou não. Durante o dia é possível encontrar Ashtad, sentada na sacada, geralmente lendo; e durante a noite Khordad cuida do lugar, iluminado à luz de velas.",
        servicos: "Compra e venda de acessórios mágicos. Sempre que um personagem procura um acessório específico, role sua disponibilidade: 75% para acessórios menores, 50% para acessórios médios e 25% para acessórios maiores.",
        honrarias: "Você recebe um acessório mágico menor (caso seja um personagem de patamar veterano), médio (campeão) ou maior (lenda) à sua escolha.",
        imagem: "https://static.wikia.nocookie.net/legendofthecryptids/images/5/5a/Magic_Shop_Owner_Graciel.png"
    },
    { 
        nome: "Arena", 
        descricao: "Este anfiteatro é um lugar para combatentes testarem seus talentos e ganharem algum dinheiro. A grande campeã, Caliandre, está sempre pronta para lutar de forma amistosa, trazendo à tona as habilidades dos personagens. Combates contra criaturas ou viajantes planares às vezes acontecem na arena.",
        servicos: "Desafios e lutas amigáveis entre combatentes, além de alguns combates únicos.",
        honrarias: "Vencedores podem ganhar reputação ou uma premiação em dinheiro.",
        imagem: "https://pm1.aminoapps.com/6756/0428b43f1e88de03fda43cbf4d1684c0e6990a2ev2_hq.jpg"
    },
    { 
        nome: "Biblioteca", 
        descricao: "Essa construção alta tem arquitetura de linhas retas e elegantes, com colunas ornamentais em mármore branco, e cercada de grandes espelhos d’água. Fica próxima ao antiquário e ao bosque, sendo destino recorrente de Eh’mmed, o Sábio.",
        servicos: "Consulta de livros e pergaminhos sobre magia, história e ciências antigas.",
        honrarias: "Acesso a conhecimento oculto ou mágico, dependendo do status do visitante.",
        imagem: "https://cdna.artstation.com/p/assets/images/images/006/532/382/large/javier-lazo-library.jpg"
    }
];

// Lista de objetivos possíveis
const objetivos = [
    { 
        nome: "Caça", 
        descricao: "Abater uma criatura particularmente perigosa na masmorra e trazê-la para Candeh’ssa. Role a tabela de encontros da próxima masmorra para determinar a criatura; ela recebe um bônus de +2 em testes de perícia e na Defesa." 
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

// Lista de recompensas possíveis
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
        nome: "Tesouro", 
        descricao: "Você ganha um bem material. Role na tabela Tesouros (Tormenta20, p. 328), na coluna de riquezas, de itens ou em ambas, na linha correspondente a seu nível." 
    }
];


let numeroMissao = 1; // Número das missões que serão geradas

// Função para gerar uma nova missão
// Função para gerar uma nova missão
function gerarAventura() {
    const resultadosContainer = document.getElementById("resultados");

    // Verificando se já existem 4 missões
    if (resultadosContainer.children.length >= 4) {
        alert("Você já tem 4 missões. Complete algumas antes de criar mais.");
        return; // Não cria novas missões se o limite for alcançado
    }

    // Seleção aleatória de um solicitante
    const solicitante = solicitantes[Math.floor(Math.random() * solicitantes.length)];

    // Seleção aleatória de um objetivo
    const objetivo = objetivos[Math.floor(Math.random() * objetivos.length)];

    // Seleção aleatória de uma recompensa
    const recompensa = recompensas[Math.floor(Math.random() * recompensas.length)];

    // Criando a nova caixa de missão
    const resultadoBox = document.createElement("div");
    resultadoBox.classList.add("resultado-box");

    // Adicionando o conteúdo da missão
    resultadoBox.innerHTML = `
        <h3>Aventura Gerada:</h3>
        <p><strong>Solicitante:</strong> <span class="tooltip" onmouseover="mostrarDetalhes('solicitante', '${solicitante.nome}')" onmouseout="ocultarDetalhes()"> ${solicitante.nome} </span></p>
        <p><strong>Objetivo:</strong> <span class="tooltip" onmouseover="mostrarDetalhes('objetivo', '${objetivo.nome}')" onmouseout="ocultarDetalhes()"> ${objetivo.nome} </span></p>
        <p><strong>Recompensa:</strong> <span class="tooltip" onmouseover="mostrarDetalhes('recompensa', '${recompensa.nome}')" onmouseout="ocultarDetalhes()"> ${recompensa.nome} </span></p>
        
        <div class="missao-status">
            <button class="sucesso" onclick="marcarStatus(this, 'sucesso', ${numeroMissao}, '${solicitante.nome}', '${recompensa.nome}')">O</button>
            <button class="falha" onclick="marcarStatus(this, 'falha', ${numeroMissao}, '${solicitante.nome}', '${recompensa.nome}')">X</button>
        </div>
    `;

    // Adicionando a nova missão ao container de resultados
    resultadosContainer.appendChild(resultadoBox);

    // Incrementa o número da missão para a próxima
    numeroMissao++;
}

// Função para mostrar detalhes no hover
function mostrarDetalhes(tipo, nome) {
    let detalhes = '';
    let titulo = '';
    let imagem = '';

    if (tipo === 'solicitante') {
        const solicitante = solicitantes.find(s => s.nome === nome);
        if (solicitante) {
            titulo = "Nome: " + solicitante.nome;
            detalhes = `
                <p><strong>Descrição:</strong> ${solicitante.descricao}</p>
                <p><strong>Serviço:</strong> ${solicitante.servicos}</p>
                <p><strong>Honrarias:</strong> ${solicitante.honrarias}</p>
            `;
            imagem = `<img src="${solicitante.imagem}" alt="${solicitante.nome}" style="width: 100px; height: auto; margin-top: 10px;">`;
        }
    } else if (tipo === 'objetivo') {
        const objetivo = objetivos.find(o => o.nome === nome);
        if (objetivo) {
            titulo = "Nome: " + objetivo.nome;
            detalhes = `<p><strong>Descrição:</strong> ${objetivo.descricao}</p>`;
        }
    } else if (tipo === 'recompensa') {
        const recompensa = recompensas.find(r => r.nome === nome);
        if (recompensa) {
            titulo = "Nome: " + recompensa.nome;
            detalhes = recompensa.descricao;
        }
    }

    // Cria a tooltip com a imagem do solicitante (se for o tipo 'solicitante') ou objetivo
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip-box');
    tooltip.innerHTML = `
        <strong>${titulo}</strong>
        ${imagem}
        <p>${detalhes}</p>
    `;

    // Adiciona a tooltip ao corpo do documento
    document.body.appendChild(tooltip);

    // Posiciona a tooltip ao lado do mouse
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;

    // Exibe a tooltip
    tooltip.style.display = 'block';
}

// Função para ocultar o tooltip
function ocultarDetalhes() {
    const tooltip = document.querySelector('.tooltip-box');
    if (tooltip) {
        tooltip.remove();
    }
}

// Função para marcar a missão como sucesso ou falha, e removê-la
// Função para marcar a missão como sucesso ou falha, e removê-la
function marcarStatus(botao, status, numMissao, solicitante, recompensa) {
    const box = botao.closest(".resultado-box"); // Encontra a caixa da missão
    const botoes = box.querySelectorAll(".missao-status button");

    // Desabilita os botões depois de clicar
    botoes.forEach(b => b.disabled = true);

    // Se a missão foi falha, a recompensa será "Nenhuma"
    if (status === 'falha') {
        recompensa = "Nenhuma";
        box.style.borderColor = "#dc3545"; // Vermelho para falha
    } else {
        box.style.borderColor = "#28a745"; // Verde para sucesso
    }

    // Adiciona a missão ao registro de missões completadas
    const registroLista = document.getElementById("lista-missoes");
    const itemRegistro = document.createElement("li");
    itemRegistro.classList.add(status === 'sucesso' ? 'sucesso-item' : 'falha-item');
    itemRegistro.textContent = `Missão #${numMissao} - ${status.charAt(0).toUpperCase() + status.slice(1)} - Solicitante: ${solicitante} - Recompensa: ${recompensa}`;

    registroLista.appendChild(itemRegistro);

    // Remove a missão após o clique
    setTimeout(() => {
        box.remove();
    },1000); // A missão desaparece com um pequeno delay (1 segundo)
}
