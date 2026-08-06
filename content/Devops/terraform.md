# Terraform

## Overview

Terraform is an open-source Infrastructure as Code (IaC) tool that allows you to build, change, and version infrastructure safely and efficiently. It uses a declarative configuration language to describe the desired state of your infrastructure across multiple cloud providers.

**Core Benefits:**
- **Multi-Cloud**: AWS, Azure, GCP, and 1000+ providers
- **Declarative**: Describe what you want, not how to create it
- **State Management**: Track infrastructure changes over time
- **Plan & Preview**: See changes before applying them
- **Modular**: Reusable modules for common patterns
- **Version Control**: Infrastructure configurations in Git

**Key Features:**
- Infrastructure as Code
- Execution plans (terraform plan)
- Resource graph for dependencies
- State management and locking
- Provider ecosystem (AWS, Azure, GCP, K8s, etc.)
- Module registry for sharing configurations

## Installation

**Windows:**
```bash
# Using Chocolatey
choco install terraform

# Or download binary
# 1. Download from terraform.io
# 2. Extract terraform.exe
# 3. Add to PATH

# Verify installation
terraform version
```

**macOS:**
```bash
# Using Homebrew
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Verify installation
terraform version
```

**Linux:**
```bash
# Ubuntu/Debian
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# CentOS/RHEL
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
sudo yum -y install terraform

# Verify installation
terraform version
```

**Enable tab completion:**
```bash
terraform -install-autocomplete
```

## Basic Workflow

**Terraform workflow:**
```bash
# 1. Write configuration
# main.tf

# 2. Initialize (download providers)
terraform init

# 3. Plan (preview changes)
terraform plan

# 4. Apply (create infrastructure)
terraform apply

# 5. Destroy (remove infrastructure)
terraform destroy
```

**First example - AWS EC2:**
```hcl
# Configure AWS provider
provider "aws" {
  region = "us-east-1"
}

# Create EC2 instance
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
  }
}
```

**Execute:**
```bash
# Initialize
terraform init

# Format code
terraform fmt

# Validate configuration
terraform validate

# Plan changes
terraform plan

# Apply changes
terraform apply

# Show current state
terraform show

# Destroy resources
terraform destroy
```

## Configuration Language (HCL)

**Basic syntax:**
```hcl
# Block structure
<BLOCK TYPE> "<BLOCK LABEL>" "<BLOCK LABEL>" {
  # Block body
  <IDENTIFIER> = <EXPRESSION>
}

# Resource block
resource "aws_instance" "example" {
  ami           = "ami-abc123"
  instance_type = "t2.micro"
}

# Data source
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }
}

# Variable
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

# Output
output "instance_ip" {
  value = aws_instance.example.public_ip
}
```

**Data types:**
```hcl
# String
variable "region" {
  type    = string
  default = "us-east-1"
}

# Number
variable "port" {
  type    = number
  default = 80
}

# Boolean
variable "enable_monitoring" {
  type    = bool
  default = true
}

# List
variable "availability_zones" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b"]
}

# Map
variable "tags" {
  type = map(string)
  default = {
    Environment = "dev"
    Project     = "web"
  }
}

# Object
variable "instance_config" {
  type = object({
    instance_type = string
    ami           = string
    monitoring    = bool
  })
}
```

## Resources

**Resource syntax:**
```hcl
resource "provider_type" "name" {
  argument1 = value1
  argument2 = value2

  nested_block {
    argument = value
  }
}
```

**Common AWS resources:**
```hcl
# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "main-vpc"
  }
}

# Subnet
resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "public-subnet"
  }
}

# Security Group
resource "aws_security_group" "web" {
  name        = "web-sg"
  description = "Security group for web servers"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 Instance
resource "aws_instance" "web" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]

  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y nginx
              systemctl start nginx
              EOF

  tags = {
    Name = "web-server"
  }
}

# S3 Bucket
resource "aws_s3_bucket" "storage" {
  bucket = "my-unique-bucket-name"

  tags = {
    Name = "Storage Bucket"
  }
}

# RDS Database
resource "aws_db_instance" "postgres" {
  identifier           = "mydb"
  engine               = "postgres"
  engine_version       = "14.7"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  storage_encrypted    = true
  db_name              = "myapp"
  username             = "admin"
  password             = var.db_password
  skip_final_snapshot  = true
}
```

## Variables

