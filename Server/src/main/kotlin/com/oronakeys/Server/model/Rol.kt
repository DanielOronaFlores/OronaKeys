package com.oronakeys.Server.model

import jakarta.persistence.*

@Entity
@Table(name = "roles")
data class Rol(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    val idRol: Int = 0,

    @Column(name = "nombre", length = 50, nullable = false, unique = true)
    val nombre: String
)