package fertilizer_pesticide_system.dto;

public class RecommendationResponse {

    private String fertilizer;
    private String reason;

    public RecommendationResponse() {
    }

    public RecommendationResponse(String fertilizer, String reason) {
        this.fertilizer = fertilizer;
        this.reason = reason;
    }

    public String getFertilizer() {
        return fertilizer;
    }

    public void setFertilizer(String fertilizer) {
        this.fertilizer = fertilizer;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}