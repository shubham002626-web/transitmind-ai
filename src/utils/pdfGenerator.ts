import { jsPDF } from "jspdf";
import { Report } from "../types";

export const createPDFDocument = (report: Report, mockMode: boolean): jsPDF => {
  const doc = new jsPDF();
  
  // Page size properties
  const pageWidth = doc.internal.pageSize.width;
  
  // Outer border frame
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(1);
  doc.rect(10, 10, pageWidth - 20, 277);

  // Header Banner Section
  doc.setFillColor(15, 23, 42);
  doc.rect(11, 11, pageWidth - 22, 38, "F");

  // Header Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(34, 211, 238); // Cyan
  doc.text("TRANSITMIND AI", 20, 26);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text("LOGISTICS COMPUTER VISION COMPLIANCE CORE", 20, 31);
  doc.text("GLOBAL RISK AUDITING INTEGRITY MATRIX", 20, 35);

  // Certificate No & Stamp
  doc.setFillColor(34, 211, 238);
  doc.rect(pageWidth - 65, 18, 50, 24, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // Navy Dark
  doc.text("AUDIT SNAPSHOT", pageWidth - 60, 25);
  doc.setFontSize(9);
  doc.text(`ID: ${report.id}`, pageWidth - 60, 32);
  doc.text(`RISK: ${report.riskLevel}`, pageWidth - 60, 37);

  // Section: Basic metadata
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  
  // Draw grid line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, 58, pageWidth - 20, 58);

  doc.setFont("helvetica", "bold");
  doc.text("AUDIT REPORT METADATA & PROFILE", 20, 66);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text(`Date of Audit: ${report.uploadDate}`, 20, 75);
  doc.text(`Security Specialty: ${report.type.replace("_", " ")} Assessment`, 20, 81);
  doc.text(`Asset Target Catalog: ${report.title}`, 20, 87);
  doc.text(`Evaluation Engine: ${mockMode ? "TransitMind Local Core Simulator V3" : "Server Google Gemini 3.5 Flash Visual"}`, 20, 93);

  // Score Board Panel (Radial representation blocks)
  doc.setFillColor(248, 250, 252);
  doc.rect(pageWidth - 90, 68, 70, 28, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(pageWidth - 90, 68, 70, 28, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("INTELLIGENCE RATINGS", pageWidth - 85, 74);
  
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`Safety Index: ${report.safetyScore}%`, pageWidth - 85, 82);
  doc.text(`Yard Efficiency: ${report.warehouseScore}%`, pageWidth - 85, 89);

  // Divider
  doc.line(20, 102, pageWidth - 20, 102);

  // Core Executive Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("EXECUTIVE VISUAL ANALYSIS COMPLIANCE DIRECTIVE", 20, 111);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  
  // Text Wrapping for description
  const summaryLines = doc.splitTextToSize(report.executiveSummary, pageWidth - 40);
  doc.text(summaryLines, 20, 120);

  // Lower segment: Issues List
  const summaryHeightOffset = 120 + (summaryLines.length * 5) + 10;
  doc.setDrawColor(226, 232, 240);
  doc.line(20, summaryHeightOffset, pageWidth - 20, summaryHeightOffset);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("SECTION 1: DETECTED HAZARDS & SPATIAL INEFFICIDENCES", 20, summaryHeightOffset + 9);

  let verticalOffset = summaryHeightOffset + 18;

  if (report.issues.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(22, 163, 74); // success Green
    doc.text("✓ Complete compliance checked. No immediate physical space or stacking hazards identified.", 20, verticalOffset);
    verticalOffset += 10;
  } else {
    report.issues.forEach((issue, index) => {
      if (verticalOffset > 240) {
        doc.addPage();
        // Draw border on next page
        doc.setDrawColor(30, 41, 59);
        doc.setLineWidth(1);
        doc.rect(10, 10, pageWidth - 20, 277);
        verticalOffset = 25;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`Anomaly ${index + 1}: [${issue.category.toUpperCase()}] - Severity: ${issue.severity.toUpperCase()}`, 20, verticalOffset);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(`Location: ${issue.location || "Audited Area"}`, 25, verticalOffset + 5);
      
      doc.setTextColor(51, 65, 85);
      const descLines = doc.splitTextToSize(issue.description, pageWidth - 45);
      doc.text(descLines, 25, verticalOffset + 9.5);

      verticalOffset += 12 + (descLines.length * 4.5);
    });
  }

  // Recommendations list section
  if (verticalOffset > 240) {
    doc.addPage();
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(1);
    doc.rect(10, 10, pageWidth - 20, 277);
    verticalOffset = 25;
  }

  doc.setDrawColor(226, 232, 240);
  doc.line(20, verticalOffset, pageWidth - 20, verticalOffset);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("SECTION 2: CORRECTIVE OPERATIONS INSTRUCTIONS MANUAL", 20, verticalOffset + 9);

  verticalOffset += 17;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  report.recommendations.forEach((rec, idx) => {
    const recLines = doc.splitTextToSize(`${idx + 1}. ${rec}`, pageWidth - 40);
    doc.text(recLines, 20, verticalOffset);
    verticalOffset += (recLines.length * 4.8) + 2;
  });

  // Digital Signature section at page bottom
  doc.setFont("courier", "bolditalic");
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text("TRANSITMIND AI SAFE-STOW SECURE SIGNATURE SEAL", 21, 273);
  doc.text("COMPLIANCE VERIFIED & LOGGED PERSISTENTLY", pageWidth - 105, 273);

  return doc;
};
