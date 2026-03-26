let ultimoHashDados = "";

async function carregarAgendaDoBanco(silencioso = false) {
    const el = document.getElementById('lista-agenda');

    const elementoFocado = document.activeElement;
    const idFocado = elementoFocado ? elementoFocado.id : null;
    let cursorInicio = null;
    let cursorFim = null;

    // Se for um input de texto digitável, salva onde o cursor estava
    if (idFocado && (elementoFocado.tagName === 'INPUT' || elementoFocado.tagName === 'TEXTAREA')) {
        try {
            cursorInicio = elementoFocado.selectionStart;
            cursorFim = elementoFocado.selectionEnd;
        } catch (e) {
        } // Alguns inputs como type="date" não usam selection
    }

    if (el && !silencioso) {
        el.innerHTML = `
            <div class="loading-state" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-circle-notch fa-spin" style="font-size: 2rem; color: #C9A96E; margin-bottom: 10px;"></i>
                <p>Sincronizando agenda com o servidor...</p>
            </div>`;
    }

    try {
        const resposta = await fetch('../api/agendamentos/listar');
        if (!resposta.ok)
            throw new Error("Erro ao buscar agenda");

        const todosOsAgendamentos = await resposta.json();

        const novoHash = JSON.stringify(todosOsAgendamentos);

        if (silencioso && novoHash === ultimoHashDados) {
            // Se nada mudou no banco, aborta a função aqui. A tela fica intacta!
            return;
        }

        ultimoHashDados = novoHash;

        novos = todosOsAgendamentos.filter(a =>
            a.status === 'Novo' || a.status === 'novo'
        );

        agenda = todosOsAgendamentos.filter(a =>
            a.status === 'Confirmado' || a.status === 'confirmado'
        );

        pendentes = todosOsAgendamentos.filter(a =>
            a.status === 'Pendente' || a.status === 'pendente'
        );

        historico = todosOsAgendamentos.filter(a =>
            a.status === 'Concluido' || a.status === 'concluido'
        );

        retirada = todosOsAgendamentos.filter(a =>
            a.status === 'Retirada' || a.status === 'retirada'
        );

// Renderiza tudo (destrói e recria o HTML)
        if (typeof renderNovos === 'function')
            renderNovos();
        if (typeof renderAgenda === 'function')
            renderAgenda();
        if (typeof renderPendentes === 'function')
            renderPendentes();
        if (typeof renderRetirada === 'function')
            renderRetirada();

        atualizarBadges();

        if (idFocado) {
            const elementoParaFocar = document.getElementById(idFocado);
            if (elementoParaFocar) {
                elementoParaFocar.focus(); // Devolve o clique/foco

                // Devolve a posição do cursor (para o admin não perder o que estava digitando no meio da palavra)
                if (cursorInicio !== null && cursorFim !== null) {
                    try {
                        elementoParaFocar.setSelectionRange(cursorInicio, cursorFim);
                    } catch (e) {
                    }
                }
            }
        }

        if (!document.getElementById('page-dashboard').classList.contains('hidden')) {
            renderDashboard();
        }

    } catch (erro) {
        console.error("Erro na integração:", erro);
        if (el)
            el.innerHTML = `<p style="color:red;text-align:center">Erro ao conectar com o banco de dados.</p>`;
}
}


