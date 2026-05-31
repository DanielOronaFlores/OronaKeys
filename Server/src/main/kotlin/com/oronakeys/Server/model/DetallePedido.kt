package com.oronakeys.Server.model

import jakarta.persistence.*
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import java.math.BigDecimal

@Entity
@Table(name = "detalles_pedido")
data class DetallePedido(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    val idDetallePedido: Int = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pedido", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    val pedido: Pedido,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_videojuego", nullable = false)
    val videojuego: Videojuego,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_clave", nullable = false, unique = true)
    val claveDigital: ClaveDigital,

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    val precioUnitario: BigDecimal = BigDecimal.ZERO
)