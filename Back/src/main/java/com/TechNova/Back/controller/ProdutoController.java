package com.TechNova.Back.controller;



import com.TechNova.Back.DTO.FotoDTO;
import com.TechNova.Back.DTO.ProdutoDTO;
import com.TechNova.Back.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<ProdutoDTO> createProduto(@RequestBody ProdutoDTO produtoDTO) {
        ProdutoDTO created = produtoService.createProduto(produtoDTO);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTO> getProduto(@PathVariable Integer id) {
        ProdutoDTO produto = produtoService.getProdutoById(id);
        return ResponseEntity.ok(produto);
    }

    @GetMapping
    public ResponseEntity<List<ProdutoDTO>> getAllProdutos() {
        List<ProdutoDTO> produtos = produtoService.getAllProdutos();
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}/fotos")
    public ResponseEntity<List<String>> getFotosProduto(@PathVariable Integer id) {
        List<String> urls = produtoService.getFotosProduto(id);
        return ResponseEntity.ok(urls);
    }


    @PostMapping("/{id}/fotos")
    public ResponseEntity<Void> adicionarFoto(@PathVariable Integer id, @RequestBody FotoDTO fotoDTO) {
        produtoService.adicionarFoto(id, fotoDTO.getUrl());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/fotos")
    public ResponseEntity<Void> removerTodasFotos(@PathVariable Integer id) {
        produtoService.removerTodasFotos(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/fotos/upload")
    public ResponseEntity<Void> uploadImagem(@PathVariable Integer id, @RequestParam("imagem") MultipartFile imagem) {
        try {
            produtoService.salvarImagemUpload(id, imagem);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoDTO> updateProduto(@PathVariable Integer id, @RequestBody ProdutoDTO produtoDTO) {
        ProdutoDTO updated = produtoService.updateProduto(id, produtoDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduto(@PathVariable Integer id) {
        produtoService.deleteProduto(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estoque")
    public ResponseEntity<ProdutoDTO> atualizarEstoque(@PathVariable Integer id, @RequestParam int quantidade) {
        try {
            ProdutoDTO atualizado = produtoService.updateEstoque(id, quantidade);
            return ResponseEntity.ok(atualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}