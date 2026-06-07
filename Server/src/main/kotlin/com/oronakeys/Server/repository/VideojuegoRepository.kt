package com.oronakeys.Server.repository

import com.oronakeys.Server.model.Videojuego

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.data.jpa.repository.Query

@Repository
interface VideojuegoRepository : JpaRepository<Videojuego, Int> {
    @Query("SELECT v FROM Videojuego v LEFT JOIN FETCH v.categorias LEFT JOIN FETCH v.plataforma LEFT JOIN FETCH v.desarrollador WHERE v.idVideojuego = :id")
    fun findByIdWithDetails(id: Int): Videojuego?
}