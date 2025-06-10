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

        for (const product of products) {
            // Busca as fotos do produto
            let fotos = [];
            try {
                const fotosResponse = await axios.get(`${BASE_API_URL}/${product.id}/fotos`);
                if (Array.isArray(fotosResponse.data)) {
                    fotos = fotosResponse.data;
                }
            } catch (fotoError) {
                console.warn(`Erro ao buscar fotos do produto ${product.id}:`, fotoError);
            }

            // Se não tiver fotos, usa a imagem default como única foto
            if (fotos.length === 0) {
                fotos = ['assets/images/products/default-product.jpg'];
            }

            const productCard = document.createElement('div');
            productCard.className = `product-card ${product.destaque ? 'featured-product' : ''}`;
            let stockStatus, stockText;
            if (product.quantidade === 0) {
                stockStatus = 'out-of-stock';
                stockText = 'Produto Esgotado';
            } else if (product.quantidade < 5) {
                stockStatus = 'low-stock';
                stockText = `Últimas ${product.quantidade} unidades!`;
            } else {
                stockStatus = 'in-stock';
                stockText = `Disponível (${product.quantidade}+ em estoque)`;
            }

            const badgeHTML = product.etiqueta
                ? `<span class="product-badge">${product.etiqueta}</span>`
                : '';

            const formattedPrice = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(product.preco);

            // Container imagem principal
            const imageContainer = document.createElement('div');
            imageContainer.className = 'product-image-container';
            imageContainer.innerHTML = badgeHTML;

            const mainImg = document.createElement('img');
            mainImg.src = fotos[0];
            mainImg.alt = product.nome;
            mainImg.className = 'product-image';
            mainImg.onerror = () => {
                mainImg.onerror = null;
                mainImg.src = 'assets/images/products/default-product.jpg';
            };
            imageContainer.appendChild(mainImg);

            // Container miniaturas
            const thumbnailsContainer = document.createElement('div');
            thumbnailsContainer.className = 'product-thumbnails';

            fotos.forEach((fotoUrl, index) => {
                const thumbImg = document.createElement('img');
                thumbImg.src = fotoUrl;
                thumbImg.alt = `${product.nome} miniatura ${index + 1}`;
                thumbImg.className = 'product-thumbnail';
                thumbImg.style.cursor = 'pointer';
                if (index === 0) thumbImg.classList.add('selected'); // Primeira miniatura selecionada
                thumbImg.onerror = () => {
                    thumbImg.onerror = null;
                    thumbImg.src = 'assets/images/products/default-product.jpg';
                };

                // Ao clicar, troca imagem principal e marca miniatura selecionada
                thumbImg.addEventListener('click', () => {
                    mainImg.src = fotoUrl;

                    // Remove 'selected' de todas as miniaturas
                    const allThumbs = thumbnailsContainer.querySelectorAll('.product-thumbnail');
                    allThumbs.forEach(t => t.classList.remove('selected'));

                    // Marca essa como selecionada
                    thumbImg.classList.add('selected');
                });

                thumbnailsContainer.appendChild(thumbImg);
            });

            imageContainer.appendChild(thumbnailsContainer);

            // Container info produto
            const infoContainer = document.createElement('div');
            infoContainer.className = 'product-info';

            infoContainer.innerHTML = `
                <h3 class="product-title">${product.nome}</h3>
                <p class="product-description">${product.textoDescritivo}</p>
                <div class="product-price">${formattedPrice}</div>
                <div class="product-stock">
                    <span class="stock-icon ${stockStatus}"></span>
                    <span>${stockText}</span>
                </div>
            `;

            productCard.appendChild(imageContainer);
            productCard.appendChild(infoContainer);

            catalogContainer.appendChild(productCard);
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        catalogContainer.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
});
