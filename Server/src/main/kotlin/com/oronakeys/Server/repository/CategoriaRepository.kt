package com.oronakeys.Server.repository

import com.oronakeys.Server.model.Categoria
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface CategoriaRepository : JpaRepository<Categoria, Int> {
    @Query("SELECT c.nombreCategoria FROM Categoria c JOIN c.videojuegos v WHERE v.idVideojuego = :id")
    fun findNombresPorIdVideojuego(@Param("id") id: Int): List<String>
}