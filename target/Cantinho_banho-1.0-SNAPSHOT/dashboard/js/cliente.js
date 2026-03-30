let editCliId = null;
let listaClientes = [];

carregarClientesDoBanco();

async function carregarClientesDoBanco() {
    try {
        const resposta = await fetch('../api/clientes/listar');
        if (!resposta.ok)
            throw new Error("Erro ao carregar clientes");

        listaClientes = await resposta.json();

        if (typeof renderClientes === 'function') {
            renderClientes();
        }
    } catch (erro) {
        console.error(erro);
    }
}

function renderClientes() {
    const busca = (document.getElementById('busca-clientes')?.value || '').toLowerCase();

    const lista = listaClientes.filter(c => {
        const textoPets = (c.pets && c.pets.length > 0) ? c.pets.map(p => p.nome).join(' ') : '';
        const telefoneBusca = c.telefone || '';
        return (c.nome + ' ' + textoPets + ' ' + telefoneBusca).toLowerCase().includes(busca);
    });

    const el = document.getElementById('lista-clientes');
    if (!el) {
        console.error("A div 'lista-clientes' não foi encontrada no HTML!");
        return;
    }

    if (!lista.length) {
        el.innerHTML = `<div class="empty-state" style="padding: 20px; text-align: center; color: #888;">Nenhum cliente cadastrado ainda</div>`;
        return;
    }

    el.innerHTML = lista.map(c => {
        const pac = pacotes.find(p => p.id === c.pacoteId);
        const pendServ = c.servicos?.filter(s => !s.usado).length || 0;
        const usadoServ = c.servicos?.filter(s => s.usado).length || 0;
        const totalServ = c.servicos?.length || 0;
        const pct = totalServ ? Math.round((usadoServ / totalServ) * 100) : 0;

        const badgeVinculo = c.temUsuario
                ? `<span class="badge" style="background-color: #5ac75a; color: #fff; font-size: 0.7rem; padding: 4px 8px; border-radius: 4px;"><i class="fas fa-user-check"></i> Com Acesso</span>`
                : `<span class="badge" style="background-color: #c77a7a; color: #fff; font-size: 0.7rem; padding: 4px 8px; border-radius: 4px;"><i class="fas fa-user-times"></i> SEM VÍNCULO</span>`;

        const btnAcesso = !c.temUsuario
                ? `<button onclick="abrirModalCriarUsuario(${c.id}, '${c.nome}')" class="btn-novo-acesso" style="background: #17a2b8; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;"><i class="fas fa-key"></i> Criar Acesso</button>`
                : '';

        const nomesDosPets = (c.pets && c.pets.length > 0)
                ? c.pets.map(p => `${p.nome} <small style="color:#888;">(${p.tipo})</small>`).join(', ')
                : '<em>Nenhum pet cadastrado</em>';

        return `
        <div class="cliente-card" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 15px; background: #fff;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0; color: #333; font-size: 1.1rem;"><i class="fas fa-user" style="color:#C9A96E; margin-right: 5px;"></i> ${c.nome}</h3>
                <div>${badgeVinculo}</div>
            </div>

            <div style="color: #666; margin-bottom: 8px; font-size: 0.9rem;">
                <i class="fab fa-whatsapp" style="color:#25d366;"></i> ${c.telefone || 'Sem telefone'}
            </div>
            <div style="background: #f9f9f9; padding: 8px; border-radius: 4px; margin-bottom: 12px; font-size: 0.9rem;">
                <strong>Pets:</strong> ${nomesDosPets}
            </div>

            <div style="margin-bottom: 8px; font-size: 0.9rem;">
                <strong>Pacote:</strong> ${pac ? pac.nome : '<span style="color:#888;">Sem pacote</span>'}
            </div>

            ${pac && totalServ ? `
            <div style="font-size: 0.85rem; margin-bottom: 5px; display: flex; justify-content: space-between;">
                <span>${usadoServ}/${totalServ} serviços usados</span>
                <span style="font-weight:bold; color: ${pendServ > 0 ? '#C9A96E' : '#5ac75a'};">
                    ${pendServ > 0 ? pendServ + ' restantes' : 'Concluído!'}
                </span>
            </div>
            <div style="width: 100%; background-color: #eee; border-radius: 4px; height: 8px; margin-bottom: 10px;">
                <div style="width: ${pct}%; background-color: ${pct === 100 ? '#5ac75a' : '#C9A96E'}; height: 100%; border-radius: 4px; transition: width 0.3s;"></div>
            </div>
            ` : ''}

            ${c.validadePacote ? `<div style="font-size: 0.8rem; color: #888; margin-bottom: 10px;"><i class="fas fa-calendar-alt"></i> Validade: ${fd(c.validadePacote)}</div>` : ''}

            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                <button onclick="abrirModalNovoPet(${c.id})" class="btn-add-pet" style="background: #eee; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;"><i class="fas fa-paw" style="color:#C9A96E;"></i> + Pet</button>
                ${btnAcesso}
            </div>
            
        </div>`;
    }).join('');
}