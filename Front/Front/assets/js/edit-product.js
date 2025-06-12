
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    let imagensProduto = [];

    function renderizarImagens(imagens) {
      const container = document.getElementById('images-gallery');
      container.innerHTML = '';

      imagens.forEach((url, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-card';
        wrapper.innerHTML = `
          <img src="${url}" alt="Imagem ${index + 1}" />
          <input type="url" value="${url}" onchange="atualizarImagem(${index}, this.value)" />
          <button onclick="removerImagem(${index})" class="btn-remove">Remover</button>
        `;
        container.appendChild(wrapper);
      });
    }

    function atualizarImagem(index, novaUrl) {
      imagensProduto[index] = novaUrl;
      renderizarImagens(imagensProduto);
    }

    function removerImagem(index) {
      imagensProduto.splice(index, 1);
      renderizarImagens(imagensProduto);
    }

    function adicionarImagem() {
      const novaUrl = document.getElementById('new-image-url').value;
      if (novaUrl) {
        imagensProduto.push(novaUrl);
        document.getElementById('new-image-url').value = '';
        renderizarImagens(imagensProduto);
      }
    }

    async function uploadImagemArquivo() {
    const input = document.getElementById('file-input');
    const file = input.files[0];

    if (!file) {
      alert("Selecione uma imagem para enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("imagem", file);

    try {
      await axios.post(`http://localhost:8080/api/produtos/${productId}/fotos/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Atualiza a lista de imagens
      const fotosResp = await axios.get(`http://localhost:8080/api/produtos/${productId}/fotos`);
      imagensProduto = fotosResp.data;
      renderizarImagens(imagensProduto);

      input.value = ""; // limpa o input

    } catch (error) {
      alert("Erro ao enviar imagem: " + (error.response?.data?.message || error.message));
    }
  }


async function carregarProduto(id) {
  try {
    const produtoResp = await axios.get(`http://localhost:8080/api/produtos/${id}`);
    const fotosResp = await axios.get(`http://localhost:8080/api/produtos/${id}/fotos`);
    const produto = produtoResp.data;

    imagensProduto = fotosResp.data || [];

    document.getElementById('product-name').value = produto.nome;
    document.getElementById('product-description').value = produto.textoDescritivo;
    document.getElementById('product-price').value = produto.preco;
    document.getElementById('product-quantity').value = produto.quantidade;
    document.getElementById('product-color').value = produto.cor;
    document.getElementById('product-brand').value = produto.fabricante;

    renderizarImagens(imagensProduto);
  } catch (error) {
    alert("Erro ao carregar produto: " + (error.response?.data?.message || error.message));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (productId) {
    carregarProduto(productId);
  } else {
    alert("ID do produto não informado na URL");
  }

  document.getElementById('edit-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const produtoAtualizado = {
      nome: document.getElementById('product-name').value,
      textoDescritivo: document.getElementById('product-description').value,
      preco: parseFloat(document.getElementById('product-price').value),
      quantidade: parseInt(document.getElementById('product-quantity').value),
      cor: document.getElementById('product-color').value,
      fabricante: document.getElementById('product-brand').value
    };
  
    try {
      // Atualiza o produto
      await axios.put(`http://localhost:8080/api/produtos/${productId}`, produtoAtualizado);
  
      // Remove todas as imagens antigas
      await axios.delete(`http://localhost:8080/api/produtos/${productId}/fotos`);
  
      // Adiciona cada imagem nova
      for (const url of imagensProduto) {
        await axios.post(`http://localhost:8080/api/produtos/${productId}/fotos`, {
          url: url
        });
      }
  
      alert("Produto atualizado com sucesso!");
      window.location.href = "products.html";
  
    } catch (error) {
      alert("Erro ao salvar: " + (error.response?.data?.message || error.message));
    }
  });  
});

