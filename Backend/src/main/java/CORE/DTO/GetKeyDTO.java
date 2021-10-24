package CORE.DTO;

public class GetKeyDTO {
    private int keySize;
    private String algorithm;

    public GetKeyDTO(int keySize, String algorithm) {
        this.keySize = keySize;
        this.algorithm = algorithm;
    }

    public int getKeySize() {
        return keySize;
    }

    public String getAlgorithm() {
        return algorithm;
    }
}
