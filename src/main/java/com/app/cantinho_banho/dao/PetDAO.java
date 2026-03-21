<<<<<<< HEAD
=======
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
package com.app.cantinho_banho.dao;

import com.app.cantinho_banho.model.Pet;
import javax.persistence.EntityManager;
<<<<<<< HEAD
=======
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc

/**
 *
 * @author Z D K
 */
public class PetDAO {

    public void salvarOuAtualizar(Pet pet) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
<<<<<<< HEAD
            em.merge(pet);
=======
            em.merge(pet); // Aqui a mágica acontece: o Java gera o INSERT SQL
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
            em.getTransaction().commit();
        } catch (Exception e) {
            em.getTransaction().rollback();
        } finally {
            em.close();
        }
    }

    public Pet buscarPorId(Long id) {
<<<<<<< HEAD
        EntityManager em = JPAUtil.getEntityManager();
        try {
            Pet petEncontrado = em.find(Pet.class, id);
            return petEncontrado;
        } finally {
=======
        // 1. Abrimos a "porta" para o banco de dados
        EntityManager em = JPAUtil.getEntityManager();
        try {
            // 2. Usamos o método find: (Classe que queremos, ID que buscamos)
            Pet petEncontrado = em.find(Pet.class, id);
            return petEncontrado;
        } finally {
            // 3. Importante: Sempre fechamos a porta para não gastar memória
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
            em.close();
        }
    }
}
