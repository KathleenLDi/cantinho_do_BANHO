let ultimoHashDados = "";

function pararAnimacaoSync(icone) {
    if (icone) {
        icone.classList.remove('fa-spin');
        // Se não deu erro (não tá vermelho), volta pro cinza discreto
        if (icone.style.color !== 'rgb(199, 122, 122)' && icone.style.color !== '#c77a7a') {
            icone.style.color = '#ccc';
        }
    }
}

async function carregarAgendaDoBanco(silencioso = false) {
    const el = document.getElementById('lista-agenda');

    const iconeSync = document.getElementById('icone-sync');
    if (iconeSync) {
        iconeSync.classList.add('fa-spin'); //  girar
        iconeSync.style.color = '#C9A96E';
    }

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
            if (iconeSync) {
                setTimeout(() => {
                    iconeSync.classList.remove('fa-spin');
                    iconeSync.style.color = '#ccc'; // Volta pro cinza
                }, 600);
            }
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
        if (iconeSync) {
            setTimeout(() => {
                iconeSync.classList.remove('fa-spin');
                iconeSync.style.color = '#ccc'; // Volta pro cinza
            }, 600);
        }
    } catch (erro) {
        if (iconeSync) {
            iconeSync.style.color = '#ff0000';
            // Repare que NÃO removemos o 'fa-spin' aqui. Ele vai girar pra sempre!
        }
        if (el)
            el.innerHTML = `<p style="color:red;text-align:center">Erro ao conectar com o banco de dados.</p>`;
}
}


