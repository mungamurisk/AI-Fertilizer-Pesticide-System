package fertilizer_pesticide_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import fertilizer_pesticide_system.Pesticide;

public interface PesticideRepository extends JpaRepository<Pesticide, Long> {
}