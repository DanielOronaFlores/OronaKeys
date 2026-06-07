package com.oronakeys.Server.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

import com.oronakeys.Server.model.ListaDeseos

interface ListaDeseosRepository : JpaRepository<ListaDeseos, Int>{
    fun existsByUsuarioIdUsuarioAndVideojuegoIdVideojuego(idUsuario: Int, idVideojuego: Int): Boolean
    
    fun findByUsuarioIdUsuario(idUsuario: Int): List<ListaDeseos>

    @Transactional
    fun deleteByUsuarioIdUsuarioAndVideojuegoIdVideojuego(idUsuario: Int, idVideojuego: Int)
}