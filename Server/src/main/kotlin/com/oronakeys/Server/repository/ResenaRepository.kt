package com.oronakeys.Server.repository

import com.oronakeys.Server.model.Resena
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

interface ResenaRepository : JpaRepository<Resena, Int>{
    fun findByIdVideojuego(idVideojuego: Int): List<Resena>
    fun findByIdUsuario(idUsuario: Int): List<Resena>
}