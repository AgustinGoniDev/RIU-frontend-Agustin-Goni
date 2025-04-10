# CHALLENGE DE DESARROLLO MINDATA / RIU - DESARROLLADO POR AGUSTIN GOÑI

# Superhéroes App

# Dockerización

Esta aplicación está dockerizada y puede ejecutarse en cualquier entorno con Docker y Docker Compose instalados.

### Requisitos previos
- Docker
- Docker Compose

### Comandos para ejecutar la aplicación

```bash
# Construir y ejecutar la aplicación
docker-compose up -d

# Ver logs de la aplicación
docker-compose logs -f

# Detener la aplicación
docker-compose down

#Para ingresar a la aplicacion
http://localhost:4000
```

## Proceso de desarrollo y flujo de trabajo

El desarrollo de esta aplicación siguió un enfoque estructurado, priorizando la escalabilidad, el orden y las buenas prácticas de desarrollo. A continuación, se detalla el proceso general:

### Análisis y estructura inicial
Se definió la estructura de carpetas y componentes, con el objetivo de mantener el código organizado y escalable.

### Desarrollo de la funcionalidad principal
Se comenzó por implementar el servicio central de gestión de héroes, junto con las vistas principales:

- Tabla de héroes  
- Formulario de creación y edición  
- Eliminación de registros con confirmación vía diálogos  
- Vista en tarjetas y buscador dinámico  

### Maquetación y estilo
Se utilizó Angular Material con un tema predefinido para la UI, agregando toolbar, sidebar y navegación interna tipo dashboard. Se trabajó también la adaptación responsive.

### Lógica y simulación de carga
Dado que no se utilizó una API real, se simularon los delays de red usando `delay()` de RxJS en los métodos del servicio. No se usaron interceptors por la ausencia de peticiones HTTP.

### Persistencia de datos
Se utilizó `localStorage` para guardar la información tanto de usuarios como de héroes. Al tratarse de una app con Server-Side Rendering (Angular 19), se inyectó el almacenamiento condicionalmente para evitar errores en tiempo de renderizado.

### Control de versiones con Git
Se trabajó inicialmente sobre la rama `main`, utilizando commits convencionales y descriptivos. Luego se creó una rama `develop` para nuevas features como el login y su respectivo guard.  
Se utilizaron **tags** para marcar versiones estables y prever posibles rollbacks.

### Testing
Se desarrollaron pruebas para alcanzar una cobertura del 80%, validando tanto funcionalidades clave como componentes.

### Dockerización
Finalmente, se dockerizó la aplicación con `Docker` y `Docker Compose`, cumpliendo con uno de los requisitos principales del challenge.
