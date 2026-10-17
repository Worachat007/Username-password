# Username & Password Authentication

แอปพลิเคชัน Next.js App Router ที่รองรับการสมัครสมาชิกด้วยอีเมล/รหัสผ่าน, การล็อกอินด้วย GitHub OAuth
และการควบคุมสิทธิ์เข้าถึงหน้าผู้ดูแลระบบตามบทบาท (Role) โดยใช้ SQLite สำหรับการพัฒนาบนเครื่อง

## การติดตั้ง

ติดตั้งแพ็กเกจที่จำเป็นและสร้างไฟล์ environment สำหรับเครื่องของคุณ:

```powershell
npm install
Copy-Item .env.example .env
```

กำหนดค่า `DATABASE_URL` ในไฟล์ `.env` เป็น `file:./dev.db` จากนั้นสร้าง `AUTH_SECRET` ด้วยคำสั่ง:

```powershell
npx auth secret
```

คำสั่งนี้จะเขียนค่า secret ลงในไฟล์ `.env.local` โปรดเก็บไฟล์นี้เป็นความลับ
และอย่านำเข้าสู่ระบบ Git (ต้องไม่ถูก track)

### GitHub OAuth

GitHub OAuth เป็นตัวเลือกเสริม หากต้องการเปิดใช้งาน:

1. ไปที่ **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. กำหนด Homepage URL เป็น `http://localhost:3000`
3. กำหนด Authorization callback URL เป็น
   `http://localhost:3000/api/auth/callback/github`
4. สร้างแอป จากนั้นสร้าง client secret แล้วเพิ่ม client ID และ secret ของแอปลงในไฟล์ `.env.local`:

   ```dotenv
   AUTH_GITHUB_ID="your-client-id"
   AUTH_GITHUB_SECRET="your-client-secret"
   ```

5. รีสตาร์ตเซิร์ฟเวอร์สำหรับการพัฒนา จากนั้นจะสามารถล็อกอินด้วย GitHub ได้ที่หน้า `/login` และหน้าเฉพาะ `/login-github`

โปรดเก็บ client secret เป็นความลับ ห้าม commit ลง repository หรือส่งต่อในแชต

เมื่อนำไปใช้งานจริงหลัง reverse proxy ที่เชื่อถือได้ ให้ตั้งค่า `AUTH_TRUST_HOST=true`
ในสภาพแวดล้อมของ production

รัน database migration:

```powershell
npx prisma migrate dev --name auth_user
npx prisma generate
```

เริ่มเซิร์ฟเวอร์สำหรับการพัฒนา:

```powershell
npm run dev
```

## บทบาทผู้ใช้ (Roles)

บัญชีใหม่ที่สมัครด้วยอีเมล/รหัสผ่านและบัญชี GitHub จะได้รับบทบาท `USER` เฉพาะผู้ใช้ที่มีบทบาท
`ADMIN` เท่านั้นที่เข้าหน้า `/admin` ได้ หากต้องการเลื่อนระดับบัญชีในระหว่างการพัฒนาบนเครื่อง
ให้รัน `npx prisma studio` แก้ไขค่า `role` ของผู้ใช้คนนั้นเป็น `ADMIN` แล้วบันทึก
ห้ามให้สิทธิ์ระดับสูงผ่านฟอร์มสมัครสมาชิกสาธารณะโดยเด็ดขาด

หน้า Admin Dashboard จะแสดงรายชื่อบัญชีที่สมัครด้วยอีเมล/รหัสผ่าน และอนุญาตให้ผู้ดูแลระบบลบบัญชีอื่นได้หลังจากยืนยันแล้ว
ไม่สามารถลบบัญชีที่กำลังล็อกอินอยู่ และไม่สามารถลบผู้ดูแลระบบคนสุดท้ายได้
บัญชี GitHub OAuth ไม่ได้ถูกเก็บไว้ในตาราง `User` ภายในเครื่อง จึงไม่แสดงในรายการนี้
