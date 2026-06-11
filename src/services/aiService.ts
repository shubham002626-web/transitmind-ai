/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Report, ReportType, RiskLevel } from "../types";

export interface AnalysisRequest {
  imageName: string;
  imageDataUrl: string; // Base64 representation or standard path
  type: ReportType;
  isMockMode?: boolean;
}

/**
 * Service representing calls to backend intelligence systems (Express endpoints)
 * Ready for future real-world Supabase, Gemini Vision API and storage integrations.
 */
export class AIService {
  /**
   * Submits an image for visual intelligence inspection
   * Supports both simulation (mock) and forwarding to server-side Gemini API.
   */
  static async analyzeImage(payload: AnalysisRequest): Promise<Report> {
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned error status ${response.status}`);
      }

      const result = await response.json();
      return result.report;
    } catch (error) {
      console.warn("Express API failed, falling back to local simulation:", error);
      return this.getLocalSimulation(payload.type, payload.imageDataUrl);
    }
  }

  /**
   * Fetches historical reports from backend DB (simulated or Supabase API helper)
   */
  static async fetchReports(): Promise<Report[]> {
    try {
      const response = await fetch("/api/reports");
      if (response.ok) {
        const data = await response.json();
        return data.reports;
      }
    } catch (_) {
      // ignore
    }
    return this.getMockReports();
  }

  /**
   * Helper fallback when client needs standalone state
   */
  static getLocalSimulation(type: ReportType, imageUrl: string): Report {
    const timestamp = new Date().toISOString().split("T")[0];
    const randId = "REP-" + Math.floor(1000 + Math.random() * 9000);

    if (type === ReportType.WAREHOUSE) {
      return {
        id: randId,
        title: "Warehouse Safety & Path Obstruction Scan",
        type: ReportType.WAREHOUSE,
        uploadDate: timestamp,
        imageUrl,
        riskScore: 35,
        safetyScore: 84,
        warehouseScore: 78,
        riskLevel: RiskLevel.MEDIUM,
        executiveSummary: "Visual scan of primary warehouse corridor indicates optimized physical space utilization, but reveals critical blockage in Emergency Lane C and high rack storage irregularities.",
        issues: [
          {
            id: "i1",
            category: "Obstruction",
            description: "Wooden pallets and box clutter blocking Access Corridor Delta leading to fire exit.",
            severity: "high",
            location: "Corridor Delta",
          },
          {
            id: "i2",
            category: "Safety Hazards",
            description: "Rack stability scan indicates slight structural lean exceeding safety thresholds (+1.4 deg).",
            severity: "medium",
            location: "Storage Rack Zone 7B",
          },
        ],
        recommendations: [
          "Enforce immediate clearance of Corridor Delta and fine logistics handlers violating spatial code.",
          "Re-anchor and secure upright poles on Storage Rack Zone 7B.",
          "Review congestion logs in transit ports during peak afternoon hours."
        ],
      };
    } else if (type === ReportType.CARGO) {
      return {
        id: randId,
        title: "Cargo Handling & Package Damage Audit",
        type: ReportType.CARGO,
        uploadDate: timestamp,
        imageUrl,
        riskScore: 78,
        safetyScore: 55,
        warehouseScore: 85,
        riskLevel: RiskLevel.HIGH,
        executiveSummary: "Package Integrity Algorithm captured prominent structural crushing on primary transport pallet layers. Heavy stacking on fragile outer cartons has breached safety tolerances, posing immediate slip risks.",
        issues: [
          {
            id: "i3",
            category: "Package Damage",
            description: "Severe buckling and tearing of outer packaging on baseline cartons.",
            severity: "high",
            location: "Receiving Bay Pallet 3",
          },
          {
            id: "i4",
            category: "Load Overbalance",
            description: "Uneven stacking profile shifts center of gravity outward by 12 inches.",
            severity: "high",
            location: "Receiving Bay Pallet 3",
          },
          {
            id: "i5",
            category: "Moisture Label Alert",
            description: "High moisture content labels triggered in secondary sector box layer.",
            severity: "medium",
            location: "Receiving Bay Pallet 3 - Base",
          },
        ],
        recommendations: [
          "Halt transit of Pallet 3 and re-box baseline fragile electronics before vehicle loading.",
          "Apply rigid corner edge boards and high-gauge wrap to stabilize center-of-gravity imbalance.",
          "Optimize pallet stacking matrix: heavy rigid crates must form the base base tier."
        ],
      };
    } else {
      return {
        id: randId,
        title: "Payload Lashing and Stowage Security Inspection",
        type: ReportType.LOADING,
        uploadDate: timestamp,
        imageUrl,
        riskScore: 18,
        safetyScore: 92,
        warehouseScore: 90,
        riskLevel: RiskLevel.LOW,
        executiveSummary: "Vehicle load survey verifies optimal axle distribution and tight strap tension matching transit regulations. Minor lashing wear detected in secondary belt harness.",
        issues: [
          {
            id: "i6",
            category: "Lashing Quality",
            description: "Mild strap fraying detected on primary cargo tie-down strap #4.",
            severity: "low",
            location: "Flatbed Section Rear Right",
          }
        ],
        recommendations: [
          "Replace strap #4 prior to standard long-haul interstate shipment.",
          "Authorize payload transit; axel-load calibration is optimized and safe."
        ],
      };
    }
  }

  static getMockReports(): Report[] {
    return [
      {
        id: "REP-9104",
        title: "Emergency Exit Corridor Scan",
        type: ReportType.WAREHOUSE,
        uploadDate: "2026-06-10",
        imageUrl: "",
        riskScore: 42,
        safetyScore: 82,
        warehouseScore: 74,
        riskLevel: RiskLevel.MEDIUM,
        executiveSummary: "Regular safety scan identifies multiple stacked cardboard containers obstructing fire egress paths.",
        issues: [
          {
            id: "ha-1",
            category: "Spatial Congestion",
            description: "Excess stack volume blocking fire doors in Sector 3.",
            severity: "high",
            location: "Sector 3 Egress",
          }
        ],
        recommendations: [
          "Declare zone fire-safe by enforcing clear paths",
          "Ensure warehouse leads verify visual corridors every turn."
        ],
      },
      {
        id: "REP-8821",
        title: "Truck Axle Balanced Stowage Scan",
        type: ReportType.LOADING,
        uploadDate: "2026-06-08",
        imageUrl: "",
        riskScore: 14,
        safetyScore: 95,
        warehouseScore: 91,
        riskLevel: RiskLevel.LOW,
        executiveSummary: "High-accuracy visual assessment indicates perfectly balanced payload distribution across drive axles.",
        issues: [],
        recommendations: [
          "Proceed with interstate journey dispatch.",
        ],
      },
      {
        id: "REP-7412",
        title: "Delhivery Fragile Electronics Pallet Check",
        type: ReportType.CARGO,
        uploadDate: "2026-06-05",
        imageUrl: "",
        riskScore: 81,
        safetyScore: 48,
        warehouseScore: 89,
        riskLevel: RiskLevel.HIGH,
        executiveSummary: "Critical structural buckling captured at base tier of heavy electronics pallet, risking complete product collapse.",
        issues: [
          {
            id: "ha-3",
            category: "Packaging Failure",
            description: "Base material cardboard crushed under 1.2 metric tons loading pressure.",
            severity: "high",
            location: "Pallet Stack A5",
          }
        ],
        recommendations: [
          "Immediately de-stack Pallet A5 and replace base container with rigid plastic crates."
        ],
      },
    ];
  }
}
