package com.oronakeys.Server.model

import com.oronakeys.Server.model.ListaDeseos
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

interface ListaDeseosRepository : JpaRepository<ListaDeseos, Int>