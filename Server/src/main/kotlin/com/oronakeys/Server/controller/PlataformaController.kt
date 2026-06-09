package com.oronakeys.Server.controller

import com.oronakeys.Server.model.Plataforma
import com.oronakeys.Server.repository.PlataformaRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["http://localhost:5173"])
@RequestMapping("/api/plataformas")
class PlataformaController(private val repository: PlataformaRepository) {

    // 1. LEER TODAS
    @GetMapping
    fun obtenerTodas(): List<Plataforma> {
        return repository.findAll()
    }

    // 2. CREAR
    @PostMapping
    fun crearPlataforma(@RequestBody nuevaPlataforma: Plataforma): Plataforma {
        return repository.save(nuevaPlataforma)
    }

    // 3. ACTUALIZAR (PUT SEGURO)
    @PutMapping("/{id}")
    fun actualizarPlataforma(
        @PathVariable id: Int,
        @RequestBody plataformaActualizada: Plataforma
    ): ResponseEntity<Plataforma> {
        val existenteOptional = repository.findById(id)
        
        if (existenteOptional.isEmpty) {
            return ResponseEntity.notFound().build()
        }
        
        val plataformaOriginal = existenteOptional.get()
        
        // Copiamos solo el nombre para no romper la base de datos
        val plataformaParaGuardar = plataformaOriginal.copy(
            nombre = plataformaActualizada.nombre
        )
        
        val guardado = repository.save(plataformaParaGuardar)
        return ResponseEntity.ok(guardado)
    }

    // 4. ELIMINAR
    @DeleteMapping("/{id}")
    fun eliminarPlataforma(@PathVariable id: Int): ResponseEntity<Void> {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build()
        }
        repository.deleteById(id)
        return ResponseEntity.noContent().build()
    }
}