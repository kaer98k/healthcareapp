import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', style }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`} style={style}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', style }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`} style={style}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardProps> = ({ children, className = '', style }) => {
  return (
    <h3 className={`text-lg font-semibold ${className}`} style={style}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<CardProps> = ({ children, className = '', style }) => {
  return (
    <p className={`text-sm mt-1 ${className}`} style={style}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '', style }) => {
  return (
    <div className={`px-6 py-4 ${className}`} style={style}>
      {children}
    </div>
  );
};
