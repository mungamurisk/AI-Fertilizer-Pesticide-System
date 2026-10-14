package fertilizer_pesticide_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import fertilizer_pesticide_system.Fertilizer;

public interface FertilizerRepository extends JpaRepository<Fertilizer, Long> {

}