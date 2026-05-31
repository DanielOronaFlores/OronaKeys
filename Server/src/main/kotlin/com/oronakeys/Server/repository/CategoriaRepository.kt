package com.oronakeys.Server.model

import com.oronakeys.Server.model.Desarrollador
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CategoriaRepository : JpaRepository<Categoria, Int>