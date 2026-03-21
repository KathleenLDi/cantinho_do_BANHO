package com.app.cantinho_banho.dao;

import com.app.cantinho_banho.model.Usuario;
import java.util.List;
import java.util.Random;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import org.mindrot.jbcrypt.BCrypt;

public class UsuarioDAO {

    public void salvar(Usuario usuario) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(usuario);
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

    public String gerarMatriculaUnica() {
        EntityManager em = JPAUtil.getEntityManager();
        Random random = new Random();
        String matriculaGerada;
        boolean repetida;

        try {
            do {
                int numero = 100000 + random.nextInt(900000);
                matriculaGerada = "CDB-" + numero;

                Long quantidade = em.createQuery(
                        "SELECT COUNT(u) FROM Usuario u WHERE u.matricula = :pMatricula", Long.class)
                        .setParameter("pMatricula", matriculaGerada)
                        .getSingleResult();

                repetida = (quantidade > 0);

            } while (repetida);

            return matriculaGerada;

        } finally {
            em.close();
        }
    }

    public Usuario autenticar(String email, String senhaDigitada) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            Usuario usuario = em.createQuery(
                    "SELECT u FROM Usuario u WHERE u.email = :pEmail AND u.ativo = true",
                    Usuario.class)
                    .setParameter("pEmail", email)
                    .getSingleResult();

            if (BCrypt.checkpw(senhaDigitada, usuario.getSenha())) {
                return usuario;
            } else {
                return null;
            }

        } catch (NoResultException e) {
            return null;
        } finally {
            em.close();
        }
    }

    public List<Usuario> buscarTodos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            // Traz todos os usuários que não foram deletados (Soft Delete)
            return em.createQuery("SELECT u FROM Usuario u WHERE u.ativo = true", Usuario.class)
                    .getResultList();
        } finally {
            em.close();
        }
    }
}
