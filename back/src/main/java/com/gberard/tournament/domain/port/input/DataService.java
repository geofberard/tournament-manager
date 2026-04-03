package com.gberard.tournament.domain.port.input;

import com.gberard.tournament.domain.model.Identified;

import java.util.List;
import java.util.Optional;

public interface DataService<T extends Identified> {

    T create(T player);

    T update(T player);

    boolean delete(T player);

    Optional<T> findById(String id);

    List<T> findAll();

}
