const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const { LogRecordProcessor, SimpleLogRecordProcessor } = require('@opentelemetry/sdk-logs');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-grpc');
const { LoggerProvider } = require('@opentelemetry/sdk-logs');

// Set up diagnostics for debugging
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Configure OTLP exporter for logs using gRPC
const exporter = new OTLPLogExporter({
  url: 'grpc://tempo-distributor:4317', // OTLP gRPC endpoint for logs in OpenShift namespace
  credentials: undefined, // No credentials needed for insecure connection
});

// Set up the logger provider
const loggerProvider = new LoggerProvider();
loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(exporter));

// Get a logger instance
const logger = loggerProvider.getLogger('otlp-logger');

// Function to emit logs periodically
function emitLogs() {
  console.log('Emitting a log record...');
  logger.emit({
    severityText: 'INFO',
    body: 'This is a sample log message sent to Tempo via OTLP gRPC',
    attributes: {
      'log.type': 'sample',
      'source': 'nodejs-app'
    }
  });

  // Schedule the next log emission
  setTimeout(emitLogs, 10000); // Every 10 seconds
}

// Start emitting logs
console.log('Starting log emission to OTLP gRPC endpoint...');
emitLogs();

// Keep the application running
process.on('SIGINT', () => {
  loggerProvider.shutdown().then(() => {
    console.log('Logger provider shut down.');
    process.exit(0);
  });
});