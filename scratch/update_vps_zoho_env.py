import paramiko
import sys

vps_ip = "2.24.115.245"
vps_user = "root"
vps_pass = "Zwedru4@gedeh"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(vps_ip, username=vps_user, password=vps_pass, timeout=15)

def run_cmd(cmd):
    print(f"\n---> {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='ignore')
    sys.stdout.buffer.write(out.encode('utf-8', errors='ignore'))
    sys.stdout.flush()
    return out

env_content = '''NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://totaguser:Zwedru4@gedeh@localhost:5432/totaggroup
SESSION_SECRET=totag-enterprise-super-secret-key-2026
JWT_SECRET=totag_production_jwt_secret_key_2026_super_secure_9988
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
ZOHO_FROM_EMAIL=info@totaggroup.com
ZOHO_SMTP_USER=info@totaggroup.com
ZOHO_SMTP_PASS=fdq3s5SdrBx0
'''

ssh.exec_command("cat << 'EOF' > /var/www/totag/.env\n" + env_content + "\nEOF")
run_cmd("cat /var/www/totag/.env")
run_cmd("cd /var/www/totag && pm2 restart totag-platform --update-env")

ssh.close()
print("Hostinger VPS .env updated and PM2 process restarted!")
