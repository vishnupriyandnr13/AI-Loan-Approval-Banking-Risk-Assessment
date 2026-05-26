import React, { useState } from "react";
import { Sparkles, Shield, Clock, Landmark, AlertCircle, RefreshCw, FileCheck } from "lucide-react";
import { UnderwritingReport } from "./types";
import { PRESET_PROFILES } from "./data";
import UploadStage from "./components/UploadStage";
import AnalysisStage from "./components/AnalysisStage";
import ReportStage from "./components/ReportStage";

export default function App() {
  const [page, setPage] = useState<'upload' | 'loading' | 'report'>('upload');
  const [error, setError] = useState<string | null>(null);
  
  // Stored inputs for processing
  const [applicantName, setApplicantName] = useState("");
  const [reportData, setReportData] = useState<UnderwritingReport | null>(null);

  // Trigger analysis call to server-side Gemini Proxy
  const handleStartAnalysis = async (params: {
    applicantName: string;
    loanType: 'Home Loan' | 'Business Loan' | 'Personal Loan';
    loanAmount: number;
    monthlySalary: number;
    existingLiabilities: number;
    employerName: string;
    employmentStatus: string;
    providedDocs: string[];
    customNotes: string;
  }) => {
    setApplicantName(params.applicantName);
    setPage('loading');
    setError(null);

    try {
      const response = await fetch("/api/underwrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`Server returned error code ${response.status}`);
      }

      const data = await response.json();
      setReportData(data);
    } catch (err: any) {
      console.error("Analysis Request Failed:", err);
      setError(
        err.message || 
        "Underwriting API failed to communicate with the Credit scoring models. Please check your credentials."
      );
      // Wait briefly so we clear loading page smoothly on failure
      setTimeout(() => {
        setPage('upload');
      }, 500);
    }
  };

  const handleAnalysisSuccess = () => {
    // Transition to final page only when report is ready and steps have rendered
    if (reportData) {
      setPage('report');
    } else {
      // In case network was laggy, we poll/wait slightly
      const checkInterval = setInterval(() => {
        if (reportData) {
          clearInterval(checkInterval);
          setPage('report');
        }
      }, 200);
      // Safety timeout
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!reportData) {
          setError("API processing timed out. Kindly reconfirm document validation schemas.");
          setPage('upload');
        }
      }, 8000);
    }
  };

  const handleRestart = () => {
    setPage('upload');
    setReportData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#09090b] text-slate-100">
      
      {/* ENTERPRISE APP SHELL HEADER */}
      <header className="bg-[#09090b] border-b border-slate-800 sticky top-0 z-50 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white font-bold text-lg italic tracking-tighter shadow-sm">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-[15px] font-bold tracking-widest uppercase text-slate-200">Vantage AURA</span>
                <span className="text-[9px] bg-slate-800 text-indigo-400 border border-slate-700/50 px-1.5 py-0.2 rounded-sm font-mono uppercase font-semibold">Underwriting AI</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider block">ENTERPRISE RISK DECISION SYSTEMS</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                SECURE AES-256
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                UTC {new Date().toISOString().substring(11, 16)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">SYS_ACTIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* SUB-HEADER / WORKFLOW PROGRESS STEPPER */}
      <div className="border-b border-slate-800 flex items-center justify-center sm:justify-start px-4 sm:px-8 py-3 gap-6 bg-[#0c0c0e]">
        <div className="flex items-center text-xs gap-2">
          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
            page !== 'upload' 
              ? "bg-emerald-950 border-emerald-500 text-emerald-400 font-bold" 
              : "bg-indigo-600 border-indigo-500 text-white font-bold"
          }`}>
            {page !== 'upload' ? "✓" : "1"}
          </span>
          <span className={`font-medium ${page === 'upload' ? 'text-white' : 'text-slate-500'}`}>Document Upload</span>
        </div>
        <div className="w-6 h-px bg-slate-800"></div>
        <div className="flex items-center text-xs gap-2">
          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
            page === 'report' 
              ? "bg-emerald-950 border-emerald-500 text-emerald-400 font-bold" 
              : page === 'loading'
              ? "bg-indigo-600 border-indigo-500 text-white font-bold"
              : "bg-slate-900 border-slate-800 text-slate-500"
          }`}>
            {page === 'report' ? "✓" : "2"}
          </span>
          <span className={`font-medium ${page === 'loading' ? 'text-white' : 'text-slate-500'}`}>AI Analysis</span>
        </div>
        <div className="w-6 h-px bg-slate-800"></div>
        <div className="flex items-center text-xs gap-2">
          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
            page === 'report' 
              ? "bg-indigo-600 border-indigo-500 text-white font-bold" 
              : "bg-slate-900 border-slate-800 text-slate-500"
          }`}>
            3
          </span>
          <span className={`font-medium ${page === 'report' ? 'text-white' : 'text-slate-500'}`}>Underwriting Report</span>
        </div>
      </div>

      {/* CORE PORTAL RUNTIME CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        
        {/* Error handling view */}
        {error && (
          <div className="mb-6 p-4 bg-red-950/20 border border-red-800/50 rounded-2xl flex items-start gap-3 animate-fade-in max-w-xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">Platform Connectivity Interception</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">{error}</p>
              <button
                onClick={() => setError(null)}
                className="flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-xs font-mono font-semibold text-slate-300"
              >
                <RefreshCw className="w-3 h-3 text-slate-400" />
                Dismiss Error Banner
              </button>
            </div>
          </div>
        )}

        {/* View Router */}
        {page === 'upload' && (
          <UploadStage onStartAnalysis={handleStartAnalysis} />
        )}

        {page === 'loading' && (
          <AnalysisStage 
            applicantName={applicantName} 
            onAnalysisSuccess={handleAnalysisSuccess} 
          />
        )}

        {page === 'report' && reportData && (
          <ReportStage 
            report={reportData} 
            onRestart={handleRestart} 
          />
        )}

      </main>

      {/* COMPLIANCE COMPLIANT FOOTER */}
      <footer className="bg-[#09090b] border-t border-slate-800 py-6 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 font-mono text-[10px]">
          <div>
            © 2026 AURA Decisioning, Inc. Statically compiled under FCRA and Dodd-Frank compliances.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Security Protocol V4</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Consumer Loan Act disclosures</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Audit Logs ID: AURA-9922</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
