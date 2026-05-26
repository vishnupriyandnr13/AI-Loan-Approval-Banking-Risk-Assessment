import React, { useState } from "react";
import { 
  CheckCircle2, AlertTriangle, XCircle, TrendingUp, ShieldCheck, 
  User, Coins, Landmark, Calendar, FileText, CheckSquare, 
  AlertCircle, ChevronRight, PenTool, Download, RefreshCw, Printer 
} from "lucide-react";
import { UnderwritingReport } from "../types";

interface ReportStageProps {
  report: UnderwritingReport;
  onRestart: () => void;
}

export default function ReportStage({ report, onRestart }: ReportStageProps) {
  // Human Decision-making form state
  const [humanDecision, setHumanDecision] = useState<'approved' | 'approved_conditions' | 'rejected' | null>(null);
  const [humanNotes, setHumanNotes] = useState("");
  const [signatureName, setSignatureName] = useState("");
  const [isSignOffComplete, setIsSignOffComplete] = useState(false);

  // Derive dynamic DTI color
  const dti = report.dtiAnalysis.dtiPercentage;
  const dtiColor = dti >= 50 
    ? "text-red-400 bg-red-950/20 border-red-900/40" 
    : dti >= 35 
    ? "text-amber-400 bg-amber-950/20 border-amber-900/40" 
    : "text-emerald-400 bg-emerald-950/20 border-emerald-900/40";

  // Recommendation status colors
  const recStyle = {
    'Approve': {
      bg: "bg-emerald-950/20 border-emerald-900/40",
      text: "text-emerald-400",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
      label: "Approved for Lending"
    },
    'Approve with Conditions': {
      bg: "bg-indigo-950/30 border-indigo-800/40",
      text: "text-indigo-405 text-indigo-300",
      icon: <AlertTriangle className="w-5 h-5 text-indigo-400 shrink-0" />,
      label: "Approval with Conditions"
    },
    'Manual Review Required': {
      bg: "bg-amber-950/20 border-amber-900/40",
      text: "text-amber-400",
      icon: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
      label: "Further Review Mandatory"
    },
    'Reject': {
      bg: "bg-red-950/20 border-red-900/45",
      text: "text-red-400",
      icon: <XCircle className="w-5 h-5 text-red-500 shrink-0" />,
      label: "Declined Risk Allocation"
    }
  }[report.recommendationStatus] || {
    bg: "bg-slate-900 border-slate-800",
    text: "text-slate-300",
    icon: <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />,
    label: "Requires Review"
  };

  // Human state trigger
  const handleSignOff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanDecision) {
      alert("Please select a formal underwriting decision.");
      return;
    }
    if (!signatureName.trim()) {
      alert("Please input your full sign-off signature.");
      return;
    }
    setIsSignOffComplete(true);
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100 pb-20">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Underwriting Stage Complete</span>
          <h1 className="text-2xl font-serif text-slate-100 tracking-tight font-medium">Credit Underwriting Dossier</h1>
          <p className="text-xs text-slate-400 mt-0.5">Automated screening complete. human review and signature requested.</p>
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-800 rounded-xl text-xs font-mono hover:bg-[#161619] transition-colors bg-[#0c0c0e] text-slate-300 font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400 font-bold" />
            <span>Process New Case</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-750 rounded-xl text-xs font-mono transition-colors font-medium text-slate-200"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* TOP SECTION: DECISION OVERVIEW HERO CARD */}
      <div className={`p-6 sm:p-8 rounded-2xl border ${recStyle.bg} shadow-md`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              {recStyle.icon}
              <span className={`text-sm font-semibold tracking-wide uppercase ${recStyle.text}`}>
                {recStyle.label}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Applicant姓名</span>
                <span className="text-base font-serif font-medium text-slate-100 block mt-0.5">{report.applicantName}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Facility Credit</span>
                <span className="text-base font-serif font-medium text-slate-100 block mt-0.5">{report.loanType}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Principal Borrowing</span>
                <span className="text-base font-mono font-bold text-slate-100 block mt-0.5">₹{report.loanAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">System Risk Allocation</span>
                <span className={`text-xs font-mono font-bold block mt-1.5 uppercase px-2 py-0.5 rounded-sm inline-block ${
                  report.overallRiskCategory === 'Low Risk' 
                    ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40" 
                    : report.overallRiskCategory === 'Medium Risk'
                    ? "bg-amber-950/40 text-amber-400 border border-amber-900/40"
                    : "bg-red-950/40 text-red-400 border border-red-900/40"
                }`}>
                  {report.overallRiskCategory}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#0c0c0e] border border-slate-800 p-4 rounded-xl text-center shadow-lg shrink-0 self-start md:self-center">
            <span className="text-[9px] font-mono tracking-wide uppercase block text-slate-455 text-slate-400">Monthly EMI Obligations</span>
            <span className="text-lg font-mono font-bold text-slate-100 mt-0.5 block">₹{report.financialSummary.existingLiabilities.toLocaleString()}/mo</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">FOIR: {report.dtiAnalysis.dtiPercentage}%</span>
          </div>

        </div>
      </div>

      {/* DETAILED GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COMPACT STATS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SECTION 1 - APPLICANT FINANCIAL SUMMARY */}
          <div className="bg-[#121214] border border-slate-800 p-6 rounded-2xl shadow-md">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-3 font-semibold mb-4">Section 1 — Applicant Financial Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 bg-[#0c0c0e]/85 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-mono text-slate-400">EMPLOYMENT REGISTRY</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">{report.financialSummary.employerName}</div>
                  <div className="text-xs text-slate-404 mt-1">Status: {report.financialSummary.employmentStatus}</div>
                </div>
              </div>

              <div className="p-4 bg-[#0c0c0e]/85 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Coins className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-mono text-slate-400">VERIFIED SALARY INFLOW</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">₹{report.financialSummary.monthlySalary.toLocaleString()} per month</div>
                  <div className="text-xs text-slate-404 mt-1">Stated existing monthly EMI obligation: ₹{report.financialSummary.existingLiabilities.toLocaleString()}</div>
                </div>
              </div>

            </div>

            <div className="mt-4 p-4 border border-slate-850 rounded-xl bg-[#0c0c0e]/40">
              <span className="text-[10px] font-mono text-slate-500 block tracking-wide uppercase">TRANSACTIONAL BEHAVIOR DIRECTIVE</span>
              <p className="text-xs text-slate-350 leading-relaxed mt-1 font-sans">{report.financialSummary.bankingBehavior}</p>
            </div>
          </div>

          {/* SECTION 2 — MONTHLY INCOME ESTIMATION */}
          <div className="bg-[#121214] border border-slate-800 p-6 rounded-2xl shadow-md">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-3 font-semibold mb-4">Section 2 — Monthly Income Estimation</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border border-slate-800 text-center rounded-xl bg-[#0c0c0e]/60">
                <span className="text-[10px] font-mono uppercase text-slate-400">Est. Average Income</span>
                <span className="text-xl font-mono font-bold text-slate-100 mt-1 block">₹{report.incomeEstimation.estimatedMonthlyIncome.toLocaleString()}</span>
                <span className="text-[9px] text-slate-500 block mt-1">Extracted Net Average</span>
              </div>
              
              <div className="p-4 border border-slate-800 text-center rounded-xl bg-[#0c0c0e]/60">
                <span className="text-[10px] font-mono uppercase text-slate-400">Salary Credit Recurrence</span>
                <span className="text-xl font-mono font-bold text-slate-100 mt-1 block">₹{report.incomeEstimation.recurringSalaryCredits.toLocaleString()}</span>
                <span className="text-[9px] text-slate-500 block mt-1">Core Employer Transfer</span>
              </div>

              <div className="p-4 border border-slate-800 text-center rounded-xl bg-[#0c0c0e]/60">
                <span className="text-[10px] font-mono uppercase text-slate-400">Disposable Cash Surplus</span>
                <span className="text-xl font-mono font-bold text-slate-100 mt-1 block">₹{report.incomeEstimation.disposableIncome.toLocaleString()}</span>
                <span className="text-[9px] text-slate-500 block mt-1">Margin after Core EMIs</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between p-3.5 bg-[#0c0c0e]/50 rounded-xl border border-slate-800 text-xs">
              <span className="font-mono text-slate-400">Capital Savings Roll Velocity</span>
              <span className="font-mono font-bold text-slate-200 bg-[#121214] border border-slate-800 px-3 py-1 rounded-md">{report.incomeEstimation.savingsTrend}</span>
            </div>
          </div>

          {/* SECTION 4 & 5 — CREDIT RISK & FRAUD DETECTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SECTION 4 - RISK INDICATORS */}
            <div className="bg-[#121214] border border-slate-800 p-6 rounded-2xl shadow-md space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2.5 font-semibold">Section 4 — Risk Indicators</h4>
              <div className="space-y-3">
                {report.riskIndicators.map((risk, index) => (
                  <div key={index} className="p-3 bg-[#0c0c0e]/60 rounded-xl border border-slate-850 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        risk.severity === 'high' ? 'bg-red-500 animate-pulse' : risk.severity === 'medium' ? 'bg-amber-500' : 'bg-slate-500'
                      }`}></span>
                      <span className="text-xs font-semibold text-slate-200 font-sans">{risk.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-404 leading-relaxed pl-3.5">{risk.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5 - FRAUD INDICATORS */}
            <div className="bg-[#121214] border border-slate-800 p-6 rounded-2xl shadow-md space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2.5 font-semibold">Section 5 — Fraud Indicators</h4>
              <div className="space-y-3">
                {report.fraudIndicators.map((fraud, index) => (
                  <div key={index} className="p-3 bg-[#0c0c0e]/60 rounded-xl border border-slate-850 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 font-sans">{fraud.title}</span>
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-sm border ${
                        fraud.status === 'passed' 
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' 
                          : 'bg-amber-950/40 text-amber-400 border-amber-900/30'
                      }`}>
                        {fraud.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-404 leading-relaxed font-sans">{fraud.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SECTION 7 - CREDIT RISK EXPLANATION */}
          <div className="bg-[#121214] border border-slate-800 p-6 rounded-2xl shadow-md space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-3 font-semibold">Section 7 — Credit Risk Category</h3>
            
            <div className="space-y-3">
              <div className="p-4 bg-[#0c0c0e]/80 rounded-xl border border-slate-800/40">
                <span className="text-xs font-mono uppercase text-slate-400 block font-medium">Core Decision Classification Explanation</span>
                <p className="text-xs text-slate-300 leading-relaxed mt-2 font-sans">{report.creditRiskExplanation.justification}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2 font-medium">Contributing Underwriting Factors</span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {report.creditRiskExplanation.contributingFactors.map((factor, index) => (
                    <li key={index} className="text-xs text-slate-300 bg-[#0c0c0e]/50 hover:bg-[#0c0c0e]/90 px-3 py-2 rounded-lg border border-slate-850 flex items-center gap-1.5 font-mono">
                      <ChevronRight className="w-3 h-3 text-slate-500" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* SECTION 8 - LOAN ELIGIBILITY ASSESSMENT */}
          <div className="bg-[#121214] border border-slate-800 p-6 rounded-2xl shadow-md space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-3 font-semibold">Section 8 — Loan Eligibility Assessment</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-[#0c0c0e]/60 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 block font-medium">Repayment Buffer Strength</span>
                <p className="text-xs text-slate-200 font-semibold mt-1 font-sans">{report.eligibilityAssessment.repaymentStrength}</p>
              </div>
              <div className="p-3.5 bg-[#0c0c0e]/60 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 block font-medium">Job & Employer Tenure stability</span>
                <p className="text-xs text-slate-200 font-semibold mt-1 font-sans">{report.eligibilityAssessment.financialStability}</p>
              </div>
            </div>

            <div className="p-4 bg-[#0c0c0e]/40 border border-slate-850 rounded-xl">
              <span className="text-[10px] font-mono text-slate-500 block font-medium">Underwriting Analytical Rationale</span>
              <p className="text-xs text-slate-300 leading-relaxed mt-1 font-sans">{report.eligibilityAssessment.eligibilityReasoning}</p>
            </div>
          </div>

        </div>

        {/* RIGHT METERS & MISSING DOCS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SECTION 3 - FOIR RISK METER */}
          <div className="bg-[#121214] border border-slate-800 p-6 rounded-2xl shadow-md text-center space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-3 font-semibold text-left">Section 3 — FOIR Risk Analysis</h3>
            
            {/* Simple Dynamic Dial Indicator */}
            <div className="relative inline-flex items-center justify-center p-3">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke="#18181c" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke={dti >= 50 ? "#f43f5e" : dti >= 35 ? "#f59e0b" : "#10b981"} 
                  strokeWidth="8"
                  strokeDasharray={`${Math.min(100, dti) * 2.51} 251`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute text-center animate-pulse">
                <span className="text-2xl font-mono font-bold text-slate-100">{dti}%</span>
                <span className="text-[9px] font-mono text-slate-500 block tracking-wider mt-0.5">FOIR RATIO</span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className={`p-3 rounded-xl border ${dtiColor} text-center text-xs font-semibold uppercase font-mono`}>
                FOIR Risk Index: {report.dtiAnalysis.riskLevel} Risk
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans text-left">
                {report.dtiAnalysis.repaymentCapability}
              </p>
            </div>
          </div>

          {/* SECTION 6 — MISSING DOCUMENTS LIST Checklist UI */}
          <div className="bg-[#121214] border border-slate-800 p-6 rounded-2xl shadow-md space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-3 font-semibold">Section 6 — Missing Documents Checklist</h3>
            
            <div className="space-y-3">
              {report.missingDocuments.length === 0 ? (
                <div className="p-4 bg-emerald-950/10 text-emerald-400 border border-emerald-900/30 text-xs rounded-xl flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-505 shrink-0" />
                  <span>No core lending documents are missing in this verification cycle.</span>
                </div>
              ) : (
                report.missingDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-start gap-3 p-3 bg-[#0c0c0e]/60 rounded-xl border border-slate-850 hover:border-slate-800 transition-colors">
                    <div className="mt-0.5 select-none text-slate-600">
                      <div className="border border-slate-700 rounded-sm w-4 h-4 flex items-center justify-center"></div>
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-semibold text-slate-200">{doc.documentName}</h5>
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span className="capitalize text-slate-400">Status: {doc.status}</span>
                        <span className={`px-1.5 py-0.2 rounded-sm uppercase ${
                          doc.urgency === 'high' ? 'bg-red-950/40 text-red-400 border border-red-900/30' : 'bg-slate-800 text-slate-350'
                        }`}>
                          {doc.urgency} Urgency
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* PAGE 4 — NEXT STEPS & UNDERWRITER SITUATION ACTIONS */}
      <div id="underwriter-actions-section" className="bg-[#121214] border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full uppercase">Page 4 — Action Directives</span>
          <h2 className="text-xl font-sans mt-3 text-slate-100 tracking-tight font-bold">Mitigative Compliance Checks & Core Operations</h2>
          <p className="text-xs text-slate-400 mt-1">Recommended business practices tailored specifically dynamically to the {report.recommendationStatus} categorizations.</p>
        </div>

        {/* Dynamic actions representation */}
        {report.recommendationStatus === 'Approve' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#09090b]/40 border border-indigo-950/40 rounded-2xl space-y-2">
              <h4 className="text-xs font-mono text-emerald-400 uppercase font-semibold">1. Standard Verification Checklists</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                Cross-reference the direct employment dates with local tax offices. Execute verbal payroll confirmation at the stated employer registry portal.
              </p>
            </div>
            <div className="p-4 bg-[#09090b]/40 border border-indigo-950/40 rounded-2xl space-y-2">
              <h4 className="text-xs font-mono text-emerald-400 uppercase font-semibold">2. Disbursement Preparations</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                Collect signed pre-disbursal security mandates. Align lending dates and setup ACH automated personal accounts collection checks.
              </p>
            </div>
            <div className="p-4 bg-[#09090b]/40 border border-indigo-950/40 rounded-2xl space-y-2">
              <h4 className="text-xs font-mono text-emerald-400 uppercase font-semibold">3. Employer Verification</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                Ensure corporate domain active standing and verify TCS/Tata payroll records conform with stated monthly inflows of ₹{report.financialSummary.monthlySalary.toLocaleString()}.
              </p>
            </div>
            <div className="p-4 bg-[#09090b]/40 border border-indigo-950/40 rounded-2xl space-y-2">
              <h4 className="text-xs font-mono text-emerald-400 uppercase font-semibold">4. Final KYC validation</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                Recalibrate facial liveness check from direct application profile match and ensure PAN/Aadhaar document databases passed.
              </p>
            </div>
          </div>
        )}

        {(report.recommendationStatus === 'Approve with Conditions' || report.recommendationStatus === 'Manual Review Required') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#09090b]/40 border border-indigo-950/40 rounded-2xl space-y-2">
              <h4 className="text-xs font-mono text-indigo-400 uppercase font-semibold">1. Essential Additional Evidence</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                Request standard Form 16 / ITR tax statements or regional 3-year business tax certifications to bolster credibility logs.
              </p>
            </div>
            <div className="p-4 bg-[#09090b]/40 border border-indigo-950/40 rounded-2xl space-y-2">
              <h4 className="text-xs font-mono text-indigo-400 uppercase font-semibold">2. Guarantor Allocations</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                Recommend introducing a co-signer or third-party capital guarantor with minimum income above ₹1,00,000 to cover liabilities.
              </p>
            </div>
            <div className="p-4 bg-[#09090b]/40 border border-indigo-950/40 rounded-2xl space-y-2">
              <h4 className="text-xs font-mono text-indigo-400 uppercase font-semibold">3. Reduced Lending Limit Safeguards</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                Suggest descending borrower cap to ₹{(report.loanAmount * 0.75).toLocaleString()} to lower FOIR ratio below safer 35% tier.
              </p>
            </div>
            <div className="p-4 bg-[#09090b]/40 border border-indigo-950/40 rounded-2xl space-y-2">
              <h4 className="text-xs font-mono text-indigo-400 uppercase font-semibold">4. Risk Mitigation Action</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                Initiate strict lien or asset declarations matching borrow terms in case business liquid liabilities drop below threshold.
              </p>
            </div>
          </div>
        )}

        {report.recommendationStatus === 'Reject' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#09090b]/40 border border-indigo-950/40 rounded-2xl space-y-2">
              <h4 className="text-xs font-mono text-[#f43f5e] uppercase font-semibold">1. Decisional Weakness Disclosures</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                Unreasonable Debt-Servicing (FOIR Ratio at {dti}%) limits available cash reserves. Unstable tenure under current employer registry flags.
              </p>
            </div>
            <div className="p-4 bg-[#09090b]/40 border border-indigo-950/40 rounded-2xl space-y-2">
              <h4 className="text-xs font-mono text-[#f43f5e] uppercase font-semibold">2. Adverse Action Notice Requirements</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                Issue formatted Adverse Credit Action Form specifying high fixed leverage triggers as primary decline drivers under Fair Credit standards.
              </p>
            </div>
            <div className="p-4 bg-[#09090b]/40 border border-indigo-950/40 rounded-2xl space-y-2">
              <h4 className="text-xs font-mono text-[#f43f5e] uppercase font-semibold">3. Correctional Improvement Guidance</h4>
              <p className="text-xs text-slate-330 leading-relaxed font-sans">
                Recommend applicant payoff minor uncollateralized high interest credit cards to bring existing EMI liabilities below ₹10,000/mo.
              </p>
            </div>
            <div className="p-4 bg-[#09090b]/40 border border-indigo-950/40 rounded-2xl space-y-2">
              <h4 className="text-xs font-mono text-[#f43f5e] uppercase font-semibold">4. Future Re-review Window Terms</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                Allow review query resubmission in 120 calendar days contingent on secondary tax filing proofs or co-signer signatures.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* HUMAN DECK: DECISION STAMPING SIGN-OFF */}
      <div className="bg-[#121214] border border-slate-800 p-6 rounded-3xl shadow-lg space-y-6">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Underwriter Discretion Panel</span>
          <h2 className="text-lg font-sans mt-1 text-slate-100 tracking-tight font-bold">Lending Officer Final Judgment</h2>
          <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
            Borrower assessment requires official human signing. Review recommendations above and record the formal decision.
          </p>
        </div>

        {isSignOffComplete ? (
          <div className="p-6 bg-emerald-950/10 border border-emerald-900/30 rounded-2xl text-center space-y-3 animate-fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <div>
              <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">Signature Stamped Successfully</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                Formal credit judgment has been finalized and written into the applicant audit files. This case is updated in internal banking pipelines.
              </p>
            </div>

            <div className="p-4 bg-[#0c0c0e] rounded-xl border border-emerald-900/35 max-w-sm mx-auto text-left space-y-2 font-mono text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-850 pb-1.5">
                <span className="text-slate-500">DECISION:</span>
                <span className="font-bold text-emerald-400 uppercase">{humanDecision?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-1.5">
                <span className="text-slate-500">OFFICER SIGN:</span>
                <span className="font-serif italic font-semibold text-slate-100 text-sm">{signatureName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-550 text-slate-500">STAMP DATE:</span>
                <span className="text-indigo-400 font-medium">May 26, 2026 // UTC</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSignOffComplete(false);
                setHumanDecision(null);
                setSignatureName("");
              }}
              className="text-xs font-mono font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-750 px-4 py-2 rounded-xl transition-all"
            >
              Amend / Edit Officer Sign-off
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignOff} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans">
              <button
                type="button"
                onClick={() => setHumanDecision('approved')}
                className={`p-3.5 rounded-xl border text-xs font-mono uppercase font-semibold flex items-center justify-center gap-2 transition-all ${
                  humanDecision === 'approved' 
                    ? "bg-emerald-600 border-emerald-505 text-white shadow-md font-bold" 
                    : "bg-[#0c0c0e]/80 hover:bg-[#161619] text-slate-350 border-slate-800"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Approve Standard</span>
              </button>

              <button
                type="button"
                onClick={() => setHumanDecision('approved_conditions')}
                className={`p-3.5 rounded-xl border text-xs font-mono uppercase font-semibold flex items-center justify-center gap-2 transition-all ${
                  humanDecision === 'approved_conditions' 
                    ? "bg-indigo-600 border-indigo-505 text-white shadow-md font-bold" 
                    : "bg-[#0c0c0e]/80 hover:bg-[#161619] text-slate-350 border-slate-800"
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-indigo-400" />
                <span>Approve Conditional</span>
              </button>

              <button
                type="button"
                onClick={() => setHumanDecision('rejected')}
                className={`p-3.5 rounded-xl border text-xs font-mono uppercase font-semibold flex items-center justify-center gap-2 transition-all ${
                  humanDecision === 'rejected' 
                    ? "bg-red-600 border-red-505 text-white shadow-md font-bold" 
                    : "bg-[#0c0c0e]/80 hover:bg-[#161619] text-slate-355 border-slate-800"
                }`}
              >
                <XCircle className="w-4 h-4 text-red-500" />
                <span>Decline Allocations</span>
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-wide text-slate-500 uppercase mb-1.5 font-semibold">Human Officer Case Review Notes</label>
              <textarea
                value={humanNotes}
                onChange={(e) => setHumanNotes(e.target.value)}
                placeholder="Required under banking compliances. State reasons for overrides or final approval parameters..."
                className="w-full text-xs font-sans border border-slate-800 bg-[#09090b] text-slate-100 rounded-xl p-3 focus:outline-hidden focus:border-indigo-500/80 h-20 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end pt-2 border-t border-slate-850">
              <div>
                <label className="block text-[10px] font-mono tracking-wide text-slate-500 uppercase mb-1.5 font-semibold">Borrower Officer Signature Name</label>
                <div className="relative font-sans">
                  <input
                    type="text"
                    required
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="Type Full Name (Digital Stamp)"
                    className="w-full text-xs border border-slate-800 bg-[#09090b] text-slate-100 rounded-xl pl-9 pr-3 py-2.5 focus:outline-hidden focus:border-indigo-500/80 font-mono"
                  />
                  <PenTool className="w-3.5 h-3.5 text-indigo-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex justify-end font-sans">
                <button
                  type="submit"
                  id="officer-sign-submit"
                  className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Confirm & Stamp Underwrite
                </button>
              </div>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
