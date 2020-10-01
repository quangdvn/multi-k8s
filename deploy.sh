docker build -t quangdvn/multi-client:latest -t quangdvn/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t quangdvn/multi-server:latest -t quangdvn/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t quangdvn/multi-worker:latest -t quangdvn/multi-worker:$SHA -f ./worker/Dockerfile ./worker

docker push quangdvn/multi-client:latest
docker push quangdvn/multi-server:latest
docker push quangdvn/multi-worker:latest

docker push quangdvn/multi-client:$SHA
docker push quangdvn/multi-server:$SHA
docker push quangdvn/multi-worker:$SHA

kubectl apply -f k8s

kubectl set image deployments/server-deployment server=quangdvn/multi-server:$SHA
kubectl set image deployments/client-deployment client=quangdvn/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=quangdvn/multi-worker:$SHA
