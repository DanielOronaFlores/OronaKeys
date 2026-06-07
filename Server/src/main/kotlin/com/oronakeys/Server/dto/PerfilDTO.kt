package com.oronakeys.Server.dto

import java.math.BigDecimal

// El sobre principal que viaja a React
data class PerfilResponseDTO(
    val historialCompras: List<PedidoHistorialDTO>,
    val listaDeseos: List<JuegoDeseadoDTO> // <--- ¡Aquí está el espacio preparado!
)

// Lo que contiene cada tarjeta de pedido
data class PedidoHistorialDTO(
    val idPedido: Int,
    val total: Double,
    val llaves: List<LlaveAdquiridaDTO>
)

// El premio final (La key y de qué juego es)
data class LlaveAdquiridaDTO(
    val idVideojuego: Int,
    val tituloJuego: String,
    val codigoClave: String
)

// Para cuando hagamos la Wishlist
data class JuegoDeseadoDTO(
    val idVideojuego: Int,
    val titulo: String,
    val precio: Double,
    val imagenUrl: String?
)