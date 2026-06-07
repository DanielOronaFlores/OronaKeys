package com.oronakeys.Server.controller

import com.oronakeys.Server.model.ListaDeseos
import com.oronakeys.Server.repository.ListaDeseosRepository
import com.oronakeys.Server.repository.UsuarioRepository
import com.oronakeys.Server.repository.VideojuegoRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

// DTO rápido para recibir los datos de React
data class DeseoRequest(val idUsuario: Int, val idVideojuego: Int)

@RestController
@CrossOrigin(origins = ["http://localhost:5173"])
@RequestMapping("/api/deseos")
class ListaDeseosController(
    private val listaDeseosRepository: ListaDeseosRepository,
    private val usuarioRepository: UsuarioRepository,
    private val videojuegoRepository: VideojuegoRepository
) {

    @GetMapping("/verificar")
    fun verificarDeseo(
        @RequestParam idUsuario: Int, 
        @RequestParam idVideojuego: Int
    ): ResponseEntity<Map<String, Boolean>> {
        
        // Asumiendo que nombraste tus variables usuario y videojuego en tu modelo
        val existe = listaDeseosRepository.existsByUsuarioIdUsuarioAndVideojuegoIdVideojuego(idUsuario, idVideojuego)
        return ResponseEntity.ok(mapOf("enLista" to existe))
    }

    @PostMapping("/toggle")
    fun alternarDeseo(@RequestBody request: DeseoRequest): ResponseEntity<Any> {
        val idUsuario = request.idUsuario
        val idVideojuego = request.idVideojuego

        return try {
            val existe = listaDeseosRepository.existsByUsuarioIdUsuarioAndVideojuegoIdVideojuego(idUsuario, idVideojuego)

            if (existe) {
                listaDeseosRepository.deleteByUsuarioIdUsuarioAndVideojuegoIdVideojuego(idUsuario, idVideojuego)
                println("[Wishlist] Juego $idVideojuego eliminado de la lista del usuario $idUsuario")
                ResponseEntity.ok(mapOf("enLista" to false, "mensaje" to "Eliminado de la lista de deseos"))
            } else {
                // Si no existe, buscamos las entidades y lo guardamos
                val usuarioEntity = usuarioRepository.findById(idUsuario).orElseThrow { Exception("Usuario no encontrado") }
                val juegoEntity = videojuegoRepository.findById(idVideojuego).orElseThrow { Exception("Juego no encontrado") }

                val nuevoDeseo = ListaDeseos(
                    usuario = usuarioEntity,
                    videojuego = juegoEntity,
                    fechaAgregado = java.time.LocalDateTime.now()
                )
                
                listaDeseosRepository.save(nuevoDeseo)
                println("[Wishlist] Juego $idVideojuego agregado a la lista del usuario $idUsuario")
                ResponseEntity.ok(mapOf("enLista" to true, "mensaje" to "Agregado a la lista de deseos"))
            }
        } catch (e: Exception) {
            println("[Wishlist] Error: ${e.message}")
            ResponseEntity.badRequest().body(mapOf("error" to "Error al modificar la lista de deseos"))
        }
    }
}