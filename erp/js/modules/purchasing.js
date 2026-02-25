// ============================================================
// Purchasing Module v2
// ============================================================
const PurchasingModule = {
  render() {
    const total = ERP_DATA.purchases.reduce((s, p) => s + p.total, 0);
    const pend = ERP_DATA.purchases.filter(p => p.status === 'Pendiente').length;

    const stMap = { Recibida: 'ok', 'En Tránsito': 'transit', Pendiente: 'low', Aprobada: 'pending', Borrador: 'draft' };
    const rows = ERP_DATA.purchases.map(po => `
      <tr class="clickable" onclick="openPurchasePanel('${po.id}')">
        <td><code style="font-size:.72rem">${po.id}</code></td>
        <td class="bold">${po.supplier}</td>
        <td style="color:var(--text-muted)">${po.date}</td>
        <td style="color:var(--text-muted)">${po.items} artículos</td>
        <td style="font-weight:600;color:var(--text-primary)">€${po.total.toLocaleString('es-ES')}</td>
        <td><span class="badge ${stMap[po.status] || 'draft'}">${po.status}</span></td>
        <td><i data-lucide="chevron-right" style="width:14px;height:14px;color:var(--text-muted)"></i></td>
      </tr>`).join('');

    return `
      <div class="page-header">
        <div><div class="page-title">Compras</div><div class="page-subtitle">Órdenes de Compra · Proveedores</div></div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-glass" onclick="showToast('Informe de compras exportado','download','var(--blue)')"><i data-lucide="download" style="width:13px;height:13px"></i> Exportar</button>
          <button class="btn btn-primary" onclick="showToast('Nueva OC creada','plus','var(--green)')"><i data-lucide="plus" style="width:13px;height:13px"></i> Nueva OC</button>
        </div>
      </div>
      <div class="stats-row">
        <div class="card stat-box animate-in" style="cursor:pointer"><div class="stat-value" style="color:var(--blue)">${ERP_DATA.purchases.length}</div><div class="stat-label">Órdenes Totales</div></div>
        <div class="card stat-box animate-in" style="animation-delay:.05s;cursor:pointer"><div class="stat-value" style="color:var(--amber)">${pend}</div><div class="stat-label">Pendientes Aprobación</div></div>
        <div class="card stat-box animate-in" style="animation-delay:.1s;cursor:pointer"><div class="stat-value" style="color:var(--green)">€${(total / 1e3).toFixed(0)}K</div><div class="stat-label">Gasto Total</div></div>
        <div class="card stat-box animate-in" style="animation-delay:.15s;cursor:pointer"><div class="stat-value" style="color:var(--purple)">${[...new Set(ERP_DATA.purchases.map(p => p.supplier))].length}</div><div class="stat-label">Proveedores Activos</div></div>
      </div>
      <div class="card animate-in" style="animation-delay:.15s">
        <div class="card-header"><div class="card-title"><i data-lucide="shopping-cart" style="width:15px;height:15px;color:var(--amber)"></i> Órdenes de Compra</div><span style="font-size:.72rem;color:var(--text-muted)">Clic → líneas + aprobación</span></div>
        <div class="card-body">
          <div class="filter-bar">
            <input class="filter-input" placeholder="Buscar OC, proveedor..." oninput="filterTable(this,'oc-table',0,1)">
            <select class="filter-input" style="min-width:160px" onchange="filterTable(this,'oc-table',5)">
              <option value="">Todos los estados</option>
              <option>Recibida</option><option>En Tránsito</option><option>Pendiente</option><option>Aprobada</option><option>Borrador</option>
            </select>
          </div>
          <div class="table-wrap">
            <table class="data-table" id="oc-table">
              <thead><tr><th>Nº OC</th><th>Proveedor</th><th>Fecha</th><th>Líneas</th><th>Total</th><th>Estado</th><th></th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>`;
  },
  afterRender() { if (window.lucide) lucide.createIcons(); }
};
