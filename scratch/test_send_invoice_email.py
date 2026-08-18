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

# Execute node script on VPS to test EmailService.sendEmail directly
node_script = '''
import { EmailService } from './server/emailService.js';

async function main() {
  console.log("Testing EmailService.sendEmail to rtalk4348@gmail.com...");
  const res = await EmailService.sendEmail({
    to: "rtalk4348@gmail.com",
    from: "toceps@totaggroup.com",
    subject: "TEST INVOICE DISPATCH - TOTAG GROUP",
    html: "<h1>TOTAG Group Invoice Test</h1><p>Testing live email dispatch to rtalk4348@gmail.com</p>",
    text: "Testing live email dispatch to rtalk4348@gmail.com",
    type: "notification"
  });
  console.log("Email dispatch result:", res);
}

main().catch(console.error);
'''

run_cmd("cat /var/www/totag/dist/server/index.js | grep -i smtp || true")
run_cmd("pm2 logs totag-platform --lines 50 --nostream || true")

ssh.close()
