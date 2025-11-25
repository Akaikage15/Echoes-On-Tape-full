/**
 * Утилита для очистки старых логов при запуске сервера
 */

import fs from 'fs';
import path from 'path';

const logsDir = path.join(__dirname, '../../logs');

export const cleanupLogs = () => {
  try {
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
      console.log('📁 Создана директория для логов');
      return;
    }

    const files = fs.readdirSync(logsDir);
    const logFiles = files.filter(file => file.endsWith('.log'));

    if (logFiles.length === 0) {
      console.log('🧹 Нет логов для очистки');
      return;
    }

    logFiles.forEach(file => {
      const filePath = path.join(logsDir, file);
      fs.unlinkSync(filePath);
    });

    console.log(`🧹 Очищено ${logFiles.length} файлов логов`);
  } catch (error) {
    console.error('❌ Ошибка очистки логов:', error);
  }
};
