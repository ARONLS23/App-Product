# Inventario de Productos

Aplicación Fiori desarrollada en SAPUI5 para la gestión de productos, usuarios y compras.

## Características

- Visualización y mantenimiento de productos, usuarios y compras.
- Exportación de datos a Excel.
- Búsqueda y filtrado en tablas.
- Navegación entre vistas de detalle.
- Visualización de ubicación de usuarios en mapa.

## Instalación

1. Clona el repositorio.
2. Instala las dependencias:
   ```sh
   npm install
   ```

## Ejecución local

Para iniciar la aplicación localmente:

```sh
npm start
```

Esto abrirá la aplicación en tu navegador usando el entorno de desarrollo Fiori Tools.

### Otros comandos útiles

- **Build para despliegue local:**  
  ```sh
  npm run build
  ```
- **Pruebas unitarias:**  
  ```sh
  npm run unit-test
  ```
- **Pruebas de integración:**  
  ```sh
  npm run int-test
  ```

## Requisitos

- Node.js LTS
- UI5 CLI (`@ui5/cli`)
- Acceso a internet para consumir la API pública [Fake Store API](https://fakestoreapi.com/)

## Autor

Desarrollado por Aron Lloclla

---

> Generado con SAP Fiori Tools y SAPUI5 1.136.1