# Puppet

## Overview

Puppet is an open-source configuration management tool that automates the provisioning, configuration, and management of infrastructure. It uses a declarative language to describe system configurations, ensuring consistency across thousands of servers.

**Core Benefits:**
- **Infrastructure as Code**: Define desired state declaratively
- **Idempotent**: Safe to run multiple times, same result
- **Cross-Platform**: Linux, Windows, macOS, network devices
- **Scalable**: Manage from 1 to 100,000+ nodes
- **Model-Driven**: Describe what, not how

**Key Features:**
- Declarative configuration language
- Agent-based architecture
- Resource abstraction layer
- Automated compliance and reporting
- Version control integration
- Module ecosystem (Puppet Forge)

**Architecture:**
```
Puppet Master (Server)
├── Compiles catalogs
├── Stores manifests and modules
└── Serves file downloads

Puppet Agent (Node)
├── Runs on managed systems
├── Applies configurations
└── Reports back to master
```

## Installation

**Install Puppet Server (Master):**
```bash
# Ubuntu/Debian
wget https://apt.puppet.com/puppet7-release-focal.deb
sudo dpkg -i puppet7-release-focal.deb
sudo apt update
sudo apt install puppetserver

# Configure memory (edit /etc/default/puppetserver)
JAVA_ARGS="-Xms2g -Xmx2g"

# Start Puppet Server
sudo systemctl start puppetserver
sudo systemctl enable puppetserver

# CentOS/RHEL
sudo rpm -Uvh https://yum.puppet.com/puppet7-release-el-8.noarch.rpm
sudo yum install puppetserver
sudo systemctl start puppetserver
```

**Install Puppet Agent:**
```bash
# Ubuntu/Debian
wget https://apt.puppet.com/puppet7-release-focal.deb
sudo dpkg -i puppet7-release-focal.deb
sudo apt update
sudo apt install puppet-agent

# CentOS/RHEL
sudo rpm -Uvh https://yum.puppet.com/puppet7-release-el-8.noarch.rpm
sudo yum install puppet-agent

# macOS
brew install puppet-agent

# Windows
# Download installer from puppet.com
# Run: puppet-agent-7.x.x-x64.msi
```

**Configure agent:**
```bash
# Edit /etc/puppetlabs/puppet/puppet.conf
[main]
certname = agent-node.example.com
server = puppet.example.com
environment = production

# Run agent (first time)
sudo /opt/puppetlabs/bin/puppet agent --test

# Enable and start agent service
sudo systemctl enable puppet
sudo systemctl start puppet
```

**Sign agent certificate (on master):**
```bash
# List certificate requests
sudo puppetserver ca list

# Sign specific certificate
sudo puppetserver ca sign --certname agent-node.example.com

# Sign all pending
sudo puppetserver ca sign --all
```

## Puppet Language Basics

**Resources - fundamental building blocks:**
```puppet
# Package resource
package { 'nginx':
  ensure => installed,
}

# Service resource
service { 'nginx':
  ensure => running,
  enable => true,
}

# File resource
file { '/etc/nginx/nginx.conf':
  ensure  => file,
  content => template('nginx/nginx.conf.erb'),
  owner   => 'root',
  group   => 'root',
  mode    => '0644',
  notify  => Service['nginx'],
}

# User resource
user { 'webadmin':
  ensure => present,
  uid    => '1001',
  gid    => 'webadmin',
  shell  => '/bin/bash',
  home   => '/home/webadmin',
}

# Group resource
group { 'webadmin':
  ensure => present,
  gid    => '1001',
}

# Exec resource
exec { 'apt-update':
  command => '/usr/bin/apt-get update',
  unless  => '/usr/bin/test -f /var/cache/apt/pkgcache.bin',
}
```

**Resource relationships:**
```puppet
# Before and require
package { 'nginx':
  ensure => installed,
  before => Service['nginx'],
}

service { 'nginx':
  ensure  => running,
  require => Package['nginx'],
}

# Notify and subscribe
file { '/etc/nginx/nginx.conf':
  ensure => file,
  source => 'puppet:///modules/nginx/nginx.conf',
  notify => Service['nginx'],  # Restart service when file changes
}

service { 'nginx':
  ensure    => running,
  subscribe => File['/etc/nginx/nginx.conf'],
}

# Chaining arrows
Package['nginx'] -> File['/etc/nginx/nginx.conf'] ~> Service['nginx']
# -> (before)
# ~> (notify)
```

## Manifests

**Main manifest (site.pp):**
```puppet
# /etc/puppetlabs/code/environments/production/manifests/site.pp

# Default node configuration
node default {
  include common
}

# Specific node
node 'web-server.example.com' {
  include nginx
  include php
}

# Node matching with regex
node /^web-\d+\.example\.com$/ {
  include nginx
}

# Multiple nodes
node 'db-1.example.com', 'db-2.example.com' {
  include postgresql
}
```

