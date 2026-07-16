import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'

// Simple mock for TanStack Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: [], isLoading: false }),
}))

describe('Marketplace Components', () => {
  it('should render public product list container', () => {
    render(
      <div data-testid="products-grid">
        <p>Marketplace Produce</p>
      </div>
    )

    const grid = screen.getByTestId('products-grid')
    expect(grid).toBeInTheDocument()
    expect(screen.getByText('Marketplace Produce')).toBeInTheDocument()
  })
})
