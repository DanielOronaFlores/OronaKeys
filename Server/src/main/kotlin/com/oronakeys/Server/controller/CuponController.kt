package com.oronakeys.Server.controller

import com.oronakeys.Server.repository.CuponRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["http://localhost:5173"])
@RequestMapping("/api/cupones")
class CuponController(private val cuponRepository: CuponRepository) {

    @GetMapping("/validar/{codigo}")
    fun validarCupon(@PathVariable codigo: String): ResponseEntity<Any> {
        val cupon = cuponRepository.findByCodigoCupon(codigo)

        // 1. Si no lo encuentra en la base de datos
        if (cupon == null) {
            return ResponseEntity.badRequest().body(mapOf("mensaje" to "El cupón no existe."))
        }
        
        // 2. Si existe, pero ya fue desactivado o caducó
        if (!cupon.activo) {
            return ResponseEntity.badRequest().body(mapOf("mensaje" to "Este cupón ya no es válido o expiró."))
        }

        // 3. Si todo está bien, mandamos el porcentaje a React
        return ResponseEntity.ok(mapOf(
            "porcentajeDescuento" to cupon.porcentajeDescuento,
            "mensaje" to "¡Cupón aplicado con éxito!"
        ))
    }
}