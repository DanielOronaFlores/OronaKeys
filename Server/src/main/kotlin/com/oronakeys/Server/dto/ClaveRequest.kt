package com.oronakeys.Server.dto

data class ClaveRequest(
    val codigo_clave: String,
    val videojuego: Map<String, Int>,
    val estado: String
)