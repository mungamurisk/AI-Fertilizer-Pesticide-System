package fertilizer_pesticide_system.repository;

import fertilizer_pesticide_system.RecommendationHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecommendationHistoryRepository
        extends JpaRepository<RecommendationHistory, Long> {

    List<RecommendationHistory> findByFarmer_IdOrderByCreatedAtDesc(
            Long farmerId);
}