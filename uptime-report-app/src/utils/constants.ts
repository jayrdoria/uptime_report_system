// Constants for monitored sites

// CRITICAL File Sites - these monitors appear in Critical reports
export const CRITICAL_SITES = [
  'Stakes777.com',
  'Stakes',
  'x7casino',
  'X7casino2.com',
];

// DOWN File Sites - these monitors appear in Down reports
export const DOWN_SITES = [
  'RBM-stakes.com',
];

// All monitored sites combined
export const ALL_SITES = [...CRITICAL_SITES, ...DOWN_SITES];

// Total number of monitors
export const TOTAL_MONITORS = ALL_SITES.length;
