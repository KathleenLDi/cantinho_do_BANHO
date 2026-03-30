/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.app.cantinho_banho.dao;

import com.app.cantinho_banho.model.Cliente;
import com.app.cantinho_banho.model.Usuario;
import java.util.List;
import javax.persistence.EntityManager;

public class ClienteDAO {

    public void atualizar(Cliente cliente) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(cliente);
            em.getTransaction().commit();
        } catch (Exception e) {
            em.getTransaction().rollback();
            throw e;
        } finally {
            em.close();
        }
    }

    public Cliente buscarPorId(Long id) {
        // 1. Abrimos a "porta" para o banco de dados
        EntityManager em = JPAUtil.getEntityManager();
        try {
            // 2. Usamos o método find: (Classe que queremos, ID que buscamos)
            Cliente clienteEncontrado = em.find(Cliente.class, id);
            return clienteEncontrado;
        } finally {
            // 3. Importante: Sempre fechamos a porta para não gastar memória
            em.close();
        }
    }
    
    public Cliente buscarPorTelefoneENome(String telefone, String nome){
        EntityManager em = JPAUtil.getEntityManager();
        try{
            return em.createQuery("SELECT c FROM Cliente c WHERE c.telefone = :pTelefone AND c.nome = :pNome",
            Cliente.class).setParameter("pTelefone", telefone)
                    .setParameter("pNome", nome).getSingleResult();
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
            em.merge(cliente); // Aqui a mágica acontece: o Java gera o INSERT SQL
            em.getTransaction().commit();
        } catch (Exception e) {
            em.getTransaction().rollback();
        } finally {
            em.close();
        }
    }

    public List<Cliente> listarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        return em.createQuery("FROM Cliente", Cliente.class).getResultList();
    }
    
    public void criarAcessoEVincular(Cliente cliente, Usuario usuario) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            
            em.persist(usuario);

            cliente.setUsuario(usuario);
            em.merge(cliente);

            em.getTransaction().commit(); 
            
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback(); 
            }
            throw e; 
        } finally {
            em.close();
        }
    }
}
