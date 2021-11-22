package CORE.Controller;

import java.io.File;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import CORE.DTO.ResponseDTO;
import CORE.Utility;
import CORE.cipher.Symmetric;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

@CrossOrigin(origins = "*")
@RestController
public class FileUploadController {


    @PostMapping(value = "/uploadFile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> fileUpload(@RequestParam("file") MultipartFile file) throws IOException {
        try {
            String filename = Utility.storeFile(file);
            ResponseDTO res = new ResponseDTO("name", filename);
            return new ResponseEntity(res, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity(e, HttpStatus.OK);
        }
    }

    @GetMapping("/test")
    public String test() throws Exception {
        Symmetric s1 = new Symmetric(1, "bjJyNXU4eC9BJUQqRy1LYVBkU2dWa1lwM3M2djl5JEI=", "CBC", "PKCS5Padding", "AES", "Ap35CeaK&=301^wa");
        Symmetric s2 = new Symmetric(2, "bjJyNXU4eC9BJUQqRy1LYVBkU2dWa1lwM3M2djl5JEI=", "CBC", "PKCS5Padding", "AES", "Ap35CeaK&=301^wa");
        //s1.doCryptoFile(new File("C:\\GGG.PNG"), new File("C:\\HHH.PNG"));
        //s2.doCryptoFile(new File("C:\\HHH.PNG"), new File("C:\\YYY.PNG"));
        return "TESTING";
    }
}