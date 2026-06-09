package com.oronakeys.Server.controller

import com.oronakeys.Server.model.Cupon
import com.oronakeys.Server.repository.CuponRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
// Agregamos los métodos para evitar el error de CORS al hacer PUT y DELETE
@CrossOrigin(origins = ["http://localhost:5173"], methods = [RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE])
@RequestMapping("/api/cupones")
class CuponController(private val cuponRepository: CuponRepository) {

    // --- MÉTODOS PARA EL CLIENTE ---
    @GetMapping("/validar/{codigo}")
    fun validarCupon(@PathVariable codigo: String): ResponseEntity<Any> {
        val cupon = cuponRepository.findByCodigoCupon(codigo)
        if (cupon == null) {
            return ResponseEntity.badRequest().body(mapOf("mensaje" to "El cupón no existe."))
        }
        if (!cupon.activo) {
            return ResponseEntity.badRequest().body(mapOf("mensaje" to "Este cupón ya no es válido o expiró."))
        }
        return ResponseEntity.ok(mapOf(
            "porcentajeDescuento" to cupon.porcentajeDescuento,
            "mensaje" to "¡Cupón aplicado con éxito!"
        ))
    }

    // --- MÉTODOS PARA EL ADMINISTRADOR ---

    // 1. LEER TODOS
    @GetMapping
    fun obtenerTodos(): List<Cupon> {
        return cuponRepository.findAll()
    }

    // 2. CREAR
    @PostMapping
    fun crearCupon(@RequestBody nuevoCupon: Cupon): ResponseEntity<Any> {
        // Validación extra: Que no se repita el código (para que no reviente el backend con un error 500)
        val existe = cuponRepository.findByCodigoCupon(nuevoCupon.codigoCupon)
        if (existe != null) {
            return ResponseEntity.badRequest().body("El código de cupón ya existe.")
        }
        val guardado = cuponRepository.save(nuevoCupon)
        return ResponseEntity.ok(guardado)
    }

    // 3. ACTUALIZAR (PUT SEGURO)
    @PutMapping("/{id}")
    fun actualizarCupon(
        @PathVariable id: Int,
        @RequestBody cuponActualizado: Cupon
    ): ResponseEntity<Any> {
        val existenteOptional = cuponRepository.findById(id)
        
        if (existenteOptional.isEmpty) {
            return ResponseEntity.notFound().build()
        }
        
        val cuponOriginal = existenteOptional.get()
        
        // Copiamos los campos editables
        val cuponParaGuardar = cuponOriginal.copy(
            codigoCupon = cuponActualizado.codigoCupon,
            porcentajeDescuento = cuponActualizado.porcentajeDescuento,
            fechaIngreso = cuponActualizado.fechaIngreso, // Ojo: Si dejaste "updatable = false", Hibernate ignorará este cambio
            activo = cuponActualizado.activo
        )
        
        val guardado = cuponRepository.save(cuponParaGuardar)
        return ResponseEntity.ok(guardado)
    }

    // 4. ELIMINAR
    @DeleteMapping("/{id}")
    fun eliminarCupon(@PathVariable id: Int): ResponseEntity<Void> {
        if (!cuponRepository.existsById(id)) {
            return ResponseEntity.notFound().build()
        }
        cuponRepository.deleteById(id)
        return ResponseEntity.noContent().build()
    }
}