package com.oronakeys.Server.repository

import com.oronakeys.Server.model.Plataforma
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

interface PlataformaRepository : JpaRepository<Plataforma, Int>