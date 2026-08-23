## Introduction to Linux

Linux is a free, open-source, Unix-like operating system kernel first released by Linus Torvalds in 1991. Combined with GNU tools and packaged into distributions (distros), Linux powers the vast majority of servers, cloud infrastructure, embedded devices, and development environments in the world today. Every developer working with DevOps, cloud, or backend systems eventually works directly in a Linux shell.

### Why Learn Linux?

- **Runs the Internet**: The overwhelming majority of web servers, cloud VMs, and containers run Linux
- **Free and Open Source**: No licensing costs, fully transparent source code
- **Powerful Command Line**: Automate almost anything through shell commands and scripts
- **Stable and Secure**: Renowned for uptime, security, and fine-grained permission control
- **Essential DevOps Skill**: Docker, Kubernetes, CI/CD pipelines, and cloud servers all run on Linux
- **Massive Distro Ecosystem**: Ubuntu, Debian, Fedora, CentOS/RHEL, Arch, and more for any use case

### Key Concepts

- **Kernel**: The core that manages hardware, memory, and processes
- **Shell**: The command-line interface (bash, zsh, etc.) that interprets your commands
- **Filesystem Hierarchy**: Everything is a file, organized in a single unified tree starting at `/`
- **Permissions Model**: Every file/directory has an owner, group, and permission bits
- **Package Managers**: Install and manage software (apt, yum/dnf, pacman)
- **Processes**: Every running program is a process with a PID, manageable and killable
- **Everything is Scriptable**: Bash scripting ties commands together into automation

## Popular Distributions

```
Ubuntu       -> Beginner-friendly, huge community, Debian-based, most common on cloud servers
Debian       -> Stable, minimal, the base for Ubuntu and many other distros
Fedora       -> Cutting-edge features, backed by Red Hat, good for desktop/dev use
CentOS/RHEL  -> Enterprise-grade, long-term support, common in corporate environments
Arch Linux   -> Minimal, highly customizable, rolling release, for advanced users
Alpine       -> Extremely lightweight, popular as a base for Docker images
```

## Getting Access to Linux

```bash
# Windows: use WSL2 (Windows Subsystem for Linux)
wsl --install

# macOS: already Unix-based; use Terminal directly, or install a VM/Docker for a true Linux env
docker run -it ubuntu:24.04 bash

# Linux: you're already there
# Or spin up a cloud VM (AWS EC2, DigitalOcean, GCP, etc.) running Ubuntu/Debian

# Verify your distro and kernel version
cat /etc/os-release
uname -r
```

## The Filesystem Hierarchy

```
/            -> Root of the entire filesystem
/bin, /usr/bin -> Essential user binaries/commands
/sbin        -> System administration binaries
/etc         -> System-wide configuration files
/home        -> Personal directories for each user
/root        -> Home directory for the root user
/var         -> Variable data — logs, caches, spool files
/var/log     -> System and application log files
/tmp         -> Temporary files, cleared on reboot
/opt         -> Optional/third-party software
/proc, /sys  -> Virtual filesystems exposing kernel/process info
/dev         -> Device files (disks, terminals, etc.)
/mnt, /media -> Mount points for external/removable storage
```

## Navigation and File Operations

```bash
# Where am I / what's here
pwd
ls
ls -la          # long format, show hidden files
ls -lh          # human-readable sizes

# Move around
cd /var/log
cd ~            # home directory
cd ..           # parent directory
cd -            # previous directory

# Create
mkdir myfolder
mkdir -p a/b/c  # create nested directories
touch file.txt

# Copy, move, rename
cp file.txt backup.txt
cp -r folder1/ folder2/    # recursive copy for directories
mv file.txt newname.txt
mv file.txt /tmp/

# Delete
rm file.txt
rm -r folder/       # recursive delete
rm -rf folder/       # force, no confirmation — use with extreme caution

# View file content
cat file.txt
less file.txt        # scrollable pager
head -n 20 file.txt   # first 20 lines
tail -n 20 file.txt   # last 20 lines
tail -f app.log       # follow a file live (great for logs)

# Find files
find / -name "*.conf" 2>/dev/null
find . -type f -mtime -1   # files modified in the last day
locate filename.txt        # fast search using a pre-built index
which python3              # show the path of a command
```

## File Permissions

