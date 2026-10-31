import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Kanban,
  Zap,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Layers,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './LandingPage.module.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.landing}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <Kanban size={22} />
            </div>
            <span className={styles.brandTitle}>LiveBoard</span>
          </div>
          <div className={styles.navActions}>
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="primary" onClick={() => navigate('/register')}>
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.badgeWrapper}>
            <span className={styles.heroBadge}>
              <Sparkles size={14} /> Real-Time Collaboration 2.0
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            Your team’s work, <span className={styles.gradientText}>synchronized live</span>.
          </h1>

          <p className={styles.heroSubtitle}>
            LiveBoard combines ultra-responsive Kanban boards with WebSockets, optimistic UI updates,
            and offline resilience. Move tasks seamlessly, collaborate with zero delay.
          </p>

          <div className={styles.heroCta}>
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight size={18} />}
            >
              Start Free Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Explore Live Demo
            </Button>
          </div>

          {/* Interactive Preview Mockup */}
          <div className={styles.mockupWrapper}>
            <div className={styles.mockupHeader}>
              <div className={styles.windowDots}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
              <div className={styles.mockupTitle}>LiveBoard Launch — Sprint 4</div>
              <div className={styles.liveIndicator}>
                <span className={styles.ping} />
                <span>3 users active</span>
              </div>
            </div>

            <div className={styles.mockupColumns}>
              <div className={styles.columnMock}>
                <div className={styles.colHeader}>
                  <span>To Do</span>
                  <span className={styles.tag}>3</span>
                </div>
                <div className={styles.taskCardMock}>
                  <div className={styles.taskTag}>Architecture</div>
                  <div className={styles.taskTitle}>Setup WebSocket broker with STOMP</div>
                </div>
                <div className={styles.taskCardMock}>
                  <div className={styles.taskTag}>Security</div>
                  <div className={styles.taskTitle}>Configure JWT refresh token rotation</div>
                </div>
              </div>

              <div className={styles.columnMock}>
                <div className={styles.colHeader}>
                  <span>In Progress</span>
                  <span className={styles.tag}>2</span>
                </div>
                <div className={styles.taskCardMockActive}>
                  <div className={styles.taskTagBlue}>Frontend</div>
                  <div className={styles.taskTitle}>Implement drag-and-drop Kanban board</div>
                  <div className={styles.avatarRow}>
                    <div className={styles.miniAvatar}>AJ</div>
                    <span className={styles.movingNote}>Moving to In Review...</span>
                  </div>
                </div>
              </div>

              <div className={styles.columnMock}>
                <div className={styles.colHeader}>
                  <span>Done</span>
                  <span className={styles.tag}>4</span>
                </div>
                <div className={styles.taskCardMock}>
                  <div className={styles.taskTagGreen}>Database</div>
                  <div className={styles.taskTitle}>Flyway migration V1 & V2 schemas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Engineered for High-Performance Teams</h2>
            <p className={styles.sectionSubtitle}>
              Built with modern frontend architecture patterns that interviewers and tech leads look for.
            </p>
          </div>

          <div className={styles.grid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Zap size={24} />
              </div>
              <h3>Sub-millisecond Real-Time</h3>
              <p>
                STOMP over WebSockets provides instant broadcasts. Any move, edit, or comment
                synchronizes immediately across all peer browsers.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Layers size={24} />
              </div>
              <h3>Offline-First with IndexedDB</h3>
              <p>
                Disconnect anytime. Changes are queued in IndexedDB via Dexie and seamlessly
                synchronized with rollback protection when connectivity returns.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Shield size={24} />
              </div>
              <h3>Role-Based Permissions</h3>
              <p>
                Strict authorization enforced at the database level with Owner, Admin, and Member
                roles protected by Spring Security and JWT.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrand}>
            <Kanban size={18} />
            <span>LiveBoard</span>
          </div>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} LiveBoard. Built with React, TypeScript, Spring Boot, and MySQL.
          </p>
        </div>
      </footer>
    </div>
  );
};
