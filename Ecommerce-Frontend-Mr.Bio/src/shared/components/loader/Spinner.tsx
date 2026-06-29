import React from 'react';

type SpinnerSize = 'small' | 'medium' | 'large';
type SpinnerColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  showText?: boolean;
  loadingText?: string;
}

const sizeMap: Record<SpinnerSize, { width: string; height: string; fontSize: string }> = {
  small: { width: '24px', height: '24px', fontSize: '14px' },
  medium: { width: '40px', height: '40px', fontSize: '16px' },
  large: { width: '60px', height: '60px', fontSize: '18px' }
};

const colorMap: Record<SpinnerColor, string> = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#2e7d32',
  warning: '#ed6c02',
  error: '#d32f2f',
  info: '#0288d1'
};

const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  showText = true,
  loadingText = 'Loading...'
}) => {
  const currentSize = sizeMap[size];
  const currentColor = colorMap[color];

  return (
    <div className="spinner-container">
      <style>
        {`
          .spinner-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(5px);
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-top: 4px solid ${currentColor};
            border-radius: 50%;
            width: ${currentSize.width};
            height: ${currentSize.height};
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .spinner-text {
            margin-top: 20px;
            font-size: ${currentSize.fontSize};
            color: ${currentColor};
            font-weight: 500;
            letter-spacing: 0.5px;
          }

          @media (prefers-color-scheme: dark) {
            .spinner-container {
              background: rgba(18, 18, 18, 0.95);
            }
          }
        `}
      </style>
      
      <div className="spinner"></div>
      {showText && (
        <div className="spinner-text">
          {loadingText}
        </div>
      )}
    </div>
  );
};

export default Spinner;