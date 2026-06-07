package com.oronakeys.Server.repository

import com.oronakeys.Server.model.ClaveDigital
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

import com.oronakeys.Server.model.EstadoClave

interface ClaveDigitalRepository : JpaRepository<ClaveDigital, Int> {
    fun findFirstByVideojuegoIdVideojuegoAndEstado(idVideojuego: Int, estado: EstadoClave): ClaveDigital?
    fun countByVideojuegoIdVideojuegoAndEstado(idVideojuego: Int, estado: EstadoClave): Long
}