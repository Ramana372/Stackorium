# Ansible Documentation

## Overview

Ansible is an open-source automation tool that simplifies configuration management, application deployment, task automation, and orchestration. Unlike other configuration management tools, Ansible is agentless and uses SSH for communication, making it easy to set up and use.

**Key Features:**
- **Agentless Architecture**: No agents required on managed nodes
- **Simple YAML Syntax**: Easy-to-read playbooks using YAML
- **Idempotent Operations**: Safe to run multiple times
- **Push-Based Model**: Control node pushes configurations
- **Extensive Module Library**: 3000+ built-in modules
- **Cross-Platform**: Supports Linux, Windows, macOS, network devices
- **Ansible Galaxy**: Community-contributed roles and collections

**Use Cases:**
- Configuration management and provisioning
- Application deployment and orchestration
- Continuous delivery pipelines
- Security and compliance automation
- Network automation
- Cloud infrastructure management

## Installation

### Linux (Ubuntu/Debian)

```bash
# Update package index
sudo apt update

# Install Ansible
sudo apt install ansible -y

# Verify installation
ansible --version

# Install using pip (latest version)
sudo apt install python3-pip -y
pip3 install ansible

# Install specific version
pip3 install ansible==2.10.7
```

### Linux (CentOS/RHEL)

```bash
# Enable EPEL repository
sudo yum install epel-release -y

# Install Ansible
sudo yum install ansible -y

# Using pip
sudo yum install python3-pip -y
pip3 install ansible
```

### macOS

```bash
# Using Homebrew
brew install ansible

# Using pip
pip3 install ansible

# Verify installation
ansible --version
```

### Windows (Control Node)

```bash
# Ansible control node is not supported on Windows natively
# Use WSL (Windows Subsystem for Linux)
wsl --install
# Then follow Linux installation steps

# Or use Docker
docker run -it --rm -v ${PWD}:/ansible ansible/ansible:latest
```

## Ansible Architecture

### Components

1. **Control Node**: Machine where Ansible is installed and runs from
2. **Managed Nodes**: Servers/devices managed by Ansible
3. **Inventory**: List of managed nodes
4. **Modules**: Units of code executed on managed nodes
5. **Playbooks**: YAML files defining automation tasks
6. **Roles**: Reusable organization of playbooks
7. **Collections**: Distribution format for roles, modules, plugins

### Connection Methods

- **SSH**: Default for Linux/Unix systems
- **WinRM**: For Windows systems
- **Local**: For localhost execution
- **Network**: For network devices (Cisco, Juniper, etc.)

## Inventory

### Basic Inventory File

```ini
# /etc/ansible/hosts or inventory.ini

# Single hosts
web1.example.com
web2.example.com

# Group of hosts
[webservers]
web1.example.com
web2.example.com
web3.example.com

[databases]
db1.example.com
db2.example.com

# Host with custom SSH port
web4.example.com:2222

# Using IP addresses
[loadbalancers]
192.168.1.10
192.168.1.11

# Group variables
[webservers:vars]
http_port=80
max_clients=200
```

### YAML Inventory

```yaml
# inventory.yml
all:
  hosts:
    mail.example.com:
  children:
    webservers:
      hosts:
        web1.example.com:
        web2.example.com:
      vars:
        http_port: 80
        max_clients: 200
    databases:
      hosts:
        db1.example.com:
        db2.example.com:
      vars:
        mysql_port: 3306
```

### Dynamic Inventory

```python
#!/usr/bin/env python3
# dynamic_inventory.py

import json

def get_inventory():
    return {
        'webservers': {
            'hosts': ['web1.example.com', 'web2.example.com'],
            'vars': {'http_port': 80}
        },
        '_meta': {
            'hostvars': {
                'web1.example.com': {'ansible_user': 'admin'},
                'web2.example.com': {'ansible_user': 'admin'}
            }
        }
    }

if __name__ == '__main__':
    print(json.dumps(get_inventory()))
```

## Playbooks

### Basic Playbook Structure

