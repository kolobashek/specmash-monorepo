# Specmash Server

Серверная часть приложения Specmash.

## Команды

- `yarn start`: Запуск сервера
- `yarn build`: Сборка сервера
- `yarn test`: Запуск тестов
- `yarn lint`: Запуск линтера

## Docker

- `yarn docker:build`: Сборка Docker-образа
- `yarn docker:run`: Запуск Docker-контейнера

## Пример файла .env

DB_HOST="127.0.0.1" // Хост БД  
DB_PORT="3306" // Порт БД  
DB_USER="root" // Пользователь БД  
DB_PASSWORD="Password123!" // Пароль пользователя БД  
DB_NAME="specmash" // Имя БД

## Команды Docker для запуска БД

```
docker run --name mariadb -e MYSQL_ROOT_PASSWORD=password123 --env MARIADB_USER=kolobashek --env MARIADB_PASSWORD=password123 -e MYSQL_DATABASE=specmash -p 3306:3306 -d mariadb
```

Запуск контейнера mariadb с передачей переменных окружения для пользователя, пароля, базы данных и сопоставлением портов.

```
docker run --name phpmyadmin -d --link mariadb:db -p 8080:80 phpmyadmin
```

Запуск контейнера phpmyadmin, связанного с mariadb, с сопоставлением портов.

## Описание структуры БД

### Таблица roles

Содержит роли пользователей:

- id - уникальный идентификатор записи
- name - название роли

### Таблица users

Хранит данные о пользователях:

- id - уникальный идентификатор пользователя
- phone - номер телефона
- name - имя пользователя
- password - пароль
- role_id - идентификатор роли (связь с roles)
- isactive - флаг активности

### Таблица equipment_types

Содержит типы техники:

- id - уникальный идентификатор типа
- name - название типа

### Таблица equipment

Хранит данные о единицах техники:

- id - уникальный идентификатор
- type_id - идентификатор типа (связь с equipment_types)
- name - название единицы
- dimensions - габариты
- weight - вес
- license_plate - госномер
- nickname - прозвище

### Таблица workPlaces

Содержит данные об объектах:

- id - уникальный идентификатор
- name - название
- contacts - контакты
- address - адрес

### Таблица travel_logs

Хранит путевые листы:

- id - уникальный идентификатор
- date - дата
- shift_number - номер смены
- driver_id - идентификатор водителя (связь с users)
- workPlace_id - идентификатор объекта (связь с workPlaces)
- equipment_id - идентификатор техники (связь с equipment)
- hours_worked - отработанные часы
- hours_idle - часы простоя
- comments - комментарии
