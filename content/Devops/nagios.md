# Nagios

## Overview

Nagios is a powerful open-source monitoring system that enables organizations to identify and resolve IT infrastructure problems before they affect critical business processes. It monitors hosts, services, and network devices, providing alerts when problems occur and when they're resolved.

**Core Benefits:**
- **Comprehensive Monitoring**: Servers, services, networks, applications
- **Proactive Alerting**: Email, SMS, custom notifications
- **Flexible Architecture**: Plugins for monitoring anything
- **Historical Data**: Track performance over time
- **Multi-Tenant**: Monitor multiple organizations
- **Proven Reliability**: Used by thousands of organizations

**Key Features:**
- Monitor network services (SMTP, POP3, HTTP, NNTP, PING, etc.)
- Monitor host resources (CPU, disk, memory, processes)
- Monitor environmental factors (temperature, humidity)
- Remote monitoring via SSH or SSL tunnels
- Event handlers for proactive problem resolution
- Web interface for viewing status and history
- Extensive plugin ecosystem

## Architecture

**Nagios components:**
```
Nagios Core
├── Configuration Files
├── Web Interface (CGIs)
├── Scheduling Engine
├── Plugin Execution
└── Notification System

Monitored Hosts
├── NRPE Agent (Linux/Unix)
├── NSClient++ (Windows)
└── SNMP Agents
```

**Monitoring flow:**
```
1. Nagios schedules check
2. Plugin executes on host/remote
3. Plugin returns status and output
4. Nagios processes result
5. Updates status and triggers alerts
6. Notification sent if needed
```

## Installation

**Install on Ubuntu/Debian:**
```bash
# Update system
sudo apt update
sudo apt upgrade

# Install prerequisites
sudo apt install -y wget build-essential apache2 php openssl perl make \
  php-gd libgd-dev libapache2-mod-php libperl-dev libssl-dev daemon

# Create Nagios user
sudo useradd -m -s /bin/bash nagios
sudo groupadd nagcmd
sudo usermod -a -G nagcmd nagios
sudo usermod -a -G nagcmd www-data

# Download Nagios Core
cd /tmp
wget https://assets.nagios.com/downloads/nagioscore/releases/nagios-4.4.14.tar.gz
tar -xzf nagios-4.4.14.tar.gz
cd nagios-4.4.14

# Compile and install
./configure --with-command-group=nagcmd
make all
sudo make install
sudo make install-init
sudo make install-config
sudo make install-commandmode
sudo make install-webconf

# Create web user
sudo htpasswd -c /usr/local/nagios/etc/htpasswd.users nagiosadmin

# Download and install plugins
cd /tmp
wget https://nagios-plugins.org/download/nagios-plugins-2.4.6.tar.gz
tar -xzf nagios-plugins-2.4.6.tar.gz
cd nagios-plugins-2.4.6

# Compile plugins
./configure --with-nagios-user=nagios --with-nagios-group=nagios
make
sudo make install

# Start services
sudo systemctl restart apache2
sudo systemctl start nagios
sudo systemctl enable nagios

# Access web interface
# http://server-ip/nagios
# Username: nagiosadmin
# Password: (set during htpasswd)
```

**Install on CentOS/RHEL:**
```bash
# Install prerequisites
sudo yum install -y gcc glibc glibc-common wget unzip httpd php gd gd-devel \
  perl postfix make net-snmp openssl-devel

# Create user and group
sudo useradd -m nagios
sudo groupadd nagcmd
sudo usermod -a -G nagcmd nagios
sudo usermod -a -G nagcmd apache

# Download and install Nagios
cd /tmp
wget https://assets.nagios.com/downloads/nagioscore/releases/nagios-4.4.14.tar.gz
tar xzf nagios-4.4.14.tar.gz
cd nagios-4.4.14

./configure --with-command-group=nagcmd
make all
sudo make install
sudo make install-init
sudo make install-config
sudo make install-commandmode
sudo make install-webconf

# Set web password
sudo htpasswd -c /usr/local/nagios/etc/htpasswd.users nagiosadmin

# Install plugins
cd /tmp
wget https://nagios-plugins.org/download/nagios-plugins-2.4.6.tar.gz
tar xzf nagios-plugins-2.4.6.tar.gz
cd nagios-plugins-2.4.6

./configure --with-nagios-user=nagios --with-nagios-group=nagios
make
sudo make install

# Start services
sudo systemctl start httpd
sudo systemctl enable httpd
sudo systemctl start nagios
sudo systemctl enable nagios

# Configure firewall
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

## Configuration Files

**Main configuration file:**
```
# /usr/local/nagios/etc/nagios.cfg
Main Nagios configuration file

