FROM bitnami/minideb:latest
COPY --from=denoland/deno:bin-2.2.8 /deno /usr/local/bin/deno
RUN install_packages openssh-client git
RUN mkdir /root/.ssh
WORKDIR /app
COPY ./src .
COPY ./keys /root/.ssh
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts
RUN ssh-keyscan codeberg.org >> /root/.ssh/known_hosts
RUN deno cache main.ts
CMD ["deno", "run", "-A", "--watch", "./main.ts"]
