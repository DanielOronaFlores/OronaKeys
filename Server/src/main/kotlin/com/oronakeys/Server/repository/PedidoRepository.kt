package com.oronakeys.Server.repository

import com.oronakeys.Server.model.Pedido
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

interface PedidoRepository : JpaRepository<Pedido, Int>{
    fun findByUsuario(usuario: Int): List<Pedido>
}