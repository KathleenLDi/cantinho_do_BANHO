package com.app.cantinho_banho.controller;

import com.app.cantinho_banho.dao.AgendamentoDAO;
import com.app.cantinho_banho.model.Agendamento;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/agendamentos/confirmar")
public class ConfirmarAgendamentoServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            // 1. Pega o ID do agendamento que veio do botão
            Long id = Long.parseLong(request.getParameter("id"));
            String novaData = request.getParameter("data");
            String novaHora = request.getParameter("hora");
            String novoStatus = request.getParameter("status"); // Ex: "Confirmado"

            AgendamentoDAO dao = new AgendamentoDAO();
            
            // 2. Busca o agendamento real no banco de dados
            Agendamento agendamento = dao.buscarPorId(id);

            if (agendamento != null) {
                // 3. Atualiza os dados
                agendamento.setStatus(novoStatus);
                
                // Se o Admin alterou a data/hora na tela de Pendentes, atualizamos aqui
                if (novaData != null && !novaData.isEmpty()) {
                    agendamento.setData(LocalDate.parse(novaData));
                }
                if (novaHora != null && !novaHora.isEmpty()) {
                    agendamento.setHora(LocalTime.parse(novaHora));
                }

                // 4. Salva a alteração no banco (O seu DAO deve ter um método atualizar ou merge)
                dao.salvarOuAtualizar(agendamento);

                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("{\"mensagem\": \"Agendamento confirmado com sucesso!\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("{\"erro\": \"Agendamento não encontrado.\"}");
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"erro\": \"Erro ao processar: " + e.getMessage() + "\"}");
        }
    }
}