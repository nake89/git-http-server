FROM bitnami/minideb:latest
COPY --from=denoland/deno:bin-2.2.8 /deno /usr/local/bin/deno
RUN install_packages openssh-client git
WORKDIR /app
COPY . .
RUN deno cache main.ts
CMD ["deno", "run", "--allow-net", "--watch", "./main.ts"]
