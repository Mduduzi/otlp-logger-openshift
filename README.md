# OTLP Logger for OpenShift

This Node.js application sends logs to a Tempo distributor's OTLP endpoint at `http://tempo-distributor:4317/v1/logs` in an OpenShift cluster.

## Deployment
Deploy this application to OpenShift using the BuildConfig and Deployment YAML provided in the documentation.





```
git add index.js package.json
git commit -m "Update OTLP exporter to use gRPC instead of HTTP"
git push origin main
```

```
oc apply -f otlp-logger-build.yaml -n ar-ace
oc start-build otlp-logger -n ar-ace
```


```
# Check build status
oc get builds -n ar-ace

# Check build logs if it fails
oc logs build/otlp-logger-<build-number> -n ar-ace

# Check pod status
oc get pods -n ar-ace -l app=otlp-logger

# Check application logs
oc logs -f -l app=otlp-logger -n ar-ace
```

oc import-image nodejs:18-ubi8 --from=registry.redhat.io/ubi8/nodejs-18:latest --confirm -n openshift