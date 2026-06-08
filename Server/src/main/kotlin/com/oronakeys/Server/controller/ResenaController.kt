package com.oronakeys.Server.controller

import com.oronakeys.Server.model.Resena
import com.oronakeys.Server.repository.ResenaRepository
import com.oronakeys.Server.repository.VideojuegoRepository
import com.oronakeys.Server.repository.UsuarioRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/resenas")
@CrossOrigin(origins = ["http://localhost:5173"])
class ResenaController(
    private val resenaRepository: ResenaRepository,
    private val videojuegoRepository: VideojuegoRepository,
    private val usuarioRepository: UsuarioRepository,
    ) {

    // 1. Obtener reseñas para la página del juego
    @GetMapping("/juego/{idVideojuego}")
    fun obtenerResenasPorJuego(@PathVariable idVideojuego: Int): ResponseEntity<List<Map<String, Any?>>> {
        val resenas = resenaRepository.findByIdVideojuego(idVideojuego)
        
        val resenasConUsuario = resenas.map { resena ->
            val usuario = usuarioRepository.findById(resena.idUsuario).orElse(null)
            
            mapOf(
                "idResena" to resena.idResena,
                "idVideojuego" to resena.idVideojuego,
                "idUsuario" to resena.idUsuario,
                // Si tu campo en el modelo Usuario se llama diferente, cámbialo aquí (ej: usuario?.username)
                "nombreUsuario" to (usuario?.nombre ?: "Usuario Anónimo"), 
                "calificacion" to resena.calificacion,
                "comentario" to resena.comentario
            )
        }
        
        return ResponseEntity.ok(resenasConUsuario)
    }

    // 2. Obtener reseñas para el perfil del usuario
    @GetMapping("/usuario/{idUsuario}")
    fun obtenerResenasPorUsuario(@PathVariable idUsuario: Int): ResponseEntity<List<Map<String, Any?>>> {
        val resenas = resenaRepository.findByIdUsuario(idUsuario)
        
        // Transformamos cada reseña para agregarle el título del juego
        val resenasConTitulo = resenas.map { resena ->
            val juego = videojuegoRepository.findById(resena.idVideojuego).orElse(null)
            
            mapOf(
                "idResena" to resena.idResena,
                "idVideojuego" to resena.idVideojuego,
                "tituloJuego" to (juego?.titulo ?: "Juego Eliminado"), // <- ¡Aquí agregamos el nombre!
                "idUsuario" to resena.idUsuario,
                "calificacion" to resena.calificacion,
                "comentario" to resena.comentario
            )
        }
        
        return ResponseEntity.ok(resenasConTitulo)
    }

    // 3. Crear una nueva reseña
    @PostMapping
    fun crearResena(@RequestBody nuevaResena: Resena): ResponseEntity<Resena> {
        val resenaGuardada = resenaRepository.save(nuevaResena)
        return ResponseEntity.ok(resenaGuardada)
    }

    // 4. Modificar una reseña existente
    @PutMapping("/{idResena}")
    fun actualizarResena(
        @PathVariable idResena: Int, 
        @RequestBody resenaActualizada: Resena
    ): ResponseEntity<Resena> {
        val resenaExistente = resenaRepository.findById(idResena)
        
        if (resenaExistente.isEmpty) {
            return ResponseEntity.notFound().build()
        }

        val resenaListaParaGuardar = resenaExistente.get().copy(
            calificacion = resenaActualizada.calificacion,
            comentario = resenaActualizada.comentario
            // Mantenemos los mismos IDs y la fecha original
        )

        return ResponseEntity.ok(resenaRepository.save(resenaListaParaGuardar))
    }

    // 5. Eliminar una reseña
    @DeleteMapping("/{idResena}")
    fun eliminarResena(@PathVariable idResena: Int): ResponseEntity<Void> {
        if (!resenaRepository.existsById(idResena)) {
            return ResponseEntity.notFound().build()
        }
        resenaRepository.deleteById(idResena)
        return ResponseEntity.noContent().build()
    }
}