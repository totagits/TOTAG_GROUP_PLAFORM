/**
 * Liberian Payroll Calculation Engine
 * 
 * This module provides comprehensive payroll calculations for Liberian tax regulations
 * including income tax bands, NASSCORP contributions, LPA deductions, and loan processing.
 */

// Liberian Tax Rates and Constants (2024)
export interface LiberiaTaxConfig {
  incomeTaxBands: Array<{
    min: number;
    max: number | null;
    rate: number; // Percentage
    description: string;
  }>;
  nasscorpRateEmployee: number; // Employee contribution rate
  nasscorpRateEmployer: number; // Employer contribution rate
  nasscorpMaxSalary: number; // Maximum salary for NASSCORP calculation
  lpaRate: number; // Liberian Press Association rate
  minimumWage: number; // Monthly minimum wage in LRD
  taxFreeAllowance: number; // Annual tax-free allowance in LRD
}

// Default Liberian tax configuration
export const DEFAULT_LIBERIA_TAX_CONFIG: LiberiaTaxConfig = {
  // Liberian Income Tax Bands (Annual rates)
  incomeTaxBands: [
    { min: 0, max: 36000, rate: 0, description: 'Tax-free allowance' },
    { min: 36001, max: 60000, rate: 2, description: 'Low income band' },
    { min: 60001, max: 120000, rate: 10, description: 'Lower middle income' },
    { min: 120001, max: 240000, rate: 15, description: 'Middle income' },
    { min: 240001, max: 480000, rate: 20, description: 'Upper middle income' },
    { min: 480001, max: null, rate: 25, description: 'High income band' }
  ],
  nasscorpRateEmployee: 3, // 3% employee contribution
  nasscorpRateEmployer: 3, // 3% employer contribution (not deducted from salary)
  nasscorpMaxSalary: 50000, // Monthly maximum for NASSCORP calculation
  lpaRate: 1, // 1% for Liberian Press Association
  minimumWage: 8000, // Monthly minimum wage in LRD
  taxFreeAllowance: 36000 // Annual tax-free allowance
};

// Payroll input data
export interface PayrollInput {
  employeeId: string;
  grossMonthlySalary: number; // In LRD
  taxableBenefits?: number; // Additional taxable benefits
  pretaxDeductions?: number; // Health insurance, retirement contributions, etc.
  loanInstallment?: number; // Monthly loan repayment
  overtimeHours?: number;
  overtimeRate?: number;
  allowances?: {
    transport?: number;
    housing?: number;
    meals?: number;
    other?: number;
  };
  config?: Partial<LiberiaTaxConfig>; // Override default config if needed
}

// Detailed payroll breakdown
export interface PayrollBreakdown {
  employee: {
    id: string;
    grossMonthlySalary: number;
    annualGrossSalary: number;
  };
  earnings: {
    basicSalary: number;
    overtime: number;
    allowances: {
      transport: number;
      housing: number;
      meals: number;
      other: number;
      total: number;
    };
    taxableBenefits: number;
    totalGrossEarnings: number;
  };
  deductions: {
    incomeTax: {
      annualTaxableIncome: number;
      monthlyTaxableIncome: number;
      taxBandBreakdown: Array<{
        band: string;
        taxableAmount: number;
        rate: number;
        tax: number;
      }>;
      totalAnnualTax: number;
      totalMonthlyTax: number;
    };
    nasscorp: {
      taxableAmount: number;
      rate: number;
      monthlyContribution: number;
      annualContribution: number;
    };
    lpa: {
      taxableAmount: number;
      rate: number;
      monthlyContribution: number;
      annualContribution: number;
    };
    pretaxDeductions: number;
    loanInstallment: number;
    totalDeductions: number;
  };
  summary: {
    totalGrossEarnings: number;
    totalDeductions: number;
    netPay: number;
    takehomePay: number;
  };
  compliance: {
    meetsMinimumWage: boolean;
    minimumWageShortfall: number;
    taxWithholdingRequired: boolean;
  };
}

/**
 * Calculate comprehensive payroll for a Liberian employee
 */
