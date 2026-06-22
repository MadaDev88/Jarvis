import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'jarvis-store'

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const defaultState = {
  settings: {
    elevenLabsKey: '',
    elevenLabsVoiceId: '',
    weatherApiKey: '',
    weatherCity: 'Sunderland',
    cryptoCoins: ['bitcoin', 'ethereum', 'solana'],
    userName: 'Adam',
  },
  restaurant: {
    reservations: [
      { id: 1, name: 'Thompson', guests: 4, time: '18:30', date: '2026-06-22', status: 'confirmed', notes: 'Anniversary dinner' },
      { id: 2, name: 'Williams', guests: 2, time: '19:00', date: '2026-06-22', status: 'confirmed', notes: '' },
      { id: 3, name: 'Patel', guests: 6, time: '19:30', date: '2026-06-22', status: 'pending', notes: 'Birthday celebration' },
      { id: 4, name: 'Johnson', guests: 3, time: '20:00', date: '2026-06-22', status: 'confirmed', notes: 'Vegetarian menu' },
      { id: 5, name: 'Brown', guests: 2, time: '20:30', date: '2026-06-23', status: 'pending', notes: '' },
      { id: 6, name: 'Taylor', guests: 8, time: '18:00', date: '2026-06-23', status: 'confirmed', notes: 'Corporate dinner' },
    ],
    staff: [
      { id: 1, name: 'Sarah Mitchell', role: 'Head Chef', status: 'on-shift', phone: '07700 900001' },
      { id: 2, name: 'James Cooper', role: 'Sous Chef', status: 'on-shift', phone: '07700 900002' },
      { id: 3, name: 'Emily Watson', role: 'Front of House Manager', status: 'on-shift', phone: '07700 900003' },
      { id: 4, name: 'Michael Harris', role: 'Waiter', status: 'off-shift', phone: '07700 900004' },
      { id: 5, name: 'Lisa Chen', role: 'Waiter', status: 'on-shift', phone: '07700 900005' },
      { id: 6, name: 'Tom Bradley', role: 'Bartender', status: 'on-shift', phone: '07700 900006' },
      { id: 7, name: 'Rachel Green', role: 'Kitchen Porter', status: 'off-shift', phone: '07700 900007' },
    ],
    inventory: [
      { id: 1, item: 'Fresh Salmon', category: 'Fish', quantity: 12, unit: 'kg', minStock: 5, status: 'good' },
      { id: 2, item: 'Ribeye Steak', category: 'Meat', quantity: 8, unit: 'kg', minStock: 10, status: 'low' },
      { id: 3, item: 'House Red Wine', category: 'Beverage', quantity: 24, unit: 'bottles', minStock: 12, status: 'good' },
      { id: 4, item: 'Prosecco', category: 'Beverage', quantity: 6, unit: 'bottles', minStock: 10, status: 'low' },
      { id: 5, item: 'Mixed Salad Leaves', category: 'Produce', quantity: 4, unit: 'kg', minStock: 3, status: 'good' },
      { id: 6, item: 'Sourdough Bread', category: 'Bakery', quantity: 2, unit: 'loaves', minStock: 8, status: 'critical' },
      { id: 7, item: 'Olive Oil', category: 'Pantry', quantity: 5, unit: 'litres', minStock: 3, status: 'good' },
      { id: 8, item: 'Double Cream', category: 'Dairy', quantity: 3, unit: 'litres', minStock: 4, status: 'low' },
    ],
  },
  finance: {
    revenue: [
      { month: 'Jan', amount: 42000 },
      { month: 'Feb', amount: 38500 },
      { month: 'Mar', amount: 45200 },
      { month: 'Apr', amount: 51000 },
      { month: 'May', amount: 48700 },
      { month: 'Jun', amount: 53200 },
    ],
    expenses: [
      { month: 'Jan', amount: 31000 },
      { month: 'Feb', amount: 29500 },
      { month: 'Mar', amount: 32800 },
      { month: 'Apr', amount: 34200 },
      { month: 'May', amount: 33100 },
      { month: 'Jun', amount: 35400 },
    ],
    todayRevenue: 3840,
    todayCovers: 47,
    avgSpendPerHead: 81.70,
    monthTarget: 55000,
    monthActual: 53200,
  },
  tasks: [
    { id: 1, title: 'Finalise AI hardware product concept', category: 'AI Company', priority: 'high', status: 'in-progress', dueDate: '2026-07-01', progress: 65 },
    { id: 2, title: 'Prepare seed funding pitch deck', category: 'AI Company', priority: 'high', status: 'in-progress', dueDate: '2026-07-15', progress: 30 },
    { id: 3, title: 'Summer menu launch at Arches', category: 'Restaurant', priority: 'medium', status: 'completed', dueDate: '2026-06-20', progress: 100 },
    { id: 4, title: 'Update restaurant website with new photos', category: 'Restaurant', priority: 'low', status: 'todo', dueDate: '2026-06-30', progress: 0 },
    { id: 5, title: 'Research crypto DCA strategy', category: 'Finance', priority: 'medium', status: 'in-progress', dueDate: '2026-06-28', progress: 45 },
    { id: 6, title: 'Book family holiday to Portugal', category: 'Family', priority: 'medium', status: 'todo', dueDate: '2026-08-01', progress: 0 },
    { id: 7, title: 'Prototype smart building sensor', category: 'AI Company', priority: 'high', status: 'todo', dueDate: '2026-07-20', progress: 0 },
    { id: 8, title: 'Quarterly business review', category: 'Restaurant', priority: 'high', status: 'todo', dueDate: '2026-06-30', progress: 0 },
  ],
  goals: [
    { id: 1, title: 'Build AI company with billion-pound potential', timeframe: '1 Year', progress: 15, milestones: ['Define product', 'Build prototype', 'Secure seed funding', 'Launch MVP'] },
    { id: 2, title: 'Generate cash flow through Arches', timeframe: '1 Year', progress: 72, milestones: ['Optimise menu', 'Increase covers', 'Reduce food waste', 'Hit £55k/month'] },
    { id: 3, title: 'Build investment portfolio', timeframe: '5 Year', progress: 25, milestones: ['Crypto allocation', 'Property research', 'Stocks ISA', 'Gold holdings'] },
    { id: 4, title: 'Own homes in UK and Portugal', timeframe: '5 Year', progress: 10, milestones: ['Research Quinta do Lago', 'Savings target', 'Mortgage pre-approval', 'Property viewings'] },
  ],
  messages: [],
}

