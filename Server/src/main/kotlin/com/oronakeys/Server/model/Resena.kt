package com.oronakeys.Server.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "resenas")
data class Resena(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resena")
    val idResena: Int = 0,

    @Column(name = "id_videojuego", nullable = false)
    val idVideojuego: Int,

    @Column(name = "id_usuario", nullable = false)
    val idUsuario: Int,

    @Column(name = "calificacion")
    val calificacion: Int? = null,

    @Column(name = "comentario", columnDefinition = "TEXT")
    val comentario: String? = null,

    // insertable y updatable en false para que MySQL maneje el CURRENT_TIMESTAMP
    @Column(name = "fecha_resena", insertable = false, updatable = false)
    val fechaResena: LocalDateTime? = null
)