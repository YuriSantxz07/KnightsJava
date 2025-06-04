// Lógica da página de listagem de produtos
document.addEventListener('DOMContentLoaded', async function() {
    await loadProducts();
    
    // Configura busca
    document.getElementById('search-product').addEventListener('input', debounce(searchProducts, 300));
    
    // Configura botão de atualizar
    document.getElementById('refresh-products').addEventListener('click', loadProducts);
});

async function loadProducts() {
    try {
        const products = await ProductService.getAllProducts();
        renderProducts(products);
    } catch (error) {
        showMessage('Erro ao carregar produtos. Tente novamente.', 'error');
    }
}

function renderProducts(products) {
    const tbody = document.querySelector('#products-table tbody');
    tbody.innerHTML = '';
    
    if (products.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="6" style="text-align: center;">Nenhum produto encontrado</td>';
        tbody.appendChild(tr);
        return;
    }
    
    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.description.substring(0, 50)}${product.description.length > 50 ? '...' : ''}</td>
            <td>R$ ${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${product.id}">Editar</button>
                <button class="action-btn delete-btn" data-id="${product.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Configura eventos dos botões
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            window.location.href = `edit-product.html?id=${productId}`;
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const productId = this.getAttribute('data-id');
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                try {
                    await ProductService.deleteProduct(productId);
                    showMessage('Produto excluído com sucesso!', 'success');
                    await loadProducts();
                } catch (error) {
                    showMessage('Erro ao excluir produto.', 'error');
                }
            }
        });
    });
}

function searchProducts() {
    const searchTerm = document.getElementById('search-product').value.toLowerCase();
    const rows = document.querySelectorAll('#products-table tbody tr');
    
    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const description = row.cells[2].textContent.toLowerCase();
        
        if (name.includes(searchTerm) || description.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    
    const main = document.querySelector('main');
    main.insertBefore(messageDiv, main.firstChild);
    
    setTimeout(() => messageDiv.remove(), 5000);
}