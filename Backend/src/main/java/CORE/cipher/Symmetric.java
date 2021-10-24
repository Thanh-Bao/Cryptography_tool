package CORE.cipher;

import CORE.Utility;

import java.io.*;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;


public class Symmetric {

    // Cipher.DECRYPT_MODE=2   Cipher.ENCRYPT_MODE=1
    public static String doCryptoText(int cipherMode, String keyBase64, String data, String algorithm) throws Exception {
        Key key = Utility.Base64ToKey(keyBase64, algorithm);
        Cipher c = Cipher.getInstance(algorithm);
        c.init(cipherMode, key);

        byte[] encVal = null;
        String result = null;
        if(cipherMode==1){
            encVal = c.doFinal(data.getBytes());
            result = Utility.byteArrToBASE64(encVal);
        } else {
            encVal = c.doFinal(Utility.BASE64ToByteArr(data));
            result = new String(encVal);
        }
        return result;
    }

    // Cipher.DECRYPT_MODE=2   Cipher.ENCRYPT_MODE=1
    public static void doCryptoFile(int cipherMode, String keyBase64, String algorithm, File inputFile, File outputFile)
            throws NoSuchPaddingException, NoSuchAlgorithmException, IOException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {

            Key key = Utility.Base64ToKey(keyBase64, algorithm);
            Cipher cipher = Cipher.getInstance(algorithm);
            cipher.init(cipherMode, key);

            FileInputStream inputStream = new FileInputStream(inputFile);
            byte[] inputBytes = new byte[(int) inputFile.length()];
            inputStream.read(inputBytes);

            byte[] outputBytes = cipher.doFinal(inputBytes);

            FileOutputStream outputStream = new FileOutputStream(outputFile);
            outputStream.write(outputBytes);

            inputStream.close();
            outputStream.close();

        }
    }

