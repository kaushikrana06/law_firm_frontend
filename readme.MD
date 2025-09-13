build - sudo docker build --debug -t our-react-app

run - sudo docker run -p 80:80 our-react-app

check running process name - docker ps

find out process pid  - sudo docker inspect -f '{{.State.Pid}}' <process_name>

kill process - sudo kill -9 <pid>