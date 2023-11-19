package com.gberard.tournament.domain.port.output;

import com.gberard.tournament.domain.client.Identified;

import java.util.List;
import java.util.Optional;

public interface DataRepository<T extends Identified> {
    List<T> readAll();

    boolean update(T element);

    boolean delete(T element);

    boolean deleteAll();

    Optional<T> search(String id);
}
