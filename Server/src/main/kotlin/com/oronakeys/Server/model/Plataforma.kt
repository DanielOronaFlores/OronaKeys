package com.oronakeys.Server.model

import jakarta.persistence.*

@Entity
@Table(name = "plataformas")
data class Plataforma(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plataforma")
    val idPlataforma: Int = 0,

    @Column(name = "nombre_plataforma", length = 50, nullable = false, unique = true)
    val nombre: String
)