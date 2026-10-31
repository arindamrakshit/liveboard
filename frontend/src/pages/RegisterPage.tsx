import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Kanban, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import styles from './LoginPage.module.css'; // Shared form styling

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register, isRegistering } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!username.trim()) newErrors.username = 'Username is required';
    else if (username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    register({
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
    });
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
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>Start collaborating with your team in real time</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Full Name"
            placeholder="Alice Johnson"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors({ ...errors, fullName: undefined });
            }}
            error={errors.fullName}
            autoFocus
          />

          <Input
            label="Username"
            placeholder="alice"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors({ ...errors, username: undefined });
            }}
            error={errors.username}
          />

          <Input
            label="Email"
            type="email"
            placeholder="alice@liveboard.dev"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            error={errors.email}
          />

          <Input
            label="Password (min 8 characters)"
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
            loading={isRegistering}
            rightIcon={<ArrowRight size={18} />}
          >
            Create Account
          </Button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
