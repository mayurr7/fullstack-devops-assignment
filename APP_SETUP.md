# Application Documentation

## Running the Application

1. Build and start all services:

```bash
docker-compose up --build
```

2. Access services:

- **API**: http://localhost:5000
- **Mongo Express**: http://localhost:8081 (username: admin, password: pass)
- **RabbitMQ dashboard**: http://localhost:15672 (guest/guest)

## API Endpoints

- `POST /user/register` → Register new user
- `POST /user/login` → Login and receive JWT token
- `GET /data/:id` → Fetch user data (JWT required)

**Note**: Use a valid MongoDB ObjectId when fetching user data. Admin users can fetch any user's data; normal users can fetch only their own.

## RabbitMQ Integration

- Consumer service listens to `emailQueue`.
- Sending a message to this queue will be consumed automatically by consumer-service.

## Redis Caching

- User data from `GET /data/:id` is cached in Redis for 60 seconds.
- Repeated requests will return cached data (source: "cache").

## Modifying Code

If you modify API or consumer code, rebuild the Docker images:

```bash
docker-compose up --build
```

## Troubleshooting

### Consumer shows ECONNREFUSED
- Ensure RabbitMQ container is running and accessible.

### API shows Cannot POST /user/login
- Make sure the request URL matches `/user/login` and you are sending JSON body.

### Redis not caching
- Ensure `REDIS_URL` points to the running Redis container.