package fertilizer_pesticide_system.service;

import fertilizer_pesticide_system.RecommendationHistory;
import fertilizer_pesticide_system.repository.RecommendationHistoryRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationHistoryService {

    private final RecommendationHistoryRepository repository;

    public RecommendationHistoryService(
            RecommendationHistoryRepository repository) {
        this.repository = repository;
    }

    public RecommendationHistory save(
            RecommendationHistory history) {
        return repository.save(history);
    }

    public List<RecommendationHistory> getAllHistory() {
        return repository.findAll();
    }

    public List<RecommendationHistory> getHistoryByFarmerId(
            Long farmerId) {
        return repository
                .findByFarmer_IdOrderByCreatedAtDesc(farmerId);
    }

    public RecommendationHistory getHistoryById(Long id) {
        return repository.findById(id).orElse(null);
    }
}