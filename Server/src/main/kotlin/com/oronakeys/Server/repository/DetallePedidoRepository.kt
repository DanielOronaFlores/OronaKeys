package com.oronakeys.Server.model

import com.oronakeys.Server.model.DetallePedido
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

interface DetallePedidoRepository : JpaRepository<DetallePedido, Int>