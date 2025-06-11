package com.TechNova.Back.service;


import com.TechNova.Back.DTO.ProdutoDTO;
import com.TechNova.Back.entity.ImagemProduto;
import com.TechNova.Back.entity.Produto;
import com.TechNova.Back.repository.ImagemProdutoRepository;
import com.TechNova.Back.repository.ProdutoRepository;


import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ImagemProdutoRepository imagemProdutoRepository;

    @Transactional
    public ProdutoDTO createProduto(ProdutoDTO dto) {
        Produto produto = new Produto();
        mapDtoToEntity(dto, produto);
        produtoRepository.save(produto);
        return mapEntityToDto(produto);
    }

    @Transactional(readOnly = true)
    public ProdutoDTO getProdutoById(Integer id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        return mapEntityToDto(produto);
    }

    @Transactional(readOnly = true)
    public List<ProdutoDTO> getAllProdutos() {
        return produtoRepository.findAll().stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProdutoDTO updateProduto(Integer id, ProdutoDTO dto) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        // Limpa imagens antigas para evitar conflito com orphanRemoval
        if (produto.getImagens() != null) {
            produto.getImagens().clear();
        }

        // Atualiza campos e adiciona novas imagens
        mapDtoToEntity(dto, produto);

        produtoRepository.save(produto);
        return mapEntityToDto(produto);
    }

    @Transactional
    public void deleteProduto(Integer id) {
        produtoRepository.deleteById(id);
    }

    @Transactional
    public ProdutoDTO updateEstoque(Integer id, int quantidade) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado com id: " + id));

        int novaQuantidade = produto.getQuantidade() + quantidade;
        if (novaQuantidade < 0) {
            throw new IllegalArgumentException("Quantidade em estoque não pode ser negativa");
        }

        produto.setQuantidade(novaQuantidade);
        return mapEntityToDto(produtoRepository.save(produto));
    }

    @Transactional(readOnly = true)
    public List<String> getFotosProduto(Integer id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        return produto.getImagens()
                .stream()
                .map(ImagemProduto::getUrlImagem)
                .toList();
    }

    @Transactional
    public void adicionarFoto(Integer id, String urlFoto) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        ImagemProduto novaImagem = new ImagemProduto();
        novaImagem.setUrlImagem(urlFoto);
        novaImagem.setProduto(produto);

        produto.getImagens().add(novaImagem);
        produtoRepository.save(produto);
    }

    public void salvarImagemUpload(Integer produtoId, MultipartFile imagem) throws IOException {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        // Supondo que você salve imagens como URL em banco
        String caminhoSalvo = armazenamentoService.salvar(imagem); // você deve implementar isso

        ImagemProduto foto = new ImagemProduto();
        foto.setProduto(produto);
        foto.setUrlImagem(caminhoSalvo);
        imagemProdutoRepository.save(foto);
    }


    @Transactional
    public void removerTodasFotos(Integer produtoId) {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));

        imagemProdutoRepository.deleteByProduto(produto);
    }



    private void mapDtoToEntity(ProdutoDTO dto, Produto produto) {
        produto.setNome(dto.getNome());
        produto.setTextoDescritivo(dto.getTextoDescritivo());
        produto.setCor(dto.getCor());
        produto.setFabricante(dto.getFabricante());
        produto.setPreco(dto.getPreco());
        produto.setQuantidade(dto.getQuantidade());

        // Garante que a lista de imagens esteja inicializada
        if (produto.getImagens() == null) {
            produto.setImagens(new ArrayList<>());
        }

        if (dto.getImagens() != null) {
            // Remove imagens que não estão mais no DTO
            produto.getImagens().removeIf(imagem -> !dto.getImagens().contains(imagem.getUrlImagem()));

            // Adiciona novas imagens do DTO que ainda não existem na entidade
            for (String url : dto.getImagens()) {
                boolean existe = produto.getImagens().stream()
                        .anyMatch(img -> img.getUrlImagem().equals(url));
                if (!existe) {
                    ImagemProduto novaImagem = new ImagemProduto();
                    novaImagem.setUrlImagem(url);
                    novaImagem.setProduto(produto);
                    produto.getImagens().add(novaImagem);
                }
            }
        } else {
            // Se dto.getImagens() for null, limpa a lista existente
            produto.getImagens().clear();
        }
    }


    private ProdutoDTO mapEntityToDto(Produto produto) {
        ProdutoDTO dto = new ProdutoDTO();
        dto.setId(produto.getId());
        dto.setNome(produto.getNome());
        dto.setTextoDescritivo(produto.getTextoDescritivo());
        dto.setCor(produto.getCor());
        dto.setFabricante(produto.getFabricante());
        dto.setPreco(produto.getPreco());
        dto.setQuantidade(produto.getQuantidade());

        if (produto.getImagens() != null) {
            dto.setImagens(produto.getImagens().stream()
                    .map(ImagemProduto::getUrlImagem)
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}
