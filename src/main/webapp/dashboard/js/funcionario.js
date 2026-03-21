<<<<<<< HEAD
let lista_funcionarios = [];
let editFuncId = null;

function carregarFuncionariosDoBanco() {
    fetch('../api/usuarios/listar')
            .then(response => {
                if (!response.ok)
                    throw new Error("Erro ao buscar dados do servidor.");
                return response.json();
            })
            .then(dadosRecebidos => {
                lista_funcionarios = dadosRecebidos;
                renderFuncionarios();
            })
            .catch(error => {
                console.error("Erro:", error);
                const el = document.getElementById('lista-funcs-cad');
                if (el)
                    el.innerHTML = `<div class="empty-state" style="color:#dc3545"><i class="fas fa-exclamation-triangle"></i><p>Erro de conexão com o banco de dados.</p></div>`;
            });
}

=======
let editFuncId = null;

>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
function renderFuncionarios() {
    renderFuncsCadastro();
    renderPerformance();
}

<<<<<<< HEAD
// Função que desenha os cards com o botão Editar e Excluir
=======
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
function renderFuncsCadastro() {
    const el = document.getElementById('lista-funcs-cad');
    if (!el)
        return;
<<<<<<< HEAD

    // Verifica a variável certa
    if (!lista_funcionarios.length) {
        el.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-users" style="color:#555"></i><p>Nenhum funcionário cadastrado</p></div>`;
        return;
    }

    // Mapeia usando a variável certa (lista_funcionarios)
    el.innerHTML = lista_funcionarios.map(f => `
=======
    if (!funcionarios.length) {
        el.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-users" style="color:#555"></i><p>Nenhum funcionário cadastrado</p></div>`;
        return;
    }
    el.innerHTML = funcionarios.map(f => `
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
            <div class="func-cad-card">
              <div class="func-avatar">${f.nome.charAt(0).toUpperCase()}</div>
              <div class="func-cad-info">
                <div class="func-cad-nome">${f.nome}</div>
                <div class="func-cad-cargo">${f.cargo || '—'}</div>
<<<<<<< HEAD
=======

>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
              </div>
              <div style="display:flex;gap:6px">
                <button class="btn-sm-primary" onclick="abrirModalFunc(${f.id})" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="btn-danger-sm" onclick="excluirFunc(${f.id})" title="Excluir"><i class="fas fa-trash"></i></button>
              </div>
            </div>`).join('');
}

function renderPerformance() {
    const mes = document.getElementById('filtro-mes-func')?.value || mesMes;
    const el = document.getElementById('lista-performance');
    if (!el)
        return;
<<<<<<< HEAD
    if (!lista_funcionarios.length) {
        el.innerHTML = '';
        return;
    }
    el.innerHTML = lista_funcionarios.map(f => {
=======
    if (!funcionarios.length) {
        el.innerHTML = '';
        return;
    }
    el.innerHTML = funcionarios.map(f => {
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
        const concl = historico.filter(a => a.funcionario === f.nome && a.data?.startsWith(mes));
        const agnd = agenda.filter(a => a.funcionario === f.nome && a.data?.startsWith(mes));
        const fat = concl.reduce((s, a) => s + (a.valor || 0), 0);
        const fatPago = concl.filter(a => a.statusPag === 'Pago').reduce((s, a) => s + (a.valor || 0), 0);
        const servs = {};
        concl.forEach(a => {
            servs[a.servico] = (servs[a.servico] || 0) + 1;
        });
        const maxS = Math.max(...Object.values(servs), 1);
        const prox = agnd.filter(a => a.data >= hojeStr).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora)).slice(0, 3);
        return `
              <div class="func-card">
                <div class="func-header">
                  <div class="func-avatar">${f.nome.charAt(0)}</div>
                  <div><div class="func-nome">${f.nome}</div><div class="func-cargo-lbl">${f.cargo || 'Funcionário'} · ${mes}</div></div>
                </div>
                <div class="func-stats">
                  <div class="func-stat"><span class="func-stat-val">${concl.length}</span><span class="func-stat-lbl">Concluídos</span></div>
                  <div class="func-stat"><span class="func-stat-val">${agnd.length}</span><span class="func-stat-lbl">Agendados</span></div>
                  <div class="func-stat"><span class="func-stat-val" style="font-size:.85rem">R$ ${fat.toFixed(0)}</span><span class="func-stat-lbl">Faturamento</span></div>
                </div>
                <div style="background:#111;border-radius:8px;padding:10px;display:flex;justify-content:space-between;font-size:.78rem">
                  <span style="color:#888">Pago: <strong style="color:#5ac75a">R$ ${fatPago.toFixed(2)}</strong></span>
                  <span style="color:#888">Pendente: <strong style="color:#C9A96E">R$ ${(fat - fatPago).toFixed(2)}</strong></span>
                </div>
                ${Object.keys(servs).length ? `
                <div>
                  <div class="section-lbl">Serviços</div>
                  <div class="func-bar-wrap">
                    ${Object.entries(servs).sort((a, b) => b[1] - a[1]).map(([s, v]) => `
                      <div class="func-bar-item">
                        <span class="func-bar-label">${s}</span>
                        <div class="func-bar-track"><div class="func-bar-fill" style="width:${(v / maxS) * 100}%"></div></div>
                        <span style="font-size:.72rem;color:#888;width:20px;text-align:right">${v}</span>
                      </div>`).join('')}
                  </div>
                </div>` : ``}
                ${prox.length ? `
                <div>
                  <div class="section-lbl">Próximos</div>
                  ${prox.map(a => `<div class="func-agenda-item"><span class="fai-pet"><i class="fas fa-paw" style="font-size:.7rem;margin-right:4px;color:#C9A96E"></i>${a.pet}</span><span class="fai-serv">${a.servico}</span><span class="fai-hora">${fd(a.data)} ${a.hora}</span></div>`).join('')}
                </div>` : ``}
              </div>`;
    }).join('');
}

