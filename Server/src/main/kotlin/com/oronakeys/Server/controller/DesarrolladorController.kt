package com.oronakeys.Server.controller

import com.oronakeys.Server.model.Desarrollador
import com.oronakeys.Server.repository.DesarrolladorRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["http://localhost:5173"])
@RequestMapping("/api/desarrolladores")
class DesarrolladorController(private val repository: DesarrolladorRepository) {

    // 1. LEER TODOS
    @GetMapping
    fun obtenerTodos(): List<Desarrollador> {
        return repository.findAll()
    }

    // 2. CREAR
    @PostMapping
    fun crearDesarrollador(@RequestBody nuevoDesarrollador: Desarrollador): Desarrollador {
        return repository.save(nuevoDesarrollador)
    }

    // 3. ACTUALIZAR (PUT SEGURO)
    @PutMapping("/{id}")
    fun actualizarDesarrollador(
        @PathVariable id: Int, 
        @RequestBody desarrolladorActualizado: Desarrollador
    ): ResponseEntity<Desarrollador> {
        val existenteOptional = repository.findById(id)
        
        if (existenteOptional.isEmpty) {
            return ResponseEntity.notFound().build()
        }
        
        val desarrolladorOriginal = existenteOptional.get()
        
        // Copiamos solo los campos permitidos
        val desarrolladorParaGuardar = desarrolladorOriginal.copy(
            nombreDesarrollador = desarrolladorActualizado.nombreDesarrollador,
            sitioWeb = desarrolladorActualizado.sitioWeb
        )
        
        val guardado = repository.save(desarrolladorParaGuardar)
        return ResponseEntity.ok(guardado)
    }

    // 4. ELIMINAR
    @DeleteMapping("/{id}")
    fun eliminarDesarrollador(@PathVariable id: Int): ResponseEntity<Void> {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build()
        }
        repository.deleteById(id)
        return ResponseEntity.noContent().build()
    }
}