-- ╔═══════════════════════════════════════════════════════════════╗
-- ║           EDUCADINO - Script de Base de Datos                ║
-- ╚═══════════════════════════════════════════════════════════════╝
--
-- INSTRUCCIONES:
-- 1. Instala PostgreSQL si no lo tienes
-- 2. Ejecuta este script para crear la base de datos
-- 3. El backend creará las tablas automáticamente (ddl-auto: update)
--
-- Para ejecutar en psql:
--   psql -U postgres -f init-db.sql
--

-- Crear la base de datos
CREATE DATABASE educadino
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Spain.1252'
    LC_CTYPE = 'Spanish_Spain.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Conectar a la base de datos
\c educadino;

-- Mensaje de confirmación
SELECT 'Base de datos EducaDino creada correctamente!' AS mensaje;
