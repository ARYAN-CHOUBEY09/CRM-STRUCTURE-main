import { FaBullseye, FaChartLine, FaUserPlus, FaUsers } from "react-icons/fa";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import "../styles/Dashboard.css";

const Dashboard = ({ customers = [], activities = [] }) => {
  const total = customers.length;
  const activeCount = customers.filter((customer) => customer.status === "Active").length;
  const leadCount = customers.filter((customer) => customer.status === "Lead").length;
  const inactiveCount = customers.filter((customer) => customer.status === "Inactive").length;
  const refundCount = customers.filter((customer) => customer.status === "Refund & Recharge").length;

  const currentRate =
    activeCount + leadCount > 0 ? ((activeCount / (activeCount + leadCount)) * 100).toFixed(1) : 0;

  const pieData = [
    { name: "Active", value: activeCount, color: "#22c55e" },
    { name: "Leads", value: leadCount, color: "#f59e0b" },
    { name: "Inactive", value: inactiveCount, color: "#94a3b8" },
    { name: "Refunds", value: refundCount, color: "#ef4444" },
  ];

  const visiblePieData = pieData.filter((entry) => entry.value > 0);
  const totalCustomers = pieData.reduce((sum, entry) => sum + entry.value, 0);

  const renderTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) {
      return null;
    }

    const item = payload[0];
    const percent = totalCustomers > 0 ? ((item.value / totalCustomers) * 100).toFixed(1) : 0;

    return (
      <div className="chart-tooltip">
        <p>{item.name}</p>
        <strong>{item.value} customers</strong>
        <span>{percent}% of total</span>
      </div>
    );
  };

  return (
    <div className="dashboard-content">
      <h1>Dashboard</h1>
      <p className="subtitle">Overview of your customer base and recent activities.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <p>Total Customers</p>
            <div className="icon-box blue">
              <FaUsers />
            </div>
          </div>
          <h2>{total}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <p>Active Customers</p>
            <div className="icon-box green">
              <FaBullseye />
            </div>
          </div>
          <h2>{activeCount}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <p>New Leads</p>
            <div className="icon-box orange">
              <FaUserPlus />
            </div>
          </div>
          <h2>{leadCount}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <p>Conversion Rate</p>
            <div className="icon-box purple">
              <FaChartLine />
            </div>
          </div>
          <h2>{currentRate}%</h2>
        </div>
      </div>

      <div className="bottom-section">
        <div className="panel large distribution-card">
          <div className="distribution-header">
            <div>
              <h3>Customer Distribution</h3>
              <p>Breakdown by customer status</p>
            </div>
            <div className="distribution-pill">Live overview</div>
          </div>

          <div className="distribution-layout">
            <div className="distribution-chart-shell">
              {totalCustomers > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={visiblePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={82}
                      outerRadius={116}
                      paddingAngle={2}
                      stroke="#ffffff"
                      strokeWidth={6}
                      dataKey="value"
                    >
                      {visiblePieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>

                    <Tooltip content={renderTooltip} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="distribution-empty">
                  <h4>No customer data</h4>
                  <p>Add customers to populate the distribution chart.</p>
                </div>
              )}

              <div className="distribution-center">
                <span className="distribution-center-label">Total</span>
                <strong>{totalCustomers}</strong>
                <span className="distribution-center-subtext">customers</span>
              </div>
            </div>

            <div className="distribution-summary">
              {pieData.map((entry) => {
                const percent = totalCustomers > 0 ? ((entry.value / totalCustomers) * 100).toFixed(1) : "0.0";

                return (
                  <div key={entry.name} className="distribution-summary-card">
                    <div className="distribution-summary-row">
                      <span className="distribution-summary-label">
                        <span className="distribution-summary-dot" style={{ backgroundColor: entry.color }} />
                        {entry.name}
                      </span>
                      <strong>{entry.value}</strong>
                    </div>
                    <div className="distribution-summary-bar">
                      <span style={{ width: `${percent}%`, backgroundColor: entry.color }} />
                    </div>
                    <span className="distribution-summary-meta">{percent}% of total base</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>Recent Activity</h3>

          <ul className="activity-list">
            {activities.slice(0, 5).map((activity) => (
              <li key={activity.id} className="activity-item">
                <div className={`dot ${activity.color}`}></div>

                <p>
                  <strong>{activity.user}</strong> {activity.action} <strong>{activity.target}</strong> -{" "}
                  <span>{activity.time}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