```yaml
# playbook.yml
---
- name: Configure web servers
  hosts: webservers
  become: yes
  vars:
    http_port: 80
    doc_root: /var/www/html
  
  tasks:
    - name: Install Apache
      apt:
        name: apache2
        state: present
        update_cache: yes
    
    - name: Start Apache service
      service:
        name: apache2
        state: started
        enabled: yes
    
    - name: Copy website files
      copy:
        src: index.html
        dest: "{{ doc_root }}/index.html"
        owner: www-data
        group: www-data
        mode: '0644'
```

### Multiple Plays

```yaml
---
- name: Configure web servers
  hosts: webservers
  become: yes
  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: present

- name: Configure database servers
  hosts: databases
  become: yes
  tasks:
    - name: Install MySQL
      apt:
        name: mysql-server
        state: present
```

### Running Playbooks

```bash
# Basic execution
ansible-playbook playbook.yml

# Specify inventory
ansible-playbook -i inventory.ini playbook.yml

# Limit to specific hosts
ansible-playbook playbook.yml --limit web1.example.com

# Check mode (dry run)
ansible-playbook playbook.yml --check

# Step-by-step execution
ansible-playbook playbook.yml --step

# Verbose output
ansible-playbook playbook.yml -v
ansible-playbook playbook.yml -vvv  # More verbose
```

## Modules

### Common Modules

#### Package Management

```yaml
- name: Install packages (apt)
  apt:
    name:
      - nginx
      - git
      - vim
    state: present
    update_cache: yes

- name: Install packages (yum)
  yum:
    name: httpd
    state: latest

- name: Remove package
  apt:
    name: apache2
    state: absent
```

#### File Operations

```yaml
- name: Create directory
  file:
    path: /opt/myapp
    state: directory
    mode: '0755'
    owner: appuser
    group: appuser

- name: Copy file
  copy:
    src: /local/path/file.txt
    dest: /remote/path/file.txt
    backup: yes

- name: Create symlink
  file:
    src: /opt/myapp/current
    dest: /opt/myapp/releases/v1.0
    state: link

- name: Template configuration
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
    validate: 'nginx -t -c %s'
```

#### Service Management

```yaml
- name: Start and enable service
  service:
    name: nginx
    state: started
    enabled: yes

- name: Restart service
  systemd:
    name: apache2
    state: restarted
    daemon_reload: yes
```

#### User Management

```yaml
- name: Create user
  user:
    name: deploy
    shell: /bin/bash
    groups: sudo,docker
    append: yes
    create_home: yes

- name: Add SSH key
  authorized_key:
    user: deploy
    key: "{{ lookup('file', '/path/to/id_rsa.pub') }}"
```

#### Command Execution

```yaml
- name: Run command
  command: /usr/bin/update-alternatives --set python /usr/bin/python3
  
- name: Run shell command with pipes
  shell: ps aux | grep nginx | grep -v grep
  
- name: Execute script
  script: /path/to/local/script.sh
  args:
    creates: /path/to/marker/file
```

## Variables

### Defining Variables

```yaml
# In playbook
---
- hosts: webservers
  vars:
    http_port: 80
    server_name: example.com
  tasks:
    - name: Configure nginx
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/sites-available/{{ server_name }}

# In separate file (vars.yml)
http_port: 80
max_clients: 200
db_host: db.example.com
```

### Variable Files

```yaml
# playbook.yml
---
- hosts: webservers
  vars_files:
    - vars/common.yml
    - vars/{{ ansible_distribution }}.yml
  tasks:
    - name: Install package
      apt:
        name: "{{ package_name }}"
```

### Host and Group Variables

```bash
# Directory structure
inventory/
  production/
    hosts
    group_vars/
      webservers.yml
      databases.yml
    host_vars/
      web1.example.com.yml
```

```yaml
# group_vars/webservers.yml
http_port: 80
max_clients: 200
ssl_enabled: true

# host_vars/web1.example.com.yml
ansible_user: admin
ansible_port: 2222
```

### Variable Precedence

1. Extra vars (`-e` on command line) - Highest priority
2. Task vars (in play)
3. Block vars
4. Role and include vars
5. Set_facts / registered vars
6. Include params
7. Role params
8. Host facts
9. Playbook host_vars
10. Playbook group_vars
11. Inventory host_vars
12. Inventory group_vars
13. Inventory vars
14. Role defaults - Lowest priority

## Roles

### Role Structure