export function calculatePayroll(input: PayrollInput): PayrollBreakdown {
  const config = { ...DEFAULT_LIBERIA_TAX_CONFIG, ...input.config };
  
  // Basic salary and earnings calculations
  const basicSalary = input.grossMonthlySalary;
  const overtime = (input.overtimeHours || 0) * (input.overtimeRate || 0);
  
  const allowances = {
    transport: input.allowances?.transport || 0,
    housing: input.allowances?.housing || 0,
    meals: input.allowances?.meals || 0,
    other: input.allowances?.other || 0,
    total: (input.allowances?.transport || 0) + 
           (input.allowances?.housing || 0) + 
           (input.allowances?.meals || 0) + 
           (input.allowances?.other || 0)
  };
  
  const taxableBenefits = input.taxableBenefits || 0;
  const totalGrossEarnings = basicSalary + overtime + allowances.total + taxableBenefits;
  const annualGrossSalary = totalGrossEarnings * 12;
  
  // Pre-tax deductions
  const pretaxDeductions = input.pretaxDeductions || 0;
  const taxableIncome = Math.max(0, totalGrossEarnings - pretaxDeductions);
  const annualTaxableIncome = taxableIncome * 12;
  
  // Income tax calculation (progressive bands)
  const incomeTaxResult = calculateIncomeTax(annualTaxableIncome, config.incomeTaxBands);
  const monthlyIncomeTax = incomeTaxResult.totalAnnualTax / 12;
  
  // NASSCORP calculation (3% of salary up to maximum)
  const nasscorpTaxableAmount = Math.min(taxableIncome, config.nasscorpMaxSalary);
  const monthlyNasscorp = (nasscorpTaxableAmount * config.nasscorpRateEmployee) / 100;
  
  // LPA calculation (1% of taxable income)
  const monthlyLPA = (taxableIncome * config.lpaRate) / 100;
  
  // Loan deductions
  const loanInstallment = input.loanInstallment || 0;
  
  // Total deductions
  const totalDeductions = monthlyIncomeTax + monthlyNasscorp + monthlyLPA + pretaxDeductions + loanInstallment;
  
  // Net pay calculation
  const netPay = totalGrossEarnings - totalDeductions;
  
  // Compliance checks
  const meetsMinimumWage = netPay >= config.minimumWage;
  const minimumWageShortfall = meetsMinimumWage ? 0 : config.minimumWage - netPay;
  
  return {
    employee: {
      id: input.employeeId,
      grossMonthlySalary: basicSalary,
      annualGrossSalary
    },
    earnings: {
      basicSalary,
      overtime,
      allowances,
      taxableBenefits,
      totalGrossEarnings
    },
    deductions: {
      incomeTax: {
        annualTaxableIncome,
        monthlyTaxableIncome: taxableIncome,
        taxBandBreakdown: incomeTaxResult.taxBandBreakdown,
        totalAnnualTax: incomeTaxResult.totalAnnualTax,
        totalMonthlyTax: monthlyIncomeTax
      },
      nasscorp: {
        taxableAmount: nasscorpTaxableAmount,
        rate: config.nasscorpRateEmployee,
        monthlyContribution: monthlyNasscorp,
        annualContribution: monthlyNasscorp * 12
      },
      lpa: {
        taxableAmount: taxableIncome,
        rate: config.lpaRate,
        monthlyContribution: monthlyLPA,
        annualContribution: monthlyLPA * 12
      },
      pretaxDeductions,
      loanInstallment,
      totalDeductions
    },
    summary: {
      totalGrossEarnings,
      totalDeductions,
      netPay,
      takehomePay: netPay
    },
    compliance: {
      meetsMinimumWage,
      minimumWageShortfall,
      taxWithholdingRequired: monthlyIncomeTax > 0
    }
  };
}

/**
 * Calculate progressive income tax using Liberian tax bands
 */
