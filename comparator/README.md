# Микросервис для оценки качества видео через метрики PSNR и SSIM

## Зависимости

Для запуска требуется наличие библиотек:
- ffmpeg v4.2.4 и выше
- opencv v4, установленный в режиме совместимости с ffmpeg
- node v14.4.0 и выше
- cmake
- make

## Установка

Для установки запустите скрипт `./install.sh`
Если скрипт не запускается, запустите `chmod +x install.sh`
Создайте файл с переменными окружения .env (пример .env.example)

## Использование

Для запуска микросервиса используйте: `npm start`