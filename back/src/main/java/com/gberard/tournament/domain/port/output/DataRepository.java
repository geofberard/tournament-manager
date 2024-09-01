package com.gberard.tournament.domain.port.output;

import com.gberard.tournament.domain.model.Identified;

import java.util.List;
import java.util.Optional;

public interface DataRepository<T extends Identified> {
    List<T> readAll();

    Optional<T> read(String id);

    T readOrThrow(String id);

    T create(T element);

    T update(T element);

    void delete(T element);


}
