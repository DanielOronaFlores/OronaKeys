package com.oronakeys.Server.controller

import com.oronakeys.Server.model.ClaveDigital
import com.oronakeys.Server.model.EstadoClave
import com.oronakeys.Server.dto.ClaveRequest
import com.oronakeys.Server.repository.ClaveDigitalRepository
import com.oronakeys.Server.repository.VideojuegoRepository

import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity
import java.time.LocalDateTime

@RestController
@CrossOrigin(origins = ["http://localhost:5173"])
@RequestMapping("/api/inventario")
class InventarioController(
    private val claveRepository: ClaveDigitalRepository,
    private val videojuegoRepository: VideojuegoRepository
    ) {

    @GetMapping
    fun obtenerInventario(@RequestParam("vendedorId") vendedorId: Int): List<ClaveDigital> {
        println("DEBUG: Solicitud de inventario recibida para el vendedor ID: $vendedorId")
        
        val lista = claveRepository.findClavesByVendedorId(vendedorId)
        
        println("DEBUG: Se encontraron ${lista.size} claves en la base de datos.")
        
        return lista
    }

    @PostMapping
    fun agregarKey(@RequestBody request: ClaveRequest): ResponseEntity<Any> {
        val idJuego = request.videojuego["idVideojuego"] 
        ?: return ResponseEntity.badRequest().body("Falta el idVideojuego")

        val juego = videojuegoRepository.findById(idJuego).orElse(null)
        ?: return ResponseEntity.badRequest().body("Juego no encontrado")
        
        val clave = ClaveDigital(
            videojuego = juego,
            codigo_clave = request.codigo_clave,
            estado = EstadoClave.disponible,
            fechaIngreso = java.time.LocalDateTime.now()
        )
        claveRepository.save(clave)
        return ResponseEntity.ok("Key guardada correctamente")
    }

    @DeleteMapping("/{id}")
fun borrarKey(@PathVariable id: Int): ResponseEntity<Void> {
    // 1. Buscamos la llave
    val key = claveRepository.findById(id).orElse(null)
    
    // 2. Verificamos que exista y esté disponible
    if (key != null && key.estado.toString().uppercase() == "DISPONIBLE") {
        
        // --- AQUÍ ESTÁ EL AJUSTE PARA EL "DESVERGUE" ---
        // Borramos primero la referencia en la tabla puente
        // Si no tienes un repositorio para vendedor_claves, usamos un query nativo:
        claveRepository.deleteVendedorClaveRelationship(id)
        
        // 3. Ahora sí, borramos la llave
        claveRepository.deleteById(id)
        
        return ResponseEntity.noContent().build()
    }
    return ResponseEntity.badRequest().build()
    
}
}