function renderAgenda() {
    listarFuncionariosDoBanco();
    populateFuncSelects();
    const busca = (document.getElementById('busca-agenda')?.value || '').toLowerCase();
    const filData = document.getElementById('filtro-data-agenda')?.value || '';
    const filFunc = document.getElementById('filtro-func-agenda')?.value || '';
    const lista = agenda.filter(a => {
        return (a.pet + a.dono + a.servico).toLowerCase().includes(busca) && (filData ? a.data === filData : true) && (filFunc ? a.funcionario === filFunc : true);
    }).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
    const el = document.getElementById('lista-agenda');
    if (!el)
        return;
    if (!lista.length) {
        el.innerHTML = `<div class="empty-state"><i class="fas fa-calendar-check" style="color:#5ac75a"></i><p>Nenhum agendamento confirmado</p></div>`;
        return;
    }
    const funcOpts = `<option value="">— Selecionar —</option>` + funcionarios.map(f => `<option>${f.nome}</option>`).join('');
    el.innerHTML = lista.map(a => `
            <div class="agenda-card">
              <div class="ac-header">
                <div>
                  <div class="ac-pet"><i class="fas fa-paw" style="color:#C9A96E;margin-right:6px;font-size:.8rem"></i>${a.pet} <small style="color:#888;font-weight:400">(${a.tipo})</small></div>
                  <div class="ac-dono">${a.dono} · <a href="https://wa.me/55${cleanTel(a.contato)}" target="_blank" style="color:#25d366"><i class="fab fa-whatsapp"></i> ${a.contato}</a></div>
                </div>
                <div style="text-align:right">
                  <span class="badge-confirmado">Confirmado</span>
                  <div style="font-size:.75rem;color:#C9A96E;margin-top:4px">${fd(a.data)} às ${a.hora}</div>
                </div>
              </div>
              <div style="margin-bottom:10px"><span class="badge badge-amarelo">${a.servico}</span></div>
              <div class="ac-grid">
                <div class="ag-field"><label>Funcionário</label>
                  <select onchange="saveCampo(${a.id},'funcionario',this.value,'agenda')">${funcOpts.replace(`>${a.funcionario}<`, ` selected>${a.funcionario}<`)}</select>
                </div>
                <div class="ag-field"><label>Valor Cobrado (R$)</label>
                  <input type="number" step="0.01" value="${a.valor || ''}" placeholder="0,00" onchange="saveCampo(${a.id},'valor',parseFloat(this.value)||0,'agenda')"/>
                </div>
                <div class="ag-field"><label>Forma de Pagamento</label>
                  <select onchange="saveCampo(${a.id},'formaPag',this.value,'agenda')">
                    <option value="" ${!a.formaPaga ? 'selected' : ''}>— Selecionar —</option>
                    ${['Pix', 'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito'].map(p => `<option ${a.formaPag === p ? 'selected' : ''}>${p}</option>`).join('')}
                  </select>
                </div>
                <div class="ag-field"><label>Status Pagamento</label>
                  <select onchange="saveCampo(${a.id},'statusPag',this.value,'agenda')">
                    <option ${(a.status_pagamento || 'Pendente') === 'Pendente' ? 'selected' : ''}>Pendente</option>
                    <option ${a.status_pagamento === 'Pago' ? 'selected' : ''}>Pago</option>
                  </select>
                </div>
                <div class="ag-field"><label>Entrada do Pet</label>
                  <input type="time" value="${a.entrada_pet || ''}" onchange="saveCampo(${a.id},'horarioEntrada',this.value,'agenda')"/>
                </div>
                <div class="ag-field"><label>Saída do Pet</label>
                  <input type="time" value="${a.saida_pet || ''}" onchange="saveCampo(${a.id},'horarioSaida',this.value,'agenda')"/>
                </div>
              </div>
              <div class="ac-obs" style="margin-bottom:10px">
                <label>Observações Internas</label>
                <textarea rows="2" placeholder="Notas, produtos..." onchange="saveCampo(${a.id},'obsInternas',this.value,'agenda')">${a.obs || ''}</textarea>
              </div>
              ${a.obs ? `<div style="font-size:.78rem;color:#888;margin-bottom:10px"><i class="fas fa-sticky-note" style="color:#C9A96E;margin-right:5px"></i>${a.obs}</div>` : ''}
              <div class="ac-footer">
                <button class="btn-save-agenda" onclick="salvarAgendaManual(${a.id},this)"><i class="fas fa-save"></i> Salvar</button>
                <button class="btn-concluir" onclick="concluirAtendimento(${a.id})"><i class="fas fa-check-double"></i> Serviço Concluído</button>
              </div>
            </div>`).join('');
}

