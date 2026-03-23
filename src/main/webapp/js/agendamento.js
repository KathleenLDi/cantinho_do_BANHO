function mascaraTelefone(input) {
    // Remove tudo o que não for número (letras, espaços, símbolos)
    let valor = input.value.replace(/\D/g, '');

    // Limita o tamanho máximo a 11 dígitos (DDD + 9 dígitos)
    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }

    // Aplica a formatação dinamicamente
    if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca o (XX) 
    }
    if (valor.length > 7) {
        valor = valor.replace(/(\d{5})(\d)/, '$1-$2'); // Coloca o hífen no meio (XXXXX-XXXX)
    }

    // Atualiza o valor no input
    input.value = valor;
}

function enviarAgendamento(e) {
    e.preventDefault();

    // 1. Captura os elementos do DOM
    const nome = document.getElementById('nome').value.trim();
    const tel = document.getElementById('tel').value.trim();
    const pet = document.getElementById('pet').value.trim();
    const tipoPet = document.getElementById('tipo-pet').value;
    const racaPet = document.getElementById('racaPet').value;
    const portePet = document.getElementById('portePet').value;
    const servico = document.getElementById('servico').value;
    const data = document.getElementById('data').value; // Formato: YYYY-MM-DD
    const hora = document.getElementById('hora').value; // Formato: HH:MM

    // 2. Validação simples antes de enviar
    if (!nome || !pet  || !racaPet || !portePet || !tel || !tipoPet || !servico || !data || !hora) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    // 3. Prepara os parâmetros para o padrão que a Servlet Java entende (Form URL Encoded)
    const formData = new URLSearchParams();
    formData.append('nomeDono', nome);
    formData.append('telefone', tel);
    formData.append('nomePet', pet);
    formData.append('racaPet', racaPet);
    formData.append('portePet', portePet);
    formData.append('tipo', tipoPet);
    formData.append('servico', servico);
    formData.append('data', data);
    formData.append('hora', hora);

    // 4. O Fetch: Enviando os dados para o servidor
    // ATENÇÃO: Verifique se o nome do projeto no NetBeans/Tomcat é "Cantinho_banho"
    fetch('api/agendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: formData
    })
            .then(response => {
                if (response.ok) {
                    // Se o Java retornou status 200-299
                    return response.text();
                } else {
                    // Se o Java deu erro (ex: 500 no banco de dados)
                    return response.text().then(text => {
                        throw new Error(text)
                    });
                }
            })
            .then(resultado => {
                console.log("Sucesso do Java:", resultado);

                // Esconde o formulário e mostra a div de sucesso (lógica que você já tinha)
                document.getElementById('form-agendamento').style.display = 'none';
                document.getElementById('agendamento-sucesso').style.display = 'block';

                // Limpa o formulário para um próximo uso
                // document.getElementById('form-agendamento').reset();
            })
            .catch(error => {
                // Captura erros de rede ou erros lançados pelo 'throw' acima
                console.error('Erro na requisição:', error);
                alert("Falha ao salvar no MySQL: " + error.message);
            });
}

function novoAgendamento() {
    document.getElementById('form-agendamento').style.display = 'block';
    document.getElementById('agendamento-sucesso').style.display = 'none';
    document.getElementById('form-agendamento').querySelector('form').reset();
}