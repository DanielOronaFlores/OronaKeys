package com.oronakeys.Server.model

import com.oronakeys.Server.model.Cupon
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

interface CuponRepository : JpaRepository<Cupon, Int> 