function renderPendentes() {
    const busca = (document.getElementById('busca-pend')?.value || '').toLowerCase();
    const lista = pendentes.filter(a => (a.pet + a.dono + a.servico).toLowerCase().includes(busca));
    const el = document.getElementById('lista-pendentes');
    if (!el)
        return;
    if (!lista.length) {
        el.innerHTML = `<div class="empty-state"><i class="fas fa-clock" style="color:#555"></i><p>Nenhum pedido pendente</p></div>`;
        return;
    }
    el.innerHTML = lista.map(a => `
            <div class="pendente-card">
              <div class="pc-header">
                <div><div class="pc-pet"><i class="fas fa-paw" style="color:#c77a7a;margin-right:6px;font-size:.8rem"></i>${a.pet} <small>(${a.tipo})</small></div><div class="pc-dono">${a.dono} · ${a.contato}</div></div>
                <span class="badge-pend-red">Pendente</span>
              </div>
              <div class="pc-info">
                <span><i class="fas fa-scissors"></i> ${a.servico}</span>
                <span><i class="fas fa-calendar"></i> Data original: ${fd(a.data)} às ${a.hora}</span>
                ${a.obs ? `<span><i class="fas fa-sticky-note"></i> ${a.obs}</span>` : ''}
              </div>
            <div class="section-lbl">Reagendar</div>
              <div class="pc-reagen">
                <div class="field">
                    <label>Nova Data</label>
                    <input type="date" id="pnd-data-${a.id}" value="${a.data}" onchange="verificarDisponibilidade(${a.id}, this.value)"/>
                </div>
                <div class="field">
                    <label>Nova Hora</label>
                    <input type="time" id="pnd-hora-${a.id}" value="${a.hora}"/>
                </div>
                <div id="pnd-disp-${a.id}" style="width: 100%; font-size: 0.72rem; margin-top: 4px;"></div>
              </div>
              <div class="pc-actions">
                <button class="btn-confirmar-pend" onclick="confirmarPendente(${a.id})"><i class="fas fa-check"></i> Confirmar & WhatsApp</button>
                <button class="btn-wpp-pend" onclick="sugerirReagendamento(${a.id}, '${a.contato}', '${a.dono}', '${a.pet}')">
                    <i class="fab fa-whatsapp"></i> Sugerir Horário
                </button>
                <button class="btn-excluir-pend" onclick="excluirPendente(${a.id})"><i class="fas fa-trash"></i></button>
              </div>
            </div>`).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await listarFuncionariosDoBanco();

        carregarAgendaDoBanco(false);

        setInterval(() => {
            console.log("Buscando novos agendamentos em segundo plano...");
            carregarAgendaDoBanco(true);
        }, 5000);

        // carregarClientesDoBanco();
        listarFuncionariosDoBanco();

    } catch (e) {
        console.error('Erro na inicialização do sistema:', e);
    }
});

function sugerirReagendamento(id, contato, dono, pet) {
    // 1. Lê a data e a hora que o Admin escolheu nas caixinhas do card
    const inputData = document.getElementById(`pnd-data-${id}`).value;
    const inputHora = document.getElementById(`pnd-hora-${id}`).value;

    if (!inputData || !inputHora) {
        alert("Por favor, preencha uma data e hora para sugerir ao cliente.");
        return;
    }

    // 2. Formata a data (de 2026-03-25 para 25/03/2026)
    const dataFormatada = inputData.split('-').reverse().join('/');

    // 3. Monta o texto profissional para o WhatsApp
    const mensagem = `*Cantinho do Banho*\n\nOlá, *${dono}*! Tudo bem?\n\nTemos um horário disponível para o(a) *${pet}* no dia *${dataFormatada}* às *${inputHora}*.\n\nPodemos confirmar esse reagendamento?`;

    // 4. Abre o WhatsApp usando a sua função já existente
    openWA(contato, mensagem);
}

function verificarDisponibilidade(id, dataSelecionada) {
    const elDisp = document.getElementById(`pnd-disp-${id}`);
    if (!elDisp)
        return;

    if (!dataSelecionada) {
        elDisp.innerHTML = '';
        return;
    }

    // 1. Vasculha a 'agenda' (confirmados) buscando quem já está marcado nesse dia
    const horariosOcupados = agenda
            .filter(a => a.data === dataSelecionada)
            .map(a => a.hora)
            .sort(); // Ordena do mais cedo para o mais tarde

    // 2. Mostra o resultado na tela com as cores do seu tema
    if (horariosOcupados.length === 0) {
        elDisp.innerHTML = `<span style="color:#5ac75a"><i class="fas fa-check-circle"></i> Dia totalmente livre!</span>`;
    } else {
        // Se tiver muita gente, junta com vírgulas. Ex: 09:00, 10:30, 14:00
        elDisp.innerHTML = `<span style="color:#C9A96E"><i class="fas fa-exclamation-circle"></i> Ocupados: <strong>${horariosOcupados.join(', ')}</strong></span>`;
    }
}

