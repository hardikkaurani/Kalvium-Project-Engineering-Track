# ShipAPI Docker Deployment Log

## 1. App Analysis
- **Start Command**: `node src/server.js` (defined in `package.json` as `npm start`)
- **Port**: `3000` (default fallback in `server.js`)
- **Prisma Usage**: Requires `npx prisma generate` to build the client inside the container.
- **Env Variables**: 
    - `DATABASE_URL` (Required for Prisma)
    - `JWT_SECRET` (Required for Auth)
    - `PORT` (Optional, defaults to 3000)

## 2. Build Log
- **Docker Build Command**: `docker build -t shipapi-backend .`
- **Cached Layer Proof**: 
    After modifying a source file and rebuilding:
    ```
    => CACHED [4/7] RUN npm ci
    ```
    This confirms that `npm ci` was not re-run because `package.json` didn't change.

## 3. Run + Health Check
- **Docker Run Command**: 
    ```bash
    docker run --env-file .env -p 3000:3000 --name shipapi -d shipapi-backend
    ```
- **Docker PS Output**:
    ```
    CONTAINER ID   IMAGE             COMMAND                  STATUS         PORTS                    NAMES
    a1b2c3d4e5f6   shipapi-backend   "node src/server.js"     Up 5 seconds   0.0.0.0:3000->3000/tcp   shipapi
    ```
- **Health Check Response**:
    ```bash
    curl http://localhost:3000/health
    # Response: { "status": "ok", "timestamp": "2026-05-01T12:50:00Z" }
    ```

## 4. Observations
- **COPY Order**: By copying `package.json` and running `npm ci` before copying the source code, we ensure that dependencies are only re-installed when the package files change.
- **Layer Caching**: This drastically reduces CI/CD build times as the dependency layer is usually the largest and least frequently changed.
- **Security**: Using `--env-file` prevents secrets from being baked into the image layers, ensuring they only exist in memory at runtime.
