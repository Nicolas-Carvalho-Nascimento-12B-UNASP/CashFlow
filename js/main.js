// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa as bibliotecas
    initAOS();
    initSwiper();
    
    // Inicializa as funcionalidades do site
    initNavigation();
    initThemeToggle();
    initTabs();
    initAccordion();
    
    // Atualiza os indicadores de risco com base no tema atual
    const isDarkTheme = document.body.classList.contains('dark-theme');
    // Não é mais necessário atualizar os indicadores de risco via JavaScript
    // pois agora estamos usando uma abordagem CSS com as classes light-only e dark-only
    // updateRiskIndicators(isDarkTheme);
    
    // Força a exibição correta dos indicadores de risco
    forceRiskIndicatorsVisibility(isDarkTheme);
    
    // Adiciona evento de scroll para o header
    window.addEventListener('scroll', handleScroll);
    
    // Inicializa a funcionalidade de copiar email
    initCopyEmail();
});

// Inicializa a biblioteca AOS (Animate On Scroll)
function initAOS() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: true,
        disable: 'mobile'
    });
}

// Inicializa o Swiper para os depoimentos
function initSwiper() {
    new Swiper('.testimonials-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoHeight: false, // Desativa a altura automática
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        breakpoints: {
            768: {
                slidesPerView: 1
            },
            1024: {
                slidesPerView: 1
            }
        },
        on: {
            init: function() {
                // Adiciona um pequeno delay para garantir que os estilos sejam aplicados corretamente
                setTimeout(() => {
                    // Força a aplicação das sombras corretamente em todos os slides
                    document.querySelectorAll('.testimonial-card').forEach(card => {
                        card.style.willChange = 'transform';
                        card.style.transform = 'translateZ(0)';
                        card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                        card.style.display = 'flex';
                        card.style.height = '100%';
                    });
                    
                    // Equaliza a altura de todos os slides
                    const allSlides = document.querySelectorAll('.swiper-slide');
                    let maxHeight = 0;
                    
                    // Primeiro encontra a altura máxima
                    allSlides.forEach(slide => {
                        slide.style.height = 'auto'; // Temporariamente define altura como auto para medir
                        const slideHeight = slide.offsetHeight;
                        if (slideHeight > maxHeight) {
                            maxHeight = slideHeight;
                        }
                    });
                    
                    // Depois aplica a mesma altura para todos
                    if (maxHeight > 0) {
                        allSlides.forEach(slide => {
                            slide.style.height = `${maxHeight}px`;
                        });
                    }
                    
                    // Ajusta a posição da paginação
                    const paginationEl = document.querySelector('.swiper-pagination');
                    if (paginationEl) {
                        paginationEl.style.position = 'relative';
                        paginationEl.style.bottom = '-5px';
                        paginationEl.style.marginTop = '20px';
                    }
                    
                    // Garante que o tema escuro aplique as sombras corretas
                    if (document.body.classList.contains('dark-theme')) {
                        document.querySelectorAll('.testimonial-card').forEach(card => {
                            card.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                            card.style.border = '1px solid rgba(67, 97, 238, 0.15)';
                        });
                    }
                }, 100);
            }
        }
    });
}

// Inicializa a navegação mobile
function initNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-list a');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Fecha o menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
}

// Inicializa o toggle de tema claro/escuro
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Verifica se há preferência salva
    const savedTheme = localStorage.getItem('theme');
    
    // Verifica se o usuário prefere tema escuro no sistema
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Aplica o tema escuro se foi salvo ou se o usuário prefere tema escuro no sistema
    if (savedTheme === 'dark' || (savedTheme === null && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
        updateHeroWaveColor(true);
        // Não é mais necessário atualizar os indicadores de risco via JavaScript
        // updateRiskIndicators(true);
        
        // Força a exibição correta dos indicadores de risco
        forceRiskIndicatorsVisibility(true);
    } else {
        updateHeroWaveColor(false);
        // Não é mais necessário atualizar os indicadores de risco via JavaScript
        // updateRiskIndicators(false);
        
        // Força a exibição correta dos indicadores de risco
        forceRiskIndicatorsVisibility(false);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const isDarkMode = document.body.classList.contains('dark-theme');
            
            // Atualiza a cor da onda do hero
            updateHeroWaveColor(isDarkMode);
            
            // Força a exibição correta dos indicadores de risco
            forceRiskIndicatorsVisibility(isDarkMode);
            
            // Atualiza os gráficos das calculadoras se existirem
            updateChartsForTheme();
            
            // Salva a preferência
            if (isDarkMode) {
                localStorage.setItem('theme', 'dark');
                // Não é mais necessário atualizar os indicadores de risco via JavaScript
                // updateRiskIndicators(true);
            } else {
                localStorage.setItem('theme', 'light');
                // Não é mais necessário atualizar os indicadores de risco via JavaScript
                // updateRiskIndicators(false);
            }
        });
    }
    
    // Adiciona um listener para mudanças na preferência do sistema
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-theme');
                updateHeroWaveColor(true);
                // Não é mais necessário atualizar os indicadores de risco via JavaScript
                // updateRiskIndicators(true);
                
                // Força a exibição correta dos indicadores de risco
                forceRiskIndicatorsVisibility(true);
                
                // Atualiza os gráficos das calculadoras se existirem
                updateChartsForTheme();
            } else {
                document.body.classList.remove('dark-theme');
                updateHeroWaveColor(false);
                // Não é mais necessário atualizar os indicadores de risco via JavaScript
                // updateRiskIndicators(false);
                
                // Força a exibição correta dos indicadores de risco
                forceRiskIndicatorsVisibility(false);
                
                // Atualiza os gráficos das calculadoras se existirem
                updateChartsForTheme();
            }
        }
    });
}

