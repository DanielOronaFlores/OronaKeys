# NOTAS GIT

## CICLO DE GIT

### PREPARAR CAMBIOS
```bash
git add .
```
Agrega todos los cambios al área de preparación.

### GUARDAR CAMBIOS
```bash
git commit -m "Ejemplo de nota"
```
Crea un commit con los cambios preparados.

### SUBIR A LA NUBE
```bash
git push
```
Envía los commits al repositorio remoto.


## Conventional Commits
- feat: (Feature)
Cuando agregas una nueva funcionalidad o característica a tu proyecto.
Ejemplo: feat: agregar sistema de inicio de sesión con Google

- fix: (Fix)
Cuando solucionas un error o bug en el código.
Ejemplo: fix: resolver caída de la app al enviar el formulario vacío

- chore: (Chore / Tarea rutinaria)
Tareas de mantenimiento, actualización de dependencias o configuraciones menores que no afectan el código de producción.
Ejemplo: chore: actualizar la versión de React a 18.2

#### Refactorización y Estructura
- refactor: (Refactor)
Cuando reescribes o reestructuras un fragmento de código para hacerlo más limpio o legible, pero no añades nuevas funciones ni corriges errores.
Ejemplo: refactor: simplificar la lógica de validación de contraseñas

- style: (Style)
Cambios de formato que no afectan la lógica del código (espaciado, tabulaciones, comillas faltantes, puntos y comas). Ojo: no se refiere a estilos CSS.
Ejemplo: style: alinear correctamente las variables en el controlador

- perf: (Performance)
Cuando haces un cambio específico para mejorar el rendimiento de la aplicación (hacerla más rápida o que consuma menos memoria).
Ejemplo: perf: optimizar la consulta a la base de datos para cargar más rápido

#### Entorno, Pruebas y Documentación
- docs: (Documentation)
Cuando solo modificas la documentación (como el archivo README.md o comentarios dentro del código).
Ejemplo: docs: agregar instrucciones de instalación al README

- test: (Test)
Cuando agregas pruebas automatizadas nuevas o corriges las existentes (Unit tests, Integration tests).
Ejemplo: test: agregar pruebas para el cálculo de descuentos

- build: (Build)
Para qué se usa: Cambios que afectan el sistema de construcción del proyecto o dependencias externas (modificaciones en Maven, Gradle, Vite, npm).
Ejemplo: build: configurar el empaquetado de la aplicación para producción

- ci: (Continuous Integration)
Para qué se usa: Cambios en los archivos de configuración de integración y despliegue continuo (como GitHub Actions, Jenkins, Travis).
Ejemplo: ci: configurar GitHub Actions para compilar el servidor en cada push

- revert: (Revert)
Para qué se usa: Cuando necesitas deshacer completamente un commit anterior porque rompió algo.
Ejemplo: revert: revertir el commit "feat: nuevo diseño de carrito"