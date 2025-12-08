resource "digitalocean_firewall" "guitar_tabs_fw" {
  name = "guitar-tabs-firewall"

  droplet_ids = [
    digitalocean_droplet.guitar_tabs.id
  ]

  dynamic "inbound_rule" {
    for_each = range(local.github_ips_chunks)

    content {
      protocol   = "tcp"
      port_range = "22"

      source_addresses = slice(
        local.github_actions_ipv4,
        inbound_rule.value * 1000,
        min((inbound_rule.value + 1) * 1000, length(local.github_actions_ipv4))
      )
    }
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["150.228.39.115"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "all"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "all"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

data "http" "github_meta" {
  url = "https://api.github.com/meta"
}

#Fetches Github Action runner IP addresses from Github meta API and removes the IPv6 addresses.
locals {
  all_github_actions_ips = jsondecode(data.http.github_meta.response_body).actions

  github_actions_ipv4 = [
    for cidr in local.all_github_actions_ips : cidr
    if can(regex("^\\d+\\.\\d+\\.\\d+\\.\\d+/", cidr))
  ]

  github_ips_chunks = ceil(length(local.github_actions_ipv4) / 1000)
}