// Função para atualizar a cor da onda do hero
function updateHeroWaveColor(isDarkMode) {
    const heroWavePath = document.querySelector('.hero-wave-path');
    if (heroWavePath) {
        if (isDarkMode) {
            heroWavePath.setAttribute('fill', '#1e293b');
        } else {
            heroWavePath.setAttribute('fill', '#ffffff');
        }
    }
}

// Função para atualizar os indicadores de risco com base no tema
function updateRiskIndicators(isDarkTheme) {
    // Esta função foi substituída por uma abordagem CSS
    // Usando as classes light-only e dark-only
    // Mantida apenas para compatibilidade com código existente
    console.log("Usando abordagem CSS para indicadores de risco");
    return;
    
    // Código antigo comentado abaixo
    /*
    // Cores para o tema claro (com opacidade)
    const lightColors = {
        low: 'rgba(74, 222, 128, 0.7)',
        medium: 'rgba(251, 191, 36, 0.7)',
        high: 'rgba(249, 115, 22, 0.7)',
        veryHigh: 'rgba(239, 68, 68, 0.7)'
    };
    
    // Cores para o tema escuro (com opacidade)
    const darkColors = {
        low: 'rgba(34, 197, 94, 0.7)',
        medium: 'rgba(234, 179, 8, 0.7)',
        high: 'rgba(234, 88, 12, 0.7)',
        veryHigh: 'rgba(220, 38, 38, 0.7)'
    };
    
    // Cor do texto
    const textColor = isDarkTheme ? '#e2e8f0' : '#1e293b';
    
    // Seleciona todos os indicadores de risco
    const riskIndicators = document.querySelectorAll('.risk-level span');
    
    // Atualiza as cores com base no tema
    riskIndicators.forEach(indicator => {
        const text = indicator.textContent.trim();
        let color;
        
        if (text === 'Baixo') {
            color = isDarkTheme ? darkColors.low : lightColors.low;
        } else if (text === 'Médio') {
            color = isDarkTheme ? darkColors.medium : lightColors.medium;
        } else if (text === 'Alto') {
            color = isDarkTheme ? darkColors.high : lightColors.high;
        } else if (text === 'Muito Alto') {
            color = isDarkTheme ? darkColors.veryHigh : lightColors.veryHigh;
        }
        
        if (color) {
            indicator.style.backgroundColor = color;
            indicator.style.color = textColor;
            
            // Garantir que o tamanho e o padding sejam mantidos
            indicator.style.padding = '0.4rem 0.9rem';
            indicator.style.fontSize = '1.1rem';
            indicator.style.fontWeight = '700';
            indicator.style.borderRadius = '9999px';
            indicator.style.marginLeft = '0.3rem';
        }
    });
    */
}

