package com.TechNova.Back.service;

import com.TechNova.Back.DTO.UsuarioDTO;
import com.TechNova.Back.entity.Produto;
import com.TechNova.Back.entity.Usuario;
import com.TechNova.Back.repository.ProdutoRepository;
import com.TechNova.Back.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    public UsuarioDTO criarUsuario(UsuarioDTO dto) {
        Usuario usuario = mapDtoToEntity(dto);
        usuario = usuarioRepository.save(usuario);
        return mapEntityToDto(usuario);
    }

    public List<UsuarioDTO> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    public Optional<UsuarioDTO> buscarPorId(Integer id) {
        return usuarioRepository.findById(id)
                .map(this::mapEntityToDto);
    }

    public UsuarioDTO atualizarUsuario(Integer id, UsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());
        usuario.setEndereco(dto.getEndereco());

        if (dto.getIdsProdutos() != null) {
            List<Produto> produtos = produtoRepository.findAllById(dto.getIdsProdutos());
            usuario.setListaProdutos(produtos);
        }

        usuario = usuarioRepository.save(usuario);
        return mapEntityToDto(usuario);
    }

    public void deletarUsuario(Integer id) {
        usuarioRepository.deleteById(id);
    }

    // Conversões
    private Usuario mapDtoToEntity(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setId(dto.getId());
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());
        usuario.setEndereco(dto.getEndereco());

        if (dto.getIdsProdutos() != null) {
            List<Produto> produtos = produtoRepository.findAllById(dto.getIdsProdutos());
            usuario.setListaProdutos(produtos);
        }

        return usuario;
    }

    private UsuarioDTO mapEntityToDto(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setSenha(usuario.getSenha());
        dto.setEndereco(usuario.getEndereco());

        if (usuario.getListaProdutos() != null) {
            dto.setIdsProdutos(
                    usuario.getListaProdutos()
                            .stream()
                            .map(Produto::getId)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }
}
