import { useState } from 'react'
import Panel from '../components/Panel'
import { ListTodo, Target, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

const priorities = ['high', 'medium', 'low']
const statuses = ['todo', 'in-progress', 'completed']
const categories = ['AI Company', 'Restaurant', 'Finance', 'Family', 'Personal']
const priorityColors = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--text-dim)' }
const statusLabels = { 'todo': 'To Do', 'in-progress': 'In Progress', 'completed': 'Completed' }

export default function TasksPage({ store }) {
  const [filter, setFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '', category: 'AI Company', priority: 'medium', status: 'todo', dueDate: '', progress: 0,
  })
  const [expandedGoal, setExpandedGoal] = useState(null)

  const filtered = filter === 'all' ? store.tasks : store.tasks.filter(t => t.status === filter)

  function handleAdd(e) {
    e.preventDefault()
    store.addTask(newTask)
    setNewTask({ title: '', category: 'AI Company', priority: 'medium', status: 'todo', dueDate: '', progress: 0 })
    setShowAdd(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.twoCol}>
        <Panel
          title="Tasks"
          icon={ListTodo}
          style={{ flex: 2 }}
          action={
            <button style={styles.addBtn} onClick={() => setShowAdd(!showAdd)}>
              <Plus size={14} /> New Task
            </button>
          }
        >
          {showAdd && (
            <form onSubmit={handleAdd} style={styles.form}>
              <input style={styles.input} placeholder="Task title" required value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
              <select style={styles.select} value={newTask.category} onChange={e => setNewTask({ ...newTask, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select style={styles.select} value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input style={styles.input} type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
              <button type="submit" style={styles.submitBtn}>Add Task</button>
            </form>
          )}

          <div style={styles.filters}>
            {['all', ...statuses].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{ ...styles.filterBtn, ...(filter === s ? styles.filterActive : {}) }}
              >
                {s === 'all' ? 'All' : statusLabels[s]}
                {s !== 'all' && <span style={styles.count}>{store.tasks.filter(t => t.status === s).length}</span>}
              </button>
            ))}
          </div>

          <div style={styles.taskList}>
            {filtered.map(task => (
              <div key={task.id} style={styles.taskItem}>
                <div style={{ ...styles.priorityBar, background: priorityColors[task.priority] }} />
                <div style={styles.taskContent}>
                  <div style={styles.taskHeader}>
                    <div style={{ ...styles.taskTitle, textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                      {task.title}
                    </div>
                    <button style={styles.deleteBtn} onClick={() => store.deleteTask(task.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div style={styles.taskMeta}>
                    <span style={styles.categoryBadge}>{task.category}</span>
                    <select
                      value={task.status}
                      onChange={e => store.updateTask(task.id, {
                        status: e.target.value,
                        progress: e.target.value === 'completed' ? 100 : task.progress,
                      })}
                      style={styles.statusSelect}
                    >
                      {statuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
                    </select>
                    {task.dueDate && <span style={styles.dueDate}>Due: {task.dueDate}</span>}
                  </div>
                  {task.status !== 'completed' && (
                    <div style={styles.progressRow}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={task.progress}
                        onChange={e => store.updateTask(task.id, { progress: parseInt(e.target.value) })}
                        style={styles.slider}
                      />
                      <span style={styles.progressPct}>{task.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Goals" icon={Target} style={{ flex: 1 }}>
          <div style={styles.goalList}>
            {store.goals.map(goal => (
              <div key={goal.id} style={styles.goalItem}>
                <div
                  style={styles.goalHeader}
                  onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                >
                  <div>
                    <div style={styles.goalTitle}>{goal.title}</div>
                    <div style={styles.goalTimeframe}>{goal.timeframe}</div>
                  </div>
                  {expandedGoal === goal.id ? <ChevronUp size={16} color="var(--text-dim)" /> : <ChevronDown size={16} color="var(--text-dim)" />}
                </div>
                <div style={styles.goalBarWrap}>
                  <div style={styles.goalBar}>
                    <div style={{
                      ...styles.goalFill,
                      width: `${goal.progress}%`,
                      background: goal.progress >= 70 ? 'var(--secondary)' : goal.progress >= 30 ? 'var(--primary)' : 'var(--accent)',
                    }} />
                  </div>
                  <span style={styles.goalPct}>{goal.progress}%</span>
                </div>
                {expandedGoal === goal.id && (
                  <div style={styles.milestones}>
                    {goal.milestones.map((m, i) => {
                      const done = i < Math.floor(goal.milestones.length * (goal.progress / 100))
                      return (
                        <div key={i} style={styles.milestone}>
                          <div style={{
                            ...styles.milestoneDot,
                            background: done ? 'var(--secondary)' : 'var(--border)',
                          }} />
                          <span style={{ color: done ? 'var(--text-bright)' : 'var(--text-dim)', fontSize: '13px' }}>{m}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: '24px 32px' },
  twoCol: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
    borderRadius: '8px', border: '1px solid var(--border-glow)',
    background: 'var(--primary-dim)', color: 'var(--primary)',
    cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-body)',
  },
  form: {
    display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '16px',
    background: 'var(--bg-panel)', borderRadius: '10px', marginBottom: '16px',
    border: '1px solid var(--border)',
  },
  input: {
    padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)',
    background: 'var(--bg-dark)', color: 'var(--text)', fontSize: '14px',
    fontFamily: 'var(--font-body)', outline: 'none', flex: '1 1 200px',
  },
  select: {
    padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)',
    background: 'var(--bg-dark)', color: 'var(--text)', fontSize: '14px',
    fontFamily: 'var(--font-body)', outline: 'none', cursor: 'pointer',
  },
  submitBtn: {
    padding: '10px 20px', borderRadius: '8px', border: 'none',
    background: 'var(--primary)', color: 'var(--bg-dark)',
    cursor: 'pointer', fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-body)',
  },
  filters: { display: 'flex', gap: '8px', marginBottom: '16px' },
  filterBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border)',
    background: 'var(--bg-panel)', color: 'var(--text-dim)', cursor: 'pointer',
    fontSize: '13px', fontFamily: 'var(--font-body)',
  },
  filterActive: { color: 'var(--primary)', borderColor: 'var(--border-glow)', background: 'var(--primary-dim)' },
  count: {
    fontSize: '11px', padding: '1px 6px', borderRadius: '4px',
    background: 'var(--bg-dark)', fontFamily: 'var(--font-mono)',
  },
  taskList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  taskItem: {
    display: 'flex', gap: '0', borderRadius: '10px', overflow: 'hidden',
    background: 'var(--bg-panel)', border: '1px solid var(--border)',
  },
  priorityBar: { width: 4, flexShrink: 0 },
  taskContent: { flex: 1, padding: '14px 16px' },
  taskHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  taskTitle: { fontSize: '14px', fontWeight: 600, color: 'var(--text-bright)' },
  deleteBtn: {
    background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer',
    padding: '4px', borderRadius: '4px',
  },
  taskMeta: { display: 'flex', gap: '10px', marginTop: '8px', alignItems: 'center', flexWrap: 'wrap' },
  categoryBadge: {
    padding: '2px 10px', borderRadius: '4px', background: 'var(--primary-dim)',
    color: 'var(--primary)', fontSize: '11px', fontWeight: 600,
  },
  statusSelect: {
    padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border)',
    background: 'var(--bg-dark)', color: 'var(--text)', fontSize: '12px',
    fontFamily: 'var(--font-body)', cursor: 'pointer', outline: 'none',
  },
  dueDate: { fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' },
  progressRow: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' },
  slider: { flex: 1, accentColor: 'var(--primary)' },
  progressPct: { fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', minWidth: 32 },
  goalList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  goalItem: {
    padding: '14px', borderRadius: '10px', background: 'var(--bg-panel)',
    border: '1px solid var(--border)',
  },
  goalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    cursor: 'pointer', marginBottom: '10px',
  },
  goalTitle: { fontSize: '13px', fontWeight: 600, color: 'var(--text-bright)' },
  goalTimeframe: { fontSize: '11px', color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' },
  goalBarWrap: { display: 'flex', alignItems: 'center', gap: '10px' },
  goalBar: { flex: 1, height: 6, borderRadius: 3, background: 'var(--border)' },
  goalFill: { height: '100%', borderRadius: 3, transition: 'width 0.5s ease' },
  goalPct: { fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', minWidth: 30, textAlign: 'right' },
  milestones: { marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' },
  milestone: { display: 'flex', alignItems: 'center', gap: '8px' },
  milestoneDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
}
