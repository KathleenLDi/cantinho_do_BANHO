<<<<<<< HEAD
=======
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
package com.app.cantinho_banho.dao;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

<<<<<<< HEAD
=======
/**
 *
 * @author Z D K
 */
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
public class JPAUtil {
    private static final EntityManagerFactory factory = Persistence.createEntityManagerFactory("CantinhoBanhoPU");

    public static EntityManager getEntityManager(){
        return factory.createEntityManager();
    }
}
