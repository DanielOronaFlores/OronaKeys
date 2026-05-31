package com.oronakeys.Server.model

import jakarta.persistence.*

@Entity
@Table(name = "desarrolladores")
data class Desarrollador(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_desarrollador")
    val idDesarrollador: Int = 0,

    @Column(name = "nombre_desarrollador", length = 100, nullable = false, unique = true)
    val nombreDesarrollador: String,

    @Column(name = "sitio_web", length = 255, nullable = true)
    val sitioWeb: String? = null
)