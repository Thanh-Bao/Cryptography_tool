package CORE.DTO;

public class CryptoDTO {
    private String key;
    private int mode;
    private String algorithm;
    private String modeOperation;
    private String padding;
    private String iv;
    private String data;

    public CryptoDTO(String key, int mode, String algorithm, String modeOperation, String padding, String iv, String data) {
        this.key = key;
        this.mode = mode;
        this.algorithm = algorithm;
        this.modeOperation = modeOperation;
        this.padding = padding;
        this.iv = iv;
        this.data = data;
    }

    public String getKey() {
        return key;
    }

    public int getMode() {
        return mode;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public String getModeOperation() {
        return modeOperation;
    }

    public String getPadding() {
        return padding;
    }

    public String getIv() {
        return iv;
    }

    public String getData() {
        return data;
    }
}
