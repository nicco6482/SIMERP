// ============================================================
// NexusERP 2026 — App Router + Panel System v2
// ============================================================

/* ── Module registry ────────────────────────────────────────── */
const modules = {
  dashboard: { mod: () => DashboardModule, label: 'Dashboard', icon: 'layout-dashboard' },
  inventory: { mod: () => InventoryModule, label: 'Inventario', icon: 'package' },
  crm: { mod: () => CRMModule, label: 'CRM', icon: 'users' },
  accounting: { mod: () => AccountingModule, label: 'Contabilidad', icon: 'receipt' },
  hr: { mod: () => HRModule, label: 'RRHH', icon: 'briefcase' },
  purchasing: { mod: () => PurchasingModule, label: 'Compras', icon: 'shopping-cart' },
  production: { mod: () => ProductionModule, label: 'Producción', icon: 'cpu' },
  logistics: { mod: () => LogisticsModule, label: 'Logística', icon: 'truck' },
  analytics: { mod: () => AnalyticsModule, label: 'Analytics & BI', icon: 'bar-chart-2' },
  schema: { mod: () => SchemaModule, label: 'ERD & API Schema', icon: 'database' },
  flow: { mod: () => FlowModule, label: 'Arq. & Roadmap', icon: 'git-branch' },
  settings: { mod: () => SettingsModule, label: 'Configuración', icon: 'settings' },
};

let activeModule = 'dashboard';
let activeModInstance = null;

/* ── Navigation ─────────────────────────────────────────────── */
function navigate(key) {
  if (!modules[key]) return;
  closePanel();
  activeModule = key;

  if (activeModInstance && activeModInstance.destroyCharts) activeModInstance.destroyCharts();
  if (activeModInstance && activeModInstance.chartInstances) {
    activeModInstance.chartInstances.forEach(c => c.destroy());
    activeModInstance.chartInstances = [];
  }

  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.key === key);
  });

  const titleEl = document.getElementById('topbar-title');
  if (titleEl) titleEl.textContent = modules[key].label;

  const instance = modules[key].mod();
  activeModInstance = instance;
  const content = document.getElementById('module-content');
  content.innerHTML = `<div class="module-view">${instance.render()}</div>`;

  requestAnimationFrame(() => {
    if (instance.afterRender) instance.afterRender();
    if (window.lucide) lucide.createIcons();
  });
}

/* ── Table filter helper ─────────────────────────────────────── */
function filterTable(input, tableId, ...cols) {
  const val = (input.value || input.options?.[input.selectedIndex]?.text || '').toLowerCase().trim();
  const rows = document.querySelectorAll(`#${tableId} tbody tr`);
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const match = !val || val === 'todos los estados' || cols.some(c => cells[c]?.textContent.toLowerCase().includes(val));
    row.style.display = match ? '' : 'none';
  });
}

/* ── Mobile sidebar ──────────────────────────────────────────── */
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
}

/* ── KPI Counter Animation ───────────────────────────────────── */
function animateCounter(el, target, prefix = '', suffix = '', duration = 1400) {
  if (!el) return;
  const start = performance.now();
  const isFloat = typeof target === 'number' && target < 200 && String(target).includes('.');
  function step(now) {
    const pct = Math.min((now - start) / duration, 1);
    const ease = pct < 0.5 ? 2 * pct * pct : -1 + (4 - 2 * pct) * pct;
    const cur = isFloat
      ? (ease * target).toFixed(1)
      : Math.floor(ease * target).toLocaleString('es-ES');
    el.textContent = prefix + cur + suffix;
    if (pct < 1) requestAnimationFrame(step);
    else el.textContent = prefix + (isFloat ? target.toFixed(1) : Number(target).toLocaleString('es-ES')) + suffix;
  }
  requestAnimationFrame(step);
}

