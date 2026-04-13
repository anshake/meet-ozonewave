package com.shake.ow.ai;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vector_store")
@Getter
@NoArgsConstructor
public class ProfileDocument {

    @Id
    private UUID id;

    @Column(name = "content")
    private String content;
}
