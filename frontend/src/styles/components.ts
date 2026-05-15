import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' }>`
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: var(--secondary);
          color: white;
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: var(--primary);
          border: 2px solid var(--primary);
        `;
      default:
        return `
          background-color: var(--primary);
          color: white;
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 10px 24px;
    font-size: 14px;
  }
`;

export const Card = styled.div`
  background: var(--bg-white);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-sm);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const Grid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 3}, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Badge = styled.span<{ variant?: 'success' | 'error' | 'warning' }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  
  ${props => {
    switch (props.variant) {
      case 'error':
        return `
          background-color: #FFE5E5;
          color: var(--error);
        `;
      case 'warning':
        return `
          background-color: #FFF4E5;
          color: var(--accent);
        `;
      default:
        return `
          background-color: #E5F9F0;
          color: var(--success);
        `;
    }
  }}
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }

  &::placeholder {
    color: #B0B0B0;
  }
`;

export const ErrorMessage = styled.span`
  color: var(--error);
  font-size: 14px;
  margin-top: 4px;
  display: block;
`;

export const LoadingSpinner = styled.div`
  border: 3px solid var(--border);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
`;
