package com.TechNova.Back.service;


import com.TechNova.Back.DTO.ProdutoDTO;
import com.TechNova.Back.entity.ImagemProduto;
import com.TechNova.Back.entity.Produto;
import com.TechNova.Back.repository.ImagemProdutoRepository;
import com.TechNova.Back.repository.ProdutoRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        mapDtoToEntity(dto, produto);
        produtoRepository.save(produto);
        return mapEntityToDto(produto);
    }

    @Transactional
    public void deleteProduto(Integer id) {
        produtoRepository.deleteById(id);
    }

    private void mapDtoToEntity(ProdutoDTO dto, Produto produto) {
        produto.setNome(dto.getNome());
        produto.setTextoDescritivo(dto.getTextoDescritivo());
        produto.setCor(dto.getCor());
        produto.setFabricante(dto.getFabricante());
        produto.setPreco(dto.getPreco());
        produto.setQuantidade(dto.getQuantidade());

        if (dto.getImagens() != null) {
            List<ImagemProduto> imagens = dto.getImagens().stream()
                    .map(url -> {
                        ImagemProduto imagem = new ImagemProduto();
                        imagem.setUrlImagem(url);
                        imagem.setProduto(produto);
                        return imagem;
                    })
                    .collect(Collectors.toList());
            produto.setImagens(imagens);
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
