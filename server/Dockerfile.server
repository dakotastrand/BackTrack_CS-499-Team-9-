FROM python:3.11-slim AS base

WORKDIR /server

COPY . /server/

RUN pip install --no-cache-dir -r requirements.txt

CMD ["bash", "-c", "python3 server.py"]