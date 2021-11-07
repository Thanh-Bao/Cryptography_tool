package CORE.DTO;

public class CryptoDTO {
    private String key;
    private int mode;
    private String algorithm;
    private String modeOperation;
    private String padding;
    private String data;

    public CryptoDTO(String key, int mode, String algorithm, String modeOperation, String padding, String data) {
        this.key = key;
        this.mode = mode;
        this.algorithm = algorithm;
        this.modeOperation = modeOperation;
        this.padding = padding;
        this.data = data;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public int getMode() {
        return mode;
    }

    public void setMode(int mode) {
        this.mode = mode;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public String getModeOperation() {
        return modeOperation;
    }

    public void setModeOperation(String modeOperation) {
        this.modeOperation = modeOperation;
    }

    public String getPadding() {
        return padding;
    }

    public void setPadding(String padding) {
        this.padding = padding;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
