// ============================================================
// Accounting Module v2
// ============================================================
const AccountingModule = {
  chartInstances: [],
  render() {
    const income = ERP_DATA.plChart.income.at(-1);
    const costs = ERP_DATA.plChart.costs.at(-1);
    const margin = ((income - costs) / income * 100).toFixed(1);
    const vencidas = ERP_DATA.invoices.filter(f => f.status === 'Vencida').length;

    const stMap = { Cobrada: 'ok', Pendiente: 'low', Vencida: 'critical', Emitida: 'transit' };
    const rows = ERP_DATA.invoices.map(f => {
      return `<tr class="clickable" onclick="openInvoicePanel('${f.id}')">
        <td><code style="font-size:.72rem">${f.id}</code></td>
        <td class="bold">${f.client}</td>
        <td style="color:var(--text-muted)">${f.date}</td>
        <td style="color:${f.status === 'Vencida' ? 'var(--red)' : 'var(--text-muted)'}">${f.due}</td>
        <td style="font-weight:600;color:var(--text-primary)">€${f.amount.toLocaleString('es-ES')}</td>
        <td><span class="badge ${stMap[f.status] || 'draft'}">${f.status}</span></td>
        <td><i data-lucide="chevron-right" style="width:14px;height:14px;color:var(--text-muted)"></i></td>
      </tr>`;
    }).join('');

    return `
      <div class="page-header">
        <div><div class="page-title">Contabilidad</div><div class="page-subtitle">P&L · Facturación · Tesorería</div></div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-glass" onclick="showToast('Balance exportado','download','var(--blue)')"><i data-lucide="download" style="width:13px;height:13px"></i> Exportar</button>
          <button class="btn btn-primary" onclick="showToast('Nueva factura creada','plus','var(--green)')"><i data-lucide="plus" style="width:13px;height:13px"></i> Nueva Factura</button>
        </div>
      </div>
      <div class="stats-row">
        <div class="card stat-box animate-in" style="cursor:pointer" onclick="showToast('Ingresos Feb: €${income.toLocaleString(\"es-ES\")}','trending-up','var(--blue)')" >
          <div class="stat-value" style="color:var(--blue)">€${(income/1e6).toFixed(2)}M</div><div class="stat-label">Ingresos Feb.</div>
        </div >
  <div class="card stat-box animate-in" style="animation-delay:.05s;cursor:pointer" onclick="showToast('Costes Feb: €${costs.toLocaleString(\" es-ES\")}','trending-down','var(--red)')" >
          <div class="stat-value" style="color:var(--red)">€${(costs/1e6).toFixed(2)}M</div><div class="stat-label">Costes Feb.</div>
        </div >
        <div class="card stat-box animate-in" style="animation-delay:.1s;cursor:pointer" onclick="showToast('Margen bruto: ${margin}%','percent','var(--green)')">
          <div class="stat-value" style="color:var(--green)">${margin}%</div><div class="stat-label">Margen Bruto</div>
        </div>
        <div class="card stat-box animate-in" style="animation-delay:.15s;cursor:pointer" onclick="showToast('${vencidas} factura(s) vencida(s) — Contactar cliente','alert-triangle','var(--amber)')">
          <div class="stat-value" style="color:var(--amber)">${vencidas}</div><div class="stat-label">Vencidas</div>
        </div>
      </div >
      <div class="charts-grid animate-in" style="animation-delay:.1s">
        <div class="card" style="grid-column:1/-1">
          <div class="card-header"><div class="card-title"><i data-lucide="bar-chart-2" style="width:15px;height:15px;color:var(--green)"></i> P&L — Últimos 5 Meses</div></div>
          <div class="card-body"><div class="chart-container"><canvas id="plChart"></canvas></div></div>
        </div>
      </div>
      <div class="card animate-in" style="animation-delay:.2s">
        <div class="card-header"><div class="card-title"><i data-lucide="receipt" style="width:15px;height:15px;color:var(--amber)"></i> Facturas</div><span style="font-size:.72rem;color:var(--text-muted)">Clic → detalle + acciones</span></div>
        <div class="card-body">
          <div class="filter-bar">
            <input class="filter-input" placeholder="Buscar factura, cliente..." oninput="filterTable(this,'acc-table',0,1)">
            <select class="filter-input" style="min-width:160px" onchange="filterTable(this,'acc-table',5)">
              <option value="">Todos los estados</option>
              <option>Cobrada</option><option>Pendiente</option><option>Vencida</option><option>Emitida</option>
            </select>
          </div>
          <div class="table-wrap">
            <table class="data-table" id="acc-table">
              <thead><tr><th>Nº Factura</th><th>Cliente</th><th>Emisión</th><th>Vencimiento</th><th>Importe</th><th>Estado</th><th></th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>`;
  },

  afterRender() {
    const ctx = document.getElementById('plChart');
    if (!ctx) return;
    const d = ERP_DATA.plChart;
    this.chartInstances.push(new Chart(ctx, {
      type: 'bar',
      data: {
        labels: d.labels,
        datasets: [
          { label:'Ingresos', data:d.income, backgroundColor:'rgba(56,189,248,.65)', borderRadius:6, borderSkipped:false },
          { label:'Costes',   data:d.costs,  backgroundColor:'rgba(248,113,113,.5)', borderRadius:6, borderSkipped:false },
        ]
      },
      options: { responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ labels:{ color:'#94a3b8', padding:16, usePointStyle:true }}},
        scales:{ x:{ grid:{color:'rgba(255,255,255,.04)'}, ticks:{color:'#475569'}},
          y:{ grid:{color:'rgba(255,255,255,.04)'}, ticks:{color:'#475569',callback:v=>'€'+(v/1e6).toFixed(1)+'M'}}}}
    }));
    if(window.lucide) lucide.createIcons();
  },
  destroyCharts() { this.chartInstances.forEach(c=>c.destroy()); this.chartInstances=[]; }
};
