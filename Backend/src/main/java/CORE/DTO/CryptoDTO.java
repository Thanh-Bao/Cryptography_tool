package CORE.DTO;

public class CryptoDTO {
    private String key;
    private String data;
    private int mode;
    private String algorithm;

    public CryptoDTO(String key, String data, int mode, String algorithm) {
        this.key = key;
        this.data = data;
        this.mode = mode;
        this.algorithm = algorithm;
    }

    public String getKey() {
        return key;
    }

    public String getData() {
        return data;
    }

    public int getMode() {
        return mode;
    }

    public String getAlgorithm() {
        return algorithm;
    }
}
