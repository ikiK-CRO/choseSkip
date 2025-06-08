import React from 'react';

const steps = [
  { label: 'Postcode', icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="10" r="3"/><path d="M12 2C7 2 2 6 2 11c0 5.25 7.5 11 10 11s10-5.75 10-11c0-5-5-9-10-9z"/></svg>
  ) },
  { label: 'Waste Type', icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
  ) },
  { label: 'Select Skip', icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="13" height="7" rx="2"/><path d="M16 18v-5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3z"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="17.5" cy="18.5" r="1.5"/></svg>
  ) },
  { label: 'Permit Check', icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3l7 4v5c0 5-3.5 9.74-7 11-3.5-1.26-7-6-7-11V7l7-4z"/></svg>
  ) },
  { label: 'Choose Date', icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>
  ) },
  { label: 'Payment', icon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 10h20"/></svg>
  ) },
];

// Set the current step index (0-based)
const currentStep = 2;

const Breadcrumbs: React.FC = () => (
  <nav className="w-full bg-black py-2 px-2 overflow-x-auto">
    <ol className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 whitespace-nowrap">
      {steps.map((step, idx) => {
        const isFuture = idx > currentStep;
        const isCurrent = idx === currentStep;
        return (
          <li key={step.label} className="flex items-center">
            <div className={`flex items-center gap-1 ${isCurrent ? 'font-semibold' : ''}`}> 
              <span className={`flex items-center justify-center ${isFuture ? 'text-gray-500' : 'text-blue-600'}`}>{step.icon}</span>
              <span className={`ml-1 text-base ${isFuture ? 'text-gray-400' : 'text-white'}`}>{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <span className="mx-2 h-1 w-6 sm:w-8 md:w-12 bg-gradient-to-r from-blue-600/70 to-gray-700/40 rounded-full" style={{ minWidth: 16, height: 2, display: 'inline-block' }} />
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumbs; 