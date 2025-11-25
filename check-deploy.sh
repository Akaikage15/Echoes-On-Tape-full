#!/bin/bash

# Скрипт проверки деплоя на Vercel

echo "🔍 Проверка деплоя Echoes On Tape..."
echo ""

# URL вашего проекта
PROD_URL="https://echoes-on-tape.vercel.app"

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция проверки
check_endpoint() {
    local name=$1
    local url=$2
    local expected=$3
    
    echo -n "Проверка $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" = "$expected" ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $response, ожидалось $expected)"
        return 1
    fi
}

# Функция проверки JSON ответа
check_json() {
    local name=$1
    local url=$2
    
    echo -n "Проверка $name... "
    
    response=$(curl -s "$url" 2>/dev/null)
    
    if echo "$response" | grep -q "status"; then
        echo -e "${GREEN}✓ OK${NC}"
        echo "  Ответ: $response"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        echo "  Ответ: $response"
        return 1
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_endpoint "Главная страница" "$PROD_URL" "200"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Backend API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_json "API Root" "$PROD_URL/api/"
echo ""
check_json "Health Check" "$PROD_URL/api/health"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Auth Endpoints"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_endpoint "Register endpoint" "$PROD_URL/api/auth/register" "400"
check_endpoint "Login endpoint" "$PROD_URL/api/auth/login" "400"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Итоги"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Если все проверки прошли успешно:"
echo -e "${GREEN}✓ Frontend работает${NC}"
echo -e "${GREEN}✓ Backend API работает${NC}"
echo -e "${GREEN}✓ Проект готов к показу заказчику!${NC}"
echo ""
echo "Если есть ошибки:"
echo -e "${YELLOW}1. Проверьте переменные окружения в Vercel${NC}"
echo -e "${YELLOW}2. Убедитесь что DATABASE_URL установлен${NC}"
echo -e "${YELLOW}3. Примените миграции: cd backend && npx prisma migrate deploy${NC}"
echo -e "${YELLOW}4. Проверьте логи: https://vercel.com/akaikages-projects/echoes-on-tape/functions${NC}"
echo ""
echo "URL для заказчика: $PROD_URL"
