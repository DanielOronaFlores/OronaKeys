package com.oronakeys.Server.repository

import com.oronakeys.Server.model.Cupon
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

interface CuponRepository : JpaRepository<Cupon, Int> {
    fun findByCodigoCupon(codigoCupon : String?): Cupon?
}