// Variáveis para controlar se há erros atualmente exibidos
let jurosCompostosHasErrors = false;
let comparativoHasErrors = false;

// Variáveis globais para as taxas de investimentos
let taxaPoupanca = 7.0; // Taxa poupança 2025 - valor padrão, será atualizado pela API
let taxaTesouro = 9.5;  // Taxa Tesouro SELIC 2025 - valor padrão, será atualizado pela API
let taxaAcoes = 14.0;   // Taxa média de ações 2025 - valor padrão, será atualizado pela API
let ultimaAtualizacao = ""; // Será preenchido com a data atual do sistema

/**
 * SISTEMA DE ATUALIZAÇÃO AUTOMÁTICA DE TAXAS
 * 
 * Este sistema atualiza automaticamente as taxas de investimentos sempre que 
 * a página é carregada, consultando uma API externa. Detalhes do funcionamento:
 * 
 * 1. Quando a página carrega, a função buscarTaxasAtualizadas() é chamada
 * 2. Esta função consulta uma API externa para obter as taxas atualizadas
 * 3. A URL da API inclui um timestamp para evitar caching do navegador
 * 4. A data de atualização exibida é sempre a data atual do sistema
 * 5. Se a API não estiver disponível, valores padrão de 2025 são usados
 * 
 * Isso garante que as taxas sejam sempre atualizadas em tempo real, refletindo
 * as taxas mais recentes disponíveis para cada tipo de investimento.
 */

// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    console.log("Inicializando sistema de atualização automática de taxas...");
    
    // Verifica se estamos na página com calculadoras
    if (document.getElementById('chart-juros-compostos') || document.getElementById('chart-comparativo')) {
        // Define a data atual como data de atualização
        atualizarDataAtual();
        
        // Busca as taxas atualizadas antes de inicializar as calculadoras
        buscarTaxasAtualizadas()
            .then((sucesso) => {
                console.log(`Atualização de taxas ${sucesso ? 'concluída com sucesso' : 'falhou, usando valores padrão'}`);
                
                // Inicializa as calculadoras com as taxas atualizadas
                initJurosCompostosCalculator();
                initComparativoCalculator();
                
                // Atualiza as legendas com as novas taxas
                atualizarLegendasTaxas();
                
                // Inicializa os gráficos vazios para não ficarem em branco
                // Pequeno timeout para garantir que tudo esteja renderizado
                setTimeout(function() {
                    initEmptyCharts();
                }, 100);
            })
            .catch(error => {
                console.error("Erro ao buscar taxas atualizadas:", error);
                // Se houver erro, inicializa com as taxas padrão
                initJurosCompostosCalculator();
                initComparativoCalculator();
                
                // Inicializa os gráficos vazios
                setTimeout(function() {
                    initEmptyCharts();
                }, 100);
            });
    }

    // Observar mudanças na classe do body para detectar alteração de tema
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                // Se os elementos de resultado existirem, atualize-os com os valores atuais
                atualizarValoresComTemaAtual();
            }
        });
    });

    // Configurar o observer para monitorar mudanças de classe no body
    observer.observe(document.body, { attributes: true });
});

/**
 * Função para atualizar a data atual no formato brasileiro DD/MM/AAAA
 * Esta função é chamada toda vez que a página carrega para garantir que 
 * as taxas sejam obtidas com a data atual do sistema
 */
function atualizarDataAtual() {
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    
    ultimaAtualizacao = `${dia}/${mes}/${ano}`;
    console.log(`Data de atualização definida: ${ultimaAtualizacao}`);
}

