package com.oronakeys.Server.dto

import java.math.BigDecimal

data class VideojuegoDTO(
    val idVideojuego: Int,
    val titulo: String,
    val descripcion: String?,
    val precio: BigDecimal,
    val imagenUrl: String?,
    val activo: Boolean,
    val plataforma: String?,
    val desarrollador: String?,
    val categorias: List<String>,
    val hayStock: Boolean
)