```bash
roles/
  webserver/
    tasks/
      main.yml
    handlers/
      main.yml
    templates/
      nginx.conf.j2
    files/
      index.html
    vars/
      main.yml
    defaults/
      main.yml
    meta/
      main.yml
```

### Creating a Role

```yaml
# roles/webserver/tasks/main.yml
---
- name: Install nginx
  apt:
    name: nginx
    state: present

- name: Copy nginx config
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: Restart nginx

- name: Start nginx
  service:
    name: nginx
    state: started
    enabled: yes

# roles/webserver/handlers/main.yml
---
- name: Restart nginx
  service:
    name: nginx
    state: restarted

# roles/webserver/defaults/main.yml
---
http_port: 80
server_name: localhost
```

### Using Roles

```yaml
# playbook.yml
---
- hosts: webservers
  become: yes
  roles:
    - webserver
    - { role: database, db_port: 3306 }
    - role: monitoring
      vars:
        alert_email: admin@example.com
```

### Ansible Galaxy

```bash
# Initialize new role
ansible-galaxy init my-role

# Install role from Galaxy
ansible-galaxy install geerlingguy.nginx

# Install from requirements file
# requirements.yml
- src: geerlingguy.nginx
- src: geerlingguy.mysql
  version: 3.3.0

ansible-galaxy install -r requirements.yml

# List installed roles
ansible-galaxy list

# Remove role
ansible-galaxy remove geerlingguy.nginx
```

## Conditionals and Loops

### Conditionals

```yaml
- name: Install Apache (Debian)
  apt:
    name: apache2
  when: ansible_os_family == "Debian"

- name: Install Apache (RedHat)
  yum:
    name: httpd
  when: ansible_os_family == "RedHat"

- name: Multiple conditions (AND)
  service:
    name: nginx
    state: started
  when:
    - ansible_distribution == "Ubuntu"
    - ansible_distribution_version == "20.04"

- name: Multiple conditions (OR)
  debug:
    msg: "This is a production server"
  when: inventory_hostname in groups['production'] or environment == "prod"
```

### Loops

```yaml
# Simple loop
- name: Install multiple packages
  apt:
    name: "{{ item }}"
    state: present
  loop:
    - nginx
    - git
    - vim

# Loop with hash/dictionary
- name: Create users
  user:
    name: "{{ item.name }}"
    groups: "{{ item.groups }}"
  loop:
    - { name: 'alice', groups: 'sudo' }
    - { name: 'bob', groups: 'users' }

# Loop with_items (legacy)
- name: Copy files
  copy:
    src: "{{ item }}"
    dest: /opt/files/
  with_items:
    - file1.txt
    - file2.txt

# Loop with_dict
- name: Set firewall rules
  ufw:
    rule: allow
    port: "{{ item.value }}"
    proto: tcp
  with_dict:
    ssh: 22
    http: 80
    https: 443
```

## Handlers

```yaml
# tasks/main.yml
- name: Copy nginx config
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify:
    - Restart nginx
    - Reload firewall

- name: Update SSL certificate
  copy:
    src: ssl/cert.pem
    dest: /etc/ssl/certs/cert.pem
  notify: Restart nginx

# handlers/main.yml
- name: Restart nginx
  service:
    name: nginx
    state: restarted

- name: Reload firewall
  command: ufw reload

# Handlers run once at end of play, even if notified multiple times
```

## Templates (Jinja2)

### Basic Template

```jinja2
{# templates/nginx.conf.j2 #}
server {
    listen {{ http_port }};
    server_name {{ server_name }};
    
    root {{ document_root }};
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    {% if ssl_enabled %}
    listen 443 ssl;
    ssl_certificate {{ ssl_cert_path }};
    ssl_certificate_key {{ ssl_key_path }};
    {% endif %}
}
```

### Advanced Template Features

```jinja2
{# Conditionals #}
{% if ansible_distribution == "Ubuntu" %}
User www-data
{% elif ansible_distribution == "CentOS" %}
User apache
{% endif %}

{# Loops #}
{% for host in groups['webservers'] %}
server {{ host }};
{% endfor %}

{# Filters #}
{{ server_name | upper }}
{{ file_path | basename }}
{{ my_list | join(', ') }}
{{ timestamp | to_datetime }}

{# Default values #}
{{ custom_var | default('default_value') }}
```