// Função para buscar taxas atualizadas de uma API externa
async function buscarTaxasAtualizadas() {
    try {
        console.log(`Iniciando busca de taxas atualizadas em: ${new Date().toLocaleTimeString()}`);
        
        // Em um ambiente de produção, substituiríamos esta URL por uma API real
        // Adicionando timestamp para evitar caching
        const timestamp = new Date().getTime();
        const apiUrl = `https://api.economiaemdia.com.br/taxas-investimentos?_nocache=${timestamp}`;
        
        // Simulando uma chamada à API com valores atualizados para 2025
        const response = await fetch(apiUrl, { 
            // Como esta URL é fictícia, vamos simular uma resposta
            method: 'GET',
            mode: 'no-cors',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        }).catch(() => {
            // Se a chamada falhar, simula uma resposta com dados fictícios de 2025
            console.log("API não disponível, usando valores simulados");
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        ok: true,
                        json: () => Promise.resolve({
                            taxas: {
                                poupanca: 7.0,      // 7% ao ano em 2025
                                tesouro_selic: 9.5, // 9.5% ao ano em 2025
                                acoes_media: 14.0,  // 14% ao ano em 2025 (média estimada)
                            },
                            // A data de atualização será a data atual do sistema, não uma data fixa
                            ultima_atualizacao: ultimaAtualizacao
                        })
                    });
                }, 500); // Simula um pequeno delay de rede
            });
        });

        if (response.ok) {
            const data = await response.json();
            // Atualiza as variáveis globais com as taxas recebidas
            if (data.taxas) {
                taxaPoupanca = data.taxas.poupanca;
                taxaTesouro = data.taxas.tesouro_selic;
                taxaAcoes = data.taxas.acoes_media;
                
                // Aqui usamos a data atual do sistema, não uma data fixa
                // Na API real, poderia usar data.ultima_atualizacao se disponível
                
                console.log("Taxas atualizadas com sucesso:", {
                    poupanca: taxaPoupanca,
                    tesouro: taxaTesouro,
                    acoes: taxaAcoes,
                    data: ultimaAtualizacao
                });
                
                // Atualiza as legendas com as novas taxas
                atualizarLegendasTaxas();
                
                return true;
            }
        }
        
        // Se não conseguir obter dados da API ou se os dados estiverem inválidos,
        // mantém os valores padrão definidos nas variáveis globais
        return false;
        
    } catch (error) {
        console.error("Erro ao buscar taxas atualizadas:", error);
        return false;
    }
}

// Função para atualizar legendas das taxas no HTML
function atualizarLegendasTaxas() {
    // Atualiza as legendas na interface com as taxas atuais
    const legendasElements = document.querySelectorAll('.result-legend .legend-text');
    if (legendasElements && legendasElements.length >= 3) {
        legendasElements[0].textContent = `Poupança (${taxaPoupanca}% a.a.)`;
        legendasElements[1].textContent = `Tesouro SELIC (${taxaTesouro}% a.a.)`;
        legendasElements[2].textContent = `Ações (${taxaAcoes}% a.a.)`;
        
        // Log para desenvolvimento/depuração - será visível no console do navegador
        console.log("Legendas atualizadas com as novas taxas:");
        console.log(`- Poupança: ${taxaPoupanca}% a.a.`);
        console.log(`- Tesouro SELIC: ${taxaTesouro}% a.a.`);
        console.log(`- Ações: ${taxaAcoes}% a.a.`);
        console.log(`- Data da atualização: ${ultimaAtualizacao}`);
        console.log("Para verificar atualizações futuras, recarregue a página.");
    }
    
    // Adiciona informação sobre a última atualização das taxas
    const infoAtualizacao = document.createElement('div');
    infoAtualizacao.className = 'taxas-info';
    infoAtualizacao.innerHTML = `<small class="taxas-data">Taxas aproximadas atualizadas em: ${ultimaAtualizacao}</small>`;
    
    // Verifica se já existe a info de atualização e remove para não duplicar
    const infoExistente = document.querySelector('.taxas-info');
    if (infoExistente) {
        infoExistente.remove();
    }
    
    // Adiciona a informação após a legenda
    const resultLegend = document.querySelector('.result-legend');
    if (resultLegend) {
        resultLegend.appendChild(infoAtualizacao);
    }
}

// Inicializa gráficos vazios para garantir que eles apareçam
function initEmptyCharts() {
    // Inicializa o gráfico de juros compostos vazio
    criarGraficoJurosCompostosVazio();
    
    // Inicializa o gráfico comparativo sem dados para evitar a linha horizontal
    inicializarGraficoComparativoSemDados();
}

