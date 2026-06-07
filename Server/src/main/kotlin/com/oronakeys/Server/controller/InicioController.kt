package com.oronakeys.Server.controller

import com.oronakeys.Server.repository.VideojuegoRepository
import com.oronakeys.Server.model.Videojuego
import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity

@RestController
@CrossOrigin(origins = ["http://localhost:5173"])
@RequestMapping("/api")
class InicioController(private val videojuegoRepository: VideojuegoRepository) {

    @GetMapping("/inicio")
    fun obtenerCatalogo(): ResponseEntity<List<Videojuego>> {
        // Ejecuta un "SELECT * FROM videojuegos" automático
        val juegos = videojuegoRepository.findAll()
        return ResponseEntity.ok(juegos)
    }
}