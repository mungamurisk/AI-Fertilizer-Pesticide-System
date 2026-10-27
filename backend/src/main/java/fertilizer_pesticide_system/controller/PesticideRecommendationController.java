package fertilizer_pesticide_system.controller;

import fertilizer_pesticide_system.dto.PesticideRecommendationRequest;
import fertilizer_pesticide_system.dto.PesticideRecommendationResponse;
import fertilizer_pesticide_system.service.PesticideRecommendationService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pesticide-recommendations")
public class PesticideRecommendationController {

    private final PesticideRecommendationService pesticideRecommendationService;

    public PesticideRecommendationController(
            PesticideRecommendationService pesticideRecommendationService) {
        this.pesticideRecommendationService = pesticideRecommendationService;
    }

    @PostMapping
    public PesticideRecommendationResponse recommend(
            @RequestBody PesticideRecommendationRequest request) {
        return pesticideRecommendationService.getRecommendation(request);
    }
}
