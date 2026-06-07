package com.oronakeys.Server.controller

import com.oronakeys.Server.dto.CheckoutRequest

import com.oronakeys.Server.repository.CuponRepository
import com.oronakeys.Server.repository.PedidoRepository
import com.oronakeys.Server.repository.UsuarioRepository
import com.oronakeys.Server.repository.MetodoPagoRepository
import com.oronakeys.Server.repository.ClaveDigitalRepository
import com.oronakeys.Server.repository.DetallePedidoRepository
import com.oronakeys.Server.repository.VideojuegoRepository

import com.oronakeys.Server.model.Pedido
import com.oronakeys.Server.model.Usuario
import com.oronakeys.Server.model.MetodoPago
import com.oronakeys.Server.model.EstadoClave
import com.oronakeys.Server.model.DetallePedido
import com.oronakeys.Server.model.Videojuego

import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@RestController
@CrossOrigin(origins = ["http://localhost:5173"])
@RequestMapping("/api")

class CheckoutController(
    private val cuponRepository : CuponRepository,
    private val pedidoRepository : PedidoRepository,
    private val usuarioRepository : UsuarioRepository,
    private val metodoPagoRepository : MetodoPagoRepository,
    private val claveDigitalRepository : ClaveDigitalRepository,
    private val videojuegoRepository : VideojuegoRepository,
    private val detallePedidoRepository : DetallePedidoRepository,
    ){

    @PostMapping("/checkout")
    @Transactional // Si falla asignar una llave, cancela toda la compra para no cobrar de más
    fun procesarCompra(@RequestBody orden: CheckoutRequest): ResponseEntity<Map<String, Any>> {
        
        try { 
            // 1. VALIDAR CUPÓN (Buscar en tabla 'cupones')
            val cupon = cuponRepository.findByCodigoCupon(orden.codigoCupon)
            if (cupon != null && !cupon.activo) throw Exception("Cupón inválido")

            // 2. CREAR EL PEDIDO MAESTRO (En tabla 'pedidos')
            val usuario = usuarioRepository.findById(orden.idUsuario)
                .orElseThrow { Exception("Usuario no encontrado en la base de datos") }

            val metodoPago = metodoPagoRepository.findById(orden.idMetodoPago)
                .orElseThrow { Exception("Metodo de pago no encontrado en la base de datos") }

            val nuevoPedido = Pedido(
                    usuario = usuario,
                    metodoDePago = metodoPago,
                    cupon = cupon,
                    total = orden.totalPagado,
                    fechaPedido = java.time.LocalDateTime.now()
                )

            val pedido = pedidoRepository.save(nuevoPedido)
            val llavesCompradas = mutableListOf<String>()
            val doubleTotal = pedido.total

            // 3. PROCESAR CADA JUEGO (Tablas 'detalles_pedido' y 'claves_digitales')
            for (idJuego in orden.idsVideojuegos) {
                
                // A) Buscar una llave disponible para este juego en 'claves_digitales'
                val claveDisponible = claveDigitalRepository.findFirstByVideojuegoIdVideojuegoAndEstado(idJuego, EstadoClave.disponible)
                    ?: throw Exception("Stock agotado para el juego ID: $idJuego")
                
                // B) Marcar la llave como vendida
                claveDisponible.estado = EstadoClave.vendida
                claveDigitalRepository.save(claveDisponible)

                // C) Crear el Detalle del Pedido
                val videojuego = videojuegoRepository.findById(idJuego)
                    .orElseThrow { Exception("Videojuego no encontrado en la base de datos") }


                val detalle = DetallePedido(
                    pedido = pedido,
                    videojuego = videojuego,
                    claveDigital = claveDisponible,
                    precioUnitario = videojuego.precio
                )

                detallePedidoRepository.save(detalle)
                
                // Guardamos el código real de la llave para mostrársela al usuario en el recibo
                llavesCompradas.add(claveDisponible.codigo_clave) 
            }

            // RESPUESTA DE ÉXITO A REACT
            
            val respuesta = mapOf(
                "exito" to true,
                "mensaje" to "Pago realizado.", 
                "numeroOrden" to pedido.idPedido, // Cambiar por pedidoGuardado.idPedido
                "totalCobrado" to doubleTotal,
                "llaves" to llavesCompradas // Le enviamos las licencias compradas!
            )

            return ResponseEntity.ok(respuesta)

        } catch (e: Exception) {
            // Si algo falla (ej. no hay llaves disponibles), respondemos error
            return ResponseEntity.badRequest().body(mapOf("exito" to false, "mensaje" to e.message!!))
        }
    }
}