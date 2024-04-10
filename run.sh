container_name=fyp-frontend-app

echo "container name - $container_name"
if [ "$(docker ps -qa -f name=$container_name)" ]; then
            echo ":: Found container - container_name"
            if [ "$(docker ps -q -f name=$container_name)" ]; then
                echo ":: Stopping running container - $container_name"
                docker stop $container_name;
            fi
            echo ":: Removing stopped container - $container_name"
            docker rm $container_name;
fi

docker load --input fyp-frontend-app.tar

docker run -d \
--name fyp-frontend-app \
-p 8085:80 \
fyp-frontend-app:V1.0.0