package com.oronakeys.Server.repository

import com.oronakeys.Server.model.Desarrollador
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface DesarrolladorRepository : JpaRepository<Desarrollador, Int>