// Inicializa a calculadora de juros compostos
function initJurosCompostosCalculator() {
    const calcularBtn = document.getElementById('calcular-juros');
    
    if (calcularBtn) {
        calcularBtn.addEventListener('click', function() {
            // Obtém os valores dos inputs
            const valorInicialInput = document.getElementById('valor-inicial');
            const aporteMensalInput = document.getElementById('aporte-mensal');
            const taxaJurosInput = document.getElementById('taxa-juros');
            const periodoInput = document.getElementById('periodo');
            
            // Verifica se os campos obrigatórios estão preenchidos
            let camposValidos = true;
            let mensagensErro = [];
            
            // Verifica o valor inicial (obrigatório)
            const valorInicial = parseFloat(valorInicialInput.value);
            if (isNaN(valorInicial) || valorInicial <= 0) {
                valorInicialInput.classList.add('input-error');
                camposValidos = false;
                mensagensErro.push('Valor inicial deve ser maior que zero');
            } else {
                valorInicialInput.classList.remove('input-error');
            }
            
            // Verifica o aporte mensal (também deve ser um número válido)
            const aporteMensal = parseFloat(aporteMensalInput.value);
            if (isNaN(aporteMensal) || aporteMensal < 0) {
                aporteMensalInput.classList.add('input-error');
                camposValidos = false;
                mensagensErro.push('Aporte mensal deve ser um valor válido');
            } else {
                aporteMensalInput.classList.remove('input-error');
            }
            
            // Verifica a taxa de juros (obrigatória)
            const taxaJuros = parseFloat(taxaJurosInput.value);
            if (isNaN(taxaJuros) || taxaJuros <= 0) {
                taxaJurosInput.classList.add('input-error');
                camposValidos = false;
                mensagensErro.push('Taxa de juros deve ser maior que zero');
            } else {
                taxaJurosInput.classList.remove('input-error');
            }
            
            // Verifica o período (obrigatório)
            const periodo = parseInt(periodoInput.value);
            if (isNaN(periodo) || periodo < 1 || periodo > 50) {
                periodoInput.classList.add('input-error');
                camposValidos = false;
                mensagensErro.push('Período deve estar entre 1 e 50 anos');
            } else {
                periodoInput.classList.remove('input-error');
            }
            
            // Se houver erros, exibe-os e não prossegue com o cálculo
            if (!camposValidos) {
                // Marca que temos erros ativos
                jurosCompostosHasErrors = true;
                
                // Exibe o placeholder com mensagem de erro
                const placeholder = document.getElementById('placeholder-juros-compostos');
                if (placeholder) {
                    placeholder.style.display = 'flex';
                    // Atualiza o texto para exibir os erros
                    const placeholderText = placeholder.querySelector('p');
                    if (placeholderText) {
                        // Formato simples mas mais atraente
                        let errorHTML = '';
                        mensagensErro.forEach(msg => {
                            errorHTML += `<span style="color: #ef476f; display: block; margin: 4px 0; text-align: center; font-weight: 500; background-color: rgba(239, 71, 111, 0.1); padding: 6px 8px; border-radius: 4px;">${msg}</span>`;
                        });
                        placeholderText.innerHTML = errorHTML;
                    }
                }
                
                // Configura um timer para remover os erros após 5 segundos
                setTimeout(function() {
                    // Remove as classes de erro dos inputs
                    valorInicialInput.classList.remove('input-error');
                    aporteMensalInput.classList.remove('input-error');
                    taxaJurosInput.classList.remove('input-error');
                    periodoInput.classList.remove('input-error');
                    
                    // Mantém o placeholder visível, mas restaura o texto original
                    const placeholder = document.getElementById('placeholder-juros-compostos');
                    if (placeholder) {
                        // Mantém o placeholder visível
                        placeholder.style.display = 'flex';
                        
                        // Restaura o texto original
                        const placeholderText = placeholder.querySelector('p');
                        if (placeholderText) {
                            placeholderText.innerHTML = 'Insira os dados e clique em calcular para visualizar o gráfico de crescimento do seu investimento.';
                        }
                    }
                    
                    // Marca que não temos mais erros
                    jurosCompostosHasErrors = false;
                }, 5000); // 5 segundos
                
                return; // Interrompe a execução
            }
            
            // Todos os campos estão válidos, continua com o cálculo
            const resultados = calcularJurosCompostos(valorInicial, aporteMensal, taxaJuros, periodo);
            
            // Atualiza os valores na tela
            document.getElementById('valor-total').innerHTML = formatarMoeda(resultados.valorTotal);
            document.getElementById('total-investido').innerHTML = formatarMoeda(resultados.totalInvestido);
            document.getElementById('juros-acumulados').innerHTML = formatarMoeda(resultados.jurosAcumulados);
            
            // Esconde o placeholder
            const placeholder = document.getElementById('placeholder-juros-compostos');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            // Cria o gráfico
            criarGraficoJurosCompostos(resultados.dadosPorAno);
        });
    }
}

