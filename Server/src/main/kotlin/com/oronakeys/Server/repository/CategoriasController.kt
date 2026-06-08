package com.oronakeys.Server.controller

import com.oronakeys.Server.repository.CategoriaRepository
import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = ["http://localhost:5173"])
class CategoriasController(private val categoriaRepository: CategoriaRepository) {

    @GetMapping("/por-juego/{id}")
    fun obtenerCategoriasDeJuego(@PathVariable id: Int): ResponseEntity<List<String>> {
        val nombres = categoriaRepository.findNombresPorIdVideojuego(id)
        return ResponseEntity.ok(nombres)
    }
}