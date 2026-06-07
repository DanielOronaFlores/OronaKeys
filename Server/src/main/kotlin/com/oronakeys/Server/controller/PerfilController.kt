package com.oronakeys.Server.controller

import com.oronakeys.Server.dto.*
import com.oronakeys.Server.repository.DetallePedidoRepository
import com.oronakeys.Server.repository.ListaDeseosRepository

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["http://localhost:5173"])
@RequestMapping("/api/perfil")
class PerfilController(
    private val detallePedidoRepository : DetallePedidoRepository,
    private val listaDeseosRepository : ListaDeseosRepository
) {

    @GetMapping("/{idUsuario}")
    fun obtenerDatosPerfil(@PathVariable idUsuario: Int): ResponseEntity<Any> {
        
        try {
            val todosLosDetalles = detallePedidoRepository.findByPedidoUsuarioIdUsuario(idUsuario)
            
            val pedidosAgrupados = todosLosDetalles.groupBy { it.pedido }
            
            val historialMapeado = pedidosAgrupados.map { (pedido, detalles) ->
                PedidoHistorialDTO(
                    idPedido = pedido.idPedido,
                    total = pedido.total.toDouble(),
                    llaves = detalles.map { detalle -> 
                        LlaveAdquiridaDTO(
                            idVideojuego = detalle.videojuego.idVideojuego,
                            tituloJuego = detalle.videojuego.titulo,
                            codigoClave = detalle.claveDigital.codigo_clave
                        )
                    }
                )
            }

            val deseosEntity = listaDeseosRepository.findByUsuarioIdUsuario(idUsuario)
                
            val listaDeseosMapeada = deseosEntity.map { deseo ->
                JuegoDeseadoDTO(
                    idVideojuego = deseo.videojuego.idVideojuego,
                    titulo = deseo.videojuego.titulo,
                    precio = deseo.videojuego.precio.toDouble(),
                    imagenUrl = deseo.videojuego.imagenUrl
                )
            }

            val respuesta = PerfilResponseDTO(
                historialCompras = historialMapeado.sortedByDescending { it.idPedido },
                listaDeseos = listaDeseosMapeada
            )

            println("[Perfil]Historial cargado: ${historialMapeado.size} pedidos encontrados para el usuario $idUsuario")
            return ResponseEntity.ok(respuesta)
            
        } catch (e: Exception) {
            println("[Perfil] Error al cargar perfil: ${e.message}")
            return ResponseEntity.badRequest().body(mapOf("error" to "No se pudo cargar el perfil del usuario."))
        }
    }
}