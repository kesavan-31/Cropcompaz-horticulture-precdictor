# CropCompass Testing Strategy

## Test Suite Execution

The backend test suite is executed using `pytest`:

```bash
# Set PYTHONPATH and run test suite
$env:PYTHONPATH="backend"
py -3.11 -m pytest backend/tests
```

## Coverage Summary
- **Form & Input Validation (`test_validation.py`)**: Phone format, positive farm size, non-negative budget/workers, climate range checks.
- **Engine Logic (`test_failure_cases.py`)**: Tests for all 5 explicit failure cases.
- **REST API Endpoints (`test_api.py`)**: End-to-end integration tests for `/api/farmers`, `/api/recommendations`, `/api/dashboard/metrics`, and `/api/experiments`.