/* ── Ripple effect ───────────────────────────────────────────── */
function addRipple(el, e) {
  const r = document.createElement('span');
  r.className = 'ripple-effect';
  const rect = el.getBoundingClientRect();
  r.style.left = (e.clientX - rect.left) + 'px';
  r.style.top = (e.clientY - rect.top) + 'px';
  el.classList.add('ripple-container');
  el.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}

/* ── Toast Notification ──────────────────────────────────────── */
let toastTimeout;
function showToast(msg, icon = 'check-circle', color = 'var(--green)') {
  let t = document.getElementById('erp-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'erp-toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.innerHTML = `<i data-lucide="${icon}" style="width:16px;height:16px;color:${color}" class="toast-icon"></i><div class="toast-msg">${msg}</div>`;
  if (window.lucide) lucide.createIcons();
  clearTimeout(toastTimeout);
  t.classList.add('show');
  toastTimeout = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ── Detail Panel System ─────────────────────────────────────── */
function openPanel(html, title, subtitle, iconColor = 'var(--accent)', iconName = 'info') {
  let overlay = document.getElementById('panel-overlay');
  let panel = document.getElementById('detail-panel');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'panel-overlay';
    overlay.className = 'panel-overlay';
    overlay.onclick = closePanel;
    document.body.appendChild(overlay);
  }
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'detail-panel';
    panel.className = 'detail-panel';
    document.body.appendChild(panel);
  }

  panel.innerHTML = `
    <div class="panel-header">
      <div class="panel-header-icon" style="background:${iconColor}1a;color:${iconColor}">
        <i data-lucide="${iconName}" style="width:18px;height:18px"></i>
      </div>
      <div>
        <div class="panel-title">${title}</div>
        <div class="panel-subtitle">${subtitle}</div>
      </div>
      <div class="panel-close" onclick="closePanel()">
        <i data-lucide="x" style="width:14px;height:14px"></i>
      </div>
    </div>
    <div class="panel-body">${html}</div>`;

  if (window.lucide) lucide.createIcons();
  requestAnimationFrame(() => {
    overlay.classList.add('visible');
    panel.classList.add('open');
  });
}

function closePanel() {
  const overlay = document.getElementById('panel-overlay');
  const panel = document.getElementById('detail-panel');
  if (overlay) overlay.classList.remove('visible');
  if (panel) panel.classList.remove('open');
}

/* ── Panel Builders ──────────────────────────────────────────── */

