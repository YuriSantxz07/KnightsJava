document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('add-product-form');
  const fileInput = document.getElementById('product-file');
  const imageOutput = document.getElementById('image-output');
  const imageURLInput = document.getElementById('product-image');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Monta o objeto com os nomes dos atributos conforme pedido
    const productData = {
      nome: document.getElementById('product-name').value.trim(),
      texto_descritivo: document.getElementById('product-description').value.trim(),
      cor: document.getElementById('product-color').value.trim(),
      fabricante: document.getElementById('product-brand').value.trim(),
      preco: parseFloat(document.getElementById('product-price').value),
      quantidade: parseInt(document.getElementById('product-quantity').value),
      imagem: imageOutput.src  // opcional: pode enviar a url da imagem exibida
    };

    try {
      // Se existir ProductService com método addProduct, use:
      // await ProductService.addProduct(productData);

      // Caso queira usar axios diretamente:
      await axios.post('/api/produtos', productData);

      showMessage('Produto cadastrado com sucesso!', 'success');
      form.reset();

      // Reseta imagem para placeholder
      imageOutput.src = "https://via.placeholder.com/500x300?text=Clique+para+selecionar+uma+imagem";
      imageURLInput.value = '';
      fileInput.value = '';

    } catch (error) {
      showMessage('Erro ao cadastrar produto. Verifique os dados e tente novamente.', 'error');
      console.error(error);
    }
  });

  // Função para mostrar mensagens na tela
  function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;

    const formWrapper = document.querySelector('.form-wrapper form');
    formWrapper.insertBefore(messageDiv, formWrapper.firstChild);

    setTimeout(() => messageDiv.remove(), 5000);
  }

  // Clique na imagem para abrir o seletor de arquivos
  document.getElementById('image-preview-label').addEventListener('click', () => {
    fileInput.click();
  });

  // Atualiza preview ao selecionar arquivo local
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      imageOutput.src = URL.createObjectURL(file);
      imageURLInput.value = ''; // limpa campo URL se escolher arquivo local
    }
  });

  // Atualiza preview ao digitar URL
  imageURLInput.addEventListener('input', () => {
    const url = imageURLInput.value.trim();
    if (url) {
      imageOutput.src = url;
      fileInput.value = ''; // limpa arquivo local se digitar URL
    }
  });
});
