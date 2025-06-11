document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('add-product-form');
  const fileInput = document.getElementById('product-file');
  const imageURLInput = document.getElementById('product-image');
  const imagesPreviewContainer = document.getElementById('images-preview-container');
  const imagesData = [];

  // Renderiza o preview das imagens
  function renderImagesPreview() {
    imagesPreviewContainer.innerHTML = '';
    imagesData.forEach((img, index) => {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.display = 'inline-block';
      wrapper.style.margin = '5px';

      const imgElem = document.createElement('img');
      imgElem.src = img.src;
      imgElem.alt = 'Preview da imagem';
      imgElem.classList.add('preview-img');
      imgElem.style.width = '100px';
      imgElem.style.height = 'auto';
      imgElem.style.border = '1px solid #ccc';
      imgElem.style.borderRadius = '4px';

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'X';
      removeBtn.type = 'button';
      removeBtn.title = 'Remover imagem';
      removeBtn.style.position = 'absolute';
      removeBtn.style.top = '0';
      removeBtn.style.right = '0';
      removeBtn.style.background = 'red';
      removeBtn.style.color = 'white';
      removeBtn.style.border = 'none';
      removeBtn.style.borderRadius = '0 4px 0 4px';
      removeBtn.style.cursor = 'pointer';
      removeBtn.style.padding = '2px 6px';
      removeBtn.style.fontWeight = 'bold';

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

  // Adiciona imagem por arquivo local
  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const src = URL.createObjectURL(file);
      imagesData.push({ src, file });
    });
    renderImagesPreview();
    imageURLInput.value = '';
    fileInput.value = '';
  });

  // Adiciona imagem por URL ao pressionar Enter
  imageURLInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const url = imageURLInput.value.trim();
      if (url) {
        imagesData.push({ src: url });
        renderImagesPreview();
        imageURLInput.value = '';
      }
    }
  });

  // Função para mostrar mensagens de feedback
  function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messageDiv.style.padding = '10px';
    messageDiv.style.marginBottom = '15px';
    messageDiv.style.borderRadius = '4px';
    messageDiv.style.color = type === 'success' ? 'green' : 'red';
    messageDiv.style.fontWeight = 'bold';

    const formWrapper = form.parentNode;
    formWrapper.insertBefore(messageDiv, form);

    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }

  // Envio do formulário via axios
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const productData = {
      nome: document.getElementById('product-name').value.trim(),
      textoDescritivo: document.getElementById('product-description').value.trim(),
      cor: document.getElementById('product-color').value.trim(),
      fabricante: document.getElementById('product-brand').value.trim(),
      preco: parseFloat(document.getElementById('product-price').value),
      quantidade: parseInt(document.getElementById('product-quantity').value),
      imagens: imagesData.map(img => img.src)
    };

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

  // Permitir abrir seletor de arquivos clicando no label
  const imagePreviewLabel = document.getElementById('image-preview-label');
  if (imagePreviewLabel) {
    imagePreviewLabel.addEventListener('click', () => {
      fileInput.click();
    });
  }

  renderImagesPreview();
});
