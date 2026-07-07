// 관리자 비밀번호 → bcrypt 해시 생성
// 사용법: pnpm admin:hash "비밀번호"  → 출력값을 Railway ADMIN_PASSWORD_HASH에 저장
import bcrypt from 'bcryptjs';

const password = process.argv[2];
if (!password) {
  console.error('사용법: pnpm admin:hash "비밀번호"');
  process.exit(1);
}
console.log(bcrypt.hashSync(password, 10));
