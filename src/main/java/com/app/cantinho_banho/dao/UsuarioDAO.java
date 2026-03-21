<<<<<<< HEAD
package com.app.cantinho_banho.dao;

import com.app.cantinho_banho.model.Usuario;
import java.util.List;
=======
<<<<<<< HEAD
=======
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
package com.app.cantinho_banho.dao;

import com.app.cantinho_banho.model.Usuario;
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
import java.util.Random;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import org.mindrot.jbcrypt.BCrypt;

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
/**
 *
 * @author Z D K
 */
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
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
<<<<<<< HEAD
                int numero = 100000 + random.nextInt(900000);
                matriculaGerada = "CDB-" + numero;

=======
<<<<<<< HEAD
                int numero = 100000 + random.nextInt(900000);
                matriculaGerada = "CDB-" + numero;

=======
                // 1. Sorteia o número
                int numero = 100000 + random.nextInt(900000);
                matriculaGerada = "CDB-" + numero;

                // 2. Pergunta ao banco se alguém já tem essa matrícula
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
                Long quantidade = em.createQuery(
                        "SELECT COUNT(u) FROM Usuario u WHERE u.matricula = :pMatricula", Long.class)
                        .setParameter("pMatricula", matriculaGerada)
                        .getSingleResult();
<<<<<<< HEAD

=======
<<<<<<< HEAD
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
                repetida = (quantidade > 0);

            } while (repetida);

            return matriculaGerada;
<<<<<<< HEAD
=======
=======

                // Se a quantidade for maior que 0, é porque já existe!
                repetida = (quantidade > 0);

            } while (repetida); // Se for repetida, o loop volta e sorteia outra vez!

            return matriculaGerada; // Quando sair do loop, temos uma matrícula 100% virgem
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095

        } finally {
            em.close();
        }
    }

    public Usuario autenticar(String email, String senhaDigitada) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
            // 1. Busca APENAS pelo e-mail e verifica se está ativo
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
            Usuario usuario = em.createQuery(
                    "SELECT u FROM Usuario u WHERE u.email = :pEmail AND u.ativo = true",
                    Usuario.class)
                    .setParameter("pEmail", email)
                    .getSingleResult();

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
            if (BCrypt.checkpw(senhaDigitada, usuario.getSenha())) {
                return usuario;
            } else {
                return null;
            }

        } catch (NoResultException e) {
<<<<<<< HEAD
=======
=======
            // 2. Verifica se a senha digitada corresponde ao Hash do banco
            if (BCrypt.checkpw(senhaDigitada, usuario.getSenha())) {
                return usuario; // Senha correta! Entra no sistema.
            } else {
                return null; // Senha errada!
            }

        } catch (NoResultException e) {
            // Se não encontrar ninguém com esse e-mail (ou estiver inativo)
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
            return null;
        } finally {
            em.close();
        }
    }
<<<<<<< HEAD

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
=======
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
}
