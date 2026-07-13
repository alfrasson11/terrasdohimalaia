// =============================================================
//  Terras do Himalaia – Document Generator
//  All processing is client-side only (LGPD compliant).
// =============================================================

let currentTab = 'procuracao';
const documentSheet = document.getElementById('document-sheet');

// ─── Initialisation ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('p-data').value = today;
    document.getElementById('d-data').value = today;

    initFaq();
    initMasks();
    updateDocuments();
});

// ─── FAQ Accordion ───────────────────────────────────────────
function initFaq() {
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });
            if (!isActive) {
                item.classList.add('active');
                const ans = item.querySelector('.faq-answer');
                ans.style.maxHeight = ans.scrollHeight + 'px';
            }
        });
    });
}

// ─── Input Masks ─────────────────────────────────────────────
function initMasks() {
    // CPF mask: 000.000.000-00
    ['p-cpf', 'd-cpf'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 11);
            if (v.length > 9)      v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
            else if (v.length > 6) v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
            else if (v.length > 3) v = `${v.slice(0,3)}.${v.slice(3)}`;
            e.target.value = v;
            updateDocuments();
        });
    });

    // CEP mask: 00000-000
    ['p-cep', 'd-cep'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 8);
            if (v.length > 5) v = `${v.slice(0,5)}-${v.slice(5)}`;
            e.target.value = v;
            updateDocuments();
        });
    });
}

