package com.oronakeys.Server.model

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "claves_digitales")
data class ClaveDigital(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_clave")
    val id_clave: Int = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_videojuego", nullable = false)
    val videojuego: Videojuego,

    @Column(name = "codigo_clave", length = 100, nullable = false, unique = true)
    val codigo_clave: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    val estado: EstadoClave = EstadoClave.disponible,

    @CreationTimestamp
    @Column(name = "fecha_ingreso", updatable = false)
    val fechaIngreso: LocalDateTime? = null
    )