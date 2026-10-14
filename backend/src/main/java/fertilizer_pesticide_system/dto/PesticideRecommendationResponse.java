package fertilizer_pesticide_system.dto;

public class PesticideRecommendationResponse {

    private String pesticide;
    private String reason;

    public PesticideRecommendationResponse() {
    }

    public PesticideRecommendationResponse(String pesticide, String reason) {
        this.pesticide = pesticide;
        this.reason = reason;
    }

    public String getPesticide() {
        return pesticide;
    }

    public void setPesticide(String pesticide) {
        this.pesticide = pesticide;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}