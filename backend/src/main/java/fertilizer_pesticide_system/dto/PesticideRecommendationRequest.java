package fertilizer_pesticide_system.dto;

public class PesticideRecommendationRequest {

    private String cropType;
    private String pestType;

    public PesticideRecommendationRequest() {
    }

    public String getCropType() {
        return cropType;
    }

    public void setCropType(String cropType) {
        this.cropType = cropType;
    }

    public String getPestType() {
        return pestType;
    }

    public void setPestType(String pestType) {
        this.pestType = pestType;
    }
}