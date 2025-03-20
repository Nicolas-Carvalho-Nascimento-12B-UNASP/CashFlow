// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o quiz
    initQuiz();
});

// Perguntas do quiz
const quizQuestions = [
    {
        pergunta: "Qual é o seu objetivo principal ao investir?",
        opcoes: [
            { texto: "Preservar meu dinheiro, sem correr riscos", pontos: 1 },
            { texto: "Ter um rendimento um pouco melhor que a poupança, com pouco risco", pontos: 2 },
            { texto: "Buscar um equilíbrio entre segurança e rentabilidade", pontos: 3 },
            { texto: "Maximizar meus ganhos, mesmo que isso signifique mais riscos", pontos: 4 }
        ]
    },
    {
        pergunta: "Por quanto tempo você pretende manter seu dinheiro investido?",
        opcoes: [
            { texto: "Menos de 1 ano", pontos: 1 },
            { texto: "Entre 1 e 3 anos", pontos: 2 },
            { texto: "Entre 3 e 5 anos", pontos: 3 },
            { texto: "Mais de 5 anos", pontos: 4 }
        ]
    },
    {
        pergunta: "Como você reagiria se seus investimentos perdessem 20% do valor em um mês?",
        opcoes: [
            { texto: "Venderia tudo imediatamente para evitar mais perdas", pontos: 1 },
            { texto: "Venderia uma parte para reduzir o risco", pontos: 2 },
            { texto: "Não faria nada e esperaria o mercado se recuperar", pontos: 3 },
            { texto: "Aproveitaria para comprar mais, já que os preços estão mais baixos", pontos: 4 }
        ]
    },
    {
        pergunta: "Qual afirmação melhor descreve sua experiência com investimentos?",
        opcoes: [
            { texto: "Nunca investi antes, só tenho dinheiro na poupança", pontos: 1 },
            { texto: "Já investi em alguns produtos de renda fixa", pontos: 2 },
            { texto: "Tenho experiência com diversos tipos de investimentos", pontos: 3 },
            { texto: "Sou um investidor experiente e acompanho o mercado diariamente", pontos: 4 }
        ]
    },
    {
        pergunta: "Qual porcentagem da sua renda mensal você consegue poupar?",
        opcoes: [
            { texto: "Menos de 10%", pontos: 1 },
            { texto: "Entre 10% e 20%", pontos: 2 },
            { texto: "Entre 20% e 30%", pontos: 3 },
            { texto: "Mais de 30%", pontos: 4 }
        ]
    }
];

// Perfis de investidor
const perfisInvestidor = [
    {
        nome: "Conservador",
        descricao: "Você prioriza a segurança e prefere investimentos com baixo risco, mesmo que isso signifique um retorno menor. Seu foco é preservar o patrimônio.",
        investimentosRecomendados: [
            "Tesouro Direto",
            "CDBs de bancos grandes",
            "Fundos DI",
            "Poupança",
            "LCI/LCA"
        ]
    },
    {
        nome: "Moderado",
        descricao: "Você busca um equilíbrio entre segurança e rentabilidade. Está disposto a assumir alguns riscos calculados para obter retornos melhores que a renda fixa tradicional.",
        investimentosRecomendados: [
            "Tesouro IPCA+",
            "CDBs de médio prazo",
            "Fundos Multimercado",
            "Fundos Imobiliários",
            "Debêntures"
        ]
    },
    {
        nome: "Arrojado",
        descricao: "Você tem maior tolerância a riscos e busca rentabilidade acima da média. Entende as oscilações do mercado e está disposto a enfrentar períodos de volatilidade.",
        investimentosRecomendados: [
            "Ações de empresas consolidadas",
            "ETFs",
            "Fundos de Ações",
            "BDRs",
            "Small Caps"
        ]
    },
    {
        nome: "Agressivo",
        descricao: "Você busca maximizar seus ganhos e está disposto a assumir riscos significativos. Tem conhecimento do mercado e não se abala com oscilações de curto prazo.",
        investimentosRecomendados: [
            "Ações de empresas menores",
            "Criptomoedas",
            "Fundos de investimento no exterior",
            "Opções e derivativos",
            "Day Trade"
        ]
    }
];

// Variáveis globais
let perguntaAtual = 0;
let pontuacaoTotal = 0;

// Inicializa o quiz
function initQuiz() {
    const startQuizBtn = document.getElementById('start-quiz');
    const restartQuizBtn = document.getElementById('restart-quiz');
    
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            document.querySelector('.quiz-start').classList.remove('active');
            document.querySelector('.quiz-questions').classList.add('active');
            
            // Reseta o quiz
            perguntaAtual = 0;
            pontuacaoTotal = 0;
            
            // Mostra a primeira pergunta
            mostrarPergunta();
        });
    }
    
    if (restartQuizBtn) {
        restartQuizBtn.addEventListener('click', function() {
            document.querySelector('.quiz-result').classList.remove('active');
            document.querySelector('.quiz-start').classList.add('active');
        });
    }
}

