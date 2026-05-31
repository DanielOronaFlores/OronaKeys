package com.oronakeys.Server.model

import jakarta.persistence.*

@Entity
@Table(name = "categorias")
data class Categoria(
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    val idCategoria: Int = 0,

    @Column(name = "nombre_categoria", length = 50, nullable = false)
    val nombreCategoria: String,


    @ManyToMany(mappedBy = "categorias", fetch = FetchType.LAZY)
    val videojuegos: Set<Videojuego> = emptySet()
)