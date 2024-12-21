import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReactTermo from './ReactTermo';

describe('ReactTermo', () => {
  it('renders without crashing', () => {
    render(<ReactTermo />);
    // The terminal container should be in the document
    expect(screen.getByTestId('termo-container')).toBeInTheDocument();
  });

  it('calls onReady when terminal is initialized', () => {
    const onReady = vi.fn();
    render(<ReactTermo onReady={onReady} />);
    
    // Check if onReady was called
    expect(onReady).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const className = 'custom-termo';
    render(<ReactTermo className={className} />);
    
    expect(screen.getByTestId('termo-container')).toHaveClass(className);
  });
});
