package fertilizer_pesticide_system.controller;

import fertilizer_pesticide_system.dto.MlPredictionRequest;
import fertilizer_pesticide_system.dto.MlPredictionResponse;
import fertilizer_pesticide_system.service.MlPredictionService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ml")
@CrossOrigin(
    origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    },
    allowCredentials = "true"
)
public class MlPredictionController {

    private final MlPredictionService mlPredictionService;

    public MlPredictionController(
            MlPredictionService mlPredictionService) {
        this.mlPredictionService = mlPredictionService;
    }

    @PostMapping("/predict")
    public MlPredictionResponse predict(
            @RequestBody MlPredictionRequest request) {
        return mlPredictionService.predict(request);
    }
}
