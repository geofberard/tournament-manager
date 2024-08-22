package com.gberard.tournament.domain.port.output;

import com.gberard.tournament.domain.model.Identified;
import com.gberard.tournament.domain.model.Player;

import java.util.List;
import java.util.Optional;

public interface DataRepository<T extends Identified> {
    List<T> readAll();

    T create(T element);

    T update(T element);

    boolean delete(T element);

    boolean deleteAll();

    Optional<T> search(String id);
}