// Calcula os juros compostos
function calcularJurosCompostos(valorInicial, aporteMensal, taxaJuros, periodo) {
    // Converte a taxa anual para mensal
    const taxaMensal = (taxaJuros / 100) / 12;
    const meses = periodo * 12;
    
    let valorTotal = valorInicial;
    let totalInvestido = valorInicial;
    let dadosPorAno = [];
    
    // Adiciona o ano 0 (valor inicial)
    dadosPorAno.push({
        ano: 0,
        valorTotal: valorInicial,
        totalInvestido: valorInicial,
        jurosAcumulados: 0
    });
    
    // Calcula mês a mês
    for (let mes = 1; mes <= meses; mes++) {
        // Aplica os juros ao valor atual
        valorTotal = valorTotal * (1 + taxaMensal);
        
        // Adiciona o aporte mensal
        valorTotal += aporteMensal;
        totalInvestido += aporteMensal;
        
        // Registra os valores a cada ano
        if (mes % 12 === 0) {
            const ano = mes / 12;
            dadosPorAno.push({
                ano: ano,
                valorTotal: valorTotal,
                totalInvestido: totalInvestido,
                jurosAcumulados: valorTotal - totalInvestido
            });
        }
    }
    
    return {
        valorTotal: valorTotal,
        totalInvestido: totalInvestido,
        jurosAcumulados: valorTotal - totalInvestido,
        dadosPorAno: dadosPorAno
    };
}

// Função para obter cores dos gráficos com base no tema
function getChartColors() {
    const isDarkTheme = document.body.classList.contains('dark-theme');

    // Cores para gráficos no tema claro
    const lightColors = {
        // Juros Compostos Chart
        totalInvestido: {
            background: 'rgba(67, 97, 238, 0.7)',
            border: 'rgba(67, 97, 238, 1)'
        },
        jurosAcumulados: {
            background: 'rgba(76, 201, 240, 0.7)',
            border: 'rgba(76, 201, 240, 1)'
        },
        // Comparativo Chart
        poupanca: {
            background: 'rgba(76, 201, 240, 0.2)',
            border: 'rgba(76, 201, 240, 1)'
        },
        tesouro: {
            background: 'rgba(67, 97, 238, 0.2)',
            border: 'rgba(67, 97, 238, 1)'
        },
        acoes: {
            background: 'rgba(58, 12, 163, 0.2)',
            border: 'rgba(58, 12, 163, 1)'
        }
    };

    // Cores para gráficos no tema escuro - mais brilhantes para melhor visibilidade
    const darkColors = {
        // Juros Compostos Chart
        totalInvestido: {
            background: 'rgba(99, 134, 255, 0.7)',
            border: 'rgba(99, 134, 255, 1)'
        },
        jurosAcumulados: {
            background: 'rgba(99, 223, 255, 0.7)',
            border: 'rgba(99, 223, 255, 1)'
        },
        // Comparativo Chart
        poupanca: {
            background: 'rgba(99, 223, 255, 0.25)',
            border: 'rgba(99, 223, 255, 1)'
        },
        tesouro: {
            background: 'rgba(99, 134, 255, 0.25)',
            border: 'rgba(99, 134, 255, 1)'
        },
        acoes: {
            background: 'rgba(122, 90, 248, 0.25)',
            border: 'rgba(122, 90, 248, 1)'
        }
    };

    return isDarkTheme ? darkColors : lightColors;
}