**Basic manifest example:**
```puppet
# Install and configure Apache
class apache {
  package { 'apache2':
    ensure => installed,
  }
  
  service { 'apache2':
    ensure    => running,
    enable    => true,
    subscribe => File['/etc/apache2/apache2.conf'],
  }
  
  file { '/etc/apache2/apache2.conf':
    ensure  => file,
    source  => 'puppet:///modules/apache/apache2.conf',
    require => Package['apache2'],
  }
  
  file { '/var/www/html/index.html':
    ensure  => file,
    content => '<h1>Managed by Puppet</h1>',
    require => Package['apache2'],
  }
}
```

## Classes & Modules

**Define a class:**
```puppet
# manifests/init.pp
class nginx {
  package { 'nginx':
    ensure => installed,
  }
  
  service { 'nginx':
    ensure  => running,
    enable  => true,
    require => Package['nginx'],
  }
}

# Use class
include nginx
# Or
class { 'nginx': }
```

**Parameterized class:**
```puppet
class nginx (
  String $version = 'latest',
  Boolean $enable_ssl = false,
  Integer $worker_processes = 4,
) {
  package { 'nginx':
    ensure => $version,
  }
  
  file { '/etc/nginx/nginx.conf':
    ensure  => file,
    content => template('nginx/nginx.conf.erb'),
  }
  
  if $enable_ssl {
    package { 'nginx-ssl':
      ensure => installed,
    }
  }
}

# Use with parameters
class { 'nginx':
  version          => '1.18.0',
  enable_ssl       => true,
  worker_processes => 8,
}
```

**Module structure:**
```
nginx/
├── manifests/
│   ├── init.pp          # Main class
│   ├── install.pp       # Installation
│   ├── config.pp        # Configuration
│   └── service.pp       # Service management
├── files/
│   └── nginx.conf       # Static files
├── templates/
│   └── nginx.conf.erb   # ERB templates
├── lib/
│   └── facter/          # Custom facts
├── facts.d/             # External facts
├── examples/            # Usage examples
└── metadata.json        # Module metadata
```

**Complete module example:**
```puppet
# nginx/manifests/init.pp
class nginx (
  String $package_name = 'nginx',
  String $service_name = 'nginx',
) {
  contain nginx::install
  contain nginx::config
  contain nginx::service
  
  Class['nginx::install']
  -> Class['nginx::config']
  ~> Class['nginx::service']
}

# nginx/manifests/install.pp
class nginx::install {
  package { $nginx::package_name:
    ensure => installed,
  }
}

# nginx/manifests/config.pp
class nginx::config {
  file { '/etc/nginx/nginx.conf':
    ensure  => file,
    content => template('nginx/nginx.conf.erb'),
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
  }
}

# nginx/manifests/service.pp
class nginx::service {
  service { $nginx::service_name:
    ensure => running,
    enable => true,
  }
}
```

## Defined Types

**Create reusable resource definitions:**
```puppet
# Create virtual host definition
define nginx::vhost (
  String $domain,
  Integer $port = 80,
  String $docroot = "/var/www/${title}",
) {
  file { "/etc/nginx/sites-available/${title}":
    ensure  => file,
    content => template('nginx/vhost.erb'),
  }
  
  file { "/etc/nginx/sites-enabled/${title}":
    ensure => link,
    target => "/etc/nginx/sites-available/${title}",
    notify => Service['nginx'],
  }
  
  file { $docroot:
    ensure => directory,
    owner  => 'www-data',
    group  => 'www-data',
    mode   => '0755',
  }
}

# Use defined type
nginx::vhost { 'example.com':
  domain  => 'example.com',
  port    => 80,
  docroot => '/var/www/example',
}

nginx::vhost { 'test.com':
  domain  => 'test.com',
  port    => 8080,
  docroot => '/var/www/test',
}
```

## Variables & Data Types

**Variables:**
```puppet
# Variable assignment
$package_name = 'nginx'
$version = '1.18.0'
$enable_ssl = true

# Arrays
$packages = ['nginx', 'nginx-common', 'nginx-extras']

# Hashes
$config = {
  'worker_processes' => 4,
  'worker_connections' => 1024,
  'keepalive_timeout' => 65,
}

# Access hash values
$workers = $config['worker_processes']

# Facts (system information)
$os_family = $facts['os']['family']
$hostname = $facts['hostname']
$ipaddress = $facts['networking']['ip']

# Conditional assignment
$package = $facts['os']['family'] ? {
  'Debian' => 'nginx',
  'RedHat' => 'nginx',
  default  => 'nginx',
}
```