Key settings:
- cfg_file: Object configuration files
- cfg_dir: Configuration directories
- log_file: Log file location
- object_cache_file: Cache file
- status_file: Status data file
- check_result_path: Check result directory
```

**Object configuration:**
```
/usr/local/nagios/etc/objects/
├── commands.cfg     # Command definitions
├── contacts.cfg     # Contact definitions
├── localhost.cfg    # Sample localhost monitoring
├── templates.cfg    # Object templates
├── timeperiods.cfg  # Time period definitions
└── windows.cfg      # Windows host example
```

## Host Configuration

**Define a host:**
```cfg
# /usr/local/nagios/etc/objects/hosts/webserver.cfg

define host {
    use                     linux-server
    host_name               web-server-01
    alias                   Web Server 01
    address                 192.168.1.10
    max_check_attempts      5
    check_period            24x7
    notification_interval   30
    notification_period     24x7
    contacts                nagiosadmin
}
```

**Host templates:**
```cfg
# Generic host template
define host {
    name                    generic-host
    notifications_enabled   1
    event_handler_enabled   1
    flap_detection_enabled  1
    process_perf_data       1
    retain_status_information    1
    retain_nonstatus_information 1
    check_command           check-host-alive
    max_check_attempts      3
    notification_interval   0
    notification_period     24x7
    notification_options    d,u,r
    contact_groups          admins
    register                0
}

# Linux server template
define host {
    name                    linux-server
    use                     generic-host
    check_period            24x7
    check_interval          5
    retry_interval          1
    max_check_attempts      10
    check_command           check-host-alive
    notification_period     24x7
    notification_interval   30
    notification_options    d,u,r
    contact_groups          admins
    register                0
}
```

**Host groups:**
```cfg
define hostgroup {
    hostgroup_name  web-servers
    alias           Web Servers
    members         web-server-01,web-server-02,web-server-03
}

define hostgroup {
    hostgroup_name  database-servers
    alias           Database Servers
    members         db-server-01,db-server-02
}
```

## Service Configuration

**Define services:**
```cfg
# Check HTTP service
define service {
    use                     generic-service
    host_name               web-server-01
    service_description     HTTP
    check_command           check_http
    max_check_attempts      3
    check_interval          5
    retry_interval          1
    notification_interval   30
}

# Check HTTPS service
define service {
    use                     generic-service
    host_name               web-server-01
    service_description     HTTPS
    check_command           check_https
}

# Check SSH service
define service {
    use                     generic-service
    host_name               web-server-01
    service_description     SSH
    check_command           check_ssh
}

# Check disk space via NRPE
define service {
    use                     generic-service
    host_name               web-server-01
    service_description     Disk Usage
    check_command           check_nrpe!check_disk
}

# Check CPU load via NRPE
define service {
    use                     generic-service
    host_name               web-server-01
    service_description     CPU Load
    check_command           check_nrpe!check_load
}

