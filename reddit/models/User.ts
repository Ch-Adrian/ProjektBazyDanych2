import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export default class User {
  id: any;
  nickname: string;
  email: string;
  passwordHash: string;

  constructor(id: any, nickname: string, email: string, passwordHash: string) {
    this.id = id;
    this.nickname = nickname;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  static fromJson(json: any): User {
    return new User(
      json.id,
      json.nickname,
      json.email,
      json.passwordHash
    );
  }

  toJson(): any {
    return {
      id: this.id,
      nickname: this.nickname,
      email: this.email,
      passwordHash: this.passwordHash
    };
  }

  static fromJsonArray(jsonArray: any): User[] {
    return jsonArray.map((json: any) => User.fromJson(json));
  }

  async generatePasswordHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePasswordHash(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.passwordHash);
  }

  generateJwtToken(): string {
    return jwt.sign({
      id: this.id,
      nickname: this.nickname,
      email: this.email
    }, "json-token-secret-not-safe", {
      expiresIn: '7d'
    });
  }

}