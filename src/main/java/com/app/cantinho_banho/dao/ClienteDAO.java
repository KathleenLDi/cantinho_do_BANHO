<<<<<<< HEAD
=======
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
package com.app.cantinho_banho.dao;

import com.app.cantinho_banho.model.Cliente;
import java.util.List;
import javax.persistence.EntityManager;

public class ClienteDAO {

    public Cliente buscarPorId(Long id) {
<<<<<<< HEAD
        EntityManager em = JPAUtil.getEntityManager();
        try {
            Cliente clienteEncontrado = em.find(Cliente.class, id);
            return clienteEncontrado;
        } finally {
=======
        // 1. Abrimos a "porta" para o banco de dados
        EntityManager em = JPAUtil.getEntityManager();
        try {
            // 2. Usamos o método find: (Classe que queremos, ID que buscamos)
            Cliente clienteEncontrado = em.find(Cliente.class, id);
            return clienteEncontrado;
        } finally {
            // 3. Importante: Sempre fechamos a porta para não gastar memória
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
            em.close();
        }
    }
    
    public Cliente buscarPorTelefone(String telefone){
        EntityManager em = JPAUtil.getEntityManager();
        try{
            return em.createQuery("SELECT c FROM Cliente c WHERE c.telefone = :pTelefone",
            Cliente.class).setParameter("pTelefone", telefone).getSingleResult();
        }catch(Exception e){
            return null;
        } finally {
            em.close();
        }
    }

    public void salvar(Cliente cliente) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
<<<<<<< HEAD
            em.merge(cliente);
=======
            em.merge(cliente); // Aqui a mágica acontece: o Java gera o INSERT SQL
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
            em.getTransaction().commit();
        } catch (Exception e) {
            em.getTransaction().rollback();
        } finally {
            em.close();
        }
    }

    public List<Cliente> listarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
<<<<<<< HEAD
=======
        // JPQL: Uma linguagem de consulta parecida com SQL, mas focada em Objetos
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
        return em.createQuery("FROM Cliente", Cliente.class).getResultList();
    }
    
    
}
