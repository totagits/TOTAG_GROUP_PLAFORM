import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('2.24.115.245', username='root', password='Zwedru4@gedeh')

stdin, stdout, stderr = ssh.exec_command("cat /etc/nginx/sites-enabled/*")
out = stdout.read().decode('utf-8')
print("NGINX SITES ENABLED:")
print(out)

stdin, stdout, stderr = ssh.exec_command("curl -sI http://totag.network/")
out2 = stdout.read().decode('utf-8')
print("PUBLIC CURL HTTP HEADERS:")
print(out2)

ssh.close()
