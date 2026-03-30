package com.app.cantinho_banho.controller;

import com.app.cantinho_banho.dao.ClienteDAO;
import com.app.cantinho_banho.dao.UsuarioDAO;
import com.app.cantinho_banho.model.Cliente;
import com.app.cantinho_banho.model.Usuario;
import java.io.IOException;
import java.util.Random;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.mindrot.jbcrypt.BCrypt;

@WebServlet("/api/clientes/criar-acesso")
public class CriarAcessoClienteServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            Long clienteId = Long.parseLong(request.getParameter("clienteId"));
            String email = request.getParameter("email");
            String cpf = request.getParameter("cpf");

            ClienteDAO dao = new ClienteDAO();
            Cliente cliente = dao.buscarPorId(clienteId);

            if (cliente == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("{\"erro\": \"Cliente não encontrado.\"}");
                return;
            }

            if (cliente.getUsuario() != null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"erro\": \"Este cliente já possui um utilizador vinculado.\"}");
                return;
            }

            Random rnd = new Random();
            int numeroAleatorio = 100000 + rnd.nextInt(900000);
            String senhaTemporaria = String.valueOf(numeroAleatorio);

            Usuario u = new Usuario();
            u.setNome(cliente.getNome());
            u.setEmail(email);
            u.setCpf(cpf);
            u.setPerfil("Cliente");
            u.setAtivo(true);
            u.setReset_password(true);

            u.setSenha(BCrypt.hashpw(senhaTemporaria, BCrypt.gensalt()));
            
            cliente.setUsuario(u);
            dao.criarAcessoEVincular(cliente, u);

            // 4. Monta um JSON para devolver a senha limpa ao Front-end (apenas desta vez!)
            String json = String.format("{\"senha\": \"%s\", \"telefone\": \"%s\"}",
                    senhaTemporaria,
                    cliente.getTelefone() != null ? cliente.getTelefone() : "");

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(json);

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"erro\": \"Erro ao processar criação de acesso no servidor.\"}");
        }
    }
}
