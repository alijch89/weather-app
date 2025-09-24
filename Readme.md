# Weather API (Express + TypeORM + PostgreSQL)

## Setup
1. Clone repo
2. Copy `.env.example` to `.env` and fill values (esp. `OPENWEATHER_API_KEY`)
3. Install dependencies:
   npm install
4. Start DB and app locally:
   - Option A: Run PostgreSQL locally and `npm run dev`
   - Option B (recommended): Docker compose:
     docker-compose up --build
5. Start App in Production
    - npm run build
    - npm start

## Endpoints
- GET  /api/weather                -> list all records
- GET  /api/weather/:id            -> get by id
- POST /api/weather                -> fetch from OpenWeather and store
  - Body: { "cityName":"London", "country":"UK" }
- PUT  /api/weather/:id            -> update record
- DELETE /api/weather/:id          -> delete
- GET /api/weather/latest/:cityName-> get latest record for a city

- POST /api/auth/register                -> register new user
  - Body: { "email":"test@gmail.com", "password":"1234567" }
- POST /api/auth/login                -> login
  - Body: { "email":"test@gmail.com", "password":"1234567" }

## Swagger
Visit: http://localhost:5000/api-docs

## OpenWeather
Get an API key from https://openweathermap.org/
Set OPENWEATHER_API_KEY in `.env`

## Examples
Create (fetch & save):
curl -X POST http://localhost:5000/weather -H "Content-Type: application/json" \
  -d '{"cityName":"London","country":"GB"}'

Get latest:
curl http://localhost:5000/weather/latest/London

## Notes
- TypeORM: `synchronize: true` in `data-source.ts` for dev
