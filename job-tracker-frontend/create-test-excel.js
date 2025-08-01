import * as XLSX from 'xlsx';

// Create test data
const testData = [
  {
    'Company Name': 'Google',
    'Job Title': 'Software Engineer',
    'Status': 'Applied',
    'Applied Date': '2025-08-01',
    'Location': 'Mountain View, CA',
    'Job URL': 'https://careers.google.com',
    'Resume URL': '',
    'Job Description': 'Build amazing products',
    'Notes': 'Great company'
  },
  {
    'Company Name': 'Apple',
    'Job Title': 'iOS Developer',
    'Status': 'Interviewing',
    'Applied Date': '2025-08-02',
    'Location': 'Cupertino, CA',
    'Job URL': 'https://jobs.apple.com',
    'Resume URL': '',
    'Job Description': 'Create iOS apps',
    'Notes': 'Exciting role'
  },
  {
    'Company Name': 'Microsoft',
    'Job Title': 'Cloud Architect',
    'Status': 'Applied',
    'Applied Date': '2025-08-03',
    'Location': 'Seattle, WA',
    'Job URL': 'https://careers.microsoft.com',
    'Resume URL': '',
    'Job Description': 'Design cloud solutions',
    'Notes': 'Interesting tech'
  }
];

// Create workbook and worksheet
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(testData);

// Set column widths
const colWidths = [
  { wch: 20 }, // Company Name
  { wch: 25 }, // Job Title
  { wch: 12 }, // Status
  { wch: 12 }, // Applied Date
  { wch: 15 }, // Location
  { wch: 40 }, // Job URL
  { wch: 50 }, // Resume URL
  { wch: 30 }, // Job Description
  { wch: 30 }  // Notes
];
ws['!cols'] = colWidths;

// Add worksheet to workbook
XLSX.utils.book_append_sheet(wb, ws, 'Test Data');

// Save the file
XLSX.writeFile(wb, 'test_import.xlsx');

console.log('✅ Test Excel file created: test_import.xlsx');
console.log('📋 File contains 3 sample jobs for testing');
console.log('📝 You can now use this file to test the import functionality'); 