**Data types:**
```puppet
# String
String $name = 'nginx'

# Integer
Integer $port = 80

# Boolean
Boolean $enable_ssl = true

# Array
Array[String] $packages = ['nginx', 'nginx-common']

# Hash
Hash[String, Any] $config = {
  'port' => 80,
  'ssl'  => false,
}

# Optional
Optional[String] $comment = undef

# Variant (multiple types)
Variant[String, Integer] $port = 80
```

## Conditionals & Iteration

**If/else statements:**
```puppet
if $facts['os']['family'] == 'Debian' {
  $package_name = 'nginx'
} elsif $facts['os']['family'] == 'RedHat' {
  $package_name = 'nginx'
} else {
  fail('Unsupported OS')
}

# Unless
unless $enable_ssl {
  notice('SSL is disabled')
}
```

**Case statements:**
```puppet
case $facts['os']['family'] {
  'Debian': {
    $package = 'nginx'
    $service = 'nginx'
  }
  'RedHat': {
    $package = 'nginx'
    $service = 'nginx'
  }
  default: {
    fail("Unsupported OS: ${facts['os']['family']}")
  }
}
```

**Selectors:**
```puppet
$package = $facts['os']['family'] ? {
  'Debian' => 'nginx',
  'RedHat' => 'nginx',
  default  => fail('Unsupported OS'),
}
```

**Iteration:**
```puppet
# Each on array
$packages = ['nginx', 'nginx-common', 'nginx-extras']
$packages.each |String $package| {
  package { $package:
    ensure => installed,
  }
}

# Each on hash
$vhosts = {
  'example.com' => '/var/www/example',
  'test.com'    => '/var/www/test',
}
$vhosts.each |String $domain, String $docroot| {
  nginx::vhost { $domain:
    domain  => $domain,
    docroot => $docroot,
  }
}

# Map function
$ports = [80, 443, 8080].map |$port| {
  "Port: ${port}"
}
```

## Hiera (Data Separation)

**Configure Hiera:**
```yaml
# /etc/puppetlabs/puppet/hiera.yaml
version: 5
defaults:
  datadir: data
  data_hash: yaml_data

hierarchy:
  - name: "Per-node data"
    path: "nodes/%{trusted.certname}.yaml"
  
  - name: "Per-OS data"
    path: "os/%{facts.os.family}.yaml"
  
  - name: "Common data"
    path: "common.yaml"
```

**Hiera data files:**
```yaml
# data/common.yaml
---
nginx::version: '1.18.0'
nginx::worker_processes: 4
nginx::enable_ssl: false

packages:
  - nginx
  - nginx-common

# data/os/Debian.yaml
---
nginx::package_name: 'nginx'
nginx::service_name: 'nginx'

# data/nodes/web-server.example.com.yaml
---
nginx::worker_processes: 8
nginx::enable_ssl: true
```

**Lookup data in manifests:**
```puppet
class nginx (
  String $version = lookup('nginx::version'),
  Integer $worker_processes = lookup('nginx::worker_processes'),
  Boolean $enable_ssl = lookup('nginx::enable_ssl'),
) {
  # Class implementation
}

# Automatic parameter lookup
class nginx (
  String $version,           # Automatically looks up nginx::version
  Integer $worker_processes,  # Automatically looks up nginx::worker_processes
) {
  # No explicit lookup needed
}

# Direct lookup function
$packages = lookup('packages', Array[String])
```

## Templates

**ERB templates:**
```erb
<%# templates/nginx.conf.erb %>
user <%= @user %>;
worker_processes <%= @worker_processes %>;

events {
    worker_connections <%= @worker_connections %>;
}

http {
    include /etc/nginx/mime.types;
    
    <% @vhosts.each do |domain, config| %>
    server {
        listen <%= config['port'] %>;
        server_name <%= domain %>;
        root <%= config['docroot'] %>;
    }
    <% end %>
}
```

**Use template in manifest:**
```puppet
file { '/etc/nginx/nginx.conf':
  ensure  => file,
  content => template('nginx/nginx.conf.erb'),
}

# EPP (Embedded Puppet Language) template
file { '/etc/nginx/nginx.conf':
  ensure  => file,
  content => epp('nginx/nginx.conf.epp', {
    'user'              => 'www-data',
    'worker_processes'  => 4,
    'worker_connections'=> 1024,
  }),
}
```

## Facts

**Built-in facts:**
```puppet
# System facts
$facts['os']['family']           # Debian, RedHat, etc.
$facts['os']['name']             # Ubuntu, CentOS, etc.
$facts['os']['release']['full']  # 20.04, 8.3, etc.
$facts['kernel']                 # Linux, windows, etc.
$facts['architecture']           # x86_64, amd64, etc.

# Network facts
$facts['networking']['hostname']
$facts['networking']['fqdn']
$facts['networking']['ip']
$facts['networking']['interfaces']

# Hardware facts
$facts['processors']['count']
$facts['memory']['system']['total']
$facts['virtual']  # vmware, virtualbox, physical, etc.
```

