import './StatsBar.css';
import { useSelector } from 'react-redux';
import { selectTaskStats } from '../../features/tasks/tasksSelectors';

export default function StatsBar() {
  const { total, pending, completed } = useSelector(selectTaskStats);

  return (
    <div className="stats-bar app-container">
      <StatCard label="Total Tasks" value={total} variant="default" />
      <StatCard label="Pending" value={pending} variant="pending" />
      <StatCard label="Completed" value={completed} variant="completed" />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  variant: 'default' | 'pending' | 'completed';
}

function StatCard({ label, value, variant }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
}