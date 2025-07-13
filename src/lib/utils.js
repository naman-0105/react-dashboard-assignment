import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format large numbers with commas
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format date for display
export function formatDate(dateString) {
  const date = new Date(dateString);
  
  // For dates more than 1 year ago
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  if (date <= oneYearAgo) {
    return '1 year ago';
  }
  
  // For dates more than 6 months ago
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  if (date <= sixMonthsAgo) {
    return '6 months ago';
  }
  
  // For recent dates, return the actual date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Generate user ID - simplified for demo
export function generateUserId() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}