function renderAgenda() {
    listarFuncionariosDoBanco(isAdm);
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
                    <input type="text" value="${formatarValorTela(a.valor)}" placeholder="0,00" oninput="aplicarMascaraMoeda(this)"/>
                </div>
                <div class="ag-field"><label>Forma de Pagamento</label>
                  <select onchange="saveCampo(${a.id},'formaPag',this.value,'agenda')">
                    <option value="" ${!a.formaPag ? 'selected' : ''}>— Selecionar —</option>
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
                  <input type="time" value="${a.entrada_pet || ''}" onchange="saveCampo(${a.id},'entrada_pet',this.value,'agenda')"/>
                </div>
                <div class="ag-field"><label>Saída do Pet</label>
                  <input type="time" value="${a.saida_pet || ''}" onchange="saveCampo(${a.id},'saida_pet',this.value,'agenda')"/>
                </div>
              </div>
              <div class="ac-obs" style="margin-bottom:10px">
                <label>Observações Internas</label>
                <textarea rows="2" placeholder="Notas, produtos..." onchange="saveCampo(${a.id},'obs',this.value,'agenda')">${a.obs || ''}</textarea>
              </div>
              ${a.obs ? `<div style="font-size:.78rem;color:#888;margin-bottom:10px"><i class="fas fa-sticky-note" style="color:#C9A96E;margin-right:5px"></i>${a.obs}</div>` : ''}
              <div class="ac-footer">
                <button class="btn-save-agenda" onclick="salvarAgendaManual(${a.id},this)"><i class="fas fa-save"></i> Salvar</button>
                <button class="btn-concluir" onclick="concluirAtendimento(${a.id}, this)"><i class="fas fa-check-double"></i> Serviço Concluído</button>
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

    const dataAtual = new Date();
    dataAtual.setMinutes(dataAtual.getMinutes() - dataAtual.getTimezoneOffset());
    const dataMinima = dataAtual.toISOString().split('T')[0];

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
                    <input type="date" id="pnd-data-${a.id}" value="${a.data}" min="${dataMinima} onchange="verificarDisponibilidade(${a.id}, this.value)"/>
                </div>
                <div class="field">
                    <label>Nova Hora</label>
                    <input type="time" id="pnd-hora-${a.id}" value="${a.hora}"/>
                </div>
                <div id="pnd-disp-${a.id}" style="width: 100%; font-size: 0.72rem; margin-top: 4px;"></div>
              </div>
              <div class="pc-actions">
                <button class="btn-confirmar-pend" onclick="confirmarPendente(${a.id})">
                    <i class="fas fa-check"></i> Confirmar
                </button>
                
                <button class="btn-wpp-pend" onclick="sugerirReagendamento(${a.id}, '${a.contato}', '${a.dono}', '${a.pet}')">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
                
                <button class="btn-excluir-pend" onclick="excluirPendente(${a.id})">
                    <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>`).join('');

    lista.forEach(a => {
        verificarDisponibilidade(a.id, a.data);
    });
}

function renderRetirada() {
    // 1. Pega o valor da barra de busca (se você tiver uma na aba de retirada)
    const busca = (document.getElementById('busca-retirada')?.value || '').toLowerCase();

    // 2. Filtra a lista 'retirada' (que o nosso carregarAgendaDoBanco já alimenta automaticamente)
    const lista = retirada.filter(a => (a.pet + a.dono + a.servico).toLowerCase().includes(busca));

    // 3. Acha a div principal onde os cards vão aparecer
    const el = document.getElementById('lista-retirada');
    if (!el)
        return;

    if (!lista.length) {
        el.innerHTML = `<div class="empty-state"><i class="fas fa-home" style="color:#5ac75a; font-size: 2rem; margin-bottom: 10px;"></i><p>Nenhum pet aguardando o dono no momento.</p></div>`;
        return;
    }

    // 4. Desenha os cards
    el.innerHTML = lista.map(a => {
        // Formata o valor cobrado para mostrar bonitinho (ex: 150.5 -> 150,50)
        const valorFormatado = a.valor ? parseFloat(a.valor).toFixed(2).replace('.', ',') : '0,00';
        // Define a cor do texto do pagamento (Vermelho se pendente, Verde se pago)
        const corPagamento = (a.status_pagamento === 'Pago') ? '#5ac75a' : '#c77a7a';

        return `
            <div class="agenda-card" style="border-left: 5px solid #17a2b8;">
                <div class="ac-header">
                    <div>
                        <div class="ac-pet"><i class="fas fa-paw" style="color:#17a2b8;margin-right:6px;font-size:.8rem"></i>${a.pet} <small style="color:#888;font-weight:400">(${a.tipo})</small></div>
                        <div class="ac-dono">${a.dono} · <a href="https://wa.me/55${cleanTel(a.contato)}" target="_blank" style="color:#25d366"><i class="fab fa-whatsapp"></i> ${a.contato}</a></div>
                    </div>
                    <div style="text-align:right">
                        <span class="badge" style="background-color: #17a2b8; color: white;">Aguardando Dono</span>
                    </div>
                </div>
                
                <div style="margin-bottom:15px; font-size: 0.95rem; line-height: 1.6;">
                    <div><strong>Serviço:</strong> <span class="badge badge-amarelo">${a.servico}</span></div>
                    <div><strong>Valor Final:</strong> R$ ${valorFormatado}</div>
                    <div><strong>Status do Pagamento:</strong> <span style="color: ${corPagamento}; font-weight: bold;">${a.status_pagamento || 'Pendente'}</span></div>
                </div>
                
                ${a.obs ? `<div style="font-size:.85rem;color:#888;margin-bottom:15px; background: #f9f9f9; padding: 8px; border-radius: 4px;"><i class="fas fa-info-circle" style="color:#C9A96E;margin-right:5px"></i>${a.obs}</div>` : ''}
                
                <div class="ac-footer" style="display: flex; justify-content: flex-end;">
                    <button class="btn-concluir" onclick="finalizarRetirada(${a.id}, this)" style="background-color: #5ac75a; color: #000; padding: 8px 16px; border-radius: 6px; border: none; font-weight: 600; cursor: pointer;">
                        <i class="fas fa-flag-checkered"></i> Entregar Pet (Finalizar)
                    </button>
                </div>
            </div>`;
    }).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await listarFuncionariosDoBanco(isAdm);

        carregarAgendaDoBanco(false);

        carregarClientesDoBanco();
        listarFuncionariosDoBanco(isAdm);

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

    const dataFormatada = inputData.split('-').reverse().join('/');
    const mensagem = `*Cantinho do Banho*\n\nOlá, *${dono}*! Tudo bem?\n\nTemos um horário disponível para o(a) *${pet}* no dia *${dataFormatada}* às *${inputHora}*.\n\nPodemos confirmar esse reagendamento?`;

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

    const horariosOcupados = agenda
            .filter(a => a.data === dataSelecionada)
            .map(a => a.hora)
            .sort();

    if (horariosOcupados.length === 0) {
        elDisp.innerHTML = `<span style="color:#5ac75a"><i class="fas fa-check-circle"></i> Dia totalmente livre!</span>`;
    } else {
        elDisp.innerHTML = `<span style="color:#C9A96E"><i class="fas fa-exclamation-circle"></i> Ocupados: <strong>${horariosOcupados.join(', ')}</strong></span>`;
    }
}

async function confirmarPendente(id) {
    const novaData = document.getElementById(`pnd-data-${id}`)?.value;
    const novaHora = document.getElementById(`pnd-hora-${id}`)?.value;

    const item = pendentes.find(x => x.id === id);
    if (!item)
        return;

    const dataFinal = novaData || item.data;
    const horaFinal = novaHora || item.hora;

    const horarioOcupado = agenda.some(a => a.data === dataFinal && a.hora === horaFinal);

    if (horarioOcupado) {
        const dataBR = dataFinal.split('-').reverse().join('/');
        alert(`⚠️ Choque de Horários!\n\nJá existe um agendamento confirmado para o dia ${dataBR} às ${horaFinal}.\n\nPor favor, escolha um horário diferente antes de confirmar.`);
        return;
    }

    try {
        // Prepara os dados para enviar ao Java
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('status', 'Confirmado')
        if (novaData)
            params.append('data', novaData);
        if (novaHora)
            params.append('hora', novaHora);

        const resposta = await fetch('../api/agendamentos/confirmar', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params
        });

        if (resposta.ok) {
            await carregarAgendaDoBanco(true);
        } else {
            alert("Erro ao confirmar no banco de dados.");
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Falha de comunicação com o servidor.");
    }
}

async function excluirPendente(id) {
    if (!confirm('Tem certeza que deseja remover este agendamento permanentemente?'))
        return;

    try {
        const params = new URLSearchParams();
        params.append('id', id);

        const resposta = await fetch('../api/agendamentos/excluir', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params
        });

        if (resposta.ok) {
            await carregarAgendaDoBanco(true);
        } else {
            alert("Erro ao excluir do banco de dados.");
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Falha de comunicação com o servidor.");
    }
}

async function salvarAgendaManual(id, btn) {
    const card = btn.closest('.agenda-card');
    if (!card)
        return;

    const originalHTML = btn.innerHTML;
    const originalBg = btn.style.backgroundColor;
    const originalColor = btn.style.color;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Aguarde...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    try {
        const selects = card.querySelectorAll('select');
        const inputs = card.querySelectorAll('input');
        const textarea = card.querySelector('textarea');

        const funcionario = selects[0]?.value || '';
        const formaPag = selects[1]?.value || '';
        const statusPag = selects[2]?.value || 'Pendente';

        let valorString = inputs[0]?.value || '0';
        // Tira os pontos de milhar e troca a vírgula por ponto ("1250.00")
        const valorLimpoParaOJava = valorString.replace(/\./g, '').replace(',', '.');
        const entrada_pet = inputs[1]?.value || '';
        const saida_pet = inputs[2]?.value || '';

        const obs = textarea?.value || '';

        const params = new URLSearchParams();
        params.append('id', id);
        params.append('funcionario', funcionario);
        params.append('valor', valorLimpoParaOJava);
        params.append('formaPag', formaPag);
        params.append('status_pagamento', statusPag);
        params.append('entrada_pet', entrada_pet);
        params.append('saida_pet', saida_pet);
        params.append('obs', obs);

        const resposta = await fetch('../api/agendamentos/atualizar', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params
        });

        if (resposta.ok) {
            btn.innerHTML = '<i class="fas fa-check"></i> Salvo!';
            btn.style.backgroundColor = '#5ac75a';
            btn.style.color = '#fff';
            btn.style.opacity = '1';

            carregarAgendaDoBanco(true);

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
                btn.style.backgroundColor = originalBg;
                btn.style.color = originalColor;
            }, 3000);

        } else {
            throw new Error('Falha no servidor');
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao salvar os dados no banco.");
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.style.opacity = '1';
    }

}

async function concluirAtendimento(id, btn) {
    const item = agenda.find(a => a.id === id);
    if (!item)
        return;

    if (!confirm(`O serviço de ${item.pet} foi finalizado? O cliente será notificado.`))
        return;

    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A processar...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

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
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.style.opacity = '1';
    }
}

async function listarFuncionariosDoBanco(isAdm = false) {
    try {
        let urlDaApi = '../api/funcionarios/listar';

        if (isAdm) {
            urlDaApi = '../api/funcionarios/listar-adm';
        }

        const resposta = await fetch(urlDaApi);

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

async function finalizarRetirada(id, btn) {
    const item = retirada.find(a => a.id === id);
    if (!item)
        return;

    if (item.status_pagamento !== 'Pago') {
        const confirmarPagamento = confirm(`Atenção: O sistema indica que o pagamento de R$ ${item.valor} ainda está PENDENTE.\n\nTem a certeza que deseja entregar o ${item.pet} e finalizar o serviço?`);
        if (!confirmarPagamento)
            return;
    } else {
        if (!confirm(`Confirmar a entrega do ${item.pet} ao dono? O agendamento será arquivado no histórico.`))
            return;
    }

    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A arquivar...';
    btn.disabled = true;

    try {
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('status', 'Concluido');

        const resposta = await fetch('../api/agendamentos/concluir', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params
        });

        if (resposta.ok) {
            await carregarAgendaDoBanco(true);
        } else {
            throw new Error('Falha no servidor');
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao arquivar o agendamento. Tente novamente.");
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }
}

// Formata o número do banco (ex: 150.5) para a tela (ex: 150,50)
function formatarValorTela(valor) {
    if (!valor || isNaN(valor))
        return '';
    let v = parseFloat(valor).toFixed(2);
    return v.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

function aplicarMascaraMoeda(input) {
    let v = input.value.replace(/\D/g, ''); // Remove tudo que não for número
    if (!v) {
        input.value = '';
        return;
    }
    v = (parseInt(v) / 100).toFixed(2) + ''; // Divide por 100 para criar os centavos
    v = v.replace('.', ','); // Troca o ponto da casa decimal por vírgula
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // Coloca os pontos de milhar
    input.value = v;
}