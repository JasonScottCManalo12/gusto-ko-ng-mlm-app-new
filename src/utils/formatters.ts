import { Currency } from '../types/mlm';

const PHP_TO_USD_RATE = 0.0175; // Approx 1 PHP = $0.0175 USD (₱57 = $1)

export const formatMoney = (amountInPHP: number, currency: Currency): string => {
  if (currency === 'USD') {
    const usdVal = amountInPHP * PHP_TO_USD_RATE;
    return `$${usdVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `₱${amountInPHP.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};
