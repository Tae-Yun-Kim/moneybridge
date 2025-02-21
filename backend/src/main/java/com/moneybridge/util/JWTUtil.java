package com.moneybridge.util;


import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.InvalidClaimException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class JWTUtil {
    //30자 이상
    private static String key = "1234567890123456789012345678901234567890";
    //jwt 토큰을 생성하기 위한 메서드
    public static String generateToken(Map<String, Object> valueMap, int min){

        log.info("🚀 JWT 생성: valueMap = " + valueMap); // ✅ JWT에 저장될 값 확인

        SecretKey key = null;

        try{
            key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));

        }catch(Exception e){
            throw new RuntimeException(e.getMessage());
        }

        String jwtStr = Jwts.builder()
                .setHeader(Map.of("typ","JWT"))
                .setClaims(valueMap)
                .setIssuedAt(Date.from(ZonedDateTime.now().toInstant()))
                .setExpiration(Date.from(ZonedDateTime.now().plusMinutes(min).toInstant()))
                .signWith(key)
                .compact();

        log.info("🚀 생성된 JWT: " + jwtStr); // ✅ 생성된 토큰 확인

        return jwtStr;
    }
    //검증을 위한 메서드
    public static Map<String, Object> validateToken(String token) {

        log.info("🔍 검증할 JWT: " + token); // ✅ JWT 내용 확인

        Map<String, Object> claim = null;

        try{

            SecretKey key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));

            claim = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token) // 파싱 및 검증, 실패 시 에러
                    .getBody();

            log.info("🚀 검증된 JWT claims: " + claim); // ✅ claims 내용 확인
            log.info("🚀 JWT claims에서 추출한 ID: " + claim.get("id")); // ✅ 여기서 ID 값이 제대로 나오는지 확인


        }catch(MalformedJwtException malformedJwtException){
            throw new CustomJWTException("MalFormed");
        }catch(ExpiredJwtException expiredJwtException){
            throw new CustomJWTException("Expired");
        }catch(InvalidClaimException invalidClaimException){
            throw new CustomJWTException("Invalid");
        }catch(JwtException jwtException){
            throw new CustomJWTException("JWTError");
        }catch(Exception e){
            throw new CustomJWTException("Error");
        }
        return claim;
    }
}