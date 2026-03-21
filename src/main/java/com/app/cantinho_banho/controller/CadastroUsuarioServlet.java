package com.app.cantinho_banho.controller;

import com.app.cantinho_banho.dao.UsuarioDAO;
import com.app.cantinho_banho.model.Usuario;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.mindrot.jbcrypt.BCrypt;

@WebServlet("/api/usuarios/cadastrar")
public class CadastroUsuarioServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");

        try {
            String nome = request.getParameter("nome");
            String email = request.getParameter("email");
            String senha = request.getParameter("senha");
            String cpf = request.getParameter("cpf");
            String rg = request.getParameter("rg");
            String perfil = request.getParameter("perfil");
            String funcao = request.getParameter("funcao");

            if (nome == null || email == null || senha == null || cpf == null) {
                response.setStatus(400);
                response.getWriter().write("Erro: Nome, E-mail, Senha e CPF são obrigatórios.");
                return;
            }

            Usuario novoUsuario = new Usuario();
            novoUsuario.setNome(nome);
            novoUsuario.setEmail(email);
            String senhaCriptografada = BCrypt.hashpw(senha, BCrypt.gensalt());
            novoUsuario.setSenha(senhaCriptografada);
            novoUsuario.setCpf(cpf);
            novoUsuario.setRg(rg);

            if (perfil != null && !perfil.trim().isEmpty()) {
                novoUsuario.setPerfil(perfil);
            }

            novoUsuario.setFuncao(funcao);

            UsuarioDAO dao = new UsuarioDAO();

            String matriculaSegura = dao.gerarMatriculaUnica();
            novoUsuario.setMatricula(matriculaSegura);

            dao.salvar(novoUsuario);

            response.setStatus(201);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String jsonResponse = "{\"matricula\": \"" + novoUsuario.getMatricula() + "\"}";
            response.getWriter().write(jsonResponse);
            
        } catch (Exception e) {
            response.setStatus(500);

            response.getWriter().write("Erro ao cadastrar usuário. Verifique se o E-mail ou CPF já existem. Detalhes: " + e.getMessage());
            e.printStackTrace();
        }

    }
}
