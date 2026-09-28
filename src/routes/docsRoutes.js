import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { Router } from 'express';
import swaggerUiDist from 'swagger-ui-dist';

// Swagger UI: /docs — файл редагує ТІЛЬКИ тімлід
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

// свій initializer (замість дефолтного з swagger-ui-dist) — має бути ВИЩЕ static
router.get('/swagger-initializer.js', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '../swagger-initializer.js'));
});

router.get('/locations.yaml', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '../../docs/openapi/locations.yaml'));
});

router.use(express.static(swaggerUiDist.getAbsoluteFSPath()));

export default router;
