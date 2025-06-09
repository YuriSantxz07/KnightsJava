// Funções globais e inicialização da página inicial
document.addEventListener('DOMContentLoaded', function() {
    // Atualiza estatísticas na página inicial
    updateDashboardStats();
});

async function updateDashboardStats() {
    try {
        const response = await axios.get('http://localhost:8080/api/produtos');
        const products = response.data; // ✅ agora "products" está definido

        document.getElementById('total-products').textContent = products.length;

        const inStock = products.filter(p => p.quantidade > 0).length;
        document.getElementById('in-stock').textContent = inStock;

        const lowStock = products.filter(p => p.quantidade > 0 && p.quantidade < 5).length;
        document.getElementById('low-stock').textContent = lowStock;
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}
