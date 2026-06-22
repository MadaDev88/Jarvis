import { Link } from 'react-router-dom'
import Panel from '../Panel'
import { ListTodo, ChevronRight } from 'lucide-react'

const priorityColors = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--text-dim)' }
const statusLabels = { 'todo': 'To Do', 'in-progress': 'In Progress', 'completed': 'Done' }

export default function TasksSummary({ tasks }) {
  const active = tasks.filter(t => t.status !== 'completed').slice(0, 5)

  return (
    <Panel
      title="Active Tasks"
      icon={ListTodo}
      action={
        <Link to="/tasks" style={styles.viewAll}>
          View All <ChevronRight size={14} />
        </Link>
      }
    >
      <div style={styles.list}>
        {active.map(task => (
          <div key={task.id} style={styles.item}>
            <div style={{ ...styles.priority, background: priorityColors[task.priority] }} />
            <div style={styles.info}>
              <div style={styles.taskTitle}>{task.title}</div>
              <div style={styles.meta}>
                <span style={styles.category}>{task.category}</span>
                <span style={styles.status}>{statusLabels[task.status]}</span>
              </div>
            </div>
            {task.progress > 0 && (
              <div style={styles.progressWrap}>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${task.progress}%` }} />
                </div>
                <span style={styles.progressText}>{task.progress}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Panel>
  )
}

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '10px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border)',
  },
  priority: {
    width: 4,
    height: 36,
    borderRadius: 2,
    flexShrink: 0,
  },
  info: { flex: 1, minWidth: 0 },
  taskTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-bright)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    display: 'flex',
    gap: '10px',
    marginTop: '4px',
    fontSize: '12px',
    color: 'var(--text-dim)',
  },
  category: {
    padding: '1px 8px',
    borderRadius: '4px',
    background: 'var(--primary-dim)',
    color: 'var(--primary)',
    fontSize: '11px',
  },
  status: { fontSize: '11px' },
  progressWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  progressBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    background: 'var(--border)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    background: 'var(--primary)',
    transition: 'width 0.3s',
  },
  progressText: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-mono)',
  },
  viewAll: {
    fontSize: '12px',
    color: 'var(--primary)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
}
