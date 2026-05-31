package com.oronakeys.Server.model

import jakarta.persistence.*

@Entity
@Table(name = "metodos_pago")
data class MetodoPago(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_metodo")
    val idMetodoPago: Int = 0,

    @Column(name = "nombre_metodo", length = 50, nullable = false, unique = true)
    val nombreMetodo: String,
)