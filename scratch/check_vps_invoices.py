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

run_cmd("sudo -u postgres psql -d totaggroup -c 'SELECT id, invoice_number, client_name, client_email, total_amount, created_at FROM catering_invoices ORDER BY id DESC LIMIT 10;' || true")

ssh.close()
