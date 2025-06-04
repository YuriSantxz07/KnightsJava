// Lógica do formulário de adição de produto
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-product-form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const productData = {
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            price: parseFloat(document.getElementById('product-price').value),
            quantity: parseInt(document.getElementById('product-quantity').value),
            image: document.getElementById('product-image').value || null
        };
        
        try {
            await ProductService.addProduct(productData);
            showMessage('Produto cadastrado com sucesso!', 'success');
            form.reset();
        } catch (error) {
            showMessage('Erro ao cadastrar produto. Verifique os dados e tente novamente.', 'error');
        }
    });
});

function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    
    const form = document.querySelector('.product-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    setTimeout(() => messageDiv.remove(), 5000);
}