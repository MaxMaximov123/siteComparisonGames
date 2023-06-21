# Установка базового образа Python
FROM python:3.9

# Установка рабочей директории
WORKDIR /app

# Копирование зависимостей и установка их через pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование файлов программы API
COPY . .

# Определение команды запуска приложения
CMD [ "python", "api.py" ]
