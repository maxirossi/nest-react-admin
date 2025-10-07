# 🚀 Guía de Desarrollo

## Scripts Disponibles

### Desarrollo (con volúmenes - cambios en tiempo real)
```bash
./dev.sh
```
- ✅ Los cambios en el código se reflejan automáticamente
- ✅ No necesitas rebuild para ver cambios
- ✅ Perfecto para desarrollo activo

### Producción (build completo)
```bash
./prod.sh
```
- ✅ Build completo y optimizado
- ✅ Para testing final o deployment
- ✅ Más lento pero más estable

## 🔧 Configuración de Desarrollo

### Frontend
- **Archivos sincronizados:** `src/`, `public/`, `package.json`, etc.
- **Cambios automáticos:** Modifica archivos y se reflejan inmediatamente
- **Hot reload:** Los cambios se ven sin rebuild

### Backend
- **Archivos sincronizados:** `src/`, `package.json`, `yarn.lock`, etc.
- **Cambios automáticos:** Modifica archivos y se reflejan inmediatamente
- **Restart automático:** El servidor se reinicia con los cambios

## 📝 Comandos Útiles

```bash
# Ver logs en tiempo real
docker compose -f docker-compose.dev.yml logs -f

# Ver logs de un servicio específico
docker compose -f docker-compose.dev.yml logs -f frontend
docker compose -f docker-compose.dev.yml logs -f backend

# Parar entorno de desarrollo
docker compose -f docker-compose.dev.yml down

# Reiniciar un servicio específico
docker compose -f docker-compose.dev.yml restart frontend
```

## 🎯 Flujo de Trabajo Recomendado

1. **Desarrollo activo:** Usa `./dev.sh`
2. **Testing:** Usa `./prod.sh` para probar build completo
3. **Deploy:** Usa `./prod.sh` para producción

## ⚡ Ventajas del Modo Desarrollo

- **Velocidad:** No rebuild necesario
- **Eficiencia:** Cambios instantáneos
- **Productividad:** Desarrollo más fluido
- **Debugging:** Fácil debugging en tiempo real
