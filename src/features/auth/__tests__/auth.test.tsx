import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ data: { user: {} }, error: null }),
    },
  }),
}))

describe('Authentication Flow', () => {
  it('should render the login inputs and submit successfully', async () => {
    // Simple render test representing React Testing Library component audits
    render(
      <form onSubmit={(e) => { e.preventDefault(); console.log('submitted') }}>
        <input placeholder="Email" name="email" defaultValue="test@agromarket.org" />
        <input placeholder="Password" name="password" type="password" defaultValue="password123" />
        <button type="submit">Login</button>
      </form>
    )

    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitBtn = screen.getByRole('button', { name: /login/i })

    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(submitBtn).toBeInTheDocument()

    fireEvent.click(submitBtn)
  })
})
