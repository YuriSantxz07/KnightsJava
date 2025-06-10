document.addEventListener('DOMContentLoaded', async function () {
    const tableBody = document.querySelector('#product-table tbody');
    const searchInput = document.getElementById('search-product');
    const refreshButton = document.getElementById('refresh-products');
    const BASE_API_URL = 'http://localhost:8080/api/produtos';

    let allProducts = [];

    async function loadProducts() {
        try {
            tableBody.innerHTML = '<tr><td colspan="8">Carregando produtos...</td></tr>';
            const response = await axios.get(BASE_API_URL);

            // Remove produtos duplicados com base no ID
            const uniqueProducts = [];
            const seenIds = new Set();

            for (const prod of response.data) {
                if (prod.id && !seenIds.has(prod.id)) {
                    seenIds.add(prod.id);
                    uniqueProducts.push(prod);
                }
            }

            allProducts = uniqueProducts;
            renderProducts(allProducts);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            tableBody.innerHTML = '<tr><td colspan="8">Erro ao carregar produtos.</td></tr>';
        }
    }

    async function renderProducts(products) {
        tableBody.innerHTML = '';

        for (const product of products) {
            let imageUrl = 'https://via.placeholder.com/100x100?text=Sem+Imagem';

            try {
                const fotosResponse = await axios.get(`${BASE_API_URL}/${product.id}/fotos`);
                const fotos = fotosResponse.data;
                if (Array.isArray(fotos) && fotos.length > 0) {
                    imageUrl = fotos[0];
                }
            } catch (fotoError) {
                console.warn(`Erro ao buscar fotos do produto ${product.id}:`, fotoError);
            }

            const formattedPrice = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(product.preco);

            const row = document.createElement('tr');

            // Coluna imagem
            const imgCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = product.nome;
            img.width = 80;
            img.height = 80;
            img.onerror = () => img.src = 'https://via.placeholder.com/100x100?text=Erro';
            imgCell.appendChild(img);
            row.appendChild(imgCell);

            // Nome
            const nomeCell = document.createElement('td');
            nomeCell.textContent = product.nome || '';
            row.appendChild(nomeCell);

            // Descrição (verifica várias possibilidades de chave)
            const descCell = document.createElement('td');
            descCell.textContent =
                product.textoDescritivo || 
                product.descricao || 
                'Sem descrição';
            row.appendChild(descCell);


            // Cor
            const corCell = document.createElement('td');
            corCell.textContent = product.cor || '';
            row.appendChild(corCell);

            // Fabricante
            const fabCell = document.createElement('td');
            fabCell.textContent = product.fabricante || '';
            row.appendChild(fabCell);

            // Preço
            const precoCell = document.createElement('td');
            precoCell.textContent = formattedPrice;
            row.appendChild(precoCell);

            // Estoque
            const estoqueCell = document.createElement('td');
            estoqueCell.textContent = product.quantidade != null ? product.quantidade : '';
            row.appendChild(estoqueCell);

            // Ações
            const actionsCell = document.createElement('td');
            actionsCell.classList.add('actions');

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.classList.add('action-btn', 'edit-btn');
            editBtn.dataset.id = product.id;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Excluir';
            deleteBtn.classList.add('action-btn', 'delete-btn');
            deleteBtn.dataset.id = product.id;

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
            row.appendChild(actionsCell);

            tableBody.appendChild(row);
        }
    }

    function filterProducts(searchTerm) {
        if (!searchTerm.trim()) return allProducts;

        const term = searchTerm.toLowerCase();
        return allProducts.filter(product =>
            (product.nome && product.nome.toLowerCase().includes(term)) ||
            (product.marca && product.marca.toLowerCase().includes(term)) ||
            (product.fabricante && product.fabricante.toLowerCase().includes(term)) ||
            (product.cor && product.cor.toLowerCase().includes(term))
        );
    }

    searchInput.addEventListener('input', () => {
        const filteredProducts = filterProducts(searchInput.value);
        renderProducts(filteredProducts);
    });

    refreshButton.addEventListener('click', loadProducts);

    tableBody.addEventListener('click', async function (e) {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains('delete-btn')) {
            if (confirm('Deseja realmente excluir este produto?')) {
                try {
                    await axios.delete(`${BASE_API_URL}/${id}`);
                    alert('Produto excluído com sucesso.');
                    await loadProducts();
                } catch (err) {
                    console.error('Erro ao excluir produto:', err);
                    alert('Erro ao excluir produto.');
                }
            }
        } else if (e.target.classList.contains('edit-btn')) {
            window.location.href = `/Front/edit-product.html?id=${id}`;
        }
    });

    await loadProducts();
});
