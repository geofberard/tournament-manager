package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.domain.model.Identified;
import com.gberard.tournament.domain.port.output.DataRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

public abstract class DBRepository<D extends Identified,E> implements DataRepository<D> {

    private final JpaRepository<E,String> repository;
    private final Function<D,E> toEntity;
    private final Function<E,D> toDomain;

    public DBRepository(JpaRepository<E, String> repository, Function<D,E> toEntity, Function<E, D> toDomain) {
        this.repository = repository;
        this.toEntity = toEntity;
        this.toDomain = toDomain;
    }

    @Override
    public List<D> readAll() {
        return repository.findAll().stream().map(toDomain).toList();
    }

    @Override
    public Optional<D> read(String id) {
        return repository.findById(id).map(toDomain);
    }

    @Override
    public D readOrThrow(String id) {
        return repository.findById(id)
                .map(toDomain)
                .orElseThrow(() -> new EntityNotFoundException(getLogName() + " : Unknown id [" + id + "]"));
    }

    private String getLogName() {
        return getClass().getSimpleName().replace("DB", "");
    }

    @Override
    public D create(D entity) {
        return toDomain.apply(repository.save(toEntity.apply(entity)));
    }

    @Override
    public D update(D entity) {
        return toDomain.apply(repository.save(toEntity.apply(entity)));
    }

    @Override
    public void delete(D element) {
        repository.delete(toEntity.apply(element));
    }

}
