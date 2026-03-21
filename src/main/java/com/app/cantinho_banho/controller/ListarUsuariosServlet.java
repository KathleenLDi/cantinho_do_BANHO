package com.app.cantinho_banho.controller;

import com.app.cantinho_banho.dao.UsuarioDAO;
import com.app.cantinho_banho.model.Usuario;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/usuarios/listar")
public class ListarUsuariosServlet extends HttpServlet {

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
                String funcao = u.getFuncao() != null ? u.getFuncao() : "";
                String cargo = u.getPerfil() != null ? u.getPerfil() : "Funcionario";

                json.append("{")
                    .append("\"id\":").append(u.getId()).append(",")
                    .append("\"nome\":\"").append(u.getNome()).append("\",")
                    .append("\"email\":\"").append(u.getEmail()).append("\",")
                    .append("\"cargo\":\"").append(funcao).append("\",") // Mapeando a função para "cargo" do JS
                    .append("\"perfil\":\"").append(cargo).append("\"")
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