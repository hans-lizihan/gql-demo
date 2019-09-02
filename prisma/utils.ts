
import { Request } from "express";
import { verify } from 'jsonwebtoken'

const config = {
  audience: 'https://hans-lizihan.com',
  issuer: 'https://hans-lizihan.auth0.com/',
  algorithms: ['HS256']
};

const secret = '6XiJCXPjbXAHH7apK32oYDFn1z10SZek';

interface Context {
  request: Request,
};

interface Token {
  iss: string,
  sub: string,
  aud: string,
  iat: number,
  exp: number,
  azp: string,
  gty: string,
}

export function getUserId(context: Context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, secret, config) as Token;
    return verifiedToken && verifiedToken.sub
  }
}

