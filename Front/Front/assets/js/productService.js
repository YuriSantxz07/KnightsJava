class ProductService {
    static baseUrl = 'http://localhost:8080/api/produtos';

    static async getAllProducts() {
        try {
            const response = await axios.get(this.baseUrl);
            return response.data;
        } catch (error) {
            console.error('Erro no ProductService.getAllProducts:', error);
            throw error;
        }
    }

    static async getProductById(id) {
        try {
            const response = await axios.get(`${this.baseUrl}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro no ProductService.getProductById:', error);
            throw error;
        }
    }

    static async addProduct(productData) {
        try {
            const response = await axios.post(this.baseUrl, productData);
            return response.data;
        } catch (error) {
            console.error('Erro no ProductService.addProduct:', error);
            throw error;
        }
    }

    static async updateProduct(id, productData) {
        try {
            const response = await axios.put(`${this.baseUrl}/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error('Erro no ProductService.updateProduct:', error);
            throw error;
        }
    }

    static async deleteProduct(id) {
        try {
            await axios.delete(`${this.baseUrl}/${id}`);
            return true;
        } catch (error) {
            console.error('Erro no ProductService.deleteProduct:', error);
            throw error;
        }
    }

    static async updateStock(id, quantityChange) {
        try {
            const response = await axios.patch(`${this.baseUrl}/${id}/estoque`, {
                change: quantityChange
            });
            return response.data;
        } catch (error) {
            console.error('Erro no ProductService.updateStock:', error);
            throw error;
        }
    }
}