function calculateIncomeTax(annualIncome: number, taxBands: LiberiaTaxConfig['incomeTaxBands']) {
  let totalTax = 0;
  const taxBandBreakdown: Array<{
    band: string;
    taxableAmount: number;
    rate: number;
    tax: number;
  }> = [];
  
  for (const band of taxBands) {
    const bandMin = band.min;
    const bandMax = band.max || Infinity;
    
    if (annualIncome > bandMin) {
      const taxableInThisBand = Math.min(annualIncome, bandMax) - Math.max(bandMin - 1, 0);
      const taxInThisBand = (taxableInThisBand * band.rate) / 100;
      
      if (taxableInThisBand > 0) {
        totalTax += taxInThisBand;
        taxBandBreakdown.push({
          band: `${band.description} (${band.rate}%)`,
          taxableAmount: taxableInThisBand,
          rate: band.rate,
          tax: taxInThisBand
        });
      }
      
      if (annualIncome <= bandMax) break;
    }
  }
  
  return {
    totalAnnualTax: totalTax,
    taxBandBreakdown
  };
}

/**
 * Calculate bulk payroll for multiple employees
 */
export function calculateBulkPayroll(inputs: PayrollInput[]): {
  individual: PayrollBreakdown[];
  totals: {
    totalEmployees: number;
    totalGrossEarnings: number;
    totalDeductions: number;
    totalNetPay: number;
    totalIncomeTax: number;
    totalNasscorp: number;
    totalLPA: number;
    complianceIssues: number;
  };
} {
  const individual = inputs.map(input => calculatePayroll(input));
  
  const totals = individual.reduce((acc, payroll) => ({
    totalEmployees: acc.totalEmployees + 1,
    totalGrossEarnings: acc.totalGrossEarnings + payroll.summary.totalGrossEarnings,
    totalDeductions: acc.totalDeductions + payroll.summary.totalDeductions,
    totalNetPay: acc.totalNetPay + payroll.summary.netPay,
    totalIncomeTax: acc.totalIncomeTax + payroll.deductions.incomeTax.totalMonthlyTax,
    totalNasscorp: acc.totalNasscorp + payroll.deductions.nasscorp.monthlyContribution,
    totalLPA: acc.totalLPA + payroll.deductions.lpa.monthlyContribution,
    complianceIssues: acc.complianceIssues + (payroll.compliance.meetsMinimumWage ? 0 : 1)
  }), {
    totalEmployees: 0,
    totalGrossEarnings: 0,
    totalDeductions: 0,
    totalNetPay: 0,
    totalIncomeTax: 0,
    totalNasscorp: 0,
    totalLPA: 0,
    complianceIssues: 0
  });
  
  return { individual, totals };
}

/**
 * Format currency amount in Liberian Dollars
 */
export function formatLRD(amount: number): string {
  return new Intl.NumberFormat('en-LR', {
    style: 'currency',
    currency: 'LRD',
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Generate payroll summary report
 */
export function generatePayrollReport(payroll: PayrollBreakdown): string {
  return `
=== LIBERIAN PAYROLL SUMMARY ===
Employee ID: ${payroll.employee.id}
Period: ${new Date().toLocaleDateString('en-LR')}

EARNINGS:
  Basic Salary: ${formatLRD(payroll.earnings.basicSalary)}
  Overtime: ${formatLRD(payroll.earnings.overtime)}
  Allowances: ${formatLRD(payroll.earnings.allowances.total)}
  Taxable Benefits: ${formatLRD(payroll.earnings.taxableBenefits)}
  Total Gross: ${formatLRD(payroll.earnings.totalGrossEarnings)}

DEDUCTIONS:
  Income Tax: ${formatLRD(payroll.deductions.incomeTax.totalMonthlyTax)}
  NASSCORP: ${formatLRD(payroll.deductions.nasscorp.monthlyContribution)}
  LPA: ${formatLRD(payroll.deductions.lpa.monthlyContribution)}
  Pre-tax Deductions: ${formatLRD(payroll.deductions.pretaxDeductions)}
  Loan Installment: ${formatLRD(payroll.deductions.loanInstallment)}
  Total Deductions: ${formatLRD(payroll.deductions.totalDeductions)}

NET PAY: ${formatLRD(payroll.summary.netPay)}

COMPLIANCE:
  Minimum Wage: ${payroll.compliance.meetsMinimumWage ? '✓ Compliant' : '✗ Below minimum wage'}
  ${payroll.compliance.minimumWageShortfall > 0 ? `Shortfall: ${formatLRD(payroll.compliance.minimumWageShortfall)}` : ''}
`;
}