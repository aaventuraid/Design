'use client';

import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  description?: string;
}

export function StatsCard({ title, value, change, changeType = 'neutral', icon, description }: StatsCardProps) {
  const changeColorClass = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-neutral-gray'
  }[changeType];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-gray">{title}</p>
          <p className="text-2xl font-bold text-neutral-dark mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeColorClass}`}>
              {changeType === 'positive' ? '↗️' : changeType === 'negative' ? '↘️' : '➡️'} {change}
            </p>
          )}
          {description && (
            <p className="text-xs text-neutral-gray mt-2">{description}</p>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-primary-orange to-primary-blue rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-dark">{title}</h1>
          {description && (
            <p className="text-neutral-gray mt-1">{description}</p>
          )}
        </div>
        {action && (
          <div>{action}</div>
        )}
      </div>
    </div>
  );
}

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export function Card({ title, description, children, className = '', actions }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {(title || description || actions) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-neutral-dark">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-neutral-gray mt-1">{description}</p>
              )}
            </div>
            {actions && (
              <div>{actions}</div>
            )}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  onClick,
  type = 'button',
  className = ''
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-orange hover:bg-primary-orange/90 text-white focus:ring-primary-orange',
    secondary: 'bg-primary-blue hover:bg-primary-blue/90 text-white focus:ring-primary-blue',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-neutral-gray hover:text-neutral-dark focus:ring-gray-300'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && (
        <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'url';
  required?: boolean;
  disabled?: boolean;
  error?: string;
  help?: string;
  className?: string;
}

export function Input({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = 'text', 
  required = false, 
  disabled = false,
  error,
  help,
  className = ''
}: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-dark mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-colors ${
          error 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 bg-white hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
      {help && !error && (
        <p className="text-sm text-neutral-gray mt-1">{help}</p>
      )}
    </div>
  );
}

interface TextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  help?: string;
  className?: string;
}

export function Textarea({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  rows = 3,
  required = false, 
  disabled = false,
  error,
  help,
  className = ''
}: TextareaProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-dark mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-colors resize-vertical ${
          error 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 bg-white hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
      {help && !error && (
        <p className="text-sm text-neutral-gray mt-1">{help}</p>
      )}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-primary-orange ${sizeClasses[size]} ${className}`} />
  );
}