function abrirModalFunc(id = null) {
    editFuncId = id;

<<<<<<< HEAD
    document.getElementById('modal-func-titulo').textContent = id ? 'Editar Usuário' : 'Novo Usuário';

    if (id) {
        const f = lista_funcionarios.find(x => x.id === id);
        if (!f)
            return;

=======
    // Atualiza o título da modal
    document.getElementById('modal-func-titulo').textContent = id ? 'Editar Usuário' : 'Novo Usuário';

    if (id) {
        // --- MODO EDIÇÃO ---
        // Busca o usuário na lista (que no futuro virá do Java)
        const f = funcionarios.find(x => x.id === id);
        if (!f)
            return;

        // Preenche os campos com os dados do banco
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
        document.getElementById('nomeFuncionario').value = f.nome || '';
        document.getElementById('emailFuncionario').value = f.email || '';
        document.getElementById('cpfFuncionario').value = f.cpf || '';
        document.getElementById('rgFuncionario').value = f.rg || '';
        document.getElementById('perfilFuncionario').value = f.perfil || 'Funcionario';
<<<<<<< HEAD
        document.getElementById('func-cargo').value = f.funcao || '';
        document.getElementById('senhaFuncionario').value = '';

        mostrarOcultarFuncao();

    } else {
=======
        document.getElementById('func-cargo').value = f.funcao || ''; // Usando a variável nova 'funcao'

        // Dica de Segurança: Nunca preencha a senha ao editar! Deixe em branco.
        // Se o usuário digitar algo, o Java atualiza. Se não digitar, o Java mantém a antiga.
        document.getElementById('senhaFuncionario').value = '';

        // Chama a função para esconder/mostrar o campo de Função baseado no perfil carregado
        mostrarOcultarFuncao();

    } else {
        // --- MODO NOVO USUÁRIO ---
        // Limpa todos os campos de texto
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
        const camposLimpar = ['nomeFuncionario', 'emailFuncionario', 'senhaFuncionario', 'cpfFuncionario', 'rgFuncionario', 'func-cargo'];
        camposLimpar.forEach(campoId => {
            const elemento = document.getElementById(campoId);
            if (elemento)
                elemento.value = '';
        });

<<<<<<< HEAD
        document.getElementById('perfilFuncionario').value = 'Funcionario';
        mostrarOcultarFuncao();
    }
=======
        // Reseta o perfil para o padrão
        document.getElementById('perfilFuncionario').value = 'Funcionario';

        // Garante que o campo de função apareça para novos cadastros
        mostrarOcultarFuncao();
    }

    // Mostra a modal na tela (removendo a classe que esconde)
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
    document.getElementById('modalFunc').classList.remove('hidden');
}

function fecharModalFunc() {
<<<<<<< HEAD
=======
    // Esconde a modal
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
    document.getElementById('modalFunc').classList.add('hidden');
    editFuncId = null;
}

<<<<<<< HEAD
function fecharModalInfoFunc() {
    document.getElementById('modalInfoNovoFunc').classList.add('hidden');

    document.getElementById('info-matricula').textContent = '';
    document.getElementById('info-nome').textContent = '';
    document.getElementById('info-email').textContent = '';
    document.getElementById('info-senha').textContent = '';
    document.getElementById('info-funcao').textContent = '';
    document.getElementById('info-perfil').textContent = '';
}

=======
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
function mostrarOcultarFuncao() {
    const perfilSelecionado = document.getElementById('perfilFuncionario').value;
    const divFuncao = document.getElementById('divFuncao');
    const inputFuncao = document.getElementById('func-cargo');

    if (perfilSelecionado === 'Funcionario') {
<<<<<<< HEAD
        divFuncao.style.display = 'block';
        inputFuncao.required = true;
    } else {
        divFuncao.style.display = 'none';
        inputFuncao.required = false;
        inputFuncao.value = '';
=======
        // Se for funcionário, mostra o campo e obriga a preencher
        divFuncao.style.display = 'block';
        inputFuncao.required = true;
    } else {
        // Se for Admin, esconde o campo e tira a obrigatoriedade
        divFuncao.style.display = 'none';
        inputFuncao.required = false;
        inputFuncao.value = ''; // Limpa o texto caso o usuário tenha digitado algo antes de mudar
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
    }
}

