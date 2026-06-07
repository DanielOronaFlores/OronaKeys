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
    fun obtenerJuegoPorId(@PathVariable id: Int): ResponseEntity<Videojuego> {
        val juego = videojuegoRepository.findById(id)
        return if (juego.isPresent) {
            ResponseEntity.ok(juego.get())
        } else {
            ResponseEntity.notFound().build()
        }
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

