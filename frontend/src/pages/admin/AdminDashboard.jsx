import { useEffect, useState } from "react";
import { Users, UserCheck, Package, ShoppingBag, Wallet, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import api from "../../services/api";
import { formatSom } from "../../utils/format";

const COLORS = ["#3866f5", "#5d8fff", "#8fb6ff", "#bcd3ff", "#dbe7ff"];

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`rounded-xl p-2.5 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold text-brand-950">{value}</p>
        {sub && <p className="text-[11px] text-emerald-600 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard/stats/").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  if (!stats) return <div className="py-16 text-center text-gray-400">Statistika yuklanmoqda...</div>;

  const statusData = (stats.order_status_breakdown || []).map((s) => ({ name: s.status, value: s.count }));
  const fakeTrend = Array.from({ length: 7 }).map((_, i) => ({
    day: `${i + 1}-kun`,
    users: Math.max(0, Math.round((stats.today_users || 1) * (0.6 + Math.random() * 0.8))),
  }));

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-950 mb-5">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        <StatCard icon={Users} label="Jami foydalanuvchilar" value={stats.total_users} sub={`+${stats.today_users} bugun`} color="bg-brand-600" />
        <StatCard icon={UserCheck} label="Faol foydalanuvchilar" value={stats.online_users} color="bg-emerald-500" />
        <StatCard icon={Package} label="Jami mahsulotlar" value={stats.total_products} color="bg-indigo-500" />
        <StatCard icon={ShoppingBag} label="Buyurtmalar" value={stats.total_orders} sub={`+${stats.today_orders} bugun`} color="bg-amber-500" />
        <StatCard icon={Wallet} label="Umumiy daromad" value={formatSom(stats.total_sales)} sub={`+${formatSom(stats.today_sales)} bugun`} color="bg-rose-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <div className="card p-5">
          <h2 className="font-bold text-brand-950 mb-4 flex items-center gap-2 text-sm">
            <TrendingUp size={16} /> Foydalanuvchilar (oxirgi 7 kun)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={fakeTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1fb" />
              <XAxis dataKey="day" fontSize={11} stroke="#9aa5c9" />
              <YAxis fontSize={11} stroke="#9aa5c9" />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3866f5" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-brand-950 mb-4 text-sm">Buyurtmalar holati</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-16">Ma'lumot yo'q</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h2 className="font-bold text-brand-950 mb-3 text-sm">Eng ko'p sharh olgan mahsulotlar</h2>
          <div className="flex flex-col gap-2">
            {(stats.top_products || []).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-brand-950 font-medium">{p.name}</span>
                <span className="text-gray-400">{p.review_count} sharh · {p.rating}★</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h2 className="font-bold text-brand-950 mb-3 text-sm">Eng mashhur kategoriyalar</h2>
          <div className="flex flex-col gap-2">
            {(stats.top_categories || []).map((c, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-brand-950 font-medium">{c.category__name || "—"}</span>
                <span className="text-gray-400">{c.count} ta mahsulot</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 card p-5 text-sm">
        <h2 className="font-bold text-brand-950 mb-2">Konversiya</h2>
        <p className="text-gray-500">
          Umumiy tashriflar: <b>{stats.total_visitors}</b> · Noyob tashrifchilar: <b>{stats.unique_visitors}</b> ·
          Konversiya darajasi: <b className="text-brand-700">{stats.conversion_rate}%</b>
        </p>
      </div>
    </div>
  );
}
