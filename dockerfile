# Build Stage
FROM golang:1.22 AS builder

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . ./
WORKDIR /app/cmd/server
RUN go build -o /neo-path

# Run Stage
FROM gcr.io/distroless/base-debian11

WORKDIR /

COPY --from=builder /neo-path .
COPY --from=builder /app/internal/config/sqlite.db ./sqlite.db

ENV PORT=8080

EXPOSE 8080

CMD ["/neo-path"]