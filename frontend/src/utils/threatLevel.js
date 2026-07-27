export function getThreatLevel(prediction, confidence) {

  const threatObjects = [
    "person",
    "gun",
    "knife",
    "weapon",
    "rifle",
    "soldier",
    "vehicle",
    "tank"
  ];

  const obj = prediction.toLowerCase();

  if (!threatObjects.includes(obj)) {
    return {
      level: "SAFE",
      color: "success"
    };
  }

  if (confidence >= 0.90) {
    return {
      level: "HIGH",
      color: "error"
    };
  }

  if (confidence >= 0.70) {
    return {
      level: "MEDIUM",
      color: "warning"
    };
  }

  return {
    level: "LOW",
    color: "info"
  };

}