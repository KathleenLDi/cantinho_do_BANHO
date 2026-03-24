package com.app.cantinho_banho.controller;

import com.app.cantinho_banho.dao.UsuarioDAO;
import com.app.cantinho_banho.model.Funcionario;
import com.app.cantinho_banho.model.Usuario;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/funcionarios/listar")
public class ListarFuncionariosServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            UsuarioDAO dao = new UsuarioDAO();
            List<Usuario> lista = dao.buscarTodos();

            // Montagem manual de um JSON (Array de objetos)
            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < lista.size(); i++) {
                Usuario u = lista.get(i);

                // Tratamento para evitar erro com valores nulos
                String perfil = u.getPerfil() != null ? u.getPerfil() : "Funcionario";

                String matricula = "";
                String funcao = "";
                Double salario = 0.0;

                
                Funcionario func = u.getFuncionario();
                if(func != null){
                    matricula = func.getMatricula() != null ? func.getMatricula() : "";
                    funcao = func.getFuncao() != null ? func.getFuncao() : "";
                    salario = func.getSalario() != null ? func.getSalario() : 0.0;
                }
                json.append("{")
                        .append("\"id\":").append(u.getId()).append(",")
                        .append("\"nome\":\"").append(u.getNome()).append("\",")
                        .append("\"email\":\"").append(u.getEmail()).append("\",")
                        .append("\"perfil\":\"").append(perfil).append("\",")
                        .append("\"matricula\":\"").append(matricula).append("\",")
                        .append("\"cargo\":\"").append(funcao).append("\",")
                        .append("\"salario\":").append(salario)
                        .append("}");

                if (i < lista.size() - 1) {
                    json.append(",");
                }
            }
            json.append("]");

            response.setStatus(200);
            response.getWriter().write(json.toString());

        } catch (Exception e) {
            response.setStatus(500);
            response.getWriter().write("{\"erro\": \"Erro ao buscar funcionários: " + e.getMessage() + "\"}");
        }
    }
}
