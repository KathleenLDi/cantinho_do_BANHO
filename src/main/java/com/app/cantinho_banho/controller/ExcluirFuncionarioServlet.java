package com.app.cantinho_banho.controller;

import com.app.cantinho_banho.dao.FuncionarioDAO;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/funcionarios/excluir")
public class ExcluirFuncionarioServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            // 1. Recebe o ID do funcionário enviado pelo JavaScript
            String idParam = request.getParameter("id");

            if (idParam == null || idParam.trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("ID do funcionário não fornecido.");
                return;
            }

            Long id = Long.parseLong(idParam);
            FuncionarioDAO dao = new FuncionarioDAO();

            // 2. Chama o método de excluir no DAO
            dao.remover(id);

            // 3. Responde com sucesso
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("Funcionário excluído com sucesso.");

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Erro ao excluir funcionário: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
