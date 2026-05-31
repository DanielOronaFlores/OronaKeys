package com.oronakeys.Server.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "usuarios")
data class Usuario(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    val idUsuario: Int = 0,

    @Column(name = "nombre", length = 100, nullable = false)
    val nombre: String,

    @Column(name = "correo", length = 150, nullable = false, unique = true)
    val email: String,

    @Column(name = "contrasenia_hash", length = 255, nullable = false)
    val contrasena: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol", nullable = false)
    val rol: Rol,

    @Column(name = "fecha_registro", nullable = true)
    val fechaRegistro: LocalDateTime
)