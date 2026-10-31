import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Kanban, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      newErrors.identifier = 'Email or username is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    login({ email: identifier.trim(), password } as any);
  };

  const handleDemoLogin = (email: string) => {
    setIdentifier(email);
    setPassword('password123');
    login({ email, password: 'password123' } as any);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.brand} onClick={() => navigate('/')}>
          <div className={styles.logoIcon}>
            <Kanban size={22} />
          </div>
          <span className={styles.brandTitle}>LiveBoard</span>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Enter your credentials to access your workspaces</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email or Username"
            type="text"
            placeholder="alice@liveboard.dev or alice"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (errors.identifier) setErrors({ ...errors, identifier: undefined });
            }}
            error={errors.identifier}
            autoFocus
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            error={errors.password}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoggingIn}
            rightIcon={<ArrowRight size={18} />}
          >
            Sign In
          </Button>
        </form>

        {/* Demo Fast Login */}
        <div className={styles.demoSection}>
          <span className={styles.demoTitle}>Quick Demo Sign In:</span>
          <div className={styles.demoButtons}>
            <button
              type="button"
              className={styles.demoPill}
              onClick={() => handleDemoLogin('alice@liveboard.dev')}
            >
              Alice (Owner)
            </button>
            <button
              type="button"
              className={styles.demoPill}
              onClick={() => handleDemoLogin('bob@liveboard.dev')}
            >
              Bob (Admin)
            </button>
            <button
              type="button"
              className={styles.demoPill}
              onClick={() => handleDemoLogin('carol@liveboard.dev')}
            >
              Carol (Member)
            </button>
          </div>
        </div>

        <p className={styles.footerText}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.link}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
