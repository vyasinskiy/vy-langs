.PHONY: deploy-master redeploy-back

redeploy-back:
	@echo "Пересборка и перезапуск бэкенда на сервере..."
	@ssh huawei@100.92.50.18 "cd ~/vy-langs && docker compose -f docker-compose.huawei.yml up -d --build"

deploy-master:
	@echo "Синхронизация файлов на сервер..."
	@rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' --exclude '.env' --exclude '.kilo' --exclude 'client/build' ./ huawei@100.92.50.18:~/vy-langs/
	@echo "Пересборка и перезапуск бэкенда на сервере..."
	@ssh huawei@100.92.50.18 "cd ~/vy-langs && docker compose -f docker-compose.huawei.yml up -d --build"