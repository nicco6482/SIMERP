// ============================================================
// Logistics Module — Shipment tracking + route optimizer
// ============================================================
const LogisticsModule = {
    render() {
        const stMap = { Entregado: 'ok', 'En Tránsito': 'transit', 'En Reparto': 'low', Preparando: 'draft', Incidencia: 'critical' };
        const stColorMap = { Entregado: 'var(--green)', 'En Tránsito': 'var(--blue)', 'En Reparto': 'var(--amber)', Preparando: 'var(--text-muted)', Incidencia: 'var(--red)' };

        const total = ERP_DATA.shipments.length;
        const transit = ERP_DATA.shipments.filter(s => s.status === 'En Tránsito' || s.status === 'En Reparto').length;
        const issues = ERP_DATA.shipments.filter(s => s.status === 'Incidencia').length;
        const delivered = ERP_DATA.shipments.filter(s => s.status === 'Entregado').length;

        const rows = ERP_DATA.shipments.map(s => {
            const color = stColorMap[s.status] || 'var(--text-muted)';
            return `<tr class="clickable" onclick="LogisticsModule.openShipPanel('${s.id}')">
        <td><code style="color:var(--blue);font-size:.78rem">${s.id}</code></td>
        <td class="bold">${s.client}</td>
        <td style="color:var(--text-muted)">${s.origin} → <strong style="color:var(--text-primary)">${s.dest}</strong></td>
        <td>${s.carrier}</td>
        <td style="color:var(--text-muted)">${s.dep}</td>
        <td style="color:${s.status === 'Incidencia' ? 'var(--red)' : s.status === 'Entregado' ? 'var(--green)' : 'var(--text-muted)'}">${s.eta}</td>
        <td style="text-align:right;color:var(--text-muted)">${s.weight.toLocaleString('es-ES')} kg</td>
        <td><span class="badge ${stMap[s.status] || 'draft'}">${s.status}</span></td>
        <td><i data-lucide="chevron-right" style="width:14px;height:14px;color:var(--text-muted)"></i></td>
      </tr>`;
        }).join('');

        const routeRows = ERP_DATA.routes.map(r => `
      <tr>
        <td class="bold">${r.from}</td><td class="bold">${r.to}</td>
        <td style="color:var(--text-muted)">${r.distance} km</td>
        <td style="color:var(--blue)">${r.avgTime}</td>
        <td>${r.carrier}</td>
        <td style="color:var(--green);font-weight:600">€${r.cost}</td>
        <td><button class="btn btn-glass" style="padding:4px 10px;font-size:.72rem" onclick="showToast('Ruta ${r.from}→${r.to} optimizada con IA','zap','var(--purple)')">Optimizar</button></td>
      </tr>`).join('');

        return `
      <div class="page-header">
        <div>
          <div class="page-title">Logística & Envíos</div>
          <div class="page-subtitle">Seguimiento en Tiempo Real · Optimización de Rutas</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-glass" onclick="showToast('Exportando manifiesto de envíos','download','var(--blue)')"><i data-lucide="download" style="width:14px;height:14px"></i> Manifiesto</button>
          <button class="btn btn-primary" onclick="showToast('Nuevo envío creado','plus','var(--green)')"><i data-lucide="plus" style="width:14px;height:14px"></i> Nuevo Envío</button>
        </div>
      </div>

      <div class="stats-row">
        <div class="card stat-box animate-in" style="cursor:pointer" onclick="showToast('${total} envíos gestionados este mes','truck','var(--blue)')">
          <div class="stat-value" style="color:var(--blue)">${total}</div><div class="stat-label">Total Envíos</div>
        </div>
        <div class="card stat-box animate-in" style="animation-delay:.05s;cursor:pointer" onclick="showToast('${transit} envíos actualmente en movimiento','navigation','var(--amber)')">
          <div class="stat-value" style="color:var(--amber)">${transit}</div><div class="stat-label">En Tránsito</div>
        </div>
        <div class="card stat-box animate-in" style="animation-delay:.1s;cursor:pointer" onclick="showToast('${delivered} envíos entregados correctamente','check-circle','var(--green)')">
          <div class="stat-value" style="color:var(--green)">${delivered}</div><div class="stat-label">Entregados</div>
        </div>
        <div class="card stat-box animate-in" style="animation-delay:.15s;cursor:pointer" onclick="issues&&navigate('logistics')">
          <div class="stat-value" style="color:var(--red)">${issues}</div><div class="stat-label">Incidencias</div>
        </div>
      </div>

      <div class="card animate-in" style="margin-bottom:16px">
        <div class="card-header">
          <div class="card-title"><i data-lucide="truck" style="width:16px;height:16px;color:var(--blue)"></i> Seguimiento de Envíos</div>
          <span style="font-size:.72rem;color:var(--text-muted)">Clic en fila → tracking + acciones</span>
        </div>
        <div class="card-body">
          <div class="filter-bar">
            <input class="filter-input" placeholder="🔍 Buscar envío, cliente o destino..." type="text" oninput="filterTable(this,'ship-table',0,1,2)">
            <select class="filter-input" style="min-width:170px" onchange="filterTable(this,'ship-table',7)">
              <option value="">Todos los estados</option>
              <option>Entregado</option><option>En Tránsito</option><option>En Reparto</option><option>Preparando</option><option>Incidencia</option>
            </select>
          </div>
          <div class="table-wrap">
            <table class="data-table" id="ship-table">
              <thead><tr><th>ID Envío</th><th>Cliente</th><th>Ruta</th><th>Transportista</th><th>Salida</th><th>ETA</th><th style="text-align:right">Peso</th><th>Estado</th><th></th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card animate-in" style="animation-delay:.2s">
        <div class="card-header">
          <div class="card-title"><i data-lucide="map" style="width:16px;height:16px;color:var(--purple)"></i> Rutas Frecuentes</div>
          <span style="font-size:.72rem;color:var(--purple)">⚡ IA de Optimización Disponible</span>
        </div>
        <div class="card-body">
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Origen</th><th>Destino</th><th>Distancia</th><th>Tiempo Medio</th><th>Transportista</th><th>Coste Base</th><th>Acción</th></tr></thead>
              <tbody>${routeRows}</tbody>
            </table>
          </div>
        </div>
      </div>`;
    },

    openShipPanel(id) {
        const s = ERP_DATA.shipments.find(x => x.id === id);
        if (!s) return;
        const stColorMap = { Entregado: 'var(--green)', 'En Tránsito': 'var(--blue)', 'En Reparto': 'var(--amber)', Preparando: 'var(--text-muted)', Incidencia: 'var(--red)' };
        const color = stColorMap[s.status] || 'var(--blue)';
        const steps = ['Preparando', 'En Tránsito', 'En Reparto', 'Entregado'];
        const curIdx = steps.indexOf(s.status);

        const timeline = steps.map((st, i) => `
      <div style="display:flex;align-items:center;gap:10px;padding:8px 0;${i < steps.length - 1 ? 'border-bottom:1px solid rgba(255,255,255,.04)' : ''}">
        <div style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;flex-shrink:0;
          background:${i <= curIdx ? color + '22' : 'rgba(255,255,255,.04)'};
          color:${i <= curIdx ? color : 'var(--text-muted)'};
          border:2px solid ${i <= curIdx ? color : 'rgba(255,255,255,.1)'}">
          ${i < curIdx ? '✓' : i === curIdx ? '●' : String(i + 1)}
        </div>
        <span style="font-size:.8rem;color:${i <= curIdx ? 'var(--text-primary)' : 'var(--text-muted)'};font-weight:${i === curIdx ? 700 : 400}">${st}</span>
        ${i === curIdx ? `<span style="margin-left:auto;font-size:.68rem;color:${color};background:${color}1a;padding:2px 8px;border-radius:10px;font-weight:600">ACTUAL</span>` : ''}
      </div>`).join('');

        const html = `
      <div class="panel-section">
        <div style="background:${color}0d;border:1px solid ${color}22;border-radius:12px;padding:16px;text-align:center">
          <div style="font-family:monospace;font-size:1rem;font-weight:800;color:${color}">${s.id}</div>
          <div style="font-size:.9rem;font-weight:600;color:var(--text-primary);margin:4px 0">${s.origin} → ${s.dest}</div>
          <div style="font-size:.8rem;color:var(--text-muted)">${s.client}</div>
        </div>
      </div>
      <div class="panel-section">
        <div class="panel-section-title">Timeline de Entrega</div>
        ${timeline}
      </div>
      <div class="panel-section">
        <div class="panel-section-title">Información del Envío</div>
        <div class="panel-row"><span class="panel-row-label">Transportista</span><span class="panel-row-value">${s.carrier}</span></div>
        <div class="panel-row"><span class="panel-row-label">Tracking</span><code style="color:var(--blue);font-size:.75rem">${s.tracking}</code></div>
        <div class="panel-row"><span class="panel-row-label">Peso</span><span class="panel-row-value">${s.weight.toLocaleString('es-ES')} kg</span></div>
        <div class="panel-row"><span class="panel-row-label">Fecha Salida</span><span class="panel-row-value">${s.dep}</span></div>
        <div class="panel-row"><span class="panel-row-label">ETA</span><span class="panel-row-value" style="color:${s.status === 'Incidencia' ? 'var(--red)' : color}">${s.eta}</span></div>
      </div>
      <div class="panel-actions">
        ${s.status === 'Incidencia' ? `<button class="btn btn-primary" style="background:linear-gradient(135deg,var(--red),var(--amber))" onclick="showToast('Incidencia escalada al transportista','alert-triangle','var(--red)')"><i data-lucide="alert-triangle" style="width:14px;height:14px"></i> Escalar Incidencia</button>` : ''}
        <button class="btn btn-glass" onclick="showToast('Tracking externo abierto para ${s.id}','external-link','var(--blue)')"><i data-lucide="external-link" style="width:14px;height:14px"></i> Ver Tracking</button>
        <button class="btn btn-glass" onclick="showToast('Etiqueta de ${s.id} impresa','printer','var(--purple)')"><i data-lucide="printer" style="width:14px;height:14px"></i> Etiqueta</button>
      </div>`;

        openPanel(html, s.id, `${s.client} · ${s.carrier}`, color, 'truck');
        if (window.lucide) lucide.createIcons();
    },

    afterRender() { if (window.lucide) lucide.createIcons(); }
};