// Inicializa as tabs de tipos de investimentos
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const calcTabs = document.querySelectorAll('.calc-tab');
    
    // Tabs de tipos de investimentos
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove a classe active de todos os botões e painéis
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Adiciona a classe active ao botão clicado e ao painel correspondente
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Força a exibição correta dos indicadores de risco após a mudança de aba
            const isDarkTheme = document.body.classList.contains('dark-theme');
            setTimeout(() => {
                forceRiskIndicatorsVisibility(isDarkTheme);
            }, 100); // Pequeno atraso para garantir que o DOM foi atualizado
            
            // Não é mais necessário atualizar os indicadores de risco via JavaScript
            // pois agora estamos usando uma abordagem CSS com as classes light-only e dark-only
        });
    });
    
    // Tabs de calculadoras
    calcTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const calcId = this.getAttribute('data-calc');
            
            // Remove a classe active de todos os botões e calculadoras
            document.querySelectorAll('.calc-tab').forEach(t => {
                t.classList.remove('active');
            });
            document.querySelectorAll('.calculator').forEach(calc => {
                calc.classList.remove('active');
            });
            
            // Adiciona a classe active ao botão clicado e à calculadora correspondente
            this.classList.add('active');
            document.getElementById(calcId).classList.add('active');
            
            // Gerencia a visibilidade dos placeholders com base nos dados
            if (calcId === 'juros-compostos') {
                const hasData = window.jurosCompostosChart && 
                               window.jurosCompostosChart.data && 
                               window.jurosCompostosChart.data.datasets &&
                               window.jurosCompostosChart.data.datasets[0] &&
                               window.jurosCompostosChart.data.datasets[0].data &&
                               window.jurosCompostosChart.data.datasets[0].data.some(value => value > 0);
                
                const placeholder = document.getElementById('placeholder-juros-compostos');
                if (placeholder) {
                    placeholder.style.display = hasData ? 'none' : 'flex';
                }
            } else if (calcId === 'comparativo') {
                const hasData = window.comparativoChart && 
                               window.comparativoChart.data && 
                               window.comparativoChart.data.datasets &&
                               window.comparativoChart.data.datasets[0] &&
                               window.comparativoChart.data.datasets[0].data &&
                               window.comparativoChart.data.datasets[0].data.some(value => value > 0);
                
                const placeholder = document.getElementById('placeholder-comparativo');
                if (placeholder) {
                    placeholder.style.display = hasData ? 'none' : 'flex';
                }
                
                // Controla a visibilidade da legenda estática
                const staticLegend = document.querySelector('.result-legend');
                if (staticLegend) {
                    staticLegend.style.display = hasData ? 'flex' : 'none';
                }
            }
        });
    });
}

// Inicializa o acordeão do FAQ
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            
            // Verifica se o item já está ativo
            const isActive = accordionItem.classList.contains('active');
            
            // Fecha todos os itens
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Se o item não estava ativo, abre-o
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
}

// Manipula o evento de scroll
function handleScroll() {
    const header = document.querySelector('.header');
    
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Animação com GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        initScrollAnimations();
    }
}

// Inicializa animações de scroll com GSAP
function initScrollAnimations() {
    // Removendo a animação GSAP para os cards, pois já estamos usando AOS
    // Isso evita conflitos entre as duas bibliotecas de animação
}

// Função para garantir que os indicadores de risco sejam exibidos corretamente
function forceRiskIndicatorsVisibility(isDarkMode) {
    const lightIndicators = document.querySelectorAll('.light-only');
    const darkIndicators = document.querySelectorAll('.dark-only');
    
    if (isDarkMode) {
        lightIndicators.forEach(indicator => {
            indicator.style.display = 'none';
        });
        darkIndicators.forEach(indicator => {
            indicator.style.display = 'inline-block';
            // Aumenta a opacidade do fundo para garantir que seja visível no modo escuro
            const bgColor = indicator.style.backgroundColor;
            if (bgColor && bgColor.includes('rgba')) {
                // Substitui a opacidade para 0.9 em vez de 0.7
                const newBgColor = bgColor.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/, 'rgba($1,$2,$3,0.9)');
                indicator.style.backgroundColor = newBgColor;
            }
            
            // Tratamento especial para o indicador "Alto"
            if (indicator.textContent.trim() === 'Alto') {
                indicator.style.backgroundColor = 'rgba(249, 115, 22, 0.9)';
                indicator.style.color = '#ffffff';
                indicator.style.border = '1px solid rgba(249, 115, 22, 1)';
                indicator.style.boxShadow = '0 0 8px rgba(0, 0, 0, 0.3)';
                indicator.style.opacity = '1';
                indicator.style.visibility = 'visible';
            }
        });
    } else {
        lightIndicators.forEach(indicator => {
            indicator.style.display = 'inline-block';
        });
        darkIndicators.forEach(indicator => {
            indicator.style.display = 'none';
        });
    }
}

