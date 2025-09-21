const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Sensitive data patterns to redact
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /key/i,
  /authorization/i,
  /credit.*card/i,
  /ssn/i,
  /social.*security/i,
  /passport/i,
  /driver.*license/i
];

// Function to sanitize sensitive data
const sanitizeData = (data) => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitized = Array.isArray(data) ? [] : {};
  
  for (const [key, value] of Object.entries(data)) {
    // Check if key contains sensitive information
    const isSensitive = SENSITIVE_PATTERNS.some(pattern => pattern.test(key));
    
    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Function to format log entry
const formatLogEntry = (level, message, metadata = {}) => {
  const timestamp = new Date().toISOString();
  const sanitizedMetadata = sanitizeData(metadata);
  
  return {
    timestamp,
    level,
    message,
    metadata: sanitizedMetadata,
    pid: process.pid,
    environment: process.env.NODE_ENV || 'development'
  };
};

// Function to write log to file
const writeToFile = (logEntry, filename) => {
  const logString = JSON.stringify(logEntry) + '\n';
  const filePath = path.join(logsDir, filename);
  
  fs.appendFile(filePath, logString, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
};

// Main logger class
class Logger {
  constructor() {
    this.logToConsole = process.env.NODE_ENV !== 'production';
    this.logToFile = true;
  }

  log(level, message, metadata = {}) {
    const logEntry = formatLogEntry(level, message, metadata);
    
    // Console logging (development only)
    if (this.logToConsole) {
      const colorCode = {
        ERROR: '\x1b[31m', // Red
        WARN: '\x1b[33m',  // Yellow
        INFO: '\x1b[36m',  // Cyan
        DEBUG: '\x1b[35m'  // Magenta
      };
      
      console.log(
        `${colorCode[level]}[${logEntry.timestamp}] ${level}: ${message}\x1b[0m`,
        Object.keys(metadata).length > 0 ? sanitizeData(metadata) : ''
      );
    }

    // File logging
    if (this.logToFile) {
      const date = new Date().toISOString().split('T')[0];
      
      // Write to general log file
      writeToFile(logEntry, `app-${date}.log`);
      
      // Write to level-specific log file for errors and warnings
      if (level === LOG_LEVELS.ERROR || level === LOG_LEVELS.WARN) {
        writeToFile(logEntry, `${level.toLowerCase()}-${date}.log`);
      }
    }
  }

  error(message, metadata = {}) {
    this.log(LOG_LEVELS.ERROR, message, metadata);
  }

  warn(message, metadata = {}) {
    this.log(LOG_LEVELS.WARN, message, metadata);
  }

  info(message, metadata = {}) {
    this.log(LOG_LEVELS.INFO, message, metadata);
  }

  debug(message, metadata = {}) {
    if (process.env.NODE_ENV === 'development') {
      this.log(LOG_LEVELS.DEBUG, message, metadata);
    }
  }

  // Special method for logging user actions (privacy-compliant)
  logUserAction(userId, action, metadata = {}) {
    const sanitizedMetadata = {
      ...sanitizeData(metadata),
      userId: userId ? userId.toString() : 'anonymous',
      userAgent: metadata.userAgent ? metadata.userAgent.substring(0, 100) : undefined,
      ip: metadata.ip ? this.maskIP(metadata.ip) : undefined
    };

    this.info(`User Action: ${action}`, sanitizedMetadata);
  }

  // Special method for logging security events
  logSecurityEvent(event, metadata = {}) {
    const securityLogEntry = formatLogEntry(LOG_LEVELS.WARN, `Security Event: ${event}`, metadata);
    
    // Always log security events to file
    const date = new Date().toISOString().split('T')[0];
    writeToFile(securityLogEntry, `security-${date}.log`);
    
    this.warn(`Security Event: ${event}`, metadata);
  }

  // Mask IP address for privacy (keep first 3 octets, mask last)
  maskIP(ip) {
    if (!ip) return undefined;
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
    return 'xxx.xxx.xxx.xxx';
  }

  // Method to clean old log files (call this periodically)
  cleanOldLogs(daysToKeep = 30) {
    fs.readdir(logsDir, (err, files) => {
      if (err) {
        this.error('Failed to read logs directory', { error: err.message });
        return;
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      files.forEach(file => {
        const filePath = path.join(logsDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) return;
          
          if (stats.mtime < cutoffDate) {
            fs.unlink(filePath, (err) => {
              if (err) {
                this.error('Failed to delete old log file', { file, error: err.message });
              } else {
                this.info('Deleted old log file', { file });
              }
            });
          }
        });
      });
    });
  }
}

// Create singleton instance
const logger = new Logger();

// Export the logger instance and LOG_LEVELS
module.exports = {
  logger,
  LOG_LEVELS
};