function openInventoryPanel(sku) {
  const p = ERP_DATA.inventory.find(x => x.sku === sku);
  if (!p) return;
  const max = Math.max(p.min * 4, p.qty + 1);
  const pct = Math.min(Math.round((p.qty / max) * 100), 100);
  const color = p.status === 'critical' ? 'var(--red)' : p.status === 'low' ? 'var(--amber)' : 'var(--green)';
  const circ = 2 * Math.PI * 40;

  const html = `
    <div class="panel-section">
      <div style="text-align:center;background:${color}0d;border:1px solid ${color}22;border-radius:var(--r-lg);padding:20px;margin-bottom:4px">
        <div class="ring-wrap">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle class="ring-track" cx="50" cy="50" r="40" stroke-width="7"/>
            <circle class="ring-fill" cx="50" cy="50" r="40" stroke-width="7"
              stroke="${color}" stroke-dasharray="${circ}" stroke-dashoffset="${circ - (pct / 100) * circ}"/>
          </svg>
          <div style="position:absolute;text-align:center">
            <div style="font-size:1.4rem;font-weight:800;color:${color}">${pct}%</div>
            <div style="font-size:.63rem;color:var(--text-muted)">stock</div>
          </div>
        </div>
        <div style="font-size:.7rem;color:${color};text-transform:uppercase;letter-spacing:.08em;font-weight:700">${p.status === 'critical' ? '⚠ CRÍTICO' : p.status === 'low' ? '↓ BAJO' : '✓ NORMAL'}</div>
      </div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Artículo</div>
      <div class="panel-row"><span class="panel-row-label">SKU</span><code>${p.sku}</code></div>
      <div class="panel-row"><span class="panel-row-label">Nombre</span><span class="panel-row-value">${p.name}</span></div>
      <div class="panel-row"><span class="panel-row-label">Categoría</span><span class="panel-row-value">${p.cat}</span></div>
      <div class="panel-row"><span class="panel-row-label">Ubicación</span><code>${p.loc}</code></div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Niveles de Stock</div>
      <div class="panel-row">
        <span class="panel-row-label">Stock Actual</span>
        <span class="panel-row-value" style="color:${color};font-size:1rem;font-weight:700">${p.qty.toLocaleString('es-ES')} ${p.unit}</span>
      </div>
      <div class="panel-row"><span class="panel-row-label">Mínimo</span><span class="panel-row-value">${p.min.toLocaleString('es-ES')} ${p.unit}</span></div>
      <div style="margin-top:8px">
        <div class="stock-bar-wrap"><div class="stock-bar-fill" style="width:${pct}%;background:${color}"></div></div>
      </div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Últimos Movimientos</div>
      ${[
      { dir: 'entrada', qty: 200, date: '2026-02-20', ref: 'PO-3840' },
      { dir: 'salida', qty: 45, date: '2026-02-22', ref: 'PED-00843' },
      { dir: 'salida', qty: 12, date: '2026-02-24', ref: 'PED-00846' },
    ].map(m => `
        <div class="panel-row">
          <span class="panel-row-label" style="color:${m.dir === 'entrada' ? 'var(--green)' : 'var(--red)'}">${m.dir === 'entrada' ? '▲' : '▼'} ${m.dir.charAt(0).toUpperCase() + m.dir.slice(1)}</span>
          <span class="panel-row-value">${m.qty} ${p.unit} · ${m.date}</span>
        </div>`).join('')}
    </div>
    <div class="panel-actions">
      <button class="btn btn-primary" onclick="showToast('OC creada para ${p.sku}','shopping-cart','var(--green)')"><i data-lucide="plus" style="width:13px;height:13px"></i> Crear OC</button>
      <button class="btn btn-glass" onclick="showToast('Stock ajustado','check','var(--blue)')"><i data-lucide="edit-3" style="width:13px;height:13px"></i> Ajustar</button>
      <button class="btn btn-glass" onclick="showToast('QR generado','qr-code','var(--purple)')"><i data-lucide="qr-code" style="width:13px;height:13px"></i> QR</button>
    </div>`;

  openPanel(html, p.name, `${p.sku} · ${p.cat}`, color, 'package');
  if (window.lucide) lucide.createIcons();
}

