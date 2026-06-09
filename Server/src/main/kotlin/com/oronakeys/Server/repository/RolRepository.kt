package com.oronakeys.Server.repository

import com.oronakeys.Server.model.Rol
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

interface RolRepository : JpaRepository<Rol, Int>