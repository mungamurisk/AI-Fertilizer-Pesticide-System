
package fertilizer_pesticide_system.repository;

import fertilizer_pesticide_system.FarmerAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FarmerAccountRepository
        extends JpaRepository<FarmerAccount, Long> {

    Optional<FarmerAccount> findByEmail(String email);

    boolean existsByEmail(String email);
}
