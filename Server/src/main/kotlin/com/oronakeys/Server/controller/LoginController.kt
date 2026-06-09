package com.oronakeys.Server.controller

import com.oronakeys.Server.repository.UsuarioRepository

import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity


class LoginRequest(
    val email : String,
    val contrasena : String
)

@RestController
@CrossOrigin(origins = ["http://localhost:5173"])
@RequestMapping("/api")

class LoginController(private val usuarioRepository : UsuarioRepository) {
    
    @PostMapping("/login")
    fun procesarLogin(@RequestBody request: LoginRequest): ResponseEntity<Map<String, Any>> {
        val usuarioEncontrado = usuarioRepository.findByEmail(request.email)

        if(usuarioEncontrado != null && usuarioEncontrado.contrasena == request.contrasena) {
            return ResponseEntity.ok(mapOf(
                "exito" to true,
                "mensaje" to "Bienvenido al Panel",
                "usuario" to mapOf(
                "idUsuario" to usuarioEncontrado.idUsuario,
                "idRol" to usuarioEncontrado.rol,
                "nombre" to usuarioEncontrado.nombre,
                "correo" to usuarioEncontrado.email)
                ))
        }

        return ResponseEntity.status(401).body(mapOf(
            "exito" to false, 
            "mensaje" to "Credenciales incorrectas"
        ))
    }
}