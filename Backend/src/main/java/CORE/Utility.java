package CORE;

import org.springframework.web.multipart.MultipartFile;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;


public class Utility {

    public static String storeFile(MultipartFile file) throws IOException {
        if (file.getSize() > (10 * 1024 * 1024)) {
            return "Vui lòng chọn file < 10MB";
        }
        if (file.getSize() == 0 || file == null) {
            return "Bạn chưa chọn file";
        }
        File newFile = new File(ENV.pathMedia + file.getOriginalFilename());
        newFile.createNewFile();
        FileOutputStream fos = new FileOutputStream(newFile);
        fos.write(file.getBytes());
        fos.close();
        return null;
    }

    public static String byteArrToBASE64(byte[] arr) {
        return Base64.getEncoder().encodeToString(arr);
    }

    public static byte[] BASE64ToByteArr(String text) {
        return Base64.getDecoder().decode(text);
    }

    public static Key generateKey(int keySize, String algorithm) throws NoSuchAlgorithmException {
        KeyGenerator keyGen = KeyGenerator.getInstance(algorithm);
        keyGen.init(keySize);
        SecretKey secretKey = keyGen.generateKey();
        return  secretKey;
    }

    public static String keyToBase64(Key key, String algorithm) throws NoSuchAlgorithmException {
        String encodedKey = Base64.getEncoder().encodeToString(key.getEncoded());
        return encodedKey;
    }

    public static Key Base64ToKey(String keyBase64,String algorithm ){
        byte[] decodedKey = BASE64ToByteArr(keyBase64);
        Key originalKey = new SecretKeySpec(decodedKey, 0, decodedKey.length, algorithm);
        return originalKey;
    }
}