## Ansible Vault

### Encrypting Files

```bash
# Create encrypted file
ansible-vault create secrets.yml

# Encrypt existing file
ansible-vault encrypt vars.yml

# Edit encrypted file
ansible-vault edit secrets.yml

# View encrypted file
ansible-vault view secrets.yml

# Decrypt file
ansible-vault decrypt secrets.yml

# Change password
ansible-vault rekey secrets.yml
```

### Using Vault in Playbooks

```yaml
# secrets.yml (encrypted)
db_password: supersecret123
api_key: abc123xyz789

# playbook.yml
---
- hosts: databases
  vars_files:
    - secrets.yml
  tasks:
    - name: Configure database
      mysql_db:
        login_password: "{{ db_password }}"
```

```bash
# Run with vault password
ansible-playbook playbook.yml --ask-vault-pass

# Use password file
ansible-playbook playbook.yml --vault-password-file ~/.vault_pass

# Multiple vault passwords
ansible-playbook playbook.yml --vault-id prod@prompt --vault-id dev@.dev_vault_pass
```

### Inline Vault Variables

```yaml
db_password: !vault |
  $ANSIBLE_VAULT;1.1;AES256
  66386439653765386662373031646234...
```

## Ad-Hoc Commands

```bash
# Ping all hosts
ansible all -m ping

# Run command on hosts
ansible webservers -a "uptime"

# Copy file
ansible databases -m copy -a "src=/local/file dest=/remote/file"

# Install package
ansible webservers -m apt -a "name=nginx state=present" --become

# Gather facts
ansible all -m setup

# Reboot servers
ansible production -m reboot --become

# Check disk space
ansible all -a "df -h"

# Manage service
ansible webservers -m service -a "name=nginx state=restarted" --become
```

## Best Practices

### Project Structure

```bash
ansible-project/
  ansible.cfg
  inventory/
    production/
      hosts
      group_vars/
      host_vars/
    staging/
      hosts
      group_vars/
      host_vars/
  playbooks/
    site.yml
    webservers.yml
    databases.yml
  roles/
    webserver/
    database/
    monitoring/
  library/          # Custom modules
  filter_plugins/   # Custom filters
  files/
  templates/
```

### Configuration File

```ini
# ansible.cfg
[defaults]
inventory = ./inventory/production/hosts
remote_user = ansible
host_key_checking = False
retry_files_enabled = False
gathering = smart
fact_caching = jsonfile
fact_caching_connection = /tmp/ansible_facts
fact_caching_timeout = 3600

[privilege_escalation]
become = True
become_method = sudo
become_user = root
become_ask_pass = False

[ssh_connection]
pipelining = True
control_path = /tmp/ansible-ssh-%%h-%%p-%%r
```

### Writing Playbooks

1. **Use meaningful names**: Clear task and play names
2. **Idempotency**: Ensure tasks can run multiple times safely
3. **Use roles**: Organize reusable code into roles
4. **Tag tasks**: Enable selective execution
5. **Handle errors**: Use `ignore_errors`, `failed_when`, `changed_when`
6. **Validate**: Use `--check` mode before applying
7. **Use variables**: Avoid hardcoding values
8. **Document**: Add comments and README files

```yaml
---
- name: Deploy web application
  hosts: webservers
  become: yes
  tags: [web, deploy]
  
  tasks:
    - name: Ensure nginx is installed
      apt:
        name: nginx
        state: present
      tags: [packages]
    
    - name: Deploy application code
      git:
        repo: https://github.com/user/repo.git
        dest: /var/www/app
        version: "{{ app_version }}"
      tags: [deploy]
      notify: Restart nginx
    
    - name: Check application health
      uri:
        url: http://localhost/health
        status_code: 200
      tags: [verify]
      register: health_check
      failed_when: health_check.status != 200
```

## Error Handling

