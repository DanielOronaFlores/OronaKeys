package com.oronakeys.Server.controller

import com.oronakeys.Server.model.Desarrollador
import com.oronakeys.Server.repository.DesarrolladorRepository
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["http://localhost:5173"])
@RequestMapping("/api/desarrolladores")
class DesarrolladorController(private val repository: DesarrolladorRepository) {

    // 1. LEER: Cuando React pida la lista completa (GET)
    @GetMapping
    fun obtenerTodos(): List<Desarrollador> {
        return repository.findAll()
    }

    // 2. CREAR: Cuando React envíe un formulario lleno (POST)
    @PostMapping
    fun crearDesarrollador(@RequestBody nuevoDesarrollador: Desarrollador): Desarrollador {
        return repository.save(nuevoDesarrollador)
    }
}