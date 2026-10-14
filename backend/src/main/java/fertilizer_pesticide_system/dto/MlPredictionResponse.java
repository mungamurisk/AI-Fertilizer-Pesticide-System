package fertilizer_pesticide_system.dto;

public class MlPredictionResponse {

    private String fertilizer;

    public MlPredictionResponse() {
    }

    public MlPredictionResponse(String fertilizer) {
        this.fertilizer = fertilizer;
    }

    public String getFertilizer() {
        return fertilizer;
    }

    public void setFertilizer(String fertilizer) {
        this.fertilizer = fertilizer;
    }
}