function openClientPanel(id) {
  const c = ERP_DATA.clients.find(x => x.id === id);
  if (!c) return;
  const stColors = { Contacto: 'var(--text-muted)', Propuesta: 'var(--amber)', Negociación: 'var(--blue)', Cierre: 'var(--green)', Perdido: 'var(--red)' };
  const color = stColors[c.stage] || 'var(--accent)';

  const html = `
    <div class="panel-section">
      <div style="text-align:center;padding:20px;background:rgba(255,255,255,.02);border:1px solid var(--border-subtle);border-radius:var(--r-lg)">
        <div style="width:52px;height:52px;border-radius:var(--r-lg);background:linear-gradient(135deg,var(--accent),var(--purple));display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:800;color:#fff;margin:0 auto 10px">${c.name[0]}</div>
        <div style="font-size:1rem;font-weight:700;color:var(--text-primary)">${c.name}</div>
        <div style="margin-top:6px"><span class="badge" style="background:${color}18;color:${color};border-color:${color}33">${c.stage}</span></div>
        ${c.value > 0 ? `<div style="font-size:1.6rem;font-weight:800;color:var(--green);margin-top:10px;letter-spacing:-.03em">€${c.value.toLocaleString('es-ES')}</div><div style="font-size:.68rem;color:var(--text-muted)">Valor del deal</div>` : ''}
      </div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Contacto</div>
      <div class="panel-row"><span class="panel-row-label">Nombre</span><span class="panel-row-value">${c.contact}</span></div>
      <div class="panel-row"><span class="panel-row-label">Email</span><a href="mailto:${c.email}" style="color:var(--blue);font-size:.78rem;text-decoration:none">${c.email}</a></div>
      <div class="panel-row"><span class="panel-row-label">Teléfono</span><span class="panel-row-value">${c.phone}</span></div>
      <div class="panel-row"><span class="panel-row-label">ID</span><code>${c.id}</code></div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Actividad Reciente</div>
      ${[
      { action: 'Reunión de negociación', date: '2026-02-20', user: 'A. Ruiz' },
      { action: 'Propuesta enviada', date: '2026-02-14', user: 'A. Ruiz' },
      { action: 'Primer contacto', date: '2026-02-01', user: 'M. González' },
    ].map(a => `
        <div class="panel-row">
          <span class="panel-row-label">${a.date}</span>
          <div style="text-align:right"><div style="font-size:.8rem;color:var(--text-primary)">${a.action}</div><div style="font-size:.7rem;color:var(--text-muted)">${a.user}</div></div>
        </div>`).join('')}
    </div>
    <div class="panel-actions">
      <button class="btn btn-primary" onclick="showToast('Actividad registrada','plus','var(--green)')"><i data-lucide="plus" style="width:13px;height:13px"></i> Actividad</button>
      <button class="btn btn-glass" onclick="showToast('Propuesta enviada a ${c.email}','send','var(--blue)')"><i data-lucide="send" style="width:13px;height:13px"></i> Propuesta</button>
    </div>`;

  openPanel(html, c.name, `${c.stage} · ${c.id}`, color, 'user');
  if (window.lucide) lucide.createIcons();
}

function openInvoicePanel(id) {
  const f = ERP_DATA.invoices.find(x => x.id === id);
  if (!f) return;
  const stColors = { Cobrada: 'var(--green)', Pendiente: 'var(--amber)', Vencida: 'var(--red)', Emitida: 'var(--blue)' };
  const color = stColors[f.status] || 'var(--blue)';
  const base = (f.amount / 1.21).toFixed(2);
  const iva = (f.amount - Number(base)).toFixed(2);

  const html = `
    <div class="panel-section">
      <div style="text-align:center;background:${color}0d;border:1px solid ${color}22;border-radius:var(--r-lg);padding:20px">
        <div style="font-family:var(--font-mono);font-size:.9rem;font-weight:700;color:${color}">${f.id}</div>
        <div style="font-size:2.2rem;font-weight:800;color:var(--text-primary);letter-spacing:-.04em;margin:6px 0">€${f.amount.toLocaleString('es-ES')}</div>
        <span class="badge" style="background:${color}18;color:${color};border-color:${color}33">${f.status}</span>
      </div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Desglose Fiscal</div>
      <div class="panel-row"><span class="panel-row-label">Base Imponible</span><span class="panel-row-value">€${Number(base).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span></div>
      <div class="panel-row"><span class="panel-row-label">IVA 21%</span><span class="panel-row-value">€${Number(iva).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span></div>
      <div class="panel-row"><span class="panel-row-label">Total</span><span class="panel-row-value" style="font-size:.95rem;font-weight:700;color:var(--green)">€${f.amount.toLocaleString('es-ES')}</span></div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Datos de Factura</div>
      <div class="panel-row"><span class="panel-row-label">Cliente</span><span class="panel-row-value">${f.client}</span></div>
      <div class="panel-row"><span class="panel-row-label">Emisión</span><span class="panel-row-value">${f.date}</span></div>
      <div class="panel-row"><span class="panel-row-label">Vencimiento</span><span class="panel-row-value" style="color:${f.status === 'Vencida' ? 'var(--red)' : 'inherit'}">${f.due}</span></div>
    </div>
    <div class="panel-actions">
      <button class="btn btn-primary" onclick="showToast('PDF generado','download','var(--green)')"><i data-lucide="download" style="width:13px;height:13px"></i> PDF</button>
      ${f.status !== 'Cobrada' ? `<button class="btn btn-glass" onclick="showToast('Recordatorio enviado','mail','var(--blue)')"><i data-lucide="mail" style="width:13px;height:13px"></i> Recordatorio</button>` : ''}
      ${f.status === 'Pendiente' || f.status === 'Vencida' ? `<button class="btn btn-glass" onclick="showToast('Cobro registrado ✓','check-circle','var(--green)')"><i data-lucide="check-circle" style="width:13px;height:13px"></i> Cobrada</button>` : ''}
    </div>`;

  openPanel(html, f.id, `${f.client} · ${f.date}`, color, 'file-text');
  if (window.lucide) lucide.createIcons();
}

