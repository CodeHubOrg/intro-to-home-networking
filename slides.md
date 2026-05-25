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

---

## Home network map

- Internet connection
- Router or gateway
- Wi-Fi access point or mesh nodes
- Client devices
- Pi-hole as the DNS filter and visibility layer

---

## Pi-hole in practice

- Point clients or the router at Pi-hole for DNS
- Filter obvious ad and telemetry domains
- Use the query log to understand what devices are doing
- Keep the setup simple enough for the rest of the household

---

## Demo flow

- Show the network layout
- Open Pi-hole admin and inspect recent queries
- Explain what a blocked request looks like
- Call out any caveats before people copy the setup

---

## Wrap-up

- Start with visibility before adding complexity
- Keep DNS and DHCP decisions deliberate
- Use Pi-hole as a tool for learning, not just blocking ads
- Leave room for gradual improvement
