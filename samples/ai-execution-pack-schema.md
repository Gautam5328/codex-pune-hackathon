# AI Execution Pack Schema

This schema describes the export format used by Codex Mission Control when preparing a mission for external execution tools.

```json
{
  "productContext": {
    "title": "string",
    "objective": "string",
    "targetUsers": ["string"],
    "nonGoals": ["string"]
  },
  "architectureContext": {
    "summary": "string",
    "components": ["string"],
    "dataFlow": ["string"],
    "deploymentShape": ["string"]
  },
  "technicalConstraints": {
    "performance": ["string"],
    "security": ["string"],
    "operational": ["string"]
  },
  "acceptanceCriteria": [
    "string"
  ],
  "featureBreakdown": [
    {
      "name": "string",
      "whyItExists": "string",
      "dependencies": ["string"]
    }
  ],
  "recommendedTaskOrder": ["string"],
  "risks": [
    {
      "risk": "string",
      "impact": "string",
      "mitigation": "string"
    }
  ],
  "edgeCases": ["string"],
  "provenance": {
    "missionId": "string",
    "generatedAt": "string",
    "sourceArtifacts": ["string"],
    "model": "string"
  }
}
```

## Notes

- The pack is designed for execution handoff, not code generation.
- Every field should be traceable back to mission context.
- Cached document revisions should preserve provenance.
- The schema should remain stable enough for external tools to consume without guessing.