function openEmployeePanel(id) {
  const e = ERP_DATA.employees.find(x => x.id === id);
  if (!e) return;
  const initials = e.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  const years = new Date().getFullYear() - new Date(e.start).getFullYear();

  const html = `
    <div class="panel-section">
      <div style="text-align:center;background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.18);border-radius:var(--r-lg);padding:20px">
        <div style="width:56px;height:56px;border-radius:var(--r-lg);background:linear-gradient(135deg,var(--accent),var(--purple));display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:800;color:#fff;margin:0 auto 10px">${initials}</div>
        <div style="font-size:1rem;font-weight:700;color:var(--text-primary)">${e.name}</div>
        <div style="font-size:.8rem;color:var(--text-muted);margin-top:3px">${e.role}</div>
        <div style="margin-top:8px"><span class="badge ${e.status === 'Activo' ? 'active' : 'inactive'}">${e.status}</span></div>
        <div style="font-size:.72rem;color:var(--text-muted);margin-top:8px">${years} año${years !== 1 ? 's' : ''} en la empresa</div>
      </div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Información Laboral</div>
      <div class="panel-row"><span class="panel-row-label">ID</span><code>${e.id}</code></div>
      <div class="panel-row"><span class="panel-row-label">Departamento</span><span class="panel-row-value">${e.dept}</span></div>
      <div class="panel-row"><span class="panel-row-label">Cargo</span><span class="panel-row-value">${e.role}</span></div>
      <div class="panel-row"><span class="panel-row-label">Fecha Alta</span><span class="panel-row-value">${e.start}</span></div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Indicadores de Desempeño</div>
      ${[
      { label: 'Satisfacción', val: 82, color: 'var(--green)' },
      { label: 'Rendimiento', val: 91, color: 'var(--blue)' },
      { label: 'Riesgo Fuga', val: 14, color: 'var(--amber)' },
    ].map(i => `
        <div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:.75rem;margin-bottom:4px">
            <span style="color:var(--text-muted)">${i.label}</span>
            <span style="color:${i.color};font-weight:700">${i.val}%</span>
          </div>
          <div class="stock-bar-wrap"><div class="stock-bar-fill" style="width:${i.val}%;background:${i.color}"></div></div>
        </div>`).join('')}
    </div>
    <div class="panel-actions">
      <button class="btn btn-primary" onclick="showToast('Editando ficha de ${e.name}','edit-3','var(--accent)')"><i data-lucide="edit-3" style="width:13px;height:13px"></i> Editar</button>
      <button class="btn btn-glass" onclick="showToast('Evaluación iniciada','clipboard','var(--blue)')"><i data-lucide="clipboard" style="width:13px;height:13px"></i> Evaluar</button>
    </div>`;

  openPanel(html, e.name, `${e.role} · ${e.dept}`, 'var(--purple)', 'user');
  if (window.lucide) lucide.createIcons();
}

