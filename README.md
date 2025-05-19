# 🌤️ Weather Subscription Service

A web application to check current weather by city and subscribe for weather updates via email on an hourly or daily basis.

---

## 🔗 Live Demo

**Deployed at:**  
[https://software-engineering-school-testcase.onrender.com](https://software-engineering-school-testcase.onrender.com)  
Deployed on [Render.com](https://render.com/)

---

## 🎥 Video Demo

📺 [Watch the demo video here](https://www.loom.com/share/5a7c0c203c6c4079a39a3f2cb234b671?sid=5371a429-b7da-4f5a-a936-3beefd9cbe55)

---

## Running Locally

### 1. Clone and Configure

```bash
git clone https://github.com/DimaGalchenko/software-engineering-school-testcase.git
```
### 2. Set Environment Variables (.env)
```
PORT=3000
HOST=http://localhost:3000

# PostgreSQL
DB_URI=postgres://weather_user:weather_pass@localhost:5432/weather_db

# WeatherAPI
WEATHER_API_KEY=your_weatherapi_key

# Email SMTP
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```
### 3. Run With Docker
```bash
docker-compose up --build
```
### 4. Run Locally Without Docker
```bash
npm install
npx sequelize-cli db:migrate
npm start
```

## API Description
| Method | Endpoint                  | Description                                        |
| ------ | ------------------------- | -------------------------------------------------- |
| GET    | `/api/weather`            | Get current weather by city (requires `?city=...`) |
| POST   | `/api/subscribe`          | Subscribe for updates (email, city, frequency)     |
| GET    | `/api/confirm/:token`     | Confirm a subscription via token                   |
| GET    | `/api/unsubscribe/:token` | Cancel an email subscription                       |

## 🧠 Interesting Implementation Details

### 📦 Cache for Weather API
- Weather data is cached in memory using [`node-cache`](https://www.npmjs.com/package/node-cache) to avoid exceeding the WeatherAPI request quota.
- **Cache Key Format:**  
{frequency}:{day}-{month}[:hour]:{city}

Examples:
- `daily:14-05:Kyiv`
- `hourly:14-05:09:London`
- **TTL:** TTL for daily and hourly caches

---

### 🚫 Rate Limiter on `/api/weather`
- Protects the public endpoint using [`express-rate-limit`](https://www.npmjs.com/package/express-rate-limit)
- Limits each IP to **30 requests per 15 minutes**
- Helps prevent abuse, infinite loops, or DoS attacks
- Returns a 429 error with a helpful message if the limit is exceeded

---

### 📬 Scheduled Jobs (using `node-cron`)
- **Hourly Job**: Sends weather emails to all confirmed hourly subscribers  
`0 * * * *`
- **Daily Job**: Sends daily weather updates at **8:00 AM**  
`0 8 * * *`
- **Cleanup Job**: (Optional) Removes unconfirmed subscriptions after a timeout period to keep the database clean

---

### 🧱 Database Migration
- Uses Sequelize and `sequelize-cli` to manage schema
- Migrations run **automatically** when the Docker container starts
- You can also run them manually:
```bash
npx sequelize-cli db:migrate