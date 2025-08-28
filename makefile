# Build containers
build:
	docker compose up -d --build

# Build containers and seed DB
bootstrap:
	docker compose up -d --build
	docker compose exec server pnpm run initdb

# Init DB
initdb:
	docker compose exec server pnpm run initdb

# Seed DB with menu
seed:
	docker compose exec server pnpm run seed

# Start containers without rebuilding
start:
	docker compose up -d

# Stop running containers
stop:
	docker compose stop

# Remove containers
down:
	docker compose down

# Remove containers + volumes
down-v:
	docker compose down -v

# Get all containers logs
logs:
	docker compose logs -f

# Clean everything: remove containers, volumes, and images
clean:
	docker compose down --rmi local -v