```bash
# View permissions
ls -l file.txt
# -rw-r--r-- 1 user group 1024 Jan 1 12:00 file.txt
# [type][owner][group][other]

# Permission types: r (read=4), w (write=2), x (execute=1)

# Change permissions (numeric)
chmod 755 script.sh    # owner: rwx, group: r-x, other: r-x
chmod 644 file.txt      # owner: rw-, group: r--, other: r--

# Change permissions (symbolic)
chmod u+x script.sh     # add execute for owner
chmod go-w file.txt     # remove write for group and others
chmod -R 755 folder/    # recursive

# Change ownership
chown user:group file.txt
chown -R user:group folder/

# Special permissions
chmod +t /shared_folder   # sticky bit — only owner can delete their files
chmod u+s /usr/bin/program  # setuid — run as the file's owner
```

## Users and Groups

```bash
# Current user info
whoami
id

# Switch users
su - username
sudo command          # run a single command as root
sudo -i                # start a root shell

# User management (requires sudo)
sudo useradd -m newuser
sudo passwd newuser
sudo userdel -r newuser

# Group management
sudo groupadd developers
sudo usermod -aG developers username   # add user to a group
groups username                          # list a user's groups

# View all users
cat /etc/passwd

# Sudoers configuration
sudo visudo
```

## Package Management

### Debian/Ubuntu (APT)

```bash
sudo apt update                  # refresh package index
sudo apt upgrade                 # upgrade installed packages
sudo apt install nginx           # install a package
sudo apt remove nginx            # remove a package
sudo apt autoremove              # remove unused dependencies
apt search nginx                 # search for a package
apt list --installed             # list installed packages
```

### RHEL/Fedora/CentOS (DNF/YUM)

```bash
sudo dnf update
sudo dnf install nginx
sudo dnf remove nginx
dnf search nginx
```

### Arch (Pacman)

```bash
sudo pacman -Syu                 # sync and upgrade
sudo pacman -S nginx             # install
sudo pacman -R nginx             # remove
```

## Process Management

```bash
# List running processes
ps aux
ps aux | grep nginx

# Real-time process monitor
top
htop        # nicer interface, may need installing

# Process details
ps -p <pid> -o pid,ppid,cmd

# Kill a process
kill <pid>              # graceful termination (SIGTERM)
kill -9 <pid>            # force kill (SIGKILL)
killall processname

# Run in background / foreground
command &                # run in background
jobs                     # list background jobs
fg %1                    # bring job 1 to foreground
bg %1                    # resume job 1 in background
nohup command &           # keep running after terminal closes

# Process priority
nice -n 10 command        # start with lower priority
renice 5 -p <pid>          # change priority of a running process
```

## Systemd and Services

```bash
# Manage services
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo systemctl status nginx

# Enable/disable at boot
sudo systemctl enable nginx
sudo systemctl disable nginx

# List all services
systemctl list-units --type=service

# View logs for a service
journalctl -u nginx
journalctl -u nginx -f     # follow live
journalctl --since "1 hour ago"
```

## Text Processing

```bash
# grep — search text
grep "error" app.log
grep -r "TODO" ./src         # recursive search
grep -i "warning" app.log     # case-insensitive
grep -v "debug" app.log       # invert match (exclude)
grep -c "error" app.log       # count matches

# sed — stream editor
sed 's/foo/bar/' file.txt              # replace first match per line
sed 's/foo/bar/g' file.txt              # replace all matches
sed -i 's/foo/bar/g' file.txt           # edit file in place
sed -n '5,10p' file.txt                 # print lines 5-10

# awk — pattern scanning and processing
awk '{print $1}' file.txt               # print first column
awk -F: '{print $1}' /etc/passwd         # custom field separator
awk '$3 > 100 {print $0}' data.txt       # conditional print

# sort and uniq
sort file.txt
sort -n numbers.txt        # numeric sort
sort -r file.txt            # reverse
uniq file.txt                # remove adjacent duplicates
sort file.txt | uniq -c      # count occurrences

# cut and wc
cut -d, -f1,3 data.csv       # extract columns 1 and 3 from CSV
wc -l file.txt                # count lines
wc -w file.txt                # count words

# Piping and redirection
command1 | command2           # pipe output to next command
command > output.txt           # redirect stdout (overwrite)
command >> output.txt          # redirect stdout (append)
command 2> errors.txt          # redirect stderr
command &> all_output.txt       # redirect both stdout and stderr
```

## Disk and Storage

```bash
# Disk usage
df -h                # disk space per filesystem
du -sh /var/log       # size of a directory
du -sh * | sort -rh   # sizes of everything in current dir, sorted

# Mounting
lsblk                       # list block devices
sudo mount /dev/sdb1 /mnt    # mount a device
sudo umount /mnt              # unmount

# Disk info
fdisk -l
```