function openPurchasePanel(id) {
  const po = ERP_DATA.purchases.find(x => x.id === id);
  if (!po) return;
  const stColors = { Recibida: 'var(--green)', 'En Tránsito': 'var(--blue)', Pendiente: 'var(--amber)', Aprobada: 'var(--cyan)', Borrador: 'var(--text-muted)' };
  const color = stColors[po.status] || 'var(--blue)';

  const fakeLines = Array.from({ length: Math.min(po.items, 6) }, (_, i) => ({
    sku: `SKU-${1000 + i * 11}`,
    name: ['Chapa Acero A-36', 'Perfil HEB 200', 'Motor 5.5kW', 'Tornillo M8x25', 'Panel PLC v2', 'Sensor Temp'][i % 6],
    qty: 10 + i * 15,
    price: 50 + i * 80,
  }));

  const lines = fakeLines.map(l => `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)">
      <div><div style="font-size:.8rem;color:var(--text-primary);font-weight:500">${l.name}</div><code style="font-size:.68rem">${l.sku}</code></div>
      <div style="text-align:right"><div style="font-size:.78rem;color:var(--text-secondary)">${l.qty} ud · €${l.price}/ud</div><div style="font-size:.78rem;color:var(--green);font-weight:600">€${(l.qty * l.price).toLocaleString('es-ES')}</div></div>
    </div>`).join('');

  const html = `
    <div class="panel-section">
      <div style="text-align:center;background:${color}0d;border:1px solid ${color}22;border-radius:var(--r-lg);padding:18px">
        <div style="font-family:var(--font-mono);font-size:.88rem;font-weight:700;color:${color}">${po.id}</div>
        <div style="font-size:2rem;font-weight:800;color:var(--text-primary);letter-spacing:-.04em;margin:6px 0">€${po.total.toLocaleString('es-ES')}</div>
        <span class="badge" style="background:${color}18;color:${color};border-color:${color}33">${po.status}</span>
      </div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Datos del Pedido</div>
      <div class="panel-row"><span class="panel-row-label">Proveedor</span><span class="panel-row-value">${po.supplier}</span></div>
      <div class="panel-row"><span class="panel-row-label">Fecha</span><span class="panel-row-value">${po.date}</span></div>
      <div class="panel-row"><span class="panel-row-label">Total</span><span class="panel-row-value" style="color:var(--green);font-weight:700">€${po.total.toLocaleString('es-ES')}</span></div>
    </div>
    <div class="panel-section">
      <div class="panel-section-title">Líneas de Pedido (${po.items})</div>
      ${lines}
    </div>
    <div class="panel-actions">
      ${po.status === 'Pendiente' ? `<button class="btn btn-primary" onclick="showToast('OC ${po.id} aprobada ✓','check-circle','var(--green)')"><i data-lucide="check-circle" style="width:13px;height:13px"></i> Aprobar</button>` : ''}
      <button class="btn btn-glass" onclick="showToast('PDF generado','download','var(--blue)')"><i data-lucide="download" style="width:13px;height:13px"></i> PDF</button>
      <button class="btn btn-glass" onclick="showToast('Email enviado a ${po.supplier}','mail','var(--purple)')"><i data-lucide="mail" style="width:13px;height:13px"></i> Contactar</button>
    </div>`;

  openPanel(html, po.id, `${po.supplier} · ${po.date}`, color, 'shopping-cart');
  if (window.lucide) lucide.createIcons();
}

/* ── Keyboard shortcuts ──────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePanel();
});

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Chart global defaults — matching new design
  if (window.Chart) {
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(17,17,39,0.96)';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.titleColor = '#f1f5f9';
    Chart.defaults.plugins.tooltip.bodyColor = '#94a3b8';
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.animation.duration = 700;
    Chart.defaults.animation.easing = 'easeInOutQuart';
  }
  if (window.lucide) lucide.createIcons();
  buildSearchIndex();
  navigate('dashboard');
});
