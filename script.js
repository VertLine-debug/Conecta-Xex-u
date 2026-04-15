// ============================================
// DADOS DOS SERVIÇOS PARA PESQUISA
// ============================================
const servicesData = [
    { name: 'Carteira Estudantil', category: 'Destaques', icon: 'fa-id-card', desc: 'Solicite sua carteira de estudante municipal' },
    { name: 'Credpop Xexéu', category: 'Destaques', icon: 'fa-hand-holding-usd', desc: 'Programa de microcrédito popular' },
    { name: 'Academia Xexéu', category: 'Destaques', icon: 'fa-dumbbell', desc: 'Academia municipal gratuita' },
    { name: 'Saúde Xexéu', category: 'Destaques', icon: 'fa-laptop-medical', desc: 'Serviços de saúde municipal' },
    { name: 'IPTU Xexéu', category: 'Serviços', icon: 'fa-file-invoice-dollar', desc: 'Imposto Predial e Territorial Urbano' },
    { name: 'Iluminação Pública', category: 'Serviços', icon: 'fa-lightbulb', desc: 'Solicite reparos na iluminação' },
    { name: 'Poda e Limpeza', category: 'Serviços', icon: 'fa-tree', desc: 'Serviços de poda e limpeza urbana' },
    { name: 'Sinalização Urbana', category: 'Serviços', icon: 'fa-road', desc: 'Manutenção de sinalização' },
    { name: 'Transparência', category: 'Institucional', icon: 'fa-chart-line', desc: 'Portal da Transparência Municipal' },
    { name: 'Ouvidoria', category: 'Institucional', icon: 'fa-headset', desc: 'Fale com a Ouvidoria Municipal' },
    { name: 'Notícias', category: 'Institucional', icon: 'fa-newspaper', desc: 'Últimas notícias de Xexéu' }
];

// ============================================
// MENU MOBILE
// ============================================
const menuBtn = document.getElementById('menuButton');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const closeMenuBtn = document.getElementById('closeMenu');

function openMenu() {
    mobileMenu.classList.add('open');
    menuOverlay.classList.add('active');
    document.body.classList.add('menu-open');
}

function closeMenu() {
    mobileMenu.classList.remove('open');
    menuOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
}

if(menuBtn) menuBtn.addEventListener('click', openMenu);
if(closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
if(menuOverlay) menuOverlay.addEventListener('click', closeMenu);

// ============================================
// MAPA - TELA CHEIA SATÉLITE
// ============================================
function toggleMap() {
    const modal = document.getElementById('mapModal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    } else {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// ============================================
// PESQUISA
// ============================================
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchSuggestions = document.getElementById('searchSuggestions');

function toggleSearch() {
    if (searchModal.style.display === 'block') {
        searchModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (searchSuggestions) searchSuggestions.style.display = 'flex';
        if (searchResults) searchResults.style.display = 'none';
        if (searchInput) searchInput.value = '';
    } else {
        searchModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        if (searchSuggestions) searchSuggestions.style.display = 'flex';
        if (searchResults) searchResults.style.display = 'none';
        if (searchInput) {
            searchInput.value = '';
            setTimeout(() => searchInput.focus(), 100);
        }
    }
}

function updateSearchResults(query) {
    const filtered = servicesData.filter(service => 
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.category.toLowerCase().includes(query.toLowerCase()) ||
        service.desc.toLowerCase().includes(query.toLowerCase())
    );
    
    if (query.length === 0) {
        if (searchSuggestions) searchSuggestions.style.display = 'flex';
        if (searchResults) searchResults.style.display = 'none';
        return;
    }
    
    if (searchSuggestions) searchSuggestions.style.display = 'none';
    if (searchResults) searchResults.style.display = 'block';
    
    if (filtered.length === 0) {
        searchResults.innerHTML = `
            <div class="search-result-item-full" style="cursor: default;">
                <div class="search-result-icon">
                    <i class="fas fa-search"></i>
                </div>
                <div class="search-result-info">
                    <div class="search-result-name">Nenhum resultado encontrado</div>
                    <div class="search-result-category">Tente outro termo de busca</div>
                </div>
            </div>
        `;
        return;
    }
    
    searchResults.innerHTML = filtered.map(service => `
        <div class="search-result-item-full" onclick="selectService('${service.name}')">
            <div class="search-result-icon">
                <i class="fas ${service.icon}"></i>
            </div>
            <div class="search-result-info">
                <div class="search-result-name">${service.name}</div>
                <div class="search-result-category">${service.category} • ${service.desc}</div>
            </div>
            <i class="fas fa-chevron-right" style="color: #9ca3af;"></i>
        </div>
    `).join('');
}

function selectService(serviceName) {
    toggleSearch();
    showToast('🔍 ' + serviceName + ' - Em breve disponível');
}

function selectSuggestion(suggestionType) {
    toggleSearch();
    showToast('✨ ' + suggestionType + ' - Em breve no Conecta Xexéu');
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        updateSearchResults(e.target.value);
    });
}

// ============================================
// TECLAS DE ATALHO
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (searchModal.style.display === 'block') {
            toggleSearch();
        }
        if (document.getElementById('mapModal').style.display === 'block') {
            toggleMap();
        }
    }
});

