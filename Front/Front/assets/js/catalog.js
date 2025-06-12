document.addEventListener('DOMContentLoaded', async function () {
    
    const catalogContainer = document.getElementById('catalog-container');

    if (!catalogContainer) {
        console.error('Elemento #catalog-container não encontrado!');
        return;
    }

    catalogContainer.innerHTML = '';

    const BASE_API_URL = 'http://localhost:8080/api/produtos';

    // =========================
    // ROTAÇÃO DE MINIATURAS
    // =========================
    const rotacaoProdutos = [];
    let intervaloGlobalIniciado = false;

    function registrarRotacao(mainImg, thumbnailsContainer) {
        const thumbs = Array.from(thumbnailsContainer.querySelectorAll('.product-thumbnail'));
        let currentIndex = 0;
        let isHovered = false;

        function updateImage(index) {
            currentIndex = index;
            mainImg.style.opacity = 0;
            setTimeout(() => {
                mainImg.src = thumbs[currentIndex].src;
                mainImg.style.opacity = 1;
            }, 200);

            thumbs.forEach((t, i) => {
                t.classList.toggle('selected', i === currentIndex);
            });
        }

        updateImage(0);

        mainImg.addEventListener('mouseenter', () => isHovered = true);
        mainImg.addEventListener('mouseleave', () => isHovered = false);

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => updateImage(index));
        });

        rotacaoProdutos.push({ mainImg, thumbs, currentIndex, isHovered, updateImage });

        if (!intervaloGlobalIniciado) {
            iniciarRotacaoGlobal();
            intervaloGlobalIniciado = true;
        }
    }

    function iniciarRotacaoGlobal() {
        setInterval(() => {
            rotacaoProdutos.forEach(produto => {
                if (!produto.isHovered) {
                    produto.currentIndex = (produto.currentIndex + 1) % produto.thumbs.length;
                    produto.updateImage(produto.currentIndex);
                }
            });
        }, 6000);
    }
    
    try {
        const response = await axios.get(BASE_API_URL);
        const products = response.data;

        for (const product of products) {
            // Buscar fotos do produto
            let fotos = [];
            try {
                const fotosResponse = await axios.get(`${BASE_API_URL}/${product.id}/fotos`);
                if (Array.isArray(fotosResponse.data)) {
                    fotos = fotosResponse.data;
                }
            } catch (fotoError) {
                console.warn(`Erro ao buscar fotos do produto ${product.id}:`, fotoError);
            }

            // Fallback para imagem padrão
            if (fotos.length === 0) {
                fotos = ['assets/images/products/default-product.jpg'];
            }

            const productCard = document.createElement('div');
            productCard.className = `product-card ${product.destaque ? 'featured-product' : ''}`;

            // Status de estoque
            let stockStatus = '';
            let stockText = '';
            if (product.quantidade === 0) {
                stockStatus = 'out-of-stock';
                stockText = 'Produto Esgotado';
            } else if (product.quantidade < 5 && product.quantidade > 1 ) {
                stockStatus = 'low-stock';
                stockText = `Últimas ${product.quantidade} unidades!`;
            } else if (product.quantidade === 1){
                stockStatus = 'low-stock';
                stockText = `Última unidade restante!`;
            }else {
                stockStatus = 'in-stock';
                stockText = `Disponível (+${product.quantidade} em estoque)`;
            }

            // Etiqueta
            const badgeHTML = product.etiqueta
                ? `<span class="product-badge">${product.etiqueta}</span>`
                : '';

            // Formatar preço
            const formattedPrice = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(product.preco);

            // Container da imagem principal
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

            // Container de miniaturas
            const thumbnailsContainer = document.createElement('div');
            thumbnailsContainer.className = 'product-thumbnails';

            fotos.forEach((fotoUrl, index) => {
                const thumbImg = document.createElement('img');
                thumbImg.src = fotoUrl;
                thumbImg.alt = `${product.nome} miniatura ${index + 1}`;
                thumbImg.className = 'product-thumbnail';
                thumbImg.style.cursor = 'pointer';
                if (index === 0) thumbImg.classList.add('selected');
                thumbImg.onerror = () => {
                    thumbImg.onerror = null;
                    thumbImg.src = 'assets/images/products/default-product.jpg';
                };
                thumbnailsContainer.appendChild(thumbImg);
            });

            imageContainer.appendChild(thumbnailsContainer);
            registrarRotacao(mainImg, thumbnailsContainer);

            // Container de informações
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
