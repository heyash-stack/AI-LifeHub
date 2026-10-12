import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';
import { AuthContext } from '../../context/AuthContext';

const renderNavbarWithAuth = (user: any) => {
  return render(
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading: false,
        user,
        login: () => {},
        logout: () => {},
      }}
    >
      <Navbar />
    </AuthContext.Provider>
  );
};

describe('Navbar Component', () => {
  it('renders application brand title', () => {
    renderNavbarWithAuth(null);
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('LifeHub')).toBeInTheDocument();
  });

  it('displays user name and avatar initial when user is logged in', () => {
    renderNavbarWithAuth({ name: 'Alexander Great', email: 'alex@example.com' });
    expect(screen.getByText('Alexander Great')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('falls back to default label when user name is not present', () => {
    renderNavbarWithAuth({ email: 'unknown@example.com' });
    expect(screen.getByText('User')).toBeInTheDocument();
  });
});
