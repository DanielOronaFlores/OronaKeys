package com.oronakeys.Server.model

import com.oronakeys.Server.model.MetodoPago
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

interface MetodoPagoRepository : JpaRepository<MetodoPago, Int>