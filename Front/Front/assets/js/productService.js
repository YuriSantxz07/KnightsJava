// Serviço para comunicação com a API de produtos
class ProductService {
    static async getAllProducts() {
        try {
            const response = await fetch('https://api.technova.com/products');
            if (!response.ok) throw new Error('Erro ao carregar produtos');
            return await response.json();
        } catch (error) {
            console.error('Erro no ProductService.getAllProducts:', error);
            throw error;
        }
    }
    
    static async getProductById(id) {
        try {
            const response = await fetch(`https://api.technova.com/products/${id}`);
            if (!response.ok) throw new Error('Erro ao carregar produto');
            return await response.json();
        } catch (error) {
            console.error('Erro no ProductService.getProductById:', error);
            throw error;
        }
    }
    
    static async addProduct(productData) {
        try {
            const response = await fetch('https://api.technova.com/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });
            
            if (!response.ok) throw new Error('Erro ao adicionar produto');
            return await response.json();
        } catch (error) {
            console.error('Erro no ProductService.addProduct:', error);
            throw error;
        }
    }
    
    static async updateProduct(id, productData) {
        try {
            const response = await fetch(`https://api.technova.com/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });
            
            if (!response.ok) throw new Error('Erro ao atualizar produto');
            return await response.json();
        } catch (error) {
            console.error('Erro no ProductService.updateProduct:', error);
            throw error;
        }
    }
    
    static async deleteProduct(id) {
        try {
            const response = await fetch(`https://api.technova.com/products/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Erro ao deletar produto');
            return true;
        } catch (error) {
            console.error('Erro no ProductService.deleteProduct:', error);
            throw error;
        }
    }
    
    static async updateStock(id, quantityChange) {
        try {
            const response = await fetch(`https://api.technova.com/products/${id}/stock`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ change: quantityChange })
            });
            
            if (!response.ok) throw new Error('Erro ao atualizar estoque');
            return await response.json();
        } catch (error) {
            console.error('Erro no ProductService.updateStock:', error);
            throw error;
        }
    }
}
