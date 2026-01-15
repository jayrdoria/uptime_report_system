import React, { useState, useCallback } from 'react';
import { copyToClipboard } from '../utils/clipboard';

type CopyButtonVariant = 'critical' | 'down' | 'all';

interface CopyButtonProps {
  text: string;
  variant: CopyButtonVariant;
  disabled?: boolean;
}

const variantStyles: Record<CopyButtonVariant, {
  base: string;
  hover: string;
  copied: string;
  icon: string;
  label: string;
}> = {
  critical: {
    base: 'bg-red-900/50 border-red-700 text-red-300',
    hover: 'hover:bg-red-900/70 hover:border-red-600',
    copied: 'bg-green-900/50 border-green-600 text-green-300',
    icon: '🔴',
    label: 'Copy Critical',
  },
  down: {
    base: 'bg-blue-900/50 border-blue-700 text-blue-300',
    hover: 'hover:bg-blue-900/70 hover:border-blue-600',
    copied: 'bg-green-900/50 border-green-600 text-green-300',
    icon: '🔵',
    label: 'Copy Down',
  },
  all: {
    base: 'bg-purple-900/50 border-purple-700 text-purple-300',
    hover: 'hover:bg-purple-900/70 hover:border-purple-600',
    copied: 'bg-green-900/50 border-green-600 text-green-300',
    icon: '📋',
    label: 'Copy All',
  },
};

const CopyButton: React.FC<CopyButtonProps> = ({ text, variant, disabled = false }) => {
  const [copied, setCopied] = useState(false);
  const styles = variantStyles[variant];

  const handleCopy = useCallback(async () => {
    if (disabled || !text) return;

    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      // Auto-reset after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text, disabled]);

  const buttonClasses = `
    px-4 py-2 rounded-lg border font-medium text-sm
    transition-all duration-200 ease-in-out
    flex items-center gap-2
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${copied ? styles.copied : `${styles.base} ${!disabled ? styles.hover : ''}`}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      onClick={handleCopy}
      disabled={disabled}
      className={buttonClasses}
      title={disabled ? 'No data to copy' : `Copy ${variant} incidents to clipboard`}
    >
      <span>{copied ? '✓' : styles.icon}</span>
      <span>{copied ? 'Copied!' : styles.label}</span>
    </button>
  );
};

export default CopyButton;
