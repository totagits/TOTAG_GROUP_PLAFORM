import { storage } from "./storage";

export async function seedHRMISData() {
  console.log("Seeding HRMIS data...");

  try {
    // Sample employees
    const sampleEmployees = [
      {
        employeeId: "TGM001",
        firstName: "John",
        lastName: "Karngar",
        email: "john.karngar@tgm.totag.com",
        phone: "+231 77 123 4567",
        department: "Management",
        position: "General Manager",
        jobTitle: "General Manager",
        employmentType: "full_time" as const,
        employmentStatus: "active" as const,
        startDate: new Date("2023-01-15"),
        baseSalary: "5000.00",
        address: "Monrovia, Liberia",
        emergencyContact: "+231 77 987 6543",
        bankAccount: "LRD-001-2345678",
        taxId: "TAX-TGM-001"
      },
      {
        employeeId: "TGM002", 
        firstName: "Mary",
        lastName: "Johnson",
        email: "mary.johnson@tgm.totag.com",
        phone: "+231 77 234 5678",
        department: "HR",
        position: "HR Manager",
        jobTitle: "Human Resources Manager",
        employmentType: "full_time" as const,
        employmentStatus: "active" as const,
        startDate: new Date("2023-02-01"),
        baseSalary: "3500.00",
        managerId: 1,
        address: "Paynesville, Liberia",
        emergencyContact: "+231 77 876 5432",
        bankAccount: "LRD-002-3456789",
        taxId: "TAX-TGM-002"
      },
      {
        employeeId: "TGM003",
        firstName: "David",
        lastName: "Williams", 
        email: "david.williams@tgm.totag.com",
        phone: "+231 77 345 6789",
        department: "Warehouse",
        position: "Warehouse Supervisor",
        jobTitle: "Warehouse Operations Supervisor",
        employmentType: "full_time" as const,
        employmentStatus: "active" as const,
        startDate: new Date("2023-03-01"),
        baseSalary: "2800.00",
        managerId: 1,
        address: "Sinkor, Liberia",
        emergencyContact: "+231 77 765 4321",
        bankAccount: "LRD-003-4567890",
        taxId: "TAX-TGM-003"
      },
      {
        employeeId: "TGM004",
        firstName: "Sarah",
        lastName: "Davis",
        email: "sarah.davis@tgm.totag.com", 
        phone: "+231 77 456 7890",
        department: "Sales",
        position: "Sales Representative",
        jobTitle: "Senior Sales Representative",
        employmentType: "full_time" as const,
        employmentStatus: "active" as const,
        startDate: new Date("2023-04-15"),
        baseSalary: "2200.00",
        managerId: 1,
        address: "Congo Town, Liberia",
        emergencyContact: "+231 77 654 3210",
        bankAccount: "LRD-004-5678901",
        taxId: "TAX-TGM-004"
      },
      {
        employeeId: "TGM005",
        firstName: "Michael",
        lastName: "Brown",
        email: "michael.brown@tgm.totag.com",
        phone: "+231 77 567 8901",
        department: "Delivery",
        position: "Delivery Driver",
        jobTitle: "Senior Delivery Driver",
        employmentType: "full_time" as const,
        employmentStatus: "active" as const,
        startDate: new Date("2023-05-01"),
        baseSalary: "1800.00",
        managerId: 3,
        address: "New Kru Town, Liberia",
        emergencyContact: "+231 77 543 2109",
        bankAccount: "LRD-005-6789012",
        taxId: "TAX-TGM-005"
      }
    ];

    // Create employees
    for (const employeeData of sampleEmployees) {
      try {
        await storage.createEmployee(employeeData);
        console.log(`Created employee: ${employeeData.firstName} ${employeeData.lastName}`);
      } catch (error) {
        console.log(`Employee already exists: ${employeeData.firstName} ${employeeData.lastName}`);
      }
    }

    // Sample attendance records for current month
    const currentDate = new Date();
    const attendanceRecords = [];
    
    for (let i = 1; i <= 5; i++) { // For each employee
      for (let day = 1; day <= 20; day++) { // 20 working days
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
          attendanceRecords.push({
            employeeId: i,
            date: date,
            clockIn: new Date(`${date.toISOString().split('T')[0]}T08:00:00`),
            clockOut: new Date(`${date.toISOString().split('T')[0]}T17:00:00`),
            hoursWorked: "8.0",
            status: "present" as const,
            location: "TGM Main Office"
          });
        }
      }
    }

    // Create attendance records
    for (const attendanceData of attendanceRecords.slice(0, 10)) { // Limit to 10 for demo
      try {
        await storage.createAttendance(attendanceData);
        console.log(`Created attendance record for employee ${attendanceData.employeeId}`);
      } catch (error) {
        console.log(`Attendance record already exists`);
      }
    }

    // Sample leave requests
    const leaveRequests = [
      {
        employeeId: 2,
        leaveType: "annual_leave",
        startDate: new Date("2025-02-15"),
        endDate: new Date("2025-02-19"),
        totalDays: 5,
        reason: "Family vacation",
        status: "pending" as const,
        appliedDate: new Date()
      },
      {
        employeeId: 4,
        leaveType: "sick_leave", 
        startDate: new Date("2025-01-20"),
        endDate: new Date("2025-01-22"),
        totalDays: 3,
        reason: "Medical treatment",
        status: "approved" as const,
        appliedDate: new Date("2025-01-18")
      }
    ];

    // Create leave requests
    for (const leaveData of leaveRequests) {
      try {
        await storage.createLeaveRequest(leaveData);
        console.log(`Created leave request for employee ${leaveData.employeeId}`);
      } catch (error) {
        console.log(`Leave request already exists`);
      }
    }

    // Sample payroll records
    const payrollRecords = [
      {
        employeeId: 1,
        payPeriodStart: new Date("2025-01-01"),
        payPeriodEnd: new Date("2025-01-31"),
        baseSalary: "5000.00",
        overtime: "0.00",
        allowances: "500.00",
        grossPay: "5500.00",
        taxDeduction: "825.00",
        socialSecurity: "275.00",
        totalDeductions: "1100.00",
        netPay: "4400.00",
        status: "processed" as const,
        paymentDate: new Date("2025-02-01")
      },
      {
        employeeId: 2,
        payPeriodStart: new Date("2025-01-01"),
        payPeriodEnd: new Date("2025-01-31"),
        baseSalary: "3500.00",
        overtime: "0.00",
        allowances: "350.00", 
        grossPay: "3850.00",
        taxDeduction: "577.50",
        socialSecurity: "192.50",
        totalDeductions: "770.00",
        netPay: "3080.00",
        status: "processed" as const,
        paymentDate: new Date("2025-02-01")
      }
    ];

    // Create payroll records
    for (const payrollData of payrollRecords) {
      try {
        await storage.createPayroll(payrollData);
        console.log(`Created payroll record for employee ${payrollData.employeeId}`);
      } catch (error) {
        console.log(`Payroll record already exists`);
      }
    }

    // Sample performance reviews
    const performanceReviews = [
      {
        employeeId: 2,
        reviewerId: 1,
        reviewPeriod: "2024-Q4",
        overallRating: 4,
        status: "completed" as const,
        reviewDate: new Date("2025-01-15"),
        goals: "Improve HR processes, implement new training programs",
        achievements: "Successfully onboarded 3 new employees, reduced hiring time by 25%",
        areasForImprovement: "Communication with remote teams",
        reviewerComments: "Excellent performance, showing strong leadership in HR initiatives"
      },
      {
        employeeId: 4,
        reviewerId: 1,
        reviewPeriod: "2024-Q4",
        overallRating: 4,
        status: "completed" as const,
        reviewDate: new Date("2025-01-20"),
        goals: "Increase sales targets, develop new client relationships", 
        achievements: "Exceeded sales targets by 15%, acquired 5 new major clients",
        areasForImprovement: "Product knowledge in new categories",
        reviewerComments: "Outstanding sales performance, consistent results"
      }
    ];

    // Create performance reviews
    for (const reviewData of performanceReviews) {
      try {
        await storage.createPerformanceReview(reviewData);
        console.log(`Created performance review for employee ${reviewData.employeeId}`);
      } catch (error) {
        console.log(`Performance review already exists`);
      }
    }

    console.log("HRMIS data seeding completed!");
    
  } catch (error) {
    console.error("Error seeding HRMIS data:", error);
  }
}