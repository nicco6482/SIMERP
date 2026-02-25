// ============================================================
// Inventory Module v2
// ============================================================
const InventoryModule = {
  render() {
    const total = ERP_DATA.inventory.reduce((s, p) => s + p.qty, 0);
    const critical = ERP_DATA.inventory.filter(p => p.status === 'critical').length;
    const low = ERP_DATA.inventory.filter(p => p.status === 'low').length;

    const rows = ERP_DATA.inventory.map(p => {
      const max = Math.max(p.min * 4, p.qty + 1);
      const pct = Math.min(Math.round((p.qty / max) * 100), 100);
      const stKey = p.status === 'critical' ? 'critical' : p.status === 'low' ? 'low' : 'ok';
      const barColor = p.status === 'critical' ? 'var(--red)' : p.status === 'low' ? 'var(--amber)' : 'var(--green)';
      return `<tr class="clickable" onclick="openInventoryPanel('${p.sku}')">
        <td><code style="font-size:.72rem">${p.sku}</code></td>
        <td class="bold">${p.name}</td>
        <td style="color:var(--text-muted)">${p.cat}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px;min-width:120px">
            <div style="flex:1;height:4px;background:rgba(255,255,255,.06);border-radius:2px">
              <div style="width:${pct}%;height:100%;background:${barColor};border-radius:2px"></div>
            </div>
            <span style="font-size:.75rem;font-weight:600;color:${barColor};width:38px;text-align:right">${p.qty.toLocaleString('es-ES')}</span>
          </div>
        </td>
        <td style="color:var(--text-muted)">${p.min}</td>
        <td style="color:var(--text-muted)">${p.unit}</td>
        <td><code style="font-size:.72rem">${p.loc}</code></td>
        <td><span class="badge ${stKey}">${p.status === 'critical' ? 'Crítico' : p.status === 'low' ? 'Bajo' : 'OK'}</span></td>
        <td><i data-lucide="chevron-right" style="width:14px;height:14px;color:var(--text-muted)"></i></td>
      </tr>`;
    }).join('');

    return `
      <div class="page-header">
        <div>
          <div class="page-title">Inventario</div>
          <div class="page-subtitle">Stock en tiempo real · ${ERP_DATA.inventory.length} artículos</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-glass" onclick="showToast('Inventario exportado','download','var(--blue)')"><i data-lucide="download" style="width:13px;height:13px"></i> Exportar</button>
          <button class="btn btn-primary" onclick="showToast('Nuevo artículo creado','plus','var(--green)')"><i data-lucide="plus" style="width:13px;height:13px"></i> Nuevo Artículo</button>
        </div>
      </div>
      <div class="stats-row">
        <div class="card stat-box animate-in" onclick="navigate('inventory')" style="cursor:pointer">
          <div class="stat-value" style="color:var(--blue)">${ERP_DATA.inventory.length}</div>
          <div class="stat-label">Referencias</div>
        </div>
        <div class="card stat-box animate-in" style="animation-delay:.05s;cursor:pointer" onclick="navigate('inventory')">
          <div class="stat-value" style="color:var(--green)">${total.toLocaleString('es-ES')}</div>
          <div class="stat-label">Unidades Totales</div>
        </div>
        <div class="card stat-box animate-in" style="animation-delay:.1s;cursor:pointer" onclick="showToast('${low} artículos con stock bajo','alert-triangle','var(--amber)')">
          <div class="stat-value" style="color:var(--amber)">${low}</div>
          <div class="stat-label">Stock Bajo</div>
        </div>
        <div class="card stat-box animate-in" style="animation-delay:.15s;cursor:pointer" onclick="showToast('${critical} artículo(s) en nivel crítico — Acción requerida','alert-triangle','var(--red)')">
          <div class="stat-value" style="color:var(--red)">${critical}</div>
          <div class="stat-label">Stock Crítico</div>
        </div>
      </div>
      <div class="card animate-in" style="animation-delay:.2s">
        <div class="card-header">
          <div class="card-title"><i data-lucide="package" style="width:15px;height:15px;color:var(--blue)"></i> Artículos en Stock</div>
          <span style="font-size:.72rem;color:var(--text-muted)">Clic en fila → detalle + acciones</span>
        </div>
        <div class="card-body">
          <div class="filter-bar">
            <input class="filter-input" placeholder="Buscar artículo, SKU..." type="text" oninput="filterTable(this,'inv-table',0,1,2)">
            <select class="filter-input" style="min-width:160px" onchange="filterTable(this,'inv-table',7)">
              <option value="">Todos los estados</option>
              <option>OK</option><option>Bajo</option><option>Crítico</option>
            </select>
          </div>
          <div class="table-wrap">
            <table class="data-table" id="inv-table">
              <thead><tr><th>SKU</th><th>Artículo</th><th>Categoría</th><th style="min-width:150px">Stock</th><th>Mín.</th><th>Ud.</th><th>Loc.</th><th>Estado</th><th></th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>`;
  },
  afterRender() { if (window.lucide) lucide.createIcons(); }
};
