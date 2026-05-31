package com.oronakeys.Server.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "pedidos")
data class Pedido(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    val idPedido: Int = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    val usuario: Usuario,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_metodo_pago", nullable = false)
    val metodoDePago: MetodoPago,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cupon", nullable = true)
    val cupon: Cupon? = null,

    @Column(name = "total", nullable = false, precision = 10, scale = 2)
    val total: BigDecimal = BigDecimal.ZERO,

    @Column(name = "fecha_pedido", nullable = true)
    val fechaPedido: LocalDateTime
)