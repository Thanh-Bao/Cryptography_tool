package CORE.cipher;

import CORE.Utility;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;

public class Symmetric {

    private static final String ALGORITHM = "AES";

    public static void encryptFile(String keyBase64, File inputFile, File outputFile) {
        Key key = Utility.Base64ToKey(keyBase64, ALGORITHM);
        doCryptoFile(Cipher.ENCRYPT_MODE, key, inputFile, outputFile);
    }

    public static void decryptFile(String keyBase64, File inputFile, File outputFile) {
        Key key = Utility.Base64ToKey(keyBase64, ALGORITHM);
        doCryptoFile(Cipher.DECRYPT_MODE, key, inputFile, outputFile);
    }

    private static void doCryptoFile(int cipherMode, Key key, File inputFile,
                                     File outputFile) {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(cipherMode, key);

            FileInputStream inputStream = new FileInputStream(inputFile);
            byte[] inputBytes = new byte[(int) inputFile.length()];
            inputStream.read(inputBytes);

            byte[] outputBytes = cipher.doFinal(inputBytes);

            FileOutputStream outputStream = new FileOutputStream(outputFile);
            outputStream.write(outputBytes);

            inputStream.close();
            outputStream.close();

        } catch (NoSuchPaddingException | NoSuchAlgorithmException
                | InvalidKeyException | BadPaddingException
                | IllegalBlockSizeException | IOException ex) {
        }
    }
}
