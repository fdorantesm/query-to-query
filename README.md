# Query to Query

Monorepo que convierte query strings en filtros y opciones de base de datos y viceversa. Incluye un núcleo para parseo y reconstrucción de consultas, tipos compartidos y adaptadores específicos para bases de datos.

## Paquetes

- **@query-to-query/common**: Tipos compartidos.
- **@query-to-query/core**: Funciones para parsear, construir y obtener filtros/opciones.
- **@query-to-query/mongodb**: Adaptador que transforma filtros a consultas de MongoDB.

## Desarrollo

```bash
npm install
npm run build
npm test
```

## Publicación

Los paquetes se publican automáticamente a npm al hacer push a `main` mediante GitHub Actions.