**Define variables:**
```hcl
# variables.tf
variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
  
  validation {
    condition     = contains(["t2.micro", "t2.small", "t3.micro"], var.instance_type)
    error_message = "Instance type must be t2.micro, t2.small, or t3.micro."
  }
}

variable "environment" {
  description = "Environment name"
  type        = string
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default = {
    Terraform = "true"
  }
}
```

**Use variables:**
```hcl
# main.tf
resource "aws_instance" "web" {
  ami           = var.ami_id
  instance_type = var.instance_type

  tags = merge(
    var.tags,
    {
      Name = "web-${var.environment}"
    }
  )
}
```

**Provide variable values:**
```bash
# Command line
terraform apply -var="instance_type=t2.small"

# terraform.tfvars
instance_type = "t2.small"
environment   = "dev"

# Environment variables
export TF_VAR_instance_type="t2.small"

# Variable file
terraform apply -var-file="production.tfvars"
```

## Outputs

**Define outputs:**
```hcl
# outputs.tf
output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.web.id
}

output "instance_public_ip" {
  description = "Public IP address"
  value       = aws_instance.web.public_ip
}

output "instance_private_ip" {
  description = "Private IP address"
  value       = aws_instance.web.private_ip
  sensitive   = true
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "connection_string" {
  description = "Database connection string"
  value       = "postgresql://${aws_db_instance.postgres.username}@${aws_db_instance.postgres.endpoint}/${aws_db_instance.postgres.db_name}"
  sensitive   = true
}
```

**View outputs:**
```bash
# Show all outputs
terraform output

# Show specific output
terraform output instance_public_ip

# JSON format
terraform output -json

# Use in scripts
INSTANCE_IP=$(terraform output -raw instance_public_ip)
```

## State Management

**State basics:**
```bash
# View state
terraform show

# List resources in state
terraform state list

# Show specific resource
terraform state show aws_instance.web

# Move resource in state
terraform state mv aws_instance.old aws_instance.new

# Remove resource from state
terraform state rm aws_instance.web

# Pull remote state
terraform state pull > terraform.tfstate.backup

# Push state
terraform state push terraform.tfstate
```

**Remote state (S3 backend):**
```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}
```

**State locking:**
```hcl
# DynamoDB table for state locking
resource "aws_dynamodb_table" "terraform_lock" {
  name           = "terraform-lock"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
```

**Remote state data source:**
```hcl
# Reference state from another workspace
data "terraform_remote_state" "network" {
  backend = "s3"
  config = {
    bucket = "my-terraform-state"
    key    = "network/terraform.tfstate"
    region = "us-east-1"
  }
}

# Use outputs from remote state
resource "aws_instance" "app" {
  subnet_id = data.terraform_remote_state.network.outputs.subnet_id
}
```

## Modules

**Module structure:**
```
modules/
└── vpc/
    ├── main.tf
    ├── variables.tf
    ├── outputs.tf
    └── README.md
```

**Create module:**
```hcl
# modules/vpc/main.tf
resource "aws_vpc" "this" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = var.enable_dns_hostnames

  tags = merge(
    var.tags,
    {
      Name = var.name
    }
  )
}

resource "aws_subnet" "public" {
  count             = length(var.public_subnets)
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.public_subnets[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "${var.name}-public-${count.index + 1}"
  }
}

# modules/vpc/variables.tf
variable "name" {
  description = "VPC name"
  type        = string
}

variable "cidr_block" {
  description = "VPC CIDR block"
  type        = string
}

variable "public_subnets" {
  description = "Public subnet CIDRs"
  type        = list(string)
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
}

variable "tags" {
  description = "Tags"
  type        = map(string)
  default     = {}
}

# modules/vpc/outputs.tf
output "vpc_id" {
  value = aws_vpc.this.id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}
```

**Use module:**
```hcl
# main.tf
module "vpc" {
  source = "./modules/vpc"

  name               = "production-vpc"
  cidr_block         = "10.0.0.0/16"
  public_subnets     = ["10.0.1.0/24", "10.0.2.0/24"]
  availability_zones = ["us-east-1a", "us-east-1b"]

  tags = {
    Environment = "production"
    Terraform   = "true"
  }
}

# Use module outputs
resource "aws_instance" "web" {
  subnet_id = module.vpc.public_subnet_ids[0]
}
```

**Public modules:**
```hcl
# Use module from Terraform Registry
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "my-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = false
}
```

## Provisioners

