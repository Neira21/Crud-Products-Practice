# Comandos angular

## 1. Crear un nuevo proyecto Angular en la carpeta actual

ng new frontend --directory .

## 2. Instalar Angular Material

ng add @angular/material

## 3. Instalar tailwindcss

[Angular-tailwind](https://tailwindcss.com/docs/installation/framework-guides/angular)

```bash

npm install tailwindcss @tailwindcss/postcss postcss --force
```

### crear archivo .postcssrc.json

```json
# .postcssrc.json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### copiar en styles.css

```css
/* styles.css */
@import "tailwindcss";
```

## app.config.ts

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
  ],
};
```

# Comandos nest

- crear un proyecto nest en la carpeta vacia, o poner un nombre en vez de . para crear una carpeta con ese nombre

```bash
nest new .
```

- crear modulo, con controller, service en nest

```bash
nest g resource nombreRecurso

```

# Usar Prisma con NestJS

## 1. Instalar dependencias

```bash
npm install prisma @prisma/client
```

## 2. Inicializar Prisma

```bash
npx prisma init
```

Esto crea la carpeta `prisma` y el archivo `schema.prisma`.

## 3. Configurar el archivo `schema.prisma`

Edita `prisma/schema.prisma` para definir tus modelos de base de datos.

## 4. Realizar migraciones

```bash
npx prisma migrate dev --name init
```

Esto crea la base de datos y aplica la migración inicial.

## 5. Generar el cliente Prisma

```bash
npx prisma generate
```

Esto genera el cliente para interactuar con la base de datos.

## 6. Usar Prisma en tu proyecto

Importa y utiliza `@prisma/client` en tus servicios para acceder a la base de datos, en este caso en el servicio `PrismaService`.

```typescript
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.$connect();
  }
}
```

## usar multer en nestJS

```bash
npm install @nestjs/platform-express multer
```
