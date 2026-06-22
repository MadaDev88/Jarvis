import KPICards from '../components/dashboard/KPICards'
import RevenueChart from '../components/dashboard/RevenueChart'
import TasksSummary from '../components/dashboard/TasksSummary'
import ReservationsToday from '../components/dashboard/ReservationsToday'
import GoalsProgress from '../components/dashboard/GoalsProgress'
import QuickCrypto from '../components/dashboard/QuickCrypto'

export default function DashboardPage({ store }) {
  return (
    <div style={styles.page}>
      <KPICards finance={store.finance} restaurant={store.restaurant} />

      <div style={styles.twoCol}>
        <RevenueChart revenue={store.finance.revenue} expenses={store.finance.expenses} />
        <div style={styles.rightStack}>
          <ReservationsToday reservations={store.restaurant.reservations} />
          <QuickCrypto coins={store.settings.cryptoCoins} />
        </div>
      </div>

      <div style={styles.twoCol}>
        <TasksSummary tasks={store.tasks} />
        <GoalsProgress goals={store.goals} />
      </div>
    </div>
  )
}

const styles = {
  page: {
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '20px',
  },
  rightStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
}
