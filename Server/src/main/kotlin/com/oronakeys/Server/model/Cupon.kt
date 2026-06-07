package com.oronakeys.Server.model

import jakarta.persistence.*
import java.time.LocalDate
import java.math.BigDecimal

@Entity
@Table(name = "cupones")
data class Cupon(
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cupon")
    val idCupon: Int = 0,

    @Column(name = "codigo_cupon", length = 20, nullable = false,  unique = true)
    val codigoCupon: String,

    @Column(name = "porcentaje_descuento", precision = 5, scale = 2, nullable = false)
    val porcentajeDescuento: BigDecimal = BigDecimal.ZERO,

    
    @Column(name = "fecha_expiracion", updatable = false)
    val fechaIngreso: LocalDate,

    @Column(name = "activo", nullable = false,)
    val activo: Boolean = true
)