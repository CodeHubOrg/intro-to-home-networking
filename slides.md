---
marp: true
title: Intro to Home Networking
description: A practical meetup deck on home networking and Pi-hole
theme: gaia
paginate: true
size: 16:9
---

# Intro to Home Networking

### Using Pi-hole to understand, control, and simplify your home network

CodeHub meetup deck

---

## What we will cover

- Home network basics and the pieces that matter
- Where Pi-hole fits in the stack
- DNS, DHCP, and device discovery in plain language
- A practical setup path you can repeat later
- A little extra security

---

## Home network architecture

```mermaid
graph TD
    Internet["🌐 Internet"]
    ISP["ISP/Modem"]
    Router["Router"]
    WiFi["Wi-Fi AP"]
    PiHole["🔒 Pi-hole<br/>(DNS Server)"]
    Devices["📱 Client Devices<br/>Phones, Laptops, Smart TV"]
    
    Internet -->|Connection| ISP
    ISP -->|LAN| Router
    Router -->|Ethernet| PiHole
    Router -->|Wi-Fi| WiFi
    WiFi -->|DHCP + DNS| Devices
    Devices -->|DNS Queries| PiHole
    PiHole -->|Block/Forward| Router
```

---

## DNS query flow with Pi-hole

```mermaid
sequenceDiagram
    participant Device as Device
    participant PiHole as Pi-hole
    participant Blocklist as Blocklist
    participant Upstream as Upstream DNS
    
    Device->>PiHole: DNS query for ads.example.com
    PiHole->>Blocklist: Check against lists
    alt Blocked Domain
        Blocklist-->>PiHole: ✗ In blocklist
        PiHole-->>Device: NXDOMAIN (blocked)
    else Allowed Domain
        Blocklist-->>PiHole: ✓ Not in list
        PiHole->>Upstream: Forward to 8.8.8.8
        Upstream-->>PiHole: IP address
        PiHole-->>Device: ✓ Return result
    end
```

---

## Demo: What we'll show

```mermaid
graph LR
    A["Query Log"] -->|Live traffic| B["Blocked Domains"]
    B -->|Ads, Trackers| C["Client Analysis"]
    C -->|Who requests what| D["Dashboard"]
    D -->|Stats & Config| E["Blocklists"]
```

**Live demo steps:**
1. Show network layout and device configuration
2. Open Pi-hole admin dashboard
3. Inspect recent queries in real-time
4. Highlight blocked vs allowed domains
5. Review performance impact and statistics

---

## Key takeaways

- **Visibility first**: Query logs show you what's happening on your network
- **DNS is powerful**: One DNS change affects all devices automatically
- **Block thoughtfully**: Start conservative, expand blocklists gradually
- **Learn & iterate**: Use Pi-hole as a learning tool, not just an ad blocker
- **Keep it simple**: Simple setups are easier to maintain and explain to others

---

## Questions?

Pi-hole docs: https://docs.pi-hole.net/

Thank you!