// CONFIRMAR PENDENTE (Envia para o Banco)
async function confirmarPendente(id) {
    // Pega a nova data e hora que o Admin possa ter digitado nas caixinhas
    const novaData = document.getElementById(`pnd-data-${id}`)?.value;
    const novaHora = document.getElementById(`pnd-hora-${id}`)?.value;

    // Acha o item na lista atual para podermos mandar o WhatsApp depois
    const item = pendentes.find(x => x.id === id);
    if (!item)
        return;

    try {
        // Prepara os dados para enviar ao Java
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('status', 'Confirmado'); // Muda o status no banco
        if (novaData)
            params.append('data', novaData);
        if (novaHora)
            params.append('hora', novaHora);

        // Dispara a requisição POST para a Servlet que criamos
        const resposta = await fetch('../api/agendamentos/confirmar', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params
        });

        if (resposta.ok) {
            // Sincroniza tudo com o banco silenciosamente
            await carregarAgendaDoBanco(true);

            // Formata a data e manda a mensagem no WhatsApp
            const dataFormatada = (novaData || item.data).split('-').reverse().join('/');
            const msg = `✅ *Cantinho do Banho*\n\nOlá, *${item.dono}*! 🐾\nSeu agendamento para o *${item.pet}* foi *confirmado* para o dia ${dataFormatada} às ${novaHora || item.hora}!`;
            openWA(item.contato, msg);
        } else {
            alert("Erro ao confirmar no banco de dados.");
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Falha de comunicação com o servidor.");
    }
}

// EXCLUIR PENDENTE (Deleta do Banco)
async function excluirPendente(id) {
    if (!confirm('Tem certeza que deseja remover este agendamento permanentemente?'))
        return;

    try {
        // Envia o ID para a Servlet de Exclusão
        const params = new URLSearchParams();
        params.append('id', id);

        const resposta = await fetch('../api/agendamentos/excluir', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params
        });

        if (resposta.ok) {
            // Recarrega os dados para sumir da tela
            await carregarAgendaDoBanco(true);
        } else {
            alert("Erro ao excluir do banco de dados.");
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Falha de comunicação com o servidor.");
    }
}

// BOTÃO "SALVAR" (Salva funcionário, horários, valores e observações)
async function salvarAgendaManual(id, btn) {
    const item = agenda.find(a => a.id === id);
    if (!item)
        return;

    // Feedback visual de carregamento no botão
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Salvando...';
    btn.disabled = true;

    try {
        // Prepara os dados para enviar ao Java
        const params = new URLSearchParams();
        params.append('id', item.id);
        params.append('funcionario', item.funcionario || ''); // Nome do funcionário
        params.append('valor', item.valor || 0);
        params.append('formaPag', item.formaPag || '');
        params.append('status_pagamento', item.status_pagamento || 'Pendente');
        params.append('entrada_pet', item.entrada_pet || '');
        params.append('saida_pet', item.saida_pet || '');
        params.append('obs', item.obsInternas || '');

        // Manda para a Servlet de Atualização
        const resposta = await fetch('../api/agendamentos/atualizar', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params
        });

        if (resposta.ok) {
            // Sucesso! Fica verdinho por 2 segundos
            btn.innerHTML = '<i class="fas fa-check"></i> Salvo!';
            btn.style.backgroundColor = '#5ac75a';
            btn.style.color = '#000';

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 5000);

            carregarAgendaDoBanco(true);
        } else {
            throw new Error('Falha no servidor');
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao salvar os dados no banco.");
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }
}

// BOTÃO "SERVIÇO CONCLUÍDO" (Move para a Retirada e avisa o cliente)
async function concluirAtendimento(id) {
    const item = agenda.find(a => a.id === id);
    if (!item)
        return;

    if (!confirm(`O serviço de ${item.pet} foi finalizado? O cliente será notificado.`))
        return;

    try {
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('status', 'Retirada'); // Muda o status para Aguardando Retirada

        const resposta = await fetch('../api/agendamentos/concluir', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params
        });

        if (resposta.ok) {
            await carregarAgendaDoBanco(true);

            // Redireciona a tela para a aba de Retirada
            navigateTo('retirada');

            // Manda o WhatsApp avisando o dono!
            const msg = `🐾 *Cantinho do Banho*\n\nOlá, *${item.dono}*!\nO banho do(a) *${item.pet}* terminou! Ele(a) está prontinho(a), cheiroso(a) e aguardando você. 😊\n\nVenha buscar quando puder! 🏠`;
            openWA(item.contato, msg);

        } else {
            alert("Erro ao concluir o serviço.");
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Falha de comunicação com o servidor.");
    }
}

async function listarFuncionariosDoBanco() {
    try {
        const resposta = await fetch('../api/funcionarios/listar');

        if (!resposta.ok) {
            throw new Error("Erro ao buscar funcionários do banco");
        }

        funcionarios = await resposta.json();

        populateFuncSelects();

        console.log("Funcionários carregados com sucesso!", funcionarios.length);

    } catch (erro) {
        console.error("Erro ao carregar funcionários:", erro);
    }
}