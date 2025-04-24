const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

// Configure the OTLP exporter to use gRPC and point to Tempo distributor
const traceExporter = new OTLPTraceExporter({
  url: 'grpc://tempo-distributor:4317', // Use gRPC protocol and Tempo distributor service name
});

// Set up the OpenTelemetry SDK
const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start the SDK
sdk.start();

// Example: Emit a log or trace (adjust based on your actual logging setup)
console.log('Starting log emission to OTLP gRPC endpoint...');

// For logs, if using @opentelemetry/sdk-logs (if applicable)
const { logRecordExporter } = require('@opentelemetry/exporter-logs-otlp-grpc');
const logExporter = new logRecordExporter({
  url: 'grpc://tempo-distributor:4317',
});

// Ensure proper shutdown (optional)
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});