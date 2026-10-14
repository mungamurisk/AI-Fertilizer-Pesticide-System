package fertilizer_pesticide_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import fertilizer_pesticide_system.model.Farmer;

public interface FarmerRepository extends JpaRepository<Farmer, Long> {
}