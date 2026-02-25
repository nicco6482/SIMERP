// ============================================================
// Dashboard Module v2 — Redesigned for new design system
// ============================================================
const DashboardModule = {
  chartInstances: [],

  render() {
    const k = ERP_DATA.kpis;
    const kpiList = [
      { key: 'revenue', val: k.revenue.value, prev: k.revenue.prev, label: 'Ingresos Totales', unit: '€', prefix: '€', color: 'var(--blue)', icon: 'trending-up' },
      { key: 'orders', val: k.orders.value, prev: k.orders.prev, label: 'Pedidos Activos', unit: '', prefix: '', color: 'var(--green)', icon: 'package' },
      { key: 'stock', val: k.stock.value, prev: k.stock.prev, label: 'Alertas Stock', unit: '', prefix: '', color: 'var(--amber)', icon: 'alert-triangle' },
      { key: 'employees', val: k.employees.value, prev: k.employees.prev, label: 'Empleados', unit: '', prefix: '', color: 'var(--purple)', icon: 'users' },
    ];

    const kpiCards = kpiList.map((kpi, i) => {
      const delta = ((kpi.val - kpi.prev) / kpi.prev * 100).toFixed(1);
      const up = delta >= 0;
      const isNegGood = kpi.key === 'stock';
      const positive = isNegGood ? !up : up;
      return `
        <div class="card stat-box animate-in ripple-container" style="animation-delay:${i * .06}s;cursor:pointer"
          onclick="addRipple(this,event);navigate('${kpi.key === 'revenue' ? 'accounting' : kpi.key === 'orders' ? 'purchasing' : kpi.key === 'stock' ? 'inventory' : 'hr'}')">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
            <div style="width:34px;height:34px;border-radius:var(--r-md);background:${kpi.color}18;display:flex;align-items:center;justify-content:center;color:${kpi.color}">
              <i data-lucide="${kpi.icon}" style="width:16px;height:16px"></i>
            </div>
            <span class="metric-chip ${positive ? 'up' : 'down'}">${up ? '▲' : '▼'} ${Math.abs(delta)}%</span>
          </div>
          <div class="stat-value" style="color:${kpi.color}" data-counter="${kpi.key}">${kpi.prefix}${kpi.val.toLocaleString('es-ES')}</div>
          <div class="stat-label">${kpi.label}</div>
        </div>`;
    }).join('');

    const alertRows = ERP_DATA.recentAlerts.map(a => `
      <div class="alert-item" style="cursor:pointer" onclick="navigate('${a.type === 'stock' ? 'inventory' : a.type === 'order' ? 'purchasing' : a.type === 'finance' ? 'accounting' : a.type === 'hr' ? 'hr' : 'dashboard'}')">
        <div class="alert-dot ${a.sev === 'high' ? 'high' : a.sev === 'med' ? 'med' : a.sev === 'low' ? 'low' : 'ok'}"></div>
        <div style="flex:1;min-width:0">
          <div style="font-size:.8rem;color:var(--text-primary);line-height:1.4">${a.msg}</div>
          <div style="font-size:.7rem;color:var(--text-muted);margin-top:2px">${a.time}</div>
        </div>
        <i data-lucide="chevron-right" style="width:13px;height:13px;color:var(--text-muted);flex-shrink:0"></i>
      </div>`).join('');

    return `
      <div class="page-header">
        <div>
          <div class="page-title">Dashboard</div>
          <div class="page-subtitle">Resumen ejecutivo · 25 Febrero 2026, 23:45</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-glass" onclick="showToast('Informe exportado','download','var(--blue)')"><i data-lucide="download" style="width:13px;height:13px"></i> Exportar</button>
          <button class="btn btn-primary" onclick="openNotificationsPanel()"><i data-lucide="bell" style="width:13px;height:13px"></i> Alertas <span style="background:rgba(248,113,113,.25);padding:1px 6px;border-radius:8px;font-size:.68rem;font-weight:700">${ERP_DATA.notifications.filter(n => !n.read).length}</span></button>
        </div>
      </div>

      <div class="stats-row">${kpiCards}</div>

      <div class="charts-grid animate-in" style="animation-delay:.1s">
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="trending-up" style="width:15px;height:15px;color:var(--blue)"></i> Evolución de Ingresos</div>
            <span class="metric-chip up">▲ 10.4%</span>
          </div>
          <div class="card-body"><div class="chart-container"><canvas id="revChart"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="pie-chart" style="width:15px;height:15px;color:var(--purple)"></i> Composición Inventario</div>
          </div>
          <div class="card-body"><div class="chart-container"><canvas id="invChart"></canvas></div></div>
        </div>
      </div>

      <div class="charts-grid animate-in" style="animation-delay:.18s">
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="bell" style="width:15px;height:15px;color:var(--amber)"></i> Alertas Recientes</div>
            <button class="btn btn-glass" style="padding:4px 10px;font-size:.72rem" onclick="openNotificationsPanel()">Ver todas</button>
          </div>
          <div class="card-body">${alertRows}</div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title"><i data-lucide="zap" style="width:15px;height:15px;color:var(--cyan)"></i> Accesos Rápidos</div>
          </div>
          <div class="card-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
              ${[['inventory', 'package', 'Inventario', 'var(--green)'], ['crm', 'users', 'CRM', 'var(--blue)'],
      ['accounting', 'receipt', 'Contabilidad', 'var(--amber)'], ['hr', 'briefcase', 'RRHH', 'var(--purple)'],
      ['production', 'cpu', 'Producción', 'var(--cyan)'], ['analytics', 'bar-chart-2', 'Analytics', 'var(--accent)'],
      ].map(([mod, icon, label, color]) => `
                <div onclick="navigate('${mod}')" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--r-md);border:1px solid var(--border-subtle);cursor:pointer;transition:all .15s;background:var(--bg-overlay)"
                  onmouseover="this.style.borderColor='${color}44';this.style.background='${color}0a'" onmouseout="this.style.borderColor='var(--border-subtle)';this.style.background='var(--bg-overlay)'">
                  <div style="width:28px;height:28px;border-radius:var(--r-md);background:${color}18;display:flex;align-items:center;justify-content:center;color:${color};flex-shrink:0">
                    <i data-lucide="${icon}" style="width:13px;height:13px"></i>
                  </div>
                  <span style="font-size:.78rem;font-weight:500;color:var(--text-primary)">${label}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>`;
  },

  afterRender() {
    // Animate KPI counters
    const k = ERP_DATA.kpis;
    const map = [
      ['revenue', k.revenue.value, '€', ''],
      ['orders', k.orders.value, '', ''],
      ['stock', k.stock.value, '', ''],
      ['employees', k.employees.value, '', ''],
    ];
    map.forEach(([key, val, pre, suf]) => {
      const el = document.querySelector(`[data-counter="${key}"]`);
      if (el) animateCounter(el, val, pre, suf);
    });

    // Revenue chart
    const revCtx = document.getElementById('revChart');
    if (revCtx) {
      const d = ERP_DATA.revenueChart;
      this.chartInstances.push(new Chart(revCtx, {
        type: 'line',
        data: {
          labels: d.labels,
          datasets: [{
            label: 'Ingresos',
            data: d.data,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56,189,248,.07)',
            fill: true, tension: .45, pointRadius: 4,
            pointBackgroundColor: '#38bdf8', pointBorderColor: 'var(--bg-elevated)',
            pointBorderWidth: 2, borderWidth: 2.5,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#475569' } },
            y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#475569', callback: v => '€' + (v / 1e6).toFixed(1) + 'M' } },
          },
        }
      }));
    }

    // Inventory donut
    const invCtx = document.getElementById('invChart');
    if (invCtx) {
      const d = ERP_DATA.inventoryChart;
      this.chartInstances.push(new Chart(invCtx, {
        type: 'doughnut',
        data: { labels: d.labels, datasets: [{ data: d.data, backgroundColor: d.colors, borderWidth: 0, hoverOffset: 6 }] },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '68%',
          plugins: { legend: { position: 'right', labels: { color: '#94a3b8', padding: 14, font: { size: 11 }, usePointStyle: true } } },
          onClick: (_, el) => el.length && showToast(`Categoría: ${d.labels[el[0].index]} — ${d.data[el[0].index]}%`, 'pie-chart', d.colors[el[0].index]),
        }
      }));
    }
    if (window.lucide) lucide.createIcons();
  },
  destroyCharts() { this.chartInstances.forEach(c => c.destroy()); this.chartInstances = []; }
};
