package com.TechNova.Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoDTO {
    private Integer id;
    private String nome;
    private String textoDescritivo;
    private String cor;
    private String fabricante;
    private BigDecimal preco;
    private Integer quantidade;
    private List<String> imagens;
}
