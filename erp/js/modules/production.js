// ============================================================
// Production Module — Manufacturing Orders + Machine Status
// ============================================================
const ProductionModule = {
    chartInstances: [],
    currentTab: 'orders',

    render() {
        const k = ERP_DATA.prodKpis;
        return `
      <div class="page-header">
        <div>
          <div class="page-title">Producción</div>
          <div class="page-subtitle">Órdenes de Fabricación · Estado de Máquinas · OEE en Tiempo Real</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-glass" onclick="showToast('Planificación de producción generada','calendar','var(--blue)')"><i data-lucide="calendar" style="width:14px;height:14px"></i> Planificar</button>
          <button class="btn btn-primary" onclick="showToast('Nueva OF iniciada','plus','var(--green)')"><i data-lucide="plus" style="width:14px;height:14px"></i> Nueva OF</button>
        </div>
      </div>

      <div class="stats-row">
        <div class="card stat-box animate-in" style="cursor:pointer" onclick="showToast('OEE Global: ${k.oee}% (target: 85%)','activity','var(--blue)')">
          <div class="stat-value" style="color:var(--blue)">${k.oee}%</div>
          <div class="stat-label">OEE Global</div>
        </div>
        <div class="card stat-box animate-in" style="animation-delay:.05s;cursor:pointer" onclick="showToast('Eficiencia de planta: ${k.efficiency}%','zap','var(--green)')">
          <div class="stat-value" style="color:var(--green)">${k.efficiency}%</div>
          <div class="stat-label">Eficiencia</div>
        </div>
        <div class="card stat-box animate-in" style="animation-delay:.1s;cursor:pointer" onclick="showToast('Tasa de defectos: ${k.defectRate}% (target: <2%)','alert-triangle','var(--amber)')">
          <div class="stat-value" style="color:var(--amber)">${k.defectRate}%</div>
          <div class="stat-label">Tasa Defectos</div>
        </div>
        <div class="card stat-box animate-in" style="animation-delay:.15s;cursor:pointer" onclick="showToast('Entrega a tiempo: ${k.onTimeDelivery}%','check-circle','var(--purple)')">
          <div class="stat-value" style="color:var(--purple)">${k.onTimeDelivery}%</div>
          <div class="stat-label">On-Time Delivery</div>
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:16px">
        <button class="btn ${this.currentTab === 'orders' ? 'btn-primary' : 'btn-glass'}" id="tab-orders" onclick="ProductionModule.switchTab('orders')">
          <i data-lucide="clipboard-list" style="width:14px;height:14px"></i> Órdenes de Fabricación
        </button>
        <button class="btn ${this.currentTab === 'machines' ? 'btn-primary' : 'btn-glass'}" id="tab-machines" onclick="ProductionModule.switchTab('machines')">
          <i data-lucide="cpu" style="width:14px;height:14px"></i> Estado de Máquinas
        </button>
        <button class="btn ${this.currentTab === 'oee' ? 'btn-primary' : 'btn-glass'}" id="tab-oee" onclick="ProductionModule.switchTab('oee')">
          <i data-lucide="activity" style="width:14px;height:14px"></i> Análisis OEE
        </button>
      </div>

      <div id="prod-tab-content" class="animate-in"></div>
    `;
    },

    switchTab(tab) {
        this.currentTab = tab;
        ['orders', 'machines', 'oee'].forEach(t => {
            const b = document.getElementById(`tab-${t}`);
            if (b) b.className = `btn ${t === tab ? 'btn-primary' : 'btn-glass'}`;
        });
        const c = document.getElementById('prod-tab-content');
        c.className = 'animate-in';
        void c.offsetWidth;
        if (tab === 'orders') c.innerHTML = this.renderOrders();
        if (tab === 'machines') c.innerHTML = this.renderMachines();
        if (tab === 'oee') c.innerHTML = this.renderOEE();
        if (window.lucide) lucide.createIcons();
        if (tab === 'oee') this.initOEEChart();
    },

    renderOrders() {
        const rows = ERP_DATA.productionOrders.map(o => {
            const pct = Math.round((o.done / o.qty) * 100);
            const stColor = o.status === 'Completada' ? 'ok' : o.status === 'En Proceso' ? 'transit' : o.status === 'Planificada' ? 'draft' : 'pending';
            const priColor = o.priority === 'alta' ? 'var(--red)' : o.priority === 'media' ? 'var(--amber)' : 'var(--green)';
            return `<tr class="clickable" onclick="ProductionModule.openOFPanel('${o.id}')">
        <td><code style="color:var(--blue);font-size:.78rem">${o.id}</code></td>
        <td class="bold">${o.product}</td>
        <td style="color:var(--text-muted)">${o.client}</td>
        <td style="color:var(--text-muted);font-size:.78rem">${o.line}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:.78rem;color:var(--text-primary);font-weight:600">${o.done}/${o.qty}</span>
            <div style="flex:1;min-width:60px;height:4px;background:rgba(255,255,255,.07);border-radius:2px">
              <div style="width:${pct}%;height:100%;background:${o.status === 'Completada' ? 'var(--green)' : 'var(--blue)'};border-radius:2px"></div>
            </div>
            <span style="font-size:.72rem;color:var(--text-muted)">${pct}%</span>
          </div>
        </td>
        <td><span class="badge" style="font-size:.65rem;color:${priColor};background:${priColor}19;border:1px solid ${priColor}33">${o.priority.toUpperCase()}</span></td>
        <td><span class="badge ${stColor}">${o.status}</span></td>
        <td style="color:var(--text-muted);font-size:.78rem">${o.due}</td>
        <td><i data-lucide="chevron-right" style="width:14px;height:14px;color:var(--text-muted)"></i></td>
      </tr>`;
        }).join('');

        return `<div class="card"><div class="card-header">
      <div class="card-title"><i data-lucide="clipboard-list" style="width:16px;height:16px;color:var(--blue)"></i> Órdenes de Fabricación</div>
      <span style="font-size:.72rem;color:var(--text-muted)">Clic en fila → detalle de OF</span>
    </div><div class="card-body">
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>ID OF</th><th>Producto</th><th>Cliente</th><th>Línea</th><th style="min-width:160px">Progreso</th><th>Prioridad</th><th>Estado</th><th>Entrega</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </div></div>`;
    },

    renderMachines() {
        const cards = ERP_DATA.machines.map(m => {
            const stColor = m.status === 'operativa' ? 'var(--green)' : m.status === 'mantenimiento' ? 'var(--amber)' : 'var(--red)';
            const stLabel = m.status === 'operativa' ? '● Operativa' : m.status === 'mantenimiento' ? '● Mantenimiento' : '● Parada';
            const tempColor = m.temp > 55 ? 'var(--red)' : m.temp > 45 ? 'var(--amber)' : 'var(--green)';
            return `
        <div class="card" style="padding:18px;cursor:pointer;transition:all .25s" onclick="ProductionModule.openMachinePanel('${m.id}')"
          onmouseover="this.style.borderColor='${stColor}44';this.style.transform='translateY(-3px)'"
          onmouseout="this.style.borderColor='';this.style.transform=''">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
            <div>
              <div style="font-size:.68rem;color:var(--text-muted);margin-bottom:2px">${m.id} · ${m.line}</div>
              <div style="font-size:.88rem;font-weight:700;color:var(--text-primary)">${m.name}</div>
            </div>
            <span style="font-size:.72rem;font-weight:600;color:${stColor}">${stLabel}</span>
          </div>
          ${m.status !== 'parada' ? `
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;font-size:.72rem;margin-bottom:4px"><span style="color:var(--text-muted)">Carga CPU</span><span style="color:var(--blue);font-weight:600">${m.load}%</span></div>
            <div style="height:5px;background:rgba(255,255,255,.07);border-radius:3px"><div style="width:${m.load}%;height:100%;background:var(--blue);border-radius:3px"></div></div>
          </div>` : '<div style="height:29px;display:flex;align-items:center;font-size:.75rem;color:var(--red)">⚠ Parada no programada</div>'}
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:.72rem">
            <div style="text-align:center"><div style="color:${tempColor};font-weight:700">${m.temp}°C</div><div style="color:var(--text-muted)">Temp.</div></div>
            <div style="text-align:center"><div style="color:var(--green);font-weight:700">${m.uptime}%</div><div style="color:var(--text-muted)">Uptime</div></div>
            <div style="text-align:center"><div style="color:${m.alerts > 0 ? 'var(--red)' : 'var(--green)'}; font-weight:700">${m.alerts}</div><div style="color:var(--text-muted)">Alertas</div></div>
          </div>
        </div>`;
        }).join('');

        return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px">${cards}</div>`;
    },

    renderOEE() {
        return `
      <div class="charts-grid">
        <div class="card animate-in">
          <div class="card-header"><div class="card-title"><i data-lucide="activity" style="width:16px;height:16px;color:var(--green)"></i> OEE por Máquina</div></div>
          <div class="card-body"><div class="chart-container"><canvas id="oeeChart"></canvas></div></div>
        </div>
        <div class="card animate-in" style="animation-delay:.1s">
          <div class="card-header"><div class="card-title"><i data-lucide="alert-triangle" style="width:16px;height:16px;color:var(--amber)"></i> Alertas de Máquinas</div></div>
          <div class="card-body">
            ${ERP_DATA.machines.filter(m => m.alerts > 0).map(m => `
              <div class="alert-item" style="cursor:pointer;margin-bottom:6px" onclick="ProductionModule.openMachinePanel('${m.id}')">
                <div class="alert-dot ${m.alerts >= 3 ? 'high' : m.alerts >= 1 ? 'med' : 'low'}"></div>
                <div style="flex:1"><div style="font-size:.8rem;color:var(--text-primary)">${m.name}</div>
                <div style="font-size:.72rem;color:var(--text-muted)">${m.alerts} alerta(s) activa(s) · ${m.line}</div></div>
                <i data-lucide="chevron-right" style="width:14px;height:14px;color:var(--text-muted)"></i>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
    },

    initOEEChart() {
        const ctx = document.getElementById('oeeChart');
        if (!ctx) return;
        this.chartInstances.forEach(c => c.destroy()); this.chartInstances = [];
        const oeeByMachine = ERP_DATA.machines.map(m => ({
            label: m.id, oee: m.status === 'parada' ? 0 : m.status === 'mantenimiento' ? 55 : Math.round(65 + m.uptime / 3)
        }));
        this.chartInstances.push(new Chart(ctx, {
            type: 'bar',
            data: {
                labels: oeeByMachine.map(x => x.label),
                datasets: [{
                    label: 'OEE %', data: oeeByMachine.map(x => x.oee),
                    backgroundColor: oeeByMachine.map(x => x.oee >= 85 ? 'rgba(0,229,160,.7)' : x.oee >= 60 ? 'rgba(255,179,0,.7)' : 'rgba(255,77,109,.7)'),
                    borderRadius: 6, borderSkipped: false
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#8888aa' } },
                    y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#8888aa', callback: v => v + '%' }, max: 100 }
                }
            }
        }));
    },

    openOFPanel(id) {
        const o = ERP_DATA.productionOrders.find(x => x.id === id);
        if (!o) return;
        const pct = Math.round((o.done / o.qty) * 100);
        const stColor = o.status === 'Completada' ? 'var(--green)' : o.status === 'En Proceso' ? 'var(--blue)' : 'var(--text-muted)';
        const html = `
      <div class="panel-section">
        <div style="background:${stColor}0d;border:1px solid ${stColor}22;border-radius:12px;padding:16px;text-align:center">
          <div style="font-family:monospace;font-size:.9rem;color:${stColor};font-weight:800">${o.id}</div>
          <div style="font-size:1.1rem;font-weight:700;color:var(--text-primary);margin:6px 0">${o.product}</div>
          <div style="font-size:.8rem;color:var(--text-muted)">${o.client}</div>
          <div style="margin:10px auto;max-width:200px">
            <div style="display:flex;justify-content:space-between;font-size:.75rem;margin-bottom:5px"><span style="color:var(--text-muted)">Progreso</span><span style="color:${stColor};font-weight:700">${o.done}/${o.qty} (${pct}%)</span></div>
            <div class="stock-bar-wrap"><div class="stock-bar-fill" style="width:${pct}%;background:${stColor}"></div></div>
          </div>
        </div>
      </div>
      <div class="panel-section">
        <div class="panel-section-title">Detalles OF</div>
        <div class="panel-row"><span class="panel-row-label">Línea</span><span class="panel-row-value">${o.line}</span></div>
        <div class="panel-row"><span class="panel-row-label">Prioridad</span><span class="panel-row-value" style="color:${o.priority === 'alta' ? 'var(--red)' : o.priority === 'media' ? 'var(--amber)' : 'var(--green)'};font-weight:700">${o.priority.toUpperCase()}</span></div>
        <div class="panel-row"><span class="panel-row-label">Inicio</span><span class="panel-row-value">${o.start}</span></div>
        <div class="panel-row"><span class="panel-row-label">Entrega Prevista</span><span class="panel-row-value">${o.due}</span></div>
        <div class="panel-row"><span class="panel-row-label">Estado</span><span class="badge ${o.status === 'Completada' ? 'ok' : o.status === 'En Proceso' ? 'transit' : 'draft'}">${o.status}</span></div>
      </div>
      <div class="panel-actions">
        <button class="btn btn-primary" onclick="showToast('OF ${o.id} actualizada','check','var(--green)')"><i data-lucide="check" style="width:14px;height:14px"></i> Actualizar Progreso</button>
        <button class="btn btn-glass" onclick="showToast('Informe de OF generado','file-text','var(--blue)')"><i data-lucide="file-text" style="width:14px;height:14px"></i> Informe</button>
      </div>`;
        openPanel(html, o.id, `${o.product} · ${o.line}`, stColor, 'clipboard-list');
        if (window.lucide) lucide.createIcons();
    },

    openMachinePanel(id) {
        const m = ERP_DATA.machines.find(x => x.id === id);
        if (!m) return;
        const stColor = m.status === 'operativa' ? 'var(--green)' : m.status === 'mantenimiento' ? 'var(--amber)' : 'var(--red)';
        const html = `
      <div class="panel-section">
        <div style="background:${stColor}0d;border:1px solid ${stColor}22;border-radius:12px;padding:16px;text-align:center">
          <div style="font-size:.68rem;color:var(--text-muted)">${m.id} · ${m.line}</div>
          <div style="font-size:1rem;font-weight:700;color:var(--text-primary);margin:4px 0">${m.name}</div>
          <span style="font-size:.8rem;font-weight:700;color:${stColor}">● ${m.status.toUpperCase()}</span>
        </div>
      </div>
      <div class="panel-section">
        <div class="panel-section-title">Telemetría en Tiempo Real</div>
        ${[['Carga de trabajo', 'var(--blue)', m.load, '%'], ['Temperatura', 'var(--amber)' + ((m.temp > 55) ? '' : m.temp > 45 ? '' : ''), m.temp, '°C'], ['Uptime', 'var(--green)', m.uptime, '%']].map(([l, c, v, u]) => `
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:4px">
              <span style="color:var(--text-muted)">${l}</span><span style="color:${c};font-weight:700">${v}${u}</span>
            </div>
            <div class="stock-bar-wrap"><div class="stock-bar-fill" style="width:${Math.min(v, 100)}%;background:${c}"></div></div>
          </div>`).join('')}
      </div>
      <div class="panel-section">
        <div class="panel-section-title">Mantenimiento</div>
        <div class="panel-row"><span class="panel-row-label">Último Mant.</span><span class="panel-row-value">${m.lastMaint}</span></div>
        <div class="panel-row"><span class="panel-row-label">Próximo Mant.</span><span class="panel-row-value" style="color:var(--amber)">${m.nextMaint}</span></div>
        <div class="panel-row"><span class="panel-row-label">Alertas Activas</span><span class="panel-row-value" style="color:${m.alerts > 0 ? 'var(--red)' : 'var(--green)'};font-weight:700">${m.alerts}</span></div>
      </div>
      <div class="panel-actions">
        <button class="btn btn-primary" onclick="showToast('Orden de mantenimiento creada para ${m.id}','wrench','var(--amber)')"><i data-lucide="wrench" style="width:14px;height:14px"></i> Programar Mant.</button>
        <button class="btn btn-glass" onclick="showToast('Historial de ${m.name} exportado','download','var(--blue)')"><i data-lucide="download" style="width:14px;height:14px"></i> Historial</button>
      </div>`;
        openPanel(html, m.name, `${m.id} · ${m.line}`, stColor, 'cpu');
        if (window.lucide) lucide.createIcons();
    },

    afterRender() { this.switchTab('orders'); if (window.lucide) lucide.createIcons(); },
    destroyCharts() { this.chartInstances.forEach(c => c.destroy()); this.chartInstances = []; }
};
