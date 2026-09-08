# CropCompass Agronomy Evidence Guidelines

## Rule Schema & Versioning

Every agronomy rule in CropCompass maintains strict evidence tracking metadata:

| Field | Description | Example |
| :--- | :--- | :--- |
| `rule_id` | Unique Rule Identifier | `AGR-001` |
| `version` | Rule Version String | `1.0` |
| `status` | Approval Status | `APPROVED` / `DEMO` / `NEEDS_APPROVAL` |
| `evidence_source` | Institutional Source | TNAU Agronomy Guide for Horticultural Crops (2023) |
| `evidence_reference` | Citation Code | `TNAU-HORT-CHILLI-SEC4.2` |
| `is_high_impact` | Chemical/Pesticide Review Flag | `True` / `False` |

## Honesty & Verification Standards
- Production recommendations ONLY evaluate `APPROVED` rules by default.
- Demonstration rules are explicitly tagged `DEMO` or `NEEDS_APPROVAL`.
- Enabling **Demo Mode** displays the explicit warning: `⚠️ DEMO RULE — NOT VERIFIED AGRONOMY GUIDANCE`.
