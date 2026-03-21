<<<<<<< HEAD
=======
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
package com.app.cantinho_banho.controller;

import com.app.cantinho_banho.dao.AgendamentoDAO;
import com.app.cantinho_banho.dao.ClienteDAO;
<<<<<<< HEAD
import com.app.cantinho_banho.dao.PetDAO;
=======
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
import com.app.cantinho_banho.model.Agendamento;
import com.app.cantinho_banho.model.Cliente;
import com.app.cantinho_banho.model.Pet;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

<<<<<<< HEAD
=======
/**
 *
 * @author Z D K
 */
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
@WebServlet("/api/agendar")
public class AgendamentoServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String nomeDono = request.getParameter("nomeDono");
        String telefone = request.getParameter("telefone");
        String nomePet = request.getParameter("nomePet");
        String tipoPet = request.getParameter("tipo");
        String servico = request.getParameter("servico");
        String dataStr = request.getParameter("data");
        String horaStr = request.getParameter("hora");

        ClienteDAO clienteDAO = new ClienteDAO();
        AgendamentoDAO agendamentoDAO = new AgendamentoDAO();

        try {
            LocalDate data = LocalDate.parse(dataStr);
            LocalTime hora = LocalTime.parse(horaStr);
<<<<<<< HEAD
=======

            // Verificar Existência do Cliente no banco de dados
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
            Cliente cliente = clienteDAO.buscarPorTelefone(telefone);
            if (cliente == null) {
                cliente = new Cliente();
                cliente.setNome(nomeDono);
                cliente.setTelefone(telefone);
            }

<<<<<<< HEAD
            Pet pet = null;

            if (cliente.getId() != null) {
                PetDAO petDAO = new PetDAO();
                pet = petDAO.buscarPorNomeEDono(nomePet, cliente.getId());
            }

            if (pet == null) {
                pet = new Pet();
                pet.setNome(nomePet);
                pet.setTipo(tipoPet);
                pet.setDono(cliente);
            }
=======
            Pet pet = new Pet();
<<<<<<< HEAD
            
            
=======
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
            pet.setNome(nomePet);
            pet.setTipo(tipoPet);
            pet.setDono(cliente);
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095

            Agendamento agendamento = new Agendamento();
            agendamento.setPet(pet);
            agendamento.setData(data);
            agendamento.setHora(hora);
            agendamento.setServico(servico);
            agendamento.setStatus("Pendente");

            agendamentoDAO.salvarOuAtualizar(agendamento);
            response.getWriter().write("Agendamento confirmado para: " + dataStr + " às " + horaStr);
        } catch (Exception e) {
            response.setStatus(500);
            response.getWriter().write("Erro: " + e.getMessage());
        }
    }
}
