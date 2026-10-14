package fertilizer_pesticide_system.service;

import fertilizer_pesticide_system.dto.PesticideRecommendationRequest;
import fertilizer_pesticide_system.dto.PesticideRecommendationResponse;
import org.springframework.stereotype.Service;

@Service
public class PesticideRecommendationService {

    public PesticideRecommendationResponse getRecommendation(
            PesticideRecommendationRequest request) {

        String crop = request.getCropType();
        String pest = request.getPestType();

        String pesticide;
        String reason;

        if (crop.equalsIgnoreCase("Rice")
                && pest.equalsIgnoreCase("Stem Borer")) {

            pesticide = "Chlorpyrifos";
            reason = "Recommended for controlling stem borer pests in rice crops.";

        } else if (crop.equalsIgnoreCase("Cotton")
                && pest.equalsIgnoreCase("Bollworm")) {

            pesticide = "Emamectin Benzoate";
            reason = "Recommended for controlling bollworm in cotton crops.";

        } else if (crop.equalsIgnoreCase("Tomato")
                && pest.equalsIgnoreCase("Fruit Borer")) {

            pesticide = "Spinosad";
            reason = "Recommended for controlling fruit borer in tomato crops.";

        } else {

            pesticide = "No specific pesticide";
            reason = "No pesticide recommendation is available for the given crop and pest.";
        }

        return new PesticideRecommendationResponse(
                pesticide,
                reason
        );
    }
}