# Check memory usage
define service {
    use                     generic-service
    host_name               web-server-01
    service_description     Memory Usage
    check_command           check_nrpe!check_mem
}
```

**Service templates:**
```cfg
define service {
    name                    generic-service
    active_checks_enabled   1
    passive_checks_enabled  1
    parallelize_check       1
    obsess_over_service     1
    check_freshness         0
    notifications_enabled   1
    event_handler_enabled   1
    flap_detection_enabled  1
    process_perf_data       1
    retain_status_information    1
    retain_nonstatus_information 1
    is_volatile             0
    check_period            24x7
    max_check_attempts      3
    check_interval          10
    retry_interval          2
    contact_groups          admins
    notification_options    w,u,c,r
    notification_interval   60
    notification_period     24x7
    register                0
}
```

## Command Definitions

**Standard commands:**
```cfg
# Check host alive
define command {
    command_name    check-host-alive
    command_line    $USER1$/check_ping -H $HOSTADDRESS$ -w 3000.0,80% -c 5000.0,100% -p 5
}

# Check HTTP
define command {
    command_name    check_http
    command_line    $USER1$/check_http -H $HOSTADDRESS$ -w 5 -c 10
}

# Check HTTPS
define command {
    command_name    check_https
    command_line    $USER1$/check_http -H $HOSTADDRESS$ -S -w 5 -c 10
}

# Check SSH
define command {
    command_name    check_ssh
    command_line    $USER1$/check_ssh -H $HOSTADDRESS$
}

# Check NRPE
define command {
    command_name    check_nrpe
    command_line    $USER1$/check_nrpe -H $HOSTADDRESS$ -c $ARG1$
}

# Check MySQL
define command {
    command_name    check_mysql
    command_line    $USER1$/check_mysql -H $HOSTADDRESS$ -u $ARG1$ -p $ARG2$
}

# Check DNS
define command {
    command_name    check_dns
    command_line    $USER1$/check_dns -H $ARG1$ -s $HOSTADDRESS$
}
```

## Contacts & Notifications

**Define contacts:**
```cfg
define contact {
    contact_name                    nagiosadmin
    alias                           Nagios Admin
    service_notification_period     24x7
    host_notification_period        24x7
    service_notification_options    w,u,c,r
    host_notification_options       d,u,r
    service_notification_commands   notify-service-by-email
    host_notification_commands      notify-host-by-email
    email                           admin@example.com
}

define contact {
    contact_name                    oncall
    alias                           On-Call Engineer
    service_notification_period     24x7
    host_notification_period        24x7
    service_notification_options    w,u,c,r
    host_notification_options       d,u,r
    service_notification_commands   notify-service-by-email,notify-service-by-sms
    host_notification_commands      notify-host-by-email,notify-host-by-sms
    email                           oncall@example.com
    pager                           1234567890@sms.example.com
}
```

**Contact groups:**
```cfg
define contactgroup {
    contactgroup_name   admins
    alias               Nagios Administrators
    members             nagiosadmin,oncall
}

define contactgroup {
    contactgroup_name   developers
    alias               Development Team
    members             dev1,dev2,dev3
}
```

**Notification commands:**
```cfg
# Email notification for services
define command {
    command_name    notify-service-by-email
    command_line    /usr/bin/printf "%b" "***** Nagios *****\n\nNotification Type: $NOTIFICATIONTYPE$\n\nService: $SERVICEDESC$\nHost: $HOSTALIAS$\nAddress: $HOSTADDRESS$\nState: $SERVICESTATE$\n\nDate/Time: $LONGDATETIME$\n\nAdditional Info:\n\n$SERVICEOUTPUT$\n" | /usr/bin/mail -s "** $NOTIFICATIONTYPE$ Service Alert: $HOSTALIAS$/$SERVICEDESC$ is $SERVICESTATE$ **" $CONTACTEMAIL$
}

# Email notification for hosts
define command {
    command_name    notify-host-by-email
    command_line    /usr/bin/printf "%b" "***** Nagios *****\n\nNotification Type: $NOTIFICATIONTYPE$\nHost: $HOSTNAME$\nState: $HOSTSTATE$\nAddress: $HOSTADDRESS$\nInfo: $HOSTOUTPUT$\n\nDate/Time: $LONGDATETIME$\n" | /usr/bin/mail -s "** $NOTIFICATIONTYPE$ Host Alert: $HOSTNAME$ is $HOSTSTATE$ **" $CONTACTEMAIL$
}
```

## NRPE (Remote Monitoring)

**Install NRPE on monitored host:**
```bash
# Ubuntu/Debian
sudo apt install -y nagios-nrpe-server nagios-plugins

