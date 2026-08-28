# ==============================================================================
# CTARTech ZentyCore — Unified Control Plane Dockerfile
# Stage 1: Build Rust Binaries | Stage 2: Minimal Distroless / Debian Runtime
# ==============================================================================

# Build stage
FROM rust:1.80-slim-bullseye AS builder

WORKDIR /usr/src/zentycore

# Install build dependencies
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy workspace configuration & manifests
COPY Cargo.toml Cargo.lock ./
COPY core-engine/Cargo.toml core-engine/
COPY modules/ modules/
COPY sdks/ sdks/

# Copy full source code
COPY core-engine/src core-engine/src

# Build release binary
RUN cargo build --release --bin core_engine

# Runtime stage
FROM debian:bullseye-slim

WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates libssl1.1 curl && rm -rf /var/lib/apt/lists/*

# Copy binary from builder
COPY --from=builder /usr/src/zentycore/target/release/core_engine /app/core_engine

# Set environment
ENV PORT=8080
ENV RUST_LOG=info

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["/app/core_engine"]
