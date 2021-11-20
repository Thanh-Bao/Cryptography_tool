package CORE.cipher;

import CORE.DTO.KeyPairDTO;
import CORE.Utility;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class Asymmetric {

    private int cipherMode;
    private Key key;
    private Cipher cipher;

    public Asymmetric(){};

    public Asymmetric(int cipherMode, String publicOrPrivateKeyBase64, String modeOperation, String padding, String algorithm, String iv) throws Exception {
        this.cipherMode = cipherMode;
        cipher = Cipher.getInstance(algorithm+"/"+modeOperation+"/"+padding);
         try {
             key = base64ToPrivateKey(publicOrPrivateKeyBase64);
         } catch (Exception e){
             key = base64ToPublicKey(publicOrPrivateKeyBase64);
         }
            cipher.init(cipherMode,  key);
    }

    public static PublicKey base64ToPublicKey(String keyBase64) throws Exception {
            byte[] byteKey = Base64.getDecoder().decode(keyBase64);
            X509EncodedKeySpec X509publicKey = new X509EncodedKeySpec(byteKey);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            return kf.generatePublic(X509publicKey);
    }

    public static PrivateKey base64ToPrivateKey(String keyBase64) throws Exception {
        byte[] byteKey = Base64.getDecoder().decode(keyBase64);
        PKCS8EncodedKeySpec ks = new PKCS8EncodedKeySpec(byteKey);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(ks);
    }

    public KeyPairDTO generateKey(int keySize, String algorithm) throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance(algorithm);
        keyGen.initialize(keySize);
        KeyPair keyPair = keyGen.generateKeyPair();
        String publicKey = Utility.keyToBase64(keyPair.getPublic());
        String privateKey = Utility.keyToBase64(keyPair.getPrivate());
        KeyPairDTO keyPairDTO = new KeyPairDTO(publicKey,privateKey);
        return  keyPairDTO;
    }

    public String doCryptoText( String data) throws Exception {
        byte[] encVal = null;
        String result = null;
        if (cipherMode == 1) {
            encVal = cipher.doFinal(data.getBytes());
            result = Utility.byteArrToBASE64(encVal);
        } else {
            encVal = cipher.doFinal(Utility.BASE64ToByteArr(data));
            result = new String(encVal);
        }
        return result;
    }
}