function cadastrarUsuario(event) {
    event.preventDefault();

<<<<<<< HEAD
    const nomeDigitado = document.getElementById('nomeFuncionario').value;
    const emailDigitado = document.getElementById('emailFuncionario').value;
    const senhaDigitada = document.getElementById('senhaFuncionario').value;
    const funcaoDigitada = document.getElementById('func-cargo').value;
    const perfilSelecionado = document.getElementById('perfilFuncionario').value;

    const formData = new URLSearchParams();
    formData.append('nome', nomeDigitado);
    formData.append('email', emailDigitado);
    formData.append('senha', senhaDigitada);
    formData.append('cpf', document.getElementById('cpfFuncionario').value);
    formData.append('rg', document.getElementById('rgFuncionario').value);
    formData.append('perfil', perfilSelecionado);
    formData.append('funcao', funcaoDigitada);

    fetch('../api/usuarios/cadastrar', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
=======
    const formData = new URLSearchParams();
    formData.append('user', document.getElementById('nomeFuncionario').value);
    formData.append('nome', document.getElementById('nomeFuncionario').value);
    formData.append('email', document.getElementById('emailFuncionario').value);
    formData.append('senha', document.getElementById('senhaFuncionario').value);
    formData.append('cpf', document.getElementById('cpfFuncionario').value);
    formData.append('rg', document.getElementById('rgFuncionario').value);
    formData.append('perfil', document.getElementById('perfilFuncionario').value);
    formData.append('funcao', document.getElementById('func-cargo').value);

    fetch('../api/usuarios/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
        body: formData
    })
            .then(response => {
                if (response.ok) {
<<<<<<< HEAD
                    return response.json();
=======
                    return response.text();
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
                } else {
                    return response.text().then(text => {
                        throw new Error(text)
                    });
                }
            })
<<<<<<< HEAD
            .then(dadosRecebidos => {
                fecharModalFunc();

                document.getElementById('info-matricula').textContent = dadosRecebidos.matricula;
                document.getElementById('info-nome').textContent = nomeDigitado;
                document.getElementById('info-email').textContent = emailDigitado;
                document.getElementById('info-senha').textContent = senhaDigitada; // Exibe a senha original
                document.getElementById('info-funcao').textContent = funcaoDigitada;
                document.getElementById('info-perfil').textContent = perfilSelecionado;

                document.getElementById('modalInfoNovoFunc').classList.remove('hidden');

                carregarFuncionariosDoBanco();
            })
            .catch(error => {
                alert("Erro: " + error.message);
=======
            .then(mensagem => {
                alert("Sucesso: " + mensagem); // Aqui vai aparecer a Matrícula gerada!
            })
            .catch(error => {
                alert(error.message);
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
            });
}

// Local ainda
function excluirFunc(id) {
    if (!confirm('Excluir funcionário?'))
        return;
<<<<<<< HEAD
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf))
        return false;
    let add = 0;
    for (let i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    add = 0;
    for (let i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}

function validarFormulario() {
    const btnSalvar = document.querySelector('#modalFunc .btn-primary');
    const campos = {
        nome: document.getElementById('nomeFuncionario'),
        email: document.getElementById('emailFuncionario'),
        cpf: document.getElementById('cpfFuncionario'),
        senha: document.getElementById('senhaFuncionario')
    };

    const cpfValido = validarCPF(campos.cpf.value);
    const emailValido = campos.email.value.includes('@') && campos.email.value.length > 5;
    const nomeValido = campos.nome.value.trim().length > 3;
    const senhaValida = editFuncId ? true : campos.senha.value.length >= 4;

    aplicarEstiloValidacao(campos.cpf, cpfValido);
    aplicarEstiloValidacao(campos.email, emailValido);
    aplicarEstiloValidacao(campos.nome, nomeValido);
    if (!editFuncId)
        aplicarEstiloValidacao(campos.senha, senhaValida);

    btnSalvar.disabled = !(cpfValido && emailValido && nomeValido && senhaValida);
    btnSalvar.style.opacity = btnSalvar.disabled ? "0.5" : "1";
    btnSalvar.style.cursor = btnSalvar.disabled ? "not-allowed" : "pointer";
}

function aplicarEstiloValidacao(elemento, v) {
    if (elemento.value.length > 0) {
        elemento.style.borderColor = v ? "#28a745" : "#dc3545"; // Verde ou Vermelho
    } else {
        elemento.style.borderColor = "#ddd"; // Cor padrão
    }
}

document.addEventListener('DOMContentLoaded', () => {

    carregarFuncionariosDoBanco();

    const ids = ['nomeFuncionario', 'emailFuncionario', 'cpfFuncionario', 'senhaFuncionario'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el)
            el.addEventListener('input', validarFormulario);
    });


});
=======
    funcionarios = funcionarios.filter(x => x.id !== id);
    salvarTudo();
    renderFuncionarios();
}
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