```yaml
# Ignore errors
- name: This might fail
  command: /bin/false
  ignore_errors: yes

# Define failure condition
- name: Check if file exists
  stat:
    path: /etc/myapp/config.yml
  register: config_file
  failed_when: not config_file.stat.exists

# Define changed condition
- name: Check service status
  command: systemctl is-active nginx
  register: service_status
  changed_when: false

# Block with rescue
- block:
    - name: Copy file
      copy:
        src: /source/file
        dest: /dest/file
  rescue:
    - name: Handle error
      debug:
        msg: "File copy failed, using default"
    - name: Use default file
      copy:
        src: /default/file
        dest: /dest/file
  always:
    - name: This always runs
      debug:
        msg: "Cleanup tasks"
```

## Troubleshooting

### Common Issues

**SSH Connection Failures**
```bash
# Test SSH connection
ansible all -m ping -vvv

# Use different SSH key
ansible-playbook playbook.yml --private-key=~/.ssh/custom_key

# Disable host key checking
export ANSIBLE_HOST_KEY_CHECKING=False
```

**Permission Issues**
```bash
# Use become (sudo)
ansible-playbook playbook.yml --become --ask-become-pass

# Specify become user
ansible-playbook playbook.yml --become --become-user=root
```

**Module Not Found**
```bash
# Check module availability
ansible-doc <module_name>

# Install collection
ansible-galaxy collection install community.general
```

**Variable Issues**
```bash
# Debug variables
- debug:
    var: my_variable
    
- debug:
    msg: "Value is {{ my_variable }}"

# Show all facts
ansible hostname -m setup
```

### Debugging

```yaml
# Verbose output
- name: Debug task
  debug:
    msg: "Variable value: {{ my_var }}"
    verbosity: 2

# Register and display output
- name: Run command
  command: ls -la /tmp
  register: cmd_output

- name: Show output
  debug:
    var: cmd_output.stdout_lines

# Assert conditions
- name: Validate configuration
  assert:
    that:
      - ansible_distribution == "Ubuntu"
      - ansible_distribution_version >= "18.04"
    fail_msg: "Unsupported OS version"
    success_msg: "OS version validated"
```

## Quick Reference

### Essential Commands

```bash
# Inventory
ansible-inventory --list
ansible-inventory --graph

# Playbooks
ansible-playbook playbook.yml
ansible-playbook playbook.yml --check
ansible-playbook playbook.yml --tags "web,db"
ansible-playbook playbook.yml --skip-tags "deploy"
ansible-playbook playbook.yml --limit webservers
ansible-playbook playbook.yml --start-at-task "Install packages"

# Ad-hoc
ansible all -m ping
ansible all -a "command"
ansible all -m setup -a "filter=ansible_distribution*"

# Vault
ansible-vault create/edit/view/encrypt/decrypt file.yml

# Galaxy
ansible-galaxy init role-name
ansible-galaxy install role-name
ansible-galaxy collection install collection-name

# Documentation
ansible-doc module_name
ansible-doc -l  # List all modules
```

### Common Modules

- **Package**: `apt`, `yum`, `package`
- **Files**: `copy`, `template`, `file`, `lineinfile`
- **Service**: `service`, `systemd`
- **User**: `user`, `group`, `authorized_key`
- **Command**: `command`, `shell`, `script`
- **Source Control**: `git`
- **Database**: `mysql_db`, `postgresql_db`
- **Cloud**: `ec2`, `azure_rm`, `gcp_compute`
- **Network**: `ufw`, `firewalld`, `iptables`

## Learning Resources

### Official Documentation
- **Ansible Documentation**: https://docs.ansible.com
- **Getting Started Guide**: https://docs.ansible.com/ansible/latest/user_guide/intro_getting_started.html
- **Module Index**: https://docs.ansible.com/ansible/latest/collections/index_module.html
- **Best Practices**: https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html

### Community
- **Ansible Galaxy**: https://galaxy.ansible.com
- **GitHub Repository**: https://github.com/ansible/ansible
- **Community Forums**: https://forum.ansible.com
- **Reddit**: r/ansible
- **IRC**: #ansible on Libera.Chat

### Training
- **Red Hat Ansible Automation**: Official training courses
- **Ansible for DevOps** (Book by Jeff Geerling)
- **Udemy Courses**: Various Ansible certification prep courses
- **Linux Academy**: Ansible learning paths

### Certifications
- **Red Hat Certified Specialist in Ansible Automation**
- Demonstrates skills in automating tasks with Ansible
- Covers playbooks, roles, Ansible Tower basics