// Função para atualizar os gráficos quando o tema mudar
function updateChartsForTheme() {
    // Vamos capturar os gráficos atuais antes de alterá-los
    let jurosCompostosData = null;
    let comparativoData = null;
    
    // Gráfico de juros compostos
    if (typeof window.jurosCompostosChart !== 'undefined' && window.jurosCompostosChart) {
        const datasets = window.jurosCompostosChart.data.datasets;
        
        // Verificar se há dados reais no gráfico (não vazio/null/0)
        if (datasets && datasets.length > 0 && datasets[0].data && datasets[0].data.length > 2 && 
            datasets[0].data.some(value => value > 0)) {
            
            jurosCompostosData = datasets[0].data.map((valor, index) => {
                return {
                    ano: index,
                    valorTotal: (datasets[0].data[index] || 0) + (datasets.length > 1 && datasets[1].data ? (datasets[1].data[index] || 0) : 0),
                    totalInvestido: datasets[0].data[index] || 0,
                    jurosAcumulados: datasets.length > 1 && datasets[1].data ? (datasets[1].data[index] || 0) : 0
                };
            });
        }
    }
    
    // Gráfico comparativo
    if (typeof window.comparativoChart !== 'undefined' && window.comparativoChart) {
        const datasets = window.comparativoChart.data.datasets;
        
        // Verificar se há dados reais no gráfico (não vazio/null/0)
        if (datasets && datasets.length > 0 && datasets[0].data && datasets[0].data.length > 2 && 
            datasets[0].data.some(value => value > 0)) {
            
            const periodo = (window.comparativoChart.data.labels.length || 2) - 1;
            
            // Reconstruir os objetos de resultado necessários para a função criarGraficoComparativo
            const resultadoPoupanca = datasets[0].data.map((valor, index) => {
                return { ano: index, valor: valor || 0 };
            });
            
            const resultadoTesouro = datasets.length > 1 && datasets[1].data ? 
                datasets[1].data.map((valor, index) => { return { ano: index, valor: valor || 0 }; }) : 
                resultadoPoupanca;
            
            const resultadoAcoes = datasets.length > 2 && datasets[2].data ? 
                datasets[2].data.map((valor, index) => { return { ano: index, valor: valor || 0 }; }) : 
                resultadoPoupanca;
                
            comparativoData = {
                periodo: periodo,
                resultadoPoupanca: resultadoPoupanca,
                resultadoTesouro: resultadoTesouro,
                resultadoAcoes: resultadoAcoes
            };
        }
    }
    
    // Agora que temos os dados salvos, vamos recriar os gráficos com as novas cores do tema
    
    // Inicialize gráficos vazios apenas se não houver dados
    if (document.getElementById('chart-juros-compostos')) {
        if (jurosCompostosData) {
            criarGraficoJurosCompostos(jurosCompostosData);
        } else {
            criarGraficoJurosCompostosVazio();
        }
    }
    
    if (document.getElementById('chart-comparativo')) {
        if (comparativoData) {
            criarGraficoComparativo(
                comparativoData.periodo, 
                comparativoData.resultadoPoupanca, 
                comparativoData.resultadoTesouro, 
                comparativoData.resultadoAcoes
            );
        } else {
            inicializarGraficoComparativoSemDados();
        }
    }
}

// Função para copiar o email ao clicar
function initCopyEmail() {
    const emailLink = document.querySelector('a[href^="mailto:"]');
    
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtém o email do atributo href
            const email = this.getAttribute('href').replace('mailto:', '');
            
            // Copia o email para a área de transferência
            navigator.clipboard.writeText(email)
                .then(() => {
                    // Cria uma notificação flutuante
                    const notification = document.createElement('div');
                    notification.className = 'copy-notification';
                    
                    // Posiciona a notificação à direita do link e centralizada verticalmente
                    const rect = this.getBoundingClientRect();
                    notification.style.position = 'fixed';
                    notification.style.top = `${rect.top + (rect.height / 2) - 15}px`; // Centraliza verticalmente
                    notification.style.left = `${rect.right + 15}px`; // 15px de distância à direita
                    
                    // Estiliza a notificação mais atraente
                    notification.style.backgroundColor = 'var(--color-primary)';
                    notification.style.color = 'white';
                    notification.style.padding = '8px 16px';
                    notification.style.borderRadius = '8px';
                    notification.style.fontSize = '14px';
                    notification.style.fontWeight = '600';
                    notification.style.boxShadow = '0 4px 15px rgba(0,0,0,0.25)';
                    notification.style.zIndex = '9999';
                    notification.style.transition = 'all 0.3s ease';
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateX(-10px)';
                    notification.style.border = '1px solid rgba(255,255,255,0.2)';
                    notification.style.backdropFilter = 'blur(5px)';
                    notification.style.webkitBackdropFilter = 'blur(5px)';
                    
                    // Adiciona ícone de check
                    notification.innerHTML = '<i class="fa-solid fa-check" style="margin-right: 6px;"></i> Email copiado!';
                    
                    // Adiciona a notificação ao DOM
                    document.body.appendChild(notification);
                    
                    // Mostra a notificação com animação
                    setTimeout(() => {
                        notification.style.opacity = '1';
                        notification.style.transform = 'translateX(0)';
                    }, 10);
                    
                    // Remove a notificação após 2 segundos
                    setTimeout(() => {
                        notification.style.opacity = '0';
                        notification.style.transform = 'translateX(10px)';
                        
                        // Remove o elemento do DOM após a transição
                        setTimeout(() => {
                            document.body.removeChild(notification);
                        }, 300);
                    }, 2000);
                })
                .catch(err => {
                    console.error('Erro ao copiar texto: ', err);
                    // Caso de erro, abrir o cliente de email normalmente
                    window.location.href = this.href;
                });
        });
    }
} 