package com.oronakeys.Server.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDate
import com.fasterxml.jackson.annotation.JsonIgnore

@Entity
@Table(name = "videojuegos")
data class Videojuego(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_videojuego")
    val idVideojuego: Int = 0,

    @Column(name = "titulo", length = 150, nullable = false)
    val titulo: String,

    @Column(name = "descripcion", length = 2000, nullable = true)
    val descripcion: String? = null,

    @Column(name = "precio_actual", nullable = false, precision = 10, scale = 2)
    val precio: BigDecimal = BigDecimal.ZERO,

    @Column(name = "imagen_url", length = 255, nullable = true)
    val imagenUrl: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_desarrollador", nullable = true)
    val desarrollador: Desarrollador? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_plataforma", nullable = true)
    val plataforma: Plataforma? = null,

    @Column(name = "fecha_lanzamiento", nullable = true)
    val fechaLanzamiento: LocalDate? = null,

    @Column(name = "activo", nullable = false)
    val activo: Boolean = true,

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "videojuegos_categorias",
        joinColumns = [JoinColumn(name = "id_videojuego")],
        inverseJoinColumns = [JoinColumn(name = "id_categoria")]
    )
    val categorias: Set<Categoria> = emptySet()
)