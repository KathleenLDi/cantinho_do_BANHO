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
import org.mindrot.jbcrypt.BCrypt;

@WebServlet("/api/funcionarios/cadastrar")
public class CadastroFuncionarioServlet extends HttpServlet {

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
            String salario = request.getParameter("salario");

            if (nome == null || email == null || senha == null || cpf == null || perfil == null || funcao == null || salario == null) {
                response.setStatus(400);
                response.getWriter().write("Erro: Nome, E-mail, Senha, CPF, Perfil, Função e Salário são obrigatórios.");
                return;
            }

            if (rg == null || rg.trim().isEmpty()) {
                rg = null;
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

            Funcionario func = new Funcionario();
            func.setFuncao(funcao);

            if (salario != null && !salario.trim().isEmpty()) {
                func.setSalario(Double.parseDouble(salario));
            } else {
                func.setSalario(0.0);
            }

            FuncionarioDAO funcDAO = new FuncionarioDAO();

            String matriculaSegura = funcDAO.gerarMatriculaUnica();
            func.setMatricula(matriculaSegura);

            func.setUsuario(novoUsuario);
            novoUsuario.setFuncionario(func);

            funcDAO.salvar(func);

            response.setStatus(201);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String jsonResponse = "{\"matricula\": \"" + func.getMatricula() + "\"}";
            response.getWriter().write(jsonResponse);

        } catch (Exception e) {
            response.setStatus(500);
            response.getWriter().write("Erro ao cadastrar usuário. Verifique se o E-mail ou CPF já existem. Detalhes: " + e.getMessage());
            e.printStackTrace();
        }

    }
}
