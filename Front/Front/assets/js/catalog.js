document.addEventListener('DOMContentLoaded', function() {
    // Dados de exemplo melhorados
    const products = [
        {
            id: 1,
            name: "Galaxy S23 Ultra",
            description: "O ápice da inovação Samsung com câmera de 200MP, S Pen integrada e bateria de 5000mAh. Tela Dynamic AMOLED 2X de 6.8''.",
            price: 8599.99,
            stock: 8,
            image: "https://images.samsung.com/is/image/samsung/p6pim/br/sm-s918bzkgzto/gallery/br-galaxy-s23-ultra-sm-s918-467368-sm-s918bzkgzto-536346616",
            badge: "Novidade"
        },
        {
            id: 2,
            name: "MacBook Pro 16'' M2 Max",
            description: "Chip M2 Max com 12 núcleos CPU e 38 GPU. Tela Liquid Retina XDR de 16.2''. Autonomia de até 22 horas.",
            price: 32999.00,
            stock: 3,
            image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=1808&hei=1680&fmt=jpeg&qlt=90&.v=1671304673209",
            badge: "Premium"
        },
        {
            id: 3,
            name: "Sony WH-1000XM5",
            description: "Cancelamento de ruído líder do mercado, 30h de bateria e som Hi-Res Wireless. Controle por toque intuitivo.",
            price: 2299.00,
            stock: 15,
            image: "https://m.media-amazon.com/images/I/61D8G+p4qmL._AC_SL1500_.jpg",
            featured: true
        },
        {
            id: 4,
            name: "LG OLED C3 77''",
            description: "TV OLED evo com α9 Gen6 AI Processor 4K, Dolby Vision IQ e Atmos. Game Optimizer para 120Hz em 4K.",
            price: 14999.99,
            stock: 0,
            image: "https://www.lg.com/br/images/tv/md07518696/gallery/OLED77C3_1100_1_v1.jpg",
            badge: "Esgotando"
        }
    ];

    const catalogContainer = document.getElementById('catalog-container');
    
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = `product-card ${product.featured ? 'featured-product' : ''}`;
        
        // Status do estoque
        let stockStatus, stockText;
        if (product.stock === 0) {
            stockStatus = 'out-of-stock';
            stockText = 'Produto Esgotado';
        } else if (product.stock < 5) {
            stockStatus = 'low-stock';
            stockText = `Últimas ${product.stock} unidades!`;
        } else {
            stockStatus = 'in-stock';
            stockText = `Disponível (${product.stock}+ em estoque)`;
        }
        
        // Badge condicional
        const badgeHTML = product.badge 
            ? `<span class="product-badge">${product.badge}</span>` 
            : '';
        
        productCard.innerHTML = `
            <div class="product-image-container">
                ${badgeHTML}
                <img src="${product.image}" alt="${product.name}" class="product-image" 
                     onerror="this.src='assets/images/products/default-product.jpg'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price.toFixed(2).replace('.', ',')}</div>
                <div class="product-stock">
                    <span class="stock-icon ${stockStatus}"></span>
                    <span>${stockText}</span>
                </div>
            </div>
        `;
        
        catalogContainer.appendChild(productCard);
    });
});