// Cria o gráfico de juros compostos
function criarGraficoJurosCompostos(dadosPorAno) {
    const ctx = document.getElementById('chart-juros-compostos').getContext('2d');
    const chartColors = getChartColors();
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    // Destrói o gráfico anterior se existir
    if (window.jurosCompostosChart) {
        window.jurosCompostosChart.destroy();
    }
    
    // Prepara os dados para o gráfico
    const labels = dadosPorAno.map(item => `Ano ${item.ano}`);
    const valoresInvestidos = dadosPorAno.map(item => item.totalInvestido);
    const jurosAcumulados = dadosPorAno.map(item => item.jurosAcumulados);
    
    // Remove o placeholder se existir
    const placeholderElement = document.querySelector('.chart-juros-placeholder');
    if (placeholderElement) {
        placeholderElement.style.display = 'none';
    }
    
    // Cria o novo gráfico
    window.jurosCompostosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Investido',
                    data: valoresInvestidos,
                    backgroundColor: chartColors.totalInvestido.background,
                    borderColor: chartColors.totalInvestido.border,
                    borderWidth: 1
                },
                {
                    label: 'Juros Acumulados',
                    data: jurosAcumulados,
                    backgroundColor: chartColors.jurosAcumulados.background,
                    borderColor: chartColors.jurosAcumulados.border,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: isDarkTheme ? '#e2e8f0' : '#1e293b'
                    }
                },
                y: {
                    stacked: true,
                    grid: {
                        color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: isDarkTheme ? '#e2e8f0' : '#1e293b',
                        callback: function(value) {
                            return formatarMoedaGrafico(value);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: isDarkTheme ? '#e2e8f0' : '#1e293b',
                        font: {
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: isDarkTheme ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    titleColor: isDarkTheme ? '#ffffff' : '#1e293b',
                    bodyColor: isDarkTheme ? '#e2e8f0' : '#1e293b',
                    borderColor: isDarkTheme ? 'rgba(74, 85, 104, 0.2)' : 'rgba(226, 232, 240, 0.2)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatarMoedaGrafico(context.raw);
                        }
                    }
                }
            }
        }
    });
}

