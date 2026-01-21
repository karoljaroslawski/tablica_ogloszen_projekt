FROM postgres
ARG POSTGRES_INITDB_ARGS=--auth-host=scram-sha-256
ADD ./baza.sql /docker-entrypoint-initdb.d