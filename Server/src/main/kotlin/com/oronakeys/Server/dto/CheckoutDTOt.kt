package com.oronakeys.Server.dto

import java.math.BigDecimal

data class CheckoutRequest(
    val idUsuario: Int, // Quién compra
    val totalPagado: BigDecimal, // Cuánto pagó
    val idsVideojuegos: List<Int>, // Qué juegos se lleva

    val idMetodoPago: Int, // Ej: 1 para Tarjeta, 2 para PayPal
    val codigoCupon: String?
)