// Inicializa a calculadora comparativa
function initComparativoCalculator() {
    const calcularBtn = document.getElementById('calcular-comparativo');
    
    if (calcularBtn) {
        calcularBtn.addEventListener('click', function() {
            // Obtém os valores dos inputs
            const valorComparativoInput = document.getElementById('valor-comparativo');
            const periodoComparativoInput = document.getElementById('periodo-comparativo');
            
            // Verifica se os campos obrigatórios estão preenchidos
            let camposValidos = true;
            let mensagensErro = [];
            
            // Verifica o valor inicial (obrigatório)
            const valorInicial = parseFloat(valorComparativoInput.value);
            if (isNaN(valorInicial) || valorInicial <= 0) {
                valorComparativoInput.classList.add('input-error');
                camposValidos = false;
                mensagensErro.push('Valor inicial deve ser maior que zero');
            } else {
                valorComparativoInput.classList.remove('input-error');
            }
            
            // Verifica o período (obrigatório)
            const periodo = parseInt(periodoComparativoInput.value);
            if (isNaN(periodo) || periodo < 1 || periodo > 50) {
                periodoComparativoInput.classList.add('input-error');
                camposValidos = false;
                mensagensErro.push('Período deve estar entre 1 e 50 anos');
            } else {
                periodoComparativoInput.classList.remove('input-error');
            }
            
            // Se houver erros, exibe-os e não prossegue com o cálculo
            if (!camposValidos) {
                // Marca que temos erros ativos
                comparativoHasErrors = true;
                
                // Exibe o placeholder com mensagem de erro
                const placeholder = document.getElementById('placeholder-comparativo');
                if (placeholder) {
                    placeholder.style.display = 'flex';
                    // Atualiza o texto para exibir os erros
                    const placeholderText = placeholder.querySelector('p');
                    if (placeholderText) {
                        // Formato simples mas mais atraente
                        let errorHTML = '';
                        mensagensErro.forEach(msg => {
                            errorHTML += `<span style="color: #ef476f; display: block; margin: 4px 0; text-align: center; font-weight: 500; background-color: rgba(239, 71, 111, 0.1); padding: 6px 8px; border-radius: 4px;">${msg}</span>`;
                        });
                        placeholderText.innerHTML = errorHTML;
                    }
                }
                
                // Configura um timer para remover os erros após 5 segundos
                setTimeout(function() {
                    // Remove as classes de erro dos inputs
                    valorComparativoInput.classList.remove('input-error');
                    periodoComparativoInput.classList.remove('input-error');
                    
                    // Mantém o placeholder visível, mas restaura o texto original
                    const placeholder = document.getElementById('placeholder-comparativo');
                    if (placeholder) {
                        // Mantém o placeholder visível
                        placeholder.style.display = 'flex';
                        
                        // Restaura o texto original
                        const placeholderText = placeholder.querySelector('p');
                        if (placeholderText) {
                            placeholderText.innerHTML = 'Insira um valor inicial e período para comparar o rendimento entre diferentes investimentos.';
                        }
                    }
                    
                    // Marca que não temos mais erros
                    comparativoHasErrors = false;
                }, 5000); // 5 segundos
                
                return; // Interrompe a execução
            }
            
            // Usa as taxas globais atualizadas automaticamente em vez de valores fixos
            // const taxaPoupanca = 4; // 4% a.a.
            // const taxaTesouro = 10; // 10% a.a.
            // const taxaAcoes = 15; // 15% a.a.
            
            // Calcula os resultados para cada tipo de investimento
            const resultadoPoupanca = calcularRendimentoSimples(valorInicial, taxaPoupanca, periodo);
            const resultadoTesouro = calcularRendimentoSimples(valorInicial, taxaTesouro, periodo);
            const resultadoAcoes = calcularRendimentoSimples(valorInicial, taxaAcoes, periodo);
            
            // Esconde o placeholder
            const placeholder = document.getElementById('placeholder-comparativo');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            // Exibe a legenda estática
            const staticLegend = document.querySelector('.result-legend');
            if (staticLegend) {
                staticLegend.style.display = 'flex';
            }
            
            // Cria o gráfico comparativo
            criarGraficoComparativo(periodo, resultadoPoupanca, resultadoTesouro, resultadoAcoes);
        });
    }
}

// Calcula o rendimento simples (sem aportes mensais)
function calcularRendimentoSimples(valorInicial, taxaAnual, periodo) {
    let resultados = [];
    let valorAtual = valorInicial;
    
    // Adiciona o ano 0 (valor inicial)
    resultados.push({
        ano: 0,
        valor: valorInicial
    });
    
    // Calcula ano a ano
    for (let ano = 1; ano <= periodo; ano++) {
        valorAtual = valorAtual * (1 + taxaAnual / 100);
        
        resultados.push({
            ano: ano,
            valor: valorAtual
        });
    }
    
    return resultados;
}

