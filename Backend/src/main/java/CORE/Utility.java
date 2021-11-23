package CORE;

import org.springframework.web.multipart.MultipartFile;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.File;
import java.io.FileOutputStream;
import org.apache.commons.io.FilenameUtils;
import java.security.Key;
import java.util.Base64;
import java.util.UUID;


public class Utility {

    public static String storeFile(MultipartFile file) throws Exception {
        if (file.getSize() > (10 * 1024 * 1024)) {
            throw  new Exception("Vui lòng chọn file < 10MB") ;
        }
        if (file.getSize() == 0 || file == null) {
            throw new Exception("Bạn chưa chọn file") ;
        }
        String originFileName = file.getOriginalFilename();
        if(originFileName.contains("._ENCRYPTED_")){
            originFileName = originFileName.replace("._ENCRYPTED_","");
        }
        UUID uuid = UUID.randomUUID();
        String uuidAsString = uuid.toString();
        String fileName =  uuidAsString+"."+FilenameUtils.getExtension(originFileName);
        File newFile = new File(ENV.pathMedia +fileName);
        newFile.createNewFile();
        FileOutputStream fos = new FileOutputStream(newFile);
        fos.write(file.getBytes());
        fos.close();
        return fileName;
    }

    public static String byteArrToBASE64(byte[] arr) {
        return Base64.getEncoder().encodeToString(arr);
    }

    public static byte[] BASE64ToByteArr(String text) {
        return Base64.getDecoder().decode(text);
    }


    public static String keyToBase64(Key key)  {
        String encodedKey = Base64.getEncoder().encodeToString(key.getEncoded());
        return encodedKey;
    }

    public static Key Base64ToKey(String keyBase64,String algorithm ){
        byte[] decodedKey = BASE64ToByteArr(keyBase64);
        Key originalKey = new SecretKeySpec(decodedKey, 0, decodedKey.length, algorithm);
        return originalKey;
    }
}
