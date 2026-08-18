import paramiko

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
    print(out)
    return out

run_cmd("certbot --version || certbot certificates || true")
run_cmd("ls -la /etc/letsencrypt/live/ || true")
run_cmd("cat /etc/nginx/sites-enabled/*")

ssh.close()
