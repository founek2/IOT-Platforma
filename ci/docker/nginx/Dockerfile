FROM founek2/iot-platform as builder

FROM nginx
RUN mkdir -p /var/www/platform
COPY --from=builder /var/www/frontend-build /var/www/platform