**Custom facts:**
```ruby
# lib/facter/custom_fact.rb
Facter.add('custom_fact') do
  setcode do
    'custom_value'
  end
end

# External facts (facts.d/)
# /etc/puppetlabs/facter/facts.d/custom.yaml
---
application_version: '1.2.3'
environment: 'production'
```

## Puppet Commands

**Essential commands:**
```bash
# Apply manifest locally
sudo puppet apply manifest.pp

# Test agent configuration
sudo puppet agent --test

# Show configuration
puppet config print

# Validate syntax
puppet parser validate manifest.pp

# Describe resource types
puppet describe package
puppet describe file

# Resource inspection
puppet resource package nginx
puppet resource user root

# Module commands
puppet module list
puppet module install puppetlabs-apache
puppet module search nginx
puppet module generate myuser-mymodule

# Certificate management
sudo puppetserver ca list
sudo puppetserver ca sign --certname node.example.com
sudo puppetserver ca clean --certname node.example.com
```

## Best Practices

**Code organization:**
```puppet
# Use roles and profiles pattern
# Profile: technology-specific
class profile::webserver {
  include nginx
  include php
}

# Role: business-specific
class role::webserver {
  include profile::webserver
  include profile::monitoring
}

# Assign role to node
node 'web-1.example.com' {
  include role::webserver
}
```

**Version control:**
```bash
# Use Git for Puppet code
git init /etc/puppetlabs/code/environments/production
cd /etc/puppetlabs/code/environments/production
git add .
git commit -m "Initial Puppet configuration"
git remote add origin git@github.com:org/puppet-code.git
git push -u origin main
```

**Testing:**
```bash
# Install PDK (Puppet Development Kit)
# Syntax validation
pdk validate

# Unit tests (rspec-puppet)
pdk test unit

# Create new module
pdk new module mymodule
pdk new class myclass
```

**Security:**
- Use Hiera-eyaml for encrypted secrets
- Implement role-based access control
- Keep Puppet Server updated
- Use certificate-based authentication
- Audit configuration changes
- Separate environments (dev, staging, prod)

## Troubleshooting

**Common issues:**
```bash
# Agent can't connect to master
# Check firewall (port 8140)
sudo firewall-cmd --add-port=8140/tcp --permanent

# Check DNS resolution
nslookup puppet.example.com

# Certificate issues
# Clean certificate on master
sudo puppetserver ca clean --certname node.example.com
# Delete certificate on agent
sudo rm -rf /etc/puppetlabs/puppet/ssl
# Request new certificate
sudo puppet agent --test

# Debug mode
sudo puppet agent --test --debug --verbose

# Dry run (no changes)
sudo puppet agent --test --noop

# View catalog
sudo puppet agent --test --trace
```

**Logs:**
```bash
# Puppet Server logs
/var/log/puppetlabs/puppetserver/puppetserver.log

# Puppet Agent logs
/var/log/puppetlabs/puppet/puppet.log

# Follow logs
sudo tail -f /var/log/puppetlabs/puppetserver/puppetserver.log
```

## Quick Reference

**Resource types:**
```puppet
package { 'name': ensure => installed }
service { 'name': ensure => running, enable => true }
file { '/path': ensure => file, content => 'text' }
user { 'name': ensure => present }
group { 'name': ensure => present }
exec { 'command': command => '/bin/command' }
cron { 'name': command => 'command', hour => 2 }
```

**Class usage:**
```puppet
# Include class
include classname

# Declare class with parameters
class { 'classname':
  param1 => 'value1',
  param2 => 'value2',
}
```

**Relationships:**
```
->   before
~>   notify
<-   require
<~   subscribe
```

## Learning Resources

**Official Documentation:**
- [Puppet Docs](https://puppet.com/docs/puppet/) - Complete documentation
- [Puppet Forge](https://forge.puppet.com/) - Module repository
- [Puppet Language Guide](https://puppet.com/docs/puppet/latest/lang_summary.html)

**Training:**
- [Puppet Learning VM](https://puppet.com/try-puppet/puppet-learning-vm/)
- [Puppet Education](https://puppet.com/learning-training/training/)
- [Puppet Certification](https://puppet.com/learning-training/certification/)

**Community:**
- [Puppet Community Slack](https://slack.puppet.com/)
- [Puppet Community Forum](https://community.puppet.com/)
- [Stack Overflow puppet tag](https://stackoverflow.com/questions/tagged/puppet)

**Books:**
- "Puppet Best Practices" by Chris Barbour
- "Learning Puppet 4" by Jo Rhett
- "Pro Puppet" by James Turnbull