# CentOS/RHEL
sudo yum install -y nrpe nagios-plugins-all

# Configure NRPE
sudo nano /etc/nagios/nrpe.cfg
```

**NRPE configuration:**
```cfg
# /etc/nagios/nrpe.cfg

# Allow Nagios server
allowed_hosts=127.0.0.1,192.168.1.5

# Commands
command[check_disk]=/usr/lib/nagios/plugins/check_disk -w 20% -c 10% -p /
command[check_load]=/usr/lib/nagios/plugins/check_load -w 15,10,5 -c 30,25,20
command[check_mem]=/usr/lib/nagios/plugins/check_mem.pl -w 80 -c 90
command[check_procs]=/usr/lib/nagios/plugins/check_procs -w 250 -c 400
command[check_users]=/usr/lib/nagios/plugins/check_users -w 5 -c 10
command[check_swap]=/usr/lib/nagios/plugins/check_swap -w 20% -c 10%
command[check_zombie_procs]=/usr/lib/nagios/plugins/check_procs -w 5 -c 10 -s Z
command[check_total_procs]=/usr/lib/nagios/plugins/check_procs -w 150 -c 200
```

**Start NRPE service:**
```bash
# Ubuntu/Debian
sudo systemctl restart nagios-nrpe-server
sudo systemctl enable nagios-nrpe-server

# CentOS/RHEL
sudo systemctl restart nrpe
sudo systemctl enable nrpe

# Open firewall
sudo firewall-cmd --permanent --add-port=5666/tcp
sudo firewall-cmd --reload
```

**Install NRPE plugin on Nagios server:**
```bash
# Ubuntu/Debian
sudo apt install -y nagios-nrpe-plugin

# CentOS/RHEL
sudo yum install -y nagios-plugins-nrpe

# Test connection
/usr/lib/nagios/plugins/check_nrpe -H 192.168.1.10
```

## Custom Plugins

**Create custom plugin:**
```bash
#!/bin/bash
# /usr/local/nagios/libexec/check_custom.sh

# Nagios return codes
STATE_OK=0
STATE_WARNING=1
STATE_CRITICAL=2
STATE_UNKNOWN=3

# Check logic
value=$(cat /proc/loadavg | awk '{print $1}')
threshold_warning=2.0
threshold_critical=4.0

# Compare values
if (( $(echo "$value > $threshold_critical" | bc -l) )); then
    echo "CRITICAL - Load is $value"
    exit $STATE_CRITICAL
elif (( $(echo "$value > $threshold_warning" | bc -l) )); then
    echo "WARNING - Load is $value"
    exit $STATE_WARNING
else
    echo "OK - Load is $value"
    exit $STATE_OK
fi
```

**Make plugin executable:**
```bash
chmod +x /usr/local/nagios/libexec/check_custom.sh

# Test plugin
/usr/local/nagios/libexec/check_custom.sh
```

**Define command:**
```cfg
define command {
    command_name    check_custom
    command_line    $USER1$/check_custom.sh
}
```

## Time Periods

**Define time periods:**
```cfg
# 24x7 monitoring
define timeperiod {
    timeperiod_name 24x7
    alias           24 Hours A Day, 7 Days A Week
    sunday          00:00-24:00
    monday          00:00-24:00
    tuesday         00:00-24:00
    wednesday       00:00-24:00
    thursday        00:00-24:00
    friday          00:00-24:00
    saturday        00:00-24:00
}

# Business hours
define timeperiod {
    timeperiod_name workhours
    alias           Standard Work Hours
    monday          09:00-17:00
    tuesday         09:00-17:00
    wednesday       09:00-17:00
    thursday        09:00-17:00
    friday          09:00-17:00
}

