package CORE.DTO;

public class ResponseDTO {
    private String format;
    private String content;

    public ResponseDTO(String format, String content) {
        this.format = format;
        this.content = content;
    }

    public String getFormat() {
        return format;
    }

    public String getContent() {
        return content;
    }
}
