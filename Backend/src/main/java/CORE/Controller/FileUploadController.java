package CORE.Controller;

import java.io.File;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import CORE.Utility;
import CORE.cipher.Symmetric;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

@RestController
public class FileUploadController {

    @PostMapping("/uploadFile")
    public ResponseEntity<Object> fileUpload(@RequestParam("File") MultipartFile file) throws IOException {
        String messageValidateFile = Utility.storeFile(file);
        if (messageValidateFile != null) {
            return new ResponseEntity<Object>(messageValidateFile, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity("Upload thành công!", HttpStatus.OK);
    }

    @PostMapping("/test")
    public String test() throws NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, IOException, BadPaddingException, InvalidKeyException {
        Symmetric.doCryptoFile(1,"bjJyNXU4eC9BJUQqRy1LYVBkU2dWa1lwM3M2djl5JEI=", "AES", new File("C:\\GGG.PNG"), new File("C:\\HHH.PNG"));
        Symmetric.doCryptoFile(2,"bjJyNXU4eC9BJUQqRy1LYVBkU2dWa1lwM3M2djl5JEI=", "AES", new File("C:\\HHH.PNG"), new File("C:\\YYY.PNG"));
        return "TESTING";
    }


}