package com.oronakeys.Server.model

import jakarta.persistence.*
import java.time.LocalDateTime
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min

@Entity
@Table(name = "resenas")
data class Resena(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resena")
    val idResena: Int = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_videojuego", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    val videojuego: Videojuego,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    val usuario: Usuario,

    @Column(name = "calificacion", nullable = false)
    @Min(value = 1, message = "La calificación mínima es 1") // <-- Validación
    @Max(value = 5, message = "La calificación máxima es 5")
    val calificacion: Int = 0,

    @Column(name = "comentario", length = 1000, nullable = true)
    val comentario: String? = null,

    @Column(name = "fecha_resena", nullable = true)
    val fechaResena: LocalDateTime
)