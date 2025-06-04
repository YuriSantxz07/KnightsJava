package com.TechNova.Back.DTO;

import com.TechNova.Back.entity.Produto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioDTO {
    private Integer id;
    private String nome;
    private String email;
    private String senha;
    private String endereco;

    private List<Integer> idsProdutos;
}