// Mostra a pergunta atual
function mostrarPergunta() {
    const quizQuestionsContainer = document.querySelector('.quiz-questions');
    
    // Limpa o conteúdo anterior
    quizQuestionsContainer.innerHTML = '';
    
    // Cria o elemento da pergunta
    const perguntaElement = document.createElement('div');
    perguntaElement.className = 'quiz-question';
    
    // Adiciona o título da pergunta
    const perguntaTitulo = document.createElement('h3');
    perguntaTitulo.textContent = quizQuestions[perguntaAtual].pergunta;
    perguntaElement.appendChild(perguntaTitulo);
    
    // Adiciona as opções
    const opcoesElement = document.createElement('div');
    opcoesElement.className = 'quiz-options';
    
    quizQuestions[perguntaAtual].opcoes.forEach((opcao, index) => {
        const opcaoElement = document.createElement('div');
        opcaoElement.className = 'quiz-option';
        opcaoElement.textContent = opcao.texto;
        opcaoElement.dataset.pontos = opcao.pontos;
        
        // Adiciona evento de clique
        opcaoElement.addEventListener('click', function() {
            // Remove a seleção anterior
            document.querySelectorAll('.quiz-option').forEach(el => {
                el.classList.remove('selected');
            });
            
            // Adiciona a classe selected
            this.classList.add('selected');
        });
        
        opcoesElement.appendChild(opcaoElement);
    });
    
    perguntaElement.appendChild(opcoesElement);
    
    // Adiciona os botões de navegação
    const navegacaoElement = document.createElement('div');
    navegacaoElement.className = 'quiz-navigation';
    
    // Botão Anterior (exceto na primeira pergunta)
    if (perguntaAtual > 0) {
        const btnAnterior = document.createElement('button');
        btnAnterior.className = 'btn btn-secondary';
        btnAnterior.textContent = 'Anterior';
        btnAnterior.addEventListener('click', perguntaAnterior);
        navegacaoElement.appendChild(btnAnterior);
    } else {
        // Espaço vazio para manter o layout
        const espacoVazio = document.createElement('div');
        navegacaoElement.appendChild(espacoVazio);
    }
    
    // Botão Próximo ou Finalizar
    const btnProximo = document.createElement('button');
    btnProximo.className = 'btn btn-primary';
    
    if (perguntaAtual < quizQuestions.length - 1) {
        btnProximo.textContent = 'Próximo';
        btnProximo.addEventListener('click', proximaPergunta);
    } else {
        btnProximo.textContent = 'Finalizar';
        btnProximo.addEventListener('click', finalizarQuiz);
    }
    
    navegacaoElement.appendChild(btnProximo);
    perguntaElement.appendChild(navegacaoElement);
    
    // Adiciona a pergunta ao container
    quizQuestionsContainer.appendChild(perguntaElement);
}

// Avança para a próxima pergunta
function proximaPergunta() {
    // Verifica se uma opção foi selecionada
    const opcaoSelecionada = document.querySelector('.quiz-option.selected');
    
    if (!opcaoSelecionada) {
        alert('Por favor, selecione uma opção para continuar.');
        return;
    }
    
    // Adiciona a pontuação
    pontuacaoTotal += parseInt(opcaoSelecionada.dataset.pontos);
    
    // Avança para a próxima pergunta
    perguntaAtual++;
    mostrarPergunta();
}

// Volta para a pergunta anterior
function perguntaAnterior() {
    // Subtrai a pontuação da pergunta atual (se uma opção estiver selecionada)
    const opcaoSelecionada = document.querySelector('.quiz-option.selected');
    
    if (opcaoSelecionada) {
        pontuacaoTotal -= parseInt(opcaoSelecionada.dataset.pontos);
    }
    
    // Volta para a pergunta anterior
    perguntaAtual--;
    mostrarPergunta();
}

// Finaliza o quiz e mostra o resultado
function finalizarQuiz() {
    // Verifica se uma opção foi selecionada
    const opcaoSelecionada = document.querySelector('.quiz-option.selected');
    
    if (!opcaoSelecionada) {
        alert('Por favor, selecione uma opção para continuar.');
        return;
    }
    
    // Adiciona a pontuação da última pergunta
    pontuacaoTotal += parseInt(opcaoSelecionada.dataset.pontos);
    
    // Calcula o perfil com base na pontuação
    const perfilIndex = calcularPerfil(pontuacaoTotal);
    const perfil = perfisInvestidor[perfilIndex];
    
    // Atualiza os elementos do resultado
    document.getElementById('profile-result').textContent = perfil.nome;
    document.getElementById('profile-description').textContent = perfil.descricao;
    
    // Limpa e preenche a lista de investimentos recomendados
    const recommendedList = document.getElementById('recommended-list');
    recommendedList.innerHTML = '';
    
    perfil.investimentosRecomendados.forEach(investimento => {
        const li = document.createElement('li');
        li.textContent = investimento;
        recommendedList.appendChild(li);
    });
    
    // Mostra a tela de resultado
    document.querySelector('.quiz-questions').classList.remove('active');
    document.querySelector('.quiz-result').classList.add('active');
}

// Calcula o perfil com base na pontuação
function calcularPerfil(pontuacao) {
    // Pontuação máxima possível: 5 perguntas * 4 pontos = 20
    // Dividimos em 4 perfis
    
    if (pontuacao <= 8) {
        return 0; // Conservador
    } else if (pontuacao <= 12) {
        return 1; // Moderado
    } else if (pontuacao <= 16) {
        return 2; // Arrojado
    } else {
        return 3; // Agressivo
    }
} 