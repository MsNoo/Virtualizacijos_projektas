FROM python:3.9.13-alpine3.15

COPY ./server.py /tmp/server.py

RUN pip3 install flask-restful docker pyyaml 

CMD ["python", "/tmp/server.py"]