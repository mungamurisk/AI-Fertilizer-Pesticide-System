package fertilizer_pesticide_system.controller;

import fertilizer_pesticide_system.FarmerAccount;
import fertilizer_pesticide_system.RecommendationHistory;
import fertilizer_pesticide_system.repository.FarmerAccountRepository;
import fertilizer_pesticide_system.service.RecommendationHistoryService;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
public class RecommendationHistoryController {

    private final RecommendationHistoryService service;
    private final FarmerAccountRepository farmerRepository;

    public RecommendationHistoryController(
            RecommendationHistoryService service,
            FarmerAccountRepository farmerRepository) {
        this.service = service;
        this.farmerRepository = farmerRepository;
    }

    private Long getLoggedInFarmerId(HttpSession session) {
        Object id = session.getAttribute("farmerId");

        System.out.println("HISTORY SESSION ID: " + session.getId());
        System.out.println("HISTORY FARMER ID: " + id);

        if (id instanceof Number farmerId) {
            return farmerId.longValue();
        }

        return null;
    }

    @PostMapping
    public ResponseEntity<?> saveHistory(
            @RequestBody RecommendationHistory history,
            HttpSession session) {

        Long farmerId = getLoggedInFarmerId(session);

        if (farmerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in first."));
        }

        FarmerAccount farmer = farmerRepository.findById(farmerId)
                .orElse(null);

        if (farmer == null) {
            session.invalidate();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Farmer account not found."));
        }

        // Associate history with the logged-in farmer.
        history.setFarmer(farmer);

        return ResponseEntity.ok(service.save(history));
    }

    @GetMapping
    public ResponseEntity<?> getAllHistory(HttpSession session) {

        Long farmerId = getLoggedInFarmerId(session);

        if (farmerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in first."));
        }

        List<RecommendationHistory> history =
                service.getHistoryByFarmerId(farmerId);

        return ResponseEntity.ok(history);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHistoryById(
            @PathVariable Long id,
            HttpSession session) {

        Long farmerId = getLoggedInFarmerId(session);

        if (farmerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in first."));
        }

        RecommendationHistory history = service.getHistoryById(id);

        if (history == null
                || history.getFarmer() == null
                || !farmerId.equals(history.getFarmer().getId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "History record not found."));
        }

        return ResponseEntity.ok(history);
    }
}