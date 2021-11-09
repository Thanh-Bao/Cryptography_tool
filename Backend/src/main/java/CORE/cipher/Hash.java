package CORE.cipher;

import CORE.Utility;

import javax.xml.bind.DatatypeConverter;

import java.io.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Hash {

    public static String hashText(String data, String algorithm) throws Exception {
        String hashValue = null;
        MessageDigest messageDigest = MessageDigest.getInstance(algorithm);
        messageDigest.update(data.getBytes());
        byte[] outputBytes = messageDigest.digest();
        hashValue = DatatypeConverter.printHexBinary(outputBytes).toLowerCase();
        return hashValue;
    }

    public static String getFileChecksum( File file, String algorithm) throws Exception {
        FileInputStream fileInputStream = new FileInputStream(file);
        final byte[] BUFFER = new byte[1024];
        int bytesRead = 0;
        try {
            MessageDigest digest = MessageDigest.getInstance(algorithm);

            while ((bytesRead = fileInputStream.read(BUFFER)) != -1) {
                digest.update(BUFFER, 0, bytesRead);
            }
            byte[] outputResult = digest.digest();
            return DatatypeConverter.printHexBinary(outputResult).toLowerCase();
        } catch (Exception e) {
            throw new Exception("Loi hash file");
        } finally {
            fileInputStream.close();
        }
    }

}
