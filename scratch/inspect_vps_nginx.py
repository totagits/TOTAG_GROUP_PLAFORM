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

run_cmd("cat /etc/nginx/sites-enabled/* || cat /etc/nginx/nginx.conf")
run_cmd("curl -i -X POST http://localhost:3000/api/catering/auth/login -H 'Content-Type: application/json' -d '{\"username\":\"admin_toceps\",\"password\":\"Zwedru4gedeh\"}'")

ssh.close()
