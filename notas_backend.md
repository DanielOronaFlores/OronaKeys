# Plantilla de Conexión MySQL - Spring Boot
**Ruta:** `src/main/resources/application.properties`


# 1. DIRECCIÓN: Cambiar "mi_base_de_datos" por el nombre real
spring.datasource.url=jdbc:mysql://localhost:3306/mi_base_de_datos?serverTimezone=UTC

# 2. CREDENCIALES: Usuario y contraseña de MySQL
spring.datasource.username=root
spring.datasource.password=mi_contraseña

# 3. COMPORTAMIENTO DE TABLAS (Hibernate):
# "update" -> Crea/Modifica tablas automáticamente basándose en el código.
# "validate" -> Solo verifica que el código y la BD coincidan (Seguro para BD ya existentes).
# "none" -> No hace nada, tú manejas el SQL manualmente.
spring.jpa.hibernate.ddl-auto=update

# 4. MONITOR Y TRADUCTOR
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect