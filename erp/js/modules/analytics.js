// ============================================================
// Analytics & BI Module — Multi-chart + AI Insights + LTV
// ============================================================
const AnalyticsModule = {
    chartInstances: [],
    currentView: 'overview',

    render() {
        return `
      <div class="page-header">
        <div>
          <div class="page-title">Analytics & BI</div>
          <div class="page-subtitle">Datos en Tiempo Real · Insights de IA · Customer Intelligence</div>
        </div>
        <button class="btn btn-glass" onclick="showToast('Informe exportado en PDF','download','var(--blue)')"><i data-lucide="download" style="width:14px;height:14px"></i> Exportar</button>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
        ${['overview', 'regions', 'products', 'ltv', 'ai'].map(v => `<button class="btn ${this.currentView === v ? 'btn-primary' : 'btn-glass'}" data-view="${v}" onclick="AnalyticsModule.switchView('${v}')">
          <i data-lucide="${{ overview: 'layout-dashboard', regions: 'globe', products: 'package', ltv: 'users', ai: 'brain' }[v]}" style="width:14px;height:14px"></i>
          ${{ overview: 'Overview', regions: 'Por Región', products: 'Productos', ltv: 'LTV Clientes', ai: 'IA Insights' }[v]}
        </button>`).join('')}
      </div>
      <div id="analytics-panel" class="animate-in"></div>`;
    },

    switchView(view) {
        this.currentView = view;
        document.querySelectorAll('[data-view]').forEach(b => {
            b.className = `btn ${b.dataset.view === view ? 'btn-primary' : 'btn-glass'}`;
        });
        this.destroyCharts();
        const p = document.getElementById('analytics-panel');
        if (!p) return;
        p.className = 'animate-in'; void p.offsetWidth;
        const map = {
            overview: () => this.renderOverview(), regions: () => this.renderRegions(),
            products: () => this.renderProducts(), ltv: () => this.renderLTV(), ai: () => this.renderAI()
        };
        p.innerHTML = (map[view] || map.overview)();
        if (window.lucide) lucide.createIcons();
        const init = { overview: () => this.initOverviewCharts(), regions: () => this.initRegionChart(), products: () => this.initProductChart() };
        if (init[view]) requestAnimationFrame(init[view].bind(this));
    },

    renderOverview() {
        const d = ERP_DATA.bi.monthlyTrend;
        const latest = d.revenue.at(-1), target = d.target.at(-1);
        return `
      <div class="stats-row">
        <div class="card stat-box animate-in"><div class="stat-value" style="color:var(--blue)">€${(latest / 1e6).toFixed(2)}M</div><div class="stat-label">Ingresos Q1-26*</div></div>
        <div class="card stat-box animate-in"><div class="stat-value" style="color:var(--purple)">${((latest / target) * 100).toFixed(1)}%</div><div class="stat-label">vs. Objetivo</div></div>
        <div class="card stat-box animate-in"><div class="stat-value" style="color:var(--green)">+22.4%</div><div class="stat-label">YoY</div></div>
        <div class="card stat-box animate-in"><div class="stat-value" style="color:var(--amber)">€${(ERP_DATA.bi.customerLTV.reduce((a, c) => a + c.ltv, 0) / 1e6).toFixed(1)}M</div><div class="stat-label">LTV Portfolio</div></div>
      </div>
      <div class="card animate-in">
        <div class="card-header"><div class="card-title"><i data-lucide="trending-up" style="width:16px;height:16px;color:var(--blue)"></i> Tendencia de Ingresos — 8 Trimestres</div></div>
        <div class="card-body"><div class="chart-container" style="height:260px"><canvas id="trendChart"></canvas></div></div>
      </div>`;
    },

    renderRegions() {
        const d = ERP_DATA.bi.salesByRegion;
        const max = Math.max(...d.data);
        const bars = d.labels.map((l, i) => `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:4px">
          <span style="color:var(--text-primary)">${l}</span><span style="color:${d.colors[i]};font-weight:700">€${(d.data[i] / 1000).toFixed(0)}K</span>
        </div>
        <div class="stock-bar-wrap"><div class="stock-bar-fill" style="width:${Math.round(d.data[i] / max * 100)}%;background:${d.colors[i]}"></div></div>
      </div>`).join('');
        return `<div class="charts-grid">
      <div class="card animate-in"><div class="card-header"><div class="card-title"><i data-lucide="globe" style="width:16px;height:16px;color:var(--blue)"></i> Ventas por Región</div></div>
        <div class="card-body"><div class="chart-container"><canvas id="regionChart"></canvas></div></div></div>
      <div class="card animate-in" style="animation-delay:.1s"><div class="card-header"><div class="card-title"><i data-lucide="bar-chart-2" style="width:16px;height:16px;color:var(--green)"></i> Ranking</div></div>
        <div class="card-body">${bars}</div></div>
    </div>`;
    },

    renderProducts() {
        const d = ERP_DATA.bi.productMargins;
        const rows = d.labels.map((l, i) => {
            const m = d.margin[i], r = d.revenue[i], c = m >= 45 ? 'var(--green)' : m >= 35 ? 'var(--blue)' : 'var(--amber)';
            return `<tr><td class="bold">${l}</td><td style="text-align:right;color:var(--green)">€${(r / 1000).toFixed(0)}K</td>
        <td style="text-align:right;color:${c};font-weight:700">${m}%</td>
        <td><div style="width:80px;height:4px;background:rgba(255,255,255,.06);border-radius:2px;display:inline-block"><div style="width:${m}%;height:100%;background:${c};border-radius:2px"></div></div></td>
      </tr>`;
        }).join('');
        return `
      <div class="card animate-in"><div class="card-header"><div class="card-title"><i data-lucide="package" style="width:16px;height:16px;color:var(--purple)"></i> Margen por Producto</div></div>
        <div class="card-body"><div class="chart-container" style="height:240px"><canvas id="productChart"></canvas></div></div></div>
      <div class="card animate-in" style="margin-top:14px;animation-delay:.15s"><div class="card-header"><div class="card-title"><i data-lucide="percent" style="width:16px;height:16px;color:var(--green)"></i> Tabla de Márgenes</div></div>
        <div class="card-body"><div class="table-wrap"><table class="data-table">
          <thead><tr><th>Producto</th><th style="text-align:right">Revenue</th><th style="text-align:right">Margen</th><th>Barra</th></tr></thead>
          <tbody>${rows}</tbody></table></div></div></div>`;
    },

    renderLTV() {
        const total = ERP_DATA.bi.customerLTV.reduce((a, c) => a + c.ltv, 0);
        const rows = ERP_DATA.bi.customerLTV.map(c => {
            const sc = c.segment === 'Enterprise' ? 'var(--purple)' : c.segment === 'Mid-Market' ? 'var(--blue)' : 'var(--text-muted)';
            return `<tr class="clickable" onclick="navigate('crm')">
        <td class="bold">${c.name}</td>
        <td><span class="badge" style="color:${sc};background:${sc}1a;border:1px solid ${sc}33">${c.segment}</span></td>
        <td style="text-align:right;color:var(--green);font-weight:700">€${(c.ltv / 1e6).toFixed(2)}M</td>
        <td style="text-align:right">${c.orders}</td>
        <td style="text-align:right;color:var(--text-muted)">€${(c.avgOrder / 1000).toFixed(0)}K</td>
        <td style="text-align:right;color:var(--text-muted)">${Math.round(c.ltv / total * 100)}%</td>
      </tr>`;
        }).join('');
        return `<div class="card animate-in"><div class="card-header"><div class="card-title"><i data-lucide="users" style="width:16px;height:16px;color:var(--purple)"></i> Customer Lifetime Value</div></div>
      <div class="card-body"><div class="table-wrap"><table class="data-table">
        <thead><tr><th>Cliente</th><th>Segmento</th><th style="text-align:right">LTV</th><th style="text-align:right">Pedidos</th><th style="text-align:right">Ticket Medio</th><th style="text-align:right">Share</th></tr></thead>
        <tbody>${rows}</tbody></table></div></div></div>`;
    },

    renderAI() {
        return `
      <div class="info-box"><strong>Motor de IA:</strong> LSTM + XGBoost · 24 meses históricos · Actualización diaria 02:00 UTC · Precisión media: <strong>91.4%</strong></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px">
        ${ERP_DATA.bi.aiInsights.map(ins => `
          <div class="card" style="padding:18px;border-left:3px solid ${ins.color};cursor:default;transition:transform .25s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform=''">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
              <div style="width:36px;height:36px;border-radius:10px;background:${ins.color}1a;display:flex;align-items:center;justify-content:center;color:${ins.color}">
                <i data-lucide="${ins.icon}" style="width:18px;height:18px"></i>
              </div>
              <div style="flex:1"><div style="font-size:.65rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em">IA PREDICTIVA</div>
                <div style="font-size:.9rem;font-weight:700;color:var(--text-primary)">${ins.title}</div></div>
              <button class="btn btn-glass" style="padding:4px 10px;font-size:.72rem" onclick="showToast('Acción ejecutada','check','${ins.color}')">Actuar</button>
            </div>
            <div style="font-size:.8rem;color:var(--text-secondary);line-height:1.7;padding:10px;background:rgba(255,255,255,.03);border-radius:8px">${ins.body}</div>
          </div>`).join('')}
      </div>`;
    },

    initOverviewCharts() {
        const ctx = document.getElementById('trendChart'); if (!ctx) return;
        const d = ERP_DATA.bi.monthlyTrend;
        this.chartInstances.push(new Chart(ctx, {
            type: 'line',
            data: {
                labels: d.labels, datasets: [
                    { label: 'Ingresos', data: d.revenue, borderColor: '#00BFFF', backgroundColor: 'rgba(0,191,255,.07)', fill: true, tension: .4, pointRadius: 4, borderWidth: 2.5 },
                    { label: 'Objetivo', data: d.target, borderColor: 'rgba(168,85,247,.6)', borderDash: [6, 3], fill: false, tension: .4, pointRadius: 3, borderWidth: 1.5 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#8888aa', font: { size: 11 } } } },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#8888aa' } },
                    y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#8888aa', callback: v => '€' + (v / 1e6).toFixed(1) + 'M' } }
                }
            }
        }));
    },

    initRegionChart() {
        const ctx = document.getElementById('regionChart'); if (!ctx) return;
        const d = ERP_DATA.bi.salesByRegion;
        this.chartInstances.push(new Chart(ctx, {
            type: 'doughnut',
            data: { labels: d.labels, datasets: [{ data: d.data, backgroundColor: d.colors, borderWidth: 0, hoverOffset: 8 }] },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '65%',
                plugins: { legend: { position: 'right', labels: { color: '#8888aa', font: { size: 11 }, padding: 12, usePointStyle: true } } }
            }
        }));
    },

    initProductChart() {
        const ctx = document.getElementById('productChart'); if (!ctx) return;
        const d = ERP_DATA.bi.productMargins;
        this.chartInstances.push(new Chart(ctx, {
            type: 'bar',
            data: {
                labels: d.labels, datasets: [
                    { label: 'Revenue €K', data: d.revenue.map(v => v / 1000), backgroundColor: 'rgba(0,191,255,.5)', borderRadius: 6, yAxisID: 'y' },
                    { label: 'Margen %', data: d.margin, backgroundColor: 'rgba(0,229,160,.7)', borderRadius: 6, yAxisID: 'y1' },
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#8888aa', font: { size: 11 } } } },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#8888aa', font: { size: 10 } } },
                    y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#8888aa', callback: v => '€' + v + 'K' }, position: 'left' },
                    y1: { grid: { display: false }, ticks: { color: '#8888aa', callback: v => v + '%' }, position: 'right' }
                }
            }
        }));
    },

    afterRender() { this.switchView('overview'); if (window.lucide) lucide.createIcons(); },
    destroyCharts() { this.chartInstances.forEach(c => c.destroy()); this.chartInstances = []; }
};
