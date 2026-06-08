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
        
        // Creamos un mapa "limpio" con puros textos y números
        val respuestaPlana = mapOf(
            "idVideojuego" to juego.idVideojuego,
            "titulo" to juego.titulo,
            "descripcion" to juego.descripcion,
            "precio" to juego.precio,
            "imagenUrl" to juego.imagenUrl,
            "activo" to juego.activo,
            // Nos aseguramos de sacar el String y que no viaje el objeto entidad
            "plataforma" to (juego.plataforma?.nombre ?: "N/A"),
            "desarrollador" to (juego.desarrollador?.nombreDesarrollador ?: "N/A")
            // Omitimos categorías aquí, ¡tu CategoriasController ya se encarga de eso!
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
}

