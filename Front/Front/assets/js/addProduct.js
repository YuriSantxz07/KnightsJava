document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('add-product-form');
  const fileInput = document.getElementById('product-file');
  const imageURLInput = document.getElementById('product-image');
  const imagesPreviewContainer = document.getElementById('images-preview-container'); // container onde vamos mostrar as imagens preview
  const imagesData = []; // array local para armazenar as imagens (obj com {src, file?})

  // Função para renderizar os previews das imagens
  function renderImagesPreview() {
    imagesPreviewContainer.innerHTML = '';
    imagesData.forEach((img, index) => {
      const imgElem = document.createElement('img');
      imgElem.src = img.src;
      imgElem.classList.add('preview-img');
      imgElem.style.width = '100px';
      imgElem.style.margin = '5px';
      imgElem.style.cursor = 'pointer';

      // Botão para remover imagem
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'X';
      removeBtn.style.position = 'absolute';
      removeBtn.style.marginLeft = '-20px';
      removeBtn.style.background = 'red';
      removeBtn.style.color = 'white';
      removeBtn.style.border = 'none';
      removeBtn.style.cursor = 'pointer';

      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.display = 'inline-block';

      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        imagesData.splice(index, 1);
        renderImagesPreview();
      });

      wrapper.appendChild(imgElem);
      wrapper.appendChild(removeBtn);
      imagesPreviewContainer.appendChild(wrapper);
    });
  }

  // Adiciona imagem a partir de arquivo local
  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const src = URL.createObjectURL(file);
      imagesData.push({ src, file }); // armazeno também o arquivo local
    });
    renderImagesPreview();
    imageURLInput.value = ''; // limpa campo URL
    fileInput.value = ''; // reset input para poder reescolher mesmo arquivo depois
  });

  // Adiciona imagem a partir de URL digitada
  imageURLInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const url = imageURLInput.value.trim();
      if (url) {
        imagesData.push({ src: url }); // sem arquivo local, só url
        renderImagesPreview();
        imageURLInput.value = '';
      }
    }
  });

  // Função para mostrar mensagens
  function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;

    const formWrapper = document.querySelector('.form-wrapper form');
    formWrapper.insertBefore(messageDiv, formWrapper.firstChild);

    setTimeout(() => messageDiv.remove(), 5000);
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Monta objeto básico com dados do produto
    const productData = {
      nome: document.getElementById('product-name').value.trim(),
      texto_descritivo: document.getElementById('product-description').value.trim(),
      cor: document.getElementById('product-color').value.trim(),
      fabricante: document.getElementById('product-brand').value.trim(),
      preco: parseFloat(document.getElementById('product-price').value),
      quantidade: parseInt(document.getElementById('product-quantity').value),
      imagens: [] // vamos montar abaixo
    };

    // Aqui, para imagens, duas opções comuns:

    // 1) Enviar URLs direto (caso seu backend aceite)
    productData.imagens = imagesData.map(img => ({ urlImagem: img.src }));

    // 2) Ou se backend aceitar upload multipart/form-data, montar FormData com arquivos
    // Por simplicidade aqui mantemos a primeira opção.

    try {
      await axios.post('http://localhost:8080/api/produtos', productData);

      showMessage('Produto cadastrado com sucesso!', 'success');
      form.reset();
      imagesData.length = 0;
      renderImagesPreview();
      imageURLInput.value = '';
      fileInput.value = '';
    } catch (error) {
      showMessage('Erro ao cadastrar produto. Verifique os dados e tente novamente.', 'error');
      console.error(error);
    }
  });

  // Clique na label para abrir seletor de arquivos
  document.getElementById('image-preview-label').addEventListener('click', () => {
    fileInput.click();
  });

  // Inicializa preview vazio
  renderImagesPreview();
});