**File provisioner:**
```hcl
resource "aws_instance" "web" {
  ami           = var.ami_id
  instance_type = "t2.micro"

  provisioner "file" {
    source      = "scripts/setup.sh"
    destination = "/tmp/setup.sh"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("~/.ssh/id_rsa")
      host        = self.public_ip
    }
  }
}
```

**Remote-exec provisioner:**
```hcl
resource "aws_instance" "web" {
  ami           = var.ami_id
  instance_type = "t2.micro"

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y nginx",
      "sudo systemctl start nginx"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("~/.ssh/id_rsa")
      host        = self.public_ip
    }
  }
}
```

**Local-exec provisioner:**
```hcl
resource "aws_instance" "web" {
  ami           = var.ami_id
  instance_type = "t2.micro"

  provisioner "local-exec" {
    command = "echo ${self.private_ip} >> private_ips.txt"
  }

  provisioner "local-exec" {
    when    = destroy
    command = "echo 'Instance destroyed' >> destroy.log"
  }
}
```

## Functions & Expressions

**Common functions:**
```hcl
# String functions
upper("hello")                    # "HELLO"
lower("HELLO")                    # "hello"
trim("  hello  ")                 # "hello"
format("Hello, %s!", "World")     # "Hello, World!"
join("-", ["a", "b", "c"])        # "a-b-c"
split("-", "a-b-c")               # ["a", "b", "c"]

# Collection functions
length([1, 2, 3])                 # 3
contains(["a", "b"], "a")         # true
concat([1, 2], [3, 4])            # [1, 2, 3, 4]
merge({"a" = 1}, {"b" = 2})       # {"a" = 1, "b" = 2}
lookup({"a" = 1}, "a", 0)         # 1

# Numeric functions
max(1, 5, 3)                      # 5
min(1, 5, 3)                      # 1
ceil(1.5)                         # 2
floor(1.5)                        # 1

# Filesystem functions
file("path/to/file")              # Read file
filebase64("path/to/file")        # Base64 encode file
templatefile("path/to/template", vars)

# Date/Time functions
timestamp()                        # Current timestamp
formatdate("YYYY-MM-DD", timestamp())

# Type conversion
tostring(123)                     # "123"
tonumber("123")                   # 123
tolist(["a", "b"])                # List type
tomap({"a" = 1})                  # Map type
```

**Conditional expressions:**
```hcl
# Ternary operator
resource "aws_instance" "web" {
  instance_type = var.environment == "prod" ? "t3.large" : "t2.micro"
  
  monitoring = var.environment == "prod" ? true : false
}

# For expressions
locals {
  # Create list
  uppercase_names = [for name in var.names : upper(name)]
  
  # Create map
  instance_ips = {
    for instance in aws_instance.web : instance.id => instance.private_ip
  }
  
  # Filter
  prod_instances = [
    for instance in aws_instance.web : instance
    if instance.tags["Environment"] == "prod"
  ]
}
```

**Dynamic blocks:**
```hcl
resource "aws_security_group" "web" {
  name = "web-sg"

  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value.from_port
      to_port     = ingress.value.to_port
      protocol    = ingress.value.protocol
      cidr_blocks = ingress.value.cidr_blocks
    }
  }
}

# Variable
variable "ingress_rules" {
  type = list(object({
    from_port   = number
    to_port     = number
    protocol    = string
    cidr_blocks = list(string)
  }))
  default = [
    {
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    },
    {
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]
}
```

## Workspaces

**Manage workspaces:**
```bash
# List workspaces
terraform workspace list

# Create workspace
terraform workspace new dev

# Select workspace
terraform workspace select dev

# Show current workspace
terraform workspace show

# Delete workspace
terraform workspace delete dev
```

**Use workspaces:**
```hcl
resource "aws_instance" "web" {
  ami           = var.ami_id
  instance_type = terraform.workspace == "prod" ? "t3.large" : "t2.micro"

  tags = {
    Name        = "web-${terraform.workspace}"
    Environment = terraform.workspace
  }
}

# Workspace-specific variables
variable "instance_count" {
  type = map(number)
  default = {
    dev     = 1
    staging = 2
    prod    = 5
  }
}

resource "aws_instance" "app" {
  count         = var.instance_count[terraform.workspace]
  instance_type = "t2.micro"
}
```

## Best Practices

