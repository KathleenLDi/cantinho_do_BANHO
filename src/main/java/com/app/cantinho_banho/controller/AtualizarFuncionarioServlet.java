package com.app.cantinho_banho.controller;

import com.app.cantinho_banho.dao.FuncionarioDAO;
import com.app.cantinho_banho.dao.UsuarioDAO;
import com.app.cantinho_banho.model.Funcionario;
import com.app.cantinho_banho.model.Usuario;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/funcionarios/atualizar")
public class AtualizarFuncionarioServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");

        try {
            String idStr = request.getParameter("id");
            if (idStr == null || idStr.isEmpty()) {
                response.setStatus(400);
                response.getWriter().write("Erro: ID do usuário não fornecido");
                return;
            }

            Long id = Long.parseLong(idStr);
            FuncionarioDAO dao = new FuncionarioDAO();
            Funcionario f = dao.buscarPorId(id);
            Usuario usuario = f.getUsuario();

            if (f == null) {
                response.setStatus(404);
                response.getWriter().write("Erro: Funcionário não encontrado no banco de dados");
                return;
            }

            usuario.setNome(request.getParameter("nome"));
            usuario.setEmail(request.getParameter("email"));
            usuario.setCpf(request.getParameter("cpf"));

            String rg = request.getParameter("rg");
            usuario.setRg(rg != null && !rg.trim().isEmpty() ? rg : null);

            String ativa = request.getParameter("ativo");
            if (ativa != null && !ativa.trim().isEmpty()) {
                if (ativa.equals("true")) {
                    usuario.setAtivo(true);
                } else {
                    usuario.setAtivo(false);
                }
            }

            String perfil = request.getParameter("perfil");
            if (perfil != null && !perfil.trim().isEmpty()) {
                usuario.setPerfil(perfil);
            }

            if (!"Cliente".equals(perfil)) {
                if (usuario.getPerfil().equals("Funcionario")) {
                    f.setFuncao(request.getParameter("funcao"));

                    String salarioStr = request.getParameter("salario");
                    f.setSalario(salarioStr != null && !salarioStr.trim().isEmpty() ? Double.valueOf(salarioStr) : 0.0);
                } else if (usuario.getPerfil().equals("Admin")) {
                    f.setFuncao("");
                    f.setSalario(0.0);
                }

            }
            dao.atualizar(f);

            response.setStatus(200);
            response.setContentType("application/json");
            response.getWriter().write("{\"mensagem\": \"Funcionário atualizado com sucesso!\"}");

        } catch (Exception e) {
            response.setStatus(500);
            response.getWriter().write("Erro ao atualizar funcionário. Detalhes: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
