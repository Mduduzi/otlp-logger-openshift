const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

// Configure the OTLP exporter to use gRPC and point to Tempo distributor
const traceExporter = new OTLPTraceExporter({
  url: 'grpc://tempo-distributor:4317', // Use gRPC protocol and Tempo distributor service name in OpenShift
});

// Set up the OpenTelemetry SDK
const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start the SDK
sdk.start();

console.log('Starting log emission to OTLP gRPC endpoint...');

// Example: Emit a log or trace periodically (adjust based on your actual setup)
setInterval(() => {
  console.log('Emitting a log record...');
  // Add your trace or log emission logic here if needed
}, 5000);

// Ensure proper shutdown (optional)
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});