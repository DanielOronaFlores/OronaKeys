package com.oronakeys.Server.model

import com.oronakeys.Server.model.Pedido
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

interface PedidoRepository : JpaRepository<Repository, Int>