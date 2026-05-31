package com.oronakeys.Server.model

import com.oronakeys.Server.model.Resena
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

interface ResenaRepository : JpaRepository<Resena, Int>