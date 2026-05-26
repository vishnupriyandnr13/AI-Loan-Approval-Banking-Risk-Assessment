import { PresetClientProfile, BankDocument } from "./types";

export const PRESET_PROFILES: PresetClientProfile[] = [
  {
    id: "profile-priya",
    displayName: "Priya Sharma (Low Risk / Prime)",
    description: "Senior Product Director with high monthly salary, minimal EMIs, and clean EPFO banking records.",
    applicantName: "Priya Sharma",
    loanType: "Home Loan",
    loanAmount: 6500000,
    monthlySalary: 250000,
    existingLiabilities: 20000,
    employerName: "Tata Consultancy Services Ltd",
    employmentStatus: "Salaried Permanent (Director Grade)",
    providedDocs: ["Loan_Application_Priya_Sharma.pdf", "Salary_Slip_April_2026.pdf", "Bank_Statement_6M_Priya.pdf", "PAN_Card_Priya.png", "Tax_Returns_Form_16.pdf"]
  },
  {
    id: "profile-rajesh",
    displayName: "Rajesh Kumar (Medium Risk / Conditional)",
    description: "Retail logistics business owner with strong turnover but high existing EMI load.",
    applicantName: "Rajesh Kumar",
    loanType: "Business Loan",
    loanAmount: 4000000,
    monthlySalary: 180000,
    existingLiabilities: 75000,
    employerName: "Kumar Logistics & Transport",
    employmentStatus: "Self-Employed (6 Years Registered Business)",
    providedDocs: ["Loan_Application_Kumar_Signed.pdf", "Business_ITR_Returns.pdf", "Bank_Statement_Kumar_12M.pdf", "GST_Certificate_3B.pdf"]
  },
  {
    id: "profile-amit",
    displayName: "Amit Patel (High Risk / Elevate Audit)",
    description: "Contractual IT consultant with short employment history, high relative EMI load, and irregular salary credits.",
    applicantName: "Amit Patel",
    loanType: "Personal Loan",
    loanAmount: 800000,
    monthlySalary: 60000,
    existingLiabilities: 45000,
    employerName: "Independent Tech Consulting LLP",
    employmentStatus: "Salaried Contractual (6 Months Remaining)",
    providedDocs: ["Loan_Application_Amit.pdf", "Salary_Cert_Contract.pdf", "Bank_Statement_Amit_3M.pdf"]
  }
];

export const INITIAL_REQUIRED_DOCUMENTS: Omit<BankDocument, 'id'>[] = [
  {
    name: "Loan Application PDF",
    type: "application",
    required: true,
    status: "pending",
    progress: 0
  },
  {
    name: "Salary Slip (Last 3 Months)",
    type: "salary_slip",
    required: true,
    status: "pending",
    progress: 0
  },
  {
    name: "Bank Statement (6 Months)",
    type: "bank_statement",
    required: true,
    status: "pending",
    progress: 0
  }
];

export const INITIAL_OPTIONAL_DOCUMENTS: Omit<BankDocument, 'id'>[] = [
  {
    name: "PAN Card",
    type: "pan",
    required: false,
    status: "pending",
    progress: 0
  },
  {
    name: "Aadhaar Card",
    type: "aadhaar",
    required: false,
    status: "pending",
    progress: 0
  },
  {
    name: "Address Proof (Aadhar/Utility Bill)",
    type: "address_proof",
    required: false,
    status: "pending",
    progress: 0
  },
  {
    name: "Income Tax Returns (ITR) / Form 16",
    type: "tax_return",
    required: false,
    status: "pending",
    progress: 0
  }
];

export const UNDERWRITING_STAGES = [
  { id: 1, label: "Scanning KYC & Application Info", desc: "Extracting PAN, Aadhaar, and identity details..." },
  { id: 2, label: "Verifying Monthly Salary Receipts", desc: "Analyzing net take-home salary, salary credits, and bonus history..." },
  { id: 3, label: "EPFO & Employment Check", desc: "EPFO registration check and employer company tier profiling..." },
  { id: 4, label: "Parsing Bank Account Statement", desc: "Analyzing average balance, cheque bounces, and banking transactions..." },
  { id: 5, label: "Risk Event Profiling", desc: "Checking for credit defaults, high credit utilization, and over-leverage..." },
  { id: 6, label: "Calculating FOIR / EMI-to-Income Ratio", desc: "Evaluating EMI obligations to ensure acceptable FOIR margins..." },
  { id: 7, label: "Cheque Bounce & Banking Anomalies check", desc: "Scanning for banking irregularities, signature mismatch, or salary slip edits..." },
  { id: 8, label: "Compiling Underwriting Assessment Draft", desc: "Structuring final credit proposal assessment dossier..." }
];
