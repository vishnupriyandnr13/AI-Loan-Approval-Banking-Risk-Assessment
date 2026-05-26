export interface BankDocument {
  id: string;
  name: string;
  type: 'application' | 'salary_slip' | 'bank_statement' | 'pan' | 'aadhaar' | 'address_proof' | 'tax_return';
  required: boolean;
  status: 'pending' | 'uploading' | 'processing' | 'verified' | 'error';
  progress: number;
  fileSize?: string;
  errorMsg?: string;
}

export interface RiskIndicator {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface FraudIndicator {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'requires_verification' | 'potential_inconsistency' | 'passed';
}

export interface MissingDocumentItem {
  id: string;
  documentName: string;
  status: 'missing' | 'unclear' | 'required';
  urgency: 'high' | 'medium' | 'low';
}

export interface UnderwritingReport {
  applicantName: string;
  loanType: 'Home Loan' | 'Business Loan' | 'Personal Loan';
  loanAmount: number;
  overallRiskCategory: 'Low Risk' | 'Medium Risk' | 'High Risk';
  recommendationStatus: 'Approve' | 'Approve with Conditions' | 'Manual Review Required' | 'Reject';
  
  // Section 1 - Applicant Financial Summary
  financialSummary: {
    employmentStatus: string;
    employerName: string;
    monthlySalary: number;
    existingLiabilities: number; // Total existing EMI payments
    bankingBehavior: string;
  };

  // Section 2 - Monthly Income Estimation
  incomeEstimation: {
    estimatedMonthlyIncome: number;
    recurringSalaryCredits: number;
    disposableIncome: number;
    savingsTrend: string; // e.g., 'Positive Growth', 'Stable', 'Declining'
  };

  // Section 3 - DTI Risk Analysis
  dtiAnalysis: {
    dtiPercentage: number; // DTI = (existing liabilities / monthly income) * 100
    riskLevel: 'Low' | 'Medium' | 'High';
    repaymentCapability: string;
  };

  // Section 4 - Risk Indicators
  riskIndicators: RiskIndicator[];

  // Section 5 - Fraud Indicators
  fraudIndicators: FraudIndicator[];

  // Section 6 - Missing Documents
  missingDocuments: MissingDocumentItem[];

  // Section 7 - Credit Risk Category Explanation
  creditRiskExplanation: {
    contributingFactors: string[];
    justification: string;
  };

  // Section 8 - Loan Eligibility Assessment
  eligibilityAssessment: {
    repaymentStrength: string;
    financialStability: string;
    eligibilityReasoning: string;
  };
}

export interface PresetClientProfile {
  id: string;
  displayName: string;
  description: string;
  applicantName: string;
  loanType: 'Home Loan' | 'Business Loan' | 'Personal Loan';
  loanAmount: number;
  monthlySalary: number;
  existingLiabilities: number;
  employerName: string;
  employmentStatus: string;
  providedDocs: string[]; // document names that are uploaded
}
