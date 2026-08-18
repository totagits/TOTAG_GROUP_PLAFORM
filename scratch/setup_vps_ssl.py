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

run_cmd("apt-get update && apt-get install -y certbot python3-certbot-nginx")
run_cmd("certbot --nginx -d srv1902704.hstgr.cloud --non-interactive --agree-tos -m admin@totaggroup.com || true")

ssh.close()
print("\nCertbot SSL setup command finished.")
