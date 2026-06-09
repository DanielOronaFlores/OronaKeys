package com.oronakeys.Server.repository

import com.oronakeys.Server.model.ClaveDigital

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.data.jpa.repository.Modifying
import org.springframework.transaction.annotation.Transactional

import com.oronakeys.Server.model.EstadoClave

interface ClaveDigitalRepository : JpaRepository<ClaveDigital, Int> {
    fun findFirstByVideojuegoIdVideojuegoAndEstado(idVideojuego: Int, estado: EstadoClave): ClaveDigital?
    fun countByVideojuegoIdVideojuegoAndEstado(idVideojuego: Int, estado: EstadoClave): Long
    
    @Query(value = "SELECT c.* FROM claves_digitales c INNER JOIN vendedor_claves vc ON c.id_clave = vc.id_clave WHERE vc.id_vendedor = :vendedorId", nativeQuery = true)
    fun findClavesByVendedorId(@Param("vendedorId") vendedorId: Int): List<ClaveDigital> 

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM vendedor_claves WHERE id_clave = :id", nativeQuery = true)
    fun deleteVendedorClaveRelationship(@Param("id") id: Int)
}