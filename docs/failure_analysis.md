# CropCompass Failure Case Analysis

CropCompass evaluates 5 explicit failure scenarios:

### Failure Case 1: Low Budget
- **Condition**: Action cost ₹1,200, Available farmer budget ₹100.
- **Expected Outcome**: `NOT FEASIBLE` (Budget constraint FAIL). Triggers search for lower-cost eligible alternative rule.

### Failure Case 2: Missing Equipment
- **Condition**: Rule requires `Sprayer`, farmer inventory has no sprayer.
- **Expected Outcome**: `NOT FEASIBLE` (Equipment constraint FAIL).

### Failure Case 3: Missing Required Information
- **Condition**: Rule specifies condition requiring `Black Soil`, but farmer profile has no soil type provided.
- **Expected Outcome**: `INSUFFICIENT INFORMATION` (Does not fabricate assumptions).

### Failure Case 4: Invalid Local Climate Data
- **Condition**: User enters Temperature = 200°C.
- **Expected Outcome**: `VALIDATION ERROR` (Form validation blocks submission with clear error message).

### Failure Case 5: High-Impact Recommendation Action
- **Condition**: Chemical pesticide rule matched (`AGR-002`, `is_high_impact = True`).
- **Expected Outcome**: Sets `requires_human_confirmation = True` and displays `HUMAN CONFIRMATION REQUIRED` badge in UI.
