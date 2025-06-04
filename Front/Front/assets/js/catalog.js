document.addEventListener('DOMContentLoaded', async function () {
    const catalogContainer = document.getElementById('catalog-container');

    if (!catalogContainer) {
        console.error('Elemento #catalog-container não encontrado!');
        return;
    }

    catalogContainer.innerHTML = '';

    const BASE_API_URL = 'http://localhost:8080/api/produtos';

    try {
        const response = await axios.get(BASE_API_URL);
        const products = response.data;

        products.forEach(product => {
            const imageUrl = product.fotoUrl || 'assets/images/products/default-product.jpg';

            const productCard = document.createElement('div');
            productCard.className = `product-card ${product.destaque ? 'featured-product' : ''}`;

            let stockStatus, stockText;
            if (product.estoque === 0) {
                stockStatus = 'out-of-stock';
                stockText = 'Produto Esgotado';
            } else if (product.estoque < 5) {
                stockStatus = 'low-stock';
                stockText = `Últimas ${product.estoque} unidades!`;
            } else {
                stockStatus = 'in-stock';
                stockText = `Disponível (${product.estoque}+ em estoque)`;
            }

            const badgeHTML = product.etiqueta
                ? `<span class="product-badge">${product.etiqueta}</span>`
                : '';

            const formattedPrice = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(product.preco);

            productCard.innerHTML = `
                <div class="product-image-container">
                    ${badgeHTML}
                    <img src="${imageUrl}" alt="${product.nome}" class="product-image"
                         onerror="this.onerror=null;this.src='assets/images/products/default-product.jpg'">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.nome}</h3>
                    <p class="product-description">${product.descricao}</p>
                    <div class="product-price">${formattedPrice}</div>
                    <div class="product-stock">
                        <span class="stock-icon ${stockStatus}"></span>
                        <span>${stockText}</span>
                    </div>
                </div>
            `;

            catalogContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        catalogContainer.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
});
