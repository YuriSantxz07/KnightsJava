package com.TechNova.Back.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;

@Entity
@Table(name = "imagens_produto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImagemProduto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "url_imagem", nullable = false, length = 250)
    private String urlImagem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    public ImagemProduto(String url, Produto produto) {
        this.urlImagem = url;
        this.produto = produto;
    }
}