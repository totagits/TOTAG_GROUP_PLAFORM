import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('2.24.115.245', username='root', password='Zwedru4@gedeh')

stdin, stdout, stderr = ssh.exec_command("grep -i 'LIBERIA' /var/www/totag/dist/public/assets/index-VDNi_CD9.js")
out1 = stdout.read().decode('utf-8')
print("Grep 'LIBERIA' in dist JS count:", len(out1))
if len(out1) > 0:
    print("Found snippet:", out1[:300])

stdin, stdout, stderr = ssh.exec_command("grep -i 'Specialized Subsidiaries' /var/www/totag/dist/public/assets/index-VDNi_CD9.js")
out2 = stdout.read().decode('utf-8')
print("Grep 'Specialized Subsidiaries' in dist JS count:", len(out2))

ssh.close()
