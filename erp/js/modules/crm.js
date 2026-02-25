// ============================================================
// CRM Module v2
// ============================================================
const CRMModule = {
  render() {
    const stages = ['Contacto', 'Propuesta', 'Negociación', 'Cierre', 'Perdido'];
    const stColors = { Contacto: 'var(--text-muted)', Propuesta: 'var(--amber)', Negociación: 'var(--blue)', Cierre: 'var(--green)', Perdido: 'var(--red)' };

    const kanbanCols = stages.map(stage => {
      const cards = ERP_DATA.clients.filter(c => c.stage === stage);
      return `
        <div class="kanban-col">
          <div class="kanban-col-header">
            <span class="kanban-col-title" style="color:${stColors[stage]}">${stage}</span>
            <span class="kanban-col-count">${cards.length}</span>
          </div>
          <div class="kanban-cards">
            ${cards.map(c => `
              <div class="kanban-card" onclick="openClientPanel('${c.id}')">
                <div class="kanban-card-name">${c.name}</div>
                <div class="kanban-card-meta">${c.contact}</div>
                ${c.value > 0 ? `<div style="font-size:.75rem;font-weight:700;color:var(--green);margin-top:5px">€${c.value.toLocaleString('es-ES')}</div>` : ''}
              </div>`).join('')}
          </div>
        </div>`;
    }).join('');

    const pipeline = ERP_DATA.clients.reduce((s, c) => s + c.value, 0);
    const closed = ERP_DATA.clients.filter(c => c.stage === 'Cierre').reduce((s, c) => s + c.value, 0);
    const winRate = Math.round(ERP_DATA.clients.filter(c => c.stage === 'Cierre').length /
      ERP_DATA.clients.filter(c => c.stage !== 'Contacto').length * 100);

    return `
      <div class="page-header">
        <div><div class="page-title">CRM</div><div class="page-subtitle">Pipeline de Ventas · ${ERP_DATA.clients.length} clientes</div></div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-glass" onclick="showToast('Exportando pipeline','download','var(--blue)')"><i data-lucide="download" style="width:13px;height:13px"></i> Exportar</button>
          <button class="btn btn-primary" onclick="showToast('Nuevo cliente creado','user-plus','var(--green)')"><i data-lucide="user-plus" style="width:13px;height:13px"></i> Nuevo Cliente</button>
        </div>
      </div>
      <div class="stats-row">
        <div class="card stat-box animate-in" style="cursor:pointer" onclick="showToast('Pipeline total: €${pipeline.toLocaleString(\"es-ES\")}','trending-up','var(--blue)')" >
          <div class="stat-value" style="color:var(--blue)">€${(pipeline/1e6).toFixed(2)}M</div><div class="stat-label">Pipeline Total</div>
        </div >
        <div class="card stat-box animate-in" style="animation-delay:.05s;cursor:pointer">
          <div class="stat-value" style="color:var(--green)">€${(closed/1e3).toFixed(0)}K</div><div class="stat-label">Cerrado</div>
        </div>
        <div class="card stat-box animate-in" style="animation-delay:.1s;cursor:pointer">
          <div class="stat-value" style="color:var(--accent)">${winRate}%</div><div class="stat-label">Win Rate</div>
        </div>
        <div class="card stat-box animate-in" style="animation-delay:.15s;cursor:pointer">
          <div class="stat-value" style="color:var(--amber)">${ERP_DATA.clients.length}</div><div class="stat-label">Contactos</div>
        </div>
      </div >
  <div class="card animate-in" style="animation-delay:.1s">
    <div class="card-header"><div class="card-title"><i data-lucide="columns" style="width:15px;height:15px;color:var(--accent)"></i> Pipeline Kanban</div><span style="font-size:.72rem;color:var(--text-muted)">Clic en tarjeta → historial + acciones</span></div>
    <div class="card-body" style="overflow:hidden">
      <div class="kanban-board">${kanbanCols}</div>
    </div>
  </div>`;
  },
  afterRender() { if(window.lucide) lucide.createIcons(); }
};
