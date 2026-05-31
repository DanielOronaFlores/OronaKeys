package com.oronakeys.Server.model

import jakarta.persistence.*
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "historial_precios")
data class HistorialPrecio(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial")
    val idHistorial: Int = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_videojuego", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE) 
    val videojuego: Videojuego,

    @Column(name = "precio_anterior", nullable = false, precision = 10, scale = 2)
    val precioAnterior: BigDecimal = BigDecimal.ZERO,

    @Column(name = "precio_nuevo", nullable = false, precision = 10, scale = 2)
    val precioNuevo: BigDecimal = BigDecimal.ZERO,

    @Column(name = "fecha_cambio", nullable = true)
    val fechaCambio: LocalDateTime    
)