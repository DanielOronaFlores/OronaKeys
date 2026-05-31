package com.oronakeys.Server.model

import com.oronakeys.Server.model.HistorialPrecio
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

interface HistorialPrecioRepository : JpaRepository<HistorialPrecio, Int>