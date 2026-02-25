// ============================================================
// HR Module v2
// ============================================================
const HRModule = {
  chartInstances: [],
  render() {
    const total = ERP_DATA.employees.length;
    const activos = ERP_DATA.employees.filter(e => e.status === 'Activo').length;
    const depts = [...new Set(ERP_DATA.employees.map(e => e.dept))].length;

    const rows = ERP_DATA.employees.map(e => {
      const initials = e.name.split(' ').map(w => w[0]).slice(0, 2).join('');
      const years = new Date().getFullYear() - new Date(e.start).getFullYear();
      return `<tr class="clickable" onclick="openEmployeePanel('${e.id}')">
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:30px;height:30px;border-radius:var(--r-md);background:linear-gradient(135deg,var(--accent),var(--purple));display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;color:#fff;flex-shrink:0">${initials}</div>
            <span class="bold">${e.name}</span>
          </div>
        </td>
        <td style="color:var(--text-muted)">${e.dept}</td>
        <td style="color:var(--text-muted)">${e.role}</td>
        <td style="color:var(--text-muted)">${e.start}</td>
        <td style="color:var(--text-muted)">${years} año${years !== 1 ? 's' : ''}</td>
        <td><span class="badge ${e.status === 'Activo' ? 'active' : 'inactive'}">${e.status}</span></td>
        <td><i data-lucide="chevron-right" style="width:14px;height:14px;color:var(--text-muted)"></i></td>
      </tr>`;
    }).join('');

    return `
      <div class="page-header">
        <div><div class="page-title">RRHH</div><div class="page-subtitle">Gestión de Personal · Nómina · Desempeño</div></div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-glass" onclick="showToast('Informe RRHH exportado','download','var(--blue)')"><i data-lucide="download" style="width:13px;height:13px"></i> Exportar</button>
          <button class="btn btn-primary" onclick="showToast('Nuevo empleado creado','user-plus','var(--green)')"><i data-lucide="user-plus" style="width:13px;height:13px"></i> Nuevo Empleado</button>
        </div>
      </div>
      <div class="stats-row">
        <div class="card stat-box animate-in" style="cursor:pointer"><div class="stat-value" style="color:var(--blue)">${total}</div><div class="stat-label">Total Empleados</div></div>
        <div class="card stat-box animate-in" style="animation-delay:.05s;cursor:pointer"><div class="stat-value" style="color:var(--green)">${activos}</div><div class="stat-label">Activos</div></div>
        <div class="card stat-box animate-in" style="animation-delay:.1s;cursor:pointer"><div class="stat-value" style="color:var(--purple)">${depts}</div><div class="stat-label">Departamentos</div></div>
        <div class="card stat-box animate-in" style="animation-delay:.15s;cursor:pointer"><div class="stat-value" style="color:var(--amber)">1</div><div class="stat-label">En Baja</div></div>
      </div>
      <div class="charts-grid animate-in" style="animation-delay:.1s">
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="bar-chart-2" style="width:15px;height:15px;color:var(--accent)"></i> Empleados por Dept.</div></div>
          <div class="card-body"><div class="chart-container"><canvas id="deptChart"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title"><i data-lucide="alert-triangle" style="width:15px;height:15px;color:var(--amber)"></i> Alertas RRHH</div></div>
          <div class="card-body">
            <div class="alert-item" style="cursor:pointer" onclick="openEmployeePanel('E-003')">
              <div class="alert-dot med"></div>
              <div style="flex:1"><div style="font-size:.8rem;color:var(--text-primary)">Contrato de M. García vence en 7 días</div><div style="font-size:.7rem;color:var(--text-muted)">Hace 2 h</div></div>
              <i data-lucide="chevron-right" style="width:13px;height:13px;color:var(--text-muted)"></i>
            </div>
            <div class="alert-item" style="cursor:pointer" onclick="openEmployeePanel('E-006')">
              <div class="alert-dot high"></div>
              <div style="flex:1"><div style="font-size:.8rem;color:var(--text-primary)">S. Navarro en situación de baja activa</div><div style="font-size:.7rem;color:var(--text-muted)">Desde 2026-04-10</div></div>
              <i data-lucide="chevron-right" style="width:13px;height:13px;color:var(--text-muted)"></i>
            </div>
            <div class="alert-item" style="cursor:pointer" onclick="showToast('Pendientes: 3 evaluaciones anuales de desempeño','clipboard','var(--purple)')">
              <div class="alert-dot low"></div>
              <div style="flex:1"><div style="font-size:.8rem;color:var(--text-primary)">3 evaluaciones de desempeño pendientes</div><div style="font-size:.7rem;color:var(--text-muted)">Plazo: 28/02/2026</div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="card animate-in" style="animation-delay:.2s">
        <div class="card-header"><div class="card-title"><i data-lucide="users" style="width:15px;height:15px;color:var(--accent)"></i> Directorio de Empleados</div><span style="font-size:.72rem;color:var(--text-muted)">Clic → ficha completa</span></div>
        <div class="card-body">
          <div class="filter-bar">
            <input class="filter-input" placeholder="Buscar empleado, cargo..." oninput="filterTable(this,'hr-table',0,1,2)">
            <select class="filter-input" style="min-width:160px" onchange="filterTable(this,'hr-table',5)">
              <option value="">Todos</option><option>Activo</option><option>Baja</option>
            </select>
          </div>
          <div class="table-wrap">
            <table class="data-table" id="hr-table">
              <thead><tr><th>Empleado</th><th>Departamento</th><th>Cargo</th><th>Alta</th><th>Antigüedad</th><th>Estado</th><th></th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>`;
  },

  afterRender() {
    const ctx = document.getElementById('deptChart');
    if (!ctx) return;
    const d = ERP_DATA.deptChart;
    const colors = ['#6366f1', '#38bdf8', '#34d399', '#fbbf24', '#c084fc', '#f87171', '#22d3ee'];
    this.chartInstances.push(new Chart(ctx, {
      type: 'bar',
      data: { labels: d.labels, datasets: [{ label: 'Empleados', data: d.data, backgroundColor: colors, borderRadius: 6, borderSkipped: false }] },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#475569' } },
          y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#94a3b8', font: { size: 11 } } }
        }
      }
    }));
    if (window.lucide) lucide.createIcons();
  },
  destroyCharts() { this.chartInstances.forEach(c => c.destroy()); this.chartInstances = []; }
};
