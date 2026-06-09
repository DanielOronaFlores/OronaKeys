package com.oronakeys.Server.controller

import com.oronakeys.Server.repository.PedidoRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.format.DateTimeFormatter

@RestController
@CrossOrigin(origins = ["http://localhost:5173"]) // Solo GET, no necesitamos PUT ni DELETE aquí
@RequestMapping("/api/pedidos")
class PedidoController(private val pedidoRepository: PedidoRepository) {

    @GetMapping
    fun obtenerTodos(): ResponseEntity<List<Map<String, Any?>>> {
        val pedidos = pedidoRepository.findAll()
        
        // Mapeamos a una respuesta plana para evitar problemas de Lazy Loading con Usuario y Cupon
        val respuesta = pedidos.map { p ->
            mapOf(
                "idPedido" to p.idPedido,
                "cliente" to (p.usuario.nombre), // Extraemos el nombre del cliente
                "correo" to (p.usuario.email), 
                "total" to p.total,
                "fechaPedido" to p.fechaPedido.toString(),
                "cupon" to (p.cupon?.codigoCupon ?: "N/A") // Si no hay cupón, mandamos N/A
            )
        }
        
        // Ordenamos para que los pedidos más recientes salgan primero
        return ResponseEntity.ok(respuesta.sortedByDescending { it["idPedido"] as Int })
    }
}