package com.oronakeys.Server.model

import com.oronakeys.Server.model.EstadoClave
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

interface EstadoClaveRepository : JpaRepository<EstadoClave, Int>