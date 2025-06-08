# Этап сборки
FROM openjdk:21-jdk-slim as builder

# Устанавливаем рабочие директории
WORKDIR /app

# Полностью скопируем проект, загружаем зависимости и собираем проект
COPY . /app/.
RUN apt-get update && apt-get install -y maven \
    && mvn clean package -DskipTests

# Этап исполнения
FROM openjdk:21-jdk-slim

# Рабочая директория
WORKDIR /app

# Кладём jars-файл из предыдущей сборки
COPY --from=builder /app/target/*.jar app.jar

# Приложение запускается при старте контейнера
ENTRYPOINT ["java","-jar","/app/app.jar"]