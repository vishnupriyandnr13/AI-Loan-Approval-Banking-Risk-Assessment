import React, { useState, useRef } from "react";
import { 
  UploadCloud, FileText, CheckCircle, Trash2, 
  AlertCircle, Building2, Sparkles, Check, HelpCircle 
} from "lucide-react";
import { BankDocument, PresetClientProfile } from "../types";
import { PRESET_PROFILES, INITIAL_REQUIRED_DOCUMENTS, INITIAL_OPTIONAL_DOCUMENTS } from "../data";

interface UploadStageProps {
  onStartAnalysis: (params: {
    applicantName: string;
    loanType: 'Home Loan' | 'Business Loan' | 'Personal Loan';
    loanAmount: number;
    monthlySalary: number;
    existingLiabilities: number;
    employerName: string;
    employmentStatus: string;
    providedDocs: string[];
    customNotes: string;
  }) => void;
}

export default function UploadStage({ onStartAnalysis }: UploadStageProps) {
  // Preset scenario selection
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  
  // Minimal core fields
  const [applicantName, setApplicantName] = useState("Priya Sharma");
  const [loanType, setLoanType] = useState<'Home Loan' | 'Business Loan' | 'Personal Loan'>('Home Loan');
  const [loanAmount, setLoanAmount] = useState(6500000);
  const [monthlySalary, setMonthlySalary] = useState(250000);
  const [existingLiabilities, setExistingLiabilities] = useState(20000);
  const [employerName, setEmployerName] = useState("Tata Consultancy Services Ltd");
  const [employmentStatus, setEmploymentStatus] = useState("Salaried Permanent (Director Grade)");
  const [customNotes, setCustomNotes] = useState("");

  // Bank Document List State
  const [documents, setDocuments] = useState<BankDocument[]>([
    ...INITIAL_REQUIRED_DOCUMENTS.map((doc, i) => ({ ...doc, id: `req-${i}` })),
    ...INITIAL_OPTIONAL_DOCUMENTS.map((doc, i) => ({ ...doc, id: `opt-${i}` }))
  ] as BankDocument[]);

  // Selected file reference for drag-drop visual states
  const [dragActive, setDragActive] = useState<string | null>(null);
  const [generalValidation, setGeneralValidation] = useState<string | null>(null);

  // File Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUploadType, setCurrentUploadType] = useState<string | null>(null);

  const applyPresetProfile = (preset: PresetClientProfile) => {
    setSelectedPresetId(preset.id);
    setApplicantName(preset.applicantName);
    setLoanType(preset.loanType);
    setLoanAmount(preset.loanAmount);
    setMonthlySalary(preset.monthlySalary);
    setExistingLiabilities(preset.existingLiabilities);
    setEmployerName(preset.employerName);
    setEmploymentStatus(preset.employmentStatus);
    setCustomNotes(`Automatically uploaded document package: ${preset.providedDocs.join(", ")}`);

    // Reset document statuses to match the predefined items
    const updated = documents.map(doc => {
      // Find matching upload prefix
      const keyMap: Record<string, string> = {
        application: "Loan_Application",
        salary_slip: "Salary",
        bank_statement: "Bank_Statement",
        pan: "PAN_Card",
        aadhaar: "Aadhaar",
        address_proof: "Address",
        tax_return: "Returns"
      };
      
      const filePrefix = keyMap[doc.type];
      const matchingFile = preset.providedDocs.find(f => f.toLowerCase().includes(filePrefix.toLowerCase()) || f.toLowerCase().includes(doc.type));

      if (matchingFile) {
        return {
          ...doc,
          name: matchingFile,
          status: 'verified' as const,
          progress: 100,
          fileSize: '2.4 MB'
        };
      } else {
        return {
          ...doc,
          name: doc.required ? `Simulated_${doc.type}.pdf` : doc.name,
          status: doc.required ? ('verified' as const) : ('pending' as const),
          progress: doc.required ? 100 : 0,
          fileSize: doc.required ? '1.8 MB' : undefined
        };
      }
    });
    setDocuments(updated);
    setGeneralValidation(null);
  };

  const handleDrag = (e: React.DragEvent, typeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(typeId);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const simulateFileUpload = (id: string, fileName: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, name: fileName, status: 'uploading', progress: 10, fileSize: '1.5 MB' };
      }
      return d;
    }));

    // Simulating progress
    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += 30;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setDocuments(prev => prev.map(d => {
          if (d.id === id) {
            return { ...d, status: 'verified', progress: 100 };
          }
          return d;
        }));
      } else {
        setDocuments(prev => prev.map(d => {
          if (d.id === id) {
            return { ...d, progress: currentProgress };
          }
          return d;
        }));
      }
    }, 150);
  };

  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      // Check PDF
      if (!file.name.toLowerCase().endsWith(".pdf") && !file.name.toLowerCase().endsWith(".png") && !file.name.toLowerCase().endsWith(".jpg")) {
        setDocuments(prev => prev.map(d => {
          if (d.id === id) {
            return { ...d, status: 'error', errorMsg: 'Only PDF, PNG or JPEG formats accepted' };
          }
          return d;
        }));
        return;
      }
      simulateFileUpload(id, file.name);
    }
  };

  const triggerFileSelect = (id: string) => {
    setCurrentUploadType(id);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0] && currentUploadType) {
      simulateFileUpload(currentUploadType, files[0].name);
    }
  };

  const removeDocument = (id: string) => {
    // Revert doc to initial pending details
    const initialNameMap: Record<string, string> = {
      application: "Loan Application PDF",
      salary_slip: "Salary Slip (Last 3 Months)",
      bank_statement: "Bank Statement (6 Months)",
      pan: "PAN Card",
      aadhaar: "Aadhaar Card",
      address_proof: "Address Proof (Aadhar/Utility Bill)",
      tax_return: "Income Tax Returns (ITR) / Form 16"
    };
    
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          name: initialNameMap[d.type] || d.name,
          status: 'pending',
          progress: 0,
          fileSize: undefined,
          errorMsg: undefined
        };
      }
      return d;
    }));
  };

  const checkAndSubmit = () => {
    // Verify required uploads
    const incompleteRequired = documents.filter(d => d.required && d.status !== 'verified');
    if (incompleteRequired.length > 0) {
      setGeneralValidation(`All primary documents (Loan Application, Salary Slip, and Bank Statement) must be uploaded to initiate review.`);
      return;
    }
    
    if (!applicantName.trim()) {
      setGeneralValidation("Please state a valid Applicant Name.");
      return;
    }

    onStartAnalysis({
      applicantName,
      loanType,
      loanAmount,
      monthlySalary,
      existingLiabilities,
      employerName,
      employmentStatus,
      providedDocs: documents.filter(d => d.status === 'verified').map(d => d.name),
      customNotes
    });
  };

  const allRequiredUploaded = documents.filter(d => d.required && d.status !== 'verified').length === 0;

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      
      {/* ENTERPRISE BRIEFING SUMMARY */}
      <div className="border border-slate-800 bg-[#121214] p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-2.5 py-1 rounded-full uppercase font-medium">New Case Intake</span>
            <h1 className="mt-2 text-2xl font-sans text-slate-100 tracking-tight font-bold">Applicant Document Onboarding</h1>
            <p className="text-sm text-slate-400 mt-1">Upload verified files or use preset scenarios to analyze applicant credibility.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-[#0c0c0e] border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400 font-mono">
              Status: <span className="text-amber-400 font-semibold">• Pending Document Verification</span>
            </span>
          </div>
        </div>
      </div>

      {/* DEMO TOOL: CLIENT PRESETS */}
      <div className="bg-[#0c0c0e] border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-mono tracking-wider uppercase text-slate-400 font-semibold">Predefined Enterprise Scenarios (Instant Testing)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_PROFILES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPresetProfile(preset)}
              id={`preset-btn-${preset.id}`}
              className={`p-4 rounded-xl text-left border transition-all ${
                selectedPresetId === preset.id 
                  ? "bg-indigo-600/20 text-white border-indigo-500 shadow-lg" 
                  : "bg-[#121214] hover:bg-[#161619] text-slate-300 border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm font-bold text-slate-100">{preset.displayName.split(" ")[0] + " " + preset.displayName.split(" ")[1]}</span>
                {selectedPresetId === preset.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${selectedPresetId === preset.id ? 'text-slate-300' : 'text-slate-400'}`}>
                {preset.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] font-mono">
                <span className={selectedPresetId === preset.id ? 'text-indigo-200' : 'text-slate-500'}>EMI: ₹{preset.existingLiabilities.toLocaleString()}/mo</span>
                <span className={`px-2 py-0.5 rounded-full ${selectedPresetId === preset.id ? 'bg-indigo-650 text-indigo-100' : 'bg-[#09090b] text-slate-400'}`}>
                  FOIR (Ratio): {Math.round((preset.existingLiabilities / preset.monthlySalary) * 100)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: MINIMAL CORE PARAMETERS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#121214] border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2.5 font-bold">Applicant Parameters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-1">APPLICANT NAME</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => { setApplicantName(e.target.value); setSelectedPresetId(""); }}
                  className="w-full text-sm border border-slate-800 bg-[#09090b] text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-indigo-500 font-sans"
                  placeholder="e.g. Samuel Jackson"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-1">LOAN TYPE</label>
                <select
                  value={loanType}
                  onChange={(e) => { setLoanType(e.target.value as any); setSelectedPresetId(""); }}
                  className="w-full text-sm border border-slate-800 bg-[#09090b] text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-indigo-500 font-sans"
                >
                  <option value="Home Loan" className="bg-[#121214]">Home Loan</option>
                  <option value="Business Loan" className="bg-[#121214]">Business Loan</option>
                  <option value="Personal Loan" className="bg-[#121214]">Personal Loan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-1">REQUESTED CAPITAL (₹)</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => { setLoanAmount(Number(e.target.value)); setSelectedPresetId(""); }}
                  className="w-full text-sm border border-slate-800 bg-[#09090b] text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-indigo-500 font-mono"
                  placeholder="e.g. 200000"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-medium text-slate-400 mb-1">NET MONTHLY SALARY (₹)</label>
                  <input
                    type="number"
                    value={monthlySalary}
                    onChange={(e) => { setMonthlySalary(Number(e.target.value)); setSelectedPresetId(""); }}
                    className="w-full text-sm border border-slate-800 bg-[#09090b] text-slate-100 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-medium text-slate-400 mb-1">EXISTING MONTHLY EMI (₹)</label>
                  <input
                    type="number"
                    value={existingLiabilities}
                    onChange={(e) => { setExistingLiabilities(Number(e.target.value)); setSelectedPresetId(""); }}
                    className="w-full text-sm border border-slate-800 bg-[#09090b] text-slate-100 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#0c0c0e] rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="font-mono text-slate-400 font-medium">EMI to Income Ratio (FOIR)</span>
                <span className={`px-2.5 py-0.5 rounded-full font-mono font-semibold ${
                  (existingLiabilities / (monthlySalary || 1)) >= 0.5 
                    ? "bg-red-950/40 text-red-400 border border-red-900/40" 
                    : (existingLiabilities / (monthlySalary || 1)) >= 0.35 
                    ? "bg-amber-950/40 text-amber-400 border border-amber-900/40" 
                    : "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40"
                }`}>
                  {Math.round((existingLiabilities / (monthlySalary || 1)) * 100)}%
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-1">EMPLOYER NAME</label>
                <div className="relative">
                  <input
                    type="text"
                    value={employerName}
                    onChange={(e) => { setEmployerName(e.target.value); setSelectedPresetId(""); }}
                    className="w-full text-sm border border-slate-800 bg-[#09090b] text-slate-100 rounded-xl pl-9 pr-3 py-2.5 focus:outline-hidden focus:border-indigo-500 font-sans"
                  />
                  <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-1">EMPLOYMENT RELATIONSHIP</label>
                <input
                  type="text"
                  value={employmentStatus}
                  onChange={(e) => { setEmploymentStatus(e.target.value); setSelectedPresetId(""); }}
                  className="w-full text-sm border border-slate-800 bg-[#09090b] text-slate-100 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-indigo-500"
                  placeholder="e.g. Salaried Contractual"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-medium text-slate-400 mb-1">UNDERWRITER SPECIAL NOTES (OPTIONAL)</label>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full text-xs border border-slate-800 bg-[#09090b] text-slate-100 rounded-xl px-3 py-2 focus:outline-hidden focus:border-indigo-500 h-16 resize-none"
                  placeholder="Add specific comments or observations or manual audit notes..."
                />
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REFINED DOCUMENT ONBOARDING ZONE */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#121214] border border-slate-800 p-6 rounded-2xl shadow-md space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">Applicant Documents Checklist</h3>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 inline-block"></span> Optional
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Required
                </span>
              </div>
            </div>

            {/* Hidden Input for Manual Browser uploads */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />

            {/* Document Cards */}
            <div className="space-y-3">
              {documents.map((doc) => {
                const isDragOver = dragActive === doc.id;
                const isUploaded = doc.status === 'verified';
                const isUploading = doc.status === 'uploading';

                return (
                  <div
                    key={doc.id}
                    onDragEnter={(e) => handleDrag(e, doc.id)}
                    onDragOver={(e) => handleDrag(e, doc.id)}
                    onDragLeave={(e) => handleDrag(e, doc.id)}
                    onDrop={(e) => handleDrop(e, doc.id)}
                    className={`p-4 rounded-xl border transition-all duration-200 relative ${
                      isUploaded 
                        ? "bg-emerald-950/20 border-emerald-800/60" 
                        : isDragOver
                        ? "bg-[#0c0c0e] border-indigo-500 scale-[1.005]"
                        : "bg-[#09090b] border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* Left: Indicator & Info */}
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-2 rounded-lg ${
                          isUploaded 
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-850" 
                            : doc.required 
                            ? "bg-slate-900 text-slate-300" 
                            : "bg-slate-950 text-slate-500"
                        }`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-slate-100 font-sans">{doc.name}</h4>
                            {doc.required && (
                              <span className="text-[9px] font-mono bg-emerald-900/40 text-emerald-400 border border-emerald-800/30 px-1.5 py-0.5 rounded-sm font-medium">Core Required</span>
                            )}
                          </div>
                          
                          <p className="text-xs text-slate-400 mt-0.5">
                            {isUploaded 
                              ? `Verified • ${doc.fileSize || '2.0 MB'} • OCR Readiness Passed` 
                              : isUploading 
                              ? `Uploading to secure platform box...`
                              : `PDF, JPEG, or PNG format up to 10MB`
                            }
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions or Progress */}
                      <div className="flex items-center gap-2 sm:self-center">
                        {isUploaded ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              Ready
                            </span>
                            <button
                              onClick={() => removeDocument(doc.id)}
                              className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                              title="Delete uploaded file"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : isUploading ? (
                          <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-300"
                              style={{ width: `${doc.progress}%` }}
                            ></div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => triggerFileSelect(doc.id)}
                              className="text-xs font-mono font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-705 border border-slate-700 rounded-lg px-3 py-1.5 transition-colors"
                            >
                              Add Document
                            </button>
                            <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500">or drop here</span>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Error display */}
                    {doc.status === 'error' && (
                      <div className="mt-2.5 p-2 bg-red-950/40 text-red-450 border border-red-900/30 rounded-lg text-xs flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{doc.errorMsg}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ALERT BANNER: HOW IT WORKS / SECURITY */}
            <div className="p-4 bg-[#0c0c0e] rounded-2xl border border-slate-800 flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-350">Digital Document Compliance:</span> This portal runs standard client-side sandbox validation. Uploaded files are evaluated using cloud-native AI agents. Sensitive details are kept strictly compliant with institutional banking governance.
              </div>
            </div>

            {/* VALIDATION FEEDBACK */}
            {generalValidation && (
              <div className="p-3 bg-red-950/30 border border-red-900/40 text-red-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p>{generalValidation}</p>
              </div>
            )}

            {/* ACTION FOOTER */}
            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={checkAndSubmit}
                disabled={!allRequiredUploaded}
                id="initiate-analysis-btn"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs tracking-wider uppercase font-semibold transition-all shadow-md ${
                  allRequiredUploaded 
                    ? "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/20 pointer-events-auto" 
                    : "bg-slate-850 text-slate-500 cursor-not-allowed pointer-events-none"
                }`}
              >
                <span>Start AI Underwriting Analysis</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
