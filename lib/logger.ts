type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
    }

    this.logs.push(entry)

    // Mantener solo los últimos maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // En desarrollo, también mostrar en consola
    if (process.env.NODE_ENV === "development") {
      const logMethod =
        level === "error"
          ? console.error
          : level === "warn"
            ? console.warn
            : level === "debug"
              ? console.debug
              : console.log

      logMethod(`[${level.toUpperCase()}] ${message}`, context, error)
    }

    // En producción, enviar a servicio de logging (opcional)
    if (process.env.NODE_ENV === "production" && level === "error") {
      this.sendToLoggingService(entry)
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log("info", message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log("warn", message, context)
  }

  error(message: string, context?: Record<string, any>, error?: Error) {
    this.log("error", message, context, error)
  }

  debug(message: string, context?: Record<string, any>) {
    this.log("debug", message, context)
  }

  getLogs(level?: LogLevel): LogEntry[] {
    return level ? this.logs.filter((log) => log.level === level) : this.logs
  }

  clearLogs() {
    this.logs = []
  }

  private sendToLoggingService(entry: LogEntry) {
    // Implementar envío a servicio de logging externo si es necesario
    // Por ejemplo: Sentry, LogRocket, etc.
  }
}

export const logger = new Logger()