// ============================================
// TOAST MESSAGE
// ============================================
const toastEl = document.getElementById('toastMessage');
let toastTimeout = null;

function showToast(message) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastEl.textContent = message;
    toastEl.style.display = 'block';
    toastEl.style.animation = 'fadeInUp 0.3s ease';
    toastTimeout = setTimeout(() => {
        toastEl.style.display = 'none';
    }, 2000);
}

// ============================================
// ELEMENTOS INTERATIVOS
// ============================================
const interactiveElements = [
    ...document.querySelectorAll('.highlight-card'),
    ...document.querySelectorAll('.service-btn'),
    ...document.querySelectorAll('.nav-btn:not([onclick])'),
    document.getElementById('mobileNoticias'),
    document.getElementById('mobilePerfil'),
    document.getElementById('mobileConfig'),
    document.getElementById('desktopNoticias')
].filter(el => el !== null);

interactiveElements.forEach(el => {
    el.addEventListener('click', (e) => {
        if (!el.hasAttribute('onclick') && el.tagName !== 'A') {
            e.preventDefault();
            const serviceName = el.getAttribute('data-service') || '✨';
            showToast(serviceName + ' - Em breve no Conecta Xexéu');
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(15);
            }
            closeMenu();
        }
    });
});

// ============================================
// BOTÃO DE PESQUISA FAB
// ============================================
document.getElementById('searchFab').addEventListener('click', (e) => {
    e.preventDefault();
    toggleSearch();
});

// ============================================
// ABA ATIVA DA NAVEGAÇÃO
// ============================================
const navButtons = document.querySelectorAll('.nav-btn');

function setActiveTab(activeBtn) {
    navButtons.forEach(btn => {
        const icon = btn.querySelector('i');
        const span = btn.querySelector('span');
        if (btn === activeBtn) {
            btn.classList.add('text-blue-600');
            btn.classList.remove('text-gray-400');
            if (span) span.classList.add('text-blue-700');
        } else {
            btn.classList.remove('text-blue-600');
            btn.classList.add('text-gray-400');
            if (span) span.classList.remove('text-blue-700');
        }
    });
}

navButtons.forEach(btn => {
    if (!btn.hasAttribute('onclick')) {
        btn.addEventListener('click', function() {
            setActiveTab(this);
        });
    }
});

const defaultHome = document.querySelector('[data-tab="home"]');
if(defaultHome) setActiveTab(defaultHome);

console.log('🚀 Conecta Xexéu - Sistema inicializado com sucesso!');
