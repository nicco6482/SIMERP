// ============================================================
// Settings Module — Company · Modules · Integrations · Users
// ============================================================
const SettingsModule = {
    currentTab: 'company',

    render() {
        return `
      <div class="page-header">
        <div>
          <div class="page-title">Configuración</div>
          <div class="page-subtitle">Empresa · Módulos · Integraciones · Usuarios · Seguridad</div>
        </div>
        <button class="btn btn-primary" onclick="showToast('Configuración guardada','save','var(--green)')"><i data-lucide="save" style="width:14px;height:14px"></i> Guardar Cambios</button>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap">
        ${[['company', 'building', 'Empresa'], ['modules', 'layout', 'Módulos'], ['integrations', 'plug', 'Integraciones'], ['users', 'users', 'Usuarios'], ['security', 'shield', 'Seguridad'], ['audit', 'list', 'Auditoría']].map(([k, icon, label]) => `
          <button class="btn ${this.currentTab === k ? 'btn-primary' : 'btn-glass'}" data-stab="${k}" onclick="SettingsModule.switchTab('${k}')">
            <i data-lucide="${icon}" style="width:14px;height:14px"></i> ${label}
          </button>`).join('')}
      </div>
      <div id="settings-content" class="animate-in"></div>`;
    },

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('[data-stab]').forEach(b => {
            b.className = `btn ${b.dataset.stab === tab ? 'btn-primary' : 'btn-glass'}`;
        });
        const c = document.getElementById('settings-content');
        if (!c) return;
        c.className = 'animate-in'; void c.offsetWidth;
        const fn = {
            company: () => this.renderCompany(), modules: () => this.renderModules(),
            integrations: () => this.renderIntegrations(), users: () => this.renderUsers(),
            security: () => this.renderSecurity(), audit: () => this.renderAudit()
        };
        c.innerHTML = (fn[tab] || fn.company)();
        if (window.lucide) lucide.createIcons();
    },

    renderCompany() {
        const co = ERP_DATA.settings.company;
        return `<div class="card"><div class="card-header"><div class="card-title"><i data-lucide="building" style="width:16px;height:16px;color:var(--blue)"></i> Datos de la Empresa</div></div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
          ${[['Razón Social', co.name], ['NIF / CIF', co.nif], ['País', co.country], ['Moneda', co.currency], ['Zona Horaria', co.timezone], ['Año Fiscal', co.fiscalYear]].map(([l, v]) => `
            <div><div style="font-size:.72rem;color:var(--text-muted);margin-bottom:5px;text-transform:uppercase;letter-spacing:.05em">${l}</div>
              <input class="filter-input" style="width:100%" value="${v}" onchange="showToast('Campo actualizado: ${l}','edit-3','var(--blue)')"></div>`).join('')}
        </div>
        <div class="info-box"><strong>Plan:</strong> Enterprise · 234 usuarios · 50 GB de datos · SLA 99.99%</div>
      </div></div>`;
    },

    renderModules() {
        const mods = ERP_DATA.settings.modules;
        return `<div class="card"><div class="card-header"><div class="card-title"><i data-lucide="layout" style="width:16px;height:16px;color:var(--purple)"></i> Módulos del Sistema</div></div>
      <div class="card-body">
        ${mods.map(m => `
          <div class="alert-item" style="margin-bottom:8px;cursor:pointer" onclick="showToast('${m.enabled ? 'Módulo ' + m.name + ' desactivado' : 'Módulo ' + m.name + ' activado'}','toggle-left','${m.enabled ? 'var(--amber)' : 'var(--green)'}')" >
            <div class="alert-dot ${m.enabled ? 'ok' : 'high'}"></div>
            <div style="flex:1">
              <div style="font-size:.84rem;font-weight:600;color:var(--text-primary)">${m.name}</div>
              <div style="font-size:.72rem;color:var(--text-muted)">${m.plan}</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <span class="badge ${m.enabled ? 'ok' : 'critical'}">${m.enabled ? 'Activo' : 'Inactivo'}</span>
              <div style="width:36px;height:20px;border-radius:10px;background:${m.enabled ? 'var(--green)' : 'rgba(255,255,255,.1)'};position:relative;cursor:pointer;transition:background .3s">
                <div style="position:absolute;top:3px;${m.enabled ? 'right:3px' : 'left:3px'};width:14px;height:14px;border-radius:50%;background:#fff;transition:all .3s"></div>
              </div>
            </div>
          </div>`).join('')}
      </div></div>`;
    },

    renderIntegrations() {
        return `<div class="card"><div class="card-header"><div class="card-title"><i data-lucide="plug" style="width:16px;height:16px;color:var(--amber)"></i> Integraciones Externas</div></div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">
          ${ERP_DATA.settings.integrations.map(int => `
            <div class="card" style="padding:14px;cursor:pointer" onclick="showToast('${int.status === 'conectado' ? 'Desconectando' : 'Conectando'}: ${int.name}','${int.icon}','${int.status === 'conectado' ? 'var(--red)' : 'var(--green)'}')">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
                <div style="width:36px;height:36px;border-radius:8px;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center">
                  <i data-lucide="${int.icon}" style="width:18px;height:18px;color:var(--blue)"></i>
                </div>
                <div style="flex:1"><div style="font-size:.84rem;font-weight:600;color:var(--text-primary)">${int.name}</div>
                  <div style="font-size:.7rem;color:var(--text-muted)">Última sync: ${int.lastSync}</div>
                </div>
                <span class="badge ${int.status === 'conectado' ? 'ok' : 'critical'}">${int.status === 'conectado' ? '✓ Conectado' : '✗ Desconectado'}</span>
              </div>
              <button class="btn btn-glass" style="width:100%;font-size:.75rem;padding:6px" onclick="event.stopPropagation();showToast('${int.name} ${int.status === 'conectado' ? 'desconectado' : 'conectado'}','plug','${int.status === 'conectado' ? 'var(--red)' : 'var(--green)'}')">${int.status === 'conectado' ? 'Desconectar' : 'Conectar'}</button>
            </div>`).join('')}
        </div>
      </div></div>`;
    },

    renderUsers() {
        const rows = ERP_DATA.settings.users.map(u => `
      <tr class="clickable" onclick="showToast('Editando usuario: ${u.name}','user','var(--purple)')">
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--purple));display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;color:#fff;flex-shrink:0">${u.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
            <span class="bold">${u.name}</span>
          </div>
        </td>
        <td style="color:var(--blue)">${u.email}</td>
        <td><span class="badge transit">${u.role}</span></td>
        <td><span class="badge ${u.status === 'activo' ? 'ok' : 'critical'}">${u.status}</span></td>
        <td style="color:var(--text-muted);font-size:.78rem">${u.lastLogin}</td>
        <td>
          <button class="btn btn-glass" style="padding:4px 10px;font-size:.72rem" onclick="event.stopPropagation();showToast('Acceso editado para ${u.name}','edit-3','var(--blue)')">Editar</button>
        </td>
      </tr>`).join('');
        return `<div class="card">
      <div class="card-header"><div class="card-title"><i data-lucide="users" style="width:16px;height:16px;color:var(--blue)"></i> Gestión de Usuarios</div>
        <button class="btn btn-primary" style="padding:6px 14px;font-size:.78rem" onclick="showToast('Invitación enviada','user-plus','var(--green)')"><i data-lucide="user-plus" style="width:13px;height:13px"></i> Invitar</button>
      </div>
      <div class="card-body"><div class="table-wrap"><table class="data-table">
        <thead><tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Estado</th><th>Último Acceso</th><th>Acción</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div></div></div>`;
    },

    renderSecurity() {
        const pillars = [
            { icon: 'shield', color: 'var(--blue)', title: 'Zero Trust Network', desc: 'Cada solicitud verificada sin importar origen. mTLS entre microservicios. SPIFFE/SPIRE identidad de carga de trabajo.' },
            { icon: 'key', color: 'var(--purple)', title: 'CRYSTALS-Kyber / Dilithium', desc: 'Cifrado post-cuántico implementado en todas las comunicaciones. Resistente a ataques de computación cuántica (NIST PQC).' },
            { icon: 'eye', color: 'var(--green)', title: 'OpenTelemetry SIEM', desc: 'Trazas distribuidas, métricas y logs unificados. Detección de amenazas con IA en tiempo real. MTTR < 5 min.' },
            { icon: 'lock', color: 'var(--amber)', title: 'GDPR + SOX + ISO 27001', desc: 'Compliance automatizado con auditorías continuas. Datos personales cifrados. Retención configurable por región.' },
        ];
        return `
      <div class="info-box"><strong>Estado de Seguridad:</strong> ✅ Zero Critical Vulnerabilities · Last Pen Test: 2026-01-15 · Next: 2026-04-15</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px" >
        ${pillars.map(p => `
          <div class="card" style="padding:18px;border-left:3px solid ${p.color}">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
              <div style="width:36px;height:36px;border-radius:10px;background:${p.color}1a;display:flex;align-items:center;justify-content:center;color:${p.color}"><i data-lucide="${p.icon}" style="width:18px;height:18px"></i></div>
              <div style="font-size:.88rem;font-weight:700;color:var(--text-primary)">${p.title}</div>
            </div>
            <div style="font-size:.78rem;color:var(--text-secondary);line-height:1.7">${p.desc}</div>
          </div>`).join('')}
      </div>`;
    },

    renderAudit() {
        const logs = [
            { user: 'Carlos Ejecutivo', action: 'Aprobó OC PO-3847', module: 'Compras', time: '23:15:02', ip: '192.168.1.1' },
            { user: 'Ana Ruiz', action: 'Creó cliente C-008', module: 'CRM', time: '22:48:11', ip: '192.168.1.45' },
            { user: 'Miguel Torres', action: 'Exportó informe P&L Feb.', module: 'Contabilidad', time: '22:12:30', ip: '192.168.1.22' },
            { user: 'Sistema IA', action: 'Generó insight de churn Q1', module: 'Analytics', time: '21:00:00', ip: 'internal' },
            { user: 'Laura García', action: 'Alta de empleado E-010', module: 'RRHH', time: '20:35:47', ip: '192.168.1.10' },
            { user: 'Jorge Blanco', action: 'Actualización de módulo v2.1', module: 'Sistema', time: '19:00:00', ip: '192.168.1.99' },
        ];
        const rows = logs.map(l => `<tr>
      <td style="color:var(--text-primary);font-weight:500">${l.user}</td>
      <td>${l.action}</td>
      <td><span class="badge transit">${l.module}</span></td>
      <td style="font-family:monospace;color:var(--text-muted);font-size:.76rem">${l.time}</td>
      <td style="font-family:monospace;color:var(--text-muted);font-size:.76rem">${l.ip}</td>
    </tr>`).join('');
        return `<div class="card">
      <div class="card-header"><div class="card-title"><i data-lucide="list" style="width:16px;height:16px;color:var(--amber)"></i> Log de Auditoría — Hoy 25/02/2026</div>
        <button class="btn btn-glass" style="padding:5px 12px;font-size:.75rem" onclick="showToast('Log exportado en CSV','download','var(--blue)')"><i data-lucide="download" style="width:13px;height:13px"></i> CSV</button>
      </div>
      <div class="card-body"><div class="table-wrap"><table class="data-table">
        <thead><tr><th>Usuario</th><th>Acción</th><th>Módulo</th><th>Hora</th><th>IP</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div></div></div>`;
    },

    afterRender() { this.switchTab('company'); if (window.lucide) lucide.createIcons(); }
};
