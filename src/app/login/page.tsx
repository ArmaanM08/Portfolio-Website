'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function Login() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push('/admin');
            } else {
                const data = await res.json();
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={`card ${styles.loginCard} animate-fade-in-up`}>
                <h1 className="bold-heading gradient-text" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Admin Access</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="password"
                        className="input-field"
                        placeholder="Enter Admin Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" className={`btn ${styles.loginBtn}`} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