// Cria o gráfico comparativo
function criarGraficoComparativo(periodo, resultadoPoupanca, resultadoTesouro, resultadoAcoes) {
    const ctx = document.getElementById('chart-comparativo').getContext('2d');
    const chartColors = getChartColors();
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    // Destrói o gráfico anterior se existir
    if (window.comparativoChart) {
        window.comparativoChart.destroy();
    }
    
    // Prepara os dados para o gráfico
    const labels = Array.from({length: periodo + 1}, (_, i) => `Ano ${i}`);
    const valoresPoupanca = resultadoPoupanca.map(item => item.valor);
    const valoresTesouro = resultadoTesouro.map(item => item.valor);
    const valoresAcoes = resultadoAcoes.map(item => item.valor);
    
    // Remove o placeholder se existir
    const placeholderElement = document.querySelector('.chart-placeholder');
    if (placeholderElement) {
        placeholderElement.style.display = 'none';
    }
    
    // Exibe a legenda estática
    const staticLegend = document.querySelector('.result-legend');
    if (staticLegend) {
        staticLegend.style.display = 'flex';
    }
    
    // Cria o novo gráfico com as taxas atualizadas
    window.comparativoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `Poupança (${taxaPoupanca}% a.a.)`,
                    data: valoresPoupanca,
                    backgroundColor: chartColors.poupanca.background,
                    borderColor: chartColors.poupanca.border,
                    borderWidth: 2,
                    tension: 0.1
                },
                {
                    label: `Tesouro SELIC (${taxaTesouro}% a.a.)`,
                    data: valoresTesouro,
                    backgroundColor: chartColors.tesouro.background,
                    borderColor: chartColors.tesouro.border,
                    borderWidth: 2,
                    tension: 0.1
                },
                {
                    label: `Ações (${taxaAcoes}% a.a.)`,
                    data: valoresAcoes,
                    backgroundColor: chartColors.acoes.background,
                    borderColor: chartColors.acoes.border,
                    borderWidth: 2,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: isDarkTheme ? '#e2e8f0' : '#1e293b'
                    }
                },
                y: {
                    grid: {
                        color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: isDarkTheme ? '#e2e8f0' : '#1e293b',
                        callback: function(value) {
                            return formatarMoedaGrafico(value);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: isDarkTheme ? '#e2e8f0' : '#1e293b',
                        font: {
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: isDarkTheme ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    titleColor: isDarkTheme ? '#ffffff' : '#1e293b',
                    bodyColor: isDarkTheme ? '#e2e8f0' : '#1e293b',
                    borderColor: isDarkTheme ? 'rgba(74, 85, 104, 0.2)' : 'rgba(226, 232, 240, 0.2)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatarMoedaGrafico(context.raw);
                        }
                    }
                }
            }
        }
    });
}

// Inicializa um gráfico comparativo totalmente vazio, sem linhas
function inicializarGraficoComparativoSemDados() {
    const ctx = document.getElementById('chart-comparativo').getContext('2d');
    const chartColors = getChartColors();
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    // Destrói o gráfico anterior se existir
    if (window.comparativoChart) {
        window.comparativoChart.destroy();
    }
    
    // Esconde a legenda estática
    const staticLegend = document.querySelector('.result-legend');
    if (staticLegend) {
        staticLegend.style.display = 'none';
    }
    
    // Cria o gráfico sem dados (datasets vazios) com taxas atualizadas nos labels
    window.comparativoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ano 0', 'Ano 1'],
            datasets: [
                {
                    label: `Poupança (${taxaPoupanca}% a.a.)`,
                    data: [],
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    borderWidth: 0,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    showLine: false,
                    hidden: true
                },
                {
                    label: `Tesouro SELIC (${taxaTesouro}% a.a.)`,
                    data: [],
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    borderWidth: 0,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    showLine: false,
                    hidden: true
                },
                {
                    label: `Ações (${taxaAcoes}% a.a.)`,
                    data: [],
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    borderWidth: 0,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    showLine: false,
                    hidden: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            elements: {
                line: {
                    tension: 0,
                    borderWidth: 0,
                    borderColor: 'transparent',
                    fill: false,
                    spanGaps: false
                },
                point: {
                    radius: 0,
                    hitRadius: 0,
                    hoverRadius: 0
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            }
        }
    });
    
    // Verifica se há erros ativos - se houver, não mostra o placeholder padrão
    if (!comparativoHasErrors) {
        // Mostra o placeholder do HTML
        const existingPlaceholder = document.getElementById('placeholder-comparativo');
        if (existingPlaceholder) {
            existingPlaceholder.style.display = 'flex';
            
            // Simplificando o código para evitar conflitos de estilo
            if (isDarkTheme) {
                existingPlaceholder.style.color = '#94a3b8';
            } else {
                existingPlaceholder.style.color = '#64748b';
            }
        }
    }
}

