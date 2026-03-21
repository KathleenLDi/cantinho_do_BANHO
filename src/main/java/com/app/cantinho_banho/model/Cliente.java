<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
<<<<<<< HEAD
=======
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
package com.app.cantinho_banho.model;

import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String telefone;

    @OneToMany(mappedBy = "dono")
    private List<Pet> pets;

    public Cliente() {
    }

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
    // Getters e Setters (Permitem que outras partes do sistema leiam e editem os dados)
>>>>>>> af320f5edf27fd4ff406a5639c2216cd2c8210cc
>>>>>>> 5fde1b1070b80895382eef94eb2a9d614827d095
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public List<Pet> getPets() {
        return pets;
    }

    public void setPets(List<Pet> pets) {
        this.pets = pets;
    }

}
