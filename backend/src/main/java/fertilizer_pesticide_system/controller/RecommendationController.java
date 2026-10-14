package fertilizer_pesticide_system.controller;

import fertilizer_pesticide_system.dto.RecommendationRequest;
import fertilizer_pesticide_system.dto.RecommendationResponse;
import fertilizer_pesticide_system.service.RecommendationService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(
    origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    },
    allowCredentials = "true"
)
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(
            RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping("/predict")
    public RecommendationResponse recommend(
            @RequestBody RecommendationRequest request) {
        return recommendationService.getRecommendation(request);
    }
}