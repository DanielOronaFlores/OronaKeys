package com.oronakeys.Server.controller



import com.oronakeys.Server.repository.VideojuegoRepository

import com.oronakeys.Server.repository.ClaveDigitalRepository

import com.oronakeys.Server.model.Videojuego

import com.oronakeys.Server.model.EstadoClave





import org.springframework.web.bind.annotation.*

import org.springframework.http.ResponseEntity

import org.springframework.beans.factory.annotation.Autowired



@RestController

@CrossOrigin(origins = ["http://localhost:5173"])

@RequestMapping("/api")

class JuegoController(
    private val videojuegoRepository: VideojuegoRepository,

    @Autowired
    var claveDigitalRepository: ClaveDigitalRepository
    ){

    @GetMapping("/juego/{id}")
    fun obtenerJuegoPorId(@PathVariable id: Int): ResponseEntity<Any> { // Cambiamos a <Any> para enviar un mapa
        val juegoOptional = videojuegoRepository.findById(id)
        
        if (juegoOptional.isEmpty) {
            return ResponseEntity.notFound().build()
        }
        
        val juego = juegoOptional.get()
        
        val respuestaPlana = mapOf(
            "idVideojuego" to juego.idVideojuego,
            "titulo" to juego.titulo,
            "descripcion" to juego.descripcion,
            "precio" to juego.precio,
            "imagenUrl" to juego.imagenUrl,
            "activo" to juego.activo,
            "plataforma" to (juego.plataforma?.nombre ?: "N/A"),
            "desarrollador" to (juego.desarrollador?.nombreDesarrollador ?: "N/A")
        )
        
        return ResponseEntity.ok(respuestaPlana)
    }

    @GetMapping("/juego/{id}/stock")
    fun verificarStock(@PathVariable id: Int): ResponseEntity<Map<String, Any>> {
        val llavesDisponibles = claveDigitalRepository.countByVideojuegoIdVideojuegoAndEstado(id, EstadoClave.disponible)
        val hayStock = llavesDisponibles > 0
    
        return ResponseEntity.ok(mapOf(
            "hayStock" to hayStock,
            "cantidadRestante" to llavesDisponibles
        ))
    }


    // 1. OBTENER TODOS (Para la tabla del admin)
    @GetMapping("/juegos")
    fun obtenerTodosLosJuegos(): ResponseEntity<List<Map<String, Any?>>> {
        val juegos = videojuegoRepository.findAll()
        
        // Lo mapeamos igual que antes para evitar problemas con Hibernate
        val respuesta = juegos.map { juego ->
            mapOf(
                "idVideojuego" to juego.idVideojuego,
                "titulo" to juego.titulo,
                "precio" to juego.precio,
                "activo" to juego.activo,
                "plataforma" to (juego.plataforma?.nombre ?: "N/A"),
                "idPlataforma" to juego.plataforma?.idPlataforma, // Lo mandamos para que el form sepa cuál pre-seleccionar
                "desarrollador" to (juego.desarrollador?.nombreDesarrollador ?: "N/A"),
                "idDesarrollador" to juego.desarrollador?.idDesarrollador // Lo mismo aquí
            )
        }
        return ResponseEntity.ok(respuesta)
    }

    // 2. CREAR JUEGO (POST)
    @PostMapping("/juego")
    fun crearJuego(@RequestBody nuevoJuego: Videojuego): ResponseEntity<Videojuego> {
        val juegoGuardado = videojuegoRepository.save(nuevoJuego)
        return ResponseEntity.ok(juegoGuardado)
    }

    // 3. ACTUALIZAR JUEGO (PUT) - VERSIÓN SEGURA
    @PutMapping("/juego/{id}")
    fun actualizarJuego(@PathVariable id: Int, @RequestBody juegoActualizado: Videojuego): ResponseEntity<Any> {
        val juegoExistenteOptional = videojuegoRepository.findById(id)
        
        if (juegoExistenteOptional.isEmpty) {
            return ResponseEntity.notFound().build()
        }
        
        val juegoOriginal = juegoExistenteOptional.get()
        
        val juegoParaGuardar = juegoOriginal.copy(
            titulo = juegoActualizado.titulo,
            descripcion = juegoActualizado.descripcion,
            precio = juegoActualizado.precio,
            imagenUrl = juegoActualizado.imagenUrl,
            activo = juegoActualizado.activo,
            plataforma = juegoActualizado.plataforma,
            desarrollador = juegoActualizado.desarrollador
        )
        
        val juegoGuardado = videojuegoRepository.save(juegoParaGuardar)
        
        return ResponseEntity.ok(juegoGuardado)
    }

    // 4. ELIMINAR JUEGO (DELETE)
    @DeleteMapping("/juego/{id}")
    fun eliminarJuego(@PathVariable id: Int): ResponseEntity<Void> {
        if (!videojuegoRepository.existsById(id)) {
            return ResponseEntity.notFound().build()
        }
        videojuegoRepository.deleteById(id)
        return ResponseEntity.noContent().build()
    }
}

