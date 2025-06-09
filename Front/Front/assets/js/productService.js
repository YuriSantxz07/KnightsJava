class ProductService {
    static baseUrl = 'http://localhost:8080/api/produtos';

    // Instância centralizada do axios (com timeout e headers padrão)
    static axiosInstance = axios.create({
        baseURL: ProductService.baseUrl,
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Buscar todos os produtos
    static async getAllProducts() {
        try {
            const response = await this.axiosInstance.get('/');
            return response.data;
        } catch (error) {
            console.error('Erro no ProductService.getAllProducts:', error);
            throw error;
        }
    }

    // Buscar produto por ID
    static async getProductById(id) {
        if (!id) throw new Error('ID inválido para buscar produto.');
        try {
            const response = await this.axiosInstance.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro no ProductService.getProductById:', error);
            throw error;
        }
    }

    // Adicionar novo produto
    static async addProduct(productData) {
        if (!productData || typeof productData !== 'object') {
            throw new Error('Dados do produto inválidos para adição.');
        }
        try {
            const response = await this.axiosInstance.post('/', productData);
            return response.data;
        } catch (error) {
            console.error('Erro no ProductService.addProduct:', error);
            throw error;
        }
    }

    // Atualizar produto existente
    static async updateProduct(id, productData) {
        if (!id) throw new Error('ID inválido para atualizar produto.');
        if (!productData || typeof productData !== 'object') {
            throw new Error('Dados do produto inválidos para atualização.');
        }
        try {
            const response = await this.axiosInstance.put(`/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error('Erro no ProductService.updateProduct:', error);
            throw error;
        }
    }

    // Excluir produto
    static async deleteProduct(id) {
        if (!id) throw new Error('ID inválido para excluir produto.');
        try {
            await this.axiosInstance.delete(`/${id}`);
            return true;
        } catch (error) {
            console.error('Erro no ProductService.deleteProduct:', error);
            throw error;
        }
    }

    // Atualizar estoque
    static async updateStock(id, quantityChange) {
        if (!id) throw new Error('ID inválido para atualização de estoque.');
        if (typeof quantityChange !== 'number') {
            throw new Error('Alteração de estoque inválida. Deve ser um número.');
        }
        try {
            const response = await this.axiosInstance.patch(`/${id}/estoque`, {
                change: quantityChange
            });
            return response.data;
        } catch (error) {
            console.error('Erro no ProductService.updateStock:', error);
            throw error;
        }
    }
}
