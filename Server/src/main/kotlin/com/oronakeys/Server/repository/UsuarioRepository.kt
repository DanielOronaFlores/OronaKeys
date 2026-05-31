package com.oronakeys.Server.model

import com.oronakeys.Server.model.Usuario
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

interface UsuarioRepository : JpaRepository<Usuario, Int>