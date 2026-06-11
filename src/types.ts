export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum ReportType {
  WAREHOUSE = "WAREHOUSE",
  CARGO = "CARGO",
  LOADING = "TRUCK_LOADING",
}

export interface Issue {
  id: string;
  category: string;
  description: string;
  severity: "high" | "medium" | "low";
  location?: string;
}

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  uploadDate: string;
  imageUrl?: string;
  riskScore: number;
  safetyScore: number;
  warehouseScore: number;
  riskLevel: RiskLevel;
  issues: Issue[];
  recommendations: string[];
  executiveSummary: string;
}

export interface PlatformMetrics {
  logisticsHealthScore: number;
  safetyRiskScore: number;
  warehouseEfficiencyScore: number;
  reportsGenerated: number;
  activeIncidents: number;
}
