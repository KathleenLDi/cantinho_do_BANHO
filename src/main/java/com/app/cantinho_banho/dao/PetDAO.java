package com.app.cantinho_banho.dao;

import com.app.cantinho_banho.model.Pet;
import javax.persistence.EntityManager;

/**
 *
 * @author Z D K
 */
public class PetDAO {

    public void salvarOuAtualizar(Pet pet) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(pet);
            em.getTransaction().commit();
        } catch (Exception e) {
            em.getTransaction().rollback();
        } finally {
            em.close();
        }
    }

    public Pet buscarPorId(Long id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            Pet petEncontrado = em.find(Pet.class, id);
            return petEncontrado;
        } finally {
            em.close();
        }
    }
}
