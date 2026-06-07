package com.oronakeys.Server.controller

import com.oronakeys.Server.repository.UsuarioRepository
import com.oronakeys.Server.model.Rol
import com.oronakeys.Server.model.Usuario


import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity

class SignupRequest(
    val nombre : String,
    val email : String,
    val contrasena : String
)

@RestController
@CrossOrigin(origins = ["http://localhost:5173"])
@RequestMapping("/api")

class SignupController(private val usuarioRepository : UsuarioRepository) {

    @PostMapping("/signup")
    fun registrarUsuario(@RequestBody request: SignupRequest): ResponseEntity<Map<String, Any>> {
        
        val usuarioExistente = usuarioRepository.findByEmail(request.email)
        if (usuarioExistente != null) {
            return ResponseEntity.status(400).body(mapOf(
                "exito" to false, 
                "mensaje" to "Este correo ya está en uso"
            ))
        }

        val rolCliente = Rol(idRol = 2, nombre = "Cliente") 

        val nuevoUsuario = Usuario(
            nombre = request.nombre,
            email = request.email,
            contrasena = request.contrasena,
            rol = rolCliente,
            fechaRegistro = java.time.LocalDateTime.now()
        )

        usuarioRepository.save(nuevoUsuario)

        return ResponseEntity.ok(mapOf(
            "exito" to true,
            "mensaje" to "Cuenta creada exitosamente"
        ))
    }
}