export function useStore() {
  const [state, setState] = useState(() => {
    const saved = loadState()
    if (saved) {
      return { ...defaultState, ...saved, settings: { ...defaultState.settings, ...saved.settings } }
    }
    return defaultState
  })

  useEffect(() => {
    const toSave = { ...state }
    delete toSave.messages
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }, [state])

  const updateSettings = useCallback((updates) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, ...updates } }))
  }, [])

  const addMessage = useCallback((sender, text) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, { sender, text, time: new Date().toISOString() }],
    }))
  }, [])

  const addReservation = useCallback((reservation) => {
    setState(prev => ({
      ...prev,
      restaurant: {
        ...prev.restaurant,
        reservations: [...prev.restaurant.reservations, { ...reservation, id: Date.now() }],
      },
    }))
  }, [])

  const updateReservation = useCallback((id, updates) => {
    setState(prev => ({
      ...prev,
      restaurant: {
        ...prev.restaurant,
        reservations: prev.restaurant.reservations.map(r => r.id === id ? { ...r, ...updates } : r),
      },
    }))
  }, [])

  const addTask = useCallback((task) => {
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, { ...task, id: Date.now() }],
    }))
  }, [])

  const updateTask = useCallback((id, updates) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
    }))
  }, [])

  const deleteTask = useCallback((id) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
    }))
  }, [])

  return {
    ...state,
    updateSettings,
    addMessage,
    addReservation,
    updateReservation,
    addTask,
    updateTask,
    deleteTask,
  }
}
