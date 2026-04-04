package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.domain.model.Identified;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

public abstract class DBRepository<D extends Identified,E> {

    private final JpaRepository<E,String> repository;
    private final Function<D,E> toEntity;
    private final Function<E,D> toDomain;

    public DBRepository(JpaRepository<E, String> repository, Function<D,E> toEntity, Function<E, D> toDomain) {
        this.repository = repository;
        this.toEntity = toEntity;
        this.toDomain = toDomain;
    }

    protected List<D> findAllMapped() {
        return repository.findAll().stream().map(toDomain).toList();
    }

    protected Optional<D> findByIdMapped(String id) {
        return repository.findById(id).map(toDomain);
    }

    protected D saveMapped(D entity) {
        return toDomain.apply(repository.save(toEntity.apply(entity)));
    }

    protected void deleteByIdMapped(String id) {
        repository.deleteById(id);
    }

}
