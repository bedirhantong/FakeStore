interface RequestLog {
  url: string;
  method: string;
  requestBody?: unknown;
  requestHeaders: Record<string, string>;
  timestamp: string;
}

interface ResponseLog extends RequestLog {
  status: number;
  responseBody: unknown;
  responseHeaders: Record<string, string>;
  duration: number;
  isSuccess: boolean;
}

class Logger {
  private static formatLog(log: ResponseLog): string {
    return `
📡 API Call Log
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 Request
  URL: ${log.method} ${log.url}
  Headers: ${JSON.stringify(log.requestHeaders, null, 2)}
  Body: ${JSON.stringify(log.requestBody, null, 2)}

📥 Response
  Status: ${log.status} (${log.isSuccess ? '✅ Success' : '❌ Failed'})
  Duration: ${log.duration}ms
  Headers: ${JSON.stringify(log.responseHeaders, null, 2)}
  Body: ${JSON.stringify(log.responseBody, null, 2)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  }

  static logRequest(config: RequestLog): void {
    if (__DEV__) {
      console.log(`📤 Request: ${config.method} ${config.url}`);
    }
  }

  static logResponse(log: ResponseLog): void {
    if (__DEV__) {
      console.log(this.formatLog(log));
    }
  }

  static logError(error: unknown): void {
    if (__DEV__) {
      console.error('❌ API Error:', error);
    }
  }
}

export default Logger; 