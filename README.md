# Gestor de Inventario - NestJS

## Descripción
Este es un sistema de gestión de inventario desarrollado con **NestJS**, **Typescript** y **PostgreSQL**, que permite administrar productos, categorías, proveedores y transacciones de inventario. Además, incluye autenticación de usuarios para un acceso seguro a la plataforma.

## Tecnologías Utilizadas
- **NestJS** (Framework backend)
- **PostgreSQL** (Base de datos relacional)
- **TypeORM** (ORM para NestJS)
- **JWT** (Autenticación y seguridad)
- **Swagger** (Documentación de API, Accedé en http://localhost:3000/api)
- **Winston** - Sistema de logging profesional
- **Cache Manager** - Sistema de cache en memoria para optimización
- **Terminus** - Health checks y monitoreo de aplicación
- **Throttler** - Rate limiting y protección contra ataques


## Características Principales
- **Gestión de Productos**: CRUD de productos con categorías.
- **Gestión de Categorías**: Organización de productos en distintas categorías.
- **Gestión de Proveedores**: Manejo de proveedores para abastecimiento de inventario.
- **Movimientos de Inventario**: Registro de entradas y salidas de productos.
- **Autenticación de Usuarios**: Registro e inicio de sesión con JWT.
- **Base de Datos en PostgreSQL**: Almacenamiento de toda la información del sistema.
- **API Documentada con Swagger**.

# 🛡️ Funcionalidades de Producción

## 📊 Logging Avanzado: Sistema de logs estructurado con Winston

- Logs en consola para desarrollo  
- Logs en archivos para producción (`logs/combined.log`, `logs/error.log`)  
- Diferentes niveles de log (`info`, `warn`, `error`)  
- Contexto detallado por servicio  

---

## ⚡ Sistema de Cache: Optimización de performance con cache en memoria

- Cache automático para consultas frecuentes (`GET` operations)  
- Invalidación inteligente en operaciones de escritura  
- TTL configurable (5 minutos por defecto)  
- Mejora significativa en tiempos de respuesta  

---

## ❤️ Health Checks: Monitoreo completo del estado de la aplicación

- `/health` - Estado general del sistema  
- `/health/database` - Conectividad a PostgreSQL  
- `/health/memory` - Uso de memoria (heap y RSS)  
- `/health/disk` - Espacio disponible en disco  
- `/health/ready` - Preparación para recibir tráfico  
- `/health/live` - Verificación de que la app está viva  

---

## 🚦 Rate Limiting: Protección contra abuso y ataques

- Límites diferenciados por endpoint según criticidad  
- Protección especial en endpoints de autenticación  
- Configuración flexible por operación (`GET`, `POST`, `PUT`, `DELETE`)  
- Headers informativos sobre límites restantes  
