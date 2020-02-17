# webpack4-react16-reactrouter-demo
webpack4-react16-reactrouter-demo

Registering a new user:

curl -X POST -H "Content-Type: application/json"  -d '{"username":"admin1", "password": "admin", "email":"admin@admin.com","first_name":"admin1", "last_name":"admin1"}' http://0.0.0.0:8000/register/


Obtaining a new token:

curl -X POST -H "Content-Type: application/json"  -d '{"username":"admin1", "password": "admin"}' http://0.0.0.0:8000/api-token-auth/


Accessing protected endpoint:

curl http://0.0.0.0:8000/group/ -H "Content-Type: application/json" -H 'Authorization: JWT <your_token>'


curl http://0.0.0.0:8000/direct/ -H "Content-Type: application/json" -H 'Authorization: JWT <your_token>'
