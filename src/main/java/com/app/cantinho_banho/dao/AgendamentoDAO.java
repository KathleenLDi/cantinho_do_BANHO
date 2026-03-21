package com.app.cantinho_banho.dao;

import com.app.cantinho_banho.model.Agendamento;
import java.util.List;
import javax.persistence.EntityManager;

public class AgendamentoDAO {
    public void salvarOuAtualizar(Agendamento agendamento) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(agendamento);
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

    public List<Agendamento> listarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery("FROM Agendamento", Agendamento.class).getResultList();
        } finally {
            em.close();
        }
    }

    public List<Agendamento> buscarPorStatus(String status) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery("SELECT a FROM Agendamento a WHERE a.status = :pStatus", Agendamento.class)
                    .setParameter("pStatus", status)
                    .getResultList();
        } finally {
            em.close();
        }
    }

}
