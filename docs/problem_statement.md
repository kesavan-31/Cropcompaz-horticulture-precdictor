# CropCompass Problem Statement

## Overview

In traditional agricultural advisory, farmers frequently receive generic, crop-level recommendations that ignore:
- Farm size and acreage boundaries
- Actual available budget
- Equipment inventory (sprayers, drip lines, tractors, pumps)
- Input availability and exact required quantities
- Available family and hired workers
- Water availability and irrigation sources
- Local micro-climate conditions (temperature, rainfall, humidity, soil type)

When a farmer with a ₹500 budget receives a generic recommendation advising drip fertigation costing ₹4,000, the advice is practically unfeasible and ignored.

## Solution

CropCompass introduces a **resource-aware horticulture advisory assistant**. It matches farmer profiles against structured, versioned agronomy rules while executing deterministic constraint checks across budget, equipment, input quantities, labor, and water compatibility.

If a primary recommendation fails resource constraints, CropCompass automatically searches for an eligible, lower-resource alternative rule, providing transparent decision support and explainability.