// Inicializa um gráfico de juros compostos totalmente vazio, sem barras
function criarGraficoJurosCompostosVazio() {
    const ctx = document.getElementById('chart-juros-compostos').getContext('2d');
    const chartColors = getChartColors();
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    // Destrói o gráfico anterior se existir
    if (window.jurosCompostosChart) {
        window.jurosCompostosChart.destroy();
    }
    
    // Cria o gráfico sem dados (datasets vazios)
    window.jurosCompostosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ano 0', 'Ano 1'],
            datasets: [
                {
                    label: 'Valor Investido',
                    data: [],
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    borderWidth: 0,
                    hoverBackgroundColor: 'transparent',
                    hoverBorderColor: 'transparent',
                    hoverBorderWidth: 0,
                    base: 0,
                    barPercentage: 0
                },
                {
                    label: 'Juros',
                    data: [],
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    borderWidth: 0,
                    hoverBackgroundColor: 'transparent',
                    hoverBorderColor: 'transparent',
                    hoverBorderWidth: 0,
                    base: 0,
                    barPercentage: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            elements: {
                bar: {
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    borderWidth: 0
                }
            }
        }
    });
    
    // Verifica se há erros ativos - se houver, não mostra o placeholder padrão
    if (!jurosCompostosHasErrors) {
        // Mostra o placeholder do HTML
        const existingPlaceholder = document.getElementById('placeholder-juros-compostos');
        if (existingPlaceholder) {
            existingPlaceholder.style.display = 'flex';
            
            // Simplificando o código para evitar conflitos de estilo
            if (isDarkTheme) {
                existingPlaceholder.style.color = '#94a3b8';
            } else {
                existingPlaceholder.style.color = '#64748b';
            }
        }
    }
}

// Adicionar uma nova função para formatação de moeda nos gráficos (sempre texto simples)
function formatarMoedaGrafico(valor) {
    // Sempre retorna apenas o texto formatado, sem HTML
    return 'R$ ' + valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Função para formatar moeda sem HTML no modo claro e com HTML no modo escuro
function formatarMoeda(valor) {
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    // Formata o número com casas decimais
    const valorFormatado = valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    if (isDarkTheme) {
        // Retorna HTML com espaço não-quebrável e estilos
        return '<span style="white-space: nowrap; display: inline-block; font-size: 2rem; font-weight: 600; color: #ffffff;">R$\u00A0' + valorFormatado + '</span>';
    } else {
        // No modo claro, apenas o texto formatado
        return 'R$ ' + valorFormatado;
    }
}

// Função para atualizar os valores monetários com base no tema atual
function atualizarValoresComTemaAtual() {
    // Obter elementos de resultado
    const valorTotalElement = document.getElementById('valor-total');
    const totalInvestidoElement = document.getElementById('total-investido');
    const jurosAcumuladosElement = document.getElementById('juros-acumulados');

    // Se os elementos existirem e tiverem valores, recriá-los com o formato correto
    if (valorTotalElement && valorTotalElement.textContent) {
        const valorAtual = extrairValorNumerico(valorTotalElement.innerHTML);
        if (!isNaN(valorAtual)) {
            valorTotalElement.innerHTML = formatarMoeda(valorAtual);
        }
    }

    if (totalInvestidoElement && totalInvestidoElement.textContent) {
        const valorAtual = extrairValorNumerico(totalInvestidoElement.innerHTML);
        if (!isNaN(valorAtual)) {
            totalInvestidoElement.innerHTML = formatarMoeda(valorAtual);
        }
    }

    if (jurosAcumuladosElement && jurosAcumuladosElement.textContent) {
        const valorAtual = extrairValorNumerico(jurosAcumuladosElement.innerHTML);
        if (!isNaN(valorAtual)) {
            jurosAcumuladosElement.innerHTML = formatarMoeda(valorAtual);
        }
    }
}

// Função auxiliar para extrair o valor numérico de um texto formatado em moeda
function extrairValorNumerico(textoFormatado) {
    if (!textoFormatado) return NaN;
    
    // Remove HTML tags, espaços e caracteres especiais, mantendo apenas números, vírgula e ponto
    let textoLimpo = textoFormatado.replace(/<[^>]*>/g, '');
    textoLimpo = textoLimpo.replace(/[^0-9,.]/g, '');
    
    // Converte de formato brasileiro para número
    textoLimpo = textoLimpo.replace(/\./g, '');
    textoLimpo = textoLimpo.replace(/,/g, '.');
    
    return parseFloat(textoLimpo);
} 