# Non-business hours
define timeperiod {
    timeperiod_name nonworkhours
    alias           Non-Work Hours
    sunday          00:00-24:00
    monday          00:00-09:00,17:00-24:00
    tuesday         00:00-09:00,17:00-24:00
    wednesday       00:00-09:00,17:00-24:00
    thursday        00:00-09:00,17:00-24:00
    friday          00:00-09:00,17:00-24:00
    saturday        00:00-24:00
}
```

## Nagios Commands

**Essential commands:**
```bash
# Verify configuration
/usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg

# Start Nagios
sudo systemctl start nagios

# Stop Nagios
sudo systemctl stop nagios

# Restart Nagios
sudo systemctl restart nagios

# Reload configuration (no restart)
sudo systemctl reload nagios

# Check status
sudo systemctl status nagios

# View logs
tail -f /usr/local/nagios/var/nagios.log
```

## Web Interface

**Access web interface:**
```
URL: http://your-server/nagios
Username: nagiosadmin
Password: (set during installation)
```

**Main sections:**
- **Tactical Overview**: Quick status summary
- **Hosts**: View all monitored hosts
- **Services**: View all monitored services
- **Host Groups**: Grouped hosts
- **Service Groups**: Grouped services
- **Problems**: Current issues
- **Map**: Network topology
- **Reports**: Availability, alerts, notifications
- **Configuration**: View current configuration

## Best Practices

**Organization:**
- Separate configuration files by host/function
- Use templates for common settings
- Document custom plugins
- Use meaningful names for objects
- Keep configuration in version control

**Monitoring strategy:**
```cfg
# Monitor critical services first
- Database servers
- Web servers
- Email servers
- DNS servers
- Core network devices

# Add secondary services
- Application-specific checks
- Custom business metrics
- Performance metrics

# Set appropriate thresholds
- Warning: Early notification
- Critical: Immediate action required
```

**Performance tuning:**
```cfg
# nagios.cfg optimizations
enable_environment_macros=0
free_child_process_memory=1
child_processes_fork_twice=1
use_large_installation_tweaks=1
```

## Troubleshooting

**Common issues:**
```bash
# Nagios won't start
# Check configuration
/usr/local/nagios/bin/nagios -v /usr/local/nagios/etc/nagios.cfg

# Check permissions
ls -la /usr/local/nagios/var/
sudo chown -R nagios:nagios /usr/local/nagios/var/

# Check logs
tail -f /usr/local/nagios/var/nagios.log

# NRPE connection failed
# Test connectivity
telnet remote-host 5666

# Check NRPE on remote host
sudo systemctl status nagios-nrpe-server

# Verify allowed_hosts in nrpe.cfg

# Check not working
# Test plugin manually
/usr/local/nagios/libexec/check_http -H example.com

# Verify command definition
grep check_http /usr/local/nagios/etc/objects/commands.cfg

# Notifications not sent
# Check contact configuration
# Verify email settings
# Test mail command
echo "Test" | mail -s "Test" admin@example.com
```

## Quick Reference

**Object types:**
```cfg
host                    # Monitored device
service                 # Monitored service
contact                 # Person to notify
contactgroup            # Group of contacts
hostgroup               # Group of hosts
servicegroup            # Group of services
timeperiod              # Time definition
command                 # Plugin execution
```

**Service states:**
```
OK          # Service is working
WARNING     # Service issue (non-critical)
CRITICAL    # Service failed
UNKNOWN     # Unable to determine status
```

**Host states:**
```
UP          # Host is reachable
DOWN        # Host is not reachable
UNREACHABLE # Network path down
```

## Learning Resources

**Official Documentation:**
- [Nagios Core Documentation](https://www.nagios.org/documentation/) - Complete guide
- [Nagios Plugins](https://www.nagios.org/downloads/nagios-plugins/) - Plugin documentation
- [Nagios Exchange](https://exchange.nagios.org/) - Community plugins and addons

**Tutorials:**
- [Nagios Quickstart Guide](https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/4/en/quickstart.html)
- [Nagios Support Forum](https://support.nagios.com/forum/)

**Community:**
- [Nagios Community](https://www.nagios.org/community/)
- [Stack Overflow nagios tag](https://stackoverflow.com/questions/tagged/nagios)