## Networking

```bash
# Interfaces and IP info
ip addr show
ifconfig            # older tool, may need installing

# Connectivity testing
ping google.com
curl -I https://example.com     # check headers/response
wget https://example.com/file.zip

# Open ports and connections
ss -tulnp            # modern replacement for netstat
netstat -tulnp

# DNS lookup
nslookup example.com
dig example.com

# SSH
ssh user@host
ssh -i key.pem user@host
scp file.txt user@host:/remote/path
rsync -avz ./local/ user@host:/remote/path
```

## Environment Variables

```bash
# View all
env
printenv

# View one
echo $HOME
echo $PATH

# Set for current session
export API_KEY="secret123"

# Persist across sessions
echo 'export API_KEY="secret123"' >> ~/.bashrc
source ~/.bashrc
```

## Shell Scripting Basics

```bash
#!/bin/bash
# deploy.sh — a simple example script

set -e   # exit immediately if a command fails

APP_NAME="myapp"
ENV=${1:-development}   # use first argument, default to "development"

echo "Deploying $APP_NAME to $ENV"

if [ "$ENV" == "production" ]; then
    echo "Running production checks..."
else
    echo "Skipping production checks"
fi

for file in *.log; do
    echo "Found log: $file"
done

# Functions
deploy() {
    local target=$1
    echo "Deploying to $target"
}

deploy "$ENV"
```

```bash
# Make it executable and run
chmod +x deploy.sh
./deploy.sh production
```

## Scheduling with Cron

```bash
# Edit the current user's crontab
crontab -e

# Cron syntax: minute hour day month weekday command
# Run a script every day at 2 AM
0 2 * * * /home/user/backup.sh

# Every 15 minutes
*/15 * * * * /home/user/check.sh

# List current cron jobs
crontab -l

# System-wide cron jobs
/etc/crontab
/etc/cron.d/
```

## Logs and Troubleshooting

```bash
# Common log locations
/var/log/syslog        # general system log (Debian/Ubuntu)
/var/log/auth.log       # authentication attempts
/var/log/nginx/         # web server logs

# Follow logs live
tail -f /var/log/syslog

# systemd journal
journalctl -xe            # recent logs with explanations
journalctl -k              # kernel messages
dmesg | tail                # kernel ring buffer

# Check system resource usage
free -h                     # memory usage
uptime                       # load average and uptime
```

## Security Basics

```bash
# Firewall management (Ubuntu/Debian)
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 443/tcp
sudo ufw status

# Firewall management (RHEL/Fedora)
sudo firewall-cmd --add-service=https --permanent
sudo firewall-cmd --reload

# SSH hardening basics
# Edit /etc/ssh/sshd_config:
#   PermitRootLogin no
#   PasswordAuthentication no  (use SSH keys instead)
sudo systemctl restart sshd

# Check for failed login attempts
sudo grep "Failed password" /var/log/auth.log
```

## Best Practices

- **Avoid running as root** for daily work — use `sudo` for specific privileged commands instead
- **Use SSH keys instead of passwords** for remote access wherever possible
- **Understand `rm -rf` before you run it** — there's no recycle bin in the terminal
- **Automate repetitive tasks with shell scripts** rather than manually repeating commands
- **Keep systems updated** (`apt update && apt upgrade`) to patch security vulnerabilities
- **Monitor logs regularly**, especially `/var/log/auth.log` for unauthorized access attempts
- **Use version control (Git) even for scripts** you write for infrastructure or automation

## Resources

- **Linux Documentation Project**: [tldp.org](https://tldp.org/)
- **Ubuntu Documentation**: [help.ubuntu.com](https://help.ubuntu.com/)
- **Explainshell**: [explainshell.com](https://explainshell.com/) — breaks down any shell command
- **Man Pages**: `man <command>` — built-in documentation for nearly every command

## Summary

Linux is the foundation nearly every developer eventually builds on:

✅ Powers the majority of servers, cloud infrastructure, and containers
✅ A powerful, scriptable command line for automating any task
✅ Fine-grained permissions and user/group access control
✅ Rich process, service, and system monitoring tools built in
✅ Essential text-processing utilities — grep, sed, awk, and pipes
✅ The starting point for Docker, Kubernetes, and every cloud platform

Master Linux fundamentals to navigate, automate, and troubleshoot any server with confidence!
