package com.oronakeys.Server.model

import jakarta.persistence.* 
import java.time.LocalDateTime

@Entity
@Table(name = "lista_deseos")
data class ListaDeseos(
    @EmbeddedId
    val id: ListaDeseosId = ListaDeseosId(),

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idUsuario")
    @JoinColumn(name = "id_usuario")
    val usuario: Usuario,

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idVideojuego")
    @JoinColumn(name = "id_videojuego")
    val videojuego: Videojuego,

    @Column(name = "fecha_agregado", nullable = true)
    val fechaAgregado: LocalDateTime
)


@Embeddable
data class ListaDeseosId(
    @Column(name = "id_usuario")
    val idUsuario: Int = 0,

    @Column(name = "id_videojuego")
    val idVideojuego: Int = 0
) : java.io.Serializable