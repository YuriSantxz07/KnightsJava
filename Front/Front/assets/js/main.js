// Funções globais e inicialização da página inicial
document.addEventListener('DOMContentLoaded', function() {
    // Atualiza estatísticas na página inicial
    updateDashboardStats();
});

async function updateDashboardStats() {
    try {
        const response = await fetch('https://api.technova.com/products');
        const products = await response.json();
        
        document.getElementById('total-products').textContent = products.length;
        
        const inStock = products.filter(p => p.quantity > 0).length;
        document.getElementById('in-stock').textContent = inStock;
        
        const lowStock = products.filter(p => p.quantity > 0 && p.quantity < 5).length;
        document.getElementById('low-stock').textContent = lowStock;
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}