**Project structure:**
```
terraform-project/
├── main.tf              # Main resources
├── variables.tf         # Input variables
├── outputs.tf           # Output values
├── providers.tf         # Provider configuration
├── backend.tf           # Backend configuration
├── terraform.tfvars     # Variable values
├── versions.tf          # Version constraints
├── modules/             # Local modules
│   └── vpc/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
└── environments/        # Environment-specific configs
    ├── dev/
    │   └── terraform.tfvars
    ├── staging/
    │   └── terraform.tfvars
    └── prod/
        └── terraform.tfvars
```

**Version constraints:**
```hcl
# versions.tf
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.0"
    }
  }
}
```

**Naming conventions:**
```hcl
# Use descriptive names
resource "aws_instance" "web_server" { }  # Good
resource "aws_instance" "i" { }           # Bad

# Use consistent naming
resource "aws_vpc" "main" { }
resource "aws_subnet" "main_public" { }
resource "aws_subnet" "main_private" { }

# Use variables for common values
locals {
  name_prefix = "${var.project}-${var.environment}"
  
  common_tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
```

**Security:**
```hcl
# Never hardcode credentials
provider "aws" {
  region = var.region
  # Use environment variables or AWS profiles
  # Don't: access_key = "AKIAIOSFODNN7EXAMPLE"
}

# Mark sensitive outputs
output "db_password" {
  value     = aws_db_instance.main.password
  sensitive = true
}

# Use encrypted state
terraform {
  backend "s3" {
    bucket  = "terraform-state"
    key     = "prod/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true  # Enable encryption
  }
}
```

## Complete Example

**Full AWS infrastructure:**
```hcl
# providers.tf
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}

provider "aws" {
  region = var.region
}

# variables.tf
variable "region" {
  default = "us-east-1"
}

variable "environment" {
  default = "production"
}

variable "vpc_cidr" {
  default = "10.0.0.0/16"
}

# main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true

  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.environment}-public-${count.index + 1}"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.environment}-igw"
  }
}

resource "aws_security_group" "web" {
  name        = "${var.environment}-web-sg"
  description = "Security group for web servers"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web" {
  count                  = 2
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public[count.index].id
  vpc_security_group_ids = [aws_security_group.web.id]

  tags = {
    Name = "${var.environment}-web-${count.index + 1}"
  }
}

# data.tf
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }
}

# outputs.tf
output "vpc_id" {
  value = aws_vpc.main.id
}

output "web_instance_ips" {
  value = aws_instance.web[*].public_ip
}
```

## Troubleshooting

**Common issues:**
```bash
# Refresh state
terraform refresh

# Taint resource (force recreate)
terraform taint aws_instance.web

# Untaint resource
terraform untaint aws_instance.web

# Import existing resource
terraform import aws_instance.web i-1234567890abcdef0

# Debug output
TF_LOG=DEBUG terraform apply

# Lock issues
terraform force-unlock <LOCK_ID>

# Fix formatting
terraform fmt -recursive

# Validate configuration
terraform validate
```

## Quick Reference

**Essential commands:**
```bash
terraform init          # Initialize directory
terraform plan          # Preview changes
terraform apply         # Apply changes
terraform destroy       # Destroy infrastructure
terraform fmt           # Format code
terraform validate      # Validate syntax
terraform show          # Show state
terraform output        # Show outputs
terraform state list    # List resources
terraform workspace     # Manage workspaces
```

**Common options:**
```bash
-auto-approve           # Skip confirmation
-var="key=value"        # Set variable
-var-file="file.tfvars" # Use variable file
-target=resource        # Target specific resource
-out=plan.tfplan        # Save plan
-destroy                # Destroy mode
```

## Learning Resources

**Official Documentation:**
- [Terraform Docs](https://www.terraform.io/docs) - Complete documentation
- [Terraform Registry](https://registry.terraform.io/) - Public modules and providers
- [Configuration Language](https://www.terraform.io/language) - HCL reference

**Tutorials:**
- [HashiCorp Learn](https://learn.hashicorp.com/terraform) - Official tutorials
- [Terraform AWS Examples](https://github.com/hashicorp/terraform-provider-aws/tree/main/examples)

**Certifications:**
- [HashiCorp Certified: Terraform Associate](https://www.hashicorp.com/certification/terraform-associate)

**Community:**
- [Terraform Community Forum](https://discuss.hashicorp.com/c/terraform-core)
- [Stack Overflow terraform tag](https://stackoverflow.com/questions/tagged/terraform)
- [Terraform GitHub](https://github.com/hashicorp/terraform)
