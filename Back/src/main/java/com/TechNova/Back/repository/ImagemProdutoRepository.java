package com.TechNova.Back.repository;


import com.TechNova.Back.entity.ImagemProduto;
import com.TechNova.Back.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImagemProdutoRepository extends JpaRepository<ImagemProduto, Integer> {
    void deleteByProduto(Produto produto);

}

