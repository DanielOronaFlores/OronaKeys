package com.oronakeys.Server.controller

import com.oronakeys.Server.model.Usuario
import com.oronakeys.Server.repository.UsuarioRepository
import com.oronakeys.Server.repository.RolRepository // Asegúrate de tener esto
import org.springframework.http.ResponseEntity 
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["http://localhost:5173"])
@RequestMapping("/api/usuarios")
class UsuarioController(
    private val usuarioRepository: UsuarioRepository,
    private val rolRepository: RolRepository
) {

    // 1. OBTENER TODOS LOS USUARIOS
    @GetMapping
    fun obtenerTodos(): List<Map<String, Any?>> {
        return usuarioRepository.findAll().map { u ->
            mapOf(
                "idUsuario" to u.idUsuario,
                "nombre" to u.nombre,
                "email" to u.email,
                "idRol" to u.rol.idRol,
                "nombreRol" to u.rol.nombre // Asumiendo que tu entidad Rol tiene 'nombre'
            )
        }
    }

    // 2. ACTUALIZAR ROL (Promover/Degradar)
    @PutMapping("/{id}/rol/{idRol}")
    fun cambiarRol(@PathVariable id: Int, @PathVariable idRol: Int): ResponseEntity<Any> {
        val usuario = usuarioRepository.findById(id).orElse(null) ?: return ResponseEntity.notFound().build()
        val nuevoRol = rolRepository.findById(idRol).orElse(null) ?: return ResponseEntity.badRequest().body("Rol no existe")
        
        // Usamos .copy() para actualizar la relación
        val usuarioActualizado = usuario.copy(rol = nuevoRol)
        usuarioRepository.save(usuarioActualizado)
        
        return ResponseEntity.ok(mapOf("mensaje" to "Rol actualizado correctamente"))
    }
}