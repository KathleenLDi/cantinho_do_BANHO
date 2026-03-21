<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
package com.app.cantinho_banho.dao;

import com.app.cantinho_banho.model.Pet;
import javax.persistence.EntityManager;
<<<<<<< HEAD
import javax.persistence.NoResultException;

=======
<<<<<<< HEAD
=======
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc

/**
 *
 * @author Z D K
 */
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
public class PetDAO {

    public void salvarOuAtualizar(Pet pet) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
<<<<<<< HEAD
            em.merge(pet);
=======
<<<<<<< HEAD
            em.merge(pet);
=======
            em.merge(pet); // Aqui a mágica acontece: o Java gera o INSERT SQL
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
            em.getTransaction().commit();
        } catch (Exception e) {
            em.getTransaction().rollback();
        } finally {
            em.close();
        }
    }

    public Pet buscarPorId(Long id) {
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
        EntityManager em = JPAUtil.getEntityManager();
        try {
            Pet petEncontrado = em.find(Pet.class, id);
            return petEncontrado;
        } finally {
<<<<<<< HEAD
            em.close();
        }
    }

    public Pet buscarPorNomeEDono(String nomePet, Long idDono) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT p FROM Pet p WHERE p.nome = :pNome AND p.dono.id = :pDonoId",
                    Pet.class)
                    .setParameter("pNome", nomePet)
                    .setParameter("pDonoId", idDono)
                    .getSingleResult();
        } catch (NoResultException e) {
            // Se o dono não tiver nenhum pet com esse nome, retorna null
            return null;
        } finally {
=======
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
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
            em.close();
        }
    }
}
