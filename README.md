# Specmash Monorepo

Этот репозиторий содержит монорепозиторий для всех приложений Specmash.

## Структура проекта

- `packages/specmash-server`: Серверная часть
- `packages/specmash-react`: Веб-приложение
- `packages/specmash-itinerary`: Мобильное приложение

## Команды

- `yarn bootstrap`: Установка зависимостей для всех пакетов
- `yarn start`: Запуск всех приложений
- `yarn build`: Сборка всех приложений
- `yarn test`: Запуск тестов для всех приложений
- `yarn lint`: Запуск линтера для всех приложений

## Docker

- `yarn docker:build`: Сборка Docker-образов для всех приложений
- `yarn docker:run`: Запуск Docker-контейнеров для всех приложений
