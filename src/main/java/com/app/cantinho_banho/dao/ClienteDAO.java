package com.app.cantinho_banho.dao;

import com.app.cantinho_banho.model.Cliente;
import java.util.List;
import javax.persistence.EntityManager;

public class ClienteDAO {

    public Cliente buscarPorId(Long id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            Cliente clienteEncontrado = em.find(Cliente.class, id);
            return clienteEncontrado;
        } finally {
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
            em.merge(cliente);
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
    
    
}
