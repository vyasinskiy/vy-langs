# VY Langs

Теперь всё приложение работает на Next.js 15 (App Router). API-роуты Next обслуживают те же эндпоинты, что и прежний Express-сервер, а Prisma напрямую подключается к PostgreSQL.

## Быстрый старт
1. Установите зависимости из корня (нужны только для проксирующих скриптов):
   ```bash
   npm install
   npm run install:all
   ```
2. Скопируйте и заполните переменные окружения:
   ```bash
   cp client/.env.example client/.env.local
   ```
   - `DATABASE_URL` — строка подключения PostgreSQL (нужна для Prisma и API).
   - `NEXT_PUBLIC_BACKEND_URL` — опционально; оставьте пустым, если фронт и API хостятся на одном домене.
3. Накатите схему:
   ```bash
   cd client
   npm run db:push
   ```
4. Запустите dev-сервер (Next.js + API на `http://localhost:3000`):
   ```bash
   npm run dev
   ```

## Сборка и запуск продакшн-версии
```bash
cd client
npm run build
npm start
```

Next.js рендерит UI и обслуживает REST API по тем же путям (`/api/words`, `/api/answers`, и т.д.), поэтому фронтенд по умолчанию обращается к `/api/*` на том же домене.

# How to connect to EC2:
ssh -i [local_path_to_pem_key] ubuntu@[ec2_ip_address]

# How to connect to production DB:
DB is closed to internet, connection is allowed only using SSH tunneling.
Example connection with DBeaver usage:
1. Create new connection
2. Host: DB instance endpoint ending with rds.amazonaws.com. Instance endpoint is located in the tab "Connectivity & security" of AWS RDS.
3. Authentication: username and password of DB
4. Checkmark "Show all databases"
5. SSH tab: host/IP: ip address of ec2 instance
6. User Name: by default ubuntu
7. Authentication method: public key
8. Private Key: path to .pem file

# How to convey production backup to local database
1. Connect to production db using steps from "How to connect to production DB" guide
2. Right click on production database -> tools -> Backup
3. Connect to local database, right click -> tools -> Restore. Choose .sql file type.
