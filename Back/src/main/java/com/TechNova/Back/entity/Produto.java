package com.TechNova.Back.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "produtos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "textoDescritivo", nullable = false, length = 250)
    private String textoDescritivo;

    @Column(name = "cor", nullable = false, length = 50)
    private String cor;

    @Column(name = "fabricante", nullable = false, length = 100)
    private String fabricante;

    @Column(name = "preco", nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImagemProduto> imagens = new ArrayList<>();

}