// ─── Tab Switching ───────────────────────────────────────────
function switchTab(tabName) {
    currentTab = tabName;

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-btn[onclick="switchTab('${tabName}')"]`).classList.add('active');

    document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`form-${tabName}`).classList.add('active');

    // Scroll form body back to top so tabs stay visible
    const scrollBody = document.querySelector('.form-scroll-body');
    if (scrollBody) scrollBody.scrollTop = 0;

    updateDocuments();
}

// ─── Helpers ─────────────────────────────────────────────────
function formatDateLong(dateStr, city) {
    if (!dateStr) return '';
    const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const [y, m, d] = dateStr.split('-');
    const prefix = city ? `${city}/SP, ` : '';
    return `${prefix}${parseInt(d)} de ${months[parseInt(m)-1]} de ${y}`;
}

function dateShort(dateStr) {
    if (!dateStr) return '__/__/____';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

function val(id, fallback) {
    const el = document.getElementById(id);
    return (el && el.value.trim()) ? el.value.trim() : fallback;
}

// ─── Router ──────────────────────────────────────────────────
function updateDocuments() {
    currentTab === 'procuracao' ? renderProcuracao() : renderDesfiliacao();
}

// ─── Procuração Document ─────────────────────────────────────
function renderProcuracao() {
    const nome        = val('p-nome',        '________________________________________');
    const estadoCivil = val('p-estado-civil','Casado');
    const profissao   = val('p-profissao',   '____________________');
    const rg          = val('p-rg',          '____________________');
    const cpf         = val('p-cpf',         '____________________');
    const rua         = val('p-rua',         '____________________________________');
    const num         = val('p-num',         '____');
    const compRaw     = val('p-comp',        '');
    const comp        = compRaw ? `, ${compRaw}` : '';
    const bairro      = val('p-bairro',      'Terras do Himalaia');
    const cidade      = val('p-cidade',      'Bocaina');
    const uf          = val('p-uf',          'SP');
    const cep         = val('p-cep',         '17247-040');
    const email       = val('p-email',       '____________________');
    const dataCidade  = val('p-data-cidade', 'Jaú');
    const dateFormatted = formatDateLong(document.getElementById('p-data').value, dataCidade);

    documentSheet.innerHTML = `
        <!-- Letterhead -->
        <div class="doc-header">
            <svg class="doc-logo-svg" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Scale of Justice SVG -->
                <circle cx="40" cy="40" r="38" stroke="#1f2937" stroke-width="2" fill="#f9fafb"/>
                <!-- Beam -->
                <line x1="20" y1="30" x2="60" y2="30" stroke="#1f2937" stroke-width="2.5" stroke-linecap="round"/>
                <!-- Pillar -->
                <line x1="40" y1="15" x2="40" y2="60" stroke="#1f2937" stroke-width="2.5" stroke-linecap="round"/>
                <!-- Base -->
                <line x1="30" y1="60" x2="50" y2="60" stroke="#1f2937" stroke-width="2.5" stroke-linecap="round"/>
                <!-- Left pan -->
                <path d="M20 30 Q16 38 24 38 Q32 38 28 30" stroke="#1f2937" stroke-width="2" fill="none"/>
                <!-- Right pan -->
                <path d="M60 30 Q56 38 64 38 Q72 38 68 30" stroke="#1f2937" stroke-width="2" fill="none"/>
                <!-- Strings -->
                <line x1="20" y1="30" x2="24" y2="38" stroke="#1f2937" stroke-width="1.5"/>
                <line x1="20" y1="30" x2="16" y2="38" stroke="#1f2937" stroke-width="1.5"/>
                <line x1="60" y1="30" x2="64" y2="38" stroke="#1f2937" stroke-width="1.5"/>
                <line x1="60" y1="30" x2="56" y2="38" stroke="#1f2937" stroke-width="1.5"/>
            </svg>
            <div class="doc-org-name">Advocacia Dr. Romario</div>
        </div>

        <div class="doc-title">PROCURAÇÃO</div>

        <div class="doc-body" style="font-family:'Times New Roman',serif; font-size:11pt; line-height:1.7;">
            <p class="doc-paragraph">
                <strong>OUTORGANTE</strong> – Nome: <strong>${nome}</strong>, estado civil: ${estadoCivil}, profissão: ${profissao}, portador da Cédula de Identidade RG nº ${rg} e inscrito no CPF/MF sob o nº ${cpf}, residente e domiciliado(a) na ${rua}, nº ${num}${comp}, Bairro: ${bairro}, na cidade de ${cidade}/${uf}, CEP: ${cep}, endereço eletrônico: ${email}.
            </p>
            <p class="doc-paragraph">
                <strong>OUTORGADO</strong> –
                <!-- Screen preview: shows abbreviated info only -->
                <span class="screen-only">
                    <strong>ROMARIO ALDROVANDI RUIZ</strong>, advogado, OAB/SP nº 336996.
                    <em style="color:#6b7280; font-size:9pt;">[Os dados completos do advogado serão impressos no PDF]</em>
                </span>
                <!-- Print version: full legal credentials -->
                <span class="print-only">
                    <strong>ROMARIO ALDROVANDI RUIZ</strong>, brasileiro, solteiro, advogado, inscrito na OAB/SP sob o nº 336996, inscrito no CPF/MF sob o nº 400.830.898-96, RG: 46.233.938-5, TÍTULO ELEITORAL 359243800116, PIS/PASEP: 1.904.175.050-1, com escritório profissional na Rua Doutor Alfredo da Costa Cardoso, nº 46, Centro, CEP 17240-071, Bocaina/SP e na Rua Pedro Rochenzel, nº 1480, Chácara Bela Vista, Jaú/SP, CEP 17210-562.
                </span>
            </p>
            <p class="doc-paragraph">
                <strong>PODERES</strong> – pelo presente instrumento o outorgante confere ao outorgado amplos poderes para o foro em geral, com cláusula <strong><em>"ad judicia et extra"</em></strong>, em qualquer Juízo, Instância ou Tribunal, podendo propor contra quem de direito as ações competentes e defendê-lo nas contrárias, seguindo umas e outras até decisão final, usando os recursos legais e acompanhando-os, conferindo-lhe ainda poderes especiais para receber citação inicial, confessar e conhecer a procedência do pedido, desistir, renunciar ao direito sobre que se funda a ação, transigir, firmar compromissos ou acordos, receber e dar quitação, podendo agir em Juízo ou fora dele, assim como substabelecer a outrem, com ou sem reservas de iguais poderes, para agir em conjunto ou separadamente com o substabelecido.
            </p>
            <p class="doc-paragraph">
                <strong>FINALIDADE:</strong> para atuar especificamente junto a Promotoria, Prefeitura, Cartórios e Processos Judiciais.
            </p>
        </div>

        <div class="doc-signatures">
            <div style="margin-top: 20px; font-family:'Times New Roman',serif;">${dateFormatted}</div>
            <div class="doc-sig-line"></div>
            <div class="doc-sig-name">${nome}</div>
            <div class="doc-sig-sub">Outorgante</div>
        </div>

        <div class="doc-footer">
            Rua Doutor Alfredo da Costa Cardoso, nº 46, Centro, Bocaina/SP, CEP 17240-071 |
            Rua Pedro Rochenzel, nº 1480, Chácara Bela Vista, Jaú/SP, CEP 17210-562<br>
            Telefones: (014) 3418-5282 / 99116-1545 &bull; romario.aldrovandi@hotmail.com
        </div>
    `;
}

// ─── Desfiliação Document (official model) ───────────────────
function renderDesfiliacao() {
    const nome       = val('d-nome',        '________________________________________');
    const cpf        = val('d-cpf',         'XXX.XXX.XXX-XX');
    const rua        = val('d-rua',         '____________________________________');
    const num        = val('d-num',         '____');
    const compRaw    = val('d-comp',        '');
    const comp       = compRaw ? `, ${compRaw}` : '';
    const dataCidade = val('d-data-cidade', 'Bocaina');
    const data       = dateShort(document.getElementById('d-data').value);

    documentSheet.innerHTML = `
        <div style="font-family:'Times New Roman',serif; font-size:11pt; line-height:1.7; padding-top:10px;">

            <div style="text-align:center; margin-bottom:20px;">
                <img src="assets/portal-entrada.png" alt="Portal de entrada - Terras do Himalaia" style="width:160px; height:auto;">
            </div>

            <p style="margin-bottom:36px;">
                <strong>À Associação de Moradores do Loteamento Residencial Terras do Himalaia</strong>
            </p>

            <p style="text-align:justify; margin-bottom:20px;">
                Eu, <strong>${nome}</strong>, proprietário do imóvel localizado em ${rua}, ${num}${comp} - <strong>Residencial Terras do Himalaia</strong>, venho, por meio desta, notificar formalmente minha decisão de desfiliar-me da Associação de Moradores do Loteamento Residencial Terras do Himalaia, com efeito imediato a partir do recebimento desta notificação.
            </p>

            <p style="text-align:justify; margin-bottom:20px;">
                A presente manifestação fundamenta-se no direito constitucional de livre associação, previsto no art. 5º, inciso XX da Constituição Federal, que assegura a qualquer cidadão o direito de não permanecer vinculado a entidade associativa contra sua vontade.
            </p>

            <p style="text-align:justify; margin-bottom:20px;">
                Solicito, ainda, a imediata cessação de qualquer cobrança de contribuições, taxas ou encargos associativos relacionados à minha pessoa física ou à minha empresa.
            </p>

            <p style="text-align:justify; margin-bottom:50px;">
                Requeiro que esta notificação seja formalmente recebida e registrada por esta associação, sob pena de adoção das medidas judiciais cabíveis para resguardar meus direitos.
            </p>

            <p style="margin-bottom:4px;">Atenciosamente,</p>
            <p style="margin-bottom:4px;">${nome}</p>
            <p style="margin-bottom:24px;">CPF: &nbsp;${cpf}</p>

            <p style="margin-bottom:70px;">${dataCidade}, ${data}</p>

            <div style="width:280px; border-top:1px solid #111827; margin-bottom:6px;"></div>
            <p style="font-size:10pt;">Assinatura</p>
        </div>
    `;
}

// ─── Print Trigger ───────────────────────────────────────────
